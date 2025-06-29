# JWT Refresh Token Implementation

## Overview

This document describes the implementation of a JWT refresh token authentication system in the Vue.js fire extinguisher site application. The system provides secure authentication with automatic token refresh capabilities.

## Architecture

### Core Services

1. **TokenService** (`src/utils/auth.js`)

   - Manages JWT token storage and validation
   - Handles token expiry checks
   - Provides token refresh functionality
   - Manages logout and token revocation

2. **ApiClient** (`src/utils/auth.js`)

   - HTTP client with automatic token refresh
   - Intercepts 401 responses and attempts token refresh
   - Provides convenient methods for API calls (GET, POST, PUT, DELETE)
   - Handles authentication headers automatically

3. **AuthService** (`src/utils/auth.js`)

   - High-level authentication operations
   - Login/logout functionality
   - User information management
   - Authentication state validation

4. **useAuth Composable** (`src/composables/useAuth.js`)
   - Vue 3 composable for reactive authentication state
   - Provides login/logout methods
   - Manages loading and error states
   - Integrates with Vue's reactivity system

## API Endpoints

### Authentication Endpoints

1. **Login**

   ```
   POST /api/user/login
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "password123",
     "rememberMe": false
   }

   Response:
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refreshToken": "base64_encoded_refresh_token",
     "accessTokenExpiry": "2024-01-01T12:00:00Z",
     "refreshTokenExpiry": "2024-01-08T12:00:00Z",
     "isAdmin": false,
     "userId": "user_id",
     "email": "user@example.com"
   }
   ```

2. **Refresh Token**

   ```
   POST /api/user/refresh-token
   Content-Type: application/json

   {
     "accessToken": "expired_or_valid_access_token",
     "refreshToken": "valid_refresh_token"
   }
   ```

3. **Logout (Revoke Token)**
   ```
   POST /api/user/revoke-token
   Authorization: Bearer valid_access_token
   ```

## Implementation Details

### Token Storage

Tokens are stored securely in localStorage with the following structure:

```javascript
localStorage.setItem('accessToken', tokens.accessToken)
localStorage.setItem('refreshToken', tokens.refreshToken)
localStorage.setItem('tokenExpiry', tokens.accessTokenExpiry)
localStorage.setItem('refreshTokenExpiry', tokens.refreshTokenExpiry)
localStorage.setItem('userId', tokens.userId)
localStorage.setItem('email', tokens.email)
localStorage.setItem('isAdmin', tokens.isAdmin)
```

### Automatic Token Refresh

The ApiClient automatically handles token refresh when:

1. A request returns a 401 (Unauthorized) status
2. A valid refresh token exists
3. The refresh token is not expired

The refresh process:

1. Attempts to refresh the access token using the refresh token
2. If successful, retries the original request with the new token
3. If unsuccessful, redirects to the login page

### Security Features

- **Token Expiry Validation**: Checks both access and refresh token expiry
- **Automatic Token Revocation**: Revokes tokens on logout
- **Secure Storage**: Uses localStorage for web applications
- **Error Handling**: Graceful handling of authentication failures
- **Route Protection**: Vue Router guards for protected routes

## Usage Examples

### Basic Authentication

```javascript
import { useAuth } from '../composables/useAuth.js'

const { login, logout, user, isAuthenticated, loading, error } = useAuth()

// Login
try {
  const userData = await login('user@example.com', 'password123', true)
  console.log('Login successful:', userData)
} catch (error) {
  console.error('Login failed:', error)
}

// Logout
await logout()
```

### API Calls with Auto-Refresh

```javascript
import { apiClient } from '../utils/auth.js'

// Make authenticated API calls (auto-refresh handled automatically)
try {
  const response = await apiClient.get('/products')
  const products = await response.json()
  console.log('Products:', products)
} catch (error) {
  console.error('API call failed:', error)
}
```

### Route Protection

```javascript
// In router.js
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
```

## Migration from Old System

### Changes Made

1. **AdminLogin.vue**

   - Replaced axios with useAuth composable
   - Added remember me functionality
   - Improved error handling and loading states

2. **AdminPage.vue**

   - Updated logout to use new AuthService
   - Added loading state for logout

3. **InventoryTab.vue**

   - Replaced direct fetch with ApiClient
   - Automatic token refresh on API calls

4. **AddItemModal.vue**

   - Updated to use ApiClient for authenticated requests
   - Improved error handling

5. **NewTypeModal.vue**

   - Replaced axios with ApiClient
   - Simplified token handling

6. **Router.js**
   - Updated route guards to use new AuthService
   - Improved authentication validation

### Backward Compatibility

The new system maintains backward compatibility by:

- Using the same localStorage keys where possible
- Providing similar API interfaces
- Maintaining existing component structure

## Error Handling

### Common Error Scenarios

1. **Token Expired**

   - Automatic refresh attempt
   - Redirect to login if refresh fails

2. **Network Errors**

   - Graceful degradation
   - User-friendly error messages

3. **Invalid Credentials**

   - Clear error messages
   - Form validation

4. **Server Errors**
   - Retry mechanisms
   - Fallback behaviors

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Remember me functionality
- [ ] Token refresh on API calls
- [ ] Logout functionality
- [ ] Route protection
- [ ] Error handling
- [ ] Network error scenarios

### Automated Testing

Consider implementing tests for:

- Token validation
- API client functionality
- Authentication flow
- Error scenarios
- Route guards

## Security Considerations

1. **Token Storage**: Consider using secure storage for sensitive applications
2. **HTTPS**: Ensure all API calls use HTTPS in production
3. **Token Expiry**: Configure appropriate token expiry times
4. **Refresh Token Rotation**: Consider implementing refresh token rotation
5. **CSRF Protection**: Implement CSRF protection if needed

## Future Enhancements

1. **Biometric Authentication**: Add biometric authentication for mobile
2. **Multi-factor Authentication**: Implement MFA
3. **Session Management**: Add session management features
4. **Offline Support**: Handle offline scenarios
5. **Token Rotation**: Implement automatic token rotation

## Troubleshooting

### Common Issues

1. **Token Not Refreshing**

   - Check refresh token expiry
   - Verify API endpoint configuration
   - Check network connectivity

2. **Login Loop**

   - Clear localStorage
   - Check authentication state
   - Verify route guards

3. **API Calls Failing**
   - Check token validity
   - Verify API client configuration
   - Check network connectivity

### Debug Information

Enable debug logging by adding console.log statements in the auth services for troubleshooting authentication issues.
