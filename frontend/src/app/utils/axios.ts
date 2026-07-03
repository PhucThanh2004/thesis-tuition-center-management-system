/*import axios from 'axios'
import type { AxiosResponse } from 'axios'


const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

instance.interceptors.response.use(
   (res: AxiosResponse) => res.data,
  err => {
    if (err.response?.status === 401) {
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)


export default instance
*/

// src/utils/axios.ts
import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ THÊM INTERCEPTOR NÀY - GỬI TOKEN
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    
    console.log('🔑 [axios] Token:', token ? token.substring(0, 20) + '...' : 'No token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ [axios] Added Authorization header')
    } else {
      console.warn('⚠️ [axios] No token found in localStorage')
    }
    
    console.log('📤 [axios] Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params,
    })
    
    return config
  },
  (error) => {
    console.error('❌ [axios] Request error:', error)
    return Promise.reject(error)
  }
)

// ✅ GIỮ NGUYÊN response interceptor (có thể cải thiện)
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    console.log('📥 [axios] Response:', {
      url: res.config.url,
      status: res.status,
      data: res.data,
    })
    return res.data
  },
  (error) => {
    console.error('❌ [axios] Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
    
    // Xử lý 401 - Unauthorized
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expired or invalid, redirecting to login')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'  // Chuyển về login
    }
    
    // Xử lý 403 - Forbidden
    if (error.response?.status === 403) {
      console.warn('⚠️ Forbidden - User lacks permission')
      // Có thể hiển thị toast thông báo
    }
    
    return Promise.reject(error)
  }
)

export default instance