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
    project: PROJECT_DEFAULT
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWRlc2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RlZmF1bHQgb2JqZWN0cy9jbGktZGVzY3JpcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0VBQWtFO0FBUWxFOzs7RUFHRTtBQUNGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBWTtJQUNwQyxJQUFJLEVBQUU7UUFDRjtZQUNJLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFLEVBQUU7U0FDZDtLQUNKO0NBQ0osQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBcUI7SUFDN0MsTUFBTSxFQUFFO1FBQ0osT0FBTyxFQUFFLENBQUM7UUFDVixlQUFlLEVBQUUsRUFBRTtRQUNuQixNQUFNLEVBQUU7WUFDSixRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDZCxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDakI7UUFDRCxJQUFJLEVBQUUsRUFBRTtRQUNSLFNBQVMsRUFBRTtZQUNQO2dCQUNJLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2dCQUNSLFdBQVcsRUFBRSxFQUFFO2FBQ2xCO1NBQ0o7S0FDSjtDQUNKLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUc7SUFDdkIsT0FBTyxFQUFFLGVBQWU7SUFDeEIsT0FBTyxFQUFFLGVBQWU7Q0FDM0IsQ0FBQyJ9