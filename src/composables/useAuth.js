import { ref, computed, onMounted } from 'vue'
import { authService } from '../utils/auth.js'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Check if user is authenticated
  const isAuthenticated = computed(() => {
    return authService.isAuthenticated()
  })

  // Get user info
  const getUserInfo = computed(() => {
    return authService.getUserInfo()
  })

  // Initialize auth state
  const initializeAuth = () => {
    if (authService.isAuthenticated()) {
      user.value = authService.getUserInfo()
    }
    loading.value = false
  }

  // Login function
  const login = async (email, password, rememberMe = false) => {
    loading.value = true
    error.value = null

    try {
      const userData = await authService.login(email, password, rememberMe)
      user.value = authService.getUserInfo()
      return userData
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    loading.value = true
    try {
      await authService.logout()
      user.value = null
      error.value = null
    } catch (err) {
      error.value = err.message
      console.error('Logout error:', err)
    } finally {
      loading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Initialize on mount
  onMounted(() => {
    initializeAuth()
  })

  return {
    // State
    user,
    loading,
    error,

    // Computed
    isAuthenticated,
    getUserInfo,

    // Methods
    login,
    logout,
    clearError,
    initializeAuth,
  }
}
