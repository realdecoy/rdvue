/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const skipPresets = '--skipPresets';
const testProjectName = 'rdv-component-test';
const testComponentName = 'hello-world';
const { log } = console;

describe(CLI_COMMANDS.Upgrade, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.Upgrade])
    .it(`runs rdvue ${CLI_COMMANDS.Upgrade} ${testComponentName} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.Upgrade} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.Upgrade])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.Upgrade}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] component added: ${testComponentName}`);
    });

  after(() => {
    exec(`rm -r ${testProjectName}`, error => {
      if (error) {
        log(`error: ${error.message}`);
      }
    });
  });
});
