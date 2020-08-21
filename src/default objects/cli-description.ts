// Default values for the CLI object from the source/index.ts file

// Types that determines what should be present in each default object imported
import {
    General,
    ModuleDescriptor,
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

export const PROJECT_DEFAULT: ModuleDescriptor = {
    config: {
        version: 1,
        sourceDirectory: '',
        features: [{
            name: '',
            private: false
        }],
        plugins: [''],
        project: {
            features: [''],
            plugins: ['']
        },
        groups: [{
            promptType: '',
            plugins: [''],
            name: '',
            isMultipleChoice: false,
            modules: [''],
            question: '',
            description: ''
        }],
        import: {
            required: [''],
            optional: [''],
            groups: [
                {
                    isMultipleChoice: false,
                    description: '',
                    promptType: '',
                    name: '',
                    question: '',
                    modules: ['']
                }
            ],
            presets: [{
                dependencies: [''],
                plugins: [''],
                name: ''
            }],
            customPreset: {
                groups: [''],
                name: ''
            }
        },
        presets: [{
            name: '',
            dependencies: [''],
            plugins: [''],
        }
        ],
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
    project: PROJECT_DEFAULT
};
