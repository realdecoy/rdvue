import chalk from 'chalk';
import gitUserName from 'git-user-name';
import path from 'path';

const TEMPLATE_PROJECT_URL = `https://${gitUserName()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
const CLI_PROJECT_ROOT: string = __dirname;
const TEMPLATE_ROOT: string = path.join(CLI_PROJECT_ROOT, '/../../template');

function USAGE_TEMPLATE(
    action = 'rdvue',
    command = '<feature>',
    options = '[options]'): object[] {
    return [
        {
            header: 'Usage:',
            content: `$ ${chalk.yellow(action)} ${chalk.magenta(command)} ${chalk.cyan(options)}`,
        },
        {
            header: 'Options:',
            optionList: [
                {
                    name: `${chalk.cyan('new')}`,
                    description: 'explicitly create a new feature (optional).'
                },
                {
                    name: `${chalk.cyan('help')}`,
                    description: 'Show this usage guide.'
                }
            ]
        }
    ];
}

export {
    TEMPLATE_PROJECT_URL,
    USAGE_TEMPLATE,
    CLI_PROJECT_ROOT,
    TEMPLATE_ROOT,
};
