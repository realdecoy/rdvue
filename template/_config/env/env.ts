import envDev from './env.dev';
import envProd from './env.prod';

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';

export default Object.assign(
  {
    // Core environment properties.
    isDev: !isProd,
  },
  {
    // Add non-environment specific defaults here
    theme: 'default',
  },
  isProd ? envProd : envDev,
);
