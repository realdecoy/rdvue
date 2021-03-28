import {Command, flags} from '@oclif/command';
import path from 'path';
import chalk from 'chalk';
import { Files } from '../lib/types';
import { copyFiles, readAndUpdateFeatureFiles, readConfigFile, replaceTargetFileNames } from '../lib/files';
import { parsePageName, toKebabCase, toPascalCase } from '../lib/utilities';
import { TEMPLATE_CONFIG_FILENAME, TEMPLATE_ROOT } from '../lib/constants';

const TEMPLATE_FOLDERS = ['page'];
export default class Page extends Command {
  static description = 'Create a new rdvue page';

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static args = [
    {name: 'name', desciption: 'name of generated page'}
  ];

  async run() {
    const { args } = this.parse(Page);
    const folderList = TEMPLATE_FOLDERS;
    const configs = folderList.map((folder) => {
      return {
        name: folder,
        manifest: readConfigFile(`/${folder}/${TEMPLATE_CONFIG_FILENAME}`)
      };
    });
    let sourceDirectory: string;
    let installDirectory: string;
    let pageName: string;
    let pageNameKebab: string;
    let pageNamePascal: string;
  
    // retrieve page name
    pageName = await parsePageName(args);
    // parse kebab and pascal case of pageName
    pageNameKebab = toKebabCase(pageName);
    pageNamePascal = toPascalCase(pageName);
    
    configs.forEach(async (config) => {
      const files: Array<string | Files> = config.manifest.files;
      // replace file names in config with kebab case equivalent
      replaceTargetFileNames(files, pageNameKebab);
      sourceDirectory = path.join(TEMPLATE_ROOT, config.name, config.manifest.sourceDirectory);
      installDirectory = path.join('src', config.manifest.installDirectory,pageNameKebab);

      // copy and update files for page being generated
      await copyFiles(sourceDirectory, installDirectory, files);
      await readAndUpdateFeatureFiles(installDirectory, files, pageNameKebab, pageNamePascal);
    });

    this.log(`${chalk.blue('[rdvue2]')} Created page ${pageNameKebab}`);
  }
}
