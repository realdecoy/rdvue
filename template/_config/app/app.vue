<style lang="scss" src="./app.scss"></style>
<script lang="ts" src="./app.ts"></script>
<template>
  <div id="app">
    <component v-if="layout" :is="layout">
      <router-view />
    </component>
    <div v-else class="[ self-center ]" style="justify-self:center">Loading...</div>
  </div>
</template>
