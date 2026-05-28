// src/components/adminComponents/leaves/teacher/LeaveDetailModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  Share2,
  Download,
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
  Eye,
  File,
  AlertCircle,
  MessageSquare,
  Loader2
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
        iconColor: 'text-emerald-500'
      };
    case 'PENDING':
      return {
        label: 'Chờ duyệt',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: ClockIcon,
        iconColor: 'text-amber-500'
      };
    case 'REJECTED':
      return {
        label: 'Từ chối',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: XCircle,
        iconColor: 'text-rose-500'
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        bg: 'bg-gray-50',
        text: 'text-gray-500',
        border: 'border-gray-200',
        icon: XCircle,
        iconColor: 'text-gray-400'
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-50',
        text: 'text-gray-500',
        border: 'border-gray-200',
        icon: AlertCircle,
        iconColor: 'text-gray-400'
      };
  }
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    SICK: 'Nghỉ ốm (Có BHXH)',
    ANNUAL: 'Nghỉ phép năm',
    PERSONAL: 'Nghỉ việc riêng',
    UNPAID: 'Nghỉ không lương',
    OTHER: 'Khác',
  };
  return labels[type] || type;
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

  // Loại bỏ tất cả các pattern Hibernate/Java package
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

  // Xử lý dấu " - " và lấy phần cuối
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

// Hàm tách lý do nghỉ và comment của admin
const parseReasonAndComment = (reason: string): { mainReason: string; adminComment: string } => {
  if (!reason) return { mainReason: '', adminComment: '' };

  // Tìm pattern [ADMIN]: hoặc [Admin]: hoặc (ADMIN):
  const adminPattern = /\[(ADMIN|Admin|admin)\]\s*:\s*/;
  const match = reason.match(adminPattern);

  if (match) {
    const parts = reason.split(adminPattern);
    // parts[0] là lý do chính, parts[2] là comment admin
    const mainReason = parts[0]?.trim() || '';
    const adminComment = parts[2]?.trim() || '';
    return { mainReason, adminComment };
  }

  // Nếu không có pattern, kiểm tra dấu " - " hoặc " : "
  if (reason.includes(' - ')) {
    const parts = reason.split(' - ');
    if (parts.length >= 2) {
      // Giả sử phần đầu là lý do, phần sau là comment
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

  // Kết hợp dữ liệu từ leave.affectedSessions (thông tin chi tiết) và API (trạng thái)
  useEffect(() => {
    const fetchAndMergeSessions = async () => {
      if (!leave?.id) return;

      setLoadingSessions(true);
      try {
        // Lấy dữ liệu trạng thái từ API
        const statusSessions = await teacherLeaveApi.getAffectedSessions(leave.id);
        console.log('Status sessions from API:', statusSessions);

        // Lấy dữ liệu chi tiết từ leave.affectedSessions
        const detailSessions = leave.affectedSessions || [];
        console.log('Detail sessions from leave:', detailSessions);

        // Tạo map để tra cứu nhanh trạng thái theo sessionId
        const statusMap = new Map();
        statusSessions.forEach((session: any) => {
          statusMap.set(session.sessionId, session);
        });

        // Merge dữ liệu: lấy chi tiết từ detailSessions, trạng thái từ statusMap
        const merged = detailSessions.map((detail: any) => {
          const statusData = statusMap.get(detail.sessionId);
          return {
            ...detail, // Giữ nguyên thông tin chi tiết (subjectName, roomName, startTime, endTime)
            status: statusData?.status || detail.status || 'PENDING',
            replacementTeacherName: statusData?.replacementTeacherName || detail.replacementTeacherName || null,
            replacementTeacherId: statusData?.replacementTeacherId || detail.replacementTeacherId || null,
          };
        });

        console.log('Merged sessions:', merged);
        setMergedSessions(merged);

      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        // Fallback: chỉ dùng dữ liệu từ leave.affectedSessions
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

  // Số buổi bị ảnh hưởng = số lượng affectedSessions (chính xác)
  const affectedSessionsCount = leave?.affectedSessions?.length || 0;

  const isSameDay = leave?.startDate === leave?.endDate;

  // Parse lý do nghỉ
  const { mainReason, adminComment } = parseReasonAndComment(leave?.reason || '');

  // Hàm xử lý in
  const handlePrint = () => {
    window.print();
  };

  // Hàm xử lý share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Đơn nghỉ #${leave?.id}`,
        text: mainReason,
        url: window.location.href,
      });
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
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
                <h3 className="text-xl font-bold text-gray-800">Chi tiết đơn nghỉ</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handlePrint}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500"
                >
                  <Printer size={18} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600" />
                </div>
              ) : !leave ? (
                <div className="text-center py-12">
                  <AlertCircle size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không tìm thấy thông tin đơn nghỉ</p>
                </div>
              ) : (
                <>
                  {/* Status Badge & Created Date */}
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                      <StatusIcon size={16} className={statusConfig.iconColor} />
                      {statusConfig.label}
                    </div>
                    <span className="text-xs text-gray-400">
                      Tạo ngày: {formatDateTime(leave.createdAt)}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Loại nghỉ</p>
                      <p className="font-semibold text-gray-800">{getTypeLabel(leave.leaveType)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Mã đơn</p>
                      <p className="font-semibold text-gray-800 font-mono">#{leave.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Thời gian</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(leave.startDate)}
                        {!isSameDay && ` → ${formatDate(leave.endDate)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Giờ nghỉ</p>
                      <p className="font-semibold text-gray-800">
                        {leave.startTime && leave.endTime
                          ? `${formatTime(leave.startTime)} - ${formatTime(leave.endTime)}`
                          : 'Cả ngày'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Buổi học ảnh hưởng</p>
                      <p className="font-semibold text-gray-800">{affectedSessionsCount} buổi</p>
                    </div>
                    {leave.approverName && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Người duyệt</p>
                        <p className="font-semibold text-gray-800">{leave.approverName}</p>
                      </div>
                    )}
                  </div>

                  {/* Main Reason */}
                  {mainReason && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <FileText size={12} />
                        Lý do nghỉ
                      </p>
                      <p className="text-gray-700 leading-relaxed italic">"{mainReason}"</p>
                    </div>
                  )}

                  {/* Admin Comment (if exists) */}
                  {adminComment && (leave.status === 'APPROVED' || leave.status === 'REJECTED') && (
                    <div className={`p-4 rounded-xl border ${leave.status === 'APPROVED'
                      ? 'bg-amber-50 border-amber-100'
                      : 'bg-rose-50 border-rose-100'
                      }`}>
                      <p className={`text-xs uppercase tracking-wider mb-2 flex items-center gap-1 ${leave.status === 'APPROVED' ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                        <MessageSquare size={12} />
                        {leave.status === 'APPROVED' ? 'Ghi chú từ Ban Giám Đốc' : 'Lý do từ chối'}
                      </p>
                      <p className="text-gray-700 leading-relaxed">{adminComment}</p>
                    </div>
                  )}

                  {/* Affected Sessions */}
                  {leave.status === 'APPROVED' && mergedSessions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen size={18} className="text-purple-600" />
                        Buổi học bị ảnh hưởng ({mergedSessions.length})
                        {loadingSessions && <Loader2 size={14} className="animate-spin text-purple-500 ml-2" />}
                      </h4>
                      <div className="space-y-3">
                        {mergedSessions.map((session: any, idx: number) => {
                          const cleanSubjectName = cleanDisplayName(session.subjectName);
                          const cleanRoomName = cleanDisplayName(session.roomName || '');
                          const cleanClassName = cleanDisplayName(session.className || '');
                          const cleanReplacementTeacher = cleanDisplayName(session.replacementTeacherName || '');

                          const sessionStatus = session.status;

                          let statusColor = '';
                          let statusText = '';
                          let statusIcon = null;

                          if (sessionStatus === 'RESOLVED') {
                            statusColor = 'bg-green-50 border-green-200';
                            statusText = `✅ Đã phân công: ${cleanReplacementTeacher || 'Đã có GV thay thế'}`;
                            statusIcon = <CheckCircle size={12} className="text-green-600" />;
                          }
                          else if (sessionStatus === 'PENDING') {
                            statusColor = 'bg-amber-50 border-amber-200';
                            statusText = '⏳ Đang chờ giáo viên thay thế phản hồi';
                            statusIcon = <ClockIcon size={12} className="text-amber-500" />;
                          }
                          else if (sessionStatus === 'SKIPPED') {
                            statusColor = 'bg-gray-50 border-gray-200';
                            statusText = '📌 Buổi học đã được nghỉ (hủy)';
                            statusIcon = <XCircle size={12} className="text-gray-500" />;
                          }
                          else {
                            statusColor = 'bg-gray-50 border-gray-200';
                            statusText = 'Đã xử lý';
                            statusIcon = <CheckCircle size={12} className="text-gray-500" />;
                          }

                          return (
                            <div key={idx} className={`p-4 rounded-xl border transition-all ${statusColor}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold text-purple-600 uppercase">Buổi</span>
                                    <span className="text-sm font-bold text-purple-700">{idx + 1}</span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800">{cleanSubjectName}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {formatTime(session.startTime)} - {formatTime(session.endTime)} • {cleanRoomName}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-1.5">
                                    {statusIcon}
                                    <span className="text-xs font-medium whitespace-nowrap">{statusText}</span>
                                  </div>
                                </div>
                              </div>
                              {cleanClassName && cleanClassName !== 'Chưa cập nhật' && (
                                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                                  <Users size={12} />
                                  <span>Lớp: {cleanClassName}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Approve Info - CHỈ KHI ĐƠN ĐƯỢC DUYỆT */}
                  {leave.status === 'APPROVED' && leave.approvedAt && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-emerald-600" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">Đã được phê duyệt</p>
                          <p className="text-xs text-emerald-600">
                            Bởi {leave.approverName || 'Admin'} vào lúc {formatDateTime(leave.approvedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reject Info - CHỈ KHI ĐƠN BỊ TỪ CHỐI */}
                  {leave.status === 'REJECTED' && (
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                      <div className="flex items-center gap-3">
                        <XCircle size={20} className="text-rose-600" />
                        <div>
                          <p className="text-sm font-semibold text-rose-800">Đã bị từ chối</p>
                          <p className="text-xs text-rose-600">
                            Bởi {leave.approverName || 'Admin'} vào lúc {leave.approvedAt ? formatDateTime(leave.approvedAt) : 'Chưa có thông tin'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancelled Info - CHỈ KHI ĐƠN BỊ HỦY */}
                  {leave.status === 'CANCELLED' && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <XCircle size={20} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Đã bị hủy</p>
                          <p className="text-xs text-gray-500">
                            Đơn nghỉ đã bị hủy bởi giáo viên
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sticky Footer */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                      {leave?.status === 'PENDING' && onEdit && (
                        <button
                          onClick={() => onEdit(leave.id)}
                          className="flex-1 py-3 bg-gray-100 text-purple-600 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit size={18} />
                          Chỉnh sửa đơn
                        </button>
                      )}

                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 btn-gradient from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all shadow-md"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};