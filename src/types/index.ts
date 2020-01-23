import { Config } from '../types/usage';

/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// SubConfig return Obj
export interface Manifest{
    version: number;
    name: string;
    description: string;
    installDirectory: string;
    sourceDirectory: string;
    files: ManifestFiles[];
    singleUserPerProject?: boolean;
    arguments?: ManifestArguments[];
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

// Model interface
export interface Files{
    source: string;
    target: string;
    content?: FilesContent[];
}

export interface FilesContent{
    matchRegex: string;
    replace: string;
}

export interface Command{
    command: string;
    options: string[];
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
export interface featureNameObject {
    [key: string]: string;
}

/**
 * The input necessary to obtain the correct source and install directories
 * to be utilized for the specific feature requested by user.
 */
export interface GetDirectoryInput {
    featureNameStore: featureNameObject;
    currentConfig: Config;
    kebabNameKey: string;
    isConfig: boolean;
    isStore: boolean;
    projectRoot: string | null;
    userCommand: string;
}
