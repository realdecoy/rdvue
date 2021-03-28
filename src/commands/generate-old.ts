import {Command, flags} from '@oclif/command';
import path from 'path';
import * as inquirer from 'inquirer';
import { readConfigFile, copyFiles } from '../lib/files';
import { Files } from '../lib/types';
import { TEMPLATE_ROOT } from '../lib/constants';

const TEMPLATE_CONFIG_FOLDER = 'config';
const TEMPLATE_FOLDERS = ['config','store'];
const TEMPLATE_FILE = 'manifest.json';

const validateProjectName = function(input: string) {
  return true;
}

export default class GenerateOld extends Command {
  static description = 'Create a new rdvue project';

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  };

  static args = [
    {name: 'name', desciption: 'name of generated project'}
  ];

  async run() {
    const { args } = this.parse(GenerateOld);
    const folderList = TEMPLATE_FOLDERS;
    const configs = folderList.map((folder) => {
      return { 
        root: folder === TEMPLATE_CONFIG_FOLDER,
        name: folder,
        manifest: readConfigFile(`/${folder}/${TEMPLATE_FILE}`)
      };
    });
    let sourceDirectory: string;
    let installDirectory: string;
    let projectName: string = args.name;
  
    // if no project name is provided in command them prompt user
    if (!projectName) {
      let responses: any = await inquirer.prompt([{
        name: 'name',
        default: 'my-rdvue-project',
        message: 'Enter a project name: ',
        type: 'input',
        validate: validateProjectName,
      }]);
      projectName = responses.name;
    }
    
    this.log(`[rdvue2] creating project: ${projectName}`);
    configs.forEach((config) => {
      const files: Array<string | Files> = config.manifest.files;
      sourceDirectory = path.join(TEMPLATE_ROOT, config.name, config.manifest.sourceDirectory);
      installDirectory = path.join(projectName, config.root ? '' : 'src', config.manifest.installDirectory);
      copyFiles(sourceDirectory, installDirectory, files);
    });
  }
}
