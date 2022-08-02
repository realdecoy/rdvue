import { Command, flags } from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import { Files } from '../../modules';
import { copyFiles, parseModuleConfig, readAndUpdateFeatureFiles, replaceInFiles, replaceTargetFileNames } from '../../lib/files';
import { checkProjectValidity, parseComponentName, toKebabCase, toPascalCase, isJsonString, parseBitriseAuthorizationKey, parseGitProviderUrl, sendRequest, RequestMethod, getProjectConfig, parseBundleIdentifier, parseProjectScheme } from '../../lib/utilities';
import { BITRISE_CONFIGS, CLI_COMMANDS, CLI_STATE, DOCUMENTATION_LINKS, REQUEST_TIMEOUT_MILLISECONDS } from '../../lib/constants';
import Axios from 'axios';

const GitUrlParse = require("git-url-parse");

const TEMPLATE_FOLDERS = ['cicd'];
const CUSTOM_ERROR_CODES = [
  'project-invalid',
  'failed-match-and-replace',
  'invalid-git-url',
  'missing-template-file',
  'missing-template-folder',
];


export const MOBILE_TEMPLATE_CONFIG_REPLACEMENT_FILES = [
  'bitrise.yml',
  'app.json',
];

export default class CICD extends Command {
  static description = 'add a new CI/CD workflow.'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [
    // { name: 'name', description: 'name of new CI/CD worklow' },
    // { name: 'bundleIdenifier', description: 'The name of the unique identifier that will used for deployment to the App & Google play Store (eg. com.company.app)' },
    // { name: 'scheme', description: 'The name of the Scheme for the iOS project' },
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

    this.log(`${CLI_STATE.Success} starting`);

    const { isValid: isValidProject, projectRoot } = checkProjectValidity();
    const projectConfig = getProjectConfig();
    
    // block command unless being run within an rdvue project
    if (isValidProject === false || !projectConfig.isMobile) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `${CLI_COMMANDS.AddComponent} command must be run in an existing ${chalk.yellow('rdvue')} mobile project`,
        }),
      );
    }

    const { args } = this.parse(CICD);
    const folderList = TEMPLATE_FOLDERS;
    let sourceDirectory: string;
    let installDirectory: string;
    let filesToReplace = projectConfig.isMobile ? MOBILE_TEMPLATE_CONFIG_REPLACEMENT_FILES : [];

    // parse config files required for scaffolding this module
    const configs = parseModuleConfig(folderList, projectRoot);

    // TDOD:
    // 1. Get bitrise API Key to create application (V9FH5aH0JB2WYoLAFz9sbAjwagxGC1bRTWY7_D_LiTdzHXXB9xcwVoWtGrzJxkqzAusJZdBaovcw_4QjuuO3Og)
    // 2. Register App
    //    a. get git_owner 
    //    a. get git_repo_slug 
    //    a. get provider 
    //    a. get repo_url 
    // 3. upload SSH 
    // 4. Finish registration

    const authKey = await parseBitriseAuthorizationKey(args);
    const gitProviderUrl = await parseGitProviderUrl(args);


    if (typeof gitProviderUrl !== 'string') {
      throw new Error(
        JSON.stringify({
          code: 'invalid-git-url',
          message: `${CLI_COMMANDS.AddCICD} command failed. Provide a valid Git URL`,
        }),
      );
    }

    const parsedGitURL = GitUrlParse(gitProviderUrl);
    const owner = parsedGitURL.owner;
    const repoSlug = `${parsedGitURL.name}.git`;
    const provider = parsedGitURL.source.replace(".com", "");

    const axiosInstance = Axios.create({
      timeout: REQUEST_TIMEOUT_MILLISECONDS,
      headers: {
        "Content-Type": "application/json",
        Authorization: authKey,
      },
      baseURL: BITRISE_CONFIGS.baseURL,
    });


    // Sending Request to resiter app in bitrise
    const dataRegisterData = {
      git_owner: owner,
      git_repo_slug: repoSlug,
      is_public: false,
      provider: provider,
      repo_url: gitProviderUrl,
      type: "git"
    }
    
    let returnedSlug = "";

    try {
      const reisgterAppResponse = await sendRequest(RequestMethod.Post, '/apps/register', axiosInstance, dataRegisterData);
      returnedSlug = reisgterAppResponse?.data.slug;
    } catch (error) {
      throw new Error(
        JSON.stringify({
          code: 'bitrise-app-register-failed',
          message: `An error occured when we attempted to register bitrise app for ${CLI_COMMANDS.AddCICD} command.`,
        }),
      );
    }
    

    if (!returnedSlug) {
      throw new Error(
        JSON.stringify({
          code: 'bitrise-app-register-failed',
          message: `Invalid identifier returned when registering app in bitrise ${CLI_COMMANDS.AddCICD} command.`,
        }),
      );
    }



    // Upload Bitrise.yml File
    try {
      const uploadResponse = await sendRequest(RequestMethod.Post, `/apps/${returnedSlug}/bitrise.yml`, axiosInstance);
    } catch (error) {
      throw new Error(
        JSON.stringify({
          code: 'bitrise-yml-upload-failed',
          message: `An error occured when we attempted to upload the bitrise.yml file during the ${CLI_COMMANDS.AddCICD} command.`,
        }),
      );
    }

      // Upload Bitrise.yml File
      try {
        const finishRegisterResponse = await sendRequest(RequestMethod.Post, `/apps/${returnedSlug}/finish`, axiosInstance, data);
      } catch (error) {
        throw new Error(
          JSON.stringify({
            code: 'bitrise-yml-upload-failed',
            message: `An error occured when we attempted to upload the bitrise.yml file during the ${CLI_COMMANDS.AddCICD} command.`,
          }),
        );
      }
      










    // // retrieve component name
    // const componentName = await parseComponentName(args);
    // // parse kebab and pascal case of componentName
    // const componentNameKebab = toKebabCase(componentName);
    // const componentNamePascal = toPascalCase(componentName);

    // configs.forEach(async config => {
    //   const files: Array<string | Files | { source: string, target: string, content: any[] }> = config.manifest.files;

    //   sourceDirectory = path.join(config.moduleTemplatePath, config.manifest.sourceDirectory);
    //   installDirectory = path.join(projectRoot, config.manifest.installDirectory);
      
    //   // copy and update files for component being added
    //   await copyFiles(sourceDirectory, installDirectory, files);

    //   // Replacing template strings
    //   filesToReplace
    //     .map(file => `${projectRoot}/${file}`)
    //     .forEach(async file => {
    //       await replaceInFiles(file, /__PROJECT_SCHEME__/g, toPascalCase(scheme));
    //       await replaceInFiles(file, /__BUNDLE_IDENTIFIER__/g, bundleIdenifier.toLowerCase());
    //     })
    // });

    this.log(`${CLI_STATE.Success} CI/CD setup successfully`);
    this.log(`\n  Visit the documentation page for more info:\n  ${chalk.yellow(DOCUMENTATION_LINKS.Component)}\n`);
  }
}
