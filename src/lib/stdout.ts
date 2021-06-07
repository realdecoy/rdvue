import util from 'util';
/**
 * Emulates the log method from @oclif/command, since they don't seem to be
 * offering any alternatives. Can be replaced with another logging library.
 * @param {any} message The content to print to the console
 * @param {Array<any>} args See util.format for formatting arguments.
 */
function log(message: any = '', ...args: any[]): void {
  message = typeof message === 'string' ? message : util.inspect(message);
  process.stdout.write(`${util.format(message, ...args)}\n`);
}

export {
  log,
};
