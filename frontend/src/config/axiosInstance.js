import axios from 'axios'
import { api_url } from './apiConfig'

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: api_url,
  withCredentials: true, // Always send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - runs before every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure credentials are always sent
    config.withCredentials = true
    
    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - runs after every response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`)
    return response
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      console.error(`❌ ${error.response.status} - ${error.response.config.url}`)
      
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        console.warn('🔒 Unauthorized - Session expired or invalid')
        // Clear local storage
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
        }
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.warn('🚫 Forbidden - Insufficient permissions')
      }
    } else if (error.request) {
      console.error('❌ No response received:', error.request)
    } else {
      console.error('❌ Error:', error.message)
    }
    //hello
    return Promise.reject(error)
  }
)

export default axiosInstance
