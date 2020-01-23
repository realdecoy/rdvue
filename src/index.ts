#!/usr/bin/env node

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
 */
async function populateCommand(command: string, required = false){
  let commandConfig: Config;
  commandConfig = readSubConfig(command);

  // Based of the command of the user the configuration property is populated
  commandAssignment(command, commandConfig, true);

  // Dont add general help text if command is required for new project generation
  if(!required){
    contentPopulate(
      CLI_DESCRIPTION.general.menu,
      `${chalk.magenta(command)}`,
      `${commandConfig.description}`
      );
  }

  // Assign the command for the Cli object to a variable to reuse
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

/**
 * Description: Adding the necessary information to the Usage object to be used in command execution
 * @param commands - acceptable commands that can be used with rdvue
 * @param requiredCommands - commands that cant be user requested
 * but are required to create a project (eg. config and store)
 * @param mainConfig - config data populated from template.json.
 * Describes options the tool can take.
 */
async function populateUsage(commands: string[], requiredCommands: string[], mainConfig: Config) {
  CLI_DESCRIPTION.general.menu = USAGE_TEMPLATE();
  CLI_DESCRIPTION.general.menu.splice(1, 0, {
    header: 'Features',
    content: [],
  });

  // Add project config to USAGE
  if(CLI_DESCRIPTION.general.menu[1].content !== undefined){
    contentPopulate(
      CLI_DESCRIPTION.general.menu,
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

  CLI_DESCRIPTION.project.config = commandConfig;
}

clear();

const run = async () => {
  try {

    // Assign config to object return from JSON parse
    const mainConfig = readMainConfig();
     // Return value if true and empty array if false
    const commands: string[] = (mainConfig.import !== undefined) ? mainConfig.import.optional : [];
    const requiredCommands: string[] = (mainConfig.import !== undefined) ?
    // Return value if true and empty array if false
    mainConfig.import.required : [];

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
      const operation: Command = {
        command: util.parseCommand(userArgs, commands),
        options: util.parseOptions(userArgs, commands)
      };

      // TODO: Error checking: ensure that user has only input one command

      project = util.checkProjectValidity(operation);
      if (project.isValid) {
        await MODULE_NEW.run(operation, CLI_DESCRIPTION);
      } else {
        throw Error(`'${process.cwd()}' is not a valid Vue project.`);
      }
    } else {
      // Show Help Text
      // TODO: Throw and error for invalid command
      console.log(util.displayHelp(CLI_DESCRIPTION.general.menu));
    }
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
