import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/axios'

interface User {
  id: number
  fullName: string
  email: string
  roleId: string
  image?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // verify token khi app load
 useEffect(() => {
  api
    .get('/v1/api/auth/me')
    .then(res => {
      const data = res as unknown as { user: User }
      setUser(data.user)
    })
    .catch(() => {
      setUser(null)
    })
    .finally(() => setLoading(false))
}, [])

  const login = (user: User) => {
    setUser(user)
  }

  const logout = async () => {
  try {
    await api.post('/v1/api/logout', {}, { withCredentials: true })
  } catch (err) {
    console.error('Logout error', err)
  } finally {
    setUser(null)
  }
}

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
