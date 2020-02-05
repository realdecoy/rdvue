import chalk from 'chalk';
import gitUserName from 'git-user-name';
import path from 'path';
import { Menu } from './types/cli';

const TEMPLATE_PROJECT_URL = `https://${gitUserName()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
const CLI_PROJECT_ROOT: string = __dirname;
const TEMPLATE_ROOT: string = path.join(CLI_PROJECT_ROOT, '/../../template');

function USAGE_TEMPLATE(
    service = 'rdvue',
    action = '<action>',
    feature = '<feature>',
    featureName = '<feature name>',
    options = '[options]'): Menu[] {
    return [
        {
            header: 'Usage:',
            content: `$ ${chalk.yellow(service)} ${chalk.green(action)} ${chalk.magenta(feature)} ${chalk.grey(featureName)} ${chalk.cyan(options)}`
        },
        {
            header: 'Actions:',
            content: [
                {
                    name: `${chalk.green('generate')}`,
                    shortcut: `${chalk.green('g')}`,
                    summary: 'Used to create a new module',
                }
            ]
        },
        {
            header: 'Options:',
            content: [
                {
                    name: `${chalk.cyan('--help')}`,
                    shortcut: `${chalk.cyan('-h')}`,
                    summary: 'Used to create a new module',
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
