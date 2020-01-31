/*
  This file contains the functionality being used in the index files both for the modules/new folder
  and also the source folder
*/

import {
  CLI_DESCRIPTION_COMPONENT,
  CLI_DESCRIPTION_CONFIG,
  CLI_DESCRIPTION_GENERAL,
  CLI_DESCRIPTION_MODEL,
  CLI_DESCRIPTION_PAGE,
  CLI_DESCRIPTION_PROJECT,
  CLI_DESCRIPTION_SERVICE,
  CLI_DESCRIPTION_STORE,
} from '../constants/cli-properties';
import { CLI_DESCRIPTION } from '../index';
import { Config, Content, Menu, ModuleDescriptor } from '../types/cli';

/*
 Command given would be a property of the  cli object.
 Based of that command the switch would return the property along with
 the configuration of that file updated to the configuration passed in.

 hasAssign determines if the file should be assigned a configuration file
 or if only the property being requested to be returned
*/
export function commandAssignment(
  command: string,
  configuration: Config,
  hasAssign: boolean,
): ModuleDescriptor | Config {
  switch (command) {
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

/*
  * Used in the inndex for the module/new folder
  * Returns the configration information for based of the current property being passed in
*/
export function commandAssignmentModule(command: string): Config {
  switch (command) {
    case CLI_DESCRIPTION_COMPONENT:
      return CLI_DESCRIPTION.component.config;

    case CLI_DESCRIPTION_SERVICE:
      return CLI_DESCRIPTION.service.config as Config;

    case CLI_DESCRIPTION_MODEL:
      return CLI_DESCRIPTION.model.config as Config;

    case CLI_DESCRIPTION_PAGE:
      return CLI_DESCRIPTION.page.config as Config;

    case CLI_DESCRIPTION_CONFIG:
      return CLI_DESCRIPTION.config.config as Config;

    case CLI_DESCRIPTION_STORE:
      return CLI_DESCRIPTION.store.config as Config;

    case CLI_DESCRIPTION_PROJECT:
      return CLI_DESCRIPTION.project.config as Config;

    default:
      return CLI_DESCRIPTION.project.config as Config;
  }
}

/*
  Helper function for module/new/index.ts for indexing the string given
  and return the corresponding object property

  if input is unrecognized then it will return the general object
*/
export function menuAssignment(propertyName: string): ModuleDescriptor{
  switch(propertyName){
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

