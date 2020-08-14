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
        import: {
            required: [''],
            optional: [''],
            groups: [
                {
                    isRequired: false,
                    promptType: '',
                    name: '',
                    question: '',
                    modules: ['']
                }
            ],
            presets: [{
                dependencies: [''],
                name: ''
            }],
            customPreset: {
                groups: [''],
                name: ''
            }
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
    project: PROJECT_DEFAULT
};
