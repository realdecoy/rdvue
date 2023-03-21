/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../../src/lib/constants';
import { exec } from 'node:child_process';

const testProjectName = 'rdv-hello-world';
const skipPresets = '--skipPresets';
const isTest = '--isTest';
// const badProjectName = '$testProject@project';

describe(CLI_COMMANDS.CreateProject, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets, isTest])
    .it(`runs ${CLI_COMMANDS.CreateProject} ${testProjectName}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${testProjectName} is ready!`);
    });

  test
    .stdout()
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets, isTest])
    .do(() => process.chdir('../'))
    .it(`runs ${CLI_COMMANDS.CreateProject} ${testProjectName}`, ctx => {
      expect(ctx.stdout).to.contain('[rdvue] you are already in an existing rdvue project');
    });

  // test
  //   .stdout()
  //   .command([CLI_COMMANDS.CreateProject, badProjectName, skipPresets])
  //   .it('tries to run create project with a poorly formatted command', ctx => {
  //     expect(ctx.stdout).to.contain(`Error: command ${CLI_COMMANDS.CreateProject} not found`);
  //   });

  after(() => {
    exec(`shx rm -rf ${testProjectName}`, error => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(`error: ${error.message}`);
      }
    });
  });
});
