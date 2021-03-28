import {expect, test} from '@oclif/test'
const rimraf = require('rimraf')

const testProjectName = 'rdv-hello-world-test'
const testPageName = 'hello-world'

describe('page', () => {
  test
  .stdout()
  .command(['generate', testProjectName])
  .do(() => process.chdir(testProjectName))
  .command(['page', testPageName])
  .do(() => process.chdir('../'))
  .do(() => {
    // cleanup generated files
    rimraf.sync(testProjectName)
  })
  .it(`runs rdvue page ${testPageName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] created page ${testPageName}`)
  })
})
