const chalk = require("chalk");


module.exports = {
    COMMANDS: ['new', 'generate'],
    USAGE: [
    {
        header: 'Synopsis:',
        content: `$ ${chalk.yellow('rdvue')} ${chalk.magenta('<command>')} ${chalk.cyan('[options]')}`,
    },
    {
        header: 'Commands:',
        content: [
        {
            name: `${chalk.magenta('new')}`,
            summary: 'create new vue project powered by rdvue'
        },
        {
            name: `${chalk.magenta('generate')}`,
            summary: 'generates and/or modifies files based on a schematic.'
        }
        ]
    },
    {
        header: 'Options:',
        optionList: [
        {
            name: `${chalk.cyan('help')}`,
            description: 'Print this usage guide.'
        }
        ]
    }
    ]
} 
