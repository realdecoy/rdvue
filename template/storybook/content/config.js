// import * as React from 'react';
import { create } from '@storybook/theming';
import { addParameters, configure } from '@storybook/vue';
import { name, version } from '../package.json';

function loadStories() {
  require('./stories.scss');
}

const theme = create({
  base: 'light',
  brandTitle: `${name} ${version}`,
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
