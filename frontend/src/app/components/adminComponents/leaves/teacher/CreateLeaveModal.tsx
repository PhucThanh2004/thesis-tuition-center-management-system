// src/components/adminComponents/leaves/teacher/CreateLeaveModal.tsx
import { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, AlertCircle, BookOpen, MapPin, 
  Info, CheckCircle, GraduationCap, Briefcase, Heart, 
  DollarSign, User, Calendar as CalendarIcon, Star, Loader2,
  Globe, Zap, Scroll, Cpu, Activity, Beaker, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PreviewAffectedSessionResponse } from '../../../../utils/types/teacherLeave';

interface CreateLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    reason?: string;
    leaveType: string;
  }) => Promise<void>;
  onPreview: (data: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  }) => Promise<PreviewAffectedSessionResponse[]>;
  previewSessions: PreviewAffectedSessionResponse[];
  previewLoading: boolean;
}

// Hàm xử lý tên bị lỗi Hibernate proxy - LOẠI BỎ HOÀN TOÀN
// Hàm xử lý tên bị lỗi Hibernate proxy - LOẠI BỎ HOÀN TOÀN
const cleanDisplayName = (name: string): string => {
  if (!name) return 'Chưa có phòng';
  
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
  
  
  if (!cleaned.match(/^P\.\d+/i) && !cleaned.toLowerCase().startsWith('phòng')) {
    if (cleaned.includes(' - ')) {
      const parts = cleaned.split(' - ');
      cleaned = parts[parts.length - 1];
    }
  }
  
  // Loại bỏ khoảng trắng thừa
  cleaned = cleaned.trim();
  
  // Nếu sau khi xử lý mà rỗng hoặc chỉ còn ký tự đặc biệt
  if (!cleaned || cleaned.length === 0 || cleaned === '-') {
    return 'Chưa có phòng';
  }
  
  return cleaned;
};

const LEAVE_TYPES = [
  { value: 'ANNUAL', label: 'Nghỉ phép năm', icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'SICK', label: 'Nghỉ ốm', icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50' },
  { value: 'PERSONAL', label: 'Nghỉ việc riêng', icon: User, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { value: 'UNPAID', label: 'Nghỉ không lương', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50' },
  { value: 'OTHER', label: 'Khác', icon: Star, color: 'text-purple-600', bgColor: 'bg-purple-50' },
];

// Hàm lấy icon cho môn học
const getSubjectIcon = (subjectName: string) => {
  const cleanName_sub = cleanDisplayName(subjectName).toLowerCase();
  
  const icons: Record<string, { icon: typeof BookOpen, color: string }> = {
    'toán': { icon: GraduationCap, color: 'text-blue-600' },
    'văn': { icon: BookOpen, color: 'text-purple-600' },
    'ngữ văn': { icon: BookOpen, color: 'text-purple-600' },
    'anh': { icon: Globe, color: 'text-green-600' },
    'tiếng anh': { icon: Globe, color: 'text-green-600' },
    'lý': { icon: Zap, color: 'text-amber-600' },
    'vật lý': { icon: Zap, color: 'text-amber-600' },
    'hóa': { icon: Beaker, color: 'text-emerald-600' },
    'hóa học': { icon: Beaker, color: 'text-emerald-600' },
    'sinh': { icon: Activity, color: 'text-teal-600' },
    'sinh học': { icon: Activity, color: 'text-teal-600' },
    'sử': { icon: Scroll, color: 'text-orange-600' },
    'lịch sử': { icon: Scroll, color: 'text-orange-600' },
    'địa': { icon: Globe, color: 'text-sky-600' },
    'địa lý': { icon: Globe, color: 'text-sky-600' },
    'gdcd': { icon: Shield, color: 'text-indigo-600' },
    'công dân': { icon: Shield, color: 'text-indigo-600' },
    'tin': { icon: Cpu, color: 'text-gray-600' },
    'tin học': { icon: Cpu, color: 'text-gray-600' },
    'thể dục': { icon: Activity, color: 'text-lime-600' },
    'gdqp': { icon: Shield, color: 'text-red-700' },
  };
  
  for (const [key, value] of Object.entries(icons)) {
    if (cleanName_sub.includes(key)) {
      return value;
    }
  }
  return { icon: BookOpen, color: 'text-purple-600' };
};

export const CreateLeaveModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onPreview, 
  previewSessions, 
  previewLoading 
}: CreateLeaveModalProps) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '07:30',
    endTime: '17:00',
    reason: '',
    leaveType: 'ANNUAL',
  });
  const [isAllDay, setIsAllDay] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        startDate: '',
        endDate: '',
        startTime: '07:30',
        endTime: '17:00',
        reason: '',
        leaveType: 'ANNUAL',
      });
      setIsAllDay(true);
      setError('');
      setShowToast(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && formData.startDate) {
      const timer = setTimeout(() => {
        onPreview({
          startDate: formData.startDate,
          endDate: formData.endDate || formData.startDate,
          startTime: isAllDay ? undefined : formData.startTime,
          endTime: isAllDay ? undefined : formData.endTime,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.startDate, formData.endDate, formData.startTime, formData.endTime, isAllDay]);

  const handleSubmit = async () => {
    if (!formData.startDate) {
      setError('Vui lòng chọn ngày bắt đầu');
      return;
    }
    if (!formData.leaveType) {
      setError('Vui lòng chọn loại nghỉ');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        startTime: isAllDay ? undefined : formData.startTime,
        endTime: isAllDay ? undefined : formData.endTime,
        reason: formData.reason,
        leaveType: formData.leaveType,
      });
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedType = () => {
    return LEAVE_TYPES.find(t => t.value === formData.leaveType) || LEAVE_TYPES[0];
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const SelectedType = getSelectedType();
  const SelectedIcon = SelectedType.icon;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                    <SelectedIcon size={24} className={SelectedType.color} />
                    Tạo đơn nghỉ mới
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Vui lòng điền đầy đủ thông tin để hệ thống rà soát lịch dạy.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-purple-100 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Column 1 - Form nhập liệu */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Loại nghỉ</label>
                      <select
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        value={formData.leaveType}
                        onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                      >
                        {LEAVE_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Ngày bắt đầu</label>
                        <div className="relative">
                          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Ngày kết thúc</label>
                        <div className="relative">
                          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="isAllDay"
                        checked={isAllDay}
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="isAllDay" className="text-sm text-gray-700">
                        Nghỉ cả ngày (không cần chọn giờ cụ thể)
                      </label>
                    </div>

                    {!isAllDay && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Giờ bắt đầu</label>
                          <div className="relative">
                            <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="time"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500"
                              value={formData.startTime}
                              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Giờ kết thúc</label>
                          <div className="relative">
                            <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="time"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500"
                              value={formData.endTime}
                              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Lý do nghỉ</label>
                      <textarea
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={4}
                        placeholder="Nhập lý do chi tiết..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                      </div>
                    )}
                  </div>

                  {/* Column 2 - Danh sách buổi học bị ảnh hưởng */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-purple-500 rounded-full" />
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Buổi học bị ảnh hưởng
                        </h4>
                      </div>
                      {previewSessions.length > 0 && (
                        <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-xs font-bold text-red-600">{previewSessions.length} tiết</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                      {previewLoading ? (
                        <div className="text-center py-12">
                          <Loader2 size={36} className="animate-spin text-purple-500 mx-auto" />
                          <p className="mt-3 text-gray-500 text-sm">Đang kiểm tra lịch dạy...</p>
                        </div>
                      ) : !formData.startDate ? (
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-10 text-center border border-dashed border-gray-200">
                          <CalendarIcon size={48} className="text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-400 font-medium">Chọn ngày để xem các buổi học bị ảnh hưởng</p>
                          <p className="text-gray-300 text-xs mt-1">Hệ thống sẽ tự động rà soát lịch dạy của bạn</p>
                        </div>
                      ) : previewSessions.length === 0 ? (
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-10 text-center border border-green-100">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={28} className="text-green-500" />
                          </div>
                          <p className="text-green-700 font-semibold">Không có buổi học nào bị ảnh hưởng</p>
                          <p className="text-green-500 text-sm mt-1">Trong khoảng thời gian này bạn không có lịch dạy</p>
                        </div>
                      ) : (
                        previewSessions.map((session, idx) => {
                          const cleanSubjectName = cleanDisplayName(session.subjectName);
                          const cleanRoomName = cleanDisplayName(session.roomName || '');
                          const { icon: SubjectIcon, color: iconColor } = getSubjectIcon(session.subjectName);
                          const startTimeFormatted = formatTime(session.startTime);
                          const endTimeFormatted = formatTime(session.endTime);
                          
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group bg-gradient-to-r from-white to-gray-50/30 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex items-start gap-4">
                                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${iconColor}`}>
                                  <SubjectIcon size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                    <h5 className="font-bold text-gray-800 text-base truncate">{cleanSubjectName}</h5>
                                    <div className="flex items-center gap-1.5 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                      <Clock size={11} className="text-gray-400" />
                                      <span className="text-gray-600">{startTimeFormatted}</span>
                                      <span className="text-gray-400">→</span>
                                      <span className="text-gray-600">{endTimeFormatted}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                      <MapPin size={14} className="text-gray-400" />
                                      <span>{cleanRoomName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                      <span className="text-xs text-amber-600 font-medium">Có thể sắp xếp dạy bù</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Info size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800">Thông tin</p>
                          <p className="text-xs text-purple-700 leading-relaxed">
                            Hệ thống sẽ tự động thông báo cho phòng đào tạo và gửi yêu cầu 
                            sắp xếp dạy bù sau khi đơn được duyệt.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !formData.startDate}
                  className="px-8 py-2.5 btn-gradient from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>Tạo đơn nghỉ</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-sm font-medium">Đơn nghỉ của bạn đã được gửi thành công!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};