// Default values for the CLI object from the source/index.ts file

// Types that determines what should be present in each default object imported
import {
    Component,
    General,
    ModuleDescriptor
} from '../types/cli';

/*
    Naming convention for each property follows as
    <Property name>_DEFAULT
*/
export const GENERAL_DEFAULT: General = {
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};

export const COMPONENT_DEFAULT: Component = {
    config: {
        version: 1,
        name: '',
        description: '',
        arguments: [
            {
                name: '',
                type: '',
                description: ''
            }
        ],
        sourceDirectory: '',
        installDirectory: '',
        files: [
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            }
        ]
    },
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};

export const SERVICE_DEFAULT: ModuleDescriptor =  {
    config: {
        version: 1,
        name: '',
        description: '',
        arguments: [
            {
                name: '',
                type: '',
                description: ''
            }
        ],
        sourceDirectory: '',
        installDirectory: '',
        files: [
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            }
        ]
    },
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};

export const MODEL_DEFAULT: ModuleDescriptor = {
    config: {
        version: 1,
        name: '',
        description: '',
        arguments: [
            {
                name: '',
                type: '',
                description: ''
            }
        ],
        sourceDirectory: '',
        installDirectory: '',
        files: [
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            }
        ]
    },
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};

export const PAGE_DEFUALT: ModuleDescriptor = {
    config: {
        version: 1,
        name: '',
        description: '',
        arguments: [
            {
                name: '',
                type: '',
                description: ''
            }
        ],
        sourceDirectory: '',
        installDirectory: '',
        files: [
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            }
        ]
    },
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};

export const CONFIG_DEFAULT: ModuleDescriptor = {
    config: {
        version: 1,
        name: '',
        description: '',
        singleUserPerProject: true,
        arguments: [
            {
                name: '',
                type: '',
                description: ''
            }
        ],
        sourceDirectory: '',
        installDirectory: '',
        files: [
            {
                source: '',
                target: ''
            }
        ]
    },
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};

export const STORE_DEFAULT: ModuleDescriptor = {
    config: {
        version: 1,
        name: '',
        description: '',
        singleUserPerProject: true,
        sourceDirectory: '',
        installDirectory: '',
        files: [
            '',
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            }
        ]
    },
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};

export const PROJECT_DEFAULT: ModuleDescriptor = {
    config: {
        version: 1,
        sourceDirectory: '',
        import: {
            required: [''],
            optional: ['']
        },
        name: '',
        arguments: [
            {
                name: '',
                type: '',
                description: ''
            }
        ]
    }
};

export const CLI_DEFAULT = {
    general: GENERAL_DEFAULT,
    component: COMPONENT_DEFAULT,
    service: SERVICE_DEFAULT,
    model: MODEL_DEFAULT,
    page: PAGE_DEFUALT,
    config: CONFIG_DEFAULT,
    store: STORE_DEFAULT,
    project: PROJECT_DEFAULT
};
