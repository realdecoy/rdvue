/**
 * Includes helper functions that associated with files (example: copy files, update files)
 */
import { Config } from '../types/cli';
import { FeatureNameObject, Files } from '../types/index';
/**
 * Description: Determine whether or not the given file path is a
 *              directory which exists
 * @param filePath - a path to a file
 */
declare function directoryExists(filePath: string): boolean;
/**
 * Description: Determine whether or not the given file exists
 * @param filePath - a path to a file
 */
declare function fileExists(filePath: string): boolean;
/**
 * Description: Get the base of the directory you are currently in.
 * Returns the last portion of the current path
 */
declare function getCurrentDirectoryBase(): string;
/**
 *  Description: Read main config file to determine options the tool can take
 */
declare function readMainConfig(): Config;
/**
 * Description: Read sub config for features to determine details about
 *              the individual features and what they are capable of
 * @param command - the command used to retrieve associated configuration
 */
declare function readSubConfig(command: string): Config;
/**
 * Description: Clear temporary files at a given path
 * @param folderPath - the folder path for which you would like to clear temporary files
 */
declare function clearTempFiles(folderPath: string): Promise<void>;
/**
 * Description: Writes given data to a file
 * @param filePath - path of file which will be created or modified to include given data
 * @param data - data written to file
 */
declare function writeFile(filePath: string, data: string): boolean;
/**
 * Description: Update target filenames to include feature name
 * @param files - filenames which need to be updated
 * @param featureName - the string used to update the name of the files
 */
declare function replaceTargetFileNames(files: Array<string | Files>, featureName: string): void;
/**
 * Description: Copy and update files from a source directory to a destination
 *              (install) directory
 * @param sourceDirectory - directory in which files are stored
 * @param installDirectory - destination directory or directory in which
 *                           has generated files
 * @param fileList - files to be copied and updated
 */
declare function copyAndUpdateFiles(sourceDirectory: string, installDirectory: string, fileList: Files[] | Array<string | Files>, args: FeatureNameObject): Promise<boolean>;
export { directoryExists, fileExists, clearTempFiles, getCurrentDirectoryBase, replaceTargetFileNames, copyAndUpdateFiles, readMainConfig, readSubConfig, writeFile, };
