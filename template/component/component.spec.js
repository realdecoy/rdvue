import { shallowMount } from '@vue/test-utils';
import __COMPONENT__ from './__COMPONENT__KEBAB__.vue';

describe('__COMPONENT__.vue', () => {
  it('mounts component and check if component exists', () => {
    // Mount component and check if component exists
    const wrapper = shallowMount(__COMPONENT__);

    expect(wrapper.exists()).toEqual(true);
  });
});
