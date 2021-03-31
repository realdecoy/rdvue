import {expect, test} from '@oclif/test'
import { CLI_COMMANDS } from '../../src/lib/constants'
// const rimraf = require('rimraf')

const testProjectName = 'rdv-store-module-test'
const testServiceName = 'auth-store'

describe(CLI_COMMANDS.AddStore, () => {
  test
  .stdout()
  .command([CLI_COMMANDS.CreateProject, testProjectName])
  .do(() => process.chdir(testProjectName))
  .command([CLI_COMMANDS.AddStore, testServiceName])
  .do(() => process.chdir('../'))
  // .do(() => {
  //   // cleanup generated files
  //   rimraf.sync(testProjectName)
  // })
  .it(`runs rdvue ${CLI_COMMANDS.AddStore} ${testServiceName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] new store module added: ${testServiceName}`)
  })
})
