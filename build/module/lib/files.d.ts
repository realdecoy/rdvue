declare function directoryExists(filePath: string): boolean;
declare function fileExists(filePath: string): boolean;
declare function getCurrentDirectoryBase(): string;
/**
 *  Read main config file to determine options the tool can take
 */
declare function readMainConfig(): any;
/**
 *  Read sub config for features to determine details about the individual
 * features and what they are capable of
 */
declare function readSubConfig(command: string): any;
declare function clearTempFiles(folderPath: string): Promise<void>;
/**
 * Write files
 */
declare function writeFile(filePath: string, data: string): boolean;
declare function replaceTargetFileNames(files: any[], featureName: string): void;
/**
 * Copy and update files
 */
declare function copyAndUpdateFiles(sourceDirectory: string, installDirectory: string, fileList: any, args: any): Promise<any>;
declare const _default: {
    directoryExists: typeof directoryExists;
    fileExists: typeof fileExists;
    clearTempFiles: typeof clearTempFiles;
    getCurrentDirectoryBase: typeof getCurrentDirectoryBase;
    replaceTargetFileNames: typeof replaceTargetFileNames;
    copyAndUpdateFiles: typeof copyAndUpdateFiles;
    readMainConfig: typeof readMainConfig;
    readSubConfig: typeof readSubConfig;
    writeFile: typeof writeFile;
};
export default _default;
