/* eslint-disable max-lines */
const fs = require('fs');
import shell from 'shelljs';
import { Command, flags } from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import { checkProjectValidity, createChangelogReadme, isJsonString } from '../../lib/utilities';
import { copyDirectoryRecursive, copyFiles, deleteFile, readFile, updateFile } from '../../lib/files';
import { CLI_COMMANDS, CLI_STATE, TEMPLATE_REPO, TEMPLATE_ROOT, TEMPLATE_TAG, DOCUMENTATION_LINKS, CHANGE_LOG_FOLDER, CHANGE_LOG_FILENAME, CHAR_PERIOD } from '../../lib/constants';
import { DEFAULT_CHANGE_LOG, changeLogFile, ChangelogResource, ChangelogResourcesContent, ChangeLog, ChangelogConfigTypes, handlePrimitives, handleArraysAndObjects } from '../../modules';
const CUSTOM_ERROR_CODES = [
  'project-invalid',
];

export default class Upgrade extends Command {
  static description = 'Specify the rdvue template version for a project'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [
    { name: 'name', description: 'rdvue version' },
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
    const { isValid: isValidProject, projectRoot } = checkProjectValidity();
    // block command unless being run within an rdvue project
    if (isValidProject === false) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `${CLI_COMMANDS.Upgrade} command must be run in an existing ${chalk.yellow('rdvue')} project`,
        }),
      );
    }

    const { args } = this.parse(Upgrade);
    const template: string = TEMPLATE_REPO;
    const versionName = args.name ?? TEMPLATE_TAG;
    const temporaryProjectFolder = path.join(projectRoot, 'node_modules', '_temp');
    const templateSourcePath = path.join(temporaryProjectFolder, TEMPLATE_ROOT);

    const templateDestinationPath = path.join(projectRoot, TEMPLATE_ROOT);
    const changelogPath = path.join(projectRoot, CHANGE_LOG_FILENAME);

    // retrieve project files from template source
    await shell.exec(`git clone ${template} --depth 1 --branch ${versionName} ${temporaryProjectFolder}`, { silent: true });

    // copy template files to project local template storage
    await copyDirectoryRecursive(templateSourcePath, templateDestinationPath);
    /**
     * @Todo create method to generate changelog dynamically from git diff.
     * add changelog to project temp directory and read based on release version number
     */
    const rawGeneratedChangelog = readFile(path.join(templateDestinationPath, CHANGE_LOG_FOLDER, versionName));
    const parsedGeneratedChangelog: ChangeLog | null = rawGeneratedChangelog.length > 0 ? JSON.parse(rawGeneratedChangelog) : null;
    const changeLogData = parsedGeneratedChangelog ?? DEFAULT_CHANGE_LOG;

    /**
     * Steps for Executing changelog
     * 1. read package.json file from project root
     * 2. compare packages in existing package.json with the updated package.json cloned in above
     * 3. remove unused project dependencies and devDependencies
     * 4. add missing packages to project dependencies and devDependencies
     * 5. update existing packages to appropriate versions
     * 6. write package.json file back to project root
     * 7. remove unused files ( vue.config.js, .env, .env.example, .package-lock.json )
     * 8. include new project folders and files ( scripts/config, config/.env, config/.env.example, webpack.config.js )
     * 9. update existing project files ( main.ts, tsconfig.json, tailwind.config.js, src/pages/hello-world, readme )
     */
    const resourcesToCreate = changeLogData[ChangelogConfigTypes.CREATE]?.resources;
    const resourcesToUpdate = changeLogData[ChangelogConfigTypes.UPDATE]?.resources;
    const resourcesToDelete = changeLogData[ChangelogConfigTypes.DELETE]?.resources;
    if (resourcesToCreate) {
      await this.createProjectFiles(projectRoot, temporaryProjectFolder, resourcesToCreate);
    }
    if (resourcesToUpdate) {
      await this.updateProjectFiles(projectRoot, resourcesToUpdate);
    }
    if (resourcesToDelete) {
      this.deleteProjectFiles(projectRoot, resourcesToDelete);
    }

    fs.rmdirSync(temporaryProjectFolder, { recursive: true });

    this.log(`${CLI_STATE.Success} rdvue updated to version: ${chalk.green(versionName)}`);

    createChangelogReadme(versionName, changelogPath, changeLogData);
    this.log(`${CLI_STATE.Success} CHANGELOG.md generated at : ${chalk.green(changelogPath)}`);

    this.log(`\n  ${chalk.yellow('rdvue')} has been updated to use the esbuild bundler!\n  Learn more here: ${chalk.yellow(DOCUMENTATION_LINKS.EsBuild)}\n`);
    this.log(changeLogData.reccomendations);
  }

  async createProjectFiles(projectRoot: string, temporaryProjectFolder: string, resources: ChangelogResource[]): Promise<void> {
    for await (const resource of resources) {
      try {
        const name = resource.name;
        const src = resource.srcPath;
        const dest = resource.destPath;
        const resourceFile = resource.file;

        if (src !== undefined && dest !== undefined && resourceFile) {
          const srcDir = path.join(temporaryProjectFolder, src.trim());
          const destDir = path.join(projectRoot, dest.trim());

          const existingFile = readFile(path.join(destDir, name));
          if (existingFile && !resourceFile.target.includes(ChangelogConfigTypes.UPDATE)) {
            const current = resourceFile.target.split(CHAR_PERIOD);
            current.splice(current.length - 1, 0, ChangelogConfigTypes.UPDATE);
            resourceFile.target = current.join(CHAR_PERIOD);
          }

          const files: changeLogFile[] = [resourceFile];
          await copyFiles(srcDir, destDir, files, false);
        } else {
          throw this.error;
        }
      } catch (error) {
        this.log(`${CLI_STATE.Warning} could not create file at: ${chalk.yellow(error)}`);
      }
    }
  }

  async updateProjectFiles(projectRoot: string, resources: ChangelogResource[]): Promise<void> {
    for await (const resource of resources) {
      const destPath = resource.destPath;
      const destDir = path.join(projectRoot, destPath);
      const name = resource.name;
      const contents: ChangelogResourcesContent[] | undefined = resource.contents;

      if (contents && contents.length > 0) {
        const filePath = path.join(projectRoot, name);
        const rawJsonData = readFile(filePath);
        const parsedJsonData = this.jsonReader(filePath);

        for (const content of contents) {
          const keys: string[] = content.key.split('.');
          this.parseAndUpdateJson(parsedJsonData, keys, content);
        }

        const regex = /[^]*/;
        await updateFile(destDir, rawJsonData, regex, JSON.stringify(parsedJsonData, null, 2));
      }
    }
  }

  deleteProjectFiles(projectRoot: string, resources: ChangelogResource[]): void {
    for (const resource of resources) {
      const destPath = resource.destPath;
      const name = resource.name;

      const destDir = path.join(projectRoot, destPath);
      const targetFile = path.join(destDir, name);
      const rawData = readFile(targetFile);

      if (!rawData) {
        return;
      }
      try {
        deleteFile(targetFile);
      } catch (error) {
        this.log(`${CLI_STATE.Warning} could not find file at: ${chalk.yellow(targetFile)} to delete`);
      }
    }
  }

  parseAndUpdateJson(data: any, keys: string[], content: ChangelogResourcesContent): void {
    if (!data || keys.length <= 0) {
      return;
    }
    const currentKey = keys.shift();
    if (currentKey) {
      if (keys.length <= 0) {
        const operation = content.operation;
        const newValue = content.value;

        if (!Array.isArray(newValue) && !(newValue instanceof Object)) {
          handlePrimitives(data, currentKey, operation, newValue);
        } else {
          handleArraysAndObjects(data, currentKey, operation, newValue);
        }

        return;
      }
      this.parseAndUpdateJson(data[currentKey], keys, content);
    }
  }

  jsonReader(filePath: string): any {
    const text = fs.readFileSync(filePath);

    return JSON.parse(text);
  }
}
