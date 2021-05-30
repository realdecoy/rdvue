import {expect, test} from '@oclif/test';
import { CLI_COMMANDS } from '../../src/lib/constants';
import { exec } from 'child_process';

const testProjectName = 'rdv-hello-world';

const badProjectName = '$testProject@project';

describe(CLI_COMMANDS.CreateProject, () => {
  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, testProjectName])
    .it(`runs ${CLI_COMMANDS.CreateProject} ${testProjectName}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] ${testProjectName} is ready!`);
    });
  
  test
    .stdout()
    .do(() => process.chdir(testProjectName))
    .command([CLI_COMMANDS.CreateProject, testProjectName])
    .do(() => process.chdir('../'))
    .it(`runs ${CLI_COMMANDS.CreateProject} ${testProjectName}`, ctx => {
      expect(ctx.stdout).to.contain(`[rdvue] you are already in an existing rdvue project`);
    });

  test
    .stdout()
    .command([CLI_COMMANDS.CreateProject, badProjectName])
    .it('tries to run create project with a poorly formatted command', ctx => {
      expect(ctx.stdout).to.contain(`Error: command ${CLI_COMMANDS.CreateProject} not found`);
    });

  after(() => {
    exec(`rm -r ${testProjectName}`, (error) => {
      if(error) {
        console.log(`error: ${error.message}`);
      }
    });
  });
});
