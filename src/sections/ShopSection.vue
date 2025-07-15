<template>
  <BaseSection class="shop-section" height="auto">
    <div class="shop-header">Shop</div>
    <div v-if="loading" class="loading">Loading products...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="items-container">
      <div class="item" v-for="product in allProducts" :key="product.id">
        <Item :item="product" @show-details="openModal" />
      </div>
    </div>
    <ProductDetailsModal :show="showModal" :product="selectedProduct" @close="closeModal" />
  </BaseSection>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseSection from './BaseSection.vue'
import Item from '../components/Item.vue'
import ProductDetailsModal from '../components/ProductDetailsModal.vue'
import { apiClient } from '../utils/auth.js'

const products = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const selectedProduct = ref(null)

// Flatten all products from all types into a single array
const allProducts = computed(() => {
  if (!products.value || !Array.isArray(products.value)) return []

  return products.value.flatMap((type) =>
    type.products
      ? type.products.map((product) => ({
          ...product,
          class: type.name, // Use product type name as class
          range: `$${product.price}`, // Use price as range
          image: product.imageUrl || 'https://placehold.co/300x500?text=Item+Image',
        }))
      : [],
  )
})

const loadProducts = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await apiClient.get('/Product/by-type')
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', errorText)
      throw new Error(`Failed to load products: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    products.value = data
    console.log('Loaded products for shop:', data)
  } catch (err) {
    console.error('Failed to load products:', err)
    error.value = err.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

function openModal(product) {
  selectedProduct.value = product
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedProduct.value = null
}

onMounted(() => {
  loadProducts()
})
</script>

<!-- TODO: Switch from flex to grid -->
<style scoped>
.shop-section {
  padding: 10vw;
  display: flex;
  flex-direction: column;
  color: black;
  background-color: #f5f5f5;
}
.shop-header {
  font-size: 2.5rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 2rem;
  font-family: fjalla-one;
  text-align: center;
}
.loading,
.error {
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem 0;
}
.error {
  color: #dc3545;
}
.items-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 10rem;
  align-self: center;
  width: 90%;
}
.item {
  width: 100%;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}
</style>
