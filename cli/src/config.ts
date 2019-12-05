import chalk from "chalk";

const TEMPLATE_PROJECT_URL: string = "https://avidal_realdecoy@bitbucket.org/realdecoyteam/rd-vue-cli.git";
// const TEMPLATE_PROJECT_URL: string = "https://OHarris23@bitbucket.org/realdecoyteam/rd-vue-cli.git";
// const TEMPLATE_PROJECT_URL: string = "https://sheldonsmall@bitbucket.org/realdecoyteam/rd-vue-cli.git";
const TEMPLATE_PROJECT_NAME: string = "__template";

function USAGE_TEMPLATE(action: string = 'rdvue', command: string = '<feature>', options: string = '[options]'): any[] {
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

export default {
    TEMPLATE_PROJECT_URL,
    TEMPLATE_PROJECT_NAME,
    USAGE_TEMPLATE
}