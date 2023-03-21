import { Help } from '@oclif/core';
import { Topic } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import { log } from './lib/stdout';

export default class MyHelpClass extends Help {
  // display help for a command
  // eslint-disable-next-line require-await, @typescript-eslint/explicit-module-boundary-types
  async showCommandHelp(command: any): Promise<void> {
    // console.log(command);
    const commandId = command.id;
    const commandArgs = Object.values(command.args);
    const commandFlags = Object.values(command.flags);

    // parse argument config list
    const argsList = commandArgs
      .filter((arg: any) => !arg.hidden)
      .map((arg: any) => {
        const maxSpaces = 15;
        const numOfSpaces = maxSpaces - arg.name.length;

        return `\n\t    ${arg.name}${Array.from({ length: numOfSpaces + 1 }).join(' ')}- ${arg.description}`;
      });

    // parse option config list
    const optionList = commandFlags
      .filter((flag: any) => !flag.hidden)
      .map((flag: any) => {
        const maxSpaces = 8;
        const numOfSpaces = maxSpaces - flag.name.length;

        return `\n\t    --${flag.name} | -${flag.char}${Array.from({ length: numOfSpaces + 1 }).join(' ')}- ${flag.description}`;
      });

    log(`
        Command:
            npx ${chalk.blue('rdvue')} ${commandId} <feature>

        Features:${argsList}

        Options:${optionList}`);
  }

  formatRoot(): string {
    return `
        Usage:
            npx ${chalk.blue('rdvue')} <action>`;
  }

  // the formatting for a list of topics
  protected formatTopics(_topics: Topic[]): string {
    return '\t----------------------------------------------------';
  }

  // the formatting for a list of commands
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  formatCommands(commands: any): string {
    // parse argument config list
    const argsList = commands
      .filter((arg: any) => !arg.hidden)
      .map((arg: any) => {
        const maxSpaces = 15;
        const numOfSpaces = maxSpaces - arg.id.length;

        return `\n\t    ${arg.id}${Array.from({ length: numOfSpaces + 1 }).join(' ')}- ${arg.description}`;
      });

    return `\tActions:${argsList}

    \tOptions:
    \t    --help | -h ${Array.from({ length: 9 }).join(' ')}`;
  }

  // the formatting for an individual command
  formatCommand(): string {
    return '';
  }
}
