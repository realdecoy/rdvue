/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../../src/lib/constants';
import { exec } from 'node:child_process';

const skipPresets = '--skipPresets';
const isTest = '--isTest';
const testProjectName = 'rdv-upgrade-test';
const { log } = console;

describe(CLI_COMMANDS.Upgrade, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.Upgrade])
    .it(`runs rdvue ${CLI_COMMANDS.Upgrade} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.Upgrade} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets, isTest])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.Upgrade, isTest])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.Upgrade}`, ctx => {
      expect(ctx.stdout).to.contain(`rdvue updated to version:`);
    });

  after(() => {
    exec(`shx rm -rf ${testProjectName}`, error => {
      if (error) {
        log(`error: ${error.message}`);
      }
    });
  });
});
