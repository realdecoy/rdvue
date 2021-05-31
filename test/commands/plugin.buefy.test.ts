/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const skipPresets = '--skipPresets';
const withBuefy = '--withBuefy';
const testProjectName = 'rdv-plugin-buefy-test';

describe(CLI_COMMANDS.PluginBuefy, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.PluginBuefy])
    .it(`runs rdvue ${CLI_COMMANDS.PluginBuefy} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.PluginBuefy} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets, withBuefy])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.PluginBuefy])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.PluginBuefy}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] plugin added: ${CLI_COMMANDS.PluginBuefy.split(':')[1]}`);
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
