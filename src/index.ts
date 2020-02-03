#!/usr/bin/env node

/**
 * This file is utilized at the start of execution of the program
 */

import chalk from 'chalk';
import clear from 'clear';
import { USAGE_TEMPLATE } from './config';
import { readMainConfig, readSubConfig } from './lib/files';
import * as util from './lib/util';

import { commandAssignment, contentPopulate } from './lib/helper-functions';
import * as MODULE_NEW from './modules/new';

import { CLI_DEFAULT } from './default objects/cli-description';
import { CLI, Config } from './types/cli';
import { Command } from './types/index';


// Assign CLI object a default value
export let CLI_DESCRIPTION: CLI = CLI_DEFAULT;

/**
 * Parse commands provided by template manifest files
 * and generate the CLI help menus as well as extract
 * info useful for generating the sub features
 * @param feature - Command that the user entered (eg. project, page, component)
 * @param required - Boolean value which tells you if the command is required or not.
 *                   Required commands include 'config' and 'store'
 */
async function populateCommand(feature: string, required = false) {
  const index = 2;
  let featureConfig: Config;
  featureConfig = readSubConfig(feature);

  // [1] Based of the command of the user the configuration property is populated
  commandAssignment(feature, featureConfig, true);

  // [2] Add command to general help text if not required for new project generation
  if(!required){
    contentPopulate(
      CLI_DESCRIPTION.general.menu,
      `${chalk.magenta(feature)}`,
      `${featureConfig.description}`,
      index
      );
  }

  // [3] Assign the command for the CLI object to a variable for re-use
  const cliCommand = commandAssignment(feature, featureConfig, false);

  // [4] Access menu for specific command and add it to cliCommand object
  cliCommand.menu = USAGE_TEMPLATE(undefined, undefined, feature, undefined, undefined);

  // [5] Once the user input arguments
  if (featureConfig.arguments !== undefined && featureConfig.arguments !== []) {

    // [6] Replace the second index in the cli command
    // menu with the header "arguments" and empty conent array
    cliCommand.menu.splice(index, 0, {
      header: 'Arguments:',
      content: [],
    });

    // [7] For every argument if the menu is defined
    for (const argument of featureConfig.arguments) {

      if (cliCommand.menu[index].content !== undefined) {

        // [7a] Populate command menu
        contentPopulate(
          cliCommand.menu,
          `${chalk.magenta(argument.name)}`,
          `${argument.description}`,
          index
          );
      }
    }
  }
}

/**
 * Description: Adding the necessary information to the Usage object to be used in command execution
 * @param features - acceptable features that can be created with rdvue
 * @param requiredFeatures - features that can't be user requested
 * but are required to create a project (eg. config and store)
 * @param mainConfig - config data populated from template.json.
 * Describes options the tool can take.
 */
async function populateCLIMenu(features: string[], requiredFeatures: string[], mainConfig: Config) {

  const index = 2;

  let featureConfig: Config;

  // [1] Intialize the CLI menu with the USAGE_TEMPLATE (./config.ts)
  CLI_DESCRIPTION.general.menu = USAGE_TEMPLATE();

  CLI_DESCRIPTION.general.menu.splice(index, 0, {
    header: 'Features:',
    content: [],
  });

  // [3] Add project config to CLI_DESCRIPTION
  if(CLI_DESCRIPTION.general.menu[index].content !== undefined){
    contentPopulate(
      CLI_DESCRIPTION.general.menu,
      `${chalk.magenta('project')}`,
      'Generate a new project.', index
      );
  }

  // [4] Parse features provided by template manifest files and generate the CLI help menus
  // for both required and non required features depending on user input
  for (const feature of features) {
    await populateCommand(feature);
  }
  for (const feature of requiredFeatures) {
    await populateCommand(feature, true);
  }

  // [5] Add 'project' to list of features input by user
  features.push('project');

  // [6] Creating 'project' features configuration
  featureConfig = mainConfig;
  featureConfig.name = 'project';
  featureConfig.arguments = [
    {
      'name': 'projectName',
      'type': 'string',
      'description': 'the name for the generated project.'
    },
    {
      'name': 'projectNameKebab',
      'type': 'string',
      'description': 'the name in Kebab-case for the generated project.',
      'isPrivate': true
    }
  ];

  // [7] Setting the project config to the newly created commandConfig
  CLI_DESCRIPTION.project.config = featureConfig;
}


async function run () {
  try {

    // [1a] Assign config to object return from JSON parse
    const mainConfig = readMainConfig();

    // [1b] Return list of features if true and empty array if false
    const features: string[] = (mainConfig.import !== undefined) ? mainConfig.import.optional : [];

    // [1c] Return value if true and empty array if false
    const requiredFeatures: string[] = (mainConfig.import !== undefined) ?
    mainConfig.import.required : [];

    const sliceNumber = 2;
    // [1d] Check for user arguments
    const userArgs = process.argv.slice(sliceNumber);

    let project;

    // [2] Clear the console
    clear();

    // [3] Populate feature usage information
    await populateCLIMenu(features, requiredFeatures, mainConfig);

    // [4] Display "rdvue" heading
    util.heading();

    // [5] Check to see if user arguments include any valid features
    if (util.hasCommand(userArgs, features)) {

      // [6] Puts the user arguments into an object that seperates them into action,
      // feature, option and feature name from format
      // rdvue <action> <feature> <feature name> [options]
      // TODO: TRY CATCH???
      const operation: Command = {
        action: util.parseUserInput(userArgs, features).action,
        feature: `${util.parseUserInput(userArgs, features).feature}`,
        options: util.parseUserInput(userArgs, features).options,
        featureName: util.parseUserInput(userArgs, features).featureName,
      };

      // [6b] Check to see if the project is valid
      project = util.checkProjectValidity(operation);
      if (project.isValid) {
        // [7a] Call the run function in modules/new/index.ts
        await MODULE_NEW.run(operation, CLI_DESCRIPTION);
      } else {

        // [7b] Throw an error if this is not a valid project
        throw Error(`'${process.cwd()}' is not a valid Vue project.`);
      }
    } else {

      // [6c] Show Help Text if no valid feature/action have been inputted
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
}

run()
.then(() => {
  console.info('info');
})
.catch((err: Error) => {
  console.error(`Error at run: ${err}`);
});
