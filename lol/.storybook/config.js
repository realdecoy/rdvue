// import * as React from 'react';
import { create } from '@storybook/theming';
import { addParameters, configure } from '@storybook/vue';
// import { withI18n } from 'storybook-addon-i18n';
// import MadeforToggle from './addons/MadeforToggle';
import { version } from '../package.json';

function loadStories() {
  require('./stories.scss');
  // require('./stories');
}



const theme = create({
  base: 'light',
  brandTitle: `trial ${version}`,
  brandUrl: '__BRAND_URL__',
});

// Parameters
addParameters({
  options: {
    theme,
    showPanel: false,
    isFullscreen: false,
    storySort: undefined,
    isToolshown: true,
  }
});

// Decorators
// addDecorator(withI18n);
// addDecorator(MadeforToggle);

configure(loadStories, module);
