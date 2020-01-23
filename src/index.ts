#!/usr/bin/env node

/**
 * This file is utilized at the start of execution of the program
 */

import chalk from 'chalk';
import clear from 'clear';
import { USAGE_TEMPLATE } from './config';
import { readMainConfig, readSubConfig } from './lib/files';
import * as util from './lib/util';

import { commandAssignment, contentPopulate } from './lib/index-functions';
import * as MODULE_NEW from './modules/new';

import { CLI_DEFAULT } from './default objects/cli-description';
import { Command } from './types/index';
import { Config, Usage } from './types/cli';

// Assign CLI object a default value
export let CLI_DESCRIPTION: Usage = CLI_DEFAULT;

/**
 * Parse commands provided by template manifest files
 * and generate the CLI help menus as well as extract
 * info useful for generating the sub features
 * @param command - Command that the user entered (eg. project, page, component)
 * @param required - Boolean value which tells you if the command is required or not.
 *                   Required commands include 'config' and 'store'
 */
async function populateCommand(command: string, required = false){
  let commandConfig: Config;
  commandConfig = readSubConfig(command);

  // [1] Based of the command of the user the configuration property is populated
  commandAssignment(command, commandConfig, true);

  // [2] Add general help text if command is required for new project generation
  if(!required){
    contentPopulate(
      CLI_DESCRIPTION.general.menu,
      `${chalk.magenta(command)}`,
      `${commandConfig.description}`
      );
  }

  // [3] Assign the command for the CLI object to a variable for re-use
  const cliCommand = commandAssignment(command, commandConfig, false);

  // [4] Access menu for specific command and add it to cliCommand object
  cliCommand.menu = USAGE_TEMPLATE(undefined, command, undefined);

  // [5] Once the user input arguments
  if (commandConfig.arguments !== undefined && commandConfig.arguments !== []) {

    // [6] Replace the second index in the cli command
    // menu with the header "arguments" and empty conent array
    cliCommand.menu.splice(1, 0, {
      header: 'Arguments',
      content: [],
    });

    // [7] For every argument if the menu is defined
    for (const argument of commandConfig.arguments) {

      if (cliCommand.menu[1].content !== undefined) {

        // [7a] Populate command menu
        contentPopulate(
          cliCommand.menu,
          `${chalk.magenta(argument.name)}`,
          `${argument.description}`
          );
      }
    }
  }
}

/**
 * Description: Adding the necessary information to the Usage object to be used in command execution
 * @param commands - acceptable commands that can be used with rdvue
 * @param requiredCommands - commands that cant be user requested
 * but are required to create a project (eg. config and store)
 * @param mainConfig - config data populated from template.json.
 * Describes options the tool can take.
 */
async function populateUsage(commands: string[], requiredCommands: string[], mainConfig: Config) {

  let commandConfig: Config;

  // [1] Intialize the CLI menu with the USAGE_TEMPLATE (./config.ts)
  CLI_DESCRIPTION.general.menu = USAGE_TEMPLATE();

  // [2] Replace the second index of the menu with header: 'Features' and empty content array
  CLI_DESCRIPTION.general.menu.splice(1, 0, {
    header: 'Features',
    content: [],
  });

  // [3] Add project config to CLI_DESCRIPTION
  if(CLI_DESCRIPTION.general.menu[1].content !== undefined){
    contentPopulate(
      CLI_DESCRIPTION.general.menu,
      `${chalk.magenta('project')}`,
      'Generate a new project.'
      );
  }

  // [4] Parse commands provided by template manifest files and generate the CLI help menus
  // for both required and non required commands depending on user input
  for (const command of commands) {
    await populateCommand(command);
  }
  for (const command of requiredCommands) {
    await populateCommand(command, true);
  }

  // [5] Add 'project' to list of commands input by user
  commands.push('project');

  // [6] Creating 'project' command configuration
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

  // [7] Setting the project config to the newly created commandConfig
  CLI_DESCRIPTION.project.config = commandConfig;
}


async function run (){
  try {

    // [1a] Assign config to object return from JSON parse
    const mainConfig = readMainConfig();

    // [1b] Return value if true and empty array if false
    const commands: string[] = (mainConfig.import !== undefined) ? mainConfig.import.optional : [];

    // [1c] Return value if true and empty array if false
    const requiredCommands: string[] = (mainConfig.import !== undefined) ?
    mainConfig.import.required : [];

    const sliceNumber = 2;
    // [1d] Check for user arguments
    const userArgs = process.argv.slice(sliceNumber);

    let project;

    // [2] Clear the console
    clear();

    // [3] Populate command usage information
    await populateUsage(commands, requiredCommands, mainConfig);

    // [4] Display "rdvue" heading
    util.heading();

    // [5] Check to see if user arguments include any valid commands
    if (util.hasCommand(userArgs, commands)) {
      const operation: Command = {
        command: util.parseCommand(userArgs, commands),
        options: util.parseOptions(userArgs, commands)
      };

      // TODO: Error checking: ensure that user has only input one command

      // [5b] Check to see if the project is valid
      project = util.checkProjectValidity(operation);
      if (project.isValid) {

        // [6a] Call the run function in modules/new/index.ts
        await MODULE_NEW.run(operation, CLI_DESCRIPTION);
      } else {

        // [6b] Throw an error if this is not a valid project
        throw Error(`'${process.cwd()}' is not a valid Vue project.`);
      }
    } else {

      // [5] Show Help Text if no valid commands have been inputted
      // TODO: Throw and error for invalid command
      console.log(util.displayHelp(CLI_DESCRIPTION.general.menu));
    }

    // [6] Force process to exit
    process.exit();
  } catch (err) {

    // TODO: Implement more contextual errors
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
