import { ChangelogConfigTypes, ChangelogMetaDataTypes } from "../lib/changelog";

export type ChangelogResourcesContent = {
    key: string;
    value: string;
    operation: string;
}

export type ChangelogResources = {
    name: string;
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
