// src/components/teacherComponents/TeacherPayrollInsightCards.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Sparkles, BarChart3 } from 'lucide-react';
import type { TeacherPayrollSummary } from '../../../../utils/types/payroll';

interface TeacherPayrollInsightCardsProps {
  payrolls: TeacherPayrollSummary[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.2 },
  }),
};

const TeacherPayrollInsightCards: React.FC<TeacherPayrollInsightCardsProps> = ({ payrolls }) => {
  const amounts = payrolls.map(p => p.amount);
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
  const avgAmount = amounts.length > 0 ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
  const totalAmount = amounts.reduce((a, b) => a + b, 0);
  const payrollCount = payrolls.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };

  const insights = [
    {
      label: 'Tổng thu nhập',
      value: formatCurrency(totalAmount),
      shortValue: formatShortCurrency(totalAmount),
      icon: <DollarIcon className="text-emerald-500" />,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Cao nhất tháng',
      value: formatCurrency(maxAmount),
      shortValue: formatShortCurrency(maxAmount),
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      color: 'amber',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Trung bình tháng',
      value: formatCurrency(avgAmount),
      shortValue: formatShortCurrency(avgAmount),
      icon: <Award className="w-3.5 h-3.5" />,
      color: 'purple',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Tổng số kỳ',
      value: payrollCount.toString(),
      shortValue: payrollCount.toString(),
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      color: 'blue',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {insights.map((insight, idx) => (
        <motion.div
          key={insight.label}
          custom={idx}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -1 }}
          className={`${insight.bgColor} rounded-xl p-3 border border-${insight.color}-100 transition-all duration-200`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
              {insight.label}
            </span>
            <div className={`flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm`}>
              {insight.icon}
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-base font-semibold text-slate-800">
              {insight.value}
            </p>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              {insight.label === 'Tổng thu nhập' ? 'VNĐ' : insight.label === 'Tổng số kỳ' ? 'kỳ' : '/tháng'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 sm:hidden">
            {insight.shortValue} {insight.label === 'Tổng số kỳ' ? 'kỳ' : 'VNĐ'}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// Helper icon component
const DollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default TeacherPayrollInsightCards;