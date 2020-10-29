import __COMPONENT__ from './__COMPONENT__KEBAB__.vue';
import { Category, previewOf } from '.rdvue/storybook';

const preview = previewOf(__COMPONENT__, Category.COMPONENT)
  // Default example. You can add more by chaining .addExample().
  .addExample(
    {
      title: 'Default - __COMPONENT__',
      description: 'This is the default __COMPONENT__ component',
      styles: ''
    },
    // Template code for component example.
    `
    <__COMPONENT__KEBAB__ />
    `,
  )
  .render();

// ----------------------------------------------------------------------------
// Module Exports
// ----------------------------------------------------------------------------
export {
  preview as default,
  preview as __COMPONENT__
};
