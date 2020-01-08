"use strict";
// import _ from "lodash";
// import chalk from "chalk";
// import CLI from "clui";
// const octokit = require("@octokit/rest")();
// import configStore from "configstore";
// import pkg from "../../package.json";
// import inquirer from "inquirer";
// const Spinner = CLI.Spinner;
// const conf = new configStore(pkg.name);
// module.exports = {
//   getInstance: () => {
//     return octokit;
//   },
//   setGithubCredentials: async () => {
//     const credentials = await inquirer.askGithubCredentials();
//     octokit.authenticate(
//       _.extend(
//         {
//           type: "basic"
//         },
//         credentials
//       )
//     );
//   },
//   registerNewToken: async () => {
//     const status = new Spinner("Authenticating you, please wait...");
//     status.start();
//     try {
//       const response = await octokit.authorization.create({
//         scopes: ["user", "public_repo", "repo", "repo:status"],
//         note: "ginits, the command-line tool for initalizing Git repos"
//       });
//       const token = response.data.token;
//       if (token) {
//         conf.set("github.token", token);
//         return token;
//       } else {
//         throw new Error(
//           "Missing Token",
//           "Github token was not found in the response"
//         );
//       }
//     } catch (err) {
//       throw err;
//     } finally {
//       status.stop();
//     }
//   },
//   githubAuth: token => {
//     octokit.authenticate({
//       type: "oauth",
//       token: token
//     });
//   },
//   getStoredGithubToken: () => {
//     return conf.get("github.token");
//   },
//   hasAccessToken: async () => {
//     const status = new Spinner("Authenticating you, please wait...");
//     status.start();
//     try {
//       const response = await octokit.authorization.getAll();
//       const accessToken = _.find(response.data, row => {
//         if (row.note) {
//           return row.note.indexOf("ginit") !== -1;
//         }
//       });
//       return accessToken;
//     } catch (err) {
//       throw err;
//       m;
//     } finally {
//       status.stop();
//     }
//   },
//   regenerateNewToken: async id => {
//     const tokenUrl = "https://github.com/settings/tokens/" + id;
//     console.log(
//       "Please visit " +
//         chalk.underline.blue.bold(tokenUrl) +
//         " and click the " +
//         chalk.red.bold("Regenerate Token Button.\n")
//     );
//     const input = await inquirer.askRegeneratedToken();
//     if (input) {
//       conf.set("github.token", input.token);
//       return input.token;
//     }
//   }
// };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9naXRodWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQjtBQUMxQiw2QkFBNkI7QUFDN0IsMEJBQTBCO0FBQzFCLDhDQUE4QztBQUM5Qyx5Q0FBeUM7QUFDekMsd0NBQXdDO0FBQ3hDLG1DQUFtQztBQUVuQywrQkFBK0I7QUFDL0IsMENBQTBDO0FBRzFDLHFCQUFxQjtBQUNyQix5QkFBeUI7QUFDekIsc0JBQXNCO0FBQ3RCLE9BQU87QUFFUCx3Q0FBd0M7QUFDeEMsaUVBQWlFO0FBQ2pFLDRCQUE0QjtBQUM1QixrQkFBa0I7QUFDbEIsWUFBWTtBQUNaLDBCQUEwQjtBQUMxQixhQUFhO0FBQ2Isc0JBQXNCO0FBQ3RCLFVBQVU7QUFDVixTQUFTO0FBQ1QsT0FBTztBQUVQLG9DQUFvQztBQUNwQyx3RUFBd0U7QUFDeEUsc0JBQXNCO0FBRXRCLFlBQVk7QUFDWiw4REFBOEQ7QUFDOUQsa0VBQWtFO0FBQ2xFLDBFQUEwRTtBQUMxRSxZQUFZO0FBQ1osMkNBQTJDO0FBQzNDLHFCQUFxQjtBQUNyQiwyQ0FBMkM7QUFDM0Msd0JBQXdCO0FBQ3hCLGlCQUFpQjtBQUNqQiwyQkFBMkI7QUFDM0IsNkJBQTZCO0FBQzdCLHlEQUF5RDtBQUN6RCxhQUFhO0FBQ2IsVUFBVTtBQUNWLHNCQUFzQjtBQUN0QixtQkFBbUI7QUFDbkIsa0JBQWtCO0FBQ2xCLHVCQUF1QjtBQUN2QixRQUFRO0FBQ1IsT0FBTztBQUVQLDJCQUEyQjtBQUMzQiw2QkFBNkI7QUFDN0IsdUJBQXVCO0FBQ3ZCLHFCQUFxQjtBQUNyQixVQUFVO0FBQ1YsT0FBTztBQUVQLGtDQUFrQztBQUNsQyx1Q0FBdUM7QUFDdkMsT0FBTztBQUVQLGtDQUFrQztBQUNsQyx3RUFBd0U7QUFDeEUsc0JBQXNCO0FBRXRCLFlBQVk7QUFDWiwrREFBK0Q7QUFDL0QsMkRBQTJEO0FBQzNELDBCQUEwQjtBQUMxQixxREFBcUQ7QUFDckQsWUFBWTtBQUNaLFlBQVk7QUFDWiw0QkFBNEI7QUFDNUIsc0JBQXNCO0FBQ3RCLG1CQUFtQjtBQUNuQixXQUFXO0FBQ1gsa0JBQWtCO0FBQ2xCLHVCQUF1QjtBQUN2QixRQUFRO0FBQ1IsT0FBTztBQUVQLHNDQUFzQztBQUN0QyxtRUFBbUU7QUFDbkUsbUJBQW1CO0FBQ25CLDBCQUEwQjtBQUMxQixnREFBZ0Q7QUFDaEQsOEJBQThCO0FBQzlCLHVEQUF1RDtBQUN2RCxTQUFTO0FBQ1QsMERBQTBEO0FBQzFELG1CQUFtQjtBQUNuQiwrQ0FBK0M7QUFDL0MsNEJBQTRCO0FBQzVCLFFBQVE7QUFDUixNQUFNO0FBQ04sS0FBSyJ9