#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import CONFIG from './config';
import files from './lib/files';
import util from './lib/util';
import MODULE_NEW from './modules/new';
const USAGE = {};
/**
 * Parse commands provided by template manifest files
 * and generate the usage help menus as well as extract
 * info useful for generating the sub features
 */
async function populateCommand(command, required = false) {
    let commandConfig = {};
    commandConfig = await files.readSubConfig(command);
    USAGE[command] = {};
    USAGE[command].config = commandConfig;
    // Dont add general help text if command is required for new project generation
    if (!required) {
        USAGE.general.menu[1].content.push({
            name: `${chalk.magenta(command)}`,
            summary: commandConfig.description,
        });
    }
    USAGE[command].menu = CONFIG.USAGE_TEMPLATE(undefined, command, undefined);
    if (commandConfig.arguments !== undefined && commandConfig.arguments !== []) {
        USAGE[command].menu.splice(1, 0, {
            header: 'Arguments',
            content: [],
        });
        for (const argument of commandConfig.arguments) {
            USAGE[command].menu[1].content.push({
                name: `${chalk.magenta(argument.name)}`,
                summary: argument.description,
            });
        }
    }
}
async function populateUsage(commands, requiredCommands, mainConfig) {
    USAGE.general = {};
    USAGE.general.menu = CONFIG.USAGE_TEMPLATE();
    USAGE.general.menu.splice(1, 0, {
        header: 'Features',
        content: [],
    });
    // Add project config to USAGE
    USAGE.general.menu[1].content.push({
        name: `${chalk.magenta('project')}`,
        summary: 'Generate a new project.',
    });
    for (const command of commands) {
        await populateCommand(command);
    }
    for (const command of requiredCommands) {
        await populateCommand(command, true);
    }
    commands.push('project');
    let commandConfig = {};
    USAGE.project = {};
    commandConfig = mainConfig;
    commandConfig.name = 'project';
    commandConfig.arguments = [
        {
            'name': 'projectName',
            'type': 'string',
            'description': 'The name for the generated project.'
        },
        {
            'name': 'projectNameKebab',
            'type': 'string',
            'description': 'The name in Kebab-case for the generated project.',
            'isPrivate': true
        }
    ];
    USAGE.project.config = commandConfig;
}
clear();
const run = async () => {
    try {
        const mainConfig = await files.readMainConfig();
        const commands = mainConfig.import.optional;
        const requiredCommands = mainConfig.import.required;
        // Populate command usage information
        await populateUsage(commands, requiredCommands, mainConfig);
        // Check for user arguments
        const userArgs = process.argv.slice(2);
        util.heading();
        if (util.hasCommand(userArgs, commands)) {
            const operation = {};
            operation.command = util.parseCommand(userArgs, commands);
            operation.options = util.parseOptions(userArgs, commands);
            const project = util.checkProjectValidity(operation);
            if (project.isValid) {
                await MODULE_NEW.run(operation, USAGE);
            }
            else {
                throw Error(`'${process.cwd()}' is not a valid Vue project.`);
            }
        }
        else { // Show help text
            console.log(util.displayHelp(USAGE.general.menu));
        }
        process.exit();
    }
    catch (err) {
        if (err) {
            console.log(chalk.red(`${err}`));
        }
        process.exit();
    }
};
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBQzlCLE9BQU8sS0FBSyxNQUFNLGFBQWEsQ0FBQztBQUNoQyxPQUFPLElBQUksTUFBTSxZQUFZLENBQUM7QUFDOUIsT0FBTyxVQUFVLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE1BQU0sS0FBSyxHQUFRLEVBQUUsQ0FBQztBQUV0Qjs7OztHQUlHO0FBRUgsS0FBSyxVQUFVLGVBQWUsQ0FBQyxPQUFlLEVBQUUsUUFBUSxHQUFHLEtBQUs7SUFDOUQsSUFBSSxhQUFhLEdBQVEsRUFBRSxDQUFDO0lBQzVCLGFBQWEsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNwQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztJQUN0QywrRUFBK0U7SUFDL0UsSUFBRyxDQUFDLFFBQVEsRUFBQztRQUNYLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDakMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyxPQUFPLEVBQUUsYUFBYSxDQUFDLFdBQVc7U0FDbkMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRSxJQUFJLGFBQWEsQ0FBQyxTQUFT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