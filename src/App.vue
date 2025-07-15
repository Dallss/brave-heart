<template>
  <router-view />
</template>

<script setup>
// No imports needed here, all content will be in HomePage.vue
</script>

<style>
html,
body,
#app,
.app-wrapper {
  height: fit-content;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: white;
}

.app-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  color: black;
}

.header {
  height: 55px;
  width: 100%;
  background-color: #000;
  display: flex;
  align-items: center;
  padding-right: 20px;
}

.nav-hover-zone {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 150px;
  z-index: 10;
}

.nav-hover-zone:hover .nav {
  height: 30px;
}

.link {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.link span {
  color: white;
  font-weight: 300;
}
</style>
