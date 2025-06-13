<template>
  <section class="base-section" :style="{ height }">
    <slot></slot>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

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
}
</style>
