import { Help } from '@oclif/plugin-help';
import { Command, Topic } from '@oclif/config';
import chalk from 'chalk';
import { log } from './lib/stdout';

export default class MyHelpClass extends Help {
  // acts as a 'router'
  // and based on the args it receives
  // calls one of showRootHelp, showTopicHelp,
  // or showCommandHelp
  showRootHelp(): void {
    log(`
        npx ${chalk.blue('rdvue')} <action>

        Actions:
            create-project   -  Scaffold a new rdvue project
            add              -  Add a feature to a project
            plugin           -  Inject a utility to extend project functionality
            upgrade          -  Specify the rdvue template version for a project
            
        Options:
            --help | -h      -  Show help information
        `,
    );
  }

  showTopicHelp(topic: Topic): void {
    const name = topic.name;
    const depth = name.split(':').length;

    const subTopics = this.sortedTopics.filter((t: any) => t.name.startsWith(`${name}:`) && t.name.split(':').length === depth + 1);
    const commands = this.sortedCommands.filter((c: any) => c.id.startsWith(`${name}:`) && c.id.split(':').length === depth + 1);

    log(this.formatTopic(topic));

    if (subTopics.length > 0) {
      log(this.formatTopics(subTopics));
      log('');
    }

    if (commands.length > 0) {
      log(this.formatCommands(commands));
      log('');
    }
  }

  // display help for a command
  showCommandHelp(command: Command): void {
    const commandId = command.id;
    const commandArgs = command.args;
    const commandFlags = Object.values(command.flags);

    // parse argument names
    const argNames = commandArgs
      .filter(arg => !arg.hidden)
      .map(arg => `<${arg.name}>`);

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

    log(`
        Usage:
            npx ${chalk.blue('rdvue')} ${commandId} ${argNames}

        Arguments:${argsList}    
        
        Options:${optionList}`);
  }
}
