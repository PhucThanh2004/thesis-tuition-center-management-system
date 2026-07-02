// src/components/payroll/PayrollRejectedTab.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  RotateCcw, 
  Eye, 
  FileText,
  RefreshCw,
  Calendar,
  User,
  DollarSign,
  Clock,
  XCircle,
  X,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { payrollApi } from '../../../utils/api/payroll.api';
import type { 
  PayrollListItem, 
  TeacherPaymentStatus,
  TeacherPaymentResponse,
  PayrollDetailResponse
} from '../../../utils/types/payroll';
import { useOutletContext } from 'react-router-dom';

interface PayrollRejectedTabProps {
  refreshTrigger?: number;
  onRegenerateSuccess?: () => void;
}

// Modal animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const PayrollRejectedTab: React.FC<PayrollRejectedTabProps> = ({ 
  refreshTrigger = 0, 
  onRegenerateSuccess 
}) => {
  const [rejectedPayrolls, setRejectedPayrolls] = useState<PayrollListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState<number | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollDetailResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { setAlert } = useOutletContext<any>();

  const fetchRejectedPayrolls = async () => {
    try {
      setLoading(true);
      const allPayrolls = await payrollApi.getAllPayrolls();
      
      // Lọc các bảng lương có status REJECTED hoặc REQUEST_ADJUSTMENT
      const rejected = allPayrolls.filter(p => 
        p.status === 'REJECTED' || p.status === 'REQUEST_ADJUSTMENT'
      );
      
      // Sắp xếp theo thời gian mới nhất
      rejected.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
      
      setRejectedPayrolls(rejected);
    } catch (error) {
      console.error('Failed to fetch rejected payrolls:', error);
      setAlert?.({
        type: 'error',
        message: 'Không thể tải danh sách bảng lương bị từ chối'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedPayrolls();
  }, [refreshTrigger]);

const handleViewDetail = async (paymentId: number) => {
  try {
    const detail = await payrollApi.getPayrollById(paymentId);
    console.log('📋 Payroll Detail:', detail);
    console.log('📋 Teacher Feedback:', detail.teacherFeedback);
    console.log('📋 Rejection Reason:', detail.rejectionReason);
    setSelectedPayroll(detail);
    setShowDetailModal(true);
  } catch (error) {
    setAlert?.({
      type: 'error',
      message: 'Không thể tải chi tiết bảng lương'
    });
  }
};

  const handleRegenerate = async (payroll: PayrollListItem) => {
    try {
      setRegeneratingId(payroll.paymentId);
      
      const request = {
        teacherId: payroll.teacherId,
        month: payroll.month,
        year: payroll.year
      };
      
      const response: TeacherPaymentResponse = await payrollApi.regeneratePayroll(request);
      
      setAlert?.({
        type: 'success',
        message: `Đã tái tạo bảng lương cho ${payroll.teacherName} - Tháng ${payroll.month}/${payroll.year} (Phiên bản ${response.revisionNo})`
      });
      
      setShowRegenerateConfirm(null);
      onRegenerateSuccess?.();
      await fetchRejectedPayrolls();
      
    } catch (error: any) {
      console.error('Failed to regenerate payroll:', error);
      setAlert?.({
        type: 'error',
        message: error?.response?.data?.message || 'Không thể tái tạo bảng lương'
      });
    } finally {
      setRegeneratingId(null);
    }
  };

  const getStatusBadge = (status: TeacherPaymentStatus) => {
    const statusMap: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      'REJECTED': {
        label: 'Từ chối',
        className: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      },
      'REQUEST_ADJUSTMENT': {
        label: 'Yêu cầu điều chỉnh',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <AlertCircle className="h-3 w-3" />
      }
    };
    
    const info = statusMap[status];
    if (!info) return null;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${info.className}`}>
        {info.icon}
        {info.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

 
  const getRejectionReason = (payroll: PayrollListItem | PayrollDetailResponse): string => {
    if ('teacherFeedback' in payroll && payroll.teacherFeedback) {
      return payroll.teacherFeedback;
    }
    if ('feedback' in payroll && payroll.feedback) {
      return payroll.feedback;
    }
    if ('rejectionReason' in payroll && payroll.rejectionReason) {
      return payroll.rejectionReason;
    }
    return 'Không có lý do cụ thể';
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
          <span className="ml-3 text-slate-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (rejectedPayrolls.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Không có bảng lương bị từ chối</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md">
            Tất cả bảng lương đều đang trong trạng thái tốt. 
            Bạn sẽ thấy các bảng lương bị từ chối hoặc yêu cầu điều chỉnh tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-800">
            Bảng lương cần tái tạo
          </h3>
          <span className="text-sm text-slate-500">
            ({rejectedPayrolls.length} bảng)
          </span>
        </div>
        <button
          onClick={fetchRejectedPayrolls}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rejectedPayrolls.map((payroll, index) => (
          <motion.div
            key={payroll.paymentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left - Teacher Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-base font-semibold text-slate-800 truncate">
                        {payroll.teacherName}
                      </h4>
                      {getStatusBadge(payroll.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Tháng {payroll.month}/{payroll.year}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" />
                        {formatCurrency(payroll.amount)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {payroll.totalSessions} buổi
                      </span>
                      {payroll.revisionNo && payroll.revisionNo > 1 && (
                        <span className="flex items-center gap-1.5 text-amber-600">
                          <FileText className="h-3.5 w-3.5" />
                          Phiên bản {payroll.revisionNo}
                        </span>
                      )}
                    </div>
                    {/* Hiển thị lý do từ chối ngắn gọn */}
                    {payroll.feedback && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg max-w-2xl">
                        <MessageCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">Lý do: {payroll.feedback}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewDetail(payroll.paymentId)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Chi tiết</span>
                  </button>
                  
                  {showRegenerateConfirm === payroll.paymentId ? (
                    <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1">
                      <span className="text-xs text-amber-700 px-2">Xác nhận tái tạo?</span>
                      <button
                        onClick={() => handleRegenerate(payroll)}
                        disabled={regeneratingId === payroll.paymentId}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                      >
                        {regeneratingId === payroll.paymentId ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Đồng ý'
                        )}
                      </button>
                      <button
                        onClick={() => setShowRegenerateConfirm(null)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowRegenerateConfirm(payroll.paymentId)}
                      disabled={regeneratingId === payroll.paymentId}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white btn-gradient from-purple-600 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 disabled:opacity-50"
                    >
                      {regeneratingId === payroll.paymentId ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4" />
                          Tái tạo
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedPayroll && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowDetailModal(false)}
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-xl">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">Chi tiết bảng lương</h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-xs text-purple-600">#{selectedPayroll.paymentId}</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-xs text-slate-500">{selectedPayroll.teacherName}</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-xs text-slate-400">
                        Tháng {selectedPayroll.month}/{selectedPayroll.year}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-5 overflow-y-auto max-h-[calc(85vh-130px)] space-y-5">
                  {/* Status & Reason */}
                  <div className={`rounded-xl p-4 border ${
                    selectedPayroll.status === 'REJECTED' 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {selectedPayroll.status === 'REJECTED' ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-semibold ${
                          selectedPayroll.status === 'REJECTED' 
                            ? 'text-red-800' 
                            : 'text-amber-800'
                        }`}>
                          {selectedPayroll.status === 'REJECTED' ? 'Bảng lương bị từ chối' : 'Yêu cầu điều chỉnh'}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          selectedPayroll.status === 'REJECTED' 
                            ? 'text-red-700' 
                            : 'text-amber-700'
                        }`}>
                          <span className="font-medium">Lý do:</span> {getRejectionReason(selectedPayroll)}
                        </p>
                        {selectedPayroll.revisionNo && selectedPayroll.revisionNo > 1 && (
                          <p className={`text-xs mt-1 ${
                            selectedPayroll.status === 'REJECTED' 
                              ? 'text-red-600' 
                              : 'text-amber-600'
                          }`}>
                            Phiên bản hiện tại: {selectedPayroll.revisionNo}
                          </p>
                        )}
                        {selectedPayroll.teacherRejectedAt && (
                          <p className={`text-xs mt-1 ${
                            selectedPayroll.status === 'REJECTED' 
                              ? 'text-red-500' 
                              : 'text-amber-500'
                          }`}>
                            Thời gian: {formatDateTime(selectedPayroll.teacherRejectedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                        <BookOpen className="h-3 w-3" />
                        <span className="text-[10px] uppercase tracking-wide">Tổng số buổi</span>
                      </div>
                      <p className="text-xl font-semibold text-slate-700">{selectedPayroll.totalSessions}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-[10px] uppercase tracking-wide">Tổng lương</span>
                      </div>
                      <p className="text-xl font-semibold text-purple-600">{formatCurrency(selectedPayroll.amount)}</p>
                    </div>
                  </div>

                  {/* Sessions List */}
                  {selectedPayroll.details && selectedPayroll.details.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1.5">
                        <BookOpen className="h-3 w-3 text-purple-400" />
                        Chi tiết các buổi dạy
                      </h4>
                      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                        {selectedPayroll.details.map((session, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <p className="text-sm font-medium text-slate-700">{session.subjectName}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                  <span>📅 {formatDate(session.sessionDate)}</span>
                                  <span>⏱ {session.workedHours} giờ</span>
                                  {session.salaryType && (
                                    <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-500">
                                      {session.salaryType === 'PER_HOUR' ? 'Theo giờ' : 
                                       session.salaryType === 'PER_SESSION' ? 'Theo buổi' : 'Theo tháng'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-purple-600">{formatCurrency(session.amount)}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-400">Ngày tạo</span>
                      <p className="font-medium text-slate-700">{formatDate(selectedPayroll.paymentDate)}</p>
                    </div>
                    {selectedPayroll.revisionNo && (
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-400">Phiên bản</span>
                        <p className="font-medium text-slate-700">{selectedPayroll.revisionNo}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>Cập nhật: {formatDateTime(selectedPayroll.paymentDate)}</span>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-all"
                    >
                      Đóng
                    </motion.button>
                    {(selectedPayroll.status === 'REJECTED' || selectedPayroll.status === 'REQUEST_ADJUSTMENT') && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowDetailModal(false);
                          // Tìm payroll trong list để tái tạo
                          const payroll = rejectedPayrolls.find(p => p.paymentId === selectedPayroll.paymentId);
                          if (payroll) {
                            setShowRegenerateConfirm(payroll.paymentId);
                          }
                        }}
                        className="px-4 py-1.5 rounded-lg btn-gradient from-purple-600 to-purple-700 text-white text-sm font-medium shadow-lg shadow-purple-200 transition-all"
                      >
                        <RotateCcw className="h-3.5 w-3.5 inline mr-1.5" />
                        Tái tạo
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Lưu ý:</strong> Chỉ những bảng lương có trạng thái 
            <span className="font-medium mx-1">"Từ chối"</span> hoặc 
            <span className="font-medium mx-1">"Yêu cầu điều chỉnh"</span> 
            mới có thể tái tạo. Sau khi tái tạo, bảng lương sẽ chuyển sang trạng thái 
            <span className="font-medium mx-1">"Chờ giáo viên xác nhận"</span>.
          </span>
        </p>
      </div>
    </div>
  );
};

export default PayrollRejectedTab;