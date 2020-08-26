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
    menu?: Menu[];
    group?: boolean;
    features: Feature[];
    plugins?: string[];
    project: TemplateProject;
    groups?: Group[];
    presets?: Preset[];
    customPreset?: CustomPreset;
}


// Features interface
interface Feature {
    name: string;
    private: boolean;
}

// Interface for projects section in template.json
// TODO update this name
interface TemplateProject {
    features: string[];
    plugins: string[];
}
// Base interface for Presets
interface BasePreset {
    name: string;
    description?: string;
}

// Interface for presets
export interface Preset extends BasePreset {
    dependencies: string[];
    plugins: string[];
}

// Interface for custom preset
export interface CustomPreset extends BasePreset {
    groups: string[];

}

// Interface for a feature group
export interface Group {
    plugins: string[];
    name: string;
    isMultipleChoice: boolean;
    modules: string[];
    question: string;
    description: string;
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
