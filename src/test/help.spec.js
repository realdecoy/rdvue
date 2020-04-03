// This test file checks what happens when a user types in the help flag
const methods = require('../../build/main/index');

// Test case
test('checking what happens when a user passes in the help flag', () => {
    // Since this is returning a promise, we use the resolve method to check that the promise returned with no errors
    expect(methods.run(['generate','project','--help'])).resolves;
});

// Test case
test('checking what happens when a user passes incorrect input', () => {
    // Since this is returning a promise, we use the rejects method to check that the promise returned with an error
    expect(methods.run(['generate','--help'])).rejects;
});