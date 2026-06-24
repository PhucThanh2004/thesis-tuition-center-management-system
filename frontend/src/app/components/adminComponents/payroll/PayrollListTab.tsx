import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  CheckCircle,
  Lock,
  FileText,
  Download, User,
  Calendar,
  DollarSign,
  BookOpen,
  X,
  Clock,
  TrendingUp,
  XCircle,
  RotateCcw
} from 'lucide-react';
import type { PayrollFilter, PayrollListItem, TeacherPaymentStatus, TeacherPayrollRejectRequest, TeacherPaymentResponse } from '../../../utils/types/payroll';
import { payrollApi } from '../../../utils/api/payroll.api';
import './payroll.css';
import { useOutletContext } from 'react-router-dom';

interface PayrollListTabProps {
  filters: PayrollFilter;
  refreshTrigger: number;
}

// Animation variants
const tableRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
};

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

// Status badge component
const StatusBadge: React.FC<{ status: TeacherPaymentStatus }> = ({ status }) => {
  const config: Record<TeacherPaymentStatus, { class: string; label: string; icon: React.ReactNode }> = {
    'WAITING_TEACHER_CONFIRMATION': {
      class: 'bg-amber-50 text-amber-600 border-amber-200',
      label: 'CHỜ XÁC NHẬN',
      icon: <Clock className="h-2.5 w-2.5" />
    },
    'TEACHER_CONFIRMED': {
      class: 'bg-blue-50 text-blue-600 border-blue-200',
      label: 'ĐÃ XÁC NHẬN',
      icon: <CheckCircle className="h-2.5 w-2.5" />
    },
    'REJECTED': {  // THÊM MỚI
      class: 'bg-red-50 text-red-600 border-red-200',
      label: 'TỪ CHỐI',
      icon: <XCircle className="h-2.5 w-2.5" />
    },
    'REQUEST_ADJUSTMENT': {  // THÊM MỚI
      class: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'YÊU CẦU ĐIỀU CHỈNH',
      icon: <Clock className="h-2.5 w-2.5" />
    },
    'FINALIZED': {
      class: 'bg-purple-50 text-purple-600 border-purple-200',
      label: 'ĐÃ CHỐT',
      icon: <Lock className="h-2.5 w-2.5" />
    },
    'PAID': {
      class: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      label: 'ĐÃ THANH TOÁN',
      icon: <DollarSign className="h-2.5 w-2.5" />
    }
  };

  const { class: className, label, icon } = config[status] || config['WAITING_TEACHER_CONFIRMATION'];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${className}`}>
      {icon}
      {label}
    </span>
  );
};

// Skeleton loader
const TableSkeleton: React.FC = () => (
  <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <th key={i} className="p-3"><div className="h-3 w-16 bg-slate-200 rounded animate-pulse" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map(i => (
            <tr key={i} className="border-b border-slate-100">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(j => (
                <td key={j} className="p-3"><div className="h-4 w-14 bg-slate-100 rounded animate-pulse" /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Empty state
const EmptyState: React.FC<{ role: string }> = ({ role }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="flex justify-center mb-3">
      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
        <FileText className="h-7 w-7 text-slate-300" />
      </div>
    </div>
    <h3 className="text-sm font-medium text-slate-700 mb-1">Không có bảng lương nào</h3>
    <p className="text-xs text-slate-400 max-w-sm mx-auto">
      {role === 'ADMIN'
        ? 'Chưa có bảng lương nào được tạo trong kỳ này'
        : 'Bạn chưa có bảng lương nào trong kỳ này'}
    </p>
  </motion.div>
);

const PayrollListTab: React.FC<PayrollListTabProps> = ({ filters, refreshTrigger }) => {
  const [payrolls, setPayrolls] = useState<PayrollListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const { setAlert } = useOutletContext<any>();
  const [currentUser, setCurrentUser] = useState<{ id: number; role: string }>({
    id: 0,
    role: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser({
          id: user.id,
          role: user.role || 'ADMIN'
        });
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
  }, []);

  useEffect(() => {
    fetchPayrolls();
  }, [filters, refreshTrigger]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const allPayrolls = await payrollApi.getAllPayrolls();

      let filteredPayrolls = [...allPayrolls];

      if (filters.month && filters.year) {
        filteredPayrolls = filteredPayrolls.filter(p => p.month === filters.month && p.year === filters.year);
      }

      if (filters.status) {
        filteredPayrolls = filteredPayrolls.filter(p => p.status === filters.status);
      }

      if (filters.teacherName) {
        filteredPayrolls = filteredPayrolls.filter(p =>
          p.teacherName.toLowerCase().includes(filters.teacherName!.toLowerCase())
        );
      }

      if (currentUser.role === 'TEACHER' && currentUser.id) {
        filteredPayrolls = filteredPayrolls.filter(p => p.teacherId === currentUser.id);
      }

      setPayrolls(filteredPayrolls);
    } catch (error) {
      console.error('Failed to fetch payrolls:', error);
      setAlert?.({
        type: 'error',
        message: 'Không thể tải danh sách bảng lương'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (paymentId: number) => {
    try {
      const detail = await payrollApi.getPayrollById(paymentId);
      setSelectedPayroll(detail);
      setShowDetailModal(true);
    } catch (error) {
      setAlert?.({
        type: 'error',
        message: 'Không thể tải chi tiết bảng lương'
      });
    }
  };

  const handleConfirm = async (paymentId: number) => {
    if (currentUser.role !== 'TEACHER') {
      setAlert?.({
        type: 'error',
        message: 'Chỉ giáo viên mới có thể xác nhận bảng lương'
      });
      return;
    }

    setActionLoading(paymentId);
    try {
      await payrollApi.confirmPayroll({
        paymentId: paymentId,
        teacherFeedback: 'Tôi xác nhận bảng lương này là chính xác.'
      });
      setAlert?.({
        type: 'success',
        message: 'Xác nhận bảng lương thành công'
      }); await fetchPayrolls();
    } catch (error) {
      setAlert?.({
        type: 'error',
        message: 'Không thể xác nhận bảng lương'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (paymentId: number) => {
    if (currentUser.role !== 'TEACHER') {
      setAlert?.({
        type: 'error',
        message: 'Chỉ giáo viên mới có thể từ chối bảng lương'
      });
      return;
    }

    // Hiển thị prompt để nhập lý do từ chối
    const reason = window.prompt('Vui lòng nhập lý do từ chối bảng lương:');
    if (reason === null) return; // User cancel
    if (!reason.trim()) {
      setAlert?.({
        type: 'error',
        message: 'Vui lòng nhập lý do từ chối'
      });
      return;
    }

    setActionLoading(paymentId);
    try {
      const request: TeacherPayrollRejectRequest = {
        paymentId: paymentId,
        reason: reason.trim()
      };

      await payrollApi.rejectPayroll(request);
      setAlert?.({
        type: 'success',
        message: 'Đã từ chối bảng lương thành công'
      });
      await fetchPayrolls();
    } catch (error: any) {
      setAlert?.({
        type: 'error',
        message: error?.response?.data?.message || 'Không thể từ chối bảng lương'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (paymentId: number) => {
    if (currentUser.role !== 'ADMIN') {
      setAlert?.({
        type: 'error',
        message: 'Chỉ quản trị viên mới có thể tái tạo bảng lương'
      });
      return;
    }

    // Tìm payroll để lấy teacherId, month, year
    const payroll = payrolls.find(p => p.paymentId === paymentId);
    if (!payroll) {
      setAlert?.({
        type: 'error',
        message: 'Không tìm thấy thông tin bảng lương'
      });
      return;
    }

    // Xác nhận tái tạo
    if (!window.confirm(`Bạn có chắc muốn tái tạo bảng lương cho ${payroll.teacherName} - Tháng ${payroll.month}/${payroll.year}?`)) {
      return;
    }

    setActionLoading(paymentId);
    try {
      const request = {
        teacherId: payroll.teacherId,
        month: payroll.month,
        year: payroll.year
      };

      const response: TeacherPaymentResponse = await payrollApi.regeneratePayroll(request);
      setAlert?.({
        type: 'success',
        message: `Đã tái tạo bảng lương thành công (Phiên bản ${response.revisionNo})`
      });
      await fetchPayrolls();
    } catch (error: any) {
      setAlert?.({
        type: 'error',
        message: error?.response?.data?.message || 'Không thể tái tạo bảng lương'
      });
    } finally {
      setActionLoading(null);
    }
  };


  const handleFinalize = async (paymentId: number) => {
    if (currentUser.role !== 'ADMIN') {
      setAlert?.({
        type: 'error',
        message: 'Chỉ quản trị viên mới có thể chốt lương'
      });
      return;
    }

    setActionLoading(paymentId);
    try {
      await payrollApi.finalizePayroll({
        paymentId: paymentId,
        payrollNote: 'Đã duyệt và chốt lương'
      }, currentUser.id);
      setAlert?.({
        type: 'success',
        message: 'Chốt bảng lương thành công'
      });
      await fetchPayrolls();
    } catch (error) {
      setAlert?.({
        type: 'error',
        message: 'Không thể chốt bảng lương'
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Thêm vào sau hàm handleExport (khoảng dòng ~230)

  // Export 1 bảng lương ra Excel
  const handleExportToExcel = async (paymentId: number) => {
    setActionLoading(paymentId);
    try {
      const response = await payrollApi.exportPayrollToExcel(paymentId);

      // Kiểm tra response có phải là Blob không
      if (!response || !(response instanceof Blob)) {
        console.error('Response is not a Blob:', response);
        setAlert?.({
          type: 'error',
          message: 'Dữ liệu trả về không hợp lệ'
        });
        return;
      }

      // Kiểm tra kích thước blob
      if (response.size === 0) {
        console.error('Blob is empty');
        setAlert?.({
          type: 'error',
          message: 'File Excel rỗng'
        });
        return;
      }

      // Tạo link download
      const url = URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bang_luong_${paymentId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url); // Clean up

      setAlert?.({
        type: 'success',
        message: 'Xuất file Excel thành công!'
      });
    } catch (error) {
      console.error('Export Excel error:', error);
      setAlert?.({
        type: 'error',
        message: 'Không thể xuất file Excel: ' + (error as Error).message
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Export tất cả bảng lương ra Excel
  const handleExportAllToExcel = async () => {
    setLoading(true);
    try {
      const response = await payrollApi.exportAllPayrollsToExcel();

      // Kiểm tra response
      if (!response) {
        throw new Error('No response from server');
      }

      // Kiểm tra response có phải là Blob không
      if (!(response instanceof Blob)) {
        console.error('Response is not a Blob:', response);
        throw new Error('Invalid response format');
      }

      // Kiểm tra kích thước blob
      if (response.size === 0) {
        throw new Error('File Excel is empty');
      }

      console.log('Blob received:', {
        size: response.size,
        type: response.type
      });

      const now = new Date();
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
      const filename = `danh_sach_bang_luong_${timestamp}.xlsx`;

      // Tạo link download
      const url = URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setAlert?.({
        type: 'success',
        message: 'Xuất file Excel tổng hợp thành công!'
      });
    } catch (error) {
      console.error('Export all Excel error:', error);
      setAlert?.({
        type: 'error',
        message: 'Không thể xuất file Excel tổng hợp: ' + (error as Error).message
      });
    } finally {
      setLoading(false);
    }
  };
  const isOwner = (teacherId: number) => {
    if (currentUser.role === 'ADMIN') return true;
    return currentUser.id === teacherId;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Role indicator and summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${currentUser.role === 'ADMIN'
            ? 'bg-purple-50 text-purple-600'
            : 'bg-blue-50 text-blue-600'
            }`}>
            {currentUser.role === 'ADMIN' ? 'Quản trị viên' : 'Giáo viên'}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <FileText className="h-3 w-3" />
            <span>{payrolls.length} bảng lương</span>
          </div>
        </div>

        {payrolls.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <TrendingUp className="h-2.5 w-2.5" />
            <span>Tổng: {formatCurrency(payrolls.reduce((sum, p) => sum + p.amount, 0))}đ</span>
          </div>
        )}
      </motion.div>
      {currentUser.role === 'ADMIN' && payrolls.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportAllToExcel}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-all"
        >
          <Download className="h-3.5 w-3.5" />
          Xuất tất cả Excel
        </motion.button>
      )}
      {/* Premium Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">Mã</th>
                <th className="text-left p-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">Giáo viên</th>
                <th className="text-left p-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">Kỳ lương</th>
                <th className="text-left p-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">Số buổi</th>
                <th className="text-left p-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">Tổng tiền</th>
                <th className="text-left p-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">Ngày tạo</th>
                <th className="text-left p-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">Trạng thái</th>
                <th className="text-left p-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {payrolls.map((payroll, idx) => (
                  <motion.tr
                    key={payroll.paymentId}
                    custom={idx}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.02)' }}
                    className="border-b border-slate-100 transition-colors duration-150"
                  >
                    <td className="p-3">
                      <span className="font-mono text-xs font-medium text-purple-600">#{payroll.paymentId}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                          <User className="h-3 w-3 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{payroll.teacherName}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-600">Tháng {payroll.month}/{payroll.year}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-medium text-slate-600">{payroll.totalSessions} buổi</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-semibold text-purple-600">{formatCurrency(payroll.amount)}đ</span>
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-slate-400">
                        {new Date(payroll.paymentDate).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={payroll.status} />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {/* View button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewDetail(payroll.paymentId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </motion.button>

                        {/* 🆕 TEACHER: Reject button - Chỉ hiện khi status WAITING_TEACHER_CONFIRMATION */}
                        {currentUser.role === 'TEACHER' &&
                          payroll.status === 'WAITING_TEACHER_CONFIRMATION' &&
                          isOwner(payroll.teacherId) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(payroll.paymentId)}
                              disabled={actionLoading === payroll.paymentId}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                              title="Từ chối"
                            >
                              {actionLoading === payroll.paymentId ? (
                                <div className="h-3.5 w-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                            </motion.button>
                          )}

                        {/* TEACHER: Confirm button */}
                        {currentUser.role === 'TEACHER' &&
                          payroll.status === 'WAITING_TEACHER_CONFIRMATION' &&
                          isOwner(payroll.teacherId) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleConfirm(payroll.paymentId)}
                              disabled={actionLoading === payroll.paymentId}
                              className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50"
                              title="Xác nhận"
                            >
                              {actionLoading === payroll.paymentId ? (
                                <div className="h-3.5 w-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                              )}
                            </motion.button>
                          )}

                        {/* 🆕 ADMIN: Regenerate button - Chỉ hiện khi status REJECTED hoặc REQUEST_ADJUSTMENT */}
                        {currentUser.role === 'ADMIN' &&
                          (payroll.status === 'REJECTED' || payroll.status === 'REQUEST_ADJUSTMENT') && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRegenerate(payroll.paymentId)}
                              disabled={actionLoading === payroll.paymentId}
                              className="p-1.5 rounded-lg text-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all disabled:opacity-50"
                              title="Tái tạo"
                            >
                              {actionLoading === payroll.paymentId ? (
                                <div className="h-3.5 w-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <RotateCcw className="w-3.5 h-3.5" />
                              )}
                            </motion.button>
                          )}

                        {/* ADMIN: Finalize button */}
                        {currentUser.role === 'ADMIN' &&
                          payroll.status === 'TEACHER_CONFIRMED' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFinalize(payroll.paymentId)}
                              disabled={actionLoading === payroll.paymentId}
                              className="p-1.5 rounded-lg text-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all disabled:opacity-50"
                              title="Chốt lương"
                            >
                              {actionLoading === payroll.paymentId ? (
                                <div className="h-3.5 w-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Lock className="w-3.5 h-3.5" />
                              )}
                            </motion.button>
                          )}

                        {/* ADMIN: Export Excel button */}
                        {currentUser.role === 'ADMIN' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleExportToExcel(payroll.paymentId)}
                            disabled={actionLoading === payroll.paymentId}
                            className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50"
                            title="Xuất Excel"
                          >
                            {actionLoading === payroll.paymentId ? (
                              <div className="h-3.5 w-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FileText className="w-3.5 h-3.5" />
                            )}
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {payrolls.length === 0 && <EmptyState role={currentUser.role} />}
        </div>
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
                      <p className="text-xl font-semibold text-purple-600">{formatCurrency(selectedPayroll.amount)}đ</p>
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
                        {selectedPayroll.details.map((session: any, idx: number) => (
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
                                  <span>📅 {session.sessionDate}</span>
                                  <span>⏱ {session.workedHours} giờ</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-purple-600">{formatCurrency(session.amount)}đ</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-3 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-all"
                  >
                    Đóng
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayrollListTab;