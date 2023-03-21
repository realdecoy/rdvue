/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../../src/lib/constants';
import { exec } from 'node:child_process';

const skipPresets = '--skipPresets';
const isTest = '--isTest';
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
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets, isTest])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.PluginBuefy, isTest])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.PluginBuefy}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] plugin added: ${CLI_COMMANDS.PluginBuefy.split(' ')[1]}`);
    });

  after(() => {
    exec(`shx rm -rf ${testProjectName}`, error => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(`error: ${error.message}`);
      }
    });
  });
});
