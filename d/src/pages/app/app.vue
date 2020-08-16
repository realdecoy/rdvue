<style lang="scss" src="./app.scss"></style>
<script lang="ts" src="./app.ts"></script>
<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>
