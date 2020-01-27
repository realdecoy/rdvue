const { spawn, exec } = require('child_process');


exec('rdvue --help', (error, stdout, stderr) => {
  if(error) {
      console.error('${err}');
      return;
    }

  console.log('${stdout}');
});


// const child = spawn('pwd');

// exec('rdvue --help', () => {
  
//    return runRdVue('--help').then(stdout => {
//       expect(stdout)
//    })
//   })


// child.stdout.on('data', (data) => {
//   console.log(`child stdout:\n${data}`);
// });

// child.on('exit', (code, signal) => {
//   console.log(`child process exited with ${code}`)
// });


function sum(a, b) {
    console.log( a + b );
  }
  // module.exports = sum;

  sum(1,2);


// function runRdVue(args = '', cwd = process.cwd()) {
//   const isRelative = cwd[0] != '/'
//   if (isRelative) {
//     cwd = path.resolve(lib, cwd)
//   }
// };