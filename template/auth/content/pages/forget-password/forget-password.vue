<style lang="scss" src="./forget-password.scss"></style>
<script lang="ts" src="./forget-password.ts"></script>
<template>
  <div class="forget-password">
    <h1>Forget password page</h1>

    <input type="text" placeholder="Email" v-model="email">
    <button @click="sendResetEmail(email);">Reset Password</button>
  </div>
</template>