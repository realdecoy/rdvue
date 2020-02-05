// Default values for the CLI object from the source/index.ts file
/*
    Naming convention for each property follows as
    <Property name>_DEFAULT
*/
export const GENERAL_DEFAULT = {
    menu: [
        {
            header: '',
            content: ''
        }
    ]
};
export const COMPONENT_DEFAULT = {
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
export const SERVICE_DEFAULT = {
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
export const MODEL_DEFAULT = {
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
export const PAGE_DEFUALT = {
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
export const CONFIG_DEFAULT = {
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
export const STORE_DEFAULT = {
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
export const PROJECT_DEFAULT = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWRlc2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RlZmF1bHQgb2JqZWN0cy9jbGktZGVzY3JpcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0VBQWtFO0FBU2xFOzs7RUFHRTtBQUNGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBWTtJQUNwQyxJQUFJLEVBQUU7UUFDRjtZQUNJLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFLEVBQUU7U0FDZDtLQUNKO0NBQ0osQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFjO0lBQ3hDLE1BQU0sRUFBRTtRQUNKLE9BQU8sRUFBRSxDQUFDO1FBQ1YsSUFBSSxFQUFFLEVBQUU7UUFDUixXQUFXLEVBQUUsRUFBRTtRQUNmLFNBQVMsRUFBRTtZQUNQO2dCQUNJLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2dCQUNSLFdBQVcsRUFBRSxFQUFFO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsRUFBRTtRQUNuQixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLEtBQUssRUFBRTtZQUNIO2dCQUNJLE1BQU0sRUFBRSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxFQUFFO2dCQUNWLE9BQU8sRUFBRTtvQkFDTDt3QkFDSSxVQUFVLEVBQUUsRUFBRTt3QkFDZCxPQUFPLEVBQUUsRUFBRTtxQkFDZDtpQkFDSjthQUNKO1NBQ0o7S0FDSjtJQUNELElBQUksRUFBRTtRQUNGO1lBQ0ksTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsRUFBRTtTQUNkO0tBQ0o7Q0FDSixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFzQjtJQUM5QyxNQUFNLEVBQUU7UUFDSixPQUFPLEVBQUUsQ0FBQztRQUNWLElBQUksRUFBRSxFQUFFO1FBQ1IsV0FBVyxFQUFFLEVBQUU7UUFDZixTQUFTLEVBQUU7WUFDUDtnQkFDSSxJQUFJLEVBQUUs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