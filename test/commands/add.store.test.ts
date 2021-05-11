import {expect, test} from '@oclif/test'
import { CLI_COMMANDS } from '../../src/lib/constants'
import { exec } from 'child_process'

const testProjectName = 'rdv-store-module-test'
const testStoreName = 'auth-store'

describe(CLI_COMMANDS.AddStore, () => {
  test
  .stdout()
  .command([CLI_COMMANDS.AddStore, testStoreName])
  .it(`runs rdvue ${CLI_COMMANDS.AddStore} ${testStoreName} (outside project)`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.AddStore} command must be run in an existing rdvue project`)
  })

  test
  .stdout()
  .command([CLI_COMMANDS.CreateProject, testProjectName])
  .do(() => process.chdir(testProjectName))
  .command([CLI_COMMANDS.AddStore, testStoreName])
  .do(() => process.chdir('../'))
  .it(`runs rdvue ${CLI_COMMANDS.AddStore} ${testStoreName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] new store module added: ${testStoreName}`)
  })

  after(() => {
    exec(`rm -r ${testProjectName}`, (error) => {
       if(error) {
         console.log(`error: ${error.message}`);
       }
    })
 })
})
