// src/components/payroll/PayrollPaidTab.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import {
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Award,
  FileCheck,
  Sparkles,
  BarChart3,
  Clock,
  User,
  Receipt,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { payrollApi } from '../../../utils/api/payroll.api';
import type { PayrollListItem } from '../../../utils/types/payroll';
import './payroll.css';

interface PayrollPaidTabProps {
  refreshTrigger: number;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' },
  }),
};

const statsCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.3, ease: 'easeOut' },
  }),
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

// Skeleton loader
const PaidSkeleton: React.FC = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="rounded-xl bg-white border border-slate-200 shadow-sm p-4 animate-pulse">
          <div className="h-2.5 w-20 bg-slate-200 rounded mb-2" />
          <div className="h-7 w-24 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="rounded-xl bg-white border border-slate-200 shadow-sm p-4 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="space-y-1.5">
                <div className="h-2.5 w-16 bg-slate-200 rounded" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="h-5 w-24 bg-slate-200 rounded" />
              <div className="h-2.5 w-16 bg-slate-200 rounded ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'purple' | 'amber';
  index: number;
}> = ({ title, value, subtitle, icon, color, index }) => {
  const colorClasses = {
    emerald: { bg: 'from-emerald-50 to-white', iconBg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
    blue: { bg: 'from-blue-50 to-white', iconBg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
    purple: { bg: 'from-purple-50 to-white', iconBg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' },
    amber: { bg: 'from-amber-50 to-white', iconBg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
  };
  const colors = colorClasses[color];

  return (
    <motion.div
      custom={index}
      variants={statsCardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} shadow-sm overflow-hidden group`}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/0 to-white/50 rounded-full blur-xl" />
      <div className="relative p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className={`text-xl font-semibold ${colors.text}`}>{value}</p>
            {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className={`h-8 w-8 rounded-lg ${colors.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Paid Payroll Card Component - Cập nhật hiển thị
const PaidPayrollCard: React.FC<{
  payroll: PayrollListItem;
  index: number;
}> = ({ payroll, index }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  // 🔥 Tính toán số tiền đã thanh toán và còn lại
  const paidAmount = payroll.paidAmount || 0;
  const remainingAmount = payroll.amount - paidAmount;
  const isPartial = payroll.status === 'PARTIAL_PAID';

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01, y: -1 }}
      className="group relative rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
        isPartial ? 'from-amber-400 to-amber-500' : 'from-emerald-400 to-emerald-500'
      }`} />

      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className={`h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
              isPartial ? 'from-amber-100 to-amber-50' : 'from-emerald-100 to-emerald-50'
            }`}>
              <DollarSign className={`h-5 w-5 ${isPartial ? 'text-amber-600' : 'text-emerald-600'}`} />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                Tháng {payroll.month}/{payroll.year}
              </p>
              {!isPartial ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                  <CheckCircle className="h-2.5 w-2.5" />
                  Đã thanh toán
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                  <AlertCircle className="h-2.5 w-2.5" />
                  Thanh toán 1 phần
                </span>
              )}
              {payroll.revisionNo && payroll.revisionNo > 1 && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                  <Clock className="h-2.5 w-2.5" />
                  v{payroll.revisionNo}
                </span>
              )}
            </div>
            <h5 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {payroll.teacherName}
            </h5>
          </div>
        </div>

        <div className="sm:text-right">
          {/* 🔥 Tổng lương */}
          <p className={`text-lg font-semibold ${isPartial ? 'text-amber-600' : 'text-emerald-600'}`}>
            {formatCurrency(payroll.amount)}đ
          </p>
          
          {/* 🔥 Hiển thị chi tiết thanh toán cho PARTIAL_PAID */}
          {isPartial ? (
            <div className="flex flex-col items-end gap-0.5 mt-1">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400">Đã thanh toán:</span>
                <span className="font-medium text-emerald-600">{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400">Còn lại:</span>
                <span className="font-medium text-amber-600">{formatCurrency(remainingAmount)}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" />
                  {payroll.totalSessions} buổi
                </span>
                <span className="flex items-center gap-0.5">
                  <Receipt className="h-3 w-3" />
                  {formatDate(payroll.paymentDate)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-0.5">
                <Calendar className="h-3 w-3" />
                {payroll.totalSessions} buổi
              </span>
              <span className="flex items-center gap-0.5">
                <Receipt className="h-3 w-3" />
                {formatDate(payroll.paymentDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-emerald-50/0 to-emerald-100/0 group-hover:via-emerald-50/10 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

// Empty state component
const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-xl bg-white border border-slate-200 shadow-sm p-8 text-center"
  >
    <div className="flex justify-center mb-3">
      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
        <DollarSign className="h-7 w-7 text-slate-300" />
      </div>
    </div>
    <h3 className="text-sm font-medium text-slate-700 mb-1">Chưa có bảng lương nào được thanh toán</h3>
    <p className="text-xs text-slate-400 max-w-sm mx-auto">
      Khi bảng lương được chốt và xác nhận thanh toán, chúng sẽ xuất hiện tại đây.
    </p>
  </motion.div>
);

const PayrollPaidTab: React.FC<PayrollPaidTabProps> = ({ refreshTrigger }) => {
  const [paidPayrolls, setPaidPayrolls] = useState<PayrollListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setAlert } = useOutletContext<any>();

  const [stats, setStats] = useState({
    totalAmount: 0,
    totalPaidAmount: 0,
    averageAmount: 0,
    totalTeachers: 0,
    totalPayrolls: 0,
    totalSessions: 0,
    fullyPaidCount: 0,
    partialPaidCount: 0
  });

  useEffect(() => {
    fetchPaidPayrolls();
  }, [refreshTrigger]);

  const fetchPaidPayrolls = async () => {
    try {
      setLoading(true);
      const allPayrolls = await payrollApi.getAllPayrolls();
      const paid = allPayrolls.filter(p => p.status === 'PAID' || p.status === 'PARTIAL_PAID');
      setPaidPayrolls(paid);

      const totalAmount = paid.reduce((sum, p) => sum + p.amount, 0);
      const totalPaidAmount = paid.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
      const totalSessions = paid.reduce((sum, p) => sum + p.totalSessions, 0);
      
      setStats({
        totalAmount,
        totalPaidAmount,
        averageAmount: paid.length > 0 ? totalAmount / paid.length : 0,
        totalTeachers: new Set(paid.map(p => p.teacherId)).size,
        totalPayrolls: paid.length,
        totalSessions,
        fullyPaidCount: paid.filter(p => p.status === 'PAID').length,
        partialPaidCount: paid.filter(p => p.status === 'PARTIAL_PAID').length
      });
    } catch (error) {
      console.error('Failed to fetch paid payrolls:', error);
      setAlert?.({
        type: 'error',
        message: 'Không thể tải dữ liệu đã thanh toán'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  if (loading) {
    return <PaidSkeleton />;
  }

  const totalInMillions = (stats.totalAmount / 1000000).toFixed(0);
  const averageInMillions = (stats.averageAmount / 1000000).toFixed(1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={cardVariants} custom={0} className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-700">Bảng lương đã thanh toán</h3>
          <p className="text-[10px] text-slate-400">
            Danh sách các bảng lương đã được thanh toán
            {stats.partialPaidCount > 0 && (
              <span className="text-amber-500 ml-1">
                ({stats.partialPaidCount} bảng thanh toán 1 phần)
              </span>
            )}
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          title="Tổng bảng lương"
          value={stats.totalPayrolls}
          subtitle={`${stats.fullyPaidCount} đã thanh toán đủ, ${stats.partialPaidCount} thanh toán 1 phần`}
          icon={<FileCheck className="h-4 w-4 text-emerald-600" />}
          color="emerald"
          index={0}
        />

        <KPICard
          title="Tổng chi trả"
          value={`${totalInMillions}M`}
          subtitle={`≈ ${formatCurrency(stats.totalAmount)}`}
          icon={<DollarSign className="h-4 w-4 text-blue-600" />}
          color="blue"
          index={1}
        />

        <KPICard
          title="Giáo viên"
          value={stats.totalTeachers}
          subtitle="người đã nhận lương"
          icon={<Users className="h-4 w-4 text-purple-600" />}
          color="purple"
          index={2}
        />

        <KPICard
          title="Tổng buổi dạy"
          value={stats.totalSessions}
          subtitle="buổi đã thanh toán"
          icon={<Calendar className="h-4 w-4 text-amber-600" />}
          color="amber"
          index={3}
        />
      </div>

      {/* Quick stats */}
      <motion.div
        variants={cardVariants}
        custom={4}
        className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
      >
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] text-slate-500">Thống kê:</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-500">Trung bình: {averageInMillions}M/bảng</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-[10px] text-slate-500">{stats.totalTeachers} giáo viên</span>
          </div>
          {stats.partialPaidCount > 0 && (
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="text-[10px] text-slate-500">{stats.partialPaidCount} bảng thanh toán 1 phần</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Paid Payrolls List */}
      <div className="space-y-2">
        <AnimatePresence>
          {paidPayrolls.length > 0 ? (
            paidPayrolls.map((payroll, idx) => (
              <PaidPayrollCard
                key={payroll.paymentId}
                payroll={payroll}
                index={idx}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>
      </div>

      {/* Footer insight */}
      {paidPayrolls.length > 0 && (
        <motion.div
          variants={cardVariants}
          custom={paidPayrolls.length}
          className="flex items-center justify-center gap-1.5 py-2 text-[10px] text-slate-400 border-t border-slate-100 mt-2"
        >
          <Sparkles className="h-3 w-3 text-emerald-500" />
          <span>Tổng giá trị đã thanh toán: {totalInMillions} triệu VNĐ</span>
          <span className="mx-1">•</span>
          <span>{paidPayrolls.length} bảng lương</span>
          {stats.partialPaidCount > 0 && (
            <>
              <span className="mx-1">•</span>
              <span className="text-amber-500">{stats.partialPaidCount} bảng thanh toán 1 phần</span>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PayrollPaidTab;