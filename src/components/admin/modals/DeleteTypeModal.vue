<template>
  <BaseModal :show="props.show" title="Delete Product Type" @close="emit('close')">
    <div v-if="loading">
      <span>Loading product types...</span>
    </div>
    <div v-else-if="error">
      <span style="color: red">{{ error }}</span>
    </div>
    <div v-else-if="productTypes.length === 0">
      <span style="color: red">No product types available to delete.</span>
    </div>
    <div v-else>
      <p class="warning-text">
        <strong>Warning:</strong> Deleting a product type will also delete all products of that
        type. This action cannot be undone.
      </p>

      <label>Select Product Type to Delete:</label>
      <select v-model="selectedTypeId" required>
        <option value="">Choose a product type...</option>
        <option v-for="type in productTypes" :key="type.id" :value="type.id">
          {{ type.name }} ({{ type.productCount || 0 }} products)
        </option>
      </select>

      <div v-if="selectedType" class="type-details">
        <h4>Type Details:</h4>
        <p><strong>Name:</strong> {{ selectedType.name }}</p>
        <p><strong>Products:</strong> {{ selectedType.productCount || 0 }}</p>
        <p><strong>Attributes:</strong> {{ selectedType.attributes?.length || 0 }}</p>
        <div v-if="selectedType.productCount > 0" class="warning-detail">
          ⚠️ This type has {{ selectedType.productCount }} product(s) that will also be deleted.
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" @click="emit('close')">Cancel</button>
        <button
          type="button"
          @click="handleDelete"
          :disabled="!selectedTypeId || deleting"
          :class="{ disabled: !selectedTypeId || deleting }"
        >
          {{ deleting ? 'Deleting...' : 'Delete Type' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { ref, watch, onMounted, computed } from 'vue'
import { useProductApi } from '../../../composables/useProductApi.js'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'submit'])

const { getProductTypes, deleteProductType } = useProductApi()

const productTypes = ref([])
const loading = ref(false)
const error = ref(null)
const deleting = ref(false)
const selectedTypeId = ref('')

const selectedType = computed(() => {
  return productTypes.value.find((type) => type.id === selectedTypeId.value) || null
})

async function fetchProductTypes() {
  loading.value = true
  error.value = null

  try {
    // Get both product types and products by type to get accurate counts
    const [types, productsByType] = await Promise.all([
      getProductTypes(),
      useProductApi().getProductsByType(),
    ])

    // Merge the data to get product counts
    const typesWithCounts = types.map((type) => {
      const typeWithProducts = productsByType.find((t) => t.id === type.id)
      return {
        ...type,
        productCount: typeWithProducts?.products?.length || 0,
      }
    })

    productTypes.value = typesWithCounts
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
      selectedTypeId.value = ''
    }
  },
)

async function handleDelete() {
  if (!selectedType.value) {
    alert('Please select a product type to delete')
    return
  }

  const confirmed = confirm(
    `Are you sure you want to delete "${selectedType.value.name}"?\n\nThis will also delete all ${selectedType.value.productCount || 0} products of this type.\n\nThis action cannot be undone.`,
  )

  if (!confirmed) return

  deleting.value = true
  try {
    await deleteProductType(selectedType.value.id)
    emit('submit', { success: true, data: selectedType.value })
    emit('close')
  } catch (err) {
    console.error('Failed to delete product type:', err)
    alert('Failed to delete product type: ' + (err.message || 'Unknown error'))
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.warning-text {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  color: #856404;
  font-size: 0.9rem;
}

.type-details {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin: 16px 0;
}

.type-details h4 {
  margin: 0 0 8px 0;
  color: #5a1818;
  font-size: 1rem;
}

.type-details p {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #333;
}

.warning-detail {
  margin-top: 8px;
  padding: 8px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  color: #856404;
  font-size: 0.85rem;
  font-weight: 600;
}

select {
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

select:focus {
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

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.modal-actions button:first-child {
  background: #6c757d;
  color: white;
}

.modal-actions button:first-child:hover {
  background: #5a6268;
}

.modal-actions button:last-child {
  background: #dc3545;
  color: white;
}

.modal-actions button:last-child:hover:not(.disabled) {
  background: #c82333;
}

.modal-actions button.disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
