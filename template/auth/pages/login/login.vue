<style scoped lang="scss" src="./login.scss"></style>
<script lang="ts" src="./login.ts"></script>
<template>
  <div class="login">
    <h1>This is the login page.</h1>

    <form @submit.prevent="login">
      <input type="text" placeholder="Enter Email" v-model="email" />
      <input type="text" placeholder="Enter Password" v-model="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>