<template>
  <div class="error-container">
    <div class="error-icon">⚠️</div>
    <div class="error-content">
      <h3 v-if="title" class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      <button v-if="showRetry" @click="$emit('retry')" class="retry-button">
        {{ retryText }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
  showRetry: {
    type: Boolean,
    default: false,
  },
  retryText: {
    type: String,
    default: 'Retry',
  },
})

defineEmits(['retry'])
</script>

<style scoped>
.error-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #d32f2f;
  width: fit-content;
  min-width: 400px;
}

.error-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.error-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.error-message {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

.retry-button {
  background: #5a1818;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background: #7a2828;
}

.retry-button:active {
  transform: translateY(1px);
}
</style>
