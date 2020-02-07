#!/usr/bin/env node
/**
 * This file is utilized at the start of execution of the program
 */
import chalk from 'chalk';
import clear from 'clear';
import { USAGE_TEMPLATE } from './config';
import { readMainConfig, readSubConfig } from './lib/files';
import * as util from './lib/util';
import { contentPopulate, featureConfigurationAssignment } from './lib/helper-functions';
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
    featureConfigurationAssignment(feature, featureConfig, true);
    // [2] Add feature, under the "Features: " header,
    // to general help text if not required for new project generation
    if (!required) {
        contentPopulate(CLI_DESCRIPTION.general.menu, `${chalk.magenta(feature)}`, `${featureConfig.description}`, index);
    }
    // [3] Assign the configuration for the specified feature
    cliFeature = featureConfigurationAssignment(feature, featureConfig, false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBOztHQUVHO0FBRUgsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVELE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBRW5DLE9BQU8sRUFBRSxlQUFlLEVBQUUsOEJBQThCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RixPQUFPLEtBQUssVUFBVSxNQUFNLGVBQWUsQ0FBQztBQUU1QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFLaEUsb0NBQW9DO0FBQ3BDLE1BQU0sQ0FBQyxJQUFJLGVBQWUsR0FBUSxXQUFXLENBQUM7QUFFOUM7Ozs7Ozs7R0FPRztBQUNILEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxPQUFlLEVBQUUsUUFBUSxHQUFHLEtBQUs7SUFDbEUsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksYUFBcUIsQ0FBQztJQUMxQixJQUFJLFVBQXFDLENBQUM7SUFDMUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2Qyx5RkFBeUY7SUFDekYsOEJBQThCLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU3RCxrREFBa0Q7SUFDbEQsa0VBQWtFO0lBQ2xFLElBQUcsQ0FBQyxRQUFRLEVBQUM7UUFDWCxlQUFlLENBQ2IsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQzVCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUMzQixHQUFHLGFBQWEsQ0FB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