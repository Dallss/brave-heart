<template>
  <div class="not-found-wrapper">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/">Go to Home</router-link>
  </div>
</template>

<script setup>
// No script needed
</script>

<style scoped>
.not-found-wrapper {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b00;
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
</style>
