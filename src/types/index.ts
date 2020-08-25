import { Config, ConfigurationRoutes, ConfigurationGenericProperty } from './cli';

/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// Type based of the manifest.json file in the templates folder
export interface Manifest{
    version: number;
    name: string;
    description: string;
    installDirectory: string;
    sourceDirectory: string;
    files: ManifestFiles[];
    singleUserPerProject?: boolean;
    arguments?: ManifestArguments[];
    group?: boolean;
    packages?: Dependencies;
    routes?: ConfigurationRoutes[];
    stores?: string[];
    vueOptions?: ConfigurationGenericProperty;
    modules?: ConfigurationGenericProperty;
}

export interface Dependencies {
    dependencies: string[];
    devDependencies: string[];
}

export interface ManifestArguments{
    name: string;
    type: string;
    description: string;
    isPrivate?: boolean;
}

export interface ManifestFiles{
    source: string;
    target: string;
}

// Files based of the model.json files
export interface Files{
    source: string;
    target: string;
    content?: FilesContent[];
}

// Content for the files type
export interface FilesContent{
    matchRegex: string;
    replace: string;
}


// Command type for the commands being input
// used in the src/lib/util.ts & src/index.ts
export interface Command{
    action: string;
    feature: string;
    options: string[];
    featureName?: string;
}

// The interfaces below are being used in ./modules/new/index.ts

/**
 * Used to specify both source directories and destination directories
 * in file operations. eg: copyAndUpdateFiles()
 */
export interface Directories {
    sourceDir: string;
    installDir: string;
}

/**
 * Used to store both the pascal and kebab cases of the feature name
 * specified by the user arguments
 */
export interface FeatureNameObject {
    [key: string]: string;
}

/**
 * The input necessary to obtain the correct source and install directories
 * to be utilized for the specific feature requested by user.
 */
export interface GetDirectoryInput {
    featureNameStore: FeatureNameObject;
    currentConfig: Config;
    kebabNameKey: string;
    isConfig: boolean;
    isStore: boolean;
    projectRoot: string | null;
    userFeature: string;
}
