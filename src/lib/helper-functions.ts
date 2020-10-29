/*
  This file contains the functionality being used in the index files both for the modules/new folder
  and also the source folder
*/
import { CLI_DESCRIPTION } from '../index';
import { Config, Content, Menu, ModuleDescriptor, Group } from '../types/cli';

/**
 * Descripton: Based on the feature inputed the function will assign the configuration
 * @param feature - the feature which the user would like the configuration of.
 * example: model, service, page, project etc.
 * @param configration - configuration of the feature
 * or if only the property being requested to be returned
 */
export function featureConfigurationAssignment(
  feature: string,
  configuration: Config
): void {
  CLI_DESCRIPTION[feature] = {};
  CLI_DESCRIPTION[feature].config = configuration;
}

/*
  The content of the object being passed in will be populated
  CLI_DESCRIPTION.general.menu would be passed in for instance

  Used in the src/index folder
*/
export function contentPopulate(
  objectToBePopulated: Menu[],
  name: string,
  summary: string,
  index: number
) {
  if (objectToBePopulated[index].content !== undefined) {
    let menuContent: Content[];
    menuContent = objectToBePopulated[index].content as Content[];

    menuContent.push({ name, summary });
  }
}

/**
 * Description - Used in the index.ts for the module/new folder
 * Returns the configration information for based of the current property being passed in
 * @param feature - feature which youd like to get the configuration of
 */
export function getFeatureConfiguration(feature: string): Config {
  return (CLI_DESCRIPTION[feature].config || CLI_DESCRIPTION.project.config) as Config;
}


/**
 * Description: Helper function for module/new/index.ts for indexing the string given
 * and return the corresponding object property
 * if input is unrecognized then it will return the general object
 * @param feature - The feature of which you would like the menu for
 */
export function getFeatureMenu(feature: string): ModuleDescriptor {
  return CLI_DESCRIPTION[feature] || CLI_DESCRIPTION.general;
}

