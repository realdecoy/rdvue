#!/usr/bin/env node
"use strict";
/**
 * This file is utilized at the start of execution of the program
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const clear_1 = __importDefault(require("clear"));
const config_1 = require("./config");
const files_1 = require("./lib/files");
const util = __importStar(require("./lib/util"));
const helper_functions_1 = require("./lib/helper-functions");
const MODULE_NEW = __importStar(require("./modules/new"));
const cli_description_1 = require("./default objects/cli-description");
// Assign CLI object a default value
exports.CLI_DESCRIPTION = cli_description_1.CLI_DEFAULT;
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
    featureConfig = files_1.readSubConfig(feature);
    // [1] Based of the feature that the user inputs, the configuration property is populated
    helper_functions_1.featureConfigurationAssignment(feature, featureConfig, true);
    // [2] Add feature, under the "Features: " header,
    // to general help text if not required for new project generation
    if (!required) {
        helper_functions_1.contentPopulate(exports.CLI_DESCRIPTION.general.menu, `${chalk_1.default.magenta(feature)}`, `${featureConfig.description}`, index);
    }
    // [3] Assign the configuration for the specified feature
    cliFeature = helper_functions_1.featureConfigurationAssignment(feature, featureConfig, false);
    // [4] Create menu specific to a feature entered by user
    // The USAGE_TEMPLATE in ./config.ts is used as base.
    cliFeature.menu = config_1.USAGE_TEMPLATE(undefined, undefined, feature, undefined, undefined);
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
    exports.CLI_DESCRIPTION.general.menu = config_1.USAGE_TEMPLATE();
    exports.CLI_DESCRIPTION.general.menu.splice(index, 0, {
        header: 'Features:',
        content: [],
    });
    // [3] Add project config to CLI_DESCRIPTION
    if (exports.CLI_DESCRIPTION.general.menu[index].content !== undefined) {
        helper_functions_1.contentPopulate(exports.CLI_DESCRIPTION.general.menu, `${chalk_1.default.magenta('project')}`, 'Generate a new project.', index);
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
    exports.CLI_DESCRIPTION.project.config = featureConfig;
}
async function run() {
    try {
        // [1a] Assign config to object return from JSON parse
        const mainConfig = files_1.readMainConfig();
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
        clear_1.default();
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
                await MODULE_NEW.run(operation, exports.CLI_DESCRIPTION);
            }
            else {
                // [7b] Throw an error if this is not a valid project
                throw Error(`'${process.cwd()}' is not a valid Vue project.`);
            }
        }
        else {
            // [6c] Show Help Text if no valid feature/action have been inputted
            // TODO: Throw and error for invalid command
            console.log(util.displayHelp(exports.CLI_DESCRIPTION.general.menu));
        }
        // [6] Force process to exit
        process.exit();
    }
    catch (err) {
        // TODO: Implement more contextual errors
        if (err) {
            console.log(chalk_1.default.red(`${err}`));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7R0FFRzs7Ozs7Ozs7Ozs7O0FBRUgsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQUMxQixxQ0FBMEM7QUFDMUMsdUNBQTREO0FBQzVELGlEQUFtQztBQUVuQyw2REFBeUY7QUFDekYsMERBQTRDO0FBRTVDLHVFQUFnRTtBQUtoRSxvQ0FBb0M7QUFDekIsUUFBQSxlQUFlLEdBQVEsNkJBQVcsQ0FBQztBQUU5Qzs7Ozs7OztHQU9HO0FBQ0gsS0FBSyxVQUFVLG1CQUFtQixDQUFDLE9BQWUsRUFBRSxRQUFRLEdBQUcsS0FBSztJQUNsRSxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDaEIsSUFBSSxhQUFxQixDQUFDO0lBQzFCLElBQUksVUFBcUMsQ0FBQztJQUMxQyxhQUFhLEdBQUcscUJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2Qyx5RkFBeUY7SUFDekYsaURBQThCLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU3RCxrREFBa0Q7SUFDbEQsa0VBQWtFO0lBQ2xFLElBQUcsQ0FBQyxRQUFRLEVBQUM7UUFDWCxrQ0FBZSxDQUNiLHVCQUFlLENBQUMsT0FBTyxDQUFDLElBQUksRUFDNUIsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQzNCLEdBQUcsYUFBYSxDQUFDLFdBQVcsRUFBRSxFQUM5QixLQUFLLENBQ0osQ0FBQztLQUNMO0lBRUQseURBQXlEO0lBQ3pELFVBQVUsR0FBRyxpREFBOEIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTNFLHdEQUF3RDtJQUN4RCxxREFBcUQ7SUFDckQsVUFBVSxDQUFDLElBQUksR0FBRyx1QkFBYyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFB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