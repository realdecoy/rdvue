import {Command, flags} from '@oclif/command'
import chalk from 'chalk'

export default class Add extends Command {
  static description = 'add a new module'

  static flags = {
    help: flags.help({name: 'help', char: 'h', hidden: false}),
  }

  static args = [
    {name: 'component', description: 'component module', hidden: false},
    {name: 'page', description: 'page module', hidden: false},
    {name: 'service', description: 'service module', hidden: false},
    {name: 'store', description: 'store module', hidden: false},
  ]

  showHelp() {
    const commandId = Add.id;
    const commandArgs = Add.args;
    const commandFlags = Object.values(Add.flags);

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
            npx ${chalk.yellow('rdvue')} ${commandId}:<feature>

        Features:${argsList}    
        
        Options:${optionList}
    `)
  }

  async run() {
    this.showHelp();
  }
}
