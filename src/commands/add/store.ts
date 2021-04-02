import {Command, flags} from '@oclif/command'
import path from 'path'
import chalk from 'chalk'
import {Files} from '../../modules'
import {copyFiles, parseModuleConfig, readAndUpdateFeatureFiles, replaceTargetFileNames} from '../../lib/files'
import {checkProjectValidity, parseStoreModuleName, toKebabCase, toPascalCase, isJsonString} from '../../lib/utilities'
import { CLI_COMMANDS } from '../../lib/constants'

const TEMPLATE_FOLDERS = ['store']
export default class StoreModule extends Command {
  static description = 'add a new Store module.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'name', description: 'name of new store module'},
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
    case 'project-invalid': this.log(`${chalk.red('[rdvue]')} ${customErrorMessage}`)
      break
    case 'failed-match-and-replace': this.log(`${chalk.red('[rdvue]')} ${customErrorMessage}`)
      break
    default: throw new Error(customErrorMessage)
    }

    // exit with status code
    // this.exit(1)
  }

  async run() {
    const {isValid: isValidProject, projectRoot} = checkProjectValidity()

    // block command unless being run within an rdvue project
    if (isValidProject === false) {
      throw new Error(
        JSON.stringify({
          code: 'project-invalid',
          message: `${CLI_COMMANDS.AddStore} command must be run in an existing ${chalk.yellow('rdvue')} project`,
        })
      )
    }

    const {args} = this.parse(StoreModule)
    const folderList = TEMPLATE_FOLDERS
    let sourceDirectory: string
    let installDirectory: string

    // parse config files required for scaffolding this module
    const configs = parseModuleConfig(folderList, projectRoot)
    
    // retrieve storeModule name
    const storeModuleName = await parseStoreModuleName(args)
    // parse kebab and pascal case of storeModuleName
    const storeModuleNameKebab = toKebabCase(storeModuleName)
    const storeModuleNamePascal = toPascalCase(storeModuleName)

    configs.forEach(async config => {
      const files: Array<string | Files> = config.manifest.files
      // replace file names in config with kebab case equivalent
      replaceTargetFileNames(files, storeModuleNameKebab)
      sourceDirectory = path.join(config.moduleTemplatePath, config.manifest.sourceDirectory)
      installDirectory = path.join(projectRoot, 'src', config.manifest.installDirectory)

      // copy and update files for storeModule being added
      await copyFiles(sourceDirectory, installDirectory, files)
      await readAndUpdateFeatureFiles(installDirectory, files, storeModuleNameKebab, storeModuleNamePascal)
    })

    this.log(`${chalk.yellow('[rdvue]')} new store module added: ${storeModuleNameKebab}`)
  }
}
