import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import chalk from 'chalk';
import { getProjectRoot } from './util';
import { LOG_TYPES } from '../constants/constants';
import { Log } from '../types/log';

// Import default file descriptor to print output to the console
const { stdout } = process;

// Declare file name that would be set as the current date of updating
// the rdvue project in the format: MM-DD-YYYY
let filename = '';
filename += new Date().getUTCMonth() + 1;
filename += ('-' + new Date().getUTCDate());
filename += ('-' + new Date().getUTCFullYear());

// Retreive root of project being updated
const PROJECT_ROOT = String(getProjectRoot());

// Assign path of log file
const LOG_FILE_PATH = path.join(PROJECT_ROOT, 'logs', `${filename}.txt`);

/**
 * This function prints the output to the user and call the function to update/create log file
 * @param loggingInfo - string with format <message>-<type> or swapped, to be seperated
 * and assigned to neccesary object properties
 *
 * @param end - boolean to check if its the end of current line
 */
export function logger(loggingInfo: string, end = true) {
  const log: Log = {} as Log;
  const seperatedLogData: string[] = loggingInfo.split('-');
  seperatedLogData.forEach((data: string) => (Object.values(LOG_TYPES) as string[]).includes(data) ? log.type = data : log.message = data);

  const chalkColor: string = log.type === LOG_TYPES.info ? 'white' : log.type === LOG_TYPES.error ? 'red' : 'yellow';
  stdout.write((chalk as any)[chalkColor](`${log.message} ${end ? EOL : ''}`));
  printLog(log);
}

/**
 * This function updates the log file in the rdvue project
 * @param log - log object to be used for updating log file
 */
export function printLog(log: Log) {
  log.timeStamp = new Date().toLocaleString();
  fs.appendFileSync(LOG_FILE_PATH, JSON.stringify(log) + EOL);
}