/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// SubConfig return Obj
interface Manifest{
    version: number;
    name: string;
    description: string;
    singleUserPerProject: boolean;
    arguments: [ManifestArguments];
    sourceDirectory: string;
    installDirectory: string;
    files: [ManifestFiles];
}

interface ManifestArguments{
    name: string;
    type: string;
    description: string;
    isPrivate?: boolean;
}

interface ManifestFiles{
    source: string;
    target: string;
}

// MainConfig return object
interface Template{
    version: number;
    sourceDirectory: string;
    import: TemplateImport;
}

interface TemplateImport{
    required: [string, string];
    optional: [string, string, string, string];
}

// Model interface
interface Files{
    source: string;
    target: string;
    content: [FilesContent];
}

interface FilesContent{
    matchRegex: string;
    replace: string;
}


export{
    Manifest,
    Template,
    Files
};
