import shell from 'shelljs';
import chalk from 'chalk';
import { Command, flags } from '@oclif/command';
import Localization from '../plugin/localization';
import { toKebabCase, parseProjectName, isJsonString, checkProjectValidity, parseProjectPresets } from '../../lib/utilities';
import { replaceInFiles, checkIfFolderExists } from '../../lib/files';
import {
  TEMPLATE_REPO,
  DESIGN_TEMPLATE_REPO,
  DESIGN_TEMPLATE_FOLDER,
  TEMPLATE_TAG,
  TEMPLATE_PROJECT_NAME_REGEX,
  TEMPLATE_REPLACEMENT_FILES,
  CLI_STATE,
  PLUGIN_PRESET_LIST,
} from '../../lib/constants';

const CUSTOM_ERROR_CODES = [
  'existing-project',
  'existing-folder',
  'file-not-changed',
];

export default class CreateProject extends Command {
  static description = 'create a new rdvue project'

  static flags = {
    help: flags.help({ char: 'h' }),
    skipPresets: flags.boolean({ hidden: true }),
    withLocalization: flags.boolean({ hidden: true }),
    withDesignSystem: flags.boolean({ hidden: true }),
  }

  static args = [
    { name: 'name', description: 'name of created project' },
    { name: 'preset', description: 'name of plugin preset' },
  ]

  // override Command class error handler
  catch(error: Error): Promise<any> {
    console.log(error);
    const errorMessage = error.message;
    const isValidJSON = isJsonString(errorMessage);
    const parsedError = isValidJSON ? JSON.parse(errorMessage) : {};
    const customErrorCode = parsedError.code;
    const customErrorMessage = parsedError.message;
    const hasCustomErrorCode = customErrorCode !== undefined;

    if (!hasCustomErrorCode) {
      // throw cli errors to be handled globally
      throw errorMessage;
    }

    // handle errors thrown with known error codes
    if (CUSTOM_ERROR_CODES.includes(customErrorCode)) {
      this.log(`${CLI_STATE.Error} ${customErrorMessage}`);
    } else {
      throw new Error(customErrorMessage);
    }

    return Promise.resolve();
  }

  async run(): Promise<void> {
    const { args, flags } = this.parse(CreateProject);
    const template: string = TEMPLATE_REPO;
    const designTemplate: string = DESIGN_TEMPLATE_REPO;
    const designTemplateFolder: string = DESIGN_TEMPLATE_FOLDER;
    const tag: string = TEMPLATE_TAG;
    const replaceRegex = TEMPLATE_PROJECT_NAME_REGEX;
    const skipPresetsStep = flags.skipPresets === true;
    const withLocalization = flags.withLocalization === true;
    const withDesignSystem = flags.withDesignSystem === true;

    let filesToReplace = TEMPLATE_REPLACEMENT_FILES;
    let projectName: string;
    let presetName: string = '';
    const { isValid: isValidProject } = checkProjectValidity();
    // block command if being run within an rdvue project
    if (isValidProject) {
      throw new Error(
        JSON.stringify({
          code: 'existing-project',
          message: `you are already in an existing ${chalk.yellow('rdvue')} project`,
        }),
      );
    }

    // retrieve project name
    projectName = await parseProjectName(args);
    // retrieve project preset
    // on skip preset flag set presetName to skip presets
    presetName = skipPresetsStep ? PLUGIN_PRESET_LIST[2] : await parseProjectPresets(args);
    // convert project name to kebab case
    projectName = toKebabCase(projectName);
    // verify that project folder doesnt already exist
    checkIfFolderExists(projectName);

    // update files to be replaced with project name reference
    filesToReplace = filesToReplace.map(p => `${projectName}/${p}`);

    this.log(`${CLI_STATE.Info} creating project ${chalk.whiteBright(projectName)}`);

    // retrieve project files from template source
    await shell.exec(`git clone ${template} --depth 1 --branch ${tag} ${projectName}`, { silent: true });
    // remove git folder reference to base project
    await shell.exec(`npx rimraf ${projectName}/.git`);
    // find and replace project name references
    const success = await replaceInFiles(filesToReplace, replaceRegex, `${projectName}`);

    const presetIndex = PLUGIN_PRESET_LIST.indexOf(presetName);
    const shouldInstallLocalization = presetIndex === 0 || presetIndex === 1 || withLocalization === true;
    const shouldInstallDesignSystem = withDesignSystem === true;

    if (success === false) {
      throw new Error(
        JSON.stringify({
          code: 'file-not-changed',
          message: 'updating your project failed',
        }),
      );
    } else if (shouldInstallLocalization === true) { // localization
      await Localization.run(['--forceProject', projectName, '--skipInstall']);
    }

    if (shouldInstallDesignSystem === true) {
      // retrieve project files from template source
      await shell.exec(`git clone ${designTemplate} --depth 1 --branch ${tag} ${projectName}/${designTemplateFolder}`, { silent: true });
      // remove git folder reference to base project
      await shell.exec(`npx rimraf ${projectName}/${designTemplateFolder}/.git`);
    }

    // initialize git in the created project
    await shell.exec(`cd ${projectName} && git init && git add . && git commit -m "Setup: first commit" && git branch -M main`, { silent: true });

    this.log(`${CLI_STATE.Success} ${chalk.whiteBright(projectName)} is ready!`);

    // Output final instructions to user
    this.log(`\nNext Steps:\n${chalk.magenta('-')} cd ${chalk.whiteBright(projectName)}\n${chalk.magenta('-')} npm install\n${chalk.magenta('-')} npm run serve`);
  }
}
