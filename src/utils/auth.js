// Token storage utilities
const storeTokens = (tokens) => {
  localStorage.setItem('accessToken', tokens.accessToken)
  localStorage.setItem('refreshToken', tokens.refreshToken)
  localStorage.setItem('tokenExpiry', tokens.accessTokenExpiry)
  localStorage.setItem('refreshTokenExpiry', tokens.refreshTokenExpiry)
  localStorage.setItem('userId', tokens.userId)
  localStorage.setItem('email', tokens.email)
  localStorage.setItem('isAdmin', tokens.isAdmin)
}

const clearTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('tokenExpiry')
  localStorage.removeItem('refreshTokenExpiry')
  localStorage.removeItem('userId')
  localStorage.removeItem('email')
  localStorage.removeItem('isAdmin')
}

// Token Service for managing JWT tokens
class TokenService {
  constructor() {
    this.baseURL = import.meta.env.VITE_BACKEND_BASE_URL
  }

  // Check if access token is expired
  isTokenExpired() {
    const expiry = localStorage.getItem('tokenExpiry')
    if (!expiry) return true
    return new Date(expiry) <= new Date()
  }

  // Check if refresh token is expired
  isRefreshTokenExpired() {
    const expiry = localStorage.getItem('refreshTokenExpiry')
    if (!expiry) return true
    return new Date(expiry) <= new Date()
  }

  // Get current access token
  getAccessToken() {
    return localStorage.getItem('accessToken')
  }

  // Get current refresh token
  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}/user/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: this.getAccessToken(),
          refreshToken: this.getRefreshToken(),
        }),
      })

      if (response.ok) {
        const newTokens = await response.json()
        storeTokens(newTokens)
        return newTokens.accessToken
      } else {
        // Refresh token is invalid, redirect to login
        this.logout()
        throw new Error('Refresh token invalid')
      }
    } catch (error) {
      this.logout()
      throw error
    }
  }

  // Logout and revoke token
  async logout() {
    const accessToken = this.getAccessToken()
    if (accessToken) {
      try {
        await fetch(`${this.baseURL}/user/revoke-token`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      } catch (error) {
        console.error('Error revoking token:', error)
      }
    }
    clearTokens()
    // Redirect to login page
    window.location.href = '/admin-login'
  }
}

// HTTP Client with auto-refresh capabilities
class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_BACKEND_BASE_URL
    this.tokenService = new TokenService()
  }

  // Make authenticated API calls with auto-refresh
  async request(endpoint, options = {}) {
    // Add authorization header if token exists
    const accessToken = this.tokenService.getAccessToken()
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }

    // Make the request
    let response = await fetch(`${this.baseURL}${endpoint}`, options)

    // If 401 and we have a refresh token, try to refresh
    if (response.status === 401 && this.tokenService.getRefreshToken()) {
      try {
        const newAccessToken = await this.tokenService.refreshAccessToken()

        // Retry the original request with new token
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }
        response = await fetch(`${this.baseURL}${endpoint}`, options)
      } catch (error) {
        // Refresh failed, user needs to login again
        this.tokenService.logout()
        throw error
      }
    }

    return response
  }

  // Convenience methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

// Authentication Service
class AuthService {
  constructor() {
    this.apiClient = new ApiClient()
    this.tokenService = new TokenService()
  }

  async login(email, password, rememberMe = false) {
    const response = await this.apiClient.post('/user/login', {
      email,
      password,
      rememberMe,
    })

    if (response.ok) {
      const tokens = await response.json()
      storeTokens(tokens)
      return tokens
    } else {
      const error = await response.text()
      throw new Error(error)
    }
  }

  async logout() {
    await this.tokenService.logout()
  }

  isAuthenticated() {
    return !this.tokenService.isTokenExpired() && this.tokenService.getAccessToken()
  }

  getUserInfo() {
    if (!this.isAuthenticated()) return null

    return {
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('email'),
      isAdmin: localStorage.getItem('isAdmin') === 'true',
    }
  }
}

// Create singleton instances
export const tokenService = new TokenService()
export const apiClient = new ApiClient()
export const authService = new AuthService()

// Export utilities for backward compatibility
export { storeTokens, clearTokens, TokenService, ApiClient, AuthService }
