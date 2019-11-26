import chalk from "chalk";

const OPTIONS_ALL: string[] = ["--test", "--component", "--service", "--view"];
const USAGE: any[] = [
  {
    header: "Synopsis:",
    content: `$ ${chalk.yellow("rdvue")} ${chalk.magenta("generate")} ${chalk.cyan("[options]")}`,
  },
  {
    header: "Options:",
    optionList: [
      {
        name: `${chalk.cyan("component")}`,
        description: "create new component."
      },
      {
        name: `${chalk.cyan("help")}`,
        description: "Print this usage guide."
      },
      {
        name: `${chalk.cyan("service")}`,
        description: "create new service."
      },
      {
        name: `${chalk.cyan("test")}`,
        description: "test option for demonstration purposes."
      },
      {
        name: `${chalk.cyan("view")}`,
        description: "create new view."
      },
    ]
  }
];

export default {
  OPTIONS_ALL,
  USAGE,
}