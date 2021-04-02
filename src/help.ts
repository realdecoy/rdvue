import Help from '@oclif/plugin-help';
import {Command, Topic} from '@oclif/config';
import chalk from 'chalk'

export default class MyHelpClass extends Help {
    // acts as a 'router'
    // and based on the args it receives
    // calls one of showRootHelp, showTopicHelp,
    // or showCommandHelp
    showRootHelp(): void {
        console.log(`
        npx ${chalk.yellow('rdvue')} <action> [<project-name>|<feature-name>]

        Actions:
            create-project -  Scaffold a new rdvue project.
            add:<feature>  -  Add a feature to a project.
            
        Features:        -  Utilities to create repeatable project elements.
            component      -  add a new Component module.
            page           -  add a new Page module.
            service        -  add a new Service module.
            store          -  add a new Store module.
            
        Options:
            --help | -h    -  Show help information.`
        )
    }
    

    showTopicHelp(topic: Topic) {
        const name = topic.name
        const depth = name.split(':').length
    
        const subTopics = this.sortedTopics.filter(t => t.name.startsWith(name + ':') && t.name.split(':').length === depth + 1)
        const commands = this.sortedCommands.filter(c => c.id.startsWith(name + ':') && c.id.split(':').length === depth + 1)
    
        console.log(this.formatTopic(topic))
    
        if (subTopics.length > 0) {
          console.log(this.formatTopics(subTopics))
          console.log('')
        }
    
        if (commands.length > 0) {
          console.log(this.formatCommands(commands))
          console.log('')
        }
    }

    // display help for a command
    showCommandHelp(command: Command): void {
        const commandId = command.id;
        const commandArgs = command.args;
        const commandFlags = Object.values(command.flags);

        // parse argument names
        const argNames = commandArgs
        .filter((arg) => !arg.hidden)
        .map((arg) => `<${arg.name}>` )

        // parse argument config list
        const argsList = commandArgs
        .filter((arg) => !arg.hidden)
        .map((arg) => {
            const maxSpaces = 15;
            const numOfSpaces = maxSpaces - arg.name.length
            return `\n\t    ${arg.name}${Array(numOfSpaces + 1).join(' ')}- ${arg.description}`
        })

        // parse option names
        const optionNames = commandFlags
        .filter((flag) => !flag.hidden)
        .map((flag) => ` ${flag.name}` )

        // parse option config list
        const optionList = commandFlags
        .filter((flag) => !flag.hidden)
        .map((flag) => {
            const maxSpaces = 8;
            const numOfSpaces = maxSpaces - flag.name.length
            return `\n\t    --${flag.name} | -${flag.char}${Array(numOfSpaces + 1).join(' ')}- ${flag.description}`
        })

        console.log(`
        Usage:
            npx ${chalk.yellow('rdvue')} ${commandId} ${argNames}

        Arguments:${argsList}    
        
        Options:${optionList}`)
    }
}