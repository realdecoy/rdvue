
export interface Files {
    source: string;
    target: string;
    content?: FilesContent[];
}

export interface FilesContent {
    matchRegex: string;
    replace: string;
}

export interface Lookup {
    [name: string]: any;
}
