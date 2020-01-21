#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import { USAGE_TEMPLATE } from './config';
import { readMainConfig, readSubConfig } from './lib/files';
import * as util from './lib/util';

import { commandAssignment, contentPopulate } from './lib/index_functions';
import * as MODULE_NEW from './modules/new';
import { USAGEDEFAULT } from './object/usage';
import { Command } from './types/index';
import { Config, Usage } from './types/usage';

export let USAGE: Usage = USAGEDEFAULT;

/**
 * Parse commands provided by template manifest files
 * and generate the usage help menus as well as extract
 * info useful for generating the sub features
 */
async function populateCommand(command: string, required = false){
  let commandConfig: Config;
  commandConfig = readSubConfig(command);

  // Based of the command of the user the configuration property is populated
  commandAssignment(command, commandConfig, true);

  // Dont add general help text if command is required for new project generation
  if(!required){
    if(USAGE.general.menu !== undefined){
      contentPopulate(
        USAGE.general.menu,
        `${chalk.magenta(command)}`,
        `${commandConfig.description}`
        );
    }
  }

  // Assign the command for the usage object to a variable to reuse
  const usageCommand = commandAssignment(command, commandConfig, false);

  usageCommand.menu = USAGE_TEMPLATE(undefined, command, undefined);
  if (commandConfig.arguments !== undefined && commandConfig.arguments !== []) {
    usageCommand.menu.splice(1, 0, {
      header: 'Arguments',
      content: [],
    });
    for (const argument of commandConfig.arguments) {
      if(usageCommand.menu[1].content !== undefined){
        // Populate command menu
        contentPopulate(
          usageCommand.menu,
          `${chalk.magenta(argument.name)}`,
          `${argument.description}`
          );
      }
    }
  }
}

async function populateUsage(commands: string[], requiredCommands: string[], mainConfig: Config) {
  USAGE.general.menu = USAGE_TEMPLATE();
  USAGE.general.menu.splice(1, 0, {
    header: 'Features',
    content: [],
  });

  // Add project config to USAGE
  if(USAGE.general.menu[1].content !== undefined){
    contentPopulate(
      USAGE.general.menu,
      `${chalk.magenta('project')}`,
      'Generate a new project.'
      );
  }

  for (const command of commands) {
    await populateCommand(command);
  }
  for (const command of requiredCommands) {
    await populateCommand(command, true);
  }

  commands.push('project');
  let commandConfig: Config;
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
    // Assign config to object return from JSON parse
    const mainConfig = readMainConfig();

    const commands: string[] = (mainConfig.import !== undefined) ? mainConfig.import.optional : [];
    const requiredCommands: string[] = (mainConfig.import !== undefined) ?
    // Return value if true and empty array if false
    mainConfig.import.required : [];

    console.log(USAGE);
    // Populate command usage information
    await populateUsage(commands, requiredCommands, mainConfig);
    const sliceNumber = 2;
    // Check for user arguments
    const userArgs = process.argv.slice(sliceNumber);
    let project;

    // Populate command usage information
    await populateUsage(commands, requiredCommands, mainConfig);

    // Display "rdvue" heading
    util.heading();

    // Check to see if user arguments include any valid commands
    if (util.hasCommand(userArgs, commands)) {
      // Operation.command = util.parseCommand(userArgs, commands);
      // Operation.options = util.parseOptions(userArgs, commands);
      const operation: Command = {
        command: util.parseCommand(userArgs, commands),
        options: util.parseOptions(userArgs, commands)
      };

      project = util.checkProjectValidity(operation);
      if (project.isValid) {
        await MODULE_NEW.run(operation, USAGE);
      } else {
        throw Error(`'${process.cwd()}' is not a valid Vue project.`);
      }
    } else {
      // Show Help Text
      // TODO: Fix and enable
      // console.log(util.displayHelp(USAGE.general.menu));
    }
    process.exit();
  } catch (err) {
    if (err) {
      console.log(chalk.red(`${err}`));
    }
    process.exit();
  }
};

run()
.then(() => {
  console.info('info');
})
.catch((err: Error) => {
  console.error(`Error at run: ${err}`);
});
