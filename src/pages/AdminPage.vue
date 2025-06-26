<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <div class="sidebar-title">Brave Heart Safety</div>
      <nav class="sidebar-nav">
        <button
          v-for="link in navLinks"
          :key="link.url"
          class="nav-item"
          :class="{ active: route.path === link.url }"
          @click="goTo(link)"
        >
          {{ link.name }}
        </button>
        <button class="nav-item logout" @click="logout">Logout</button>
      </nav>
    </aside>
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Sidebar navigation links (easy to replace with axios-fetched data)
const navLinks = ref([
  { name: 'Dashboard', url: '/admin/dashboard' },
  { name: 'Orders', url: '/admin/orders' },
  { name: 'Inventory', url: '/admin/inventory' },
  { name: 'Customers', url: '/admin/customers' },
  { name: 'Calendar', url: '/admin/calendar' },
])

function goTo(tab) {
  router.push(tab.url)
}

function logout() {
  localStorage.removeItem('isAdmin')
  window.location.href = '/admin-login'
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  width: 100vw;
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
}
.dashboard-header {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #bdbdbd;
  padding-bottom: 0.7rem;
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
</style>
