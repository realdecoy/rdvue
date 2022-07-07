import { ChangelogConfigTypes, ChangelogMetaDataTypes } from "../lib/changelog";

export type ChangelogResourcesContent = {
    key: string;
    value: any;
    operation: string;
}

export type changeLogFile = {
    source: string;
    target: string;
} 

export type ChangelogResources = {
    name?: string;
    file?: changeLogFile;
    destPath: string;
    srcPath?: string;
    type: string;
    contents?: ChangelogResourcesContent[]
}

export type ChangeLog = {
    [key in ChangelogConfigTypes]: {
        version?: string;
        type?: ChangelogMetaDataTypes;
        resources?: ChangelogResources[];
    };
}
