import {expect, test} from '@oclif/test'
// const rimraf = require('rimraf')

const testProjectName = 'rdv-store-module-test'
const testServiceName = 'auth-store'

describe('sm', () => {
  test
  .stdout()
  .command(['generate', testProjectName])
  .do(() => process.chdir(testProjectName))
  .command(['sm', testServiceName])
  .do(() => process.chdir('../'))
  // .do(() => {
  //   // cleanup generated files
  //   rimraf.sync(testProjectName)
  // })
  .it(`runs rdvue sm ${testServiceName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] created store module ${testServiceName}`)
  })
})
