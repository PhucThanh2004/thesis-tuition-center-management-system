// src/components/adminComponents/leaves/teacher/SubstituteStats.tsx
import { motion } from 'framer-motion';
import { Bell, CheckCircle, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  footer?: React.ReactNode;
  suffix?: string;
}

const StatCard = ({ title, value, icon, bgColor, iconColor, footer, suffix }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-800">
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          {suffix && <span className="text-sm font-normal text-gray-500 ml-0.5">{suffix}</span>}
        </h3>
      </div>
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
    </div>
    {footer && <div className="mt-3 text-xs text-gray-400">{footer}</div>}
  </motion.div>
);

interface SubstituteStatsProps {
  pending: number;
  accepted: number;
  income: number;
}

export const SubstituteStats = ({ pending, accepted, income }: SubstituteStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Chờ phản hồi"
        value={pending}
        icon={<Bell size={18} />}
        bgColor="bg-orange-50"
        iconColor="text-orange-500"
        footer="Yêu cầu dạy thay"
      />
      <StatCard
        title="Đã nhận dạy"
        value={accepted}
        icon={<CheckCircle size={18} />}
        bgColor="bg-green-50"
        iconColor="text-green-600"
        footer="Hoàn thành xuất sắc"
      />
      <StatCard
        title="Thu nhập dạy thay"
        value={income}
        icon={<DollarSign size={18} />}
        bgColor="bg-emerald-50"
        iconColor="text-emerald-600"
        suffix="đ"
        footer="Tạm tính"
      />
    </div>
  );
};