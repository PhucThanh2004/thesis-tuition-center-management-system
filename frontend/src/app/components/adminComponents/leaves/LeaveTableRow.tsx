// src/app/components/adminComponents/leaves/LeaveTableRow.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  User,
  Eye,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { LeaveRequest } from '../../../utils/types/teacherLeave';

interface LeaveTableRowProps {
  leave: LeaveRequest;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

// ✅ Copy hàm getFullImageUrl từ TeacherDetailPage
const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_BACKEND_URL_IMAGE || import.meta.env.VITE_BACKEND_URL || '';
  const cleanBaseUrl = baseUrl.replace(/\/v1\/api$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${cleanBaseUrl}${path}`;
};

export const LeaveTableRow: React.FC<LeaveTableRowProps> = ({
  leave,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onViewDetail,
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Chờ duyệt':
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-600', 
          border: 'border-amber-200',
          dot: 'bg-amber-500',
          pulse: 'animate-pulse'
        };
      case 'Đã duyệt':
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-600', 
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
          pulse: ''
        };
      case 'Từ chối':
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-600', 
          border: 'border-red-200',
          dot: 'bg-red-500',
          pulse: ''
        };
      default:
        return { 
          bg: 'bg-slate-50', 
          text: 'text-slate-500', 
          border: 'border-slate-200',
          dot: 'bg-slate-400',
          pulse: ''
        };
    }
  };

  const getLeaveTypeConfig = (type: string) => {
    switch (type) {
      case 'Nghỉ phép năm':
        return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
      case 'Nghỉ ốm':
        return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
      case 'Việc riêng':
        return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const calculateDays = () => {
    if (leave.days) return leave.days;
    if (leave.startDate && leave.endDate) {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1;
    }
    return 1;
  };

  const handleRowClick = () => {
    navigate(`/admin/teacher/leave/${leave.id}`);
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const statusConfig = getStatusConfig(leave.status);
  const typeConfig = getLeaveTypeConfig(leave.leaveType);
  const days = calculateDays();
  const initials = getInitials(leave.teacherName);

  // ✅ Sử dụng getFullImageUrl giống TeacherDetailPage
  const avatarUrl = leave.avatar ? getFullImageUrl(leave.avatar) : null;
  const hasAvatar = leave.avatar && !imageError && avatarUrl;

  return (
    <>
      {/* Checkbox */}
      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(leave.id, e.target.checked)}
          className="rounded border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-200 focus:ring-offset-0 cursor-pointer transition-all"
        />
      </td>

      {/* Giáo viên */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            {hasAvatar ? (
              <img
                src={avatarUrl}
                alt={leave.teacherName}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
                <span className="text-sm font-semibold text-purple-600">{initials}</span>
              </div>
            )}
            {leave.status === 'Chờ duyệt' && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse ring-2 ring-white" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors">
              {leave.teacherName}
            </p>
            <p className="text-[10px] text-slate-400">{leave.department}</p>
          </div>
        </div>
      </td>

      {/* Mã GV */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
          {leave.teacherCode}
        </span>
      </td>

      {/* Loại nghỉ */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
          {leave.leaveType}
        </span>
      </td>

      {/* Ngày nghỉ */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="font-medium">{formatDate(leave.startDate)}</span>
          {leave.endDate && leave.endDate !== leave.startDate && (
            <>
              <span className="text-slate-300">→</span>
              <span className="font-medium">{formatDate(leave.endDate)}</span>
            </>
          )}
        </div>
      </td>

      {/* Số ngày */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-slate-700">{days}</span>
          <span className="text-xs text-slate-400">ngày</span>
        </div>
      </td>

      {/* Trạng thái */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${statusConfig.pulse}`} />
          {leave.status}
        </span>
      </td>

      {/* Hành động */}
      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-1">
          {leave.status === 'Chờ duyệt' ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(leave.id);
                }}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                title="Duyệt"
              >
                <Check className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(leave.id);
                }}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                title="Từ chối"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail?.(leave.id);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 flex items-center gap-1"
              title="Chi tiết"
            >
              <Eye className="w-4 h-4" />
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          )}
        </div>
      </td>
    </>
  );
};