import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Clock, Folder, CheckCircle, CreditCard, TrendingUp, AlertCircle, XCircle } from 'lucide-react'; // ✅ THÊM XCircle
import type { PayrollStats as StatsType } from '../../../utils/types/payroll';
import './payroll.css';

interface PayrollStatsProps {
  stats: StatsType | null;
  loading: boolean;
}

// Animation variants for staggered cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

// Skeleton loader cho stats cards
const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 animate-pulse"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-2.5 w-20 bg-slate-200 rounded" />
            <div className="h-7 w-16 bg-slate-200 rounded" />
          </div>
          <div className="h-10 w-10 bg-slate-200 rounded-lg" />
        </div>
        <div className="mt-4 h-10 bg-slate-100 rounded-lg" />
      </div>
    ))}
  </div>
);

// Mini sparkline component
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const height = 28;
  const width = 90;
  const step = width / (data.length - 1);
  const points = data.map((value, i) => `${i * step},${height - (value / 100) * height}`).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`${color}15`}
      />
    </svg>
  );
};

const PayrollStats: React.FC<PayrollStatsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return <StatsSkeleton />;
  }

  // ✅ SỬA: Tính toán các giá trị hiển thị theo BE mới
  const totalPayrolls = stats.totalPayrolls || 0;
  const waitingCount = stats.waitingConfirmationCount || 0;
  const confirmedCount = stats.confirmedCount || 0;
  const rejectedCount = stats.rejectedCount || 0; // ✅ THÊM
  const finalizedCount = stats.finalizedCount || 0;
  const paidCount = stats.paidCount || 0; // Giữ lại cho phát triển sau
  
  // ✅ SỬA: completionRate tính theo finalizedCount
  const completionRate = totalPayrolls > 0 ? Math.round((finalizedCount / totalPayrolls) * 100) : 0;
  
  const totalAmountInMillions = (stats.totalAmount / 1000000).toFixed(0);
  const paidAmountInMillions = (stats.totalPaidAmount / 1000000).toFixed(0);

  // Sparkline data mô phỏng xu hướng
  const trendData = [30, 45, 55, 62, 70, 78, completionRate];
  const amountTrendData = [20, 35, 45, 58, 68, 75, stats.totalPayrolls > 0 ? 85 : 0];

  // ✅ SỬA: Xác định trạng thái cần chú ý
  const needsAttention = waitingCount > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Card 1: Total Payrolls */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group relative rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 overflow-hidden"
      >
        <div className="absolute inset-0 btn-gradient from-purple-50/0 via-purple-50/0 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1">
                Tổng bảng lương
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-slate-800">
                  {totalPayrolls}
                </span>
                <span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                  {finalizedCount} đã chốt
                </span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <Folder className="h-4 w-4 text-purple-600" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-[11px] text-emerald-600 font-medium">{completionRate}%</span>
              <span className="text-[10px] text-slate-400 ml-0.5">hoàn thành</span>
            </div>
            <div className="h-7 w-20">
              <Sparkline data={trendData} color="#7C3AED" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
              <span>Tiến độ chốt lương</span>
              <span className="font-medium text-purple-600">{completionRate}%</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-full btn-gradient from-purple-500 to-purple-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Chờ xác nhận */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`group relative rounded-xl bg-white border transition-all duration-200 overflow-hidden ${
          needsAttention && waitingCount > 0
            ? 'border-amber-200 shadow-amber-100/50 hover:shadow-amber-200/30'
            : 'border-slate-200 hover:border-amber-200'
        } shadow-sm hover:shadow-md`}
      >
        <div className="absolute inset-0 btn-gradient from-amber-50/0 via-amber-50/0 to-amber-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1">
                Chờ xác nhận
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-slate-800">
                  {waitingCount}
                </span>
                {waitingCount > 0 && (
                  <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <AlertCircle className="h-2.5 w-2.5" />
                    Cần xử lý
                  </span>
                )}
              </div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(Math.min(waitingCount, 3))].map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-5 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[9px] font-medium text-amber-700"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              {waitingCount > 3 && (
                <span className="text-[10px] text-slate-400">+{waitingCount - 3}</span>
              )}
            </div>
            <div className="h-7 w-20">
              <Sparkline data={[60, 45, 50, 40, 35, 30, waitingCount * 10]} color="#F59E0B" />
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-500">
            {waitingCount === 0
              ? '✅ Không có bảng lương chờ xác nhận'
              : `📋 ${waitingCount} bảng lương đang chờ giáo viên phản hồi`}
          </div>
        </div>
      </motion.div>

      {/* 🆕 Card 3: Từ chối (THÊM MỚI) */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`group relative rounded-xl bg-white border transition-all duration-200 overflow-hidden ${
          rejectedCount > 0
            ? 'border-red-200 shadow-red-100/50 hover:shadow-red-200/30'
            : 'border-slate-200 hover:border-red-200'
        } shadow-sm hover:shadow-md`}
      >
        <div className="absolute inset-0 btn-gradient from-red-50/0 via-red-50/0 to-red-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1">
                Từ chối
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-slate-800">
                  {rejectedCount}
                </span>
                {rejectedCount > 0 && (
                  <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <XCircle className="h-2.5 w-2.5" />
                    Cần tái tạo
                  </span>
                )}
              </div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                {rejectedCount === 0
                  ? '✅ Không có bảng lương bị từ chối'
                  : `⚠️ ${rejectedCount} bảng lương cần tái tạo`}
              </span>
            </div>
          </div>

          {rejectedCount > 0 && (
            <div className="mt-2 text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block">
              Cần xử lý ngay
            </div>
          )}
        </div>
      </motion.div>

      {/* Card 4: Đã chốt */}
      <motion.div
        custom={3}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group relative rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 overflow-hidden"
      >
        <div className="absolute inset-0 btn-gradient from-emerald-50/0 via-emerald-50/0 to-emerald-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1">
                Đã chốt
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-slate-800">
                  {finalizedCount}
                </span>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  /{totalPayrolls}
                </span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div className="relative h-12 w-12">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0, 100` }}
                    animate={{ strokeDasharray: `${completionRate}, 100` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-emerald-600">{completionRate}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500">Đã thanh toán</p>
                <p className="text-base font-semibold text-slate-800">{paidCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-between text-[10px]">
            <span className="text-slate-400">Đã chốt: {finalizedCount}</span>
            <span className="text-slate-400">Đã xác nhận: {confirmedCount}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PayrollStats;