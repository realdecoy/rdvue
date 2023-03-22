// eslint-disable-next-line unicorn/import-style, unicorn/prefer-module
const util = require('util');
// eslint-disable-next-line unicorn/prefer-module
const chalk = require('chalk');
// eslint-disable-next-line unicorn/prefer-module
const shell = require('shelljs');
const exec = util.promisify(shell.exec);
import path from 'node:path';
import { Command, Flags, ux } from '@oclif/core';
import { Files } from '../../modules';
import { Route } from '../../modules/manifest';
import { injectImportsIntoMain } from '../../lib/plugins';
import { CLI_COMMANDS, CLI_STATE } from '../../lib/constants';
import { checkProjectValidity, isJsonString } from '../../lib/utilities';
import { copyFiles, inject, parseModuleConfig, updateDynamicImportsAndExports } from '../../lib/files';

const TEMPLATE_FOLDERS = ['buefy'];
const TEMPLATE_MIN_VERSION_SUPPORTED = 2;
const CUSTOM_ERROR_CODES = new Set([
  'project-invalid',
  'missing-template-file',
  'missing-template-folder',
  'dependency-install-error',
]);

export default class Buefy extends Command {
  static description = 'lightweigth UI components for Vuejs'

  static flags = {
    help: Flags.help({ char: 'h' }),
    isTest: Flags.boolean({ hidden: true }),
    forceProject: Flags.string({ hidden: true }),
    skipInstall: Flags.boolean({ hidden: true }),
  }

  static args = {}

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
    if (CUSTOM_ERROR_CODES.has(customErrorCode)) {
      this.log(`${CLI_STATE.Error} ${customErrorMessage}`);
    } else {
      throw new Error(customErrorMessage);
    }

    return Promise.resolve();
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Buefy);
    const projectName = flags.forceProject;
    const isTest = flags.isTest === true;
    const skipInstallStep = flags.skipInstall === true;
    const hasProjectName = projectName !== undefined;
    const preInstallCommand = hasProjectName ? `cd ${projectName} &&` : '';

    const projectValidity = checkProjectValidity();
    const { isValid: isValidProject } = projectValidity;
    let { projectRoot } = projectValidity;

    // block command unless being run within an rdvue project
    if (isValidProject === false && !hasProjectName) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `${CLI_COMMANDS.PluginBuefy} command must be run in an existing ${chalk.yellow('rdvue')} project`,
        }),
      );
    } else if (hasProjectName) {
      const dir = path.join(process.cwd(), projectName ?? '');
      projectRoot = dir.trim();
    }

    const folderList = TEMPLATE_FOLDERS;

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
        if (isTest !== true) {
          ux.action.start(`${CLI_STATE.Info} installing buefy dependencies`);
        }

        await exec(`${preInstallCommand} npm install --save --legacy-peer-deps ${dependencies}`, { silent: true });

        if (isTest !== true) {
          ux.action.stop();
        }
      } catch {
        this.error(
          JSON.stringify({
            code: 'dependency-install-error',
            message: `${this.id?.split(':')[1]} dependencies failed to install`,
          }),
        );
      }
    } else {
      if (isTest !== true) {
        ux.action.start(`${CLI_STATE.Info} adding buefy dependencies`);
      }

      await exec(`cd ${projectName} && npx add-dependencies ${dependencies}`, { silent: true });

      if (isTest !== true) {
        ux.action.stop();
      }
    }

    const sourceDirectory: string = path.join(config.moduleTemplatePath, config.manifest.sourceDirectory);
    const installDirectory: string = path.join(projectRoot, 'src', config.manifest.installDirectory);
    const routePath: string = path.join(projectRoot, 'src', 'config', 'router.ts');

    // copy and update files for plugin being added
    await copyFiles(sourceDirectory, installDirectory, files);
    const { routes }: { routes: Array<Route> } = config.manifest;
    if (routes && routes.length > 0) {
      const formattedContent: string = JSON.stringify(routes, null, 2)
        .replace(/(?<!\\)"/g, '')     // remove escaped quotes added by JSON.stringify
        .replace(/\\+"/g, '"')      // remove extra escaping slashes from escaped double quotes
        .replace(/^\s*\[\n/, '')      // remove the array notation from the start of the string
        .replace(/\s*]$/, '')        // remove the array notation from the end of the string
        .replace(/^(\s*)/gm, '$1  '); // add extra spaces to align injected code with existing code
      const content = `${formattedContent},`;
      inject(routePath, content, {
        index: (lines, file) => {
          const index = lines.findIndex(line => line.trim().startsWith('routes: ['));
          if (index < 0) {
            throw new Error(`Could not find routes in ${file}`);
          }

          return index + 1;
        },
      });
    }

    const { manifest } = config;
    const { projectTheme, version, main, moduleImports } = manifest;
    updateDynamicImportsAndExports(projectRoot, 'theme', projectTheme, '_all.scss');
    updateDynamicImportsAndExports(projectRoot, 'modules/core', moduleImports, 'index.ts');
    if (version >= TEMPLATE_MIN_VERSION_SUPPORTED) {
      const { imports: mainImports } = main;
      injectImportsIntoMain(projectRoot, mainImports);
    }

    if (skipInstallStep === false) {
      this.log(`${CLI_STATE.Success} plugin added: ${this.id?.split(':')[1]}`);
    }
  }
}
