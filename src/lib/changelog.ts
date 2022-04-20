import { ChangeLog } from '../modules';

export enum ChangelogMetaDataTypes {
  MIGRATION = 'migration',
  UPDATE = 'update',
  PATCH = 'patch'
}

export enum ChangelogConfigTypes {
  META_DATA = 'metaData',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
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
