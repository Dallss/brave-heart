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
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Both fields are required.'
    return
  }

  error.value = ''
  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/User/login`, {
      email: username.value,
      password: password.value,
    })

    const token = response.data.token
    const isAdmin = response.data.isAdmin

    localStorage.setItem('token', token)
    localStorage.setItem('isAdmin', isAdmin)

    if (isAdmin) {
      window.location.href = '/admin/dashboard'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
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
button:hover {
  background: #900;
}
.error {
  color: #b00;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
}
</style>
