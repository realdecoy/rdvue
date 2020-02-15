// Add test file for help function
const methods = require('../../build/main/index');


test('checking what happens when a user passes in the help flag', async () => {
    expect.assertions(1);
    return methods.runRDVueCLI(['generate','project','--help']);
    // throw new Error('process.exit() was called.');
});
