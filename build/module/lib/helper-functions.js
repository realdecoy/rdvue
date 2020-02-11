/*
  This file contains the functionality being used in the index files both for the modules/new folder
  and also the source folder
*/
import { CLI_DESCRIPTION } from '../index';
/**
 * Descripton: Based on the feature inputed the function will assign the configuration
 * @param feature - the feature which the user would like the configuration of.
 * example: model, service, page, project etc.
 * @param configration - configuration of the feature
 * or if only the property being requested to be returned
 */
export function featureConfigurationAssignment(feature, configuration) {
    CLI_DESCRIPTION[feature] = {};
    CLI_DESCRIPTION[feature].config = configuration;
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
    return (CLI_DESCRIPTION[feature].config || CLI_DESCRIPTION.project.config);
}
/**
 * Description: Helper function for module/new/index.ts for indexing the string given
 * and return the corresponding object property
 * if input is unrecognized then it will return the general object
 * @param feature - The feature of which you would like the menu for
 */
export function getFeatureMenu(feature) {
    return CLI_DESCRIPTION[feature] || CLI_DESCRIPTION.general;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLWZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVyLWZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0VBR0U7QUFDRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRzNDOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSw4QkFBOEIsQ0FDNUMsT0FBZSxFQUNmLGFBQXFCO0lBRXJCLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDOUIsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUM7QUFDbEQsQ0FBQztBQUVEOzs7OztFQUtFO0FBQ0YsTUFBTSxVQUFVLGVBQWUsQ0FDN0IsbUJBQTJCLEVBQzNCLElBQVksRUFDWixPQUFlLEVBQ2YsS0FBYTtJQUViLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtRQUNwRCxJQUFJLFdBQXNCLENBQUM7UUFDM0IsV0FBVyxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQW9CLENBQUM7UUFFOUQsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDO0FBQ0gsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsdUJBQXVCLENBQUMsT0FBZTtJQUNyRCxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBVyxDQUFDO0FBQ3ZGLENBQUM7QUFHRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUMsT0FBZTtJQUM1QyxPQUFPLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDO0FBQzdELENBQUMifQ==