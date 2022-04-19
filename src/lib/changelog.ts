import { ChangeLog } from '../modules';

export enum ChangelogMetaDataTypes {
  MIGRATION = 'migration',
    PATCH = 'patch',
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
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: '.env',
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: '.env.example',
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'media-loader.ts',
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'sass-loader.ts',
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'ts-loader.ts',
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'vue-loader.ts',
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'font-loader.ts',
        destPath: 'scripts/config',
        srcPath: 'scripts/config',
        type: 'file',
      },
      {
        name: 'webpack.config.js',
        destPath: './',
        srcPath: './',
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
        destPath: './',
        type: 'file',
      },
      {
        name: '.env.example',
        destPath: './',
        type: 'file',
      },
      {
        name: '.package-lock.json',
        destPath: './',
        type: 'file',
      },
    ],
  },
};
