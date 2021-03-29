import {Command, flags} from '@oclif/command'
import path from 'path'
import chalk from 'chalk'
import {Files} from '../lib/types'
import {copyFiles, readAndUpdateFeatureFiles, readConfigFile, replaceTargetFileNames} from '../lib/files'
import {checkProjectValidity, parseServiceName, toKebabCase, toPascalCase, isJsonString} from '../lib/utilities'
import {TEMPLATE_CONFIG_FILENAME, TEMPLATE_ROOT} from '../lib/constants'

const TEMPLATE_FOLDERS = ['service']
export default class Service extends Command {
  static description = 'create a new rdvue service'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'name', desciption: 'name of generated service'},
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
    const {args} = this.parse(Service)
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
          message: `service command must be run in an existing ${chalk.yellow('rdvue')} project`,
        })
      )
    }

    // retrieve service name
    const serviceName = await parseServiceName(args)
    // parse kebab and pascal case of serviceName
    const serviceNameKebab = toKebabCase(serviceName)
    const serviceNamePascal = toPascalCase(serviceName)

    configs.forEach(async config => {
      const files: Array<string | Files> = config.manifest.files
      // replace file names in config with kebab case equivalent
      replaceTargetFileNames(files, serviceNameKebab)
      sourceDirectory = path.join(TEMPLATE_ROOT, config.name, config.manifest.sourceDirectory)
      installDirectory = path.join(projectRoot, 'src', config.manifest.installDirectory)

      // copy and update files for service being generated
      await copyFiles(sourceDirectory, installDirectory, files)
      await readAndUpdateFeatureFiles(installDirectory, files, serviceNameKebab, serviceNamePascal)
    })

    this.log(`${chalk.blue('[rdvue]')} created service ${serviceNameKebab}`)
  }
}
