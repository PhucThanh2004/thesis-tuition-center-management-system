// src/components/adminComponents/leaves/teacher/TeacherLeaveTableRow.tsx
import { motion } from 'framer-motion';
import { Eye, X, CalendarClock, CheckCircle, AlertCircle, Clock, UserCheck, FileCheck, MessageSquare, Loader2 } from 'lucide-react';
import type { TeacherLeave } from '../../../../utils/types/teacherLeave';
import { useEffect, useState } from 'react';
import { teacherLeaveApi } from '../../../../utils/api/teacherLeave.api';

interface TeacherLeaveTableRowProps {
  leave: TeacherLeave;
  onViewDetail: (id: number) => void;
  onCancel?: (id: number) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Chờ duyệt',
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        icon: Clock,
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-600'
      };
    case 'APPROVED':
      return {
        label: 'Đã duyệt',
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle,
        badgeBg: 'bg-green-50',
        badgeText: 'text-green-600'
      };
    case 'REJECTED':
      return {
        label: 'Từ chối',
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: AlertCircle,
        badgeBg: 'bg-red-50',
        badgeText: 'text-red-600'
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: X,
        badgeBg: 'bg-gray-50',
        badgeText: 'text-gray-500'
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: AlertCircle,
        badgeBg: 'bg-gray-50',
        badgeText: 'text-gray-500'
      };
  }
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, { label: string; color: string; bg: string }> = {
    SICK: { label: 'Nghỉ ốm', color: 'text-blue-700', bg: 'bg-blue-50' },
    ANNUAL: { label: 'Nghỉ phép năm', color: 'text-purple-700', bg: 'bg-purple-50' },
    PERSONAL: { label: 'Việc riêng', color: 'text-amber-700', bg: 'bg-amber-50' },
    UNPAID: { label: 'Nghỉ không lương', color: 'text-gray-700', bg: 'bg-gray-100' },
    OTHER: { label: 'Khác', color: 'text-slate-700', bg: 'bg-slate-100' },
  };
  return labels[type] || { label: type, color: 'text-gray-700', bg: 'bg-gray-100' };
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return '';
  return timeStr.substring(0, 5);
};

// Hàm tách lý do nghỉ và comment của admin
const splitReasonAndComment = (reason: string): { originalReason: string; adminComment: string | null } => {
  if (!reason) return { originalReason: '', adminComment: null };

  // Tìm pattern [ADMIN]: hoặc (ADMIN): hoặc ADMIN:
  const adminPattern = /\[ADMIN\]:\s*|\(ADMIN\):\s*|ADMIN:\s*/i;
  const match = reason.match(adminPattern);

  if (match) {
    const index = match.index!;
    const originalReason = reason.substring(0, index).trim();
    const adminComment = reason.substring(index + match[0].length).trim();
    return { originalReason, adminComment };
  }

  return { originalReason: reason, adminComment: null };
};

// Helper để tính toán bước tiến độ dựa trên status
const getTimelineSteps = (status: string, approvedAt?: string) => {
  const steps = [
    { key: 'submitted', label: 'Đã gửi đơn', icon: FileCheck },
    { key: 'processing', label: 'Admin xử lý', icon: UserCheck },
    { key: 'completed', label: 'Hoàn tất', icon: CheckCircle },
  ];

  let currentStep = 0;
  switch (status) {
    case 'PENDING':
      currentStep = 1;
      break;
    case 'APPROVED':
    case 'REJECTED':
    case 'CANCELLED':
      currentStep = 2;
      break;
    default:
      currentStep = 0;
  }

  return { steps, currentStep };
};

export const TeacherLeaveTableRow = ({ leave, onViewDetail, onCancel }: TeacherLeaveTableRowProps) => {
  const statusConfig = getStatusConfig(leave.status);
  const StatusIcon = statusConfig.icon;
  const isPending = leave.status === 'PENDING';
  const isApproved = leave.status === 'APPROVED';
  const isRejected = leave.status === 'REJECTED';
  const typeInfo = getTypeLabel(leave.leaveType);
  const startDate = new Date(leave.startDate);
  const endDate = new Date(leave.endDate);
  const isSameDay = leave.startDate === leave.endDate;

  const { steps, currentStep } = getTimelineSteps(leave.status, leave.approvedAt);

  // TÍNH SỐ BUỔI HỌC BỊ ẢNH HƯỞNG - Lấy từ affectedSessions
  const [affectedCount, setAffectedCount] = useState<number>(0);
  const [loadingCount, setLoadingCount] = useState<boolean>(false);
  // Tách lý do nghỉ và comment admin
  const { originalReason, adminComment } = splitReasonAndComment(leave.reason || '');
  useEffect(() => {
    const fetchAffectedCount = async () => {
      // Nếu đã có trong leave thì dùng luôn
      if (leave.affectedSessions && leave.affectedSessions.length > 0) {
        setAffectedCount(leave.affectedSessions.length);
        return;
      }

      // Nếu có trường affectedSessionsCount (nếu backend thêm)
      if ((leave as any).affectedSessionsCount !== undefined) {
        setAffectedCount((leave as any).affectedSessionsCount);
        return;
      }

      // Nếu không, gọi API riêng
      setLoadingCount(true);
      try {
        const sessions = await teacherLeaveApi.getAffectedSessions(leave.id);
        setAffectedCount(sessions.length);
      } catch (error) {
        console.error(`Failed to get affected sessions for leave ${leave.id}:`, error);
        setAffectedCount(0);
      } finally {
        setLoadingCount(false);
      }
    };

    fetchAffectedCount();
  }, [leave.id, leave.affectedSessions]);
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left content */}
        <div className="flex-1 space-y-4">
          {/* Header with type and status */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className={`${typeInfo.bg} ${typeInfo.color} px-3 py-1 rounded-lg text-xs font-bold uppercase`}>
                {typeInfo.label}
              </span>
              <span className="text-gray-400 text-xs font-mono">Mã đơn: #{leave.id}</span>
            </div>
            <div className={`${statusConfig.bg} ${statusConfig.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5`}>
              <StatusIcon size={14} />
              {statusConfig.label}
            </div>
          </div>

          {/* Date and reason info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left column: Date & Reason */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold uppercase text-gray-500">
                    Tháng {startDate.getMonth() + 1}
                  </span>
                  <span className="text-xl font-black text-gray-800 leading-none">{startDate.getDate()}</span>
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-800 text-sm">
                    {formatDate(leave.startDate)}
                    {!isSameDay && ` - ${formatDate(leave.endDate)}`}
                  </p>
                  {(leave.startTime || leave.endTime) && (
                    <p className="text-gray-500 text-xs">
                      {formatTime(leave.startTime)} - {formatTime(leave.endTime)}
                      {!leave.endTime && leave.startTime && ` (${leave.startTime})`}
                    </p>
                  )}
                </div>
              </div>

              {/* Lý do nghỉ - chỉ hiển thị lý do gốc */}
              {originalReason && (
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Lý do nghỉ</p>
                  <p className="text-gray-700 text-sm italic leading-relaxed">
                    "{originalReason}"
                  </p>
                </div>
              )}

              {/* Comment của admin - nếu có */}
              {adminComment && isApproved && (
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare size={12} className="text-blue-500" />
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Phản hồi từ Admin</p>
                  </div>
                  <p className="text-gray-700 text-sm">
                    "{adminComment}"
                  </p>
                </div>
              )}
            </div>

            {/* Right column: Affected sessions & Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarClock size={16} />
                <span className="text-xs font-semibold">
                  Số buổi bị ảnh hưởng:{' '}
                  {loadingCount ? (
                    <Loader2 size={14} className="inline animate-spin text-purple-500 ml-1" />
                  ) : (
                    <span className="text-gray-800">{affectedCount} buổi</span>
                  )}
                </span>
              </div>

              {/* Timeline / Tiến độ xử lý */}
              <div className="pt-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">Tiến độ xử lý</p>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 rounded-full" />
                  <div
                    className="absolute top-3 left-0 h-0.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentStep / (steps.length - 1)) * 100}%`,
                      backgroundColor: isRejected ? '#ef4444' : (isApproved ? '#22c55e' : '#8b5cf6')
                    }}
                  />

                  {/* Timeline steps */}
                  <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const StepIcon = step.icon;
                      const isCurrentStep = index === currentStep && isPending;

                      return (
                        <div key={step.key} className="flex flex-col items-center gap-1.5" style={{ width: `${100 / steps.length}%` }}>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isCompleted
                              ? isRejected
                                ? 'bg-red-500 text-white'
                                : isApproved
                                  ? 'bg-green-500 text-white'
                                  : 'bg-purple-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                              }`}
                          >
                            {isCompleted ? (
                              <CheckCircle size={14} className="text-white" />
                            ) : (
                              <StepIcon size={14} />
                            )}
                          </div>
                          <span className={`text-[9px] font-bold text-center ${isCompleted
                            ? isRejected
                              ? 'text-red-600'
                              : isApproved
                                ? 'text-green-600'
                                : 'text-purple-600'
                            : 'text-gray-400'
                            }`}>
                            {step.label}
                          </span>
                          {isCurrentStep && (
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Additional info for rejected */}
              {isRejected && leave.approverName && (
                <div className="text-xs text-gray-500 bg-red-50 p-2 rounded-lg">
                  <span className="font-semibold">Lý do từ chối:</span> {adminComment || leave.reason || 'Không phù hợp với lịch giảng dạy'}
                </div>
              )}

              {/* Additional info for approved */}
              {isApproved && leave.approverName && (
                <div className="text-xs text-gray-500 bg-green-50 p-2 rounded-lg">
                  <span className="font-semibold">Người duyệt:</span> {leave.approverName}
                  {leave.approvedAt && ` · ${new Date(leave.approvedAt).toLocaleDateString('vi-VN')}`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-row lg:flex-col justify-end gap-2 lg:border-l border-gray-100 lg:pl-4">
          <button
            onClick={() => onViewDetail(leave.id)}
            className="flex-1 lg:flex-none px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-semibold text-xs hover:bg-purple-100 transition-all flex items-center justify-center gap-1.5"
          >
            <Eye size={14} />
            Chi tiết
          </button>
          {isPending && (
            <button
              onClick={() => onCancel?.(leave.id)}
              className="flex-1 lg:flex-none px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <X size={14} />
              Hủy đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};