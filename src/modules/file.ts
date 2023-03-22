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
  // eslint-disable-next-line no-unused-vars
  index?: number | ((lines: string[], filePath: string) => number);
  // eslint-disable-next-line no-undef
  encoding?: BufferEncoding;
}

export type ModuleConfig = {
  name: string;
  moduleTemplatePath: string;
  manifest: any;
}
