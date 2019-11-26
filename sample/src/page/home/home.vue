<style lang="scss" src="./home.scss"></style>
<script lang="ts" src="./home.ts"></script>
<template>
  <div class="home-view">
    <img :src="env.brandingUri" />
    <h1>This is the {{env.isDev ? 'development' : 'production'}} home page</h1>
    <h4>Build for {{!env.isDev ? 'development' : 'production'}} to see how the environment variables override</h4>
  </div>
</template>
