// src/components/adminComponents/leaves/teacher/LeaveStats.tsx
import { motion } from 'framer-motion';
import { History, Clock, CheckCircle, CalendarX } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  footer?: React.ReactNode;
}

const StatCard = ({ title, value, icon, bgColor, iconColor, footer }: StatCardProps) => (
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
        </h3>
      </div>
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
    </div>
    {footer && <div className="mt-3 text-xs text-gray-400">{footer}</div>}
  </motion.div>
);

interface LeaveStatsProps {
  total: number;
  pending: number;
  approved: number;
  affectedSessions: number;
}

export const TeacherLeaveStats = ({ total, pending, approved, affectedSessions }: LeaveStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Tổng đơn nghỉ"
        value={total}
        icon={<History size={18} />}
        bgColor="bg-purple-50"
        iconColor="text-purple-600"
        footer="Tất cả đơn đã gửi"
      />
      <StatCard
        title="Đang chờ duyệt"
        value={pending}
        icon={<Clock size={18} />}
        bgColor="bg-amber-50"
        iconColor="text-amber-600"
        footer={pending > 0 ? 'Cần theo dõi' : 'Không có đơn chờ'}
      />
      <StatCard
        title="Đã duyệt"
        value={approved}
        icon={<CheckCircle size={18} />}
        bgColor="bg-green-50"
        iconColor="text-green-600"
        footer={`Tỷ lệ: ${total > 0 ? Math.round((approved / total) * 100) : 0}%`}
      />
      <StatCard
        title="Buổi học ảnh hưởng"
        value={affectedSessions}
        icon={<CalendarX size={18} />}
        bgColor="bg-red-50"
        iconColor="text-red-500"
        footer="Từ các đơn đã duyệt"
      />
    </div>
  );
};