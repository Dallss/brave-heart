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
          <div v-if="uploading" class="uploading">
            <span>Uploading image...</span>
          </div>
          <div v-else-if="form.imageFile" class="selected-file">
            <span>{{ form.imageFile.name }}</span>
            <div v-if="form.imageUrl" class="upload-success">✓ Uploaded successfully</div>
            <div v-else class="image-selected">✓ Image selected (will upload on submit)</div>
          </div>
          <div v-else class="placeholder">
            <span>Drag and drop or click to choose an image</span>
          </div>
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
import { ref, watch, onMounted } from 'vue'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

const fileInput = ref(null) // Reference to hidden file input
const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'submit'])

const productTypes = ref([])
const loading = ref(false)
const error = ref(null)
const uploading = ref(false)

async function fetchProductTypes() {
  loading.value = true
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/ProductType`)
    if (!response.ok) throw new Error('Failed to fetch product types')

    const data = await response.json()
    productTypes.value = data
  } catch (err) {
    error.value = err.message || 'Unexpected error'
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  if (props.show) fetchProductTypes()
})
watch(
  () => props.show,
  (val) => {
    if (val) fetchProductTypes()
  },
)
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
  console.log('onTypeChange - found type:', type)
  console.log('onTypeChange - productTypes:', productTypes.value)
  console.log('onTypeChange - form.productTypeId:', form.productTypeId)
  selectedType.value = type
  // Reset attribute values to match the selected type
  form.attributeValues = type ? type.attributes.map(() => '') : []
}

async function uploadToCloudinary(file) {
  try {
    // Step 1: Get signature from backend
    const timestamp = Math.round(new Date().getTime() / 1000)

    console.log('Requesting signature with timestamp:', timestamp)

    const signatureResponse = await fetch(
      `${BACKEND_BASE_URL}/Cloudinary/signature?timestamp=${timestamp}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!signatureResponse.ok) {
      throw new Error('Failed to get upload signature')
    }

    const signatureData = await signatureResponse.json()
    console.log('Received signature data:', signatureData)

    // Validate signature data
    if (
      !signatureData.apiKey ||
      !signatureData.timestamp ||
      !signatureData.signature ||
      !signatureData.cloudName
    ) {
      console.error('Missing required signature data:', {
        hasApiKey: !!signatureData.apiKey,
        hasTimestamp: !!signatureData.timestamp,
        hasSignature: !!signatureData.signature,
        hasCloudName: !!signatureData.cloudName,
      })
      throw new Error('Invalid signature data received from backend')
    }

    // Step 2: Create FormData for Cloudinary upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', signatureData.apiKey)
    formData.append('timestamp', signatureData.timestamp)
    formData.append('signature', signatureData.signature)
    // Note: Not adding folder since backend doesn't return it

    // Log what we're sending to Cloudinary
    console.log('Uploading to Cloudinary with:', {
      apiKey: signatureData.apiKey,
      timestamp: signatureData.timestamp,
      signature: signatureData.signature,
      cloudName: signatureData.cloudName,
      fileName: file.name,
      fileSize: file.size,
    })

    // Log the actual FormData entries for debugging
    console.log('FormData entries:')
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    // Step 3: Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Cloudinary upload failed:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        response: errorText,
      })
      throw new Error(
        `Failed to upload to Cloudinary: ${uploadResponse.status} ${uploadResponse.statusText}`,
      )
    }

    const uploadResult = await uploadResponse.json()
    console.log('Cloudinary upload successful:', uploadResult)
    return uploadResult.secure_url
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    throw new Error('Failed to upload image: ' + err.message)
  }
}

async function onImageChange(e, form) {
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
  form.imageUrl = '' // Clear any previous URL since we haven't uploaded yet

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

async function handleSubmit(data) {
  console.log('handleSubmit - data:', data)
  console.log('handleSubmit - selectedType:', selectedType.value)
  console.log('handleSubmit - productTypes:', productTypes.value)

  // Upload image to Cloudinary if a file is selected
  if (data.imageFile) {
    uploading.value = true
    try {
      const secureUrl = await uploadToCloudinary(data.imageFile)
      data.imageUrl = secureUrl
      console.log('Image uploaded successfully:', secureUrl)
    } catch (err) {
      console.error('Upload failed:', err)
      // Notify user but continue with submission
      alert(
        'Warning: Image upload failed, but the product will still be created. Error: ' +
          err.message,
      )
      data.imageUrl = '' // Set empty URL if upload fails
    } finally {
      uploading.value = false
    }
  }

  // Submit to backend
  try {
    // Validate that selectedType and attributes exist
    if (
      !selectedType.value ||
      !selectedType.value.attributes ||
      !Array.isArray(selectedType.value.attributes)
    ) {
      throw new Error('Product type or attributes not properly loaded. Please try again.')
    }

    // Transform attributeValues to match backend DTO structure
    const attributeValues = data.attributeValues.map((value, index) => {
      const attribute = selectedType.value.attributes[index]
      if (!attribute || !attribute.id) {
        throw new Error(`Attribute at index ${index} is missing or invalid. Please try again.`)
      }
      return {
        ProductAttributeId: attribute.id,
        Value: value,
      }
    })

    const token = localStorage.getItem('token')

    const response = await fetch(`${BACKEND_BASE_URL}/Product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productTypeId: data.productTypeId,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl, // Changed from 'image' to 'imageUrl' to match DTO
        attributeValues: attributeValues,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Product created successfully:', result)

    // Emit success event to parent component
    emit('submit', { success: true, data: result })

    // Close the modal
    emit('close')
  } catch (err) {
    console.error('Failed to create product:', err)
    alert('Failed to create product: ' + err.message)
    emit('submit', { success: false, error: err.message })
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
</style>
