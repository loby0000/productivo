<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="userType">User Type:</label>
        <input type="text" v-model="userType" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const userType = ref('') // Define userType como una ref
const errorMessage = ref('')

const submitForm = async () => {
  try {
    const response = await this.$http.post('/api/login', {
      username: username.value,
      password: password.value,
      userType: userType.value
    });
    // Handle successful login
  } catch (error) {
    errorMessage.value = 'Invalid username or password';
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
}
.error {
  color: red;
}
</style>