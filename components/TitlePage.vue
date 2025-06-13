<template>
  <Section class="title-page">
    <div class="title-content">
      <h1 class="main-title">Alexander Extinguisher</h1>
      <p class="subtitle">Your Trusted Fire Safety Partner</p>
    </div>
  </Section>
</template>

<script setup>
import Section from './Section.vue'
</script>

<style scoped>
.title-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.title-content {
  text-align: center;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
}
</style>
