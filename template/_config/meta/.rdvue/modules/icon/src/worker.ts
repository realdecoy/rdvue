import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import favicons from 'favicons';
import logSymbols from 'log-symbols';
import config from './configuration'; // configuration needed for the favicons package
import jsbeautifier from 'js-beautify'; // beautifier for the html output

let manifest: any;
let fileFound: string;
const beautify = jsbeautifier.html;
const logo: RegExp = new RegExp('logo');
const searchDir: string = './src/assets/logo';
const imageExt = ['.png', '.jpg', '.svg', '.gif'];

/**
 * Description: Searches the logo directory for supported image files, if multiple images are in the directory,
 *  it will select the image by descending alphabetical order of its extension.
 */
async function ifFileExists() {

  try {
    fs.readdirSync(searchDir).reverse().every(async (file): Promise<boolean> => {
      if (imageExt.includes(file.substr(-4 || -5)) && logo.test(path.parse(file).name) === true) {
        fileFound = path.join(searchDir + '/' + file);
        progressStatus(false);
        return false;
      }
      return true;
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Description: Parses the manifest.json file and updates it with the newly generated icon references
 * @param path - path to the manifest.json file
 * @param jsonFile - name of the file (manifest.json)
 * @param jsonData - metadata extracted from the generated manifest.json file
 */
function jsonManifestParser(filePath: string, jsonFile: string, jsonData: any) {

  let icon: any;
  let icons: any;
  let data: string;

  try {
    manifest = fs.readFileSync(filePath + jsonFile);

    manifest = JSON.parse(manifest);

    jsonData = JSON.parse(jsonData);

    icons = jsonData.icons;

    for (icon of icons) {

      if (!manifest.hasOwnProperty('icons')) {
        manifest = {
          ...manifest,
          icons,
        };
      } else if (!manifest.icons.some((micon: any) => micon.src === icon.src)) {
        manifest.icons.push(icon);
      }

      data = JSON.stringify(manifest, null, 2);

      fs.writeFileSync(filePath + 'manifest.json', data);
    }

  } catch (err) {
    console.error(err);
  }
}

/**
 * Description: Parses the manifest.webapp file and updates the name and description of the application
 * @param path - path to the manifest.webapp file
 * @param webappFile - name of the file (manifest.webapp)
 * @param webappData - metadata extracted from the generated manifest.webapp file
 */
function jsonWebAppParser(filePath: string, webappFile: string, webappData: any) {

  webappData = JSON.parse(webappData);

  webappData.description = manifest.description;
  webappData.name = manifest.name;

  webappData = JSON.stringify(webappData, null, 2);

  try {
    if (!fs.existsSync(path + webappFile)) { fs.writeFileSync(filePath + webappFile, webappData); }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Description: Parses the HTML file and injects the necessary tags to reference all generated files
 * @param html - metadata extracted from the generated html
 * @param path - path to the index.html file
 */
function htmlParser(html: string, filePath: string) {

  let index: number;
  let output: string;
  let injectHTML: string;
  let projectHTML: string;

  try {
    projectHTML = fs.readFileSync(filePath + 'index.html').toString('utf8');

    injectHTML = html.split(',').join('\n'); // split the refernces and place them in new lines

    index = projectHTML.indexOf('<head>') + 6; // get the index right  after the head tag

    if (!projectHTML.replace(/\s+/g, '').includes(injectHTML.replace(/\s+/g, ''))) {

      // insert the refernces into the projects html
      output = [projectHTML.slice(0, index), injectHTML, projectHTML.slice(
        index)].join('\n');

      fs.writeFileSync(filePath + 'index.html', beautify(output));
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Description: callback method for the favicons function
 * @param error - errors
 * @param response - property holding the metadata of all the generated files
 */
async function callback(error: Error, response: any) {

  // await the completion of the progess status
  await progressStatus(true);

  const desSrc: string = './public/';

  if (error) {
    console.log(
      error.name,
      error.stack,
      error.message,
    ); // Error description e.g. "An unknown error has occurred"
    return;
  }

  // loop through the images metadata and write files to the appropriate location
  for await (const image of response.images) {
    fs.writeFile(desSrc + image.name, image.contents, (err) => {
      if (err instanceof Error) {
        console.error(err);
      }
    });
  }

  // loop through the files metadata and write files to the appropriate location
  for await (const file of response.files) {

    if (file.name === 'manifest.json') {
      jsonManifestParser(desSrc, file.name, file.contents);
    }
    else if (file.name === 'manifest.webapp') {
      jsonWebAppParser(desSrc, file.name, file.contents);
    }
    else {
      fs.writeFile(desSrc + file.name, file.contents, (err) => {
        if (err instanceof Error) {
          console.error(err);
        }
      });
    }
  }

  // pass the html metadata as a response to the HTMLParser function
  htmlParser(response.html.toString('utf8'), desSrc);
  console.log('All icons have been generated', logSymbols.success);
}

/**
 * Description: Displays a progression bar with the status of the generation process
 * @param finished - boolean denoting whether or not the process is completed
 */
async function progressStatus(finished: boolean) {

  await wait(100);

  const loading = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // using 10 to make the progress bar length 10 charactes, multiplying by 5 below to arrive to 100
  for (const i of loading) {

    const dots = '.'.repeat(i);
    const left = 10 - i;
    const empty = ' '.repeat(left);
    const percentage = i * 10;

    // need to use `process.stdout.write` becuase console.log prints a newline character
    // \r clear the current line and then print the other characters making it looks like it refresh
    process.stdout.write(`\rGenerating your icons - process will take a few seconds [${dots}${empty}] ${percentage}%`);
    // wait periodically to simulate a realistic loading animation
    await wait(50);

    // a step implemented to remove a glitch in the loading animation
    if (i === 1) {
      process.stdout.write('\r\x1b[K');
    }

    // if the generation process is complete clear the console line with the escape character
    if (finished) {
      process.stdout.write('\r\x1b[K');
      break;
    }
  }
}

/**
 * Description - method to wait for a preterminated amount of time
 * @param ms - number of milliseconds to wait
 */
function wait(ms: number) {
  return new Promise((resolve: any) => setTimeout(resolve, ms));
}

/**
 * Description: Generates all icons needed for a Progressive Web Application
 */
async function run() {
  // awaiting confirmation that the file exists or not
  await ifFileExists();
  // if the file doesn't exist print an error to the console otherwise generate favicons
  if (fileFound === undefined) {
    console.error(chalk.red(`\nERROR - No suitable image was found in the assets directory ** Supported formats .jpg .png .svg .giff **`));
  } else {
    // https://www.npmjs.com/package/favicons
    favicons(fileFound, config, callback);
  }
}

export {
  run,
};
