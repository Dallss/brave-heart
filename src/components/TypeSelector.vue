<template>
  <div class="type-selector">
    <div class="use-case-section">
      <label class="type-selector-item" v-for="item in cases" :key="item">
        <input type="radio" :value="item" v-model="selectedCase" />
        <div class="label">
          {{ item }}
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const emit = defineEmits(['update:selected'])

const selectedCase = ref('general')

watch(selectedCase, () => {
  emit('update:selected', selectedExtinguisherTypes.value)
})

const cases = [
  'general',
  'school',
  'office',
  'home',
  'industrial',
  'kitchen',
  'garage',
  'warehouse',
  'hospital',
  'hotel',
  'restaurant',
  'bar',
  'other',
]

const useCaseToExtinguisherTypes = {
  general: 'ABC',
  school: 'A',
  office: 'B',
  home: 'ABC',
  industrial: 'ABC',
  kitchen: 'K',
  garage: 'ABC',
  warehouse: 'ABC',
  hospital: 'ABC',
  hotel: 'ABC',
  restaurant: 'ABC',
  bar: 'ABC',
  other: 'ABC',
}

const selectedExtinguisherTypes = computed(() => {
  return useCaseToExtinguisherTypes[selectedCase.value] || 'unkown'
})
</script>

<style scoped>
.type-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 90%;
  overflow-y: auto;
  padding: 1rem;
}

.use-case-section,
.extinguisher-types {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
}

.type-selector-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 1rem;
  background-color: white;
  flex-shrink: 0;
  height: 45px;
}

.type-selector-item input[type='radio'] {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  border-radius: 4px;
  margin: 0;
  cursor: pointer;
}

.type-selector-item input[type='radio']:checked {
  background-color: #000;
  position: relative;
}

.type-selector-item input[type='radio']:checked::after {
  content: '✓';
  position: absolute;
  font-family: system-ui;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.label {
  font-size: 1.2rem;
}
</style>
