import { Files } from './index';
/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// CLI Description interface used in the main index.ts in src folder
export interface CLI {
    general: General;
    [name: string]: ModuleDescriptor;
}

// General types
export interface General {
    menu: Menu[];
}

export interface ModuleDescriptor {
    config?: Config | Project;
    menu?: Menu[];
}
// General Types ended


// Config types for each property that has configuration settings
export interface Config {
    version: number;
    name?: string;
    description?: string;
    arguments?: Arguments[];
    sourceDirectory: string;
    installDirectory?: string;
    files?: Array<string | Files>;
    import?: Import;
    singleUserPerProject?: boolean;
    menu?: Menu[];
}

// Import interface for the files being imported
export interface Import {
    required: string[];
    optional: string[];
}

// Arguments content type
export interface Arguments {
    name: string;
    type: string;
    description: string;
    isPrivate?: boolean;
    message?: string;
    default?: null | string;
}

// Also used in config.ts in src directory
export interface Menu {
    header: string;
    content: string | Content[];
}

// Interface fot the content type
export interface Content {
    name: string;
    summary: string;
    shortcut?: string;
}

// TODO: Refactor along with the option change for the cli description
// Project propery of the CLI description object
export interface Project {
    config: ProjectConfiguration;
}

// Configuration type for the project property
export interface ProjectConfiguration {
    version: number;
    sourceDirectory: string;
    import: Import;
    name: string;
    arguments: Arguments;
}
