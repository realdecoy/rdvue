import { ChangeLog } from '../modules';

export enum ChangelogMetaDataTypes {
  MIGRATION = 'migration',
  UPDATE = 'update',
  PATCH = 'patch',
}

export enum ChangelogConfigTypes {
  META_DATA = 'metaData',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export const CHANGE_LOG: ChangeLog = {
  [ChangelogConfigTypes.META_DATA]: {
    version: '',
    type: ChangelogMetaDataTypes.MIGRATION,
  },
  [ChangelogConfigTypes.CREATE]: {
    resources: [
      {
        name: 'index.ts',
        file: {
          source: 'index.ts',
          target: 'index.ts',
        },
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: '.env',
        file: {
          source: '.env',
          target: '.env',
        },
        destPath: 'config',
        srcPath: 'config',
        type: 'file',
      },
      {
        name: '.env.example',
        file: {
          source: '.env.example',
          target: '.env.example',
        },
        destPath: 'config',
        srcPath: 'config',
        type: 'file',
      },
      {
        name: 'media-loader.ts',
        file: {
          source: 'media-loader.ts',
          target: 'media-loader.ts',
        },
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'sass-loader.ts',
        file: {
          source: 'sass-loader.ts',
          target: 'sass-loader.ts',
        },
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'ts-loader.ts',
        file: {
          source: 'ts-loader.ts',
          target: 'ts-loader.ts',
        },
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'vue-loader.ts',
        file: {
          source: 'vue-loader.ts',
          target: 'vue-loader.ts',
        },
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'font-loader.ts',
        file: {
          source: 'font-loader.ts',
          target: 'font-loader.ts',
        },
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'webpack.config.js',
        file: {
          source: 'webpack.config.ts',
          target: 'webpack.config.ts',
        },
        destPath: '',
        srcPath: '',
        type: 'file',
      },
    ],
  },
  [ChangelogConfigTypes.UPDATE]: {
    resources: [
      {
        name: 'package.json',
        destPath: 'package.json',
        type: 'file',
        contents: [
          {
            key: 'scripts.audit',
            value: 'npm audit --prod',
            operation: 'add',
          },
          {
            key: 'scripts.postinstall',
            value: 'run-s upgrade-rdvue',
            operation: 'remove',
          },
          {
            key: 'scripts.serve',
            value: 'vue-cli-service serve',
            operation: 'remove',
          },
          {
            key: 'scripts.serve-static',
            value: 'cd dist && ws --spa index.html -z',
            operation: 'remove',
          },
          {
            key: 'scripts.build',
            value: 'vue-cli-service build',
            operation: 'remove',
          },
          {
            key: 'scripts.launch-ds',
            value:
              'cd node_modules/design-system && npm install && npm run serve:rdvue -- --port',
            operation: 'add',
          },
          {
            key: 'scripts.preinstall',
            value: 'run-s upgrade-rdvue',
            operation: 'add',
          },
          {
            key: 'scripts.serve',
            value: 'cross-env NODE_ENV=development webpack serve',
            operation: 'add',
          },
          {
            key: 'scripts.build',
            value: 'cross-env NODE_ENV=development webpack build',
            operation: 'add',
          },
          {
            key: 'scripts.serve:build',
            value: 'cd dist && ws --https --spa index.html -z -p 9000',
            operation: 'add',
          },
          {
            key: 'scripts.serve:docker',
            value:
              'docker run -it -p 8080:8080 -v $(pwd):/app -w /app --rm node bash -c "npm run serve"',
            operation: 'add',
          },
          {
            key: 'scripts.serve:ds',
            value: 'run-s setup-ds-webpack launch-design-system',
            operation: 'add',
          },
          {
            key: 'scripts.test:unit',
            value: 'echo "Error: no unit test specified" && exit 1',
            operation: 'remove',
          },
          {
            key: 'launch-design-system',
            value:
              'cd node_modules/design-system && npm install && npm run serve:rdvue -- --port 9000',
            operation: 'remove',
          },
          {
            key: 'serve:design-system',
            value: 'run-s setup-ds-webpack launch-design-system',
            operation: 'remove',
          },
          {
            key: 'test:unit',
            value: 'echo "Error: no unit test specified" && exit 1',
            operation: 'add',
          },
          {
            key: 'dependencies.favicons',
            value: '^6.2.0',
            operation: 'remove',
          },
          {
            key: 'dependencies.js-beautify',
            value: '^1.13.0',
            operation: 'remove',
          },
          {
            key: 'dependencies.log-symbols',
            value: '^4.0.0',
            operation: 'remove',
          },
          {
            key: 'dependencies.register-service-worker',
            value: '^1.5.2',
            operation: 'remove',
          },
          {
            key: 'dependencies.ws',
            value: '^7.4.5',
            operation: 'remove',
          },
          {
            key: 'dependencies.webpack',
            value: '^5.71.0',
            operation: 'add',
          },
        ],
      },
      {
        name: ' main.ts',
        destPath: 'src/main.ts',
        type: 'file',
      },
      {
        name: 'tsconfig.json',
        destPath: 'tsconfig.json',
        type: 'file',
      },
      {
        name: 'postcss.config.js',
        destPath: 'postcss.config.js',
        type: 'file',
      },
      {
        name: 'tailwind.config.js',
        destPath: 'tailwind.config.js',
        type: 'file',
      },
      {
        name: 'pages/hello-world',
        destPath: 'src/pages/hello-world',
        type: 'file',
      },
      {
        name: 'README',
        destPath: 'README.md',
        type: 'file',
      },
    ],
  },
  [ChangelogConfigTypes.DELETE]: {
    resources: [
      {
        name: 'vue.config.js',
        destPath: '',
        type: 'file',
      },
      {
        name: '.package-lock.json',
        destPath: '',
        type: 'file',
      },
    ],
  },
};
