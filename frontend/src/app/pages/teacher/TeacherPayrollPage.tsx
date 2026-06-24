// src/pages/payroll/teacher/TeacherPayrollPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, FileText, AlertCircle } from 'lucide-react';
import { payrollApi } from '../../utils/api/payroll.api';
import { teacherApi } from '../../utils/api';
import type { TeacherPayrollSummary, PayrollDetailResponse, TeacherPayrollRejectRequest } from '../../utils/types/payroll';
import { TeacherPayrollHeader } from '../../components/adminComponents/payroll/teacherpayroll/TeacherPayrollHeader';
import { TeacherPayrollStats } from '../../components/adminComponents/payroll/teacherpayroll/TeacherPayrollStats';
import { TeacherPayrollToolbar } from '../../components/adminComponents/payroll/teacherpayroll/TeacherPayrollToolbar';
import { TeacherPayrollTableRow } from '../../components/adminComponents/payroll/teacherpayroll/TeacherPayrollTableRow';
import { PayrollDetailDrawer } from '../../components/adminComponents/payroll/teacherpayroll/TeacherPayrollDetailDrawer';
import { ConfirmPayrollModal } from '../../components/adminComponents/payroll/teacherpayroll/TeacherPayrollConfirmModal';
import { useOutletContext } from 'react-router-dom';
import { RejectPayrollModal } from '../../components/adminComponents/payroll/teacherpayroll/RejectPayrollModal';

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const loadingVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const TeacherPayrollPage = () => {
  const [payrolls, setPayrolls] = useState<TeacherPayrollSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollDetailResponse | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmingPaymentId, setConfirmingPaymentId] = useState<number | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [teacherName, setTeacherName] = useState('');
  const [isLoadingTeacher, setIsLoadingTeacher] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<number | string>('all');
  const [yearFilter, setYearFilter] = useState<number | string>('all');
  const { setAlert } = useOutletContext<any>();
  // Hàm lấy teacherId từ API (GIỮ NGUYÊN LOGIC)
  const fetchTeacherIdFromAPI = useCallback(async (userId: number): Promise<number | null> => {
    try {
      console.log('Calling API getTeacherIdByUserId with userId:', userId);
      const response = await teacherApi.getTeacherIdByUserId(userId);
      console.log('API response:', response);

      if (response && typeof response === 'object') {
        if (response.data && typeof response.data === 'object') {
          if (response.data.teacherId) return response.data.teacherId;
          if (response.data.id) return response.data.id;
        }
        if (response.teacherId) return response.teacherId;
        if (response.userId) return response.userId;
      }

      if (typeof response === 'number') return response;

      console.error('Cannot extract teacherId from response:', response);
      return null;
    } catch (error) {
      console.error('API call failed:', error);
      return null;
    }
  }, []);

  // Lấy thông tin giáo viên (GIỮ NGUYÊN LOGIC)
  useEffect(() => {
    const getTeacherInfo = async () => {
      setIsLoadingTeacher(true);
      setApiError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setApiError('Không tìm thấy token đăng nhập');
          setIsLoadingTeacher(false);
          return;
        }

        let userId: number | null = null;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Decoded token payload:', payload);
          userId = payload.userId || payload.id || payload.sub;

          if (!userId) {
            setApiError('Token không chứa userId');
            setIsLoadingTeacher(false);
            return;
          }
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          setApiError('Token không hợp lệ');
          setIsLoadingTeacher(false);
          return;
        }

        const teacherIdValue = await fetchTeacherIdFromAPI(userId);

        if (teacherIdValue) {
          console.log('Successfully got teacherId:', teacherIdValue);
          setTeacherId(teacherIdValue);

          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            setTeacherName(user.fullName || user.name || `Giáo viên ${teacherIdValue}`);
          } else {
            setTeacherName(`Giáo viên ${teacherIdValue}`);
          }

          localStorage.setItem('teacherId', teacherIdValue.toString());
        } else {
          setApiError('Không thể lấy teacherId từ API');
        }
      } catch (error) {
        console.error('Error in getTeacherInfo:', error);
        setApiError('Có lỗi xảy ra khi lấy thông tin giáo viên');
      } finally {
        setIsLoadingTeacher(false);
      }
    };

    getTeacherInfo();
  }, [fetchTeacherIdFromAPI]);

  // Lấy danh sách bảng lương (GIỮ NGUYÊN LOGIC)
  const fetchPayrolls = useCallback(async () => {
    if (!teacherId) return;

    setLoading(true);
    try {
      console.log('Fetching payrolls for teacherId:', teacherId);
      const data = await payrollApi.getMyPayrolls(teacherId);
      console.log('Payrolls received:', data);
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch payrolls error:', error);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      fetchPayrolls();
    }
  }, [teacherId, fetchPayrolls]);

  // Lọc dữ liệu (GIỮ NGUYÊN LOGIC)
  const filteredPayrolls = payrolls.filter(payroll => {
    if (monthFilter !== 'all' && payroll.month !== monthFilter) return false;
    if (yearFilter !== 'all' && payroll.year !== yearFilter) return false;

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const matchMonth = payroll.month.toString().includes(keyword);
      const matchYear = payroll.year.toString().includes(keyword);
      const matchPeriod = `${payroll.month}/${payroll.year}`.includes(keyword);
      if (!matchMonth && !matchYear && !matchPeriod) return false;
    }

    if (statusFilter && statusFilter !== 'all') {
      if (payroll.status !== statusFilter) return false;
    }

    return true;
  });

  // Thống kê (GIỮ NGUYÊN LOGIC)
  const stats = {
    totalPayrolls: payrolls.length,
    totalAmount: payrolls.reduce((sum, p) => sum + p.amount, 0),
    totalSessions: payrolls.reduce((sum, p) => sum + p.totalSessions, 0),
    pendingCount: payrolls.filter(p => p.status === 'WAITING_TEACHER_CONFIRMATION').length,
    confirmedCount: payrolls.filter(p => p.status === 'TEACHER_CONFIRMED').length,
    finalizedCount: payrolls.filter(p => p.status === 'FINALIZED').length,
  };

  // Handlers (GIỮ NGUYÊN LOGIC)
  const handleViewDetail = async (paymentId: number) => {
    if (!teacherId) return;

    setDetailLoading(true);
    setIsDetailDrawerOpen(true);
    try {
      const detail = await payrollApi.getMyPayrollDetail(paymentId, teacherId);
      setSelectedPayroll(detail);
    } catch (error) {
      console.error('Get detail error:', error);
      setSelectedPayroll(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleConfirmPayroll = async (paymentId: number) => {
    setConfirmingPaymentId(paymentId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!confirmingPaymentId) return;

    setConfirmLoading(true);
    try {
      await payrollApi.confirmPayroll({
        paymentId: confirmingPaymentId,
        teacherFeedback: 'Tôi xác nhận bảng lương này là chính xác.'
      });

      await fetchPayrolls();

      if (selectedPayroll?.paymentId === confirmingPaymentId && teacherId) {
        const updatedDetail = await payrollApi.getMyPayrollDetail(confirmingPaymentId, teacherId);
        setSelectedPayroll(updatedDetail);
      }

      setIsConfirmModalOpen(false);
      setAlert?.({
        type: 'success',
        message: 'Xác nhận bảng lương thành công'
      });
    } catch (error: any) {
      console.error('Confirm error:', error);
      setAlert?.({
        type: 'error',
        message: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau'
      });
    } finally {
      setConfirmLoading(false);
      setConfirmingPaymentId(null);
    }
  };

  const handleRejectPayroll = (paymentId: number) => {
    setRejectingPaymentId(paymentId);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectingPaymentId) return;

    if (!rejectReason.trim()) {
      setAlert?.({
        type: 'error',
        message: 'Vui lòng nhập lý do từ chối'
      });
      return;
    }

    setRejectLoading(true);
    try {
      const request: TeacherPayrollRejectRequest = {
        paymentId: rejectingPaymentId,
        reason: rejectReason.trim()
      };

      await payrollApi.rejectPayroll(request);

      await fetchPayrolls();

      if (selectedPayroll?.paymentId === rejectingPaymentId && teacherId) {
        const updatedDetail = await payrollApi.getMyPayrollDetail(rejectingPaymentId, teacherId);
        setSelectedPayroll(updatedDetail);
      }

      setIsRejectModalOpen(false);
      setAlert?.({
        type: 'success',
        message: 'Đã từ chối bảng lương thành công'
      });
    } catch (error: any) {
      console.error('Reject error:', error);
      setAlert?.({
        type: 'error',
        message: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau'
      });
    } finally {
      setRejectLoading(false);
      setRejectingPaymentId(null);
      setRejectReason('');
    }
  };

  const handleRefresh = () => {
    fetchPayrolls();
  };

  const handleExport = () => {
    if (!teacherId) return;

    const exportData = {
      teacherId: teacherId,
      teacherName: teacherName,
      exportedAt: new Date().toISOString(),
      payrolls: filteredPayrolls,
      summary: stats
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date();
    a.download = `payroll_${teacherId}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (isLoadingTeacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <motion.div
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-200 border-t-purple-600 mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-purple-100 animate-pulse" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">Đang tải thông tin giáo viên...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (apiError || !teacherId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-700 mb-1">Không thể tải thông tin giáo viên</h2>
          <p className="text-xs text-slate-400 mb-4">{apiError || 'Không tìm thấy teacherId'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all"
          >
            Thử lại
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6 sm:py-8 space-y-5">
        {/* Header */}
        <TeacherPayrollHeader
          teacherName={teacherName}
          teacherId={teacherId}
          onRefresh={handleRefresh}
        />

        {/* Stats Cards */}
        <TeacherPayrollStats stats={stats} />

        {/* Toolbar */}
        <TeacherPayrollToolbar
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          monthFilter={monthFilter}
          onMonthChange={setMonthFilter}
          yearFilter={yearFilter}
          onYearChange={setYearFilter}
          onExport={handleExport}
          onRefresh={handleRefresh}
        />

        {/* Payroll List Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
                <FileText size={13} className="text-purple-500" />
              </div>
              <h2 className="text-sm font-semibold text-slate-700">Bảng lương của tôi</h2>
              {filteredPayrolls.length > 0 && (
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {filteredPayrolls.length}
                </span>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center"
              >
                <div className="inline-block h-6 w-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                <p className="mt-2 text-xs text-slate-400">Đang tải dữ liệu...</p>
              </motion.div>
            ) : filteredPayrolls.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <DollarSign size={22} className="text-slate-300" />
                </div>
                <p className="text-sm text-slate-500">Chưa có bảng lương nào</p>
                <p className="text-xs text-slate-400 mt-1">
                  {searchKeyword || statusFilter !== 'all' ? 'Thử thay đổi bộ lọc tìm kiếm' : 'Liên hệ quản trị viên để được hỗ trợ'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                <AnimatePresence>
                  {filteredPayrolls.map((payroll) => (
                    <TeacherPayrollTableRow
                      key={payroll.paymentId}
                      payroll={payroll}
                      onViewDetail={handleViewDetail}
                      onConfirm={handleConfirmPayroll}
                      onReject={handleRejectPayroll}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Detail Drawer */}
        <PayrollDetailDrawer
          isOpen={isDetailDrawerOpen}
          onClose={() => {
            setIsDetailDrawerOpen(false);
            setSelectedPayroll(null);
          }}
          payroll={selectedPayroll}
          loading={detailLoading}
          onConfirm={() => {
            if (selectedPayroll) {
              setIsDetailDrawerOpen(false);
              handleConfirmPayroll(selectedPayroll.paymentId);
            }
          }}
          onReject={() => { // ✅ THÊM MỚI
            if (selectedPayroll) {
              setIsDetailDrawerOpen(false);
              handleRejectPayroll(selectedPayroll.paymentId);
            }
          }}
        />

        {/* Confirm Modal */}
        <ConfirmPayrollModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setConfirmingPaymentId(null);
          }}
          onConfirm={handleConfirmSubmit}
          loading={confirmLoading}
          payroll={selectedPayroll}
        />
        <RejectPayrollModal
          isOpen={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setRejectingPaymentId(null);
            setRejectReason('');
          }}
          onConfirm={handleRejectSubmit}
          loading={rejectLoading}
          reason={rejectReason}
          onReasonChange={setRejectReason}
          payroll={selectedPayroll}
        />
      </div>
    </motion.div>
  );
};