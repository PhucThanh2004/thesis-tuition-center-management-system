// src/components/teacherComponents/payroll/TeacherPayrollStats.tsx
import { motion, type Variants } from 'framer-motion';
import { DollarSign, Calendar, CheckCircle, Clock, TrendingUp, Award } from 'lucide-react';

interface TeacherPayrollStatsProps {
  stats: {
    totalPayrolls: number;
    totalAmount: number;
    totalSessions: number;
    pendingCount: number;
    confirmedCount: number;
    finalizedCount: number;
  };
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: 'easeOut' },
  }),
};

export const TeacherPayrollStats = ({ stats }: TeacherPayrollStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };

  const statCards = [
    {
      title: 'Tổng thu nhập',
      value: formatCurrency(stats.totalAmount),
      compactValue: formatCompactCurrency(stats.totalAmount),
      icon: DollarSign,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Tổng số buổi',
      value: `${stats.totalSessions} buổi`,
      compactValue: `${stats.totalSessions}`,
      icon: Calendar,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Chờ xác nhận',
      value: stats.pendingCount,
      compactValue: stats.pendingCount,
      icon: Clock,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100',
      badge: stats.pendingCount > 0 ? `${stats.pendingCount} chờ` : null,
    },
    {
      title: 'Đã chốt',
      value: stats.finalizedCount,
      compactValue: stats.finalizedCount,
      icon: CheckCircle,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-100',
    },
  ];

  // Tính thêm chỉ số phụ
  const completionRate = stats.totalPayrolls > 0 
    ? Math.round((stats.finalizedCount / stats.totalPayrolls) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -1 }}
            className={`bg-white rounded-xl p-4 border ${card.borderColor} shadow-sm transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                {card.title}
              </span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.bgColor}`}>
                <card.icon size={14} className={card.textColor} />
              </div>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {card.value}
              </p>
              {card.badge && (
                <span className="inline-flex items-center mt-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                  {card.badge}
                </span>
              )}
            </div>
            
            {/* Compact value for mobile */}
            <p className="text-[10px] text-slate-400 mt-1 lg:hidden">
              {card.compactValue} {card.title === 'Tổng thu nhập' ? 'VNĐ' : ''}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Insight Row - Premium */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100"
      >
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-slate-400" />
          <span className="text-[11px] text-slate-500">Tiến độ hoàn thành:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full btn-gradient from-purple-500 to-purple-600 rounded-full"
              />
            </div>
            <span className="text-xs font-medium text-purple-600">{completionRate}%</span>
          </div>
        </div>
        
        <div className="w-px h-4 bg-slate-200 hidden sm:block" />
        
        <div className="flex items-center gap-1.5">
          <Award size={12} className="text-slate-400" />
          <span className="text-[11px] text-slate-500">Đã xác nhận:</span>
          <span className="text-xs font-medium text-blue-600">{stats.confirmedCount}</span>
          <span className="text-[11px] text-slate-400">/ {stats.totalPayrolls}</span>
        </div>
        
        <div className="w-px h-4 bg-slate-200 hidden sm:block" />
        
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {stats.pendingCount > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-medium text-amber-600">
                {stats.pendingCount}
              </div>
            )}
            {stats.confirmedCount > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-medium text-blue-600">
                {stats.confirmedCount}
              </div>
            )}
            {stats.finalizedCount > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-[10px] font-medium text-purple-600">
                {stats.finalizedCount}
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400">đã xử lý</span>
        </div>
      </motion.div>
    </div>
  );
};