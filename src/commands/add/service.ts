import { Command, flags } from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import { Files } from '../../modules';
import { copyFiles, parseModuleConfig, readAndUpdateFeatureFiles, replaceTargetFileNames } from '../../lib/files';
import { checkProjectValidity, parseServiceName, toKebabCase, toPascalCase, isJsonString } from '../../lib/utilities';
import { CLI_COMMANDS, CLI_STATE, DOCUMENTATION_LINKS } from '../../lib/constants';

const TEMPLATE_FOLDERS = ['service'];
export default class Service extends Command {
  static description = 'add a new Service module.'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [
    { name: 'name', description: 'name of new service' },
  ]

  // override Command class error handler
  // eslint-disable-next-line require-await
  async catch(error: Error): Promise<any> {
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
      default: throw new Error(customErrorMessage);
    }

    // exit with status code
    // this.exit(1)
  }

  async run(): Promise<void> {
    const { isValid: isValidProject, projectRoot } = checkProjectValidity();
    // block command unless being run within an rdvue project
    if (isValidProject === false) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `${CLI_COMMANDS.AddService} command must be run in an existing ${chalk.yellow('rdvue')} project`,
        }),
      );
    }

    const { args } = this.parse(Service);
    const folderList = TEMPLATE_FOLDERS;
    let sourceDirectory: string;
    let installDirectory: string;

    // parse config files required for scaffolding this module
    const configs = parseModuleConfig(folderList, projectRoot);

    // retrieve service name
    const serviceName = await parseServiceName(args);
    // parse kebab and pascal case of serviceName
    const serviceNameKebab = toKebabCase(serviceName);
    const serviceNamePascal = toPascalCase(serviceName);

    configs.forEach(async config => {
      const files: Array<string | Files> = config.manifest.files;
      // replace file names in config with kebab case equivalent
      replaceTargetFileNames(files, serviceNameKebab);
      sourceDirectory = path.join(config.moduleTemplatePath, config.manifest.sourceDirectory);
      installDirectory = path.join(projectRoot, 'src', config.manifest.installDirectory);

      // copy and update files for service being added
      await copyFiles(sourceDirectory, installDirectory, files);
      await readAndUpdateFeatureFiles(installDirectory, files, serviceNameKebab, serviceNamePascal);
    });

    this.log(`${CLI_STATE.Success} service added: ${serviceNameKebab}`);
    this.log(`\n  Visit the documentation page for more info:\n  ${chalk.yellow(DOCUMENTATION_LINKS.Service)}\n`);
  }
}
