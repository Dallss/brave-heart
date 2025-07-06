<template>
  <main class="dashboard-content">
    <div class="dashboard-header">
      <h2>Inventory</h2>
      <div class="dashboard-header-right">
        <button @click="showAddItem = true" class="add-button">Add Item</button> |
        <button @click="showNewType = true" class="add-button">New Type</button>
      </div>
    </div>

    <ErrorMessage v-if="error" :message="error" :show-retry="true" @retry="loadProducts" />

    <LoadingIndicator v-else-if="loading" message="Loading inventory..." />

    <div v-else-if="products" class="inventory-content">
      <p>Product Types loaded: {{ products.length || 0 }} items</p>

      <div v-for="type in products" :key="type.id" class="type-container">
        <div class="type-header" @click="toggleType(type.id)">
          <span class="type-name">{{ type.name }}</span>
          <span class="type-count">({{ type.products.length }} products)</span>
          <span class="toggle-icon">{{ expandedTypes.includes(type.id) ? '▼' : '▶' }}</span>
        </div>
        <div v-if="expandedTypes.includes(type.id)" class="type-products">
          <ProductComponent
            :products="type.products"
            @edit="handleEditProduct"
            @delete="handleDeleteProduct"
          />
        </div>
      </div>
    </div>

    <AddItemModal :show="showAddItem" @close="showAddItem = false" @submit="handleAddItemSubmit" />
    <NewTypeModal :show="showNewType" @close="showNewType = false" @submit="handleNewTypeSubmit" />
    <EditItemModal
      :show="showEditItem"
      :product="selectedProduct"
      @close="showEditItem = false"
      @submit="handleEditItemSubmit"
    />
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import AddItemModal from '../modals/AddItemModal.vue'
import NewTypeModal from '../modals/NewTypeModal.vue'
import EditItemModal from '../modals/EditItemModal.vue'
import LoadingIndicator from '../../LoadingIndicator.vue'
import ErrorMessage from '../../ErrorMessage.vue'
import { apiClient } from '../../../utils/auth.js'
import ProductComponent from '../ProductComponent.vue'

const showAddItem = ref(false)
const showNewType = ref(false)
const showEditItem = ref(false)
const selectedProduct = ref(null)

const products = ref([])
const error = ref(null)
const loading = ref(true)
const expandedTypes = ref([])

watch(products.value, (newValue) => {
  console.log(`Products: ${newValue}`)
})

const loadProducts = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await apiClient.get('/Product/by-type')
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', errorText)
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    products.value = data
    console.log('Loaded products by type:', data)

    // Debug: Check if products have imageUrl
    if (data && Array.isArray(data)) {
      data.forEach((type, typeIndex) => {
        console.log(`Product Type ${typeIndex + 1}:`, {
          id: type.id,
          name: type.name,
          productCount: type.products?.length || 0,
          typeKeys: Object.keys(type),
        })

        if (type.products && Array.isArray(type.products)) {
          type.products.forEach((product, productIndex) => {
            console.log(`  Product ${productIndex + 1}:`, {
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              hasImageUrl: !!product.imageUrl,
              price: product.price,
              stock: product.stock,
              productKeys: Object.keys(product),
              fullProduct: product,
            })
          })
        }
      })
    }
  } catch (err) {
    error.value = err.message
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

const toggleType = (id) => {
  if (expandedTypes.value.includes(id)) {
    expandedTypes.value = expandedTypes.value.filter((i) => i !== id)
  } else {
    expandedTypes.value.push(id)
  }
}

const handleEditProduct = async (product) => {
  console.log('Edit product:', product)
  selectedProduct.value = product
  showEditItem.value = true
}

const handleDeleteProduct = async (product) => {
  console.log('Delete product:', product)
  if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
    try {
      const response = await apiClient.delete(`/Product/${product.id}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend error response:', errorText)
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText}`)
      }

      console.log('Product deleted successfully')
      // Refresh the product list
      await loadProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to delete product: ' + err.message)
    }
  }
}

const handleAddItemSubmit = async (result) => {
  if (result.success) {
    console.log('Product created successfully:', result.data)
    // Refresh the product list
    await loadProducts()
  } else {
    console.error('Failed to create product:', result.error)
  }
}

const handleNewTypeSubmit = async (result) => {
  if (result.success) {
    console.log('Product type created successfully:', result.data)
    // Refresh the product list
    await loadProducts()
  } else {
    console.error('Failed to create product type:', result.error)
  }
}

const handleEditItemSubmit = async (result) => {
  if (result.success) {
    console.log('Product edited successfully:', result.data)
    // Refresh the product list
    await loadProducts()
  } else {
    console.error('Failed to edit product:', result.error)
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #222;
}
.sidebar {
  width: 220px;
  background: #5a1818;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
}
.sidebar-title {
  font-size: 1.3rem;
  font-weight: bold;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid #3a0e0e;
  letter-spacing: 1px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  flex: 1;
}
.nav-item {
  background: none;
  border: none;
  color: #fff;
  text-align: left;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.nav-item.active,
.nav-item:hover {
  background: #a36a6a;
  color: #fff;
}
.logout {
  margin-top: auto;
  background: #3a0e0e;
  color: #fff;
}
.dashboard-content {
  background: #e5e5e5;
  padding: 2.5rem 2rem;
  border-radius: 18px;
  margin: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  /* overflow: scroll; */
}
.dashboard-header {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #bdbdbd;
  padding-bottom: 0.7rem;
}
.dashboard-header-right {
  margin-left: auto;
  align-self: flex-end;
}
.add-button {
  border: none;
  font-weight: 400;
  font-size: 16px;
  color: #5a1818;
  background-color: rgba(255, 255, 255, 0);
}
.add-button:hover {
  font-weight: 550;
  text-decoration: underline;
}
.dashboard-header h2 {
  font-size: 2rem;
  color: #5a1818;
  margin: 0;
}
.dashboard-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 220px 220px;
  gap: 1.5rem;
}
.panel {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
}
.panel h3 {
  color: #5a1818;
  font-size: 1.1rem;
  margin-bottom: 0.7rem;
}
.panel-chart-placeholder {
  flex: 1;
  border: 2px solid #bdbdbd;
  border-radius: 6px;
  margin-bottom: 0.7rem;
  background: #f7f7f7;
}
.panel-stats {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.98rem;
  color: #333;
}
.panel-stats li {
  margin-bottom: 0.2rem;
}
.transactions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.98rem;
}
.transactions-table th,
.transactions-table td {
  border-bottom: 1px solid #eee;
  padding: 0.4rem 0.6rem;
  text-align: left;
}
.transactions-table th {
  color: #5a1818;
  font-weight: 600;
  background: #f7f7f7;
}
.inventory-content {
  color: black;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: scroll;
}
.type-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}
.type-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}
.type-header:hover {
  background: #e9ecef;
}
.type-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #5a1818;
  flex: 1;
}
.type-count {
  color: #6c757d;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}
.toggle-icon {
  font-size: 0.8rem;
  color: #6c757d;
  margin-left: 1rem;
  transition: transform 0.2s;
}
.type-products {
  padding: 1rem;
  background: #fff;
}
</style>
