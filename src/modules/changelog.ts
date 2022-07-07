import { ChangelogConfigTypes, ChangelogMetaDataTypes } from '../lib/changelog';

export type ChangelogResourcesContent = {
    key: string;
    value: any;
    operation: string;
}

export type changeLogFile = {
    source: string;
    target: string;
}

export type ChangelogResource = {
    name: string;
    file?: changeLogFile;
    destPath: string;
    srcPath?: string;
    type: string;
    contents?: ChangelogResourcesContent[]
}

export type ChangelogResources = {
    resources: ChangelogResource[];
}

export type Metadata = {
    version: string;
    type?: ChangelogMetaDataTypes;
    resources?: ChangelogResources[];
};

export type ChangeLog = {
    metadata: Metadata;
    create?: ChangelogResources;
    update?: ChangelogResources;
    delete?: ChangelogResources;
}
