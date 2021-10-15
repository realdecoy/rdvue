import shell from 'shelljs';
import cli from 'cli-ux';
const util = require('util');
const exec = util.promisify(shell.exec);
import { Command, flags } from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import { Files } from '../../modules';
import { copyFiles, inject, parseModuleConfig, updateDynamicImportsAndExports } from '../../lib/files';
import { checkProjectValidity, isJsonString } from '../../lib/utilities';
import { CLI_COMMANDS, CLI_STATE, COMMON_CUSTOM_ERROR_CODES } from '../../lib/constants';
import { injectImportsIntoMain } from '../../lib/plugins';
import { Route } from '../../modules/manifest';

const TEMPLATE_FOLDERS = ['rd-buefy'];
const TEMPLATE_MIN_VERSION_SUPPORTED = 2;
const CUSTOM_ERROR_CODES = [
	...COMMON_CUSTOM_ERROR_CODES
];

export default class RdBuefy extends Command {
	static description = 'lightweigth UI components for Vuejs based on Buefy component library'

	static flags = {
		help: flags.help({ char: 'h' }),
		forceProject: flags.string({ hidden: true }),
		skipInstall: flags.boolean({ hidden: true }),
	}

	static args = []

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
		const { flags } = this.parse(RdBuefy);
		const projectName = flags.forceProject;
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
				cli.action.start(`${CLI_STATE.Info} installing rd-buefy dependencies`);
				await exec(`${preInstallCommand} npm install --save ${dependencies}`, { silent: true });
				cli.action.stop();
			} catch (error) {
				throw new Error(
					JSON.stringify({
						code: 'dependency-install-error',
						message: `${this.id?.split(':')[1]} dependencies failed to install`,
					}),
				);
			}
		} else {
			cli.action.start(`${CLI_STATE.Info} adding buefy dependencies`);
			await exec(`cd ${projectName} && npx add-dependencies ${dependencies}`, { silent: true });
			cli.action.stop();
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
				.replace(/[\\]+"/g, '"')      // remove extra escaping slashes from escaped double quotes
				.replace(/^\s*\[\n/, '')      // remove the array notation from the start of the string
				.replace(/\s*\]$/, '')        // remove the array notation from the end of the string
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
		updateDynamicImportsAndExports(projectRoot, 'theme', config.manifest.projectTheme, '_all.scss');
		updateDynamicImportsAndExports(projectRoot, 'modules/core', config.manifest.moduleImports, 'index.ts');
		if (config.manifest.version >= TEMPLATE_MIN_VERSION_SUPPORTED) {
			const { imports: mainImports } = config.manifest.main;
			injectImportsIntoMain(projectRoot, mainImports);
		}

		if (skipInstallStep === false) {
			this.log(`${CLI_STATE.Success} plugin added: ${this.id?.split(':')[1]}`);
		}
	}
}