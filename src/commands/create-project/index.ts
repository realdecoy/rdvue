import shell from 'shelljs';
import chalk from 'chalk';
import { Command, flags } from '@oclif/command';
import Buefy from '../plugin/buefy';
import Localization from '../plugin/localization';
import Vuetify from '../plugin/vuetify';
import { toKebabCase, parseProjectName, isJsonString, checkProjectValidity, parseProjectPresets, toPascalCase, parseBundleIdentifier } from '../../lib/utilities';
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
  MOBILE_TEMPLATE_REPLACEMENT_FILES,
  MOBILE_TEMPLATE_REPO,
  MOBILE_TEMPLATE_CI_CD_REPLACEMENT_FILES,
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
    withBuefy: flags.boolean({ hidden: true }),
    withLocalization: flags.boolean({ hidden: true }),
    withVuetify: flags.boolean({ hidden: true }),
    mobile: flags.boolean({ hidden: true }),
    withDesignSystem: flags.boolean({ hidden: true }),
  }

  static args = [
    { name: 'name', description: 'name of created project' },
    { name: 'preset', description: 'name of plugin preset' },
    { name: 'bundleIdenifier', description: 'The name of the unique identifier that will used for deployment to the App & Google play Store (eg. com.company.app)' },
  ]

  // override Command class error handler
  catch(error: Error): Promise<any> {
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
    const isMobile = flags.mobile === true;
    const template: string = isMobile ? MOBILE_TEMPLATE_REPO : TEMPLATE_REPO;
    const designTemplate: string = DESIGN_TEMPLATE_REPO;
    const designTemplateFolder: string = DESIGN_TEMPLATE_FOLDER;
    const tag: string = TEMPLATE_TAG;
    const replaceRegex = TEMPLATE_PROJECT_NAME_REGEX;
    const skipPresetsStep = flags.skipPresets === true || isMobile;
    const withBuefy = flags.withBuefy === true;
    const withVuetify = flags.withVuetify === true;
    const withLocalization = flags.withLocalization === true;
    const withDesignSystem = flags.withDesignSystem === true;

    let filesToReplace = isMobile ? MOBILE_TEMPLATE_REPLACEMENT_FILES : TEMPLATE_REPLACEMENT_FILES;

    let projectName: string = '';
    let bundleIdenifier: string;
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

    if (isMobile) {
      bundleIdenifier = await parseBundleIdentifier(args);
    }

    // retrieve project preset
    // on skip preset flag set presetName to skip presets
    presetName = skipPresetsStep ? PLUGIN_PRESET_LIST[2] : await parseProjectPresets(args);
    // convert project name to kebab case
    const kebabProjectName = toKebabCase(projectName);
    // verify that project folder doesnt already exist
    checkIfFolderExists(kebabProjectName);

    // update files to be replaced with project name reference
    filesToReplace = filesToReplace.map(p => `${kebabProjectName}/${p}`);

    this.log(`${CLI_STATE.Info} creating ${isMobile ? 'mobile' : ''} project ${chalk.whiteBright(kebabProjectName)}`);

    // retrieve project files from template source
    await shell.exec(`git clone ${template} --depth 1 --branch ${tag} ${kebabProjectName}`, { silent: true });
    // remove git folder reference to base project
    await shell.exec(`npx rimraf ${kebabProjectName}/.git`);
    // find and replace project name references
    const success = await replaceInFiles(filesToReplace, replaceRegex, `${kebabProjectName}`);

    const presetIndex = PLUGIN_PRESET_LIST.indexOf(presetName);
    const shouldInstallDesignSystem = withDesignSystem === true; 
    let shouldInstallBuefy = presetIndex === 0 || withBuefy === true;
    let shouldInstallVuetify = presetIndex === 1 || withVuetify === true;
    let shouldInstallLocalization = presetIndex === 0 || presetIndex === 1 || withLocalization === true;

    if (isMobile) {
      MOBILE_TEMPLATE_CI_CD_REPLACEMENT_FILES
        .map(file => `${kebabProjectName}/${file}`)
        .forEach(async file => {
          await replaceInFiles(file, /__PROJECT_SCHEME__/g, toPascalCase(projectName));
          await replaceInFiles(file, /__BUNDLE_IDENTIFIER__/g, bundleIdenifier.toLowerCase());
        });

      shouldInstallBuefy = false;
      shouldInstallVuetify = false;
      shouldInstallLocalization = false;
    }

    if (success === false) {
      throw new Error(
        JSON.stringify({
          code: 'file-not-changed',
          message: 'updating your project failed',
        }),
      );
    } else {
      if (shouldInstallBuefy === true) { // buefy
        await Buefy.run(['--forceProject', kebabProjectName, '--skipInstall']);
      }
      if (shouldInstallVuetify) { // Vuetify
        await Vuetify.run(['--forceProject', kebabProjectName, '--skipInstall']);
      }
      if (shouldInstallLocalization === true) { // localization
        await Localization.run(['--forceProject', kebabProjectName, '--skipInstall']);
      }
    }

    if (shouldInstallDesignSystem === true) {
      // retrieve project files from template source
      await shell.exec(`git clone ${designTemplate} --depth 1 --branch ${tag} ${projectName}/${designTemplateFolder}`, { silent: true });
      // remove git folder reference to base project
      await shell.exec(`npx rimraf ${projectName}/${designTemplateFolder}/.git`);
    }

    // initialize git in the created project
    await shell.exec(`cd ${kebabProjectName} && git init && git add . && git commit -m "Setup: first commit" && git branch -M main`, { silent: true });

    this.log(`${CLI_STATE.Success} ${chalk.whiteBright(kebabProjectName)} is ready!`);

    // Output final instructions to user
    this.log(`\nNext Steps:\n${chalk.magenta('-')} cd ${chalk.whiteBright(kebabProjectName)}\n${chalk.magenta('-')} npm install\n${chalk.magenta('-')} ${isMobile ? 'npm run android | ios' : 'npm run serve'}`);
  }
}
