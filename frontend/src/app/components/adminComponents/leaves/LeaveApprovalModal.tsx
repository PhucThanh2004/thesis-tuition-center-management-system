import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  FileText,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  XCircle,
  CheckCircle,
  DollarSign,
} from 'lucide-react';
import { teacherLeaveApi } from '../../../utils/api/teacherLeave.api';
import type { PreviewAffectedSessionResponse, ReplacementWithSalary } from '../../../utils/types/teacherLeave';

interface LeaveApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveId: number;
  teacherName: string;
  teacherAvatar?: string;
  leaveDate: string;
  reason: string;
  affectedSessions: PreviewAffectedSessionResponse[];
  onApprove: (options: {
    approvalType: 'full_leave' | 'flexible';
    replacements: ReplacementWithSalary[];  
    cancelledSessions: string[];
    comment: string;
  }) => void;
  onReject?: () => void;
  isSubmitting?: boolean;
}

// Interface cho dữ liệu replacement trong state
interface ReplacementData {
  teacherId: string;
  salary: string;
}

export const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  isOpen,
  onClose,
  leaveId,
  teacherName,
  teacherAvatar,
  leaveDate,
  reason,
  affectedSessions,
  onApprove,
  onReject,
  isSubmitting = false,
}) => {
  const [approvalType, setApprovalType] = useState<'full_leave' | 'flexible'>('full_leave');
  const [replacements, setReplacements] = useState<Record<string, ReplacementData>>({});
  const [cancelledSessions, setCancelledSessions] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [availableTeachersMap, setAvailableTeachersMap] = useState<Record<string, any[]>>({});
  const [loadingTeachers, setLoadingTeachers] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const totalSessions = affectedSessions.length;
  
  // Đếm số buổi đã được xử lý (thay thế hoặc hủy)
  const processedSessions = Object.keys(replacements).filter(
    id => replacements[id]?.teacherId && replacements[id].teacherId !== ''
  ).length + cancelledSessions.length;
  const isFlexibleIncomplete = approvalType === 'flexible' && totalSessions > 0 && processedSessions !== totalSessions;

  // 👉 Cập nhật: lưu cả teacherId và salary
  const handleReplaceChange = (sessionId: string, teacherId: string, salary?: string) => {
    setReplacements((prev) => ({
      ...prev,
      [sessionId]: {
        teacherId,
        salary: salary || '',
      },
    }));
    // Nếu đã chọn giáo viên, loại khỏi danh sách hủy nếu có
    if (teacherId && teacherId !== '') {
      setCancelledSessions(prev => prev.filter(id => id !== sessionId));
    }
  };

  // 👉 Cập nhật: khi chọn teacher, tự động set salary mặc định
  const handleTeacherSelect = (sessionId: string, teacherId: string) => {
    const teachers = availableTeachersMap[sessionId] || [];
    const selectedTeacher = teachers.find(t => String(t.teacherId) === teacherId);
    const defaultSalary = selectedTeacher?.defaultSalary?.toString() || '';
    handleReplaceChange(sessionId, teacherId, defaultSalary);
  };

  const handleCancelSession = (sessionId: string) => {
    if (cancelledSessions.includes(sessionId)) {
      setCancelledSessions(prev => prev.filter(id => id !== sessionId));
    } else {
      setCancelledSessions(prev => [...prev, sessionId]);
      setReplacements(prev => {
        const newReplacements = { ...prev };
        delete newReplacements[sessionId];
        return newReplacements;
      });
    }
  };

  const loadAvailableTeachers = async (sessionId: string) => {
    if (availableTeachersMap[sessionId]?.length) return;
    setLoadingTeachers(prev => ({ ...prev, [sessionId]: true }));
    try {
      const numSessionId = Number(sessionId);
      const numLeaveId = Number(leaveId);
      if (isNaN(numSessionId) || isNaN(numLeaveId)) {
        console.error('Invalid sessionId or leaveId');
        setAvailableTeachersMap(prev => ({ ...prev, [sessionId]: [] }));
        return;
      }
      const teachers = await teacherLeaveApi.previewAvailableTeachers(numSessionId, numLeaveId);
      setAvailableTeachersMap(prev => ({ ...prev, [sessionId]: teachers }));
    } catch (error: any) {
      console.error('Lỗi tải danh sách giáo viên thay thế:', error);
      setAvailableTeachersMap(prev => ({ ...prev, [sessionId]: [] }));
    } finally {
      setLoadingTeachers(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  const handleSubmit = () => {
  if (approvalType === 'flexible' && isFlexibleIncomplete) return;
  
  // 👉 LOG: Kiểm tra dữ liệu replacements trước khi chuyển đổi
  console.log('🔍 [LeaveApprovalModal] replacements state:', replacements);
  console.log('🔍 [LeaveApprovalModal] approvalType:', approvalType);
  
  // 👉 Chuyển đổi dữ liệu thành ReplacementWithSalary[]
  const replacementsArray: ReplacementWithSalary[] = Object.entries(replacements)
    .filter(([, data]) => data.teacherId && data.teacherId !== '')
    .map(([sessionId, data]) => {
      const result = {
        sessionId: Number(sessionId),
        replacementTeacherId: Number(data.teacherId),
        salary: data.salary ? Number(data.salary) : undefined,
      };
      console.log(`🔍 [LeaveApprovalModal] Session ${sessionId} ->`, result);
      return result;
    });

  console.log('🔍 [LeaveApprovalModal] Final replacementsArray:', replacementsArray);
  console.log('🔍 [LeaveApprovalModal] cancelledSessions:', cancelledSessions);
  console.log('🔍 [LeaveApprovalModal] comment:', comment);

  onApprove({
    approvalType,
    replacements: replacementsArray,
    cancelledSessions,
    comment,
  });
};

  const handleReject = () => {
    if (onReject) onReject();
    onClose();
  };

  const formatDateTime = (date: string, startTime?: string, endTime?: string) => {
    if (startTime && endTime) {
      return `${date} (${startTime} - ${endTime})`;
    }
    return date;
  };

  const remainingSessions = totalSessions - processedSessions;

  // 👉 Format số tiền
  const formatCurrency = (amount: string) => {
    const num = Number(amount);
    if (isNaN(num) || num === 0) return '';
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Phê duyệt đơn xin nghỉ</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Đang chờ xử lý
          </div>
        </header>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Teacher Info */}
          <section className="flex items-center gap-5 p-5 rounded-xl bg-gray-50 border border-gray-100">
            <img
              src={teacherAvatar || '/default-avatar.png'}
              alt={teacherName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{teacherName}</h2>
              <p className="text-gray-500 flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4" />
                Ngày xin nghỉ: {leaveDate}
              </p>
              <p className="text-gray-500 flex items-center gap-1 text-sm mt-1">
                <FileText className="w-4 h-4" />
                Lý do: {reason}
              </p>
            </div>
          </section>

          {/* Affected Sessions Table - THÊM CỘT LƯƠNG */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Buổi học bị ảnh hưởng</h3>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng cộng: {totalSessions} buổi
              </span>
            </div>
            {totalSessions === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500">
                Không có buổi học nào bị ảnh hưởng.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl bg-gray-50 border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-100/50">
                    <tr>
                      <th className="px-5 py-3 text-sm font-semibold text-gray-600">Ngày/Giờ</th>
                      <th className="px-5 py-3 text-sm font-semibold text-gray-600">Môn học</th>
                      <th className="px-5 py-3 text-sm font-semibold text-gray-600">Giáo viên thay thế</th>
                      <th className="px-5 py-3 text-sm font-semibold text-gray-600 text-right">Lương (VNĐ)</th> {/* 👈 THÊM CỘT */}
                      {approvalType === 'flexible' && (
                        <th className="px-5 py-3 text-sm font-semibold text-gray-600 text-center">Hành động</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {affectedSessions.map((session, idx) => {
                      const sessionId = String(session.sessionId);
                      const isCancelled = cancelledSessions.includes(sessionId);
                      const replacementData = replacements[sessionId];
                      const isReplaced = replacementData?.teacherId && replacementData.teacherId !== '';
                      const isProcessed = isCancelled || isReplaced;
                      
                      return (
                        <tr key={session.sessionId ?? idx} className={isCancelled && approvalType === 'flexible' ? 'bg-red-50/30' : ''}>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {formatDateTime(session.sessionDate, session.startTime, session.endTime)}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-800">
                            {session.subjectName}
                          </td>
                          <td className="px-5 py-4">
                            {approvalType === 'full_leave' ? (
                              <div className="text-gray-400 text-sm">Sẽ bị hủy</div>
                            ) : isCancelled ? (
                              <div className="flex items-center gap-2 text-red-600">
                                <XCircle className="w-4 h-4" />
                                <span className="text-sm">Đã hủy buổi học</span>
                              </div>
                            ) : (
                              <select
                                value={replacementData?.teacherId || ''}
                                onChange={(e) => handleTeacherSelect(sessionId, e.target.value)}
                                onFocus={() => loadAvailableTeachers(sessionId)}
                                className={`w-full bg-white border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                                  isSubmitting || isCancelled
                                    ? 'border-gray-200 bg-gray-50 text-gray-400'
                                    : 'border-gray-200'
                                }`}
                                disabled={isSubmitting || isCancelled}
                              >
                                <option value="">Chọn giáo viên...</option>
                                {loadingTeachers[sessionId] ? (
                                  <option disabled>Đang tải...</option>
                                ) : (
                                  (availableTeachersMap[sessionId] || []).map((teacher) => (
                                    <option key={teacher.teacherId} value={String(teacher.teacherId)}>
                                      {teacher.teacherName} ({teacher.teacherEmail})
                                      {teacher.defaultSalary && ` - ${formatCurrency(String(teacher.defaultSalary))}đ`}
                                    </option>
                                  ))
                                )}
                              </select>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            {approvalType === 'full_leave' ? (
                              <div className="text-gray-400 text-sm">-</div>
                            ) : isCancelled ? (
                              <div className="text-gray-400 text-sm">-</div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <input
                                  type="number"
                                  value={replacementData?.salary || ''}
                                  onChange={(e) => {
                                    const currentTeacherId = replacementData?.teacherId || '';
                                    handleReplaceChange(sessionId, currentTeacherId, e.target.value);
                                  }}
                                  placeholder="Nhập lương..."
                                  className="w-32 bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-right"
                                  disabled={isSubmitting || isCancelled || !replacementData?.teacherId}
                                />
                              </div>
                            )}
                          </td>
                          {approvalType === 'flexible' && (
                            <td className="px-5 py-4 text-center">
                              {!isSubmitting && (
                                <button
                                  onClick={() => handleCancelSession(sessionId)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isCancelled
                                      ? 'text-green-600 hover:bg-green-50'
                                      : 'text-red-500 hover:bg-red-50'
                                  }`}
                                  title={isCancelled ? 'Hủy bỏ việc hủy buổi học' : 'Hủy buổi học này'}
                                >
                                  {isCancelled ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </button>
                              )}
                              {isProcessed && !isSubmitting && (
                                <span className="text-xs text-green-600 ml-2">
                                  {isCancelled ? 'Đã hủy' : 'Đã chọn'}
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* AI Suggestion */}
            <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-3">
              <div className="p-2 bg-purple-600 rounded-lg text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-purple-800 text-sm font-bold">Gợi ý từ AI</p>
                <p className="text-purple-700 text-sm leading-relaxed mt-0.5">
                  Dựa trên lịch giảng dạy và chuyên môn, hệ thống đã gợi ý danh sách giáo viên có thể thay thế.
                  {approvalType === 'flexible' && ' Bạn có thể chọn hủy buổi học nếu không tìm được người thay thế phù hợp.'}
                </p>
              </div>
            </div>
          </section>

          {/* Approval Options */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Phương án xử lý</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  approvalType === 'full_leave'
                    ? 'border-purple-500 bg-purple-50/30'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="approval_type"
                  value="full_leave"
                  checked={approvalType === 'full_leave'}
                  onChange={() => setApprovalType('full_leave')}
                  className="absolute top-4 right-4 text-purple-600 focus:ring-purple-500"
                  disabled={isSubmitting}
                />
                <span className="font-bold text-gray-900">Hủy toàn bộ</span>
                <span className="text-sm text-gray-500 mt-1">Hủy tất cả các buổi học trong thời gian xin nghỉ.</span>
              </label>
              <label
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  approvalType === 'flexible'
                    ? 'border-purple-500 bg-purple-50/30'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="approval_type"
                  value="flexible"
                  checked={approvalType === 'flexible'}
                  onChange={() => setApprovalType('flexible')}
                  className="absolute top-4 right-4 text-purple-600 focus:ring-purple-500"
                  disabled={isSubmitting}
                />
                <span className="font-bold text-gray-900">Xử lý linh hoạt</span>
                <span className="text-sm text-gray-500 mt-1">Mỗi buổi học có thể chọn giáo viên thay thế hoặc hủy.</span>
              </label>
            </div>

            {approvalType === 'flexible' && isFlexibleIncomplete && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-amber-700">
                  Còn {remainingSessions} buổi học chưa được xử lý. Vui lòng chọn thay thế hoặc hủy cho tất cả các buổi học.
                </p>
              </div>
            )}

            {approvalType === 'flexible' && processedSessions === totalSessions && totalSessions > 0 && !isFlexibleIncomplete && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-700">
                  Đã xử lý xong {processedSessions}/{totalSessions} buổi học. Bạn có thể tiến hành duyệt.
                </p>
              </div>
            )}

            {/* Comment */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Ghi chú phê duyệt</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-800 placeholder:text-gray-400"
                placeholder="Nhập ý kiến chỉ đạo hoặc lý do cụ thể..."
                disabled={isSubmitting}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="px-6 py-5 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleReject}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Từ chối
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (approvalType === 'flexible' && isFlexibleIncomplete)
            }
            className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Lưu xử lý'}
          </button>
        </footer>
      </div>
    </div>
  );
};