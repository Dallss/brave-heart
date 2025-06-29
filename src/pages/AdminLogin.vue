<template>
  <div class="login-wrapper">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>Admin Login</h1>
      <p>Please enter your credentials to continue.</p>
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" v-model="username" type="text" placeholder="Enter username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" placeholder="Enter password" />
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="rememberMe" />
          Remember me
        </label>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.js'

const { login, loading, error, clearError } = useAuth()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Both fields are required.'
    return
  }

  clearError()

  try {
    const userData = await login(username.value, password.value, rememberMe.value)

    if (userData.isAdmin) {
      window.location.href = '/admin/dashboard'
    } else {
      error.value = 'Access denied. Admin privileges required.'
    }
  } catch (err) {
    // Error is already set by the useAuth composable
    console.error('Login failed:', err)
  }
}
</script>

<style scoped>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #9a9a9a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgb(87, 0, 0);
}
h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}
p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
a {
  color: #007bff;
  text-decoration: underline;
  font-size: 1.1rem;
}
.login-form {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 90vw;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}
label {
  font-weight: 500;
  margin-bottom: 0.4rem;
}
input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.checkbox-label input[type='checkbox'] {
  width: auto;
  margin: 0;
}
button {
  background: rgb(99, 0, 0);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.7rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
button:hover:not(:disabled) {
  background: #900;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.error {
  color: #b00;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
}
</style>
