<style lang="scss" src="./app.scss"></style>
<script lang="ts" src="./app.ts"></script>
<template>
  <div id="app" 
      :class="['theme', 'app', $store.getters['app/theme']]">
    <navigation></navigation>
    <main>
      <transition :duration="500" name="fade" mode="out-in">
        <!--  
          Home page and other routes will be dynamically loaded here 
          by the router.
        -->
        <router-view />
      </transition>
    </main>
  </div>
</template>
