import {
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  VenusAndMars,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { getRoleName, getGenderName } from '../../../utils/helpers'
import { userApi } from '../../../utils/api'
import { useOutletContext } from 'react-router-dom'

export function PersonalInfo() {
  const { user, refreshProfile } = useAuth()
  const { setAlert } = useOutletContext<any>()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // OTP dialog
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender ?? true,
  })

  const handleSave = async () => {
    try {
      setLoading(true)
      const res = await userApi.updateProfile({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        gender: form.gender,
      })
      if (res.requireOtp) {
        setShowOtpDialog(true)
        return
      }
      setAlert({
        type: 'success',
        message: res.message,
      })

      await refreshProfile()
      setIsEditing(false)

      setIsEditing(false)

    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err?.response?.data?.message || 'Cập nhật thất bại',
      })
    } finally {
      setLoading(false)
    }
  }


  const handleVerifyOtp = async () => {
    try {
      setOtpLoading(true)
      await userApi.verifyEmailOtp(otp)

      await refreshProfile()
      setShowOtpDialog(false)

      setAlert({
        type: 'success',
        message: 'Thông tin đã được cập nhật',
      })

      setShowOtpDialog(false)
      setIsEditing(false)
      setOtp('')

    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err?.response?.data?.message || 'OTP không hợp lệ',
      })
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <>
      {/* ================= MAIN CARD ================= */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Thông tin cá nhân
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg"
          >
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full name */}
          <div>
            <label className="text-sm font-medium mb-2 flex gap-2">
              <User className="w-4 h-4" /> Họ và tên
            </label>
            {isEditing ? (
              <input
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            ) : (
              <p>{user?.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium mb-2 flex gap-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            {isEditing ? (
              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            ) : (
              <p>{user?.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium mb-2 flex gap-2">
              <Phone className="w-4 h-4" /> Số điện thoại
            </label>
            {isEditing ? (
              <input
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phoneNumber: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            ) : (
              <p>{user?.phoneNumber}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-medium mb-2 flex gap-2">
              <VenusAndMars className="w-4 h-4" /> Giới tính
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="relative">
                  <select
                    value={form.gender ? '1' : '0'}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        gender: e.target.value === '1',
                      })
                    }
                    className="
      w-full
      px-4 py-2 pr-10
      border border-gray-300
      rounded-lg
      text-sm
      text-gray-700
      bg-white
      focus:outline-none
      focus:ring-2 focus:ring-gray-300
      focus:border-gray-100
      appearance-none
    "
                  >
                    <option value="1">Nam</option>
                    <option value="0">Nữ</option>
                  </select>

                  {/* icon dropdown */}
                  <ChevronDown
                    size={18}
                    className="
      pointer-events-none
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      text-gray-400
    "
                  />
                </div>
                {/* arrow */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">

                </span>
              </div>

            ) : (
              <p>{getGenderName(user?.gender)}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex gap-2">
              <Briefcase className="w-4 h-4" /> Chức vụ
            </label>
            <p>{user?.roleId && getRoleName(user.roleId)}</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex gap-2">
              <Globe className="w-4 h-4" /> Website
            </label>
            <p>https://educenter.com</p>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{
                background:
                  'linear-gradient(135deg,#667eea,#764ba2)',
              }}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 rounded-lg bg-gray-100"
            >
              Hủy bỏ
            </button>
          </div>
        )}
      </div>

      {/* OTP */}
      {showOtpDialog && (
        <div className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Xác nhận OTP
            </h2>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOtpDialog(false)}
                className="px-4 py-2 bg-gray-100 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="px-4 py-2 text-white rounded"
                style={{
                  background:
                    'linear-gradient(135deg,#667eea,#764ba2)',
                }}
              >
                {otpLoading ? 'Đang xác nhận...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
