/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// Usage interface
export interface Usage{
    general: Coalation;
    component: Coalation;
    service: Coalation;
    model: Coalation;
    page: Coalation;
    config: Coalation;
    store: Coalation;
    project: Coalation;
}

// interface GenContinued{
//     menu: GenMenu[];
// }
// interface GenMenu{}
export interface Coalation{
    config?: Config | ProjConf;
    menu?: Menu[];
}
export interface Config{
    version: number;
    name?: string;
    description?: string;
    arguments?: Argu[];
    sourceDirectory: string;
    installDirectory?: string;
    files?: ConfFiles[] | [string, ConfFiles];
    import?: Import;
    singleUserPerProject?: boolean;
    menu?: Menu[];
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

export interface ConfFiles{
    source: string;
    target: string;
    content: Info[];
}

export interface Info{
    matchRegex: string;
    replace: string;
}
// Also used in config.ts in src directory
export interface Menu{
    header: string;
    optionList: List[];
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
