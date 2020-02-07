import { Config, Menu, ModuleDescriptor } from '../types/cli';
/**
 * Descripton: Based on the feature inputed the switch would return the property along with
 * the required configuration of that file.
 * @param feature - the feature which the user would like the configuration of.
 * example: model, service, page, project etc.
 * @param configration - configuration of the feature
 * @param hasAssign - determines if the file should be assigned a configuration file
 * or if only the property being requested to be returned
 */
export declare function featureConfigurationAssignment(feature: string, configuration: Config, hasAssign: boolean): ModuleDescriptor | Config;
export declare function contentPopulate(objectToBePopulated: Menu[], name: string, summary: string, index: number): void;
/**
 * Description - Used in the index.ts for the module/new folder
 * Returns the configration information for based of the current property being passed in
 * @param feature - feature which youd like to get the configuration of
 */
export declare function getFeatureConfiguration(feature: string): Config;
/**
 * Description: Helper function for module/new/index.ts for indexing the string given
 * and return the corresponding object property
 * if input is unrecognized then it will return the general object
 * @param feature - The feature of which you would like the menu for
 */
export declare function getFeatureMenu(feature: string): ModuleDescriptor;
