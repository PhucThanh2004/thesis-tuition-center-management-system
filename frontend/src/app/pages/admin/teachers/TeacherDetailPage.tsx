// src/app/pages/admin/teachers/TeacherDetailPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Verified,
  School,
  Users,
  CheckCircle,
  GraduationCap,
  HelpCircle,
  AlertCircle,
  Award,
  BookOpen,
  User,
  Clock,
  MapPin,
  Shield,
  Calendar
} from 'lucide-react';
import { teacherApi, buildTeacherFormData } from '../../../utils/api/teacher.api';
import type { Teacher } from '../../../utils/types/teacher';
import EditTeacherModal from '../../../components/adminComponents/teachers/EditTeacherModal';

const getFullAddress = (teacher: Teacher): string => {
  if (!teacher.address) return 'Chưa cập nhật';
  const parts = [teacher.address.details, teacher.address.ward, teacher.address.province].filter(Boolean);
  return parts.join(', ') || 'Chưa cập nhật';
};

const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_BACKEND_URL_IMAGE || import.meta.env.VITE_BACKEND_URL || '';
  const cleanBaseUrl = baseUrl.replace(/\/v1\/api$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${cleanBaseUrl}${path}`;
};

export function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setAlert } = useOutletContext<any>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await teacherApi.getAll(1, 1000);
      if (response.success && response.data) {
        const found = response.data.find(t => t.id === Number(id));
        if (found) {
          setTeacher(found);
        } else {
          setError('Không tìm thấy giáo viên');
        }
      } else {
        setError('Không thể tải dữ liệu');
      }
    } catch (err) {
      console.error('Fetch teacher error:', err);
      setError('Đã xảy ra lỗi khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTeacher();
    }
  }, [id]);

  const handleBack = () => navigate(-1);
  const handleEdit = () => setIsEditModalOpen(true);

  const handleSaveTeacher = async (updatedTeacher: any, file?: File) => {
    const formData = buildTeacherFormData(updatedTeacher, file);
    try {
      const response = await teacherApi.update(updatedTeacher.id, formData);
      if (response.errCode === 0) {
        setAlert?.({ type: 'success', message: response.message || 'Cập nhật giáo viên thành công' });
        setIsEditModalOpen(false);
        await fetchTeacher();
      } else {
        setAlert?.({ type: 'error', message: response.message || 'Cập nhật thất bại' });
      }
    } catch (error: any) {
      setAlert?.({ type: 'error', message: error.response?.data?.message || 'Cập nhật thất bại' });
    }
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      try {
        const response = await teacherApi.delete(teacherId);
        setAlert?.({ type: 'success', message: response.message || 'Xóa giáo viên thành công' });
        navigate('/admin/teachers');
      } catch (error: any) {
        setAlert?.({ type: 'error', message: error.response?.data?.message || 'Xóa thất bại' });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-600 mx-auto" />
          <p className="mt-3 text-xs text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-4">{error || 'Không tìm thấy giáo viên'}</p>
        <button onClick={handleBack} className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all">
          Quay lại
        </button>
      </div>
    );
  }

  const teacherId = `GV-${teacher.id}`;
  const department = teacher.specialty ? `Khoa ${teacher.specialty}` : 'Chưa phân khoa';
  const statusText = teacher.status ? 'Đang hoạt động' : 'Tạm nghỉ';
  const statusColor = teacher.status ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200';
  const statusDot = teacher.status ? 'bg-emerald-500' : 'bg-amber-500';
  const genderText = teacher.gender ? 'Nam' : 'Nữ';
  const dateOfBirth = teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật';
  const specialization = teacher.specialty || 'Chưa cập nhật';
  const skills: string[] = [teacher.specialty].filter(Boolean);

  const fullImageUrl = getFullImageUrl(teacher.image);
  const hasImage = fullImageUrl && !imageError;
  const initials = teacher.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Quay lại</span>
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg btn-gradient from-purple-500 to-purple-600 text-white text-sm font-medium shadow-sm shadow-purple-200 hover:shadow-md transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-800">Chi tiết giáo viên</h1>
            <p className="text-xs text-slate-400 mt-0.5">Thông tin đầy đủ và hồ sơ giảng dạy</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group mb-6">
            <div className="relative h-20 bg-purple-500 via-purple-600 to-indigo-600">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
              <div className="absolute -bottom-8 left-6 z-10">
                <div className="relative">
                  <div className="h-16 w-16 rounded-xl overflow-hidden ring-4 ring-white shadow-lg transition-transform group-hover:scale-105 duration-300">
                    {hasImage ? (
                      <img
                        src={fullImageUrl}
                        alt={teacher.fullName}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full btn-gradient from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 ring-2 ring-white">
                    <Verified className="w-3 h-3 text-white fill-current" />
                  </div>
                </div>
              </div>
              <div className="absolute top-3 right-6 text-white/20">
                <Shield className="w-6 h-6" />
              </div>
            </div>

            <div className="pt-10 pb-4 px-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{teacher.fullName}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                      {statusText}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200">
                      <School className="w-3 h-3" />
                      {department}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Info Cards - Full width info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information - Now includes email, phone, address, DOB */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Thông tin cơ bản</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Mã GV</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{teacherId}</span>
                </div>
                <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Giới tính</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{genderText}</span>
                </div>
                <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Ngày sinh</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{dateOfBirth}</span>
                </div>
                <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Email</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate">{teacher.email}</span>
                </div>
                {teacher.phoneNumber && (
                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                    <div className="w-20 flex-shrink-0">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">SĐT</p>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{teacher.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-start gap-3 py-1.5">
                  <div className="w-20 flex-shrink-0 pt-0.5">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Địa chỉ</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{getFullAddress(teacher)}</span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <div className="p-1.5 rounded-lg bg-emerald-100">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Chuyên môn</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Khoa</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{department}</span>
                </div>
                <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Chuyên ngành</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{specialization}</span>
                </div>
                <div className="py-1.5">
                  <div className="flex items-center gap-3">
                    <div className="w-20 flex-shrink-0">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Kỹ năng</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.length > 0 ? (
                        skills.map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-medium">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Chưa có kỹ năng</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={teacher}
        onSave={handleSaveTeacher}
        onDelete={handleDeleteTeacher}
      />
    </>
  );
}