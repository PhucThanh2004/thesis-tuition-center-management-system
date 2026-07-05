import axios from '../axios'
import type {
  UpdateUserImageResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  VerifyEmailOtpResponse,
  ChangePasswordRequest,
  ChangePasswordResponse
} from '../types/user'

export const userApi = {

  // Lấy profile
  getProfile() {
    return axios.get('/profile')
  },

  // Update thông tin user (có thể yêu cầu OTP)
  updateProfile(
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    return axios.post('/profile/update', data)
  },

  // Xác nhận OTP đổi email
  verifyEmailOtp(
    otp: string
  ): Promise<VerifyEmailOtpResponse> {
    return axios.post('/profile/verify-email-otp', { otp })
  },

  updateUserImage(file: File): Promise<UpdateUserImageResponse> {
    const formData = new FormData()
    formData.append('image', file)

    // ✅ Lấy token từ localStorage
    const token = localStorage.getItem('token')
    
    return axios.put('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })
  },
 changePassword(
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  return axios.post('/change-password', data)
}
}
