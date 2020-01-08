#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const clear_1 = __importDefault(require("clear"));
const config_1 = __importDefault(require("./config"));
const files_1 = __importDefault(require("./lib/files"));
const util_1 = __importDefault(require("./lib/util"));
const new_1 = __importDefault(require("./modules/new"));
const USAGE = {};
/**
 * Parse commands provided by template manifest files
 * and generate the usage help menus as well as extract
 * info useful for generating the sub features
 */
async function populateCommand(command, required = false) {
    let commandConfig = {};
    commandConfig = await files_1.default.readSubConfig(command);
    USAGE[command] = {};
    USAGE[command].config = commandConfig;
    // Dont add general help text if command is required for new project generation
    if (!required) {
        USAGE.general.menu[1].content.push({
            name: `${chalk_1.default.magenta(command)}`,
            summary: commandConfig.description,
        });
    }
    USAGE[command].menu = config_1.default.USAGE_TEMPLATE(undefined, command, undefined);
    if (commandConfig.arguments !== undefined && commandConfig.arguments !== []) {
        USAGE[command].menu.splice(1, 0, {
            header: 'Arguments',
            content: [],
        });
        for (const argument of commandConfig.arguments) {
            USAGE[command].menu[1].content.push({
                name: `${chalk_1.default.magenta(argument.name)}`,
                summary: argument.description,
            });
        }
    }
}
async function populateUsage(commands, requiredCommands, mainConfig) {
    USAGE.general = {};
    USAGE.general.menu = config_1.default.USAGE_TEMPLATE();
    USAGE.general.menu.splice(1, 0, {
        header: 'Features',
        content: [],
    });
    // Add project config to USAGE
    USAGE.general.menu[1].content.push({
        name: `${chalk_1.default.magenta('project')}`,
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
clear_1.default();
const run = async () => {
    try {
        const mainConfig = await files_1.default.readMainConfig();
        const commands = mainConfig.import.optional;
        const requiredCommands = mainConfig.import.required;
        // Populate command usage information
        await populateUsage(commands, requiredCommands, mainConfig);
        // Check for user arguments
        const userArgs = process.argv.slice(2);
        util_1.default.heading();
        if (util_1.default.hasCommand(userArgs, commands)) {
            const operation = {};
            operation.command = util_1.default.parseCommand(userArgs, commands);
            operation.options = util_1.default.parseOptions(userArgs, commands);
            const project = util_1.default.checkProjectValidity(operation);
            if (project.isValid) {
                await new_1.default.run(operation, USAGE);
            }
            else {
                throw Error(`'${process.cwd()}' is not a valid Vue project.`);
            }
        }
        else { // Show help text
            console.log(util_1.default.displayHelp(USAGE.general.menu));
        }
        process.exit();
    }
    catch (err) {
        if (err) {
            console.log(chalk_1.default.red(`${err}`));
        }
        process.exit();
    }
};
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQUMxQixzREFBOEI7QUFDOUIsd0RBQWdDO0FBQ2hDLHNEQUE4QjtBQUM5Qix3REFBdUM7QUFFdkMsTUFBTSxLQUFLLEdBQVEsRUFBRSxDQUFDO0FBRXRCOzs7O0dBSUc7QUFFSCxLQUFLLFVBQVUsZUFBZSxDQUFDLE9BQWUsRUFBRSxRQUFRLEdBQUcsS0FBSztJQUM5RCxJQUFJLGFBQWEsR0FBUSxFQUFFLENBQUM7SUFDNUIsYUFBYSxHQUFHLE1BQU0sZUFBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO0lBQ3RDLCtFQUErRTtJQUMvRSxJQUFHLENBQUMsUUFBUSxFQUFDO1FBQ1gsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNqQyxJQUFJLEVBQUUsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sRUFBRSxhQUFhLENBQUMsV0FBVztTQUNuQyxDQUFDLENBQUM7S0FDSjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsZ0JBQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRSxJQUFJLGFBQWEsQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLGFBQWEsQ0FBQyxTQUFTLEtBQUssRUFBRSxFQUFFO1FBQzNFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMs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