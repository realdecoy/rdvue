import {Command, flags} from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import {Files} from '../../modules';
import {copyFiles, parseModuleConfig, readAndUpdateFeatureFiles, replaceTargetFileNames} from '../../lib/files';
import {checkProjectValidity, parsePageName, toKebabCase, toPascalCase, isJsonString} from '../../lib/utilities';
import { CLI_COMMANDS, CLI_STATE, DOCUMENTATION_LINKS } from '../../lib/constants';

const TEMPLATE_FOLDERS = ['page'];
export default class Page extends Command {
  static description = 'add a new Page module.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'name', description: 'name of new page'},
  ]

  // override Command class error handler
  async catch (error: Error) {
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
    switch (customErrorCode) {
      case 'project-invalid': this.log(`${CLI_STATE.Error} ${customErrorMessage}`);
        break;
      case 'failed-match-and-replace': this.log(`${CLI_STATE.Error} ${customErrorMessage}`);
        break;
      case 'missing-template-file': this.log(`${CLI_STATE.Error} ${customErrorMessage}`);
        break;
      case 'missing-template-folder': this.log(`${CLI_STATE.Error} ${customErrorMessage}`);
        break;
      default: throw new Error(customErrorMessage);
    }

    // exit with status code
    // this.exit(1)
  }

  async run () {
    const {isValid: isValidProject, projectRoot} = checkProjectValidity();
    // block command unless being run within an rdvue project
    if (isValidProject === false) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `${CLI_COMMANDS.AddPage} command must be run in an existing ${chalk.yellow('rdvue')} project`,
        })
      );
    }

    const {args} = this.parse(Page);
    const folderList = TEMPLATE_FOLDERS;
    let sourceDirectory: string;
    let installDirectory: string;

    // parse config files required for scaffolding this module
    const configs = parseModuleConfig(folderList, projectRoot);

    // retrieve page name
    const pageName = await parsePageName(args);
    // parse kebab and pascal case of pageName
    const pageNameKebab = toKebabCase(pageName);
    const pageNamePascal = toPascalCase(pageName);

    configs.forEach(async config => {
      const files: Array<string | Files> = config.manifest.files;
      // replace file names in config with kebab case equivalent
      replaceTargetFileNames(files, pageNameKebab);
      sourceDirectory = path.join(config.moduleTemplatePath, config.manifest.sourceDirectory);
      installDirectory = path.join(projectRoot, 'src', config.manifest.installDirectory, pageNameKebab);

      // copy and update files for page being added
      await copyFiles(sourceDirectory, installDirectory, files);
      await readAndUpdateFeatureFiles(installDirectory, files, pageNameKebab, pageNamePascal);
    });

    this.log(`${CLI_STATE.Success} page added: ${pageNameKebab}`);
    this.log(`\n  Visit the documentation page for more info:\n  ${chalk.blueBright(DOCUMENTATION_LINKS.Page)}\n`);
  }
}
