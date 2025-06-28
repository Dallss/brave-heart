<template>
  <main class="dashboard-content">
    <div class="dashboard-header">
      <h2>Inventory</h2>
      <div class="dashboard-header-right">
        <button @click="showAddItem = true">Add Item</button> |
        <button @click="showNewType = true">New Type</button>
      </div>
    </div>

    <ErrorMessage v-if="error" :message="error" :show-retry="true" @retry="loadProducts" />

    <LoadingIndicator v-else-if="loading" message="Loading inventory..." />

    <div v-else-if="products" class="inventory-content">
      <!-- Inventory content will go here -->
      <p>Products loaded: {{ products.length || 0 }} items</p>
    </div>

    <AddItemModal :show="showAddItem" @close="showAddItem = false" />
    <NewTypeModal :show="showNewType" @close="showNewType = false" />
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import AddItemModal from '../modals/AddItemModal.vue'
import NewTypeModal from '../modals/NewTypeModal.vue'
import LoadingIndicator from '../../LoadingIndicator.vue'
import ErrorMessage from '../../ErrorMessage.vue'

const showAddItem = ref(false)
const showNewType = ref(false)

const products = ref(null)
const error = ref(null)
const loading = ref(true)

watch(products, (newValue) => {
  console.log(`Products: ${newValue}`)
})

const loadProducts = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('https://api.example.com/data')
    if (!response.ok) throw new Error('Network error')

    products.value = await response.json()
  } catch (err) {
    error.value = err.message
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
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
  flex: 1;
  background: #e5e5e5;
  padding: 2.5rem 2rem;
  border-radius: 18px;
  margin: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
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
  flex: 1;
}
</style>
