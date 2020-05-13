<style scoped lang="scss" src="./register.scss"></style>
<script lang="ts" src="./register.ts"></script>
<template>
  <div class="register">
    <h1>This is the register page.</h1>

    <form @submit.prevent="register">
      <input type="text" placeholder="Enter Name" v-model="fullname" />
      <input type="text" placeholder="Enter Email" v-model="email" />
      <input type="text" placeholder="Enter Password" v-model="password" />
      <button type="submit">Register</button>
    </form>
  </div>
</template>