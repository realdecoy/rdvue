#!/usr/bin/env node
/**
 * This file is utilized at the start of execution of the program
 */
import chalk from 'chalk';
import clear from 'clear';
import { USAGE_TEMPLATE } from './config';
import { readMainConfig, readSubConfig } from './lib/files';
import * as util from './lib/util';
import { contentPopulate, featureConfigurationAssignment, getFeatureMenu } from './lib/helper-functions';
import * as MODULE_NEW from './modules/new';
import { CLI_DEFAULT } from './default objects/cli-description';
// Assign CLI object a default value
export let CLI_DESCRIPTION = CLI_DEFAULT;
/**
 * Parse commands provided by template manifest files
 * and generate the CLI help menus as well as extract
 * info useful for generating the sub features
 * @param feature - Feature that the user inputed (eg. project, page, component)
 * @param required - Boolean value which tells you if the feature is required or not.
 *                   Required features include 'config' and 'store'
 */
async function populateFeatureMenu(feature, required = false) {
    const index = 2;
    let featureConfig;
    let cliFeature;
    featureConfig = readSubConfig(feature);
    // [1] Based of the feature that the user inputs, the configuration property is populated
    featureConfigurationAssignment(feature, featureConfig);
    // [2] Add feature, under the "Features: " header,
    // to general help text if not required for new project generation
    if (!required) {
        contentPopulate(CLI_DESCRIPTION.general.menu, `${chalk.magenta(feature)}`, `${featureConfig.description}`, index);
    }
    // [3] Assign the configuration for the specified feature
    cliFeature = getFeatureMenu(feature);
    // [4] Create menu specific to a feature entered by user
    // The USAGE_TEMPLATE in ./config.ts is used as base.
    cliFeature.menu = USAGE_TEMPLATE(undefined, undefined, feature, undefined, undefined);
}
/**
 * Description: Adding the necessary information to the Usage object to be used in command execution
 * @param features - acceptable features that can be created with rdvue
 * @param requiredFeatures - features that can't be user requested
 * but are required to create a project (eg. config and store)
 * @param mainConfig - config data populated from template.json.
 * Describes options the tool can take.
 */
async function populateCLIMenu(features, requiredFeatures, mainConfig) {
    const index = 2;
    let featureConfig;
    // [1] Intialize the CLI menu with the USAGE_TEMPLATE (./config.ts)
    CLI_DESCRIPTION.general.menu = USAGE_TEMPLATE();
    CLI_DESCRIPTION.general.menu.splice(index, 0, {
        header: 'Features:',
        content: [],
    });
    // [3] Add project config to CLI_DESCRIPTION
    if (CLI_DESCRIPTION.general.menu[index].content !== undefined) {
        contentPopulate(CLI_DESCRIPTION.general.menu, `${chalk.magenta('project')}`, 'Generate a new project.', index);
    }
    // [4] Parse features provided by template manifest files and generate the CLI help menus
    // for both required and non required features depending on user input
    for (const feature of features) {
        await populateFeatureMenu(feature);
    }
    for (const feature of requiredFeatures) {
        await populateFeatureMenu(feature, true);
    }
    // [5] Add 'project' to list of features input by user
    features.push('project');
    // [6] Creating 'project' features configuration
    featureConfig = mainConfig;
    featureConfig.name = 'project';
    featureConfig.arguments = [
        {
            'name': 'projectName',
            'type': 'string',
            'description': 'the name for the generated project.'
        },
        {
            'name': 'projectNameKebab',
            'type': 'string',
            'description': 'the name in Kebab-case for the generated project.',
            'isPrivate': true
        }
    ];
    // [7] Setting the project config to the newly created featureConfig
    CLI_DESCRIPTION.project.config = featureConfig;
}
async function run() {
    try {
        // [1a] Assign config to object return from JSON parse
        const mainConfig = readMainConfig();
        // [1b] Return list of features if true and empty array if false
        const features = (mainConfig.import !== undefined) ? mainConfig.import.optional : [];
        // [1c] Return value if true and empty array if false
        const requiredFeatures = (mainConfig.import !== undefined) ?
            mainConfig.import.required : [];
        const sliceNumber = 2;
        // [1d] Check for user arguments
        const userArgs = process.argv.slice(sliceNumber);
        let project;
        // [2] Clear the console
        clear();
        // [3] Populate feature usage information
        await populateCLIMenu(features, requiredFeatures, mainConfig);
        // [4] Display "rdvue" heading
        util.heading();
        // [5] Check to see if user arguments include any valid features
        if (util.hasFeature(userArgs, features)) {
            // [6] Puts the user arguments into an object that seperates them into action,
            // feature, option and feature name from format
            // rdvue <action> <feature> <feature name> [options]
            // TODO: TRY CATCH???
            const operation = {
                action: util.parseUserInput(userArgs, features).action,
                feature: `${util.parseUserInput(userArgs, features).feature}`,
                options: util.parseUserInput(userArgs, features).options,
                featureName: util.parseUserInput(userArgs, features).featureName,
            };
            // [6b] Check to see if the project is valid
            project = util.checkProjectValidity(operation);
            if (project.isValid) {
                // [7a] Call the run function in modules/new/index.ts
                await MODULE_NEW.run(operation, CLI_DESCRIPTION);
            }
            else {
                // [7b] Throw an error if this is not a valid project
                throw Error(`'${process.cwd()}' is not a valid Vue project.`);
            }
        }
        else {
            // [6c] Show Help Text if no valid feature/action have been inputted
            // TODO: Throw and error for invalid command
            console.log(util.displayHelp(CLI_DESCRIPTION.general.menu));
        }
        // [6] Force process to exit
        process.exit();
    }
    catch (err) {
        // TODO: Implement more contextual errors
        if (err) {
            console.log(chalk.red(`${err}`));
        }
        process.exit();
    }
}
run()
    .then(() => {
    console.info('info');
})
    .catch((err) => {
    console.error(`Error at run: ${err}`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBOztHQUVHO0FBRUgsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVELE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBRW5DLE9BQU8sRUFBRSxlQUFlLEVBQUUsOEJBQThCLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDekcsT0FBTyxLQUFLLFVBQVUsTUFBTSxlQUFlLENBQUM7QUFFNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBS2hFLG9DQUFvQztBQUNwQyxNQUFNLENBQUMsSUFBSSxlQUFlLEdBQVEsV0FBVyxDQUFDO0FBRTlDOzs7Ozs7O0dBT0c7QUFDSCxLQUFLLFVBQVUsbUJBQW1CLENBQUMsT0FBZSxFQUFFLFFBQVEsR0FBRyxLQUFLO0lBQ2xFLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNoQixJQUFJLGFBQXFCLENBQUM7SUFDMUIsSUFBSSxVQUFxQyxDQUFDO0lBQzFDLGFBQWEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFdkMseUZBQXlGO0lBQ3pGLDhCQUE4QixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUV2RCxrREFBa0Q7SUFDbEQsa0VBQWtFO0lBQ2xFLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDYixlQUFlLENBQ2IsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQzVCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUMzQixHQUFHLGFBQWEsQ0FB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