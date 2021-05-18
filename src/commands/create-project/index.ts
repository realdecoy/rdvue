import shell from 'shelljs'
import chalk from 'chalk'
import { Command, flags } from '@oclif/command'
import { toKebabCase, parseProjectName, isJsonString, checkProjectValidity, parseProjectPresets } from '../../lib/utilities'
import { replaceInFiles, checkIfFolderExists } from '../../lib/files'
import {
  TEMPLATE_REPO,
  TEMPLATE_VERSION,
  TEMPLATE_PROJECT_NAME_REGEX,
  TEMPLATE_REPLACEMENT_FILES,
  CLI_STATE
} from '../../lib/constants';

export default class CreateProject extends Command {
  static description = 'create a new rdvue project'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [
    { name: 'name', description: 'name of created project' },
    { name: 'preset', description: 'name of plugin preset' },
  ]

  // override Command class error handler
  async catch(error: Error) {
    const errorMessage = error.message
    const isValidJSON = isJsonString(errorMessage)
    const parsedError = isValidJSON ? JSON.parse(errorMessage) : {}
    const customErrorCode = parsedError.code
    const customErrorMessage = parsedError.message
    const hasCustomErrorCode = customErrorCode !== undefined

    if (!hasCustomErrorCode) {
      // throw cli errors to be handled globally
      throw errorMessage
    }

    // handle errors thrown with known error codes
    switch (customErrorCode) {
      case 'existing-project': this.log(`${CLI_STATE.Error} ${customErrorMessage}`)
        break
      case 'existing-folder': this.log(`${CLI_STATE.Error} ${customErrorMessage}`)
        break
      case 'file-not-changed': this.log(`${CLI_STATE.Error} ${customErrorMessage}`)
        break
      default: throw new Error(customErrorMessage)
    }

    // exit with status code
    // this.exit(1)
  }

  async run() {
    const { args } = this.parse(CreateProject)
    const template: string = TEMPLATE_REPO
    const tag: string = TEMPLATE_VERSION
    const replaceRegex = TEMPLATE_PROJECT_NAME_REGEX
    let filesToReplace = TEMPLATE_REPLACEMENT_FILES
    let projectName: string
    let presetName: string
    const { isValid: isValidProject } = checkProjectValidity()
    // block command if being run within an rdvue project
    if (isValidProject) {
      throw new Error(
        JSON.stringify({
          code: 'existing-project',
          message: `you are already in an existing ${chalk.yellow('rdvue')} project`,
        })
      )
    }

    // retrieve project name
    projectName = await parseProjectName(args)
    // retrieve project preset
    presetName = await parseProjectPresets(args)
    // convert project name to kebab case
    projectName = toKebabCase(projectName)
    // verify that project folder doesnt already exist
    checkIfFolderExists(projectName)

    // update files to be replaced with project name reference
    filesToReplace = filesToReplace.map(p => `${projectName}/${p}`)

    this.log(`${CLI_STATE.Info} creating project ${chalk.whiteBright(projectName)}`)

    // retrieve project files from template source
    await shell.exec(`git clone ${template} --depth 1 --branch ${tag} ${projectName}`, { silent: true })
    // remove git folder reference to base project
    await shell.exec(`rm -rf ${projectName}/.git`)
    // find and replace project name references
    const success = await replaceInFiles(filesToReplace, replaceRegex, `${projectName}`)

    if (success === false) {
      throw new Error(
        JSON.stringify({
          code: 'file-not-changed',
          message: `updating your project failed`,
        })
      )
    } else {
      this.log(`${CLI_STATE.Success} ${chalk.whiteBright(projectName)} is ready!`)
    }

    // Output final instructions to user
    this.log(`\nNext Steps:\n${chalk.magenta('-')} cd ${chalk.whiteBright(projectName)}\n${chalk.magenta('-')} npm install\n${chalk.magenta('-')} npm run serve`)
  }
}
