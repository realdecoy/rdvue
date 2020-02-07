export interface Template {
    version: number;
    sourceDirectory: string;
    import: TemplateImport;
}
export interface TemplateImport {
    required: [string, string];
    optional: [string, string, string, string];
}
