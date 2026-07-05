import axios from '../axios'

export interface LoginResponse {
  errCode?: number
  message?: string
  data?: {
    token: string
    user: {
      id: number
      fullName: string
      email: string
      phoneNumber: string
      roleId: string
      image?: string
    }
  }
  // Fallback nếu API trả về trực tiếp
  token?: string
  user?: {
    id: number
    fullName: string
    email: string
    phoneNumber: string
    roleId: string
    image?: string
  }
}

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  console.log('🔐 [loginApi] Attempting login for:', email)
  
  try {
    const response = await axios.post('/login', { email, password }) as any
    console.log('✅ [loginApi] Login response:', response)
    return response
  } catch (error) {
    console.error('❌ [loginApi] Login failed:', error)
    throw error
  }
}
