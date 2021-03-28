import Vue, { VueConstructor } from 'vue';
import { Example, Preview } from '../components';
import { Category } from '../modules';
import { StoryComponent } from './story';

interface PreviewAddExample {
  addExample(options: PreviewOfExample, template: string): PreviewAddExample;
  render(): VueConstructor;
}

interface Components { [key: string]: VueConstructor; }
// tslint:disable-next-line: ban-types
interface Data { [key: string]: string | number | boolean | unknown[] | Function; }

interface PreviewOf {
  components: Components;
  template: string;
  category: string;
}

interface PreviewOfExample {
  title: string;
  description: string;
  styles?: string;
  codeEnabled?: boolean;
}

export function previewOf(target: VueConstructor, category: Category, components?: Components, data?: Data) {
  const definition = {
    components: {
      [target.name]: target,
      Preview,
      Example,
      ...components ?? {}, // Add additional components
    },
    template: ``,
    ['data']: () => data ?? {},
    category,
  };

  return {
    ...definition,
    addExample: addExample.bind(null, definition)
  };
}

export function addExample(
  data: PreviewOf,
  {
    title,
    description,
    styles,
    codeEnabled = true,
  }: PreviewOfExample,
  template: string): PreviewAddExample {

  data.template +=
    `<example \
      title="${title}" \
      description="${description}" \
      code="${escape(template)}"
      style="${styles}"\
      :code-enabled="${codeEnabled}"
    >${template}\
    </example>`;

  return {
    ...data,
    // tslint:disable-next-line: no-any
    addExample: addExample.bind(null, data) as any,
    // tslint:disable-next-line: no-any
    render: render.bind(null, data) as any
  };
}

export function render(data: PreviewOf) {
  const fn = () => data;
  fn.title = data.category;
  data.template = `<preview>${data.template}</preview>`;

  return fn;
}

export function docFor(name: string, description: string) {
  const constructor = Vue.extend({ name });

  // Apply Story decorator
  StoryComponent.call(null, { description })(constructor);

  return constructor;
}
