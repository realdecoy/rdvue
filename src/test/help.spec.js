// Add test file for help function
const methods = require('../../build/main/index');


test('checking what happens when a user passes in the help flag', () => {
    expect(methods.run(['generate','project','--help'])).resolves;
});


test('checking what happens when a user passes incorrect input', () => {
    expect(methods.run(['generate','--help'])).rejects;
});