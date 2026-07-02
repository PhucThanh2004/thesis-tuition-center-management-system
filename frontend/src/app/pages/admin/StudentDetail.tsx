'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  User,
  School,
  FileText,
  CalendarDays,
  UserCheck,
  Sparkles,
  Shield,
  ChevronRight,
  Star,
  TrendingUp,
  BarChart3,
  Layers
} from 'lucide-react';
import type { Student } from '../../utils/types/student';
import { studentApi } from '../../utils/api/student.api';

// Helper tạo full URL cho ảnh
const getFullImageUrl = (imagePath: string | null | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_BACKEND_URL_IMAGE || import.meta.env.VITE_BACKEND_URL || '';
  const cleanBaseUrl = baseUrl.replace(/\/v1\/api$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${cleanBaseUrl}${path}`;
};

// Format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Chưa cập nhật';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStudent(parseInt(id));
    }
  }, [id]);

  const fetchStudent = async (studentId: number) => {
    try {
      setLoading(true);
      const data = await studentApi.getById(studentId);
      if (data) {
        setStudent(data);
      } else {
        setError('Không tìm thấy học sinh');
      }
    } catch (err: any) {
      console.error('Fetch student error:', err);
      setError(err.response?.data?.message || 'Lỗi khi tải thông tin học sinh');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/student');
  };

  const avatarUrl = student?.image ? getFullImageUrl(student.image) : undefined;
  const hasAvatar = avatarUrl && !imageError;

  const initials = student?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'HS';

  // Stats từ dữ liệu thật
  const getStats = () => {
    return [
      {
        label: 'Lớp học',
        value: `Lớp ${student?.grade || 'N/A'}`,
        icon: School,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        gradient: 'from-purple-100 to-purple-50'
      },
      {
        label: 'Trạng thái',
        value: student?.status ? 'Đang học' : 'Ngưng học',
        icon: UserCheck,
        color: student?.status ? 'text-emerald-600' : 'text-red-600',
        bg: student?.status ? 'bg-emerald-100' : 'bg-red-100',
        gradient: student?.status ? 'from-emerald-100 to-emerald-50' : 'from-red-100 to-red-50'
      },
      {
        label: 'Ngày tạo',
        value: formatDate(student?.createdAt),
        icon: Calendar,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        gradient: 'from-blue-100 to-blue-50'
      },
      {
        label: 'Môn học',
        value: student?.subjects?.length || 0,
        icon: BookOpen,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
        gradient: 'from-amber-100 to-amber-50'
      },
    ];
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-200 border-t-purple-600 mx-auto" />
          <p className="mt-3 text-xs text-slate-400">Đang tải thông tin học sinh...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-200 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-sm font-medium text-slate-700 mb-4">{error || 'Không có dữ liệu'}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách
          </button>
          <button className="px-4 py-2 rounded-lg btn-gradient from-purple-500 to-purple-600 text-white text-sm font-medium shadow-sm shadow-purple-200 hover:shadow-md transition-all flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Hồ sơ
          </button>
        </div>

        {/* Profile Header Card - Premium */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="relative h-32 bg-purple-500 via-purple-600 to-indigo-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="absolute bottom-0 left-6 -mb-10">
              <div className="relative">
                <div className="h-24 w-24 rounded-xl overflow-hidden ring-4 ring-white shadow-lg">
                  {hasAvatar ? (
                    <img
                      src={avatarUrl}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full btn-gradient from-purple-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 ring-2 ring-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            {/* Decorative sparkle */}
            <div className="absolute top-4 right-8 text-white/20">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          <div className="pt-12 pb-5 px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{student.fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${student.status
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${student.status ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {student.status ? 'Đang học' : 'Ngưng học'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200">
                    <School className="w-3 h-3" />
                    Lớp {student.grade}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-600 border border-purple-200">
                    <Star className="w-3 h-3" />
                    {student.subjects?.length || 0} môn
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - 4 cards với btn-gradient backgrounds */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-700 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information - Premium */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Thông tin cá nhân</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">Họ và tên</p>
                  <p className="text-sm font-medium text-slate-700">{student.fullName}</p>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">Giới tính</p>
                  <p className="text-sm font-medium text-slate-700">{student.gender ? 'Nam' : 'Nữ'}</p>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">Ngày sinh</p>
                  <p className="text-sm font-medium text-slate-700">{formatDate(student.dateOfBirth)}</p>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">Lớp</p>
                  <p className="text-sm font-medium text-slate-700">Lớp {student.grade}</p>
                </div>
                <div className="sm:col-span-2 bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">Địa chỉ</p>
                  <p className="text-sm font-medium text-slate-700">
                    {student.address?.details ? `${student.address.details}, ${student.address.ward}, ${student.address.province}` : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </div>

            {/* Môn học đang học - Premium */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-amber-100">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Môn học đang học</h3>
                {student.subjects && student.subjects.length > 0 && (
                  <span className="ml-auto text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {student.subjects.length} môn
                  </span>
                )}
              </div>
              {student.subjects && student.subjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {student.subjects.map((subject, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100 hover:border-purple-200 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg btn-gradient from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-110 transition-transform">
                          {subject.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{subject.name}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>Chưa có môn học nào</p>
                </div>
              )}
              {student.subjects && student.subjects.length > 0 && (
                <div className="mt-3 flex items-center justify-end text-xs text-slate-400">
                  <Award className="w-3 h-3 text-purple-400 mr-1" />
                  Tổng số: <span className="font-medium text-slate-600 ml-1">{student.subjects.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar Premium */}
          <div className="space-y-6">
            {/* Quick Stats Card - Premium Gradient */}
            <div className="btn-gradient from-purple-500 via-purple-600 to-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-purple-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <Users className="w-24 h-24" />
              </div>
              <div className="absolute -bottom-4 -left-4 opacity-10">
                <School className="w-16 h-16" />
              </div>
              <h4 className="text-xs font-medium uppercase tracking-wide opacity-80 mb-4 relative z-10">Tổng quan</h4>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm font-medium opacity-80">Ngày tham gia</span>
                  <span className="text-sm font-semibold">{formatDate(student.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm font-medium opacity-80">Trạng thái</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${student.status ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {student.status ? 'Đang học' : 'Ngưng học'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm font-medium opacity-80">Số môn học</span>
                  <span className="text-sm font-semibold">{student.subjects?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-80">Lớp học</span>
                  <span className="text-sm font-semibold">Lớp {student.grade}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};