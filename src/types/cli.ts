import { Files, Dependencies } from './index';
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
    group?: boolean;
    packages?: Dependencies;
    routes?: ConfigurationRoutes[];
    stores?: string[];
    vueOptions?: ConfigurationGenericProperty;
    modules?: ConfigurationGenericProperty;
}

// Generic string property
export interface ConfigurationGenericProperty {
    [key: string]: string;

}


// Base interface for Presets
export interface BasePreset {
    name: string;
    description?: string;
}

// Interface for presets
export interface Preset extends BasePreset {
    dependencies: string[];
}

// Interface for custom preset
export interface CustomPreset extends BasePreset {
    groups: string[];
}

// Routes property for the feature being called
export interface ConfigurationRoutes {
    name: string;
    path: string;
    component: string;
}
// Interface for a feature group
export interface Group {
    promptType: string;
    isMultipleChoice: boolean;
    name: string;
    modules: string[];
    question: string;
}
// Import interface for the files being imported
export interface Import {
    required: string[];
    optional: string[];
    groups: Group[];
    presets?: Preset[];
    customPreset?: CustomPreset;
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

// Configuration type for <npm-programmatic> package
export interface NpmProgrammaticConfiguration {
    cwd: string;
    save?: boolean;
    saveDev?: boolean;
    global?: boolean;
    noOptional?: boolean;
    legacyBundling?: boolean;
    output?: boolean;
}
