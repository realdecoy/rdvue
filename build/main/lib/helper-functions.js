"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  This file contains the functionality being used in the index files both for the modules/new folder
  and also the source folder
*/
const index_1 = require("../index");
/**
 * Descripton: Based on the feature inputed the function will assign the configuration
 * @param feature - the feature which the user would like the configuration of.
 * example: model, service, page, project etc.
 * @param configration - configuration of the feature
 * or if only the property being requested to be returned
 */
function featureConfigurationAssignment(feature, configuration) {
    index_1.CLI_DESCRIPTION[feature] = {};
    index_1.CLI_DESCRIPTION[feature].config = configuration;
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
    return (index_1.CLI_DESCRIPTION[feature].config || index_1.CLI_DESCRIPTION.project.config);
}
exports.getFeatureConfiguration = getFeatureConfiguration;
/**
 * Description: Helper function for module/new/index.ts for indexing the string given
 * and return the corresponding object property
 * if input is unrecognized then it will return the general object
 * @param feature - The feature of which you would like the menu for
 */
function getFeatureMenu(feature) {
    return index_1.CLI_DESCRIPTION[feature] || index_1.CLI_DESCRIPTION.general;
}
exports.getFeatureMenu = getFeatureMenu;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLWZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVyLWZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7RUFHRTtBQUNGLG9DQUEyQztBQUczQzs7Ozs7O0dBTUc7QUFDSCxTQUFnQiw4QkFBOEIsQ0FDNUMsT0FBZSxFQUNmLGFBQXFCO0lBRXJCLHVCQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzlCLHVCQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztBQUNsRCxDQUFDO0FBTkQsd0VBTUM7QUFFRDs7Ozs7RUFLRTtBQUNGLFNBQWdCLGVBQWUsQ0FDN0IsbUJBQTJCLEVBQzNCLElBQVksRUFDWixPQUFlLEVBQ2YsS0FBYTtJQUViLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtRQUNwRCxJQUFJLFdBQXNCLENBQUM7UUFDM0IsV0FBVyxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQW9CLENBQUM7UUFFOUQsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDO0FBQ0gsQ0FBQztBQVpELDBDQVlDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLHVCQUF1QixDQUFDLE9BQWU7SUFDckQsT0FBTyxDQUFDLHVCQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLHVCQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBVyxDQUFDO0FBQ3ZGLENBQUM7QUFGRCwwREFFQztBQUdEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLE9BQWU7SUFDNUMsT0FBTyx1QkFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLHVCQUFlLENBQUMsT0FBTyxDQUFDO0FBQzdELENBQUM7QUFGRCx3Q0FFQyJ9