// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/axios'

interface User {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  roleId: string
  gender?: boolean | null 
  image?: string
  createdAt?: string 
  passwordUpdatedAt?: string 
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User, token: string) => void // ✅ Thêm token parameter
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Khởi tạo token khi app load
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
    if (token) {
      // Đảm bảo token luôn được set
      localStorage.setItem('accessToken', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  // ✅ Verify token khi app load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
      
      if (!token) {
        console.warn('⚠️ No token found, user not authenticated')
        setLoading(false)
        return
      }

      try {
        console.log('🔐 Verifying token...')
        const response = await api.get('/auth/me') as any
        
        // Kiểm tra response structure
        if (response && response.user) {
          setUser(response.user)
          console.log('✅ User authenticated:', response.user.email)
        } else if (response && response.data && response.data.user) {
          // Fallback cho response khác
          setUser(response.data.user)
        } else {
          console.warn('⚠️ Invalid response structure:', response)
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Token verification failed:', error)
        // Token không hợp lệ, xóa token
        localStorage.removeItem('accessToken')
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  const login = (user: User, token: string) => {
    console.log('🔐 Login successful, saving token and user')
    
    // Lưu token với key chuẩn
    localStorage.setItem('accessToken', token)
    localStorage.setItem('token', token) // Lưu cả 2 key để tương thích
    
    // Set default header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    // Lưu user
    setUser(user)
    
    console.log('✅ User logged in:', user.email)
  }

  const logout = async () => {
    try {
      console.log('🔐 Logging out...')
      await api.post('/logout', {}, { withCredentials: true })
    } catch (err) {
      console.error('Logout error', err)
    } finally {
      // Xóa tất cả
      localStorage.removeItem('accessToken')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
      console.log('✅ Logged out successfully')
    }
  }

  const refreshProfile = async () => {
    try {
      console.log('🔄 Refreshing profile...')
      const response = await api.get('/auth/me') as any
      
      if (response && response.user) {
        setUser(response.user)
        console.log('✅ Profile refreshed:', response.user.email)
      } else if (response && response.data && response.data.user) {
        setUser(response.data.user)
      }
    } catch (err) {
      console.error('❌ Refresh profile error', err)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
