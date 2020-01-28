/*
    Types for the config.ts file in the module/new folder
*/

export interface Question{
    type: string;
    name: string;
    message: string;
    default: string | null;
    description?: string;
    validate?(this: object, value: string): boolean | string;
}
