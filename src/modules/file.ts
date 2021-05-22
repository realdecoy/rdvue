export interface Files {
    source: string;
    target: string;
    content?: FilesContent[];
}

export interface FilesContent {
    matchRegex: string;
    replace: string;
}

export type InjectOptions = {
  index?: (lines: string[]) => number | number;
  encoding?: string;
}
