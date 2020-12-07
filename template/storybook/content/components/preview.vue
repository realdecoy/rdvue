<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Example from './example.vue';
import Playground from './playground.vue';
import Props from './props.vue';
import { StoryComponent } from '../modules';

const safe = new WeakMap<object, PreviewData>();

interface PreviewData {
  title?: string;
  description?: string;
}

interface VueLike {
  options: { name: string };
}

@Component({
  name: 'Preview',
  components: {
    Props,
    Playground
  }
})
export default class Preview extends Vue {
  // --------------------------------------------------------------------------
  // Fields
  // --------------------------------------------------------------------------

  @Prop()
  public for: VueLike | undefined;

  private component: VueLike | undefined = undefined;
  private description: string | undefined = '';
  private importStatement = '';
  private title = '';
  private activeTab = 0;
  private enablePlayground = true;
  private enableApi = true;

  // --------------------------------------------------------------------------
  // Accessors
  // --------------------------------------------------------------------------

  public get importStatementPretty() {
    return (this.importStatement ?? '').replace(
      /import|from/g,
      p => `<span class="text-red-400 font-bold">${p}</span>`
    );
  }

  // --------------------------------------------------------------------------
  // Methods
  // --------------------------------------------------------------------------

  private mounted() {
    const component = this.resolveStoryComponent() ?? {};
    const importPath = StoryComponent.getImportPath(component);

    this.component = component;
    this.title = component.options.name;
    this.description = StoryComponent.getDescription(component);
    this.enablePlayground = StoryComponent.getPlaygroundEnabled(component);
    this.enableApi = StoryComponent.getApiEnabled(component);

    if (importPath !== undefined) {
      const importPathStr = typeof importPath === 'string'
        ? importPath
        : importPath(this.title);

      this.importStatement = `import ${this.title} from '${importPathStr}';`;
    }
  }

  private resolveStoryComponent() {
    let component: VueLike | undefined;

    if (this.for === undefined) {
      component = Object.values(
        this.$parent.$options.components ?? {}
      )
        .find(p => StoryComponent.isDefined(p)) as VueLike;
    } else {
      component = this.for;
    }

    // If (component === undefined) {
    //   throw new Error('Preview component must have the prop "component" set.');
    // }

    return component;
  }

  private setActiveTab(index: number) {
    this.activeTab = index;
  }
}
</script>

<style lang="scss" scoped>
.active {
  position: relative;
  &::before {
    content: "";
    border-bottom: 0.2rem solid #ea3634;
    position: absolute;
    top: 2rem;
    width: 100%;
  }
}
.import-statement {
  background: #a5badb33;
  border-color: #cbd5e0;
}
</style>

<template>
  <div class="rounded-lg p-4 m-4">
    <div class="text-6xl pb-6 font-light">{{title}}</div>
    <div class="flex flex-row justify-start text-xl">
      <div
        v-for="(item, index) in ['Description', 'API', 'Playground']"
        :hidden="index === 1 && !enableApi || index === 2 && !enablePlayground"
        :key="item"
        class="mr-10 select-none cursor-pointer"
        :class="activeTab === index ? 'active': ''"
        @click="setActiveTab(index)"
      >{{item}}</div>
    </div>
    <div v-if="activeTab === 0">
      <div class="mt-10 font-light italic">{{description}}</div>
      <div v-if="importStatement">
        <div class="font-bold text-2xl mt-16">Import</div>
        <div
          class="import-statement border p-4 mt-4 rounded font-mono"
          v-html="importStatementPretty"
        ></div>
      </div>
      <!-- <div class="text-4xl mt-16">Examples</div> -->
      <div class="grid grid-flow-row gap-10 mt-24">
        <slot />
      </div>
    </div>
    <props
      v-if="activeTab === 1 && enableApi"
      :source="component"
      :items="component.options.props"
    />
    <playground
      v-if="activeTab === 2 && enablePlayground"
      :source="component"
      :items="component.options.props || {}"
    />
  </div>
</template>