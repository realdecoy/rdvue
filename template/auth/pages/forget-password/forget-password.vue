<style scoped lang="scss" src="./forget-password.scss"></style>
<script lang="ts" src="./forget-password.ts"></script>
<template>
  <div class="forget-password">
    <h1>Forget password page</h1>

    <form @submit.prevent="sendResetEmail">
      <input type="text" placeholder="Email" v-model="email" />
      <button type="submit">Reset Password</button>
    </form>
  </div>
</template>