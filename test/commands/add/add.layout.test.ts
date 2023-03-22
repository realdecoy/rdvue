/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../../src/lib/constants';
import { exec } from 'node:child_process';

const skipPresets = '--skipPresets';
const isTest = '--isTest';
const testProjectName = 'rdv-layout-test';
const testProjectName2 = 'rdv-layout-test2';
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
    .command([CLI_COMMANDS.CreateProject, testProjectName2, skipPresets, isTest])
    .do(() => process.chdir(testProjectName2))
    .command([CLI_COMMANDS.AddLayout, testLayoutName])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.AddLayout} ${testLayoutName}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] layout added: ${testLayoutName}`);
    });

  after(() => {
    exec(`shx rm -rf ${testProjectName}`, error => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(`error: ${error.message}`);
      }
    });
    exec(`shx rm -rf ${testProjectName2}`, error => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(`error: ${error.message}`);
      }
    });
  });
});
