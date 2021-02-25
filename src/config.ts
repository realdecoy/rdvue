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
    plugin = '<plugin>',
    pluginGroup = '<plugin group>',
    projectName = '<project-name>',
    featureName = '<feature-name>'): Menu[] {
    return [
        {
            header: '',
            content: `npx ${chalk.yellow(service)} ${chalk.green(action)} [${chalk.yellow(feature)}${chalk.red('|')}${chalk.yellow(plugin)}${chalk.red('|')}${chalk.yellow(pluginGroup)}] [${chalk.magenta(projectName)}${chalk.red('|')}${chalk.grey(featureName)}]`
        },
        {
            header: 'Actions:',
            content: [
                {
                    name: `${chalk.green('generate | g')}`,
                    shortcut: '-',
                    summary: 'Creates new Feature,',

                },
                {
                    name: `${chalk.green('add')}`,
                    shortcut: '-',
                    summary: 'Add a Plugin to a project.',
                },
                {
                    name: `${chalk.green('add-group')}`,
                    shortcut: '-',
                    summary: 'Add a Plugin to a project by selecting from preset groups.',
                }
            ]
        },
        {
            header: 'Options:',
            content: [
                {
                    name: `${chalk.cyan('--help | -h')}`,
                    shortcut: '-',
                    summary: 'Show help information.',
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
