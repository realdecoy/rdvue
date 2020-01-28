/*
    Types for the config.ts file in the module/new folder
    for the answer and question object

    not used at the moment
*/

export interface Question{
    type: string;
    name: string;
    message: string;
    default: string | null;
    description?: string;
    validate?(this: object, value: string): boolean | string;
}
