export interface FilesContent {
    matchRegex: string;
    replace: string;
}

export interface Files {
    source: string;
    target: string;
    content?: FilesContent[];
}

export type InjectOptions = {
  index?: number | ((lines: string[]) => number);
  encoding?: string;
}

export type ModuleConfig = {
  name: string;
  moduleTemplatePath: string;
  manifest: any;
}
