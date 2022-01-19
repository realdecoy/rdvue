/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const skipPresets = '--skipPresets';
const testProjectName = 'rdv-hello-world-test';
const testLayoutName = 'hello-world';
// const badLayoutName = 'he%20-2world';

describe(CLI_COMMANDS.AddPage, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.AddPage])
    .it(`runs rdvue ${CLI_COMMANDS.AddPage} ${testLayoutName} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.AddLayout} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.AddLayout, testLayoutName])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.AddLayout} ${testLayoutName}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] page added: ${testLayoutName}`);
    });

  // test
  //   .stdout()
  //   .do(() => process.chdir(testProjectName))
  //   .command([CLI_COMMANDS.AddLayout, badLayoutName, skipPresets])
  //   .it('tries to run create page with a poorly formatted command', ctx => {
  //     expect(ctx.stdout).to.contain(`Error: command ${CLI_COMMANDS.AddLayout} not found`);
  //   });

  after(() => {
    exec(`rm -r ${testProjectName}`, error => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(`error: ${error.message}`);
      }
    });
  });
});
