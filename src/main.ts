import { run } from '../src/index';

run()
.then(() => {
  console.info('info');
})
.catch((err: Error) => {
  console.error(`Error at run: ${err}`);
});
