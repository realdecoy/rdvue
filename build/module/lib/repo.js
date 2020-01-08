// import chalk from "chalk";
import CLI from "clui";
const Spinner = CLI.Spinner;
const git = require("simple-git/promise")();
async function cloneRemoteRepo(url = null, projectName = null) {
    if (url !== null && projectName !== null) {
        const status = new Spinner("cloning boilerplate files from remote repo...", ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
        status.start();
        return git.silent(true).clone(url, projectName)
            .then(() => {
            status.stop();
            // console.log(chalk.green("[scaffolding completed]\n"));
            return true;
        }).catch((err) => {
            status.stop();
            throw new Error(err.toString());
        });
    }
}
export default {
    cloneRemoteRepo,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmVwby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSw2QkFBNkI7QUFDN0IsT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFDO0FBQ3ZCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDNUIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztBQUU1QyxLQUFLLFVBQVUsZUFBZSxDQUFFLE1BQXFCLElBQUksRUFBRSxjQUE2QixJQUFJO0lBQzFGLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO1FBQ3hDLE1BQU0sTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLCtDQUErQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEgsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDO2FBQzVDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCx5REFBeUQ7WUFDekQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRTtZQUN0QixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0tBQ047QUFDSCxDQUFDO0FBRUQsZUFBZTtJQUNiLGVBQWU7Q0FDaEIsQ0FBQyJ9