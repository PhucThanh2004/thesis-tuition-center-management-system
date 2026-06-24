// src/components/adminComponents/profile/ProfileHeader.tsx
import { useEffect, useState, useRef } from "react";
import { Camera, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext'
import { formatDate, getRoleName } from "../../../utils/helpers";
import { studentApi, subjectApi, teacherApi, userApi } from '../../../utils/api'
import { useOutletContext } from "react-router-dom"
import { getImageSrc, getInitials } from "../../../utils/helpers";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
} from "../../../components/ui/alert-dialog"

interface ProfileHeaderProps {
  isTeacher?: boolean;
}

export function ProfileHeader({ isTeacher = false }: ProfileHeaderProps) {
  const { setAlert } = useOutletContext<{
    setAlert: React.Dispatch<
      React.SetStateAction<{
        type: "success" | "error"
        message: string
      } | null>
    >
  }>()
  const { user } = useAuth();

  const [imageError, setImageError] = useState(false);

  const [totalStudents, setTotalStudents] = useState<number>(0)
  const [totalSubjects, setTotalSubjects] = useState<number>(0)
  const [totalTeachers, setTotalTeachers] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const getActiveDays = (createdAt?: string) => {
    if (!createdAt) return 0

    const start = new Date(createdAt)
    const now = new Date()

    const diffTime = now.getTime() - start.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    return diffDays >= 0 ? diffDays : 0
  }

  useEffect(() => {
    // Chỉ gọi API thống kê nếu không phải là teacher
    if (!isTeacher) {
      studentApi.getStatistics()
        .then(res => {
          setTotalStudents(res.totalStudents)
        })
        .catch(err => {
          console.error('Lỗi lấy thống kê học sinh', err)
        })

      subjectApi.getStatistics()
        .then(res => {
          setTotalSubjects(res.totalSubjects)
        })
        .catch(err => console.error(err))

      teacherApi.getStatistics()
        .then(res => {
          setTotalTeachers(res.totalTeachers);
        })
        .catch(err => console.error('Lỗi lấy thống kê giáo viên', err));
    }
  }, [isTeacher])

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPendingFile(file)
    setConfirmOpen(true)
  }

  const handleConfirmUpload = async () => {
    if (!pendingFile) return

    try {
      setUploading(true)

      const res = await userApi.updateUserImage(pendingFile)
      if (user) {
        user.image = res.image
      }
      setImageError(false)

      setAlert({
        type: "success",
        message: "Ảnh đại diện đã được cập nhật thành công",
      })
    } catch (err) {
      console.error(err)
      setAlert({
        type: "error",
        message: "Cập nhật ảnh đại diện thất bại",
      })
    } finally {
      setUploading(false)
      setConfirmOpen(false)
      setPendingFile(null)
    }
  }

  const userImage = getImageSrc(user?.image);
  const userInitials = getInitials(user?.fullName);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div
        className="h-32 sm:h-48 relative"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/30 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white/25 rounded-full blur-xl"></div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xl ring-4 ring-white">
                {imageError || !userImage ? (
                  <div
                    className="w-full h-full rounded-xl flex items-center justify-center text-white text-4xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <span className="text-4xl font-bold text-white">
                      {userInitials}
                    </span>
                  </div>
                ) : (
                  <img
                    src={userImage}
                    className="w-full h-full object-cover rounded-xl"
                    onError={handleImageError}
                    alt={user?.fullName}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className={`absolute bottom-2 right-2 p-2 rounded-lg shadow-lg border transition-all
                  ${uploading
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="mb-2 mt-24">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user?.fullName}</h1>
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span className="text-xs font-semibold"> {user?.roleId && getRoleName(user.roleId)}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                {isTeacher ? 'Giáo viên' : 'Quản trị viên hệ thống'}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{user?.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Tham gia: {formatDate(user?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chỉ hiển thị thống kê nếu không phải là teacher */}
        {!isTeacher && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
              <div className="text-sm text-gray-600">Học viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalSubjects}</div>
              <div className="text-sm text-gray-600">Khóa học</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalTeachers}</div>
              <div className="text-sm text-gray-600">Giáo viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {getActiveDays(user?.createdAt)}
              </div>
              <div className="text-sm text-gray-600">Ngày hoạt động</div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận thay đổi ảnh</AlertDialogTitle>
          <AlertDialogClose onClick={() => setConfirmOpen(false)} />
        </AlertDialogHeader>

        <AlertDialogDescription>
          Bạn có chắc chắn muốn cập nhật ảnh đại diện mới không?
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
            Huỷ
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmUpload}>
            Đồng ý
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
}