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

// Based on DTI info:
// - ABC: multi-purpose for solids, liquids, gases, electrical
// - A: solids like paper, cloth, wood
// - B: flammable liquids
// - C: electrical equipment
// - K: kitchen fires (cooking oil, fats)

const useCaseToExtinguisherTypes = {
  general: ['A', 'B', 'C'],
  school: ['A', 'C'],
  office: ['B', 'C'],
  home: ['A', 'B', 'C'],
  industrial: ['A', 'B', 'C'],
  kitchen: ['K'],
  garage: ['B', 'C'],
  warehouse: ['A', 'B', 'C'],
  hospital: ['C'],
  hotel: ['A', 'B', 'C'],
  restaurant: ['K', 'B', 'C'],
  bar: ['B', 'C'],
  other: ['A', 'B', 'C'],
}

const selectedExtinguisherTypes = computed(() => {
  return useCaseToExtinguisherTypes[selectedCase.value] || ['unknown']
})
</script>

<style scoped>
.type-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80%;
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
  border-radius: 5px;
  background-color: white;
  flex-shrink: 0;
  height: 35px;
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
