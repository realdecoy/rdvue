
// import chalk from "chalk";
import CLI from "clui";
const Spinner = CLI.Spinner;
const git = require("simple-git/promise")();

async function cloneRemoteRepo (url: string | null = null, projectName: string | null = null): Promise<any> {
  if (url !== null && projectName !== null) {
    const status = new Spinner("cloning boilerplate files from remote repo...", ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
    status.start();
    return git.silent(true).clone(url, projectName)
      .then(() => {
        status.stop();
        // console.log(chalk.green("[scaffolding completed]\n"));
        return true;
      }).catch((err: Error) => {
        status.stop();
        throw new Error(err.toString());
      });
  }
}

export default {
  cloneRemoteRepo,
};
