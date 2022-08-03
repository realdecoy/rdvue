/* eslint-disable max-lines */
export enum ChangelogMetaDataTypes {
  MIGRATION = 'migration',
    UPDATE = 'update',
    PATCH = 'patch',
}

export enum ChangelogConfigTypes {
  META_DATA = 'metadata',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
}

export enum ChangelogContentOperations {
  ADD = 'add',
    REMOVE = 'remove',
    UPDATE = 'update',
}

export type ChangelogResourcesContent = {
  key: string;
  value: any;
  operation: string;
}

export type changeLogFile = {
  source: string;
  target: string;
}

export type ChangelogResource = {
  name: string;
  file ? : changeLogFile;
  destPath: string;
  srcPath ? : string;
  type: string;
  contents ? : ChangelogResourcesContent[]
}

export type ChangelogResources = {
  resources: ChangelogResource[];
}

export type Metadata = {
  version: string;
  type ? : ChangelogMetaDataTypes;
  resources ? : ChangelogResources[];
};

export type ChangeLog = {
  metadata: Metadata;
  create ? : ChangelogResources;
  update ? : ChangelogResources;
  delete ? : ChangelogResources;
}

export function handleArraysAndObjects(data: any, key: string, operation: ChangelogContentOperations, newValue: any): void {
  const currentValue = data[key];
  if (operation === ChangelogContentOperations.REMOVE) {
    if (Array.isArray(newValue)) {
      for (const item of newValue) {
        const index = currentValue.indexOf(item);
        delete currentValue[index];
      }
    } else {
      delete data[key];
    }
  } else if (operation === ChangelogContentOperations.UPDATE) {
    data[key] = Array.isArray(newValue) ? [...currentValue, ...newValue] : {
      ...currentValue,
      ...newValue,
    };
  } else if (operation === ChangelogContentOperations.ADD) {
    data[key] = Array.isArray(newValue) ? [...newValue] : {
      ...newValue,
    };
  }
}

export function handlePrimitives(data: any, key: string, operation: ChangelogContentOperations, newValue: any): void {
  if (operation === ChangelogContentOperations.REMOVE) {
    delete data[key];
  } else if (operation === ChangelogContentOperations.ADD) {
    data[key] = newValue;
  }
}

export const DEFAULT_CHANGE_LOG: ChangeLog = {
  metadata: {
    version: 'default',
    type: ChangelogMetaDataTypes.MIGRATION,
  },
  create: {
    resources: [{
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
      name: 'webpack.config.ts',
      file: {
        source: 'webpack.config.ts',
        target: 'webpack.config.ts',
      },
      destPath: '',
      srcPath: '',
      type: 'file',
    },
    {
      name: ' main.ts',
      file: {
        source: 'main.ts',
        target: 'main.update.ts',
      },
      srcPath: 'src',
      destPath: 'src',
      type: 'file',
    },
    {
      name: 'tsconfig.json',
      file: {
        source: 'tsconfig.json',
        target: 'tsconfig.update.json',
      },
      srcPath: '',
      destPath: '',
      type: 'file',
    },
    {
      name: 'postcss.config.js',
      file: {
        source: 'postcss.config.js',
        target: 'postcss.config.update.js',
      },
      srcPath: '',
      destPath: '',
      type: 'file',
    },
    {
      name: 'tailwind.config.js',
      file: {
        source: 'tailwind.config.js',
        target: 'tailwind.config.update.js',
      },
      srcPath: '',
      destPath: '',
      type: 'file',
    },
    {
      name: 'README',
      file: {
        source: 'README.md',
        target: 'README.update.md',
      },
      srcPath: '',
      destPath: '',
      type: 'file',
    },
    {
      name: 'CHANGELOG.md',
      file: {
        source: 'CHANGELOG.md',
        target: 'CHANGELOG.md',
      },
      srcPath: '',
      destPath: '',
      type: 'file',
    }],
  },
  update: {
    resources: [{
      name: 'package.json',
      destPath: 'package.json',
      type: 'file',
      contents: [{
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
        value: 'cd node_modules/design-system && npm install && npm run serve:rdvue -- --port',
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
        value: 'docker run -it -p 8080:8080 -v $(pwd):/app -w /app --rm node bash -c "npm run serve"',
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
        value: 'cd node_modules/design-system && npm install && npm run serve:rdvue -- --port 9000',
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
      {
        key: 'devDependencies.@babel/register',
        value: '^7.16.9',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/copy-webpack-plugin',
        value: '^8.0.1',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/dotenv-webpack',
        value: '^7.0.2',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/favicons',
        value: '^5.5.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/marked',
        value: '^2.0.3',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/mini-css-extract-plugin',
        value: '^1.4.3',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/mocha',
        value: '^5.2.7',
        operation: 'add',
      },
      {
        key: 'devDependencies.@vue/cli-plugin-babel',
        value: '^3.4.0',
        operation: 'remove',
      },
      {
        key: 'devDependencies.@vue/cli-plugin-typescript',
        value: '^3.4.0',
        operation: 'remove',
      },
      {
        key: 'devDependencies.@vue/cli-service',
        value: '^4.3.1',
        operation: 'remove',
      },
      {
        key: 'devDependencies.@types/pretty',
        value: '^2.0.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/speed-measure-webpack-plugin',
        value: '^1.3.4',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/tailwindcss',
        value: '^3.0.2',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/webpack-dev-server',
        value: '^3.11.4',
        operation: 'add',
      },
      {
        key: 'devDependencies.@types/webpack-env',
        value: '^1.16.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.clean-webpack-plugin',
        value: '^4.0.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.copy-webpack-plugin',
        value: '^10.2.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.cross-env',
        value: '^7.0.3',
        operation: 'add',
      },
      {
        key: 'devDependencies.css-loader',
        value: '^5.2.6',
        operation: 'add',
      },
      {
        key: 'devDependencies.dotenv-webpack',
        value: '^7.1.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.esbuild-loader',
        value: '^2.18.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.favicons',
        value: '^6.2.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.glob',
        value: '^7.2.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.html-webpack-plugin',
        value: '^5.5.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.js-beautify',
        value: '^1.13.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.local-web-server',
        value: '^5.1.1',
        operation: 'add',
      },
      {
        key: 'devDependencies.log-symbols',
        value: '^4.0.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.mini-css-extract-plugin',
        value: '^2.5.2',
        operation: 'add',
      },
      {
        key: 'devDependencies.postcss',
        value: '^8.4.5',
        operation: 'add',
      },
      {
        key: 'devDependencies.postcss-loader',
        value: '^4.0.3',
        operation: 'add',
      },
      {
        key: 'devDependencies.register-service-worker',
        value: '^1.5.2',
        operation: 'add',
      },
      {
        key: 'devDependencies.sass',
        value: '^1.45.1',
        operation: 'add',
      },
      {
        key: 'devDependencies.sass-loader',
        value: '^10.2.1',
        operation: 'add',
      },
      {
        key: 'devDependencies.speed-measure-webpack-plugin',
        value: '^1.5.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.ts-node',
        value: '^10.7.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.typescript-node',
        value: '^0.1.3',
        operation: 'add',
      },
      {
        key: 'devDependencies.typescript-require',
        value: '^0.3.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.vue-loader',
        value: '^15.9.8',
        operation: 'add',
      },
      {
        key: 'devDependencies.webpack-bundle-analyzer',
        value: '^3.7.0',
        operation: 'add',
      },
      {
        key: 'devDependencies.webpack-cli',
        value: '^4.9.2',
        operation: 'add',
      },
      {
        key: 'devDependencies.webpack-dev-server',
        value: '^3.11.3',
        operation: 'add',
      },
      {
        key: 'devDependencies.webpackbar',
        value: '^5.0.2',
        operation: 'add',
      },
      {
        key: 'devDependencies.ws',
        value: '^7.5.6',
        operation: 'add',
      },
      {
        key: 'devDependencies.node-sass',
        value: '^4.9.0',
        operation: 'remove',
      },
      {
        key: 'devDependencies.sass-loader',
        value: '^7.1.0',
        operation: 'remove',
      },
      {
        key: 'devDependencies.webpack-bundle-analyzer',
        value: '^3.7.0',
        operation: 'remove',
      }],
    }],
  },
  delete: {
    resources: [{
      name: 'vue.config.js',
      destPath: '',
      type: 'file',
    },
    {
      name: '.package-lock.json',
      destPath: '',
      type: 'file',
    }],
  },
};
