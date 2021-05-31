/* global after */
import { expect, test } from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const skipPresets = '--skipPresets';
const testProjectName = 'rdv-auth-service-test';
const testServiceName = 'auth-service';
// const badServiceName = 'auth%20-2service';

describe(CLI_COMMANDS.AddService, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.AddService])
    .it(`runs rdvue ${CLI_COMMANDS.AddService} ${testServiceName} (outside project)`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${CLI_COMMANDS.AddService} command must be run in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName, skipPresets])
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.AddService, testServiceName])
    .do(() => process.chdir('../'))
    .it(`runs rdvue ${CLI_COMMANDS.AddService} ${testServiceName}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] service added: ${testServiceName}`);
    });

  // test
  //   .stdout()
  //   .do(() => process.chdir(testProjectName))
  //   .command([CLI_COMMANDS.AddService, badServiceName, skipPresets])
  //   .it('tries to run create service with a poorly formatted command', ctx => {
  //     expect(ctx.stdout).to.contain(`Error: command ${CLI_COMMANDS.AddService} not found`);
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
