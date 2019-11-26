const chalk = require("chalk");
const git = require("simple-git/promise")();
const CLI = require("clui");
const Spinner = CLI.Spinner;

module.exports = {
  cloneRemoteRepo: async (url = null, projectName = null) => {
    if (url !== null && projectName !== null) {
      const status = new Spinner("cloning boilerplate files from remote repo...", ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
      status.start();
      return git.silent(true).clone(url, projectName)
        .then((result) => {
          status.stop();
          console.log(chalk.green("[scaffolding completed]\n"));
          return true;
        }).catch((err) => {
          status.stop();
          throw new Error(err);
        });
    }
  }
};
