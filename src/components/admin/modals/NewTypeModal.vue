<template>
  <BaseModal :show="props.show" title="Create Product Type" @close="emit('close')">
    <div v-if="error">
      <span style="color: red">{{ error }}</span>
    </div>
    <div v-else>
      <label>Name <span class="required-indicator">*</span></label>
      <input v-model="form.name" type="text" required placeholder="Type name" />

      <div>
        <label>Attributes <span class="required-indicator">*</span></label>
        <div v-for="(attr, index) in form.attributes" :key="index" class="attribute-row">
          <div class="attribute-inputs">
            <input
              v-model="attr.name"
              type="text"
              placeholder="Attribute Name"
              required
              class="attribute-name-input"
            />
            <select v-model="attr.dataType" required class="attribute-type-select">
              <option disabled value="">Select Data Type</option>
              <option value="string">Text</option>
              <option value="int">Number</option>
              <option value="decimal">Decimal</option>
              <option value="DateTime">Date</option>
              <option value="bool">True/False</option>
            </select>
          </div>
          <div class="attribute-options">
            <label class="required-checkbox">
              <input type="checkbox" v-model="attr.isRequired" />
              Required
            </label>
            <button type="button" @click="() => removeAttribute(index)" class="remove-btn">
              Remove
            </button>
          </div>
        </div>
        <button type="button" @click="addAttribute" class="add-attribute-btn">
          + Add Attribute
        </button>
      </div>

      <div class="modal-actions">
        <button type="button" @click="emit('close')">Cancel</button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="!isFormValid"
          :class="{ disabled: !isFormValid }"
        >
          Create Product Type
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { ref, computed } from 'vue'
import { apiClient } from '../../../utils/auth.js'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'submit'])

const error = ref('')

const form = ref({
  name: '',
  attributes: [],
})

const isFormValid = computed(() => {
  // Check if name is provided and not empty
  if (!form.value.name || form.value.name.trim() === '') return false

  // Check if at least one attribute is added
  if (form.value.attributes.length === 0) return false

  // Check if all attributes have name and dataType
  return form.value.attributes.every(
    (attr) => attr.name && attr.name.trim() !== '' && attr.dataType && attr.dataType !== '',
  )
})

function resetForm() {
  form.value = {
    name: '',
    attributes: [],
  }
  error.value = ''
}

function addAttribute() {
  form.value.attributes.push({
    name: '',
    dataType: '',
    isRequired: false,
  })
}

function removeAttribute(index) {
  form.value.attributes.splice(index, 1)
}

async function handleSubmit() {
  // Validate required fields
  const errors = []

  // Check if name is provided and not empty
  if (!form.value.name || form.value.name.trim() === '') {
    errors.push('Product type name is required')
  }

  // Check if at least one attribute is added
  if (form.value.attributes.length === 0) {
    errors.push('At least one attribute is required')
  }

  // Check if all attributes have name and dataType
  form.value.attributes.forEach((attr, index) => {
    if (!attr.name || attr.name.trim() === '') {
      errors.push(`Attribute ${index + 1} name is required`)
    }
    if (!attr.dataType || attr.dataType === '') {
      errors.push(`Attribute ${index + 1} data type is required`)
    }
  })

  // If there are validation errors, show them and stop submission
  if (errors.length > 0) {
    alert('Please fix the following errors:\n\n' + errors.join('\n'))
    return
  }

  error.value = ''
  try {
    // Transform attributes to match backend DTO structure
    const payload = {
      Name: form.value.name.trim(),
      Attributes: form.value.attributes.map((attr) => ({
        Name: attr.name.trim(),
        DataType: attr.dataType,
        IsRequired: !!attr.isRequired,
      })),
    }

    console.log('Creating product type with payload:', payload)

    const response = await apiClient.post('/ProductType', payload)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', errorText)
      throw new Error(`Failed to create product type: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Product type created successfully:', result)

    emit('submit', { success: true, data: result })
    resetForm()
    emit('close')
  } catch (err) {
    console.error('Failed to create product type:', err)
    error.value = err.message || 'Failed to create product type.'
  }
}

// Reset form when modal opens
import { watch } from 'vue'
watch(
  () => props.show,
  (val) => {
    if (val) {
      resetForm()
    }
  },
)
</script>

<style scoped>
.modal label {
  color: #7a2a2a;
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
  margin-top: 1rem;
}

.modal input {
  display: block;
  width: 100%;
  margin-bottom: 18px;
  padding: 10px 12px;
  border: 1.5px solid #bdbdbd;
  border-radius: 6px;
  font-size: 1rem;
  background: #faf7f7;
  color: #5a1818;
  transition: border 0.2s;
}

.modal input:focus {
  outline: none;
  border-color: #a36a6a;
  background: #fff;
}

.modal select {
  display: block;
  width: 100%;
  margin-bottom: 18px;
  padding: 10px 12px;
  border: 1.5px solid #bdbdbd;
  border-radius: 6px;
  font-size: 1rem;
  background: #faf7f7;
  color: #5a1818;
  transition: border 0.2s;
}

.modal select:focus {
  outline: none;
  border-color: #a36a6a;
  background: #fff;
}

.required-indicator {
  color: #dc3545;
  font-weight: bold;
}

.attribute-row {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  background: #f9f9f9;
}

.attribute-inputs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.attribute-name-input {
  flex: 2;
  margin-bottom: 0;
}

.attribute-type-select {
  flex: 1;
  margin-bottom: 0;
}

.attribute-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.required-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
}

.required-checkbox input[type='checkbox'] {
  width: auto;
  margin: 0;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #c82333;
}

.add-attribute-btn {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 18px;
  width: 100%;
}

.add-attribute-btn:hover {
  background: #218838;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.modal-actions button {
  background: #5a1818;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-actions button:hover:not(:disabled) {
  background: #a36a6a;
}

.modal-actions button:disabled,
.modal-actions button.disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

.modal-actions button:disabled:hover,
.modal-actions button.disabled:hover {
  background: #ccc;
}
</style>
