"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const favicons_1 = __importDefault(require("favicons"));
const log_symbols_1 = __importDefault(require("log-symbols"));
const configuration_1 = __importDefault(require("./configuration")); // configuration needed for the favicons package
const js_beautify_1 = __importDefault(require("js-beautify")); // beautifier for the html output
let manifest;
let fileFound;
const beautify = js_beautify_1.default.html;
const logo = new RegExp('logo');
const searchDir = './src/assets/logo';
const imageExt = ['.png', '.jpg', '.svg', '.gif'];
/**
 * Description: Searches the logo directory for supported image files, if multiple images are in the directory,
 *  it will select the image by descending alphabetical order of its extension.
 */
function ifFileExists() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs_1.default.readdirSync(searchDir).reverse().every((file) => __awaiter(this, void 0, void 0, function* () {
                if (imageExt.includes(file.substr(-4 || -5)) && logo.test(path_1.default.parse(file).name) === true) {
                    fileFound = path_1.default.join(searchDir + '/' + file);
                    progressStatus(false);
                    return false;
                }
                return true;
            }));
        }
        catch (err) {
            console.error(err);
        }
    });
}
/**
 * Description: Parses the manifest.json file and updates it with the newly generated icon references
 * @param path - path to the manifest.json file
 * @param jsonFile - name of the file (manifest.json)
 * @param jsonData - metadata extracted from the generated manifest.json file
 */
function jsonManifestParser(filePath, jsonFile, jsonData) {
    let icon;
    let icons;
    let data;
    try {
        manifest = fs_1.default.readFileSync(filePath + jsonFile);
        manifest = JSON.parse(manifest);
        jsonData = JSON.parse(jsonData);
        icons = jsonData.icons;
        for (icon of icons) {
            if (!manifest.hasOwnProperty('icons')) {
                manifest = Object.assign(Object.assign({}, manifest), { icons });
            }
            else if (!manifest.icons.some((micon) => micon.src === icon.src)) {
                manifest.icons.push(icon);
            }
            data = JSON.stringify(manifest, null, 2);
            fs_1.default.writeFileSync(filePath + 'manifest.json', data);
        }
    }
    catch (err) {
        console.error(err);
    }
}
/**
 * Description: Parses the manifest.webapp file and updates the name and description of the application
 * @param path - path to the manifest.webapp file
 * @param webappFile - name of the file (manifest.webapp)
 * @param webappData - metadata extracted from the generated manifest.webapp file
 */
function jsonWebAppParser(filePath, webappFile, webappData) {
    webappData = JSON.parse(webappData);
    webappData.description = manifest.description;
    webappData.name = manifest.name;
    webappData = JSON.stringify(webappData, null, 2);
    try {
        if (!fs_1.default.existsSync(path_1.default + webappFile)) {
            fs_1.default.writeFileSync(filePath + webappFile, webappData);
        }
    }
    catch (error) {
        console.log(error);
    }
}
/**
 * Description: Parses the HTML file and injects the necessary tags to reference all generated files
 * @param html - metadata extracted from the generated html
 * @param path - path to the index.html file
 */
function htmlParser(html, filePath) {
    let index;
    let output;
    let injectHTML;
    let projectHTML;
    try {
        projectHTML = fs_1.default.readFileSync(filePath + 'index.html').toString('utf8');
        injectHTML = html.split(',').join('\n'); // split the refernces and place them in new lines
        index = projectHTML.indexOf('<head>') + 6; // get the index right  after the head tag
        if (!projectHTML.replace(/\s+/g, '').includes(injectHTML.replace(/\s+/g, ''))) {
            // insert the refernces into the projects html
            output = [projectHTML.slice(0, index), injectHTML, projectHTML.slice(index)].join('\n');
            fs_1.default.writeFileSync(filePath + 'index.html', beautify(output));
        }
    }
    catch (err) {
        console.log(err);
    }
}
/**
 * Description: callback method for the favicons function
 * @param error - errors
 * @param response - property holding the metadata of all the generated files
 */
function callback(error, response) {
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // await the completion of the progess status
        yield progressStatus(true);
        const desSrc = './public/';
        if (error) {
            console.log(error.name, error.stack, error.message); // Error description e.g. "An unknown error has occurred"
            return;
        }
        try {
            // loop through the images metadata and write files to the appropriate location
            for (var _c = __asyncValues(response.images), _d; _d = yield _c.next(), !_d.done;) {
                const image = _d.value;
                fs_1.default.writeFile(desSrc + image.name, image.contents, (err) => {
                    if (err instanceof Error) {
                        console.error(err);
                    }
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // loop through the files metadata and write files to the appropriate location
            for (var _e = __asyncValues(response.files), _f; _f = yield _e.next(), !_f.done;) {
                const file = _f.value;
                if (file.name === 'manifest.json') {
                    jsonManifestParser(desSrc, file.name, file.contents);
                }
                else if (file.name === 'manifest.webapp') {
                    jsonWebAppParser(desSrc, file.name, file.contents);
                }
                else {
                    fs_1.default.writeFile(desSrc + file.name, file.contents, (err) => {
                        if (err instanceof Error) {
                            console.error(err);
                        }
                    });
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // pass the html metadata as a response to the HTMLParser function
        htmlParser(response.html.toString('utf8'), desSrc);
        console.log('All icons have been generated', log_symbols_1.default.success);
    });
}
/**
 * Description: Displays a progression bar with the status of the generation process
 * @param finished - boolean denoting whether or not the process is completed
 */
function progressStatus(finished) {
    return __awaiter(this, void 0, void 0, function* () {
        yield wait(100);
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
            yield wait(50);
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
    });
}
/**
 * Description - method to wait for a preterminated amount of time
 * @param ms - number of milliseconds to wait
 */
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Description: Generates all icons needed for a Progressive Web Application
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // awaiting confirmation that the file exists or not
        yield ifFileExists();
        // if the file doesn't exist print an error to the console otherwise generate favicons
        if (fileFound === undefined) {
            console.error(chalk_1.default.red(`\nERROR - No suitable image was found in the assets directory ** Supported formats .jpg .png .svg .giff **`));
        }
        else {
            // https://www.npmjs.com/package/favicons
            favicons_1.default(fileFound, configuration_1.default, callback);
        }
    });
}
exports.run = run;
//# sourceMappingURL=worker.js.map