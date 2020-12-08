<script lang="ts">
import { PropOptions, VueConstructor } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { StoryProp } from '../modules';


@Component
export default class Playground extends Vue {
  // --------------------------------------------------------------------------
  // Fields
  // --------------------------------------------------------------------------

  @Prop({ type: Object })
  public items!: { [key: string]: PropOptions<object> };

  @Prop({ type: Function })
  public source!: VueConstructor;

  private readonly DEFAULT = '__undefined__';
  private propNames: string[] = [];
  private livePreview?: Vue = undefined;

  // --------------------------------------------------------------------------
  // Methods
  // --------------------------------------------------------------------------

  private mounted() {
    const render = this.$refs.render as Element;
    const livePreview = new this.source();

    livePreview.$mount();
    render.appendChild(livePreview.$el);

    this.propNames = Object.keys(this.items);
    this.livePreview = livePreview;
  }

  private getDefault(propName: string) {
    return this.items[propName]?.default;
  }

  private getType(propName: string) {
    // tslint:disable-next-line:ban-types
    const typeDef = (this.items[propName]?.type as { name: string } | Array<Function>);
    // tslint:disable-next-line:no-any
    let typeName = (typeDef as any)?.name as string | undefined;
    const values = StoryProp.getValues(this.source, propName);

    if (typeDef instanceof Array) {
      typeName = typeDef.map(p => p.name)[0];
    }

    if (typeName === undefined) {
      throw new Error(`Either @StoryProp 'values' or @Prop 'type' must be specified for property "${propName}".`);
    }

    return typeName;
  }

  private getValues(propName: string) {
    const values = StoryProp.getValues(this.source, propName);

    return values;
  }

  private update(propName: string, value: string) {
    let normalizedValue: unknown = value;

    if (normalizedValue === this.DEFAULT) {
      normalizedValue = this.items[propName].default;
    }

    // tslint:disable-next-line:no-any
    (this.livePreview as unknown as { [key: string]: any })[propName] = normalizedValue;
  }
}
</script>

<style lang="scss" scoped>
.border-color-1 {
  border-color: #e2e8f0;
}
</style>

<template>
  <div class="flex flex-row mt-16">
    <div class="w-1/3 grid grid-flow-row gap-8">
      <div v-for="(name) in propNames" :key="name" class="pr-4">
        <div v-if="getValues(name) !== undefined">
          <div class="mb-2 font-bold">{{name}}</div>
          <select
            class="border border-color-1 p-2 rounded-lg outline-none"
            :name="name"
            @change="update(name, $event.srcElement.value)"
          >
            <option :value="DEFAULT">(default)</option>
            <option v-for="value in getValues(name)" :key="value" :value="value">{{value}}</option>
          </select>
        </div>
        <div v-else-if="getType(name) === 'boolean'">
          <div class="mb-2 font-bold">{{name}}</div>
          <div class="grid grid-flow-col gap-2 w-1 items-center">
            <input
              :name="name"
              type="radio"
              :value="DEFAULT"
              checked
              @change="update(name, $event.srcElement.value)"
            />
            <span>(Default)</span>
            <input
              :name="name"
              type="radio"
              value="1"
              @change="update(name, $event.srcElement.value)"
            />
            <span>Yes</span>
            <input
              :name="name"
              type="radio"
              value="0"
              @change="update(name, $event.srcElement.value)"
            />
            <span>No</span>
          </div>
        </div>
        <div v-else-if="getType(name) in {number:0, string:0}" class="grid grid-flow-row">
          <div class="mb-2 font-bold">{{name}}</div>
          <a
            v-if="false"
            class="text-blue-500 hover:underline mb-2"
            href="javascript:void(0)"
            @click="$refs[name].value = DEFAULT"
          >reset</a>
          <input
            class="border p-2 rounded-lg bg-gray-400 outline-none"
            :name="name"
            :ref="name"
            :type="getType(name) === 'string' ? 'text' : 'number'"
            :value="getDefault(name)"
            @change="update(name, $event.srcElement.value)"
          />
        </div>
      </div>
    </div>
    <div
      style="min-height: 33vh"
      ref="render"
      class="border border-color-1 flex-1 p-8 rounded-lg flex items-center justify-center"
    ></div>
  </div>
</template>
