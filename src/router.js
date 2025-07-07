import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import NotFound from './pages/NotFound.vue'
import AdminLogin from './pages/AdminLogin.vue'
import AdminPage from './pages/AdminPage.vue'
import DashboardTab from './components/admin/tab/DashboardTab.vue'
import OrdersTab from './components/admin/tab/OrdersTab.vue'
import InventoryTab from './components/admin/tab/InventoryTab.vue'
import CalndarTab from './components/admin/tab/CalndarTab.vue'
import CustomersTab from './components/admin/tab/CustomersTab.vue'
import { authService } from './utils/auth.js'

const routes = [
  { path: '/', component: HomePage },
  { path: '/admin-login', component: AdminLogin },
  {
    path: '/admin',
    component: AdminPage,
    children: [
      {
        path: 'dashboard',
        component: DashboardTab,
        meta: { requiresAdmin: true },
      },
      {
        path: 'orders',
        component: OrdersTab,
        meta: { requiresAdmin: true },
      },
      {
        path: 'inventory',
        component: InventoryTab,
        meta: { requiresAdmin: true },
      },
      {
        path: 'customers',
        component: CustomersTab,
        meta: { requiresAdmin: true },
      },
      {
        path: 'calendar',
        component: CalndarTab,
        meta: { requiresAdmin: true },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    if (authService.isAuthenticated() && authService.getUserInfo()?.isAdmin) {
      next()
    } else {
      next('/admin-login')
    }
  } else {
    next()
  }
})

export default router
