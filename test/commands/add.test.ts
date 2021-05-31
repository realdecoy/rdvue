import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';

describe(`${CLI_COMMANDS.AddModule} module`, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.AddModule])
    .it(`runs rdvue ${CLI_COMMANDS.AddModule} --help`, ctx => {
      expect(ctx.stdout).to.contain('npx rdvue add:<feature>');
    });

  // test
  //   .stdout()
  //   .command([CLI_COMMANDS.PoorHelpCommand])
  //   .it(`runs poorly formatted rdvue ${CLI_COMMANDS.AddModule} -help command`, ctx => {
  //     expect(ctx.error).to.contain(`Error: command ${CLI_COMMANDS.PoorHelpCommand} not found`);
  //   });
});
