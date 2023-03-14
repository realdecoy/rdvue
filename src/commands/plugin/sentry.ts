import shell from 'shelljs';
import cli from 'cli-ux';
const util = require('util');
const exec = util.promisify(shell.exec);
import { Command, flags } from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import { Files } from '../../modules';
import { copyFiles, parseModuleConfig, updateDynamicImportsAndExports, readConfigFile, writeFile } from '../../lib/files';
import { checkProjectValidity, isJsonString, parseAuthorizationToken, parseOrganization } from '../../lib/utilities';
import { CLI_COMMANDS, CLI_STATE } from '../../lib/constants';

const TEMPLATE_FOLDERS = ['sentry'];
const CUSTOM_ERROR_CODES = [
  'project-invalid',
  'missing-template-file',
  'missing-template-folder',
  'dependency-install-error',
];

export default class Sentry extends Command {
  static description = 'application performance monitoring and error handling support';

  static flags = {
    help: flags.help({ char: 'h' }),
    forceProject: flags.string({ hidden: true }),
    skipInstall: flags.boolean({ hidden: true }),
  }

  static args = [
    { name: 'organization', description: 'organization of the project' },
    { name: 'project', description: 'project name of of the project' },
    { name: 'authorization token', description: 'Unique identifier that will used for connection to the sentry API' },
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
    const { flags, args } = this.parse(Sentry);
    let projectName = flags.forceProject;
    const skipInstallStep = flags.skipInstall === true;
    const hasProjectName = projectName !== undefined;
    const preInstallCommand = hasProjectName ? `cd ${projectName} &&` : '';

    const projectValidity = checkProjectValidity();
    const { isValid: isValidProject } = projectValidity;
    const projectRoot = path.join(process.cwd()).trim();

    if (!projectName) {
      const rootArray = projectRoot.split('\\');
      projectName = rootArray[rootArray.length - 1];
    }

    // block command unless being run within an rdvue project
    if (isValidProject === false && !hasProjectName) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `${CLI_COMMANDS.PluginSentry} command must be run in an existing ${chalk.yellow('rdvue')} project`,
        }),
      );
    }

    const folderList = TEMPLATE_FOLDERS;
    const organization = await parseOrganization(args);
    const authToken = await parseAuthorizationToken(args);

    // parse config files required for scaffolding this module
    const configs = parseModuleConfig(folderList, projectRoot);
    const config = configs[0];
    const files: Array<string | Files> = config.manifest.files;
    const dependencies = config.manifest.packages.dependencies.toString()
      .split(',')
      .join(' ');

    if (skipInstallStep === false) {
      try {
        // install dependencies
        cli.action.start(`${CLI_STATE.Info} installing sentry dependencies`);
        await exec(`${preInstallCommand} npm install --save ${dependencies} --legacy-peer-deps`, { silent: true });
        cli.action.stop();
      } catch (error) {
        throw new Error(
          JSON.stringify({
            code: 'dependency-install-error',
            message: `${this.id?.split(':')[1]} sentry dependencies failed to install`,
          }),
        );
      }
    } else {
      cli.action.start(`${CLI_STATE.Info} adding sentry dependencies`);
      await exec(`cd ${projectName} && npx add-dependencies ${dependencies} --legacy-peer-deps`, { silent: true });
      cli.action.stop();
    }

    const sourceDirectory: string = path.join(config.moduleTemplatePath, config.manifest.sourceDirectory);
    const installDirectory: string = path.join(projectRoot, 'src/core', config.manifest.installDirectory);

    // copy and update files for plugin being added
    await copyFiles(sourceDirectory, installDirectory, files);

    // update imports
    updateDynamicImportsAndExports(projectRoot, `core/${config.manifest.installDirectory}`, config.manifest.moduleImports, 'index.ts');

    // update app.json file
    const appConfigurationLocation = path.join(projectRoot, 'app.json');
    const appConfiguration = readConfigFile(appConfigurationLocation, 'app.json file is not found.');

    if (appConfiguration.expo.plugins !== undefined && typeof appConfiguration.expo.plugins === 'object')  {
      appConfiguration.expo.plugins.push('sentry-expo');
    } else {
      appConfiguration.expo.plugins = ['sentry-expo'];
    }

    const expoPostPublishConfiguration = {
      file: 'sentry-expo/upload-sourcemaps',
      config: {
        project: projectName,
        organization,
        authToken,
      },
    };

    if (appConfiguration.expo.hooks !== undefined && appConfiguration.expo.hooks !== null) {
      if (appConfiguration.expo.hooks.postPublish !== undefined && typeof appConfiguration.expo.hooks.postPublish === 'object') {
        appConfiguration.expo.hooks.postPublish.push(expoPostPublishConfiguration);
      } else {
        appConfiguration.expo.hooks.postPublish = [expoPostPublishConfiguration];
      }
    } else {
      appConfiguration.expo.hooks = {
        postPublish: [expoPostPublishConfiguration],
      };
    }

    // write config file
    await writeFile(appConfigurationLocation, JSON.stringify(appConfiguration));

    if (skipInstallStep === false) {
      this.log(`${CLI_STATE.Success} plugin added: ${this.id?.split(':')[1]}`);
    }
  }
}
