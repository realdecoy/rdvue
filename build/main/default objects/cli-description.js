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
    project: exports.PROJECT_DEFAULT
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWRlc2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RlZmF1bHQgb2JqZWN0cy9jbGktZGVzY3JpcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGtFQUFrRTs7QUFRbEU7OztFQUdFO0FBQ1csUUFBQSxlQUFlLEdBQVk7SUFDcEMsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxFQUFFO1NBQ2Q7S0FDSjtDQUNKLENBQUM7QUFFVyxRQUFBLGVBQWUsR0FBcUI7SUFDN0MsTUFBTSxFQUFFO1FBQ0osT0FBTyxFQUFFLENBQUM7UUFDVixlQUFlLEVBQUUsRUFBRTtRQUNuQixNQUFNLEVBQUU7WUFDSixRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDZCxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDakI7UUFDRCxJQUFJLEVBQUUsRUFBRTtRQUNSLFNBQVMsRUFBRTtZQUNQO2dCQUNJLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2dCQUNSLFdBQVcsRUFBRSxFQUFFO2FBQ2xCO1NBQ0o7S0FDSjtDQUNKLENBQUM7QUFFVyxRQUFBLFdBQVcsR0FBRztJQUN2QixPQUFPLEVBQUUsdUJBQWU7SUFDeEIsT0FBTyxFQUFFLHVCQUFlO0NBQzNCLENBQUMifQ==