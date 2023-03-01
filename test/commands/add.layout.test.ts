/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const skipPresets = '--skipPresets';
const testProjectName = 'rdv-component-test';
const testLayoutName = 'hello-world';

describe(CLI_COMMANDS.AddLayout, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.AddLayout])
    .it(`runs rdvue ${CLI_COMMANDS.AddLayout} ${testLayoutName} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.AddLayout} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.AddLayout, testLayoutName])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.AddLayout} ${testLayoutName}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] layout added: ${testLayoutName}`);
    });

  after(() => {
    exec(`rm -r ${testProjectName}`, error => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(`error: ${error.message}`);
      }
    });
  });
});
