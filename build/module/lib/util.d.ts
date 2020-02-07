import { Section } from 'command-line-usage';
import { Command } from '../types/index';
declare function heading(): void;
declare function sectionBreak(): void;
declare function lineBreak(): void;
declare function nextSteps(featureName: string): void;
declare function hasFeature(args: string[], features: string[]): boolean;
declare function hasOptions(args: string[], options: string[]): boolean;
declare function hasHelpOption(args: string[]): boolean;
declare function hasInvalidOption(args: string[], options: string[]): boolean;
declare function parseFeature(args: string[], features: string[]): string;
/**
 * Get the options that have been input by the user
 */
declare function parseOptions(args: string[]): string[];
/**
 * Description - seperates the user input into <service> <action> <feature>
 * <featureName> [options]
 * @param args - the arguments that the user provided in the command line
 * @param features - the predefined features that can be created with rdvue
 */
declare function parseUserInput(args: string[], features: string[]): {
    action: string;
    feature: string;
    featureName: string;
    options: string[];
};
declare function displayHelp(sections: Section[]): string;
declare function getKebabCase(str: string): string;
declare function getPascalCase(str: string): string;
declare function hasKebab(str?: string): boolean;
declare function isRootDirectory(location?: string | null): boolean;
declare function getProjectRoot(): string | null;
declare function checkProjectValidity(operation: Command): {
    isValid: boolean;
    projectRoot: string;
};
declare function actionBeingRequested(enteredAction: string): string;
export { heading, sectionBreak, lineBreak, nextSteps, hasFeature, hasOptions, hasHelpOption, hasInvalidOption, parseFeature, parseOptions, parseUserInput, displayHelp, hasKebab, getKebabCase, getPascalCase, checkProjectValidity, isRootDirectory, getProjectRoot, actionBeingRequested };
