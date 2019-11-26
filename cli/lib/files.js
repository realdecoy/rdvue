const _ = require("lodash");
const chalk = require("chalk");
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require("path");
const CLI = require("clui");
const Spinner = CLI.Spinner;

function readFile(filePath) {
  return fs.readFileAsync(filePath, "utf-8");
}

function updateFile(filePath, file, placeholder, value) {
  r = new RegExp(placeholder, "g");
  var newValue = file.replace(r, value);
  console.log(chalk.green(`...updating ${filePath}`));

  return fs.writeFile(filePath, newValue, "utf-8", () => {});
}

function readAllFiles(filelist, projectName) {
  let promises = [];
  if (projectName !== null && projectName !== undefined) {
    for (const fileName of filelist) {
      const filePath = `./${projectName}/${fileName}`;
      console.log(chalk.yellow(`...reading ${filePath}`));
      promises.push({
        filePath,
        data: readFile(filePath)
      });
    }
  }
  return Promise.all(promises);
}

function updateAllFiles(allFiles, placeholder, value) {
  let promises = [];
  for (const file of allFiles) {
    promises.push(file.data.then((result) => {
      return updateFile(file.filePath, result, placeholder, value);
    }));
  }
  return Promise.all(promises);
}

function directoryExists(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

function getFilesOnly(filelist, projectName) {
  return filelist.filter((fileName) => {
    const filePath = `./${projectName}/${fileName}`;
    return !directoryExists(filePath)
  })
}

module.exports = {
  directoryExists: directoryExists,
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },
  readWriteProjectAsync: async (projectName = null, templateVariable = null) => {
    if (projectName !== null && templateVariable !== null) {
      const status = new Spinner("updating template files from boilerplate...", ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
      let filelist = [];

      status.start();
      
      filelist = getFilesOnly(_.without(fs.readdirSync(`./${projectName}/`), ".git", ".gitignore", "package-lock.json"), projectName);

      return readAllFiles(filelist, projectName).then((allFiles) => {
        return updateAllFiles(allFiles, templateVariable, projectName).then((result) => {
          status.stop();
          return true
        });
      }).catch((err) => {
        status.stop();
        return err
      });
    }
  },
};
