import {expect, test} from '@oclif/test'
import { CLI_COMMANDS } from '../../src/lib/constants'
// const rimraf = require('rimraf')

const testProjectName = 'rdv-hello-world-test'
const testPageName = 'hello-world'

describe(CLI_COMMANDS.AddPage, () => {
  test
  .stdout()
  .command([CLI_COMMANDS.CreateProject, testProjectName])
  .do(() => process.chdir(testProjectName))
  .command([CLI_COMMANDS.AddPage, testPageName])
  .do(() => process.chdir('../'))
  // .do(() => {
  //   // cleanup generated files
  //   rimraf.sync(testProjectName)
  // })
  .it(`runs rdvue ${CLI_COMMANDS.AddPage} ${testPageName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] new page module added: ${testPageName}`)
  })
})
