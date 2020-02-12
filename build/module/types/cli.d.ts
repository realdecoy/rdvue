import { Files } from './index';
export interface CLI {
    general: General;
    [name: string]: ModuleDescriptor;
}
export interface General {
    menu: Menu[];
}
export interface ModuleDescriptor {
    config?: Config | Project;
    menu?: Menu[];
}
export interface Config {
    version: number;
    name?: string;
    description?: string;
    arguments?: Arguments[];
    sourceDirectory: string;
    installDirectory?: string;
    files?: Array<string | Files>;
    import?: Import;
    singleUserPerProject?: boolean;
    menu?: Menu[];
}
export interface Import {
    required: string[];
    optional: string[];
}
export interface Arguments {
    name: string;
    type: string;
    description: string;
    isPrivate?: boolean;
    message?: string;
    default?: null | string;
}
export interface Menu {
    header: string;
    content: string | Content[];
}
export interface Content {
    name: string;
    summary: string;
    shortcut?: string;
}
export interface Project {
    config: ProjectConfiguration;
}
export interface ProjectConfiguration {
    version: number;
    sourceDirectory: string;
    import: Import;
    name: string;
    arguments: Arguments;
}
