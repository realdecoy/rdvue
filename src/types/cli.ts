import { Files } from './index';
/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// Usage interface
export interface CLI{
    general: General;
    component: Component;
    service: MenuAndConfiguration;
    model: MenuAndConfiguration;
    page: MenuAndConfiguration;
    config: MenuAndConfiguration;
    store: MenuAndConfiguration;
    project: MenuAndConfiguration;
}

// Reused types
interface GenralMenu{
    header: string;
    content?: string | Content[];
    optionList?: List[];
}


// General types
export interface General{
    menu: GenralMenu[];
}

export interface MenuAndConfiguration{
    config?: Config | ProjectConfiguration;
    menu?: Menu[];
}
// General Types ended


// Component Types
export interface Component{
    config: Config;
    menu: GenralMenu[];
}

// Config types
export interface Config{
    version: number;
    name?: string;
    description?: string;
    arguments?: Arguments[];
    sourceDirectory: string;
    installDirectory?: string;
    files?: Array<string|Files>;
    import?: Import;
    singleUserPerProject?: boolean;
    menu?: Menu[];
}

// Import interface
export interface Import{
    required: string[];
    optional: string[];
}

export interface Arguments{
    name: string;
    type: string;
    description: string;
    isPrivate?: boolean;
    message?: string;
    default?: null | string;
}

// Also used in config.ts in src directory
export interface Menu{
    header: string;
    optionList?: List[];
    content?: string | Content[];
}


export interface Content{
    name: string;
    summary: string;
}

interface List{
    name: string;
    description: string;
}

export interface ProjectConfiguration{
    config: ProjectConfigurationContinued;
}

export interface ProjectConfigurationContinued{
    version: number;
    sourceDirectory: string;
    import: Import;
    name: string;
    arguments: Arguments;
}
