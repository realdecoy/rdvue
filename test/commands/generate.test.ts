import {expect, test} from '@oclif/test'

describe('generate', () => {
  test
  .stdout()
  .command(['generate','hello-world'])
  .it('runs generate hello-world', ctx => {
    expect(ctx.stdout).to.contain('[rdvue2] Project ready')
  })
})
