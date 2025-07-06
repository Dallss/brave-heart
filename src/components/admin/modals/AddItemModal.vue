<template>
  <BaseModal :show="props.show" title="Create Product" @close="emit('close')">
    <div v-if="loading">
      <span>Loading product types...</span>
    </div>
    <div v-else-if="error">
      <span style="color: red">{{ error }}</span>
    </div>
    <div v-else-if="productTypes.length === 0">
      <span style="color: red">No product types available.</span>
    </div>
    <div v-else>
      <label>Product Type</label>
      <select v-model="selectedTypeId" required>
        <option v-for="type in productTypes" :key="type.id" :value="type.id">
          {{ type.name }}
        </option>
      </select>

      <label>Name</label>
      <input v-model="form.name" type="string" required />

      <label>Price</label>
      <input v-model="form.price" type="number" required />

      <label>Stock</label>
      <input v-model="form.stock" type="number" required />

      <label>Product Image</label>
      <div class="drop-area" @dragover.prevent @drop.prevent="handleDrop($event)">
        <div v-if="uploading" class="uploading">
          <span>Uploading image...</span>
        </div>
        <div v-else-if="form.imageFile" class="selected-file">
          <span>{{ form.imageFile.name }}</span>
          <div v-if="form.imageUrl" class="upload-success">✓ Uploaded successfully</div>
          <div v-else class="image-selected">✓ Image selected (will upload on submit)</div>
        </div>
        <div v-else class="placeholder">
          <span>Drag and drop an image here</span>
        </div>
      </div>

      <button type="button" class="add-photo-btn" @click="fileInput?.click()">Add Photo</button>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden-input"
        @change="onImageChange"
      />

      <div v-if="selectedType && selectedType.attributes && selectedType.attributes.length > 0">
        <label>Attributes</label>
        <div v-for="attr in selectedType.attributes" :key="attr.id" style="margin-bottom: 8px">
          <label class="attribute-label">
            {{ attr.name }} <span v-if="attr.isRequired" class="required-indicator">*</span>
          </label>
          <input
            v-model="form.attributeValues[attr.id]"
            :placeholder="attr.name + ' (' + attr.dataType + ')'"
            :type="attr.dataType === 'int' || attr.dataType === 'decimal' ? 'number' : 'text'"
            :required="attr.isRequired"
            class="attribute-input"
          />
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" @click="emit('close')">Cancel</button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="!isFormValid"
          :class="{ disabled: !isFormValid }"
        >
          Create Product
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { ref, watch, onMounted, computed } from 'vue'
import { useProductApi } from '../../../composables/useProductApi.js'

const fileInput = ref(null)
const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'submit'])

const { getProductTypes, createProduct } = useProductApi()

const productTypes = ref([])
const loading = ref(false)
const error = ref(null)
const uploading = ref(false)
const selectedTypeId = ref('')

const selectedType = computed(() => {
  return productTypes.value.find((type) => type.id === selectedTypeId.value) || null
})

const isFormValid = computed(() => {
  // Check if product type is selected
  if (!selectedType.value) return false

  // Check if name is provided and not empty
  if (!form.value.name || form.value.name.trim() === '') return false

  // Check only required attributes
  if (selectedType.value.attributes) {
    for (const attr of selectedType.value.attributes) {
      if (attr.isRequired) {
        const value = form.value.attributeValues[attr.id]
        if (!value || value.toString().trim() === '') return false
      }
    }
  }

  return true
})

const form = ref({
  name: '',
  price: 0,
  stock: 0,
  productTypeId: '',
  imageFile: null,
  imageUrl: '',
  attributeValues: {},
})

function resetForm() {
  form.value = {
    name: '',
    price: 0,
    stock: 0,
    productTypeId: selectedTypeId.value,
    imageFile: null,
    imageUrl: '',
    attributeValues: {},
  }

  // Initialize attribute values for the selected type
  if (selectedType.value && selectedType.value.attributes) {
    selectedType.value.attributes.forEach((attr) => {
      form.value.attributeValues[attr.id] = ''
    })
  }
}

async function fetchProductTypes() {
  loading.value = true
  error.value = null

  try {
    const types = await getProductTypes()
    productTypes.value = types

    // Set the first type as selected if available
    if (types.length > 0) {
      selectedTypeId.value = types[0].id
      resetForm()
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch product types'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.show) {
    fetchProductTypes()
  }
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      fetchProductTypes()
    }
  },
)

watch(selectedTypeId, (newId) => {
  if (newId) {
    form.value.productTypeId = newId
    resetForm()
  }
})

async function onImageChange(e) {
  const file = e.target.files[0]

  if (!file) {
    form.value.imageFile = null
    form.value.imageUrl = ''
    return
  }

  // Allow only image files
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file.')
    e.target.value = ''
    return
  }

  form.value.imageFile = file
  form.value.imageUrl = '' // Clear any previous URL since we haven't uploaded yet

  // Reset input so user can re-select the same file if needed
  e.target.value = ''
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file], value: '' } }
    onImageChange(fakeEvent)
  }
}

async function handleSubmit() {
  if (!selectedType.value) {
    alert('Please select a product type')
    return
  }

  // Validate required fields
  const errors = []

  // Check if name is provided and not empty
  if (!form.value.name || form.value.name.trim() === '') {
    errors.push('Product name is required')
  }

  // Check only required attributes
  if (selectedType.value.attributes) {
    selectedType.value.attributes.forEach((attr) => {
      if (attr.isRequired) {
        const value = form.value.attributeValues[attr.id]
        if (!value || value.toString().trim() === '') {
          errors.push(`${attr.name} is required`)
        }
      }
    })
  }

  // If there are validation errors, show them and stop submission
  if (errors.length > 0) {
    alert('Please fix the following errors:\n\n' + errors.join('\n'))
    return
  }

  try {
    // Prepare the product data with correct API structure
    const productData = {
      Name: form.value.name.trim(),
      Price: parseFloat(form.value.price) || 0,
      Stock: parseInt(form.value.stock) || 0,
      ProductTypeId: selectedType.value.id,
      AttributeValues: Object.entries(form.value.attributeValues).map(([attrId, value]) => ({
        ProductAttributeId: parseInt(attrId),
        Value: value.toString(),
      })),
    }

    // TODO: Handle image upload if needed
    // For now, we'll just create the product without image

    const createdProduct = await createProduct(productData)
    emit('submit', createdProduct)
    emit('close')
  } catch (err) {
    alert('Failed to create product: ' + (err.message || 'Unknown error'))
  }
}
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
  padding: 32px 32px 24px 32px;
  border-radius: 12px;
  width: 420px;
  box-shadow: 0 4px 24px rgba(90, 24, 24, 0.12);
  color: #5a1818;
  font-family: inherit;
}

.modal h2 {
  color: #5a1818;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  letter-spacing: 1px;
}

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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.modal-actions button,
.modal button[type='button'] {
  background: #5a1818;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-actions button:hover,
.modal button[type='button']:hover {
  background: #a36a6a;
}

.modal button[type='button'] {
  margin-top: 0.3rem;
  margin-bottom: 0.7rem;
  background: #a36a6a;
  color: #fff;
  padding: 6px 14px;
  font-size: 0.95rem;
}

.modal button[type='button']:hover {
  background: #5a1818;
}
.drop-area {
  border: 2px dashed #a36a6a;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #fff8f8;
  margin-bottom: 18px;
  transition: background-color 0.2s;
}

.drop-area:hover {
  background-color: #f3eaea;
}

.placeholder {
  color: #a36a6a;
  font-size: 0.95rem;
}

.selected-file {
  color: #5a1818;
  font-weight: 500;
  font-size: 0.95rem;
}

.hidden-input {
  display: none;
}

.uploading {
  color: #a36a6a;
  font-size: 0.95rem;
}

.upload-success {
  color: #28a745;
  font-size: 0.85rem;
  margin-top: 4px;
  font-weight: 500;
}

.image-selected {
  color: #28a745;
  font-size: 0.85rem;
  margin-top: 4px;
  font-weight: 500;
}

.add-photo-btn {
  background: #a36a6a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 18px;
  width: 100%;
}

.add-photo-btn:hover {
  background: #5a1818;
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

.required-indicator {
  color: #dc3545;
  font-weight: bold;
}

.attribute-label {
  color: #7a2a2a;
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
  font-size: 0.9rem;
}

.attribute-input {
  margin-bottom: 12px;
}
</style>
