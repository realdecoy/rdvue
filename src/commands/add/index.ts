import { Command, flags } from '@oclif/command';
import chalk from 'chalk';

export default class Add extends Command {
  static description = 'add a new module'

  static flags = {
    help: flags.help({ name: 'help', char: 'h', hidden: false }),
  }

  static args = [
    { name: 'component', description: 'component module', hidden: false },
    { name: 'page', description: 'page module', hidden: false },
    { name: 'service', description: 'service module', hidden: false },
    { name: 'store', description: 'store module', hidden: false },
    { name: 'layout', description: 'layout module', hidden: false },
  ]

  showHelp(): void {
    const commandId = Add.id;
    const commandArgs = Add.args;
    const commandFlags = Object.values(Add.flags);

    // parse argument config list
    const argsList = commandArgs
      .filter(arg => !arg.hidden)
      .map(arg => {
        const maxSpaces = 15;
        const numOfSpaces = maxSpaces - arg.name.length;

        return `\n\t    ${arg.name}${new Array(numOfSpaces + 1).join(' ')}- ${arg.description}`;
      });

    // parse option config list
    const optionList = commandFlags
      .filter(flag => !flag.hidden)
      .map(flag => {
        const maxSpaces = 8;
        const numOfSpaces = maxSpaces - flag.name.length;

        return `\n\t    --${flag.name} | -${flag.char}${new Array(numOfSpaces + 1).join(' ')}- ${flag.description}`;
      });

    this.log(`
        Usage:
            npx ${chalk.blue('rdvue')} ${commandId}:<feature>

        Features: \t - Utilities to create repeatable project elements${argsList}    
        
        Options:${optionList}
    `);
  }

  run(): Promise<void> {
    this.showHelp();

    return Promise.resolve();
  }
}
