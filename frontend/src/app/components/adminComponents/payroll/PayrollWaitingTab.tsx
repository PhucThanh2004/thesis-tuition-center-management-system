import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  User, 
  Info, 
  Shield, 
  Bell, 
  Eye,
  FileCheck, // ✅ ĐÃ THÊM IMPORT
  XCircle,   // ✅ THÊM MỚI: Icon cho nút từ chối
  RefreshCw  // ✅ THÊM MỚI: Icon cho loading
} from 'lucide-react';
import { payrollApi } from '../../../utils/api/payroll.api';
import type { 
  PayrollListItem,
} from '../../../utils/types/payroll';
import { useOutletContext } from 'react-router-dom'; // ✅ ĐÃ THÊM IMPORT
import './payroll.css';

interface PayrollWaitingTabProps {
  refreshTrigger: number;
}

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const infoCardVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 } },
};

// Skeleton loader
const WaitingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-40 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-10 w-28 bg-slate-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
    <div className="h-64 rounded-2xl bg-white border border-slate-200 shadow-sm p-6 animate-pulse" />
  </div>
);

// Empty state component
const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-2xl bg-white border border-slate-200 shadow-sm p-12 text-center"
  >
    <div className="flex justify-center mb-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
        <Clock className="h-8 w-8 text-slate-300" />
      </div>
    </div>
    <h3 className="text-base font-semibold text-slate-700 mb-1">Không có bảng lương chờ xác nhận</h3>
    <p className="text-xs text-slate-400 max-w-sm mx-auto">
      Hiện không có bảng lương nào đang chờ giáo viên xác nhận.
    </p>
  </motion.div>
);

const WaitingPayrollCard: React.FC<{
  payroll: PayrollListItem;
  index: number;
}> = ({ payroll, index }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden"
    >
      {/* Status bar - màu vàng nhạt cho trạng thái chờ */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500" />

      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Icon & Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h5 className="font-semibold text-sm text-slate-800 truncate">
                Bảng lương tháng {payroll.month}/{payroll.year}
              </h5>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-600 flex-shrink-0">
                <Bell className="h-2.5 w-2.5" />
                Chờ xác nhận
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mb-1">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{payroll.teacherName}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{payroll.totalSessions} buổi</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(payroll.paymentDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-600">{formatCurrency(payroll.amount)}đ</span>
            </div>
          </div>
        </div>

        {/* Right: Badge thông báo - chỉ hiển thị trạng thái */}
        <div className="flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <Eye className="h-3 w-3" />
            Chờ giáo viên xác nhận
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Info widget component - hướng dẫn cho ADMIN
const AdminInfoWidget: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => (
  <motion.div
    variants={infoCardVariants}
    initial="hidden"
    animate="visible"
    className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden sticky top-6"
  >
    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <Shield className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700">Hướng dẫn</h4>
            <p className="text-[10px] text-slate-400">Xử lý bảng lương</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          title="Làm mới"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="h-3 w-3 text-emerald-600" />
        </div>
        <p className="text-xs text-slate-500">
          <strong className="text-emerald-600">Xác nhận:</strong> Giáo viên đồng ý với bảng lương. 
          Sau đó bạn có thể <strong className="text-purple-600">chốt lương</strong>.
        </p>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="h-3 w-3 text-red-600" />
        </div>
        <p className="text-xs text-slate-500">
          <strong className="text-red-600">Từ chối:</strong> Giáo viên không đồng ý. 
          Bảng lương sẽ chuyển sang trạng thái <strong className="text-red-600">"Từ chối"</strong> 
          và có thể <strong className="text-amber-600">tái tạo</strong> sau.
        </p>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
          <Info className="h-3 w-3 text-blue-600" />
        </div>
        <p className="text-xs text-slate-500">
          <strong className="text-blue-600">Lưu ý:</strong> Hành động này sẽ gửi thông báo 
          đến giáo viên và lưu lịch sử.
        </p>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <Clock className="h-3 w-3" />
          <span>Cập nhật: {new Date().toLocaleString('vi-VN')}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const PayrollWaitingTab: React.FC<PayrollWaitingTabProps> = ({ refreshTrigger }) => {
  const [waitingPayrolls, setWaitingPayrolls] = useState<PayrollListItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchWaitingPayrolls();
  }, [refreshTrigger]);

  const fetchWaitingPayrolls = async () => {
    try {
      setLoading(true);
      const allPayrolls = await payrollApi.getAllPayrolls();

      let waiting = allPayrolls.filter(p => p.status === 'WAITING_TEACHER_CONFIRMATION');

      setWaitingPayrolls(waiting);
    } catch (error) {
      console.error('Failed to fetch waiting payrolls:', error);
      setAlert?.({
        type: 'error',
        message: 'Không thể tải danh sách chờ xác nhận'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <WaitingSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Waiting Payrolls List */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {waitingPayrolls.length > 0 ? (
            <div className="space-y-3">
              {/* Header với số lượng */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700">Chờ xác nhận từ giáo viên</h4>
                    <p className="text-[11px] text-slate-400">{waitingPayrolls.length} bảng lương đang chờ phản hồi</p>
                  </div>
                </div>
                
                <button
                  onClick={fetchWaitingPayrolls}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                  title="Làm mới"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {/* Danh sách card */}
              {waitingPayrolls.map((payroll, idx) => (
                <WaitingPayrollCard
                  key={payroll.paymentId}
                  payroll={payroll}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>
      </div>

      {/* Right: Info Widget */}
      <div className="lg:col-span-1">
        <AdminInfoWidget onRefresh={fetchWaitingPayrolls} />
      </div>
    </div>
  );
};

export default PayrollWaitingTab;