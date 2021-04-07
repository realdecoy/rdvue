import {Command, flags} from '@oclif/command'
import chalk from 'chalk'

export default class Plugin extends Command {
  static description = 'add a new module'

  static flags = {
    help: flags.help({name: 'help', char: 'h', hidden: false}),
  }

  static args = [
    {name: 'buefy', description: 'lightweigth UI components for Vue.js', hidden: false},
    {name: 'storybook', description: 'UI component explorer for frontend devs', hidden: true},
    {name: 'vuetify', description: 'material design framework for Vue.js', hidden: true},
    {name: 'localization', description: 'library for localizing content', hidden: false},
  ]

  showHelp() {
    const commandId = Plugin.id;
    const commandArgs = Plugin.args;
    const commandFlags = Object.values(Plugin.flags);

    // parse argument config list
    const argsList = commandArgs
    .filter((arg) => !arg.hidden)
    .map((arg) => {
        const maxSpaces = 15;
        const numOfSpaces = maxSpaces - arg.name.length
        return `\n\t    ${arg.name}${Array(numOfSpaces + 1).join(' ')}- ${arg.description}`
    })
    .toString()
    .split(',')
    .join('')

    // parse option config list
    const optionList = commandFlags
    .filter((flag) => !flag.hidden)
    .map((flag) => {
        const maxSpaces = 8;
        const numOfSpaces = maxSpaces - flag.name.length
        return `\n\t    --${flag.name} | -${flag.char}${Array(numOfSpaces + 1).join(' ')}- ${flag.description}`
    })
    .toString()
    .split(',')
    .join('')

    this.log(`
        Usage:
            npx ${chalk.blue('rdvue')} ${commandId}:<library>

        Libraries:${argsList}    
        
        Options:${optionList}
    `)
  }

  async run() {
    this.showHelp();
  }
}
