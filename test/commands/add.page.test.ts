import {expect, test} from '@oclif/test'
import { CLI_COMMANDS } from '../../src/lib/constants'
import { exec } from 'child_process';

const testProjectName = 'rdv-hello-world-test'
const testPageName = 'hello-world'

describe(CLI_COMMANDS.AddPage, () => {
  test
  .stdout()
  .command([CLI_COMMANDS.AddPage, testPageName])
  .it(`runs rdvue ${CLI_COMMANDS.AddPage} ${testPageName} (outside project)`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.AddPage} command must be run in an existing rdvue project`)
  })

  test
  .stdout()
  .command([CLI_COMMANDS.CreateProject, testProjectName])
  .do(() => process.chdir(testProjectName))
  .command([CLI_COMMANDS.AddPage, testPageName])
  .do(() => process.chdir('../'))
  .it(`runs rdvue ${CLI_COMMANDS.AddPage} ${testPageName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] new page module added: ${testPageName}`)
  })

  after(() => {
    exec(`rm -r ${testProjectName}`, (error) => {
       if(error) {
         console.log(`error: ${error.message}`);
       }
    })
 })
})
