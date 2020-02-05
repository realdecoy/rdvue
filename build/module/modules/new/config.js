import chalk from 'chalk';
import { DEFAULT_PROJECT_NAME, OPTIONS_ALL, REGEX_PROJECT_NAME, TEMPLATE_PROJECT_URL } from '../../constants/reusable-constants';
import * as files from '../../lib/files';
async function validate(value) {
    const done = this.async();
    if (value.length === 0 || value.match(REGEX_PROJECT_NAME) !== null) {
        done(chalk.red(`You need to enter a valid project name`));
    } //  Directory with specified name already exists
    else if (files.directoryExists(value)) {
        done(chalk.red(`Project with the name ${value} already exists`));
    }
    else {
        done(null, true);
    }
}
function parsePrompts(config) {
    return config.arguments !== undefined ? config.arguments
        .filter((q) => {
        return q.isPrivate === undefined;
    })
        .map((p) => {
        return {
            type: 'input',
            name: p.name,
            message: `Please enter ${p.description}`,
            default: null,
            validate,
        };
    }) : [];
}
const QUESTIONS = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter a name for the project:',
        default: DEFAULT_PROJECT_NAME,
        validate,
    },
    {
        type: 'input',
        name: 'description',
        default: null,
        message: 'Enter a description of the project (optional):'
    }
];
export { TEMPLATE_PROJECT_URL, OPTIONS_ALL, QUESTIONS, parsePrompts, };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbmV3L2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixXQUFXLEVBQ1gsa0JBQWtCLEVBQ2xCLG9CQUFvQixFQUNyQixNQUFNLG9DQUFvQyxDQUFDO0FBQzVDLE9BQU8sS0FBSyxLQUFLLE1BQU0saUJBQWlCLENBQUM7QUFHekMsS0FBSyxVQUFVLFFBQVEsQ0FBWSxLQUFhO0lBQzlDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDO0tBQzNELENBQUMsZ0RBQWdEO1NBQzdDLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsS0FBSyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7S0FDbEU7U0FBTTtRQUNMLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbEI7QUFDSCxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBYztJQUNsQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUztTQUNyRCxNQUFNLENBQUMsQ0FBQyxDQUFZLEVBQUUsRUFBRTtRQUN2QixPQUFPLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDO0lBQ25DLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2QsT0FBTztZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO1lBQ1osT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ3hDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1osQ0FBQztBQUVELE1BQU0sU0FBUyxHQUFVO0lBQ3ZCO1FBQ0UsSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsYUFBYTtRQUNuQixPQUFPLEVBQUUsK0JBQStCO1FBQ3hDLE9BQU8sRUFBRSxvQkFBb0I7UUFDN0IsUUFBUTtLQUNUO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxhQUFhO1FBQ25CLE9BQU8sRUFBRSxJQUFJO1FBQ2IsT0FBTyxFQUFFLGdEQUFnRDtLQUMxRDtDQUNGLENBQUM7QUFFRixPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLFdBQVcsRUFDWCxTQUFTLEVBQ1QsWUFBWSxHQUNiLENBQUMifQ==