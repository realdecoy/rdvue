/*
  This file contains the functionality being used in the index files both for the modules/new folder
  and also the source folder
*/
import { CLI_DESCRIPTION_COMPONENT, CLI_DESCRIPTION_CONFIG, CLI_DESCRIPTION_GENERAL, CLI_DESCRIPTION_MODEL, CLI_DESCRIPTION_PAGE, CLI_DESCRIPTION_PROJECT, CLI_DESCRIPTION_SERVICE, CLI_DESCRIPTION_STORE, } from '../constants/cli-properties';
import { CLI_DESCRIPTION } from '../index';
/**
 * Descripton: Based on the feature inputed the switch would return the property along with
 * the required configuration of that file.
 * @param feature - the feature which the user would like the configuration of.
 * example: model, service, page, project etc.
 * @param configration - configuration of the feature
 * @param hasAssign - determines if the file should be assigned a configuration file
 * or if only the property being requested to be returned
 */
export function featureConfigurationAssignment(feature, configuration, hasAssign) {
    switch (feature) {
        case CLI_DESCRIPTION_GENERAL:
            return CLI_DESCRIPTION.general;
        case CLI_DESCRIPTION_COMPONENT:
            return (hasAssign) ?
                CLI_DESCRIPTION.component.config = configuration : CLI_DESCRIPTION.component;
        case CLI_DESCRIPTION_SERVICE:
            return (hasAssign) ?
                CLI_DESCRIPTION.service.config = configuration : CLI_DESCRIPTION.service;
        case CLI_DESCRIPTION_MODEL:
            return (hasAssign) ?
                CLI_DESCRIPTION.model.config = configuration : CLI_DESCRIPTION.model;
        case CLI_DESCRIPTION_PAGE:
            return (hasAssign) ?
                CLI_DESCRIPTION.page.config = configuration : CLI_DESCRIPTION.page;
        case CLI_DESCRIPTION_CONFIG:
            return (hasAssign) ?
                CLI_DESCRIPTION.config.config = configuration : CLI_DESCRIPTION.config;
        case CLI_DESCRIPTION_STORE:
            return (hasAssign) ?
                CLI_DESCRIPTION.store.config = configuration : CLI_DESCRIPTION.store;
        case CLI_DESCRIPTION_PROJECT:
            return (hasAssign) ?
                CLI_DESCRIPTION.project.config = configuration : CLI_DESCRIPTION.project;
        default:
            return CLI_DESCRIPTION.general;
    }
}
/*
  The content of the object being passed in will be populated
  CLI_DESCRIPTION.general.menu would be passed in for instance

  Used in the src/index folder
*/
export function contentPopulate(objectToBePopulated, name, summary, index) {
    if (objectToBePopulated[index].content !== undefined) {
        let menuContent;
        menuContent = objectToBePopulated[index].content;
        menuContent.push({ name, summary });
    }
}
/**
 * Description - Used in the index.ts for the module/new folder
 * Returns the configration information for based of the current property being passed in
 * @param feature - feature which youd like to get the configuration of
 */
export function getFeatureConfiguration(feature) {
    switch (feature) {
        case CLI_DESCRIPTION_COMPONENT:
            return CLI_DESCRIPTION.component.config;
        case CLI_DESCRIPTION_SERVICE:
            return CLI_DESCRIPTION.service.config;
        case CLI_DESCRIPTION_MODEL:
            return CLI_DESCRIPTION.model.config;
        case CLI_DESCRIPTION_PAGE:
            return CLI_DESCRIPTION.page.config;
        case CLI_DESCRIPTION_CONFIG:
            return CLI_DESCRIPTION.config.config;
        case CLI_DESCRIPTION_STORE:
            return CLI_DESCRIPTION.store.config;
        case CLI_DESCRIPTION_PROJECT:
            return CLI_DESCRIPTION.project.config;
        default:
            return CLI_DESCRIPTION.project.config;
    }
}
/**
 * Description: Helper function for module/new/index.ts for indexing the string given
 * and return the corresponding object property
 * if input is unrecognized then it will return the general object
 * @param feature - The feature of which you would like the menu for
 */
export function getFeatureMenu(feature) {
    switch (feature) {
        case CLI_DESCRIPTION_GENERAL:
            return CLI_DESCRIPTION.general;
        case CLI_DESCRIPTION_COMPONENT:
            return CLI_DESCRIPTION.component;
        case CLI_DESCRIPTION_SERVICE:
            return CLI_DESCRIPTION.service;
        case CLI_DESCRIPTION_MODEL:
            return CLI_DESCRIPTION.model;
        case CLI_DESCRIPTION_PAGE:
            return CLI_DESCRIPTION.page;
        case CLI_DESCRIPTION_CONFIG:
            return CLI_DESCRIPTION.config;
        case CLI_DESCRIPTION_STORE:
            return CLI_DESCRIPTION.store;
        case CLI_DESCRIPTION_PROJECT:
            return CLI_DESCRIPTION.project;
        default:
            return CLI_DESCRIPTION.general;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLWZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVyLWZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0VBR0U7QUFFRixPQUFPLEVBQ0wseUJBQXlCLEVBQ3pCLHNCQUFzQixFQUN0Qix1QkFBdUIsRUFDdkIscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUNwQix1QkFBdUIsRUFDdkIsdUJBQXVCLEVBQ3ZCLHFCQUFxQixHQUN0QixNQUFNLDZCQUE2QixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHM0M7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsOEJBQThCLENBQzVDLE9BQWUsRUFDZixhQUFxQixFQUNyQixTQUFrQjtJQUVsQixRQUFRLE9BQU8sRUFBRTtRQUNmLEtBQUssdUJBQXVCO1lBQzFCLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQztRQUVqQyxLQUFLLHlCQUF5QjtZQUM1QixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO1FBRWpGLEtBQUssdUJBQXVCO1lBQzFCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFFN0UsS0FBSyxxQkFBcUI7WUFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztRQUV6RSxLQUFLLG9CQUFvQjtZQUN2QixPQUFPLENBQUMsU0FBUyxDQUFD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