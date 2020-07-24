import __COMPONENT__ from './__COMPONENT__KEBAB__.vue';
import { Category, previewOf } from '../../../.storybook/modules';

// ----------------------------------------------------------------------------
// Module Exports
// ----------------------------------------------------------------------------

const preview = previewOf(__COMPONENT__, Category.COMPONENT)
  // You can add mutiple examples
  .addExample(
    {
      title: 'Standard - __COMPONENT__ Component',
      description: 'This is the standard __COMPONENT__ component',
      styles: ''
    },
    
// add snippet of component use here
    `
    <__COMPONENT__KEBAB__ />
    `,
  )
  .render();

export { preview as default, preview as __COMPONENT__ };

