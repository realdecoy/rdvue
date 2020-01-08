"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import chalk from "chalk";
const clui_1 = __importDefault(require("clui"));
const Spinner = clui_1.default.Spinner;
const git = require("simple-git/promise")();
async function cloneRemoteRepo(url = null, projectName = null) {
    if (url !== null && projectName !== null) {
        const status = new Spinner("cloning boilerplate files from remote repo...", ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
        status.start();
        return git.silent(true).clone(url, projectName)
            .then(() => {
            status.stop();
            // console.log(chalk.green("[scaffolding completed]\n"));
            return true;
        }).catch((err) => {
            status.stop();
            throw new Error(err.toString());
        });
    }
}
exports.default = {
    cloneRemoteRepo,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmVwby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDZCQUE2QjtBQUM3QixnREFBdUI7QUFDdkIsTUFBTSxPQUFPLEdBQUcsY0FBRyxDQUFDLE9BQU8sQ0FBQztBQUM1QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0FBRTVDLEtBQUssVUFBVSxlQUFlLENBQUUsTUFBcUIsSUFBSSxFQUFFLGNBQTZCLElBQUk7SUFDMUYsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7UUFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsK0NBQStDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0SCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUM7YUFDNUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNULE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLHlEQUF5RDtZQUN6RCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQVUsRUFBRSxFQUFFO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7S0FDTjtBQUNILENBQUM7QUFFRCxrQkFBZTtJQUNiLGVBQWU7Q0FDaEIsQ0FBQyJ9