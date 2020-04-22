<style lang="scss" src="./app.scss"></style>
<script lang="ts" src="./app.ts"></script>
<template>
  <div id="app" class="bg-gray-400">
    <h1>Vue Starter Project</h1>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
      class="logo"
    />
    <div class="call-sign">
      <div class="powered-by">
        powered
        <br />by
      </div>
      <div class="tool">
        <a target="_blank" href="https://www.npmjs.com/package/rdvue">rdvue</a>
      </div>
    </div>
    <div class="contents">
      <div class="description">
        <h3>Summary</h3>
        <span>
          The rdvue cli tool was created as a way to automate many of the processes that go into building SPAs (Single Page Applications) and setting consistencies between projects, shortenening the learning curve for developers per project.
          The VueJS project will be scaffolded using best-practice structures, dependencies, meta tooling for consistent coding standards, automatic unit test generation (basic ones) and the foundation for E2E testing into a single project.
        </span>
      </div>
      <div class="features">
        <h3>Features Included</h3>
        <ul>
          <li>
            vue-router
            <span class="sub-text">-</span>
            <span class="desc">
              in-app page navigation (<a href="https://router.vuejs.org/">read more</a>)
            </span>
          </li>
          <li>
            vuex
            <span class="sub-text">-</span>
            <span class="desc">
              state management (<a href="https://vuex.vuejs.org/">read more</a>)
            </span>
          </li>
          <li>
            sass
            <span class="sub-text">-</span>
            <span class="desc">
              css extension library (<a href="https://sass-lang.com/">read more</a>)
            </span>
          </li>
          <li>
            cypress
            <span class="sub-text">-</span>
            <span class="desc">
              e2e testing framework (<a href="https://www.cypress.io/">read more</a>)
            </span>
          </li>
          <li>
            typescript
            <span class="sub-text">-</span>
            <span class="desc">
              typechecking for javascript (<a href="https://www.typescriptlang.org/">read more</a>)
            </span>
          </li>
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
