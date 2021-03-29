import {expect, test} from '@oclif/test'
// const rimraf = require('rimraf')

const testProjectName = 'rdv-component-test'
const testComponentName = 'hello-world'

describe('component', () => {
  test
  .stdout()
  .command(['generate', testProjectName])
  .do(() => process.chdir(testProjectName))
  .command(['component', testComponentName])
  .do(() => process.chdir('../'))
  // .do(() => {
  //   // cleanup generated files
  //   rimraf.sync(testProjectName)
  // })
  .it(`runs rdvue component ${testComponentName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] created component ${testComponentName}`)
  })
})
