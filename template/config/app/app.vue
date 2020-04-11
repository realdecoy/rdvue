<style lang="scss" src="./app.scss"></style>
<script lang="ts" src="./app.ts"></script>
<template>
  <div id="app" class="bg-gray-400">
    <h1>Vue Starter Project</h1>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png" class="logo"/>
    <div class="call-sign">
      <div class="powered-by">powered<br/>by</div>
      <div class="tool"><a target="_blank" href="https://www.npmjs.com/package/rdvue">rdvue</a></div>
    </div>
    <div class="contents">
      <div class="description">        
        <h3>Summary</h3>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua. Enim eu turpis egestas pretium aenean. 
        Faucibus ornare suspendisse sed nisi. Vitae justo eget magna fermentum iaculis eu non. 
        Id porta nibh venenatis cras sed felis eget velit. Id aliquet lectus proin nibh nisl. 
        Nec sagittis aliquam malesuada bibendum arcu vitae.
      </div>
      <div class="features">
        <h3>Features Included</h3>
        <ul>
          <li>vue-router <span class="sub-text">- </span><span class="desc">in-app page navigation (<a href="https://router.vuejs.org/">read more</a>)</span></li>
          <li>vuex <span class="sub-text">- </span><span class="desc">state management (<a href="https://vuex.vuejs.org/">read more</a>)</span></li>
          <li>sass <span class="sub-text">- </span><span class="desc">css extension library (<a href="https://sass-lang.com/">read more</a>)</span></li>
          <li>cypress <span class="sub-text">- </span><span class="desc">e2e testing framework (<a href="https://www.cypress.io/">read more</a>)</span></li>
          <li>typescript <span class="sub-text">- </span><span class="desc">typechecking for javascript (<a href="https://www.typescriptlang.org/">read more</a>)</span></li>
        </ul>
      </div>
    </div>
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
