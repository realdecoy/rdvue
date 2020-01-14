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
    content: [FilesContent]
}

interface FilesContent{
    matchRegex: string;
    replace: string;
}

// Usage interface
interface USAGE{
    menu: [Menu];
}

interface Menu{
    header: string;
    optionList: [List];
    content?: string | [Content];
}

interface Content{
    header: string;
    content: [ContentObj]
}

interface ContentObj{
    name: string;
    summary: string;
}

interface List{
    name: string;
    description: string;
}

export{
    USAGE,
    Manifest,
    Template,
    Files
};
