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
        },
        {
            header: '',
            content: [
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                }
            ]
        },
        {
            header: '',
            optionList: [
                {
                    name: '',
                    description: ''
                },
                {
                    name: '',
                    description: ''
                }
            ]
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
            },
            {
                name: '',
                type: '',
                description: '',
                isPrivate: true
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
            },
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            },
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            },
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            },
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
        },
        {
            header: '',
            content: [
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                }
            ]
        },
        {
            header: '',
            optionList: [
                {
                    name: '',
                    description: ''
                },
                {
                    name: '',
                    description: ''
                }
            ]
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
            },
            {
                name: '',
                type: '',
                description: '',
                isPrivate: true
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
        },
        {
            header: '',
            content: [
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                }
            ]
        },
        {
            header: '',
            optionList: [
                {
                    name: '',
                    description: ''
                },
                {
                    name: '',
                    description: ''
                }
            ]
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
            },
            {
                name: '',
                type: '',
                description: '',
                isPrivate: true
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
        },
        {
            header: '',
            content: [
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                }
            ]
        },
        {
            header: '',
            optionList: [
                {
                    name: '',
                    description: ''
                },
                {
                    name: '',
                    description: ''
                }
            ]
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
            },
            {
                name: '',
                type: '',
                description: '',
                isPrivate: true
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
            },
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            },
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            },
            {
                source: '',
                target: '',
                content: [
                    {
                        matchRegex: '',
                        replace: ''
                    }
                ]
            },
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
        },
        {
            header: '',
            content: [
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                }
            ]
        },
        {
            header: '',
            optionList: [
                {
                    name: '',
                    description: ''
                },
                {
                    name: '',
                    description: ''
                }
            ]
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
            },
            {
                name: '',
                type: '',
                description: '',
                isPrivate: true
            }
        ],
        sourceDirectory: '',
        installDirectory: '',
        files: [
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
            {
                source: '',
                target: ''
            },
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
        },
        {
            header: '',
            content: [
                {
                    name: '',
                    summary: ''
                },
                {
                    name: '',
                    summary: ''
                }
            ]
        },
        {
            header: '',
            optionList: [
                {
                    name: '',
                    description: ''
                },
                {
                    name: '',
                    description: ''
                }
            ]
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
        },
        {
            header: '',
            optionList: [
                {
                    name: '',
                    description: ''
                },
                {
                    name: '',
                    description: ''
                }
            ]
        }
    ]
};

export const PROJECT_DEFAULT: ModuleDescriptor = {
    config: {
        version: 1,
        sourceDirectory: '',
        import: {
            required: ['', ''],
            optional: ['', '', '', '']
        },
        name: '',
        arguments: [
            {
                name: '',
                type: '',
                description: ''
            },
            {
                name: '',
                type: '',
                description: '',
                isPrivate: true
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
