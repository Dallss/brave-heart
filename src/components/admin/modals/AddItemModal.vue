<template>
  <BaseModal
    :show="props.show"
    title="Create Product"
    :createForm="createForm"
    :validateForm="validateForm"
    @close="emit('close')"
    @submit="handleSubmit"
  >
    <template #default="{ form }">
      <div v-if="Array.isArray(productTypes) && productTypes.length === 0">
        <h1>No product types yet</h1>
      </div>
      <div v-else>
        <label>Product Type</label>
        <select v-model="form.productTypeId" required @change="onTypeChange(form)">
          <option v-for="type in productTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>

        <label>Price</label>
        <input v-model="form.price" type="number" required />

        <label>Stock</label>
        <input v-model="form.stock" type="number" required />

        <label>Product Image</label>
        <div
          class="drop-area"
          @dragover.prevent
          @drop.prevent="handleDrop($event, form)"
          @click="fileInput?.click()"
        >
          <div v-if="form.imageFile" class="selected-file">
            <span>{{ form.imageFile.name }}</span>
          </div>
          <!-- <div v-else class="placeholder">
            <span>Drag and drop or click to choose an image</span>
         </div> -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="(e) => onImageChange(e, form)"
          />
        </div>

        <div v-if="selectedType">
          <label>Attributes</label>
          <div
            v-for="(attr, index) in selectedType.attributes"
            :key="attr.id"
            style="margin-bottom: 8px"
          >
            <input
              v-model="form.attributeValues[index]"
              :placeholder="attr.name + ' (' + attr.dataType + ')'"
              :type="attr.dataType === 'int' || attr.dataType === 'decimal' ? 'number' : 'text'"
              required
            />
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'

const fileInput = ref(null) // Reference to hidden file input
const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'submit'])

// Mock product types and their attributes
const productTypes = ref([
  {
    id: 1,
    name: 'Fire Extinguisher',
    attributes: [
      { id: 1, name: 'Capacity', dataType: 'decimal' },
      { id: 2, name: 'Color', dataType: 'string' },
      { id: 3, name: 'Weight', dataType: 'decimal' },
    ],
  },
  {
    id: 2,
    name: 'Smoke Detector',
    attributes: [
      { id: 4, name: 'Battery Life', dataType: 'int' },
      { id: 5, name: 'Sensor Type', dataType: 'string' },
    ],
  },
])

const selectedType = ref(null)

function createForm() {
  // Always default to the first product type
  const firstType =
    Array.isArray(productTypes.value) && productTypes.value.length > 0
      ? productTypes.value[0]
      : null
  selectedType.value = firstType
  return {
    price: 0,
    stock: 0,
    productTypeId: firstType ? firstType.id : '',
    imageUrl: '',
    imageFile: null,
    attributeValues: firstType ? firstType.attributes.map(() => '') : [],
  }
}

watch(
  () => props.show,
  (val) => {
    if (val && Array.isArray(productTypes.value) && productTypes.value.length > 0) {
      // When modal opens, always set selectedType and form.productTypeId to first type
      selectedType.value = productTypes.value[0]
    }
  },
)

function validateForm(form) {
  if (!form.productTypeId || !form.price || !form.stock || !form.imageFile) return false
  if (!selectedType.value) return false
  return selectedType.value.attributes.every(
    (attr, i) => form.attributeValues[i] && form.attributeValues[i] !== '',
  )
}

function onTypeChange(form) {
  const type = productTypes.value.find((t) => t.id === form.productTypeId)
  selectedType.value = type
  // Reset attribute values to match the selected type
  form.attributeValues = type ? type.attributes.map(() => '') : []
}

function onImageChange(e, form) {
  const file = e.target.files[0]

  if (!file) {
    form.imageFile = null
    form.imageUrl = ''
    return
  }

  // Allow only image files
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file.')
    e.target.value = ''
    return
  }

  form.imageFile = file

  // Optional: placeholder for upload logic
  // Example: Get a presigned URL from backend, upload to S3/Cloudinary, then set imageUrl
  // const uploadedUrl = await uploadToCloud(file);
  // form.imageUrl = uploadedUrl;

  // Reset input so user can re-select the same file if needed
  e.target.value = ''
}

function handleDrop(e, form) {
  const file = e.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file], value: '' } }
    onImageChange(fakeEvent, form)
  }
}

function handleSubmit(data) {
  emit('submit', data)
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
</style>
