<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h2 v-if="title">{{ title }}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 32px 50px 24px 50px;
  border-radius: 12px;
  width: 500px;
  box-shadow: 0 4px 24px rgba(90, 24, 24, 0.12);
  color: #5a1818;
  font-family: inherit;
  max-height: 75vh;
  overflow-y: auto;
}

.modal h2 {
  color: #5a1818;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  letter-spacing: 1px;
}
</style>
