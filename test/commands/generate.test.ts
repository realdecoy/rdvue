import {expect, test} from '@oclif/test'
// const rimraf = require('rimraf')

const testProjectName = 'rdv-hello-world'

describe('generate', () => {
  test
  .stdout()
  .command(['generate', testProjectName])
  // .do(() => {
  //   // cleanup generated files
  //   rimraf.sync(testProjectName)
  // })
  .it(`runs generate ${testProjectName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] ${testProjectName} is ready`)
  })
})
