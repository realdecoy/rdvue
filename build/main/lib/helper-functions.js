"use strict";
/*
  This file contains the functionality being used in the index files both for the modules/new folder
  and also the source folder
*/
Object.defineProperty(exports, "__esModule", { value: true });
const cli_properties_1 = require("../constants/cli-properties");
const index_1 = require("../index");
/**
 * Descripton: Based on the feature inputed the switch would return the property along with
 * the required configuration of that file.
 * @param feature - the feature which the user would like the configuration of.
 * example: model, service, page, project etc.
 * @param configration - configuration of the feature
 * @param hasAssign - determines if the file should be assigned a configuration file
 * or if only the property being requested to be returned
 */
function featureConfigurationAssignment(feature, configuration, hasAssign) {
    switch (feature) {
        case cli_properties_1.CLI_DESCRIPTION_GENERAL:
            return index_1.CLI_DESCRIPTION.general;
        case cli_properties_1.CLI_DESCRIPTION_COMPONENT:
            return (hasAssign) ?
                index_1.CLI_DESCRIPTION.component.config = configuration : index_1.CLI_DESCRIPTION.component;
        case cli_properties_1.CLI_DESCRIPTION_SERVICE:
            return (hasAssign) ?
                index_1.CLI_DESCRIPTION.service.config = configuration : index_1.CLI_DESCRIPTION.service;
        case cli_properties_1.CLI_DESCRIPTION_MODEL:
            return (hasAssign) ?
                index_1.CLI_DESCRIPTION.model.config = configuration : index_1.CLI_DESCRIPTION.model;
        case cli_properties_1.CLI_DESCRIPTION_PAGE:
            return (hasAssign) ?
                index_1.CLI_DESCRIPTION.page.config = configuration : index_1.CLI_DESCRIPTION.page;
        case cli_properties_1.CLI_DESCRIPTION_CONFIG:
            return (hasAssign) ?
                index_1.CLI_DESCRIPTION.config.config = configuration : index_1.CLI_DESCRIPTION.config;
        case cli_properties_1.CLI_DESCRIPTION_STORE:
            return (hasAssign) ?
                index_1.CLI_DESCRIPTION.store.config = configuration : index_1.CLI_DESCRIPTION.store;
        case cli_properties_1.CLI_DESCRIPTION_PROJECT:
            return (hasAssign) ?
                index_1.CLI_DESCRIPTION.project.config = configuration : index_1.CLI_DESCRIPTION.project;
        default:
            return index_1.CLI_DESCRIPTION.general;
    }
}
exports.featureConfigurationAssignment = featureConfigurationAssignment;
/*
  The content of the object being passed in will be populated
  CLI_DESCRIPTION.general.menu would be passed in for instance

  Used in the src/index folder
*/
function contentPopulate(objectToBePopulated, name, summary, index) {
    if (objectToBePopulated[index].content !== undefined) {
        let menuContent;
        menuContent = objectToBePopulated[index].content;
        menuContent.push({ name, summary });
    }
}
exports.contentPopulate = contentPopulate;
/**
 * Description - Used in the index.ts for the module/new folder
 * Returns the configration information for based of the current property being passed in
 * @param feature - feature which youd like to get the configuration of
 */
function getFeatureConfiguration(feature) {
    switch (feature) {
        case cli_properties_1.CLI_DESCRIPTION_COMPONENT:
            return index_1.CLI_DESCRIPTION.component.config;
        case cli_properties_1.CLI_DESCRIPTION_SERVICE:
            return index_1.CLI_DESCRIPTION.service.config;
        case cli_properties_1.CLI_DESCRIPTION_MODEL:
            return index_1.CLI_DESCRIPTION.model.config;
        case cli_properties_1.CLI_DESCRIPTION_PAGE:
            return index_1.CLI_DESCRIPTION.page.config;
        case cli_properties_1.CLI_DESCRIPTION_CONFIG:
            return index_1.CLI_DESCRIPTION.config.config;
        case cli_properties_1.CLI_DESCRIPTION_STORE:
            return index_1.CLI_DESCRIPTION.store.config;
        case cli_properties_1.CLI_DESCRIPTION_PROJECT:
            return index_1.CLI_DESCRIPTION.project.config;
        default:
            return index_1.CLI_DESCRIPTION.project.config;
    }
}
exports.getFeatureConfiguration = getFeatureConfiguration;
/**
 * Description: Helper function for module/new/index.ts for indexing the string given
 * and return the corresponding object property
 * if input is unrecognized then it will return the general object
 * @param feature - The feature of which you would like the menu for
 */
function getFeatureMenu(feature) {
    switch (feature) {
        case cli_properties_1.CLI_DESCRIPTION_GENERAL:
            return index_1.CLI_DESCRIPTION.general;
        case cli_properties_1.CLI_DESCRIPTION_COMPONENT:
            return index_1.CLI_DESCRIPTION.component;
        case cli_properties_1.CLI_DESCRIPTION_SERVICE:
            return index_1.CLI_DESCRIPTION.service;
        case cli_properties_1.CLI_DESCRIPTION_MODEL:
            return index_1.CLI_DESCRIPTION.model;
        case cli_properties_1.CLI_DESCRIPTION_PAGE:
            return index_1.CLI_DESCRIPTION.page;
        case cli_properties_1.CLI_DESCRIPTION_CONFIG:
            return index_1.CLI_DESCRIPTION.config;
        case cli_properties_1.CLI_DESCRIPTION_STORE:
            return index_1.CLI_DESCRIPTION.store;
        case cli_properties_1.CLI_DESCRIPTION_PROJECT:
            return index_1.CLI_DESCRIPTION.project;
        default:
            return index_1.CLI_DESCRIPTION.general;
    }
}
exports.getFeatureMenu = getFeatureMenu;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLWZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVyLWZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztFQUdFOztBQUVGLGdFQVNxQztBQUNyQyxvQ0FBMkM7QUFHM0M7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQiw4QkFBOEIsQ0FDNUMsT0FBZSxFQUNmLGFBQXFCLEVBQ3JCLFNBQWtCO0lBRWxCLFFBQVEsT0FBTyxFQUFFO1FBQ2YsS0FBSyx3Q0FBdUI7WUFDMUIsT0FBTyx1QkFBZSxDQUFDLE9BQU8sQ0FBQztRQUVqQyxLQUFLLDBDQUF5QjtZQUM1QixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsdUJBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsdUJBQWUsQ0FBQyxTQUFTLENBQUM7UUFFakYsS0FBSyx3Q0FBdUI7WUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLHVCQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLHVCQUFlLENBQUMsT0FBTyxDQUFDO1FBRTdFLEtBQUssc0NBQXFCO1lBQ3hCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNsQix1QkFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyx1QkFBZSxDQUFDLEtBQUssQ0FBQztRQUV6RSxLQUFLLHFDQUFvQjtZQUN2QixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsdUJBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsdUJBQWUsQ0FBQyxJQUFJLENBQUM7UUFFdkUsS0FBSyx1Q0FBc0I7WUFDekIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JB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