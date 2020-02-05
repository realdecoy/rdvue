/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// MainConfig return object
export interface Template{
    version: number;
    sourceDirectory: string;
    import: TemplateImport;
}

export interface TemplateImport{
    required: [string, string];
    optional: [string, string, string, string];
}
