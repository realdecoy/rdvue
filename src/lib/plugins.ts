import {inject} from './files'
import path from 'path'

/**
 * Private helper method for finding index of last import statement.
 * @param {Array<string>} lines the lines of a file
 * @returns {number} the index of the last import statement.
 *   Returns 0 if no imports were found.
 */
function findIndexOfLastImportStatement(lines: string []): number {
  const index = lines.map(line => line.trimStart())
  .reverse()
  .findIndex(line => line.startsWith('import'))
  return (index === -1) ? 0 : lines.length - index
}

/**
 * helper method for injecting modules into main.
 * @param {string} projectRoot the root path of the project
 * @param {string | string[]} lines the modules to inject
 */
function injectLinesIntoMain(projectRoot: string, lines: string | string[]): void {
  const ext = 'ts'
  const mainPath = path.join(projectRoot, 'src', `main.${ext}`)
  const contents = Array.isArray(lines) ? lines.join('') : lines.slice()
  inject(mainPath, contents, {
    index: findIndexOfLastImportStatement,
  })
}

export {
  injectLinesIntoMain,
  findIndexOfLastImportStatement,
}
