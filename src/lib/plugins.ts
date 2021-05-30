import {inject} from './files';
import path from 'path';

/**
 * Private helper method for finding index of last import statement.
 * @param {Array<string>} lines the lines of a file
 * @returns {number} the index of the last import statement.
 *   Returns 0 if no imports were found.
 */
function findIndexOfLastImportStatement (lines: string []): number {
  const index = lines.slice()
    .reverse()
    .findIndex(line => line.trimStart().startsWith('import'));
  
  return (index === -1) ? 0 : lines.length - index;
}

/**
 * Private helper method for finding the the vue initializer
 * @param {Array<string>} lines the lines of a file
 * @returns {number} the index of the last import statement.
 * @throws error if the vue initializer is not found.
 */
function findIndexOfVueConstructor (lines: string[]): number {
  const index = lines.findIndex(line => line.trimStart().startsWith('new Vue'));
  if (index === -1) {
    throw new Error('Vue initializer was not defined in main.ts.');
  }
  
  return index + 1;
}

/**
 * private helper method for assembling path to main
 * @param {string} projectRoot root path to the project
 * @returns {string} returns the path
 */
function getMainPath (projectRoot: string): string {
  const ext = 'ts';
  
  return path.join(projectRoot, 'src', `main.${ext}`);
}

/**
 * helper method for injecting modules into main.
 * @param {string} projectRoot the root path of the project
 * @param {string | string[]} lines the lines to inject
 */
function injectImportsIntoMain (projectRoot: string, lines: string | string[]): void {
  const mainPath = getMainPath(projectRoot);
  const contents = Array.isArray(lines) ? lines.join('') : lines.slice();
  inject(mainPath, contents, {
    index: findIndexOfLastImportStatement,
  });
}

/**
 * Helper method for injecting modules into the Vue constructor
 * @param {string} projectRoot  the root path of the project
 * @param {strings} lines the lines to inject
 */
function injectModulesIntoMain (projectRoot: string, lines: string | string[]): void {
  const mainPath = getMainPath(projectRoot);
  const contents = `${Array.isArray(lines) ? lines.join(',\n') : lines.slice()  },`;
  inject(mainPath, contents, {
    index: findIndexOfVueConstructor,
  });
}

export {
  injectImportsIntoMain,
  injectModulesIntoMain,
};
