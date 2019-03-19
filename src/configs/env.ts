import envDev from './env.dev';
import envProd from './env.prod';

const { NODE_ENV } = process.env;

export default Object.assign(
  {
    // Add non-environment specific defaults here
  },
  NODE_ENV === 'production' ? envProd : envDev,
);
