<template>
  <BaseModal :show="show" @close="$emit('close')" title="Edit Product">
    <form @submit.prevent="handleSubmit" class="edit-form">
      <!-- Product Type (Read-only) -->
      <div class="form-group">
        <label for="productType">Product Type:</label>
        <select id="productType" v-model="formData.productTypeId" disabled class="form-control">
          <option value="">Select a product type</option>
          <option
            v-for="type in productTypes"
            :key="type.id"
            :value="type.id"
            :selected="type.id === formData.productTypeId"
          >
            {{ type.name }}
          </option>
        </select>
        <small class="form-text">Product type cannot be changed</small>
      </div>

      <!-- Product Name -->
      <div class="form-group">
        <label for="productName">Product Name:</label>
        <input
          id="productName"
          v-model="formData.name"
          type="text"
          required
          class="form-control"
          placeholder="Enter product name"
        />
      </div>

      <!-- Product Price -->
      <div class="form-group">
        <label for="productPrice">Price:</label>
        <input
          id="productPrice"
          v-model.number="formData.price"
          type="number"
          step="0.01"
          min="0"
          required
          class="form-control"
          placeholder="Enter price"
        />
      </div>

      <!-- Product Stock -->
      <div class="form-group">
        <label for="productStock">Stock:</label>
        <input
          id="productStock"
          v-model.number="formData.stock"
          type="number"
          min="0"
          required
          class="form-control"
          placeholder="Enter stock quantity"
        />
      </div>

      <!-- Product Image -->
      <div class="form-group">
        <label for="productImage">Product Image:</label>
        <div class="image-upload-container">
          <div v-if="currentImageUrl" class="current-image">
            <img :src="currentImageUrl" alt="Current product image" class="preview-image" />
            <p class="current-image-text">Current image</p>
          </div>
          <input
            id="productImage"
            ref="imageInput"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="form-control"
          />
          <small class="form-text">Leave empty to keep current image</small>
        </div>
      </div>

      <!-- Product Attributes -->
      <div v-if="productAttributes.length > 0" class="form-group">
        <label>Product Attributes:</label>
        <div v-for="attr in productAttributes" :key="attr.id" class="attribute-group">
          <label :for="'attr-' + attr.id" class="attribute-label">{{ attr.name }}:</label>
          <input
            :id="'attr-' + attr.id"
            v-model="attributeValues[attr.name]"
            type="text"
            class="form-control"
            :placeholder="`Enter ${attr.name.toLowerCase()}`"
          />
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="btn btn-secondary">Cancel</button>
        <button type="submit" :disabled="submitting" class="btn btn-primary">
          {{ submitting ? 'Updating...' : 'Update Product' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { apiClient } from '../../../utils/auth.js'
import { useProductApi } from '../../../composables/useProductApi.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  product: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const submitting = ref(false)
const imageInput = ref(null)
const productTypes = ref([])

const formData = ref({
  name: '',
  price: 0,
  stock: 0,
  productTypeId: '',
})

const attributeValues = ref({})
const currentImageUrl = ref('')

const { updateProduct } = useProductApi()

// Computed property to get product attributes from the passed product data
const productAttributes = computed(() => {
  if (!props.product || !props.product.attributes) {
    return []
  }
  return props.product.attributes
})

// Watch for product changes and populate form
watch(
  () => props.product,
  async (newProduct) => {
    if (newProduct && props.show) {
      console.log('Product changed, populating form with:', newProduct)
      await populateForm(newProduct)
    }
  },
  { immediate: true },
)

// Watch for modal show/hide
watch(
  () => props.show,
  async (show) => {
    if (show && props.product) {
      console.log('Modal opened, populating form with product:', props.product)
      await populateForm(props.product)
    } else if (!show) {
      // Reset form when modal closes
      resetForm()
    }
  },
)

const loadProductTypes = async () => {
  try {
    const response = await apiClient.get('/ProductType')
    if (!response.ok) {
      throw new Error(`Failed to load product types: ${response.status}`)
    }
    productTypes.value = await response.json()
    console.log('Loaded product types:', productTypes.value)
  } catch (err) {
    console.error('Failed to load product types:', err)
  }
}

const populateForm = async (product) => {
  console.log('Populating form with product:', product)

  // Load product types if not already loaded
  if (productTypes.value.length === 0) {
    await loadProductTypes()
  }

  // Reset form data
  formData.value = {
    name: product.name || '',
    price: product.price || 0,
    stock: product.stock || 0,
    productTypeId: product.productTypeId || '',
  }

  // Set current image URL
  currentImageUrl.value = product.imageUrl || product.image || ''

  // Populate attribute values from the product's existing attributes
  attributeValues.value = {}
  if (product.attributes && Array.isArray(product.attributes)) {
    product.attributes.forEach((attr) => {
      if (attr.values && attr.values.length > 0) {
        attributeValues.value[attr.name] = attr.values[0].value || ''
      } else {
        attributeValues.value[attr.name] = ''
      }
    })
  }

  console.log('Form populated with:', {
    formData: formData.value,
    attributeValues: attributeValues.value,
    currentImageUrl: currentImageUrl.value,
  })
}

const resetForm = () => {
  formData.value = {
    name: '',
    price: 0,
    stock: 0,
    productTypeId: '',
  }
  attributeValues.value = {}
  currentImageUrl.value = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('New image selected:', file.name)
  }
}

const handleSubmit = async () => {
  if (!props.product) return

  submitting.value = true
  try {
    let imageUrlToSend = currentImageUrl.value

    // ... image upload logic (if needed) ...
    if (imageInput.value && imageInput.value.files[0]) {
      const imageFile = imageInput.value.files[0]
      const folder = 'brave-heart-images/product-images'
      // Request signature with folder param
      const signatureResponse = await apiClient.get(
        `/Cloudinary/signature?folder=${encodeURIComponent(folder)}`,
      )
      if (!signatureResponse.ok) throw new Error('Failed to get upload signature')
      const signatureData = await signatureResponse.json()
      const formDataUpload = new FormData()
      formDataUpload.append('file', imageFile)
      formDataUpload.append('api_key', signatureData.apiKey)
      formDataUpload.append('timestamp', signatureData.timestamp)
      formDataUpload.append('signature', signatureData.signature)
      formDataUpload.append('folder', folder) // must match signature request
      const uploadResponse = await fetch(
        'https://api.cloudinary.com/v1_1/' + signatureData.cloudName + '/image/upload',
        {
          method: 'POST',
          body: formDataUpload,
        },
      )
      if (!uploadResponse.ok) throw new Error('Failed to upload image')
      const uploadResult = await uploadResponse.json()
      imageUrlToSend = uploadResult.secure_url
    }

    // Build update object with only changed and non-null/undefined fields
    const updateData = {}
    if (
      formData.value.name !== props.product.name &&
      formData.value.name !== undefined &&
      formData.value.name !== null
    ) {
      updateData.Name = formData.value.name
    }
    if (
      formData.value.price !== props.product.price &&
      formData.value.price !== undefined &&
      formData.value.price !== null
    ) {
      updateData.Price = formData.value.price
    }
    if (
      formData.value.stock !== props.product.stock &&
      formData.value.stock !== undefined &&
      formData.value.stock !== null
    ) {
      updateData.Stock = formData.value.stock
    }
    if (
      imageUrlToSend !== props.product.imageUrl &&
      imageUrlToSend !== undefined &&
      imageUrlToSend !== null
    ) {
      updateData.ImageUrl = imageUrlToSend
    }

    // Always send all attribute values (not just changed)
    const attributeValuesArray = productAttributes.value.map((attr) => ({
      ProductAttributeId: attr.id,
      Value: attributeValues.value[attr.name] ?? attr.values?.[0]?.value ?? '',
    }))
    if (attributeValuesArray.length > 0) updateData.AttributeValues = attributeValuesArray

    // If nothing changed, don't send request
    if (Object.keys(updateData).length === 0) {
      emit('submit', { success: true, data: props.product })
      submitting.value = false
      emit('close')
      return
    }

    // Print the data about to be sent
    console.log('PUT /api/Product/' + props.product.id + ' payload:', updateData)

    // Use composable for update
    const result = await updateProduct(props.product.id, updateData)
    emit('submit', { success: true, data: result })
    emit('close')
  } catch (err) {
    console.error('Failed to update product:', err)
    emit('submit', { success: false, error: err.message })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #5a1818;
  box-shadow: 0 0 0 2px rgba(90, 24, 24, 0.1);
}

.form-control:disabled {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

.form-text {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.current-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 4px;
  background: #f9f9f9;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.current-image-text {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.attribute-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #f9f9f9;
}

.attribute-label {
  font-weight: 600;
  color: #5a1818;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #5a1818;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4a1414;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}
</style>
