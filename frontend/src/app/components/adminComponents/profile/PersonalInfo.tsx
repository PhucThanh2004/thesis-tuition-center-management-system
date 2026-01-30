import { User, Mail, Phone, MapPin, Calendar, Briefcase, Globe, VenusAndMars } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext'
import { getRoleName, getGenderName } from "../../../utils/helpers";

export function PersonalInfo() {

  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4" />
            Họ và tên
          </label>
          {isEditing ? (
            <input
              type="text"
              defaultValue="Admin User"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900 font-medium">{user?.fullName}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              defaultValue="admin@educenter.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900 font-medium">{user?.email}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4" />
            Số điện thoại
          </label>
          {isEditing ? (
            <input
              type="tel"
              defaultValue="0901234567"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900 font-medium">{user?.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <VenusAndMars className="w-4 h-4" />
            Giới tính
          </label>
          {isEditing ? (
            <select
              defaultValue={user?.gender ? '1' : '0'}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="1">Nam</option>
              <option value="0">Nữ</option>
            </select>
          ) : (
            <p className="text-gray-900 font-medium">
              {getGenderName(user?.gender)}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4" />
            Chức vụ
          </label>
          <p className="text-gray-900 font-medium">{user?.roleId && getRoleName(user.roleId)}</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4" />
            Website
          </label>
          <p className="text-gray-900 font-medium">https://educenter.com</p>
        </div>
        {/*
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4" />
            Địa chỉ
          </label>
          {isEditing ? (
            <textarea
              defaultValue="123 Đường ABC, Quận XYZ, Hà Nội, Việt Nam"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900 font-medium">123 Đường ABC, Quận XYZ, Hà Nội, Việt Nam</p>
          )}
        </div>
        */}
      </div>

      {isEditing && (
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Lưu thay đổi
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      )}
    </div>
  );
}
