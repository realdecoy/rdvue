<style lang="scss" src="@/themes/@base/index.scss"></style>
<style lang="scss" src="./app.scss"></style>
<script lang="ts" src="./app.ts"></script>
<template>
  <div id="app" 
       :class="['theme', 'app', $store.getters['app/theme']]">
    <!-- <nav :items="$store.getters['app/navigation']"/> -->
    <nav class="nav">
      <a href="/">Home</a>
      <a href="/login">Login</a>
    </nav>
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