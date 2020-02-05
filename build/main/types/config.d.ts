export interface Question {
    type: string;
    name: string;
    message: string;
    default: string | null;
    description?: string;
    validate?(this: object, value: string): boolean | string;
}
