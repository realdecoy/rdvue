/**
 * After parsing commands and ensuring that they are valid
 * this module gets called and processes the input given and creates the necessary
 * configuration and files depending on the specific feature that the user requested.
 */
import { CLI } from '../../types/cli';
import { Command } from '../../types/index';
declare function run(operation: Command, USAGE: CLI): Promise<any>;
export { run };
