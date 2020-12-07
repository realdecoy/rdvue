<script lang="ts">
import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

type HighlightType = { highlightAuto(...args: unknown[]): { value: string } };
type PrettyType = (...args: unknown[]) => unknown;

@Component
export default class extends Vue {
  // --------------------------------------------------------------------------
  // Fields
  // --------------------------------------------------------------------------

  @Prop({ type: String })
  public title!: string;

  @Prop({ type: String })
  public description!: string;

  @Prop({ type: String })
  public code?: string;

  @Prop({ type: Boolean, default: true })
  public codeEnabled!: boolean;

  private isCodeVisible = false;
  private codeHtml = '';

  // --------------------------------------------------------------------------
  // Methods
  // --------------------------------------------------------------------------

  private mounted() {
    // Dynamic import to exlude from static dependency chain
    // of Production builds for the core web-app (not Storybook related).

    const { highlightAuto } = require('highlight.js') as HighlightType;
    const pretty = require('pretty') as PrettyType;

    this.codeHtml = highlightAuto(pretty(unescape(this.code ?? ''))).value;
  }

  private toggleCodeVisibility() {
    this.isCodeVisible = !this.isCodeVisible;
  }
}
</script>
<style lang="scss" scoped>
.border-color-1 {
  border-color: #cbd5e0;
}
.border-color-2 {
  border-color: #c3dafe;
}
.bg-color-1 {
  background-color: #ebf4ff;
}
.bg-color-2 {
  background-color: #c3dafe33;
}
.preview-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(data:image/png;base64,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);
  opacity: 0.95;
  z-index: -1;
}
</style>
<template>
  <div class="grid grid-flow-col grid-cols-12 gap-8">
    <div class="[ col-span-3 ]">
      <div class="font-bold text-2xl">{{title}}</div>
      <div class="mt-2">{{description}}</div>
    </div>
    <div class="[ flex col-span-9 ]">
      <div
        ref="component"
        class="preview-container bg-color-2 relative flex flex-col justify-between flex-1 border border-color-1 rounded-lg p-8 overflow-y-auto"
      >
        <div class="[ flex flex-1 flex-col ]">
          <slot />
        </div>
        <div v-if="codeEnabled" class="mt-8 flex flex-col">
          <a
            class="ml-auto -mb-5 block font-semibold pb-4 relative text-sm"
            href="javascript:void"
            @click="toggleCodeVisibility()"
            v-html="`${isCodeVisible?'Hide': 'Show'} Code`"
          />
          <pre
            v-if="isCodeVisible"
            class="bg-color-1 border border-color-2 font-monospace mt-4 p-4 rounded font-bold"
          ><code v-html="codeHtml" /></pre>
        </div>
      </div>
    </div>
  </div>
</template>
