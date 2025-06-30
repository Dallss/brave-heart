<template>
  <section class="base-section" :style="{ height }">
    <slot></slot>
  </section>
</template>

<script setup>
defineProps({
  height: {
    type: String,
    default: '100vh',
  },
})
</script>

<style scoped>
.base-section {
  width: 100vw;
  padding: 2rem;
  box-sizing: border-box;
  background-color: #fff;
  color: #000000;
  padding-bottom: 50px;
  padding-top: 100px;
  padding-bottom: 100px;
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.151); */
}
</style>
