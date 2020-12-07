<script lang="ts">
import { PropOptions, VueConstructor } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { StoryComponent, StoryProp } from '../modules';

const JSON_INDENTATION = 2;

@Component
export default class Props extends Vue {
  // --------------------------------------------------------------------------
  // Fields
  // --------------------------------------------------------------------------

  @Prop({ type: Object })
  public items!: { [key: string]: PropOptions };

  @Prop({ type: Function })
  public source!: VueConstructor;

  private propNames: string[] = [];
  private slots: Array<{ name: string; description: string }> = [];

  // --------------------------------------------------------------------------
  // Methods
  // --------------------------------------------------------------------------

  private mounted() {
    this.propNames = Object.keys(this.items ?? {});
    this.slots = StoryComponent.getSlots(this.source ?? {});
  }

  private getType(propName: string) {
    // tslint:disable-next-line:ban-types
    const typeDef = (this.items[propName]?.type as { name: string } | Array<Function>);
    // tslint:disable-next-line:no-any
    let typeName = (typeDef as any)?.name as string | undefined;
    const values = StoryProp.getValues(this.source, propName);

    if (typeDef instanceof Array) {
      typeName = typeDef.map(p => p.name)
        .join(', ');
    }

    if (values === undefined && typeName === undefined) {
      throw new Error(`Either @StoryProp 'values' or @Prop 'type' must be specified for property "${propName}".`);
    }

    const formattedValues = (values ?? [])
      .map(p => `<span class="border border-color-1 p-1" />${p}</span>`)
      .join(' ');

    return `<b>${typeName}</b>${values !== undefined ? `<br/>One of: ${formattedValues}` : ''}`;
  }

  private getDefault(propName: string) {
    let result: string;

    const defaultValue = this.items[propName]?.default;

    switch (typeof defaultValue) {
      case 'object':
        result = `<pre>${JSON.stringify(defaultValue, undefined, JSON_INDENTATION)}</pre>`;
        break;
      case 'string':
      case 'number':
      case 'boolean':
        result = defaultValue.toString();
        break;
      case 'function':
        result = 'function(...args: unknown[]): unknown';
        break;
      default:
        result = 'undefined';
    }

    return `<div class="border border-color-1 px-2 inline-block" />${result}</div>`;
  }

  private getDescription(propName: string) {
    return StoryProp.getDescription(this.source, propName);
  }
}
</script>

<style lang="scss" scoped>
.border-color-1 {
  border-color: #e2e8f0;
}
.bg-color-1 {
  background-color: #a5badb88;
}
.bg-color-2 {
  background-color: #a5badb33;
}
</style>
<template>
  <div class="grid grid-auto-row border border-color-1 bg-color-2 mt-10 rounded-lg">
    <div class="grid grid-cols-4 font-bold uppercase">
      <div
        v-for="(name, index) in ['Name', 'Type', 'Default', 'Description']"
        :key="name"
        class="border-r-0 border-t-0 border border-color-1 p-4"
        :class="`border-l${index === 0 ? '-0' : ''}`"
      >{{name}}</div>
    </div>
    <div
      class="grid grid-cols-1 border-l-0 border-r-0 border-t-0 border border-color-1 p-4 bg-color-2 text-sm uppercase font-bold"
    >Props</div>
    <div class="grid grid-cols-4 tt-10" v-for="(name) in propNames" :key="name">
      <div class="border-l-0 border-t-0 border-r-0 border border-color-1 p-4">{{name}}</div>
      <div
        class="border-l border-t-0 border-r-0 border border-color-1 p-4 leading-loose"
        v-html="getType(name)"
      ></div>
      <div
        class="border-l border-t-0 border-r-0 border border-color-1 p-4 leading-loose"
        v-html="getDefault(name)"
      ></div>
      <div
        class="border-l border-t-0 border-r-0 border border-color-1 p-4"
        v-html="getDescription(name)"
      ></div>
    </div>
    <div
      class="grid grid-cols-1 border-l-0 border-r-0 border-t-0 border border-color-1 p-4 bg-color-2 text-sm uppercase font-bold"
    >Slots</div>
    <div class="grid grid-cols-4 tt-10" v-for="(slot) in slots" :key="slot.name">
      <div class="border-l-0 border-t-0 border-r-0 border border-color-1 p-4" v-html="slot.name" />
      <div
        class="border-l border-t-0 border-r-0 border border-color-1 p-4 leading-loose"
        v-html="'Slot'"
      />
      <div class="border-l border-t-0 border-r-0 border border-color-1 p-4 leading-loose">-</div>
      <div
        class="border-l border-t-0 border-r-0 border border-color-1 p-4"
        v-html="slot.description"
      ></div>
    </div>
  </div>
</template>
