/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const skipPresets = '--skipPresets';
const testProjectName = 'rdv-hello-world-test';
const testPageName = 'hello-world';
// const badPageName = 'he%20-2world';

describe(CLI_COMMANDS.AddScreen, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.AddScreen])
    .it(`runs rdvue ${CLI_COMMANDS.AddScreen} ${testPageName} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.AddScreen} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.AddScreen, testPageName])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.AddScreen} ${testPageName}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] page added: ${testPageName}`);
    });

  // test
  //   .stdout()
  //   .do(() => process.chdir(testProjectName))
  //   .command([CLI_COMMANDS.AddScreen, badPageName, skipPresets])
  //   .it('tries to run create page with a poorly formatted command', ctx => {
  //     expect(ctx.stdout).to.contain(`Error: command ${CLI_COMMANDS.AddScreen} not found`);
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
