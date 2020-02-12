import chalk from 'chalk';
import { DEFAULT_PROJECT_NAME, OPTIONS_ALL, REGEX_PROJECT_NAME, TEMPLATE_PROJECT_URL } from '../../constants/constants';
import * as files from '../../lib/files';
// tslint:disable-next-line
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
// tslint:disable-next-line
function parsePrompts(config) {
    return config.arguments !== undefined ? config.arguments
        .filter((q) => {
        return q.isPrivate === undefined;
    })
        // tslint:disable-next-line
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
// tslint:disable-next-line
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbmV3L2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixXQUFXLEVBQ1gsa0JBQWtCLEVBQ2xCLG9CQUFvQixFQUNyQixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sS0FBSyxLQUFLLE1BQU0saUJBQWlCLENBQUM7QUFHekMsMkJBQTJCO0FBQzNCLEtBQUssVUFBVSxRQUFRLENBQVksS0FBYTtJQUM5QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2xFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQztLQUMzRCxDQUFDLGdEQUFnRDtTQUM3QyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMseUJBQXlCLEtBQUssaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0tBQ2xFO1NBQU07UUFDTCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQztBQUVELDJCQUEyQjtBQUMzQixTQUFTLFlBQVksQ0FBQyxNQUFjO0lBQ2xDLE9BQU8sTUFBTSxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTO1NBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQVksRUFBRSxFQUFFO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUM7SUFDbkMsQ0FBQyxDQUFDO1FBQ0YsMkJBQTJCO1NBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2QsT0FBTztZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO1lBQ1osT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ3hDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1osQ0FBQztBQUVELDJCQUEyQjtBQUMzQixNQUFNLFNBQVMsR0FBVTtJQUN2QjtRQUNFLElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLCtCQUErQjtRQUN4QyxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLFFBQVE7S0FDVDtJQUNEO1FBQ0UsSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsYUFBYTtRQUNuQixPQUFPLEVBQUUsSUFBSTtRQUNiLE9BQU8sRUFBRSxnREFBZ0Q7S0FDMUQ7Q0FDRixDQUFDO0FBRUYsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixXQUFXLEVBQ1gsU0FBUyxFQUNULFlBQVksR0FDYixDQUFDIn0=