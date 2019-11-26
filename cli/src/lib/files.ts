import _ from "lodash";
import chalk from "chalk";
import bluebirdPromise from "bluebird";
import fileSystem from "fs";
import path from "path";
import CLI from "clui";
import rimraf from "rimraf";
import util from "util";

const Spinner = CLI.Spinner;
const fs = bluebirdPromise.promisifyAll(fileSystem);
const copyFilePromise = util.promisify(fs.copyFile);

function readFile(filePath: string) {
  return fs.readFileSync(filePath, "utf-8");
}

function replaceFileName(fileName: string, placeholder: RegExp, value: string): string {
  const r = new RegExp(placeholder, "g");
  console.log(`filename: ${fileName}`);
  const response = fileName.replace(r, value);
  return response;
}

async function updateFile(filePath: string, file: any, placeholder: string, value: string) {
  const r = new RegExp(placeholder, "g");
  console.log(`filePath: ${filePath}`);
  var newValue = file.replace(r, value);
  console.log(r , newValue);
  console.log(chalk.green(`...updating ${filePath}`));
  fs.writeFileSync(filePath, newValue, "utf-8");
}

/**
 * Read files that have been copied to target destination
 * and replace template values with input recieved form user
 * through prompts
 */
async function readAndUpdateFeatureFiles(path: string, fileList: any[], value: string) {
  if (path !== null && fileList !== undefined) {
    for (const file of fileList) {
      const filePath = `${path}${file.target}`;
      console.log(chalk.yellow(`...reading ${filePath}`));
      const fileContent = readFile(filePath);
      await updateFile(filePath, fileContent, file.content.matchRegex, value);
    }
  }
}

function directoryExists(filePath: string) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

function fileExists(filePath: string) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

function getCurrentDirectoryBase(): string {
  return path.basename(process.cwd());
}

/**
 *  Read main config file to determine options the tool can take
 */
function readMainConfig(): any {
  const filePath = `./__template/template/template.json`;
  return JSON.parse(readFile(filePath));
}

/**
 *  Read sub config for features to determine details about the individual 
 * features and what they are capable of
 */
function readSubConfig(command: string): any {
  const filePath = `./__template/template/${command}/manifest.json`;
  const otherFilePath = `./__template/template/${command}/metadata.json`;
  if(fileExists(filePath)){
    return JSON.parse(readFile(filePath));
  }
  else if(fileExists(otherFilePath)) {
    return JSON.parse(readFile(otherFilePath));
  }
  return {};
}

async function clearTempFiles(folderPath: string) {
  await rimraf.sync(folderPath);
}

async function copyFiles(srcDir: string, destDir: string, files: any[]) {
  return Promise.all(files.map((f: any) => {
      const source = path.join(srcDir, f.source);
      const dest = path.join(destDir, f.target);
     return copyFilePromise(source, dest);
  }));
}

// async function readWriteProjectAsync(projectName: string | null = null, templateVariable: string | null = null): Promise<any> {
//   if (projectName !== null && templateVariable !== null) {
//     const status = new Spinner("updating template files from boilerplate...", ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]);
//     let filelist = [];

//     status.start();
    
//     filelist = getFilesOnly(_.without(fs.readdirSync(`./${projectName}/`), ".git", ".gitignore", "package-lock.json"), projectName);

//     return readAllFiles(filelist, projectName).then((allFiles) => {
//       return updateAllFiles(allFiles, templateVariable, projectName).then(() => {
//         status.stop();
//         return true
//       });
//     }).catch((err) => {
//       status.stop();
//       return err
//     });
//   }
// }

/**
 * Create a new feature 
 */
async function readWriteFeatureAsync(feature: string, featureName: string, installDirectory: string, templateVariable: string, fileList: any, rename: boolean = true): Promise<any> {
  if (featureName !== null && templateVariable !== null) {
    const status = new Spinner("updating template files from boilerplate...", ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]);
    const folder = `./${installDirectory}`;
    const path = `${folder}/${featureName}/`;
    status.start();
    
    if(!directoryExists(folder)){
      await fs.mkdirSync(folder);
    }
    if(!directoryExists(path)){
      await fs.mkdirSync(path);
    }
    
    if(rename === true){
      fileList.forEach((file:any)=>{
        file.target = replaceFileName(file.target, /(\${.*?\})/, featureName);
      });
    }

    // copy files from template and place in target destination
    await copyFiles(`__template/template/${feature}`, `${path}/`, fileList).then(() => {
        console.log("Files Copied.");
    }).catch((err: any) => {
        console.log(err);
    });

    // apply changes to generated files
    await readAndUpdateFeatureFiles(path, fileList, featureName);
    console.log("Files Read & Updated.");
    status.stop();
  }
}

export default {
  directoryExists,
  fileExists,
  clearTempFiles,
  getCurrentDirectoryBase,
  // readWriteProjectAsync,
  readWriteFeatureAsync,
  readMainConfig,
  readSubConfig,
}
