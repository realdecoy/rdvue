import {expect, test} from '@oclif/test'
// const rimraf = require('rimraf')

const testProjectName = 'rdv-auth-service-test'
const testServiceName = 'auth-service'

describe('service', () => {
  test
  .stdout()
  .command(['generate', testProjectName])
  .do(() => process.chdir(testProjectName))
  .command(['service', testServiceName])
  .do(() => process.chdir('../'))
  // .do(() => {
  //   // cleanup generated files
  //   rimraf.sync(testProjectName)
  // })
  .it(`runs rdvue service ${testServiceName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] created service ${testServiceName}`)
  })
})
