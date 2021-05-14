import {expect, test} from '@oclif/test'
import { CLI_COMMANDS } from '../../src/lib/constants'
import { exec } from 'child_process'

const testProjectName = 'rdv-component-test'
const testComponentName = 'hello-world'
const badComponentName = 'he%20-2world'

describe(CLI_COMMANDS.AddComponent, () => {
  test
  .stdout()
  .command([CLI_COMMANDS.AddComponent, testComponentName])
  .it(`runs rdvue ${CLI_COMMANDS.AddComponent} ${testComponentName} (outside project)`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.AddComponent} command must be run in an existing rdvue project`)
  })

  test
  .stdout()
  .command([CLI_COMMANDS.CreateProject, testProjectName])
  .do(() => process.chdir(testProjectName))
  .command([CLI_COMMANDS.AddComponent, testComponentName])
  .do(() => process.chdir('../'))
  .it(`runs rdvue ${CLI_COMMANDS.AddComponent} ${testComponentName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] new component module added: ${testComponentName}`)
  });

  test
  .stdout()
  .command([CLI_COMMANDS.AddComponent, badComponentName])
  .it('tries to run create component with a poorly formatted command', ctx => {
    expect(ctx.stdout).to.contain(`Error: command ${CLI_COMMANDS.AddComponent} not found`)
  })

  after(() => {
    exec(`rm -r ${testProjectName}`, (error) => {
       if(error) {
         console.log(`error: ${error.message}`)
       }
    })
 })
})
