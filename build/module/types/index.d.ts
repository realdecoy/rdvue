import { Config } from './cli';
export interface Manifest {
    version: number;
    name: string;
    description: string;
    installDirectory: string;
    sourceDirectory: string;
    files: ManifestFiles[];
    singleUserPerProject?: boolean;
    arguments?: ManifestArguments[];
}
export interface ManifestArguments {
    name: string;
    type: string;
    description: string;
    isPrivate?: boolean;
}
export interface ManifestFiles {
    source: string;
    target: string;
}
export interface Files {
    source: string;
    target: string;
    content?: FilesContent[];
}
export interface FilesContent {
    matchRegex: string;
    replace: string;
}
export interface Command {
    action: string;
    feature: string;
    options: string[];
    featureName?: string;
}
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
