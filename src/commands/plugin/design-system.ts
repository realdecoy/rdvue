/* eslint-disable indent */
import shell from 'shelljs';
import cli from 'cli-ux';
const util = require('util');
const exec = util.promisify(shell.exec);
import { Command, flags } from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import { parseModuleConfig } from '../../lib/files';
import { checkProjectValidity, isJsonString } from '../../lib/utilities';
import { CLI_COMMANDS, CLI_STATE, COMMON_CUSTOM_ERROR_CODES } from '../../lib/constants';

const TEMPLATE_FOLDERS = ['design-system'];
const CUSTOM_ERROR_CODES = [
	...COMMON_CUSTOM_ERROR_CODES,
];

export default class DesignSystem extends Command {
	static description = 'design system modeled off buefy component libary'

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
		const { flags } = this.parse(DesignSystem);
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
					message: `${CLI_COMMANDS.PluginDesignSystem} command must be run in an existing ${chalk.yellow('rdvue')} project`,
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
		const dependencies = config.manifest.packages.dependencies.toString()
			.split(',')
			.join(' ');

		if (skipInstallStep === false) {
			try {
				// install dependencies
				cli.action.start(`${CLI_STATE.Info} installing design-system dependencies`);
				await exec(`${preInstallCommand} npm install --save ${dependencies}`, { silent: false });
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
			// add dependencies
			cli.action.start(`${CLI_STATE.Info} adding design-system dependencies`);
			await exec(`cd ${projectName} && npx add-dependencies ${dependencies}`, { silent: true });
			cli.action.stop();
		}

		if (skipInstallStep === false) {
			this.log(`${CLI_STATE.Success} plugin added: ${this.id?.split(':')[1]}`);
		}
	}
}
