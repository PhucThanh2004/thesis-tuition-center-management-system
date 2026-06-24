// src/components/adminComponents/leaves/teacher/LeaveDetailModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Calendar,
  Clock,
  User,
  Hash,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  BookOpen,
  MapPin,
  Users,
  Edit,
  AlertCircle,
  MessageSquare,
  Loader2,
  Award,
  CalendarDays,
  Shield,
  UserCheck,
  Mail
} from 'lucide-react';
import type { TeacherLeave } from '../../../../utils/types/teacherLeave';
import { teacherLeaveApi } from '../../../../utils/api/teacherLeave.api';

interface LeaveDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: TeacherLeave | null;
  loading: boolean;
  onEdit?: (id: number) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return {
        label: 'Đã phê duyệt',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle,
        iconColor: 'text-emerald-500',
        dotColor: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-700'
      };
    case 'PENDING':
      return {
        label: 'Chờ duyệt',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: ClockIcon,
        iconColor: 'text-amber-500',
        dotColor: 'bg-amber-500 animate-pulse',
        badge: 'bg-amber-100 text-amber-700'
      };
    case 'REJECTED':
      return {
        label: 'Từ chối',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: XCircle,
        iconColor: 'text-rose-500',
        dotColor: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-700'
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        bg: 'bg-gray-50',
        text: 'text-gray-500',
        border: 'border-gray-200',
        icon: XCircle,
        iconColor: 'text-gray-400',
        dotColor: 'bg-gray-400',
        badge: 'bg-gray-100 text-gray-500'
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-50',
        text: 'text-gray-500',
        border: 'border-gray-200',
        icon: AlertCircle,
        iconColor: 'text-gray-400',
        dotColor: 'bg-gray-400',
        badge: 'bg-gray-100 text-gray-500'
      };
  }
};

const getTypeConfig = (type: string) => {
  const configs: Record<string, { label: string; color: string; icon: any }> = {
    SICK: { label: 'Nghỉ ốm (BHXH)', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: FileText },
    ANNUAL: { label: 'Nghỉ phép năm', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: Award },
    PERSONAL: { label: 'Việc riêng', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: User },
    UNPAID: { label: 'Nghỉ không lương', color: 'bg-gray-50 text-gray-500 border-gray-200', icon: XCircle },
    OTHER: { label: 'Khác', color: 'bg-purple-50 text-purple-600 border-purple-200', icon: FileText },
  };
  return configs[type] || configs['OTHER'];
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return '';
  return timeStr.substring(0, 5);
};

const cleanDisplayName = (name: string): string => {
  if (!name) return 'Chưa cập nhật';
  let cleaned = name;
  const patternsToRemove = [
    /com\.management\.student_center\.entity\.\w+(\$HibernateProxy)?/gi,
    /com\.management\.student_center\.dto\.\w+/gi,
    /\.entity\.\w+(\$HibernateProxy)?/gi,
    /\$HibernateProxy/gi,
    /HibernateProxy/gi,
  ];
  for (const pattern of patternsToRemove) {
    cleaned = cleaned.replace(pattern, '');
  }
  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ');
    cleaned = parts[parts.length - 1];
  }
  cleaned = cleaned.trim();
  if (!cleaned || cleaned.length === 0 || cleaned === '-') {
    return 'Chưa cập nhật';
  }
  return cleaned;
};

const parseReasonAndComment = (reason: string): { mainReason: string; adminComment: string } => {
  if (!reason) return { mainReason: '', adminComment: '' };
  const adminPattern = /\[(ADMIN|Admin|admin)\]\s*:\s*/;
  const match = reason.match(adminPattern);
  if (match) {
    const parts = reason.split(adminPattern);
    const mainReason = parts[0]?.trim() || '';
    const adminComment = parts[2]?.trim() || '';
    return { mainReason, adminComment };
  }
  if (reason.includes(' - ')) {
    const parts = reason.split(' - ');
    if (parts.length >= 2) {
      return { mainReason: parts[0], adminComment: parts.slice(1).join(' - ') };
    }
  }
  if (reason.includes(': ')) {
    const firstColon = reason.indexOf(': ');
    if (firstColon !== -1) {
      return {
        mainReason: reason.substring(0, firstColon),
        adminComment: reason.substring(firstColon + 2)
      };
    }
  }
  return { mainReason: reason, adminComment: '' };
};

export const LeaveDetailModal = ({ isOpen, onClose, leave, loading, onEdit }: LeaveDetailModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mergedSessions, setMergedSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const fetchAndMergeSessions = async () => {
      if (!leave?.id) return;
      setLoadingSessions(true);
      try {
        const statusSessions = await teacherLeaveApi.getAffectedSessions(leave.id);
        const detailSessions = leave.affectedSessions || [];
        const statusMap = new Map();
        statusSessions.forEach((session: any) => {
          statusMap.set(session.sessionId, session);
        });
        const merged = detailSessions.map((detail: any) => {
          const statusData = statusMap.get(detail.sessionId);
          return {
            ...detail,
            status: statusData?.status || detail.status || 'PENDING',
            replacementTeacherName: statusData?.replacementTeacherName || detail.replacementTeacherName || null,
            replacementTeacherId: statusData?.replacementTeacherId || detail.replacementTeacherId || null,
          };
        });
        setMergedSessions(merged);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setMergedSessions(leave.affectedSessions || []);
      } finally {
        setLoadingSessions(false);
      }
    };
    if (isOpen && leave) {
      fetchAndMergeSessions();
    }
  }, [isOpen, leave]);

  const statusConfig = leave ? getStatusConfig(leave.status) : getStatusConfig('');
  const StatusIcon = statusConfig.icon;
  const typeConfig = leave ? getTypeConfig(leave.leaveType) : getTypeConfig('OTHER');
  const TypeIcon = typeConfig.icon;
  const affectedSessionsCount = leave?.affectedSessions?.length || 0;
  const isSameDay = leave?.startDate === leave?.endDate;
  const { mainReason, adminComment } = parseReasonAndComment(leave?.reason || '');

  const getSessionStatusDisplay = (session: any) => {
    const status = session.status;
    const cleanReplacement = cleanDisplayName(session.replacementTeacherName || '');
    
    switch (status) {
      case 'RESOLVED':
        return {
          color: 'bg-emerald-50 border-emerald-200',
          text: cleanReplacement ? `Đã phân công: ${cleanReplacement}` : 'Đã có GV thay thế',
          icon: <CheckCircle size={12} className="text-emerald-600" />,
          badge: 'bg-emerald-100 text-emerald-700'
        };
      case 'PENDING':
        return {
          color: 'bg-amber-50 border-amber-200',
          text: 'Đang chờ phản hồi',
          icon: <ClockIcon size={12} className="text-amber-500 animate-pulse" />,
          badge: 'bg-amber-100 text-amber-700'
        };
      case 'SKIPPED':
        return {
          color: 'bg-gray-50 border-gray-200',
          text: 'Đã hủy',
          icon: <XCircle size={12} className="text-gray-500" />,
          badge: 'bg-gray-100 text-gray-500'
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-200',
          text: 'Đã xử lý',
          icon: <CheckCircle size={12} className="text-gray-500" />,
          badge: 'bg-gray-100 text-gray-500'
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 0.4 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: isVisible ? 0 : '100%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header - Clean, không có print/share */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X size={16} className="text-slate-400" />
                </button>
                <h3 className="text-sm font-semibold text-slate-800">Chi tiết đơn nghỉ</h3>
              </div>
              {leave?.status === 'PENDING' && onEdit && (
                <button
                  onClick={() => onEdit(leave.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-xs font-medium hover:bg-purple-100 transition-all"
                >
                  <Edit size={14} />
                  Chỉnh sửa
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="h-8 w-8 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-xs text-slate-400">Đang tải thông tin...</p>
                </div>
              ) : !leave ? (
                <div className="text-center py-12">
                  <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Không tìm thấy thông tin</p>
                </div>
              ) : (
                <>
                  {/* Status & Type Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                        <StatusIcon size={10} className={statusConfig.iconColor} />
                        {statusConfig.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${typeConfig.color}`}>
                        <TypeIcon size={10} />
                        {typeConfig.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ClockIcon size={10} />
                      {formatDateTime(leave.createdAt)}
                    </span>
                  </div>

                  {/* Teacher Info Card - Bỏ mã GV */}
                  <div className="bg-gradient-to-br from-purple-50/50 to-white rounded-xl p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 shadow-sm">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{leave.teacherName}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                          <span className="flex items-center gap-0.5">
                            <Mail size={10} />
                            {leave.teacherEmail}
                          </span>
                        </div>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                        <Shield size={12} className="text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Info Grid - Bỏ các thông tin mã */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                        <Calendar size={12} />
                        Thời gian
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {formatDate(leave.startDate)}
                        {!isSameDay && (
                          <span className="text-slate-400 text-xs"> → {formatDate(leave.endDate)}</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                        <Clock size={12} />
                        Giờ nghỉ
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {leave.startTime && leave.endTime
                          ? `${formatTime(leave.startTime)} - ${formatTime(leave.endTime)}`
                          : 'Cả ngày'}
                      </p>
                    </div>
                    <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                        <BookOpen size={12} />
                        Buổi học
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {affectedSessionsCount} buổi
                      </p>
                    </div>
                    {leave.approverName && (
                      <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                          <UserCheck size={12} />
                          Người duyệt
                        </div>
                        <p className="text-sm font-medium text-slate-700">{leave.approverName}</p>
                      </div>
                    )}
                  </div>

                  {/* Reason Card */}
                  {mainReason && (
                    <div className="relative bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border border-blue-100 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/30 rounded-full blur-xl -translate-y-1/2 translate-x-1/3" />
                      <div className="relative">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wide mb-1.5">
                          <FileText size={12} className="text-blue-500" />
                          Lý do nghỉ
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed italic">"{mainReason}"</p>
                      </div>
                    </div>
                  )}

                  {/* Admin Comment */}
                  {adminComment && (leave.status === 'APPROVED' || leave.status === 'REJECTED') && (
                    <div className={`rounded-xl p-4 border ${
                      leave.status === 'APPROVED'
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-rose-50/70 border-rose-200'
                    }`}>
                      <div className="flex items-start gap-2.5">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                          leave.status === 'APPROVED' ? 'bg-amber-100' : 'bg-rose-100'
                        }`}>
                          <MessageSquare size={13} className={
                            leave.status === 'APPROVED' ? 'text-amber-600' : 'text-rose-600'
                          } />
                        </div>
                        <div className="flex-1">
                          <p className={`text-[10px] font-medium uppercase tracking-wide ${
                            leave.status === 'APPROVED' ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {leave.status === 'APPROVED' ? 'Ghi chú từ người duyệt' : 'Lý do từ chối'}
                          </p>
                          <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{adminComment}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Affected Sessions - Hiển thị đầy đủ tên giáo viên thay thế */}
                  {leave.status === 'APPROVED' && mergedSessions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={15} className="text-purple-500" />
                          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Buổi học bị ảnh hưởng
                          </h4>
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            {mergedSessions.length}
                          </span>
                        </div>
                        {loadingSessions && <Loader2 size={13} className="animate-spin text-purple-500" />}
                      </div>

                      <div className="space-y-2">
                        {mergedSessions.map((session: any, idx: number) => {
                          const cleanSubjectName = cleanDisplayName(session.subjectName);
                          const cleanRoomName = cleanDisplayName(session.roomName || '');
                          const cleanClassName = cleanDisplayName(session.className || '');
                          const sessionDisplay = getSessionStatusDisplay(session);

                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              className={`p-3 rounded-lg border ${sessionDisplay.color} transition-all hover:shadow-sm`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 flex-shrink-0">
                                    <span className="text-[9px] font-bold text-purple-600">#{idx + 1}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700">{cleanSubjectName}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                      <span className="flex items-center gap-0.5">
                                        <Clock size={10} />
                                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                      </span>
                                      {cleanRoomName && (
                                        <>
                                          <span className="w-px h-2 bg-slate-200" />
                                          <span className="flex items-center gap-0.5">
                                            <MapPin size={10} />
                                            {cleanRoomName}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    {cleanClassName && cleanClassName !== 'Chưa cập nhật' && (
                                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                        <Users size={10} />
                                        <span>Lớp: {cleanClassName}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium ${sessionDisplay.badge} whitespace-nowrap flex-shrink-0`}>
                                  {sessionDisplay.icon}
                                  {sessionDisplay.text}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Status Info Cards */}
                  {leave.status === 'APPROVED' && leave.approvedAt && (
                    <div className="bg-gradient-to-br from-emerald-50/70 to-white rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                          <CheckCircle size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-emerald-700">Đã được phê duyệt</p>
                          <p className="text-xs text-emerald-600">
                            Bởi {leave.approverName || 'Admin'} • {formatDateTime(leave.approvedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {leave.status === 'REJECTED' && (
                    <div className="bg-gradient-to-br from-rose-50/70 to-white rounded-xl p-4 border border-rose-100">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100">
                          <XCircle size={16} className="text-rose-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-rose-700">Đã bị từ chối</p>
                          <p className="text-xs text-rose-600">
                            Bởi {leave.approverName || 'Admin'} • {leave.approvedAt ? formatDateTime(leave.approvedAt) : 'Chưa có thông tin'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {leave.status === 'CANCELLED' && (
                    <div className="bg-gradient-to-br from-gray-50/70 to-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                          <XCircle size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Đã bị hủy</p>
                          <p className="text-xs text-gray-500">Đơn nghỉ đã bị hủy bởi giáo viên</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sticky Footer - Clean */}
            <div className="px-5 py-4 border-t border-slate-100 bg-white/95 backdrop-blur-sm">
              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium shadow-sm shadow-purple-200 hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <X size={15} />
                Đóng
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};