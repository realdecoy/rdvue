// import * as React from 'react';
import { create } from '@storybook/theming';
import { addParameters, configure } from '@storybook/vue';
import { version } from '../package.json';

function loadStories() {
  require('./stories.scss');
}

const theme = create({
  base: 'light',
  brandTitle: `__PROJECT__NAME__KEBAB__ ${version}`,
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


configure(loadStories, module);
