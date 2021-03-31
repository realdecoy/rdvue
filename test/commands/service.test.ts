import {expect, test} from '@oclif/test'
import { CLI_COMMANDS } from '../../src/lib/constants'
// const rimraf = require('rimraf')

const testProjectName = 'rdv-auth-service-test'
const testServiceName = 'auth-service'

describe(CLI_COMMANDS.AddService, () => {
  test
  .stdout()
  .command([CLI_COMMANDS.CreateProject, testProjectName])
  .do(() => process.chdir(testProjectName))
  .command([CLI_COMMANDS.AddService, testServiceName])
  .do(() => process.chdir('../'))
  // .do(() => {
  //   // cleanup generated files
  //   rimraf.sync(testProjectName)
  // })
  .it(`runs rdvue ${CLI_COMMANDS.AddService} ${testServiceName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] new service module added: ${testServiceName}`)
  })
})
