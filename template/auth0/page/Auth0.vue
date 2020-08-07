<style scoped lang="scss" src="./__PAGE__.scss"></style>
<script lang="ts" src="./Auth0.ts"></script>

<template>
  <div>
    <nav>
      <div>
        <a href="#">Auth0 - Vue</a>
      </div>

      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li v-if="!isAuthenticated">
          <a href="#" @click.prevent="login">Login</a>
        </li>
        <li v-if="isAuthenticated">
          <a href="#" @click.prevent="logout">Log out</a>
        </li>
      </ul>
  </nav>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>