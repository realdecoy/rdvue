import gitUserName from 'git-user-name';
import chalk from 'chalk';
import files from '../../lib/files';
const DEFAULT_PROJECT_NAME = 'my-vue-app';
const REGEX_PROJECT_NAME = /^\s+$/;
async function validate(value) {
    let done = this.async();
    if (value.length == 0 || value.match(REGEX_PROJECT_NAME)) {
        done(chalk.red(`You need to enter a valid project name`));
        return;
    } //  Directory with specified name already exists
    else if (files.directoryExists(value)) {
        done(chalk.red(`Project with the name ${value} already exists`));
        return;
    }
    else {
        done(null, true);
    }
}
function parsePrompts(config) {
    return config.arguments ? config.arguments
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
const TEMPLATE_PROJECT_URL = `https://${gitUserName()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
const OPTIONS_ALL = ['--new'];
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
export default {
    TEMPLATE_PROJECT_URL,
    OPTIONS_ALL,
    QUESTIONS,
    parsePrompts,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbmV3L2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFdBQVcsTUFBTSxlQUFlLENBQUE7QUFDdkMsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sS0FBSyxNQUFNLGlCQUFpQixDQUFDO0FBRXBDLE1BQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQzFDLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDO0FBRW5DLEtBQUssVUFBVSxRQUFRLENBQVksS0FBYTtJQUM5QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEIsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7UUFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDO1FBQzFELE9BQU87S0FDUixDQUFDLGdEQUFnRDtTQUM3QyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMseUJBQXlCLEtBQUssaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLE9BQU87S0FDUjtTQUFNO1FBQ0wsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNsQjtBQUNILENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxNQUFXO0lBQy9CLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVM7U0FDdkMsTUFBTSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUU7UUFDakIsT0FBTyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQztJQUNuQyxDQUFDLENBQUM7U0FDRCxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUNkLE9BQU87WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSTtZQUNaLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLFdBQVcsRUFBRTtZQUN4QyxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVE7U0FDVCxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFFRCxNQUFNLG9CQUFvQixHQUFXLFdBQVcsV0FBVyxFQUFFLDZDQUE2QyxDQUFDO0FBQzNHLE1BQU0sV0FBVyxHQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFeEMsTUFBTSxTQUFTLEdBQVU7SUFDdkI7UUFDRSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxhQUFhO1FBQ25CLE9BQU8sRUFBRSwrQkFBK0I7UUFDeEMsT0FBTyxFQUFFLG9CQUFvQjtRQUM3QixRQUFRO0tBQ1Q7SUFDRDtRQUNFLElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLElBQUk7UUFDYixPQUFPLEVBQUUsZ0RBQWdEO0tBQzFEO0NBQ0YsQ0FBQztBQUVGLGVBQWU7SUFDYixvQkFBb0I7SUFDcEIsV0FBVztJQUNYLFNBQVM7SUFDVCxZQUFZO0NBQ2IsQ0FBQyJ9