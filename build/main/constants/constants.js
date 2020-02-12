"use strict";
/**
 * Reusable constants that can be used anywhere in the source code
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const git_user_name_1 = __importDefault(require("git-user-name"));
exports.DEFAULT_PROJECT_NAME = 'my-vue-app';
exports.REGEX_PROJECT_NAME = /^\s+$/;
exports.GENERATE_ACTION = 'generate';
exports.TEMPLATE_PROJECT_URL = `https://${git_user_name_1.default()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
exports.OPTIONS_ALL = [exports.GENERATE_ACTION];
exports.spinnerIcons = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
exports.UTF8 = 'utf-8';
exports.TEMPLATE_FILE = '/template.json';
exports.MANIFEST_FILE = '/manifest.json';
exports.CORE = 'core';
var featureType;
(function (featureType) {
    featureType["config"] = "config";
    featureType["store"] = "store";
    featureType["project"] = "project";
    featureType["services"] = "services";
})(featureType = exports.featureType || (exports.featureType = {}));
exports.ACTIONS = {
    generate: ['generate', 'g']
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnN0YW50cy9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7OztBQUVILGtFQUF3QztBQUUzQixRQUFBLG9CQUFvQixHQUFHLFlBQVksQ0FBQztBQUNwQyxRQUFBLGtCQUFrQixHQUFHLE9BQU8sQ0FBQztBQUM3QixRQUFBLGVBQWUsR0FBRyxVQUFVLENBQUM7QUFDN0IsUUFBQSxvQkFBb0IsR0FBRyxXQUFXLHVCQUFXLEVBQUUsNkNBQTZDLENBQUM7QUFDN0YsUUFBQSxXQUFXLEdBQWEsQ0FBQyx1QkFBZSxDQUFDLENBQUM7QUFDMUMsUUFBQSxZQUFZLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEQsUUFBQSxJQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ2YsUUFBQSxhQUFhLEdBQUcsZ0JBQWdCLENBQUM7QUFDakMsUUFBQSxhQUFhLEdBQUcsZ0JBQWdCLENBQUM7QUFDakMsUUFBQSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBRTNCLElBQVksV0FLWDtBQUxELFdBQVksV0FBVztJQUNuQixnQ0FBaUIsQ0FBQTtJQUNqQiw4QkFBZSxDQUFBO0lBQ2Ysa0NBQW1CLENBQUE7SUFDbkIsb0NBQW9CLENBQUE7QUFDeEIsQ0FBQyxFQUxXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBS3RCO0FBTVksUUFBQSxPQUFPLEdBQVk7SUFDNUIsUUFBUSxFQUFDLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztDQUM3QixDQUFDIn0=