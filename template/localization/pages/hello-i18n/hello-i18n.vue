<template>
  <div>
    <p>{{ $t("message") }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HelloI18n extends Vue {}
</script>
