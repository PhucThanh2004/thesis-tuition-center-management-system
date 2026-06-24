import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSpreadsheet,
  Search,
  Loader2,
  UserCheck,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { PayrollFilter, PayrollPreviewResponse } from '../../../utils/types/payroll';
import { payrollApi } from '../../../utils/api/payroll.api';
import { teacherApi } from '../../../utils/api/teacher.api';
import './payroll.css';
import { useOutletContext } from 'react-router-dom';

interface PayrollPreviewTabProps {
  filters: PayrollFilter;
  onSuccess: () => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const sessionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2 }
  })
};

// Skeleton loader
const PreviewSkeleton: React.FC = () => (
  <div className="space-y-5">
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-slate-200 rounded" />
          <div className="h-3 w-28 bg-slate-200 rounded" />
        </div>
        <div className="text-right space-y-1">
          <div className="h-2.5 w-16 bg-slate-200 rounded" />
          <div className="h-7 w-14 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-slate-200 rounded" />
          <div className="h-7 w-28 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
      <div className="h-5 w-28 bg-slate-200 rounded mb-3 animate-pulse" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// Empty state component
const EmptyPreviewState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-xl bg-white border border-slate-200 shadow-sm p-10 text-center"
  >
    <div className="flex justify-center mb-3">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
        <FileSpreadsheet className="w-8 h-8 text-purple-400" />
      </div>
    </div>
    <h3 className="text-sm font-medium text-slate-700 mb-1">Chưa có dữ liệu xem trước</h3>
    <p className="text-xs text-slate-400 max-w-sm mx-auto">
      Tìm và chọn giáo viên từ danh sách bên trái, sau đó nhấn "Xem trước lương"
    </p>
    <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
      <span className="flex items-center gap-1"><Search className="w-2.5 h-2.5" /> Tìm kiếm</span>
      <span>→</span>
      <span className="flex items-center gap-1"><UserCheck className="w-2.5 h-2.5" /> Chọn</span>
      <span>→</span>
      <span className="flex items-center gap-1"><FileSpreadsheet className="w-2.5 h-2.5" /> Xem</span>
    </div>
  </motion.div>
);

const PayrollPreviewTab: React.FC<PayrollPreviewTabProps> = ({ filters, onSuccess }) => {
  const [previewData, setPreviewData] = useState<PayrollPreviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ userId: number; name: string; email?: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<{ teacherId: number; name: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setAlert } = useOutletContext<any>();
  // ========== 1. TÌM KIẾM GIÁO VIÊN ==========
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);

    try {
      const response = await teacherApi.getAll(1, 50, { name: searchTerm });

      if (response.success && response.data && response.data.length > 0) {
        const results = response.data.map((teacher: any) => ({
          userId: teacher.id,
          name: teacher.fullName,
          email: teacher.email
        }));
        setSearchResults(results);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setAlert({ message: 'Không thể tìm kiếm giáo viên', type: 'error' });
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [searchTerm, setAlert]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm && searchTerm.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========== 2. CHỌN GIÁO VIÊN ==========
  const handleSelectTeacher = async (user: { userId: number; name: string; email?: string }) => {
    setSearching(true);

    try {
      const response = await teacherApi.getTeacherIdByUserId(user.userId);
      const teacherId = response.teacherId;

      if (!teacherId) {
        setAlert({ message: 'Không tìm thấy mã giáo viên cho người dùng này', type: 'error' });
        return;
      }

      setSelectedTeacher({ teacherId: teacherId, name: user.name });
      setSearchTerm(user.name);
      setShowDropdown(false);
      setPreviewData(null);
      setAlert({ message: `Đã chọn giáo viên: ${user.name}`, type: 'success' });
    } catch (error) {
      console.error('Failed to get teacher ID:', error);
      setAlert({ message: 'Không thể lấy thông tin giáo viên', type: 'error' });
    } finally {
      setSearching(false);
    }
  };

  // ========== 3. XEM TRƯỚC LƯƠNG ==========
  const handlePreview = async () => {
    if (!selectedTeacher) {
      setAlert({ message: 'Vui lòng chọn giáo viên', type: 'info' });
      return;
    }

    setLoading(true);
    try {
      const data = await payrollApi.previewPayroll({
        teacherId: selectedTeacher.teacherId,
        month: filters.month || new Date().getMonth() + 1,
        year: filters.year || new Date().getFullYear()
      });
      setPreviewData(data);
      setAlert({ message: `Đã tìm thấy ${data.totalSessions} buổi dạy`, type: 'success' });
    } catch (error: any) {
      console.error('Preview error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể xem trước bảng lương';

      if (errorMsg.includes('Teacher not found')) {
        setAlert({ message: `Không tìm thấy giáo viên với ID ${selectedTeacher.teacherId}`, type: 'error' });
      } else if (errorMsg.includes('not found') || error?.response?.status === 500) {
        setAlert({ message: 'Giáo viên không có buổi dạy trong tháng này', type: 'error' });
      } else {
        setAlert({ message: errorMsg, type: 'error' });
      }
      setPreviewData(null);
    } finally {
      setLoading(false);
    }
  };

  // ========== 4. TẠO BẢNG LƯƠNG ==========
  const handleGeneratePayroll = async () => {
    if (!selectedTeacher) return;

    setGenerating(true);
    try {
      await payrollApi.generatePayroll({
        teacherId: selectedTeacher.teacherId,
        month: filters.month || new Date().getMonth() + 1,
        year: filters.year || new Date().getFullYear(),
        overwriteExisting: false
      });
      setAlert({ message: `Tạo bảng lương cho ${selectedTeacher.name} thành công!`, type: 'success' });
      onSuccess();
    } catch (error: any) {
      console.error('Generate error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || '';
      if (errorMsg.includes('already generated')) {
        setAlert({ message: 'Bảng lương đã được tạo trước đó', type: 'error' });
      } else {
        setAlert({ message: errorMsg || 'Không thể tạo bảng lương', type: 'error' });
      }
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-5"
    >
      <motion.div variants={itemVariants} className="lg:col-span-1">
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
                <Users className="h-3.5 w-3.5 text-purple-600" />
              </div>

              <div>
                <h4 className="text-xs font-medium text-slate-700">Chọn giáo viên</h4>
                <p className="text-[10px] text-slate-400">Tìm kiếm theo tên để xem trước lương</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="relative mb-3" ref={dropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên giáo viên..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedTeacher(null);
                  }}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  className="w-full h-11 pl-11 pr-10 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all"
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500 animate-spin" />
                )}
              </div>

              <AnimatePresence>
                {showDropdown && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-xl border border-slate-200 shadow-xl max-h-72 overflow-y-auto custom-scrollbar"                  >
                    {searchResults.map((teacher, idx) => (
                      <motion.div
                        key={teacher.userId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => handleSelectTeacher(teacher)}
                        className="px-3 py-3 cursor-pointer hover:bg-purple-50 transition-colors border-b border-slate-100 last:border-b-0 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-700 group-hover:text-purple-700 truncate">
                              {teacher.name}
                            </p>

                            {teacher.email && (
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {teacher.email}
                              </p>
                            )}
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-purple-500 shrink-0" />
                        </div>
                      </motion.div>
                    ))}

                    {searchResults.length > 6 && (
                      <div className="px-3 py-2 text-center text-[11px] text-slate-400 bg-slate-50">
                        Hiển thị 6 / {searchResults.length} kết quả
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {searchTerm.length >= 2 && !searching && searchResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 flex items-center gap-1 text-xs text-amber-600"
                >
                  <AlertCircle className="h-3 w-3" />
                  Không tìm thấy giáo viên
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {selectedTeacher && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="mb-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-200"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-200">
                      <UserCheck className="h-3 w-3 text-purple-700" />
                    </div>

                    <span className="text-[10px] font-medium uppercase tracking-wide text-purple-600">
                      Đã chọn
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-800">
                    {selectedTeacher.name}
                  </p>

                  <p className="text-[10px] text-purple-500 mt-0.5">
                    ID: {selectedTeacher.teacherId}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePreview}
              disabled={!selectedTeacher || loading}
              className="w-full py-2 rounded-lg text-sm font-medium text-white transition-all gradient-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Đang xem trước...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Xem trước lương
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
      {/* Right: Preview Details */}
      <div className="lg:col-span-2">
        {loading ? (
          <PreviewSkeleton />
        ) : previewData ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Teacher Info Card */}
            <motion.div variants={itemVariants} className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="relative h-20 bg-gradient-to-r from-purple-500 to-purple-600">
                <div className="absolute -bottom-6 left-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md border border-slate-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="pt-8 px-5 pb-4">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">{previewData.teacherName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400">ID: {previewData.teacherId}</span>
                      <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                        Tháng {previewData.month}/{previewData.year}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Tổng số buổi</p>
                    <p className="text-2xl font-semibold text-purple-600">{previewData.totalSessions}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Tổng lương dự kiến</span>
                    <span className="text-xl font-semibold text-emerald-600">
                      {formatCurrency(previewData.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sessions List */}
            <motion.div variants={itemVariants} className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-purple-500" />
                  <h4 className="text-xs font-medium text-slate-700">Chi tiết các buổi dạy</h4>
                  <span className="ml-auto text-[10px] text-slate-400">{previewData.sessions.length} buổi</span>
                </div>
              </div>
              <div className="p-3 max-h-80 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <AnimatePresence>
                    {previewData.sessions.map((session, idx) => (
                      <motion.div
                        key={idx}
                        custom={idx}
                        variants={sessionVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.01 }}
                        className="group p-3 rounded-lg bg-slate-50/50 hover:bg-purple-50/30 transition-all duration-200 border border-transparent hover:border-purple-100"
                      >
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-sm font-medium text-slate-700 group-hover:text-purple-700 transition-colors">
                                {session.subjectName}
                              </p>
                              {session.replacement && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                  <Clock className="h-2.5 w-2.5" />
                                  Dạy thay
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span className="flex items-center gap-0.5">
                                <Calendar className="h-2.5 w-2.5" />
                                {session.sessionDate}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {session.startTime} - {session.endTime}
                              </span>
                              <span>⏱️ {session.workedHours} giờ</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-purple-600">
                              {formatCurrency(session.amount)}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {session.salaryType === 'PER_HOUR' ? '💰 Theo giờ' : '📅 Theo buổi'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGeneratePayroll}
              disabled={generating}
              className="w-full py-2.5 rounded-lg font-medium text-sm gradient-btn from-emerald-500 to-emerald-600 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4" />
                  Tạo bảng lương
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <EmptyPreviewState />
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
};

export default PayrollPreviewTab;