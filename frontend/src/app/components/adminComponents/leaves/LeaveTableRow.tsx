// src/app/components/adminComponents/leaves/LeaveTableRow.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Mail,
  Calendar,
  Clock,
  User,
  Eye
} from 'lucide-react';
import type { LeaveRequest } from '../../../utils/types/teacherLeave';

interface LeaveTableRowProps {
  leave: LeaveRequest;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

export const LeaveTableRow: React.FC<LeaveTableRowProps> = ({
  leave,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onViewDetail,
}) => {
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Chờ duyệt':
        return 'bg-amber-50 text-amber-700';
      case 'Đã duyệt':
        return 'bg-emerald-50 text-emerald-700';
      case 'Từ chối':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Chờ duyệt':
        return 'bg-amber-500';
      case 'Đã duyệt':
        return 'bg-emerald-500';
      case 'Từ chối':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getLeaveTypeStyle = (type: string) => {
    switch (type) {
      case 'Nghỉ phép năm':
        return 'bg-blue-50 text-blue-700';
      case 'Nghỉ ốm':
        return 'bg-purple-50 text-purple-700';
      case 'Việc riêng':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
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
    console.log('Row clicked, navigating to:', `/admin/teacher/leave/${leave.id}`);
    navigate(`/admin/teacher/leave/${leave.id}`);
  };

  // Component này trả về các td, KHÔNG phải tr
  return (
    <>
      {/* Checkbox */}
      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(leave.id, e.target.checked)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
        />
      </td>

      {/* Giáo viên */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
            <User className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{leave.teacherName}</p>
            <p className="text-xs text-gray-400">{leave.department}</p>
          </div>
        </div>
      </td>

      {/* Mã GV */}
      <td className="px-4 py-3 text-gray-500 text-sm" onClick={handleRowClick}>
        {leave.teacherCode}
      </td>

      {/* Loại nghỉ */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeStyle(leave.leaveType)}`}>
          {leave.leaveType}
        </span>
      </td>

      {/* Ngày nghỉ */}
      <td className="px-4 py-3 text-gray-600 text-sm" onClick={handleRowClick}>
        {formatDate(leave.startDate)}
        {leave.endDate && leave.endDate !== leave.startDate && ` → ${formatDate(leave.endDate)}`}
      </td>

      {/* Số ngày */}
      <td className="px-4 py-3 text-gray-600 text-sm" onClick={handleRowClick}>
        {calculateDays()} ngày
      </td>

      {/* Trạng thái */}
      <td className="px-4 py-3" onClick={handleRowClick}>
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(leave.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(leave.status)}`} />
          {leave.status}
        </span>
      </td>

      {/* Hành động */}
      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-1">
          {leave.status === 'Chờ duyệt' ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(leave.id);
                }}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Duyệt"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(leave.id);
                }}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                title="Từ chối"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail?.(leave.id);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              title="Chi tiết"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </>
  );
};