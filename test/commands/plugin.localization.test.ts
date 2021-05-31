/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const skipPresets = '--skipPresets';
const withLocalization = '--withLocalization';
const testProjectName = 'rdv-plugin-localization-test';

describe(CLI_COMMANDS.PluginLocalization, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.PluginLocalization])
    .it(`runs rdvue ${CLI_COMMANDS.PluginLocalization} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.PluginLocalization} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets, withLocalization])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.PluginLocalization])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.PluginLocalization}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] plugin added: ${CLI_COMMANDS.PluginLocalization.split(':')[1]}`);
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
