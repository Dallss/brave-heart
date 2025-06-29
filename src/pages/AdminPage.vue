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
      </nav>
      <button class="logout" @click="handleLogout" :disabled="loading">
        {{ loading ? 'Logging out...' : 'Logout' }}
      </button>
    </aside>
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const route = useRoute()
const { logout, loading } = useAuth()

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

async function handleLogout() {
  try {
    await logout()
    // The logout function in authService will handle the redirect
  } catch (error) {
    console.error('Logout failed:', error)
    // Fallback redirect
    window.location.href = '/admin-login'
  }
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #dfdfdf;
}
.sidebar {
  width: 230px;
  background: #510f0f;
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 18px;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 800;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  margin-bottom: 50px;
  letter-spacing: 1px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}
.nav-item {
  background: none;
  width: 70%;
  border: none;
  color: #fff;
  text-align: left;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  border-radius: 10px;
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
  width: 100%;
  text-align: center;

  background: none;
  border: none;
  color: #fff;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.logout:hover {
  background-color: #6d1a1a;
}

.dashboard-content {
  flex: 1;
  background: #ffffffdc;
  padding: 2.5rem 2rem;
  border-radius: 18px;
  margin: 2rem;
  display: flex;
  flex-direction: column;
}
</style>
