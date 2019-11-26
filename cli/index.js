#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const util = require("./lib/util");
const MODULE_GENERATE = require("./modules/generate");
const MODULE_NEW = require("./modules/new");

const {
  COMMANDS,
  USAGE
} = require("./config");

clear();

const run = async () => {
  try {
    const allArgs = process.argv;
    const userArgs = process.argv.slice(2);
    util.heading();
    if (util.hasCommand(userArgs, COMMANDS)) {
      const operation = {};
      operation.command = await util.parseCommand(userArgs, COMMANDS);
      operation.options = await util.parseOptions(userArgs, COMMANDS);
      // console.log(operation.options);
      switch (operation.command) {
        case 'new':
          await MODULE_NEW.run(operation);
          break;
        case 'generate':
          await MODULE_GENERATE.run(operation);
          break;
        default:
          break;
      }
    } else { // show help text
      console.log(util.displayHelp(USAGE))
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
