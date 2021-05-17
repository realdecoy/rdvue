import {expect, test} from '@oclif/test'
import { CLI_COMMANDS } from '../../src/lib/constants'

const testProjectName = 'rdv-hello-world'

describe(CLI_COMMANDS.CreateProject, () => {
  test
  .stdout()
  .command([CLI_COMMANDS.CreateProject, testProjectName])
  .it(`runs ${CLI_COMMANDS.CreateProject} ${testProjectName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] ${testProjectName} is ready!`)
  })
  
  test
  .stdout()
  .do(() => process.chdir(testProjectName))
  .command([CLI_COMMANDS.CreateProject, testProjectName])
  .do(() => process.chdir('../'))
  .it(`runs ${CLI_COMMANDS.CreateProject} ${testProjectName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] you are already in an existing rdvue project`)
  })
})
