import {expect, test} from '@oclif/test'
// const rimraf = require('rimraf')

const testProjectName = 'rdv-hello-world'

describe('create-project', () => {
  test
  .stdout()
  .command(['create-project', testProjectName])
  // .do(() => {
  //   // cleanup create-projectd files
  //   rimraf.sync(testProjectName)
  // })
  .it(`runs create-project ${testProjectName}`, ctx => {
    expect(ctx.stdout).to.contain(`[rdvue] ${testProjectName} is ready!`)
  })
})
