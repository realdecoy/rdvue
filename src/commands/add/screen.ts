import { Command, flags } from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import { Files } from '../../modules';
import { copyFiles, parseModuleConfig, readAndUpdateFeatureFiles, replaceTargetFileNames } from '../../lib/files';
import { checkProjectValidity, parseScreenName, toKebabCase, toPascalCase, isJsonString } from '../../lib/utilities';
import { CLI_COMMANDS, CLI_STATE, DOCUMENTATION_LINKS } from '../../lib/constants';

const TEMPLATE_FOLDERS = ['screen'];
const CUSTOM_ERROR_CODES = [
  'project-invalid',
  'failed-match-and-replace',
  'missing-template-file',
  'missing-template-folder',
];

export default class Screen extends Command {
  static description = 'add a new Screen module.'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [
    { name: 'name', description: 'name of new screen' },
  ]

  // override Command class error handler
  catch(error: Error): Promise<any> {
    const errorMessage = error.message;
    const isValidJSON = isJsonString(errorMessage);
    const parsedError = isValidJSON ? JSON.parse(errorMessage) : {};
    const customErrorCode = parsedError.code;
    const customErrorMessage = parsedError.message;
    const hasCustomErrorCode = customErrorCode !== undefined;

    if (hasCustomErrorCode === false) {
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
    this.log(`\n  Test:\n  ${chalk.yellow(DOCUMENTATION_LINKS.Screen)}\n`);
    const { isValid: isValidProject, projectRoot } = checkProjectValidity();
    // block command unless being run within an rdvue project
    if (isValidProject === false) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `${CLI_COMMANDS.AddScreen} command must be run in an existing ${chalk.yellow('rdvue')} project`,
        }),
      );
    }

    const { args } = this.parse(Screen);
    const folderList = TEMPLATE_FOLDERS;
    let sourceDirectory: string;
    let installDirectory: string;

    // parse config files required for scaffolding this module
    const configs = parseModuleConfig(folderList, projectRoot);

    // retrieve screen name
    const screenName = await parseScreenName(args);
    // parse kebab and pascal case of screenName
    const screenNameKebab = toKebabCase(screenName);
    const screenNamePascal = toPascalCase(screenName);

    configs.forEach(async config => {
      const files: Array<string | Files> = config.manifest.files;
      // replace file names in config with kebab case equivalent
      replaceTargetFileNames(files, screenNameKebab);
      sourceDirectory = path.join(config.moduleTemplatePath, config.manifest.sourceDirectory);
      installDirectory = path.join(projectRoot, 'src', config.manifest.installDirectory, screenNameKebab);
      // copy and update files for screen being added
      await copyFiles(sourceDirectory, installDirectory, files);
      await readAndUpdateFeatureFiles(installDirectory, files, screenNameKebab, screenNamePascal);
    });

    this.log(`${CLI_STATE.Success} screen added: ${screenNameKebab}`);
    this.log(`\n  Visit the documentation page for more info:\n  ${chalk.yellow(DOCUMENTATION_LINKS.Screen)}\n`);
  }
}
