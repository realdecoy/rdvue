// eslint-disable-next-line unicorn/prefer-module
const chalk = require('chalk');
import { Args, Command, Flags } from '@oclif/core';

export default class Plugin extends Command {
  static description = 'install a plugin'

  static flags = {
    help: Flags.help({ name: 'help', char: 'h', hidden: false }),
  }

  static args = {
    buefy: Args.string({ name: 'buefy', description: 'lightweigth UI components for Vue.js', hidden: false }),
    localization: Args.string({ name: 'localization', description: 'library for localizing content', hidden: false }),
    vuetify: Args.string({ name: 'vuetify', description: 'material design framework for Vue.js', hidden: false }),
    storybook: Args.string({ name: 'storybook', description: '[coming soon] UI component explorer for frontend devs', hidden: true }),
  }

  showHelp(): void {
    const commandId = Plugin.id;
    const commandArgs = Object.values(Plugin.args);
    const commandFlags = Object.values(Plugin.flags);

    // parse argument config list
    const argsList = commandArgs
      .filter(arg => !arg.hidden)
      .map(arg => {
        const maxSpaces = 15;
        const numOfSpaces = maxSpaces - arg.name.length;

        return `\n\t    ${arg.name}${Array.from({ length: numOfSpaces + 1 }).join(' ')}- ${arg.description}`;
      });

    // parse option config list
    const optionList = commandFlags
      .filter(flag => !flag.hidden)
      .map(flag => {
        const maxSpaces = 8;
        const numOfSpaces = maxSpaces - flag.name.length;

        return `\n\t    --${flag.name} | -${flag.char}${Array.from({ length: numOfSpaces + 1 }).join(' ')}- ${flag.description}`;
      });

    this.log(`
        Usage:
            npx ${chalk.blue('rdvue')} ${commandId} <feature>

        Features: \t - Utilities to create repeatable project elements${argsList}

        Options:${optionList}
    `);
  }

  async run(): Promise<void> {
    const { args } = await this.parse(Plugin);
    const commandArgs = Object.values(args);

    if (commandArgs.length === 0) {
      this.showHelp();
    }

    return Promise.resolve();
  }
}
