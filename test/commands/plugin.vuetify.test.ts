/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const skipPresets = '--skipPresets';
const withVuetify = '--withVuetify';
const testProjectName = 'rdv-plugin-vuetify-test';

describe(CLI_COMMANDS.PluginVuetify, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.PluginVuetify])
    .it(`runs rdvue ${CLI_COMMANDS.PluginVuetify} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.PluginVuetify} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets, withVuetify])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.PluginVuetify])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.PluginVuetify}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] plugin added: ${CLI_COMMANDS.PluginVuetify.split(':')[1]}`);
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
