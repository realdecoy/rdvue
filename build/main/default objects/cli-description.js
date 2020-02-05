"use strict";
// Default values for the CLI object from the source/index.ts file
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Naming convention for each property follows as
    <Property name>_DEFAULT
*/
exports.GENERAL_DEFAULT = {
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};
exports.COMPONENT_DEFAULT = {
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
exports.SERVICE_DEFAULT = {
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
exports.MODEL_DEFAULT = {
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
exports.PAGE_DEFUALT = {
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
exports.CONFIG_DEFAULT = {
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
exports.STORE_DEFAULT = {
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
exports.PROJECT_DEFAULT = {
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
exports.CLI_DEFAULT = {
    general: exports.GENERAL_DEFAULT,
    component: exports.COMPONENT_DEFAULT,
    service: exports.SERVICE_DEFAULT,
    model: exports.MODEL_DEFAULT,
    page: exports.PAGE_DEFUALT,
    config: exports.CONFIG_DEFAULT,
    store: exports.STORE_DEFAULT,
    project: exports.PROJECT_DEFAULT
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWRlc2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RlZmF1bHQgb2JqZWN0cy9jbGktZGVzY3JpcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGtFQUFrRTs7QUFTbEU7OztFQUdFO0FBQ1csUUFBQSxlQUFlLEdBQVk7SUFDcEMsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxFQUFFO1NBQ2Q7S0FDSjtDQUNKLENBQUM7QUFFVyxRQUFBLGlCQUFpQixHQUFjO0lBQ3hDLE1BQU0sRUFBRTtRQUNKLE9BQU8sRUFBRSxDQUFDO1FBQ1YsSUFBSSxFQUFFLEVBQUU7UUFDUixXQUFXLEVBQUUsRUFBRTtRQUNmLFNBQVMsRUFBRTtZQUNQO2dCQUNJLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2dCQUNSLFdBQVcsRUFBRSxFQUFFO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsRUFBRTtRQUNuQixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLEtBQUssRUFBRTtZQUNIO2dCQUNJLE1BQU0sRUFBRSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxFQUFFO2dCQUNWLE9BQU8sRUFBRTtvQkFDTDt3QkFDSSxVQUFVLEVBQUUsRUFBRTt3QkFDZCxPQUFPLEVBQUUsRUFBRTtxQkFDZDtpQkFDSjthQUNKO1NBQ0o7S0FDSjtJQUNELElBQUksRUFBRTtRQUNGO1lBQ0ksTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsRUFBRTtTQUNkO0tBQ0o7Q0FDSixDQUFDO0FBRVcsUUFBQSxlQUFlLEdBQXNCO0lBQzlDLE1BQU0sRUFBRTtRQUNKLE9BQU8sRUFBRSxDQUFDO1FBQ1YsSUFBSSxFQUFFLEVBQUU7UUFDUixXQUFXLEVBQUUsRUFBRTtRQUNmLFNBQVMsRUFBRTtZQUNQO2dCQUNJLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2dC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