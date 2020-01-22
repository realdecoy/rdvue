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
