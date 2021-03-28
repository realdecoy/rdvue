import {Command, flags} from '@oclif/command'
import path from 'path'
import chalk from 'chalk'
import {Files} from '../lib/types'
import {copyFiles, readAndUpdateFeatureFiles, readConfigFile, replaceTargetFileNames} from '../lib/files'
import {checkProjectValidity, parsePageName, toKebabCase, toPascalCase, isJsonString} from '../lib/utilities'
import {TEMPLATE_CONFIG_FILENAME, TEMPLATE_ROOT} from '../lib/constants'

const TEMPLATE_FOLDERS = ['page']
export default class Page extends Command {
  static description = 'create a new rdvue page'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'name', desciption: 'name of generated page'},
  ]

  // override Command class error handler
  async catch(error: Error) {
    const errorMessage = error.message
    const isValidJSON = isJsonString(errorMessage)
    const parsedError = isValidJSON ? JSON.parse(errorMessage) : {}
    const customErrorCode = parsedError.code
    const customErrorMessage = parsedError.message
    const hasCustomErrorCode = customErrorCode !== undefined

    if (hasCustomErrorCode === false) {
      // throw cli errors to be handled globally
      throw errorMessage
    }

    // handle errors thrown with known error codes
    switch (customErrorCode) {
    case 'project-invalid': this.log(`${chalk.red(['[rdvue]'])} ${customErrorMessage}`)
      break
    case 'failed-match-and-replace': this.log(`${chalk.red(['[rdvue]'])} ${customErrorMessage}`)
      break
    default: throw new Error(customErrorMessage)
    }

    // exit with status code
    // this.exit(1)
  }

  async run() {
    const {args} = this.parse(Page)
    const folderList = TEMPLATE_FOLDERS
    const configs = folderList.map(folder => {
      return {
        name: folder,
        manifest: readConfigFile(`/${folder}/${TEMPLATE_CONFIG_FILENAME}`),
      }
    })
    let sourceDirectory: string
    let installDirectory: string
    const {isValid: isValidProject, projectRoot} = checkProjectValidity()

    // block command unless being run within an rdvue project
    if (isValidProject === false) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `page command must be run in an existing ${chalk.yellow('rdvue')} project`,
        })
      )
    }

    // retrieve page name
    const pageName = await parsePageName(args)
    // parse kebab and pascal case of pageName
    const pageNameKebab = toKebabCase(pageName)
    const pageNamePascal = toPascalCase(pageName)

    configs.forEach(async config => {
      const files: Array<string | Files> = config.manifest.files
      // replace file names in config with kebab case equivalent
      replaceTargetFileNames(files, pageNameKebab)
      sourceDirectory = path.join(TEMPLATE_ROOT, config.name, config.manifest.sourceDirectory)
      installDirectory = path.join(projectRoot, 'src', config.manifest.installDirectory, pageNameKebab)

      // copy and update files for page being generated
      await copyFiles(sourceDirectory, installDirectory, files)
      await readAndUpdateFeatureFiles(installDirectory, files, pageNameKebab, pageNamePascal)
    })

    this.log(`${chalk.blue('[rdvue]')} created page ${pageNameKebab}`)
  }
}
