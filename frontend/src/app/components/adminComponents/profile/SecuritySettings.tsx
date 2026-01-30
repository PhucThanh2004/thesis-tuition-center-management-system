import { Lock, Key, Smartphone, Shield, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { ChangePasswordModal } from './ChangePasswordModal';

export function SecuritySettings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Bảo mật</h3>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-purple-50 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Đổi mật khẩu</h4>
                  <p className="text-sm text-gray-600">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản</p>
                  <p className="text-xs text-gray-500 mt-1">Đổi lần cuối: 15/01/2025</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Thay đổi
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">Xác thực 2 bước</h4>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Đã bật
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Bảo vệ tài khoản bằng mã xác thực</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                Quản lý
              </button>
            </div>
          </div>

          {/* API Keys */}
          <div className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                  <Key className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">API Keys</h4>
                  <p className="text-sm text-gray-600">Quản lý khóa API cho tích hợp</p>
                  <p className="text-xs text-gray-500 mt-1">3 khóa đang hoạt động</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                Xem
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-orange-50 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phiên đăng nhập</h4>
                  <p className="text-sm text-gray-600">Quản lý các thiết bị đang đăng nhập</p>
                  <p className="text-xs text-gray-500 mt-1">2 thiết bị đang hoạt động</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                Quản lý
              </button>
            </div>
          </div>
        </div>

        {/* Security Alert */}
        <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Khuyến nghị bảo mật</h4>
              <p className="text-sm text-yellow-800">
                Nên bật xác thực 2 bước và thay đổi mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </>
  );
}