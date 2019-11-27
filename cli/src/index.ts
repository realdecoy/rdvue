#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import util from "./lib/util";
import repo from "./lib/repo";
import files from "./lib/files";
// import MODULE_GENERATE from "./modules/generate";
import MODULE_NEW from "./modules/new";
import config from "./config";

const USAGE: any = {};

/**
 * Parse commands provided by template manifest files
 * and generate the usage help menus as well as extract
 * info useful for generating the sub features
 */
async function populateUsage(commands: string[], mainConfig: any) {
  USAGE.general = {};
  USAGE.general.menu = config.USAGE_TEMPLATE();
  USAGE.general.menu.splice(1, 0, {
    header: 'Features',
    content: [],
  });
  // add project config to USAGE
  USAGE.general.menu[1].content.push({
    name: `${chalk.magenta('project')}`,
    summary: 'Generate a new project.',
  });

  commands.push("project");
  for (const command of commands) {
    let commandConfig: any = {};
    USAGE[command] = {};

    if (command == 'project') {
      commandConfig = mainConfig
      commandConfig.name = 'project'
      commandConfig.arguments = [
        {
          "name": "projectName",
          "type": "string",
          "description": "The name for the generated project."
        },
        {
          "name": "projectNameKebab",
          "type": "string",
          "description": "The name in Kebab-case for the generated project.",
          "isPrivate": true
        }
      ];
      USAGE[command].config = commandConfig;
    } else {
      commandConfig = await files.readSubConfig(command);
      USAGE[command].config = commandConfig;
      USAGE.general.menu[1].content.push({
        name: `${chalk.magenta(command)}`,
        summary: commandConfig.description,
      });
      USAGE[command].menu = config.USAGE_TEMPLATE(undefined, command, undefined);
      if (commandConfig.arguments !== undefined && commandConfig.arguments !== []) {
        USAGE[command].menu.splice(1, 0, {
          header: "Arguments",
          content: [],
        });
        for (const argument of commandConfig.arguments) {
          USAGE[command].menu[1].content.push({
            name: `${chalk.magenta(argument.name)}`,
            summary: argument.description,
          })
        }
      }
    }
  };
}

clear();
const run = async () => {
  try {
    await repo.cloneRemoteRepo(config.TEMPLATE_PROJECT_URL, config.TEMPLATE_PROJECT_NAME);
    const mainConfig: any = await files.readMainConfig();
    const commands: string[] = mainConfig.import.optional;
    // populate command usage information
    await populateUsage(commands, mainConfig);

    // check for user arguments
    const userArgs = process.argv.slice(2);

    util.heading();
    if (util.hasCommand(userArgs, commands)) {
      const operation: any = {};
      operation.command = util.parseCommand(userArgs, commands);
      operation.options = util.parseOptions(userArgs, commands);
      // console.log(USAGE[operation.command]);
      // if(operation.options.includes('--new') || operation.options.includes('--help')){
      await MODULE_NEW.run(operation, USAGE);
      // }else {
      // console.log(util.displayHelp(USAGE.general.menu));
      // }
      // switch (operation.option) {
      //   case 'new':
      //     await MODULE_NEW.run(operation);
      //     break;
      //   case 'generate':
      //     await MODULE_GENERATE.run(operation);
      //     break;
      //   default:
      //     break;
      // }
    } else { // show help text
      console.log(util.displayHelp(USAGE.general.menu));
      console.log(USAGE);
    }
    await files.clearTempFiles(config.TEMPLATE_PROJECT_NAME);
    process.exit();
  } catch (err) {
    if (err) {
      console.log(chalk.red(`${err}`));
    }
    await files.clearTempFiles(config.TEMPLATE_PROJECT_NAME);
    process.exit();
  }
};

run();
