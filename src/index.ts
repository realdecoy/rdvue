#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import CONFIG from './config';
import files from './lib/files';
import util from './lib/util';
import MODULE_NEW from './modules/new';

const USAGE: any = {};

/**
 * Parse commands provided by template manifest files
 * and generate the usage help menus as well as extract
 * info useful for generating the sub features
 */

async function populateCommand(command: string, required = false){
  let commandConfig: any = {};
  commandConfig = await files.readSubConfig(command);
  USAGE[command] = {};
  USAGE[command].config = commandConfig;

  // Dont add general help text if command is required for new project generation
  if(!required){
    USAGE.general.menu[1].content.push({
      name: `${chalk.magenta(command)}`,
      summary: commandConfig.description,
    });
  }

  USAGE[command].menu = CONFIG.USAGE_TEMPLATE(undefined, command, undefined);
  if (commandConfig.arguments !== undefined && commandConfig.arguments !== []) {
    USAGE[command].menu.splice(1, 0, {
      header: 'Arguments',
      content: [],
    });
    for (const argument of commandConfig.arguments) {
      USAGE[command].menu[1].content.push({
        name: `${chalk.magenta(argument.name)}`,
        summary: argument.description,
      });
    }
  }
}

async function populateUsage(commands: string[], requiredCommands: string[], mainConfig: any) {
  let commandConfig: any = {};

  USAGE.general = {};
  USAGE.general.menu = CONFIG.USAGE_TEMPLATE();
  USAGE.general.menu.splice(1, 0, {
    header: 'Features',
    content: [],
  });

  // Add project config to USAGE
  USAGE.general.menu[1].content.push({
    name: `${chalk.magenta('project')}`,
    summary: 'Generate a new project.',
  });

  for (const command of commands) {
    await populateCommand(command);
  }
  for (const command of requiredCommands) {
    await populateCommand(command, true);
  }

  commands.push('project');
   
  USAGE.project = {};

  commandConfig = mainConfig;
  commandConfig.name = 'project';
  commandConfig.arguments = [
    {
      'name': 'projectName',
      'type': 'string',
      'description': 'The name for the generated project.'
    },
    {
      'name': 'projectNameKebab',
      'type': 'string',
      'description': 'The name in Kebab-case for the generated project.',
      'isPrivate': true
    }
  ];

  USAGE.project.config = commandConfig;
}

clear();

const run = async () => {
  try {
    const mainConfig = await files.readMainConfig();
    const commands: string[] = mainConfig.import.optional;
    const requiredCommands: string[] = mainConfig.import.required;
    // Check for user arguments
    const userArgs = process.argv.slice(2);                         
    const operation: any = {};
    let project;

    // Declare project here

    // Populate command usage information
    await populateUsage(commands, requiredCommands, mainConfig);

    util.heading();
    if (util.hasCommand(userArgs, commands)) {
      operation.command = util.parseCommand(userArgs, commands);
      operation.options = util.parseOptions(userArgs, commands);

      project = util.checkProjectValidity(operation);
      if (project.isValid) {
        await MODULE_NEW.run(operation, USAGE);
      } else {
        throw Error(`'${process.cwd()}' is not a valid Vue project.`);
      }
    } else { 
      // Show Help Text
      console.log(util.displayHelp(USAGE.general.menu));
    }
    process.exit();
  } catch (err) {
    if (err) {
      console.log(chalk.red(`${err}`));
    }
    process.exit();
  }
};

run();
