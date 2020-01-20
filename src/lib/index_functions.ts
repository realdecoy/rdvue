import {USAGE} from '../index';
import { Coalation, Config, ContentObj, Menu, ProjConf } from '../types/usage';

export function commandAssignment(
    com: string,
    asignee: Config,
    hasAsign: boolean
    ): Coalation | Config
    {
    switch(com){
      case 'general':
        return (hasAsign) ? USAGE.general.config = asignee : USAGE.general;
      case 'component':
        return (hasAsign) ? USAGE.component.config = asignee : USAGE.component;
      case 'service':
        return (hasAsign) ? USAGE.service.config = asignee : USAGE.service;
      case 'model':
        return (hasAsign) ? USAGE.model.config = asignee : USAGE.model;
      case 'page':
        return (hasAsign) ? USAGE.page.config = asignee : USAGE.page;
      case 'config':
        return (hasAsign) ? USAGE.config.config = asignee : USAGE.config;
      case 'store':
        return (hasAsign) ? USAGE.store.config = asignee : USAGE.store;
      case 'project':
        return (hasAsign) ? USAGE.project.config = asignee : USAGE.project;
    default:
        return (hasAsign) ? USAGE.general.config = asignee : USAGE.general;
    }
  }

// USAGE.general.menu
export function contentPopulate(obj: Menu[], name: string, summary: string){
  if(obj[1].content !== undefined){
    let menuContent: ContentObj[];
    menuContent= obj[1].content as ContentObj[];

    menuContent.push({ name, summary });
  }
}

// Index for the module/new
export function commandAssignmentModule(com: string): Config
  {
  switch(com){
    case 'general':
      return USAGE.general.config as Config;
    case 'component':
      return USAGE.component.config as Config;
    case 'service':
      return USAGE.service.config as Config;
    case 'model':
      return USAGE.model.config as Config;
    case 'page':
      return USAGE.page.config as Config;
    case 'config':
      return USAGE.config.config as Config;
    case 'store':
      return USAGE.store.config as Config;
    case 'project':
      return USAGE.project.config as Config;
  default:
      return USAGE.general.config as Config;
  }
}
