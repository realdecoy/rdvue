import { Files } from './index';
/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// Usage interface
export interface Usage{
    general: GenContinued;
    component: CompContinued;
    service: Coalation;
    model: Coalation;
    page: Coalation;
    config: Coalation;
    store: Coalation;
    project: Coalation;
}

// Reused types
interface GenMenu{
    header: string;
    content?: string | ContentObj[];
    optionList?: List[];
}


// General types
export interface GenContinued{
    menu: GenMenu[];
}

export interface Coalation{
    config?: Config | ProjConf;
    menu?: Menu[];
}
// General Types ended


// Component Types
export interface CompContinued{
    config: Config;
    menu: GenMenu[];
}

// Config types
export interface Config{
    version: number;
    name?: string;
    description?: string;
    arguments?: Argu[];
    sourceDirectory: string;
    installDirectory?: string;
    files?: Array<string|Files>;
    import?: Import;
    singleUserPerProject?: boolean;
    menu?: Menu[];
}

export interface test {
    elem1:number;
    elem2: Array<string|Files>;
}

// Import interface
export interface Import{
    required: string[];
    optional: string[];
}

export interface Argu{
    name: string;
    type: string;
    description: string;
    isPrivate?: boolean;
}


export interface Info{
    matchRegex: string;
    replace: string;
}
// Also used in config.ts in src directory
export interface Menu{
    header: string;
    optionList?: List[];
    content?: string | ContentObj[];
}


export interface ContentObj{
    name: string;
    summary: string;
}

interface List{
    name: string;
    description: string;
}

export interface ProjConf{
    config: ProjConfContinued;
}

export interface ProjConfContinued{
    version: number;
    sourceDirectory: string;
    import: Import;
    name: string;
    arguments: Argu;
}
