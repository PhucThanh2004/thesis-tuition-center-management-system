// src/components/adminComponents/leaves/SessionsSummary.tsx

import { motion } from 'framer-motion';
import { Clock, UserCheck, UserX, XCircle, CheckCircle, TrendingUp } from 'lucide-react';
import type { AffectedSession } from '../../../utils/types/teacherLeave';

interface SessionsSummaryProps {
  sessions: AffectedSession[];
}

interface StatItem {
  label: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const SessionsSummary = ({ sessions }: SessionsSummaryProps) => {
  const stats: StatItem[] = [
    {
      label: 'Chờ phân công',
      value: sessions.filter(s => s.status === 'PENDING').length,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      label: 'Chờ phản hồi',
      value: sessions.filter(s => s.status === 'ASSIGNED').length,
      icon: UserCheck,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      label: 'Đã từ chối',
      value: sessions.filter(s => s.status === 'DECLINED').length,
      icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100'
    },
    {
      label: 'Đã nhận dạy',
      value: sessions.filter(s => s.status === 'RESOLVED').length,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Đã hủy',
      value: sessions.filter(s => s.status === 'SKIPPED').length,
      icon: XCircle,
      color: 'text-slate-400',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-100'
    }
  ];
  
  const total = sessions.length;
  const resolved = sessions.filter(s => s.status === 'RESOLVED' || s.status === 'SKIPPED').length;
  const percentComplete = total > 0 ? Math.round((resolved / total) * 100) : 0;
  
  return (
    <div className="space-y-3.5">
      {/* Progress Bar - Premium */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-purple-500" />
            <span className="text-[11px] font-medium text-slate-600">Tiến độ xử lý</span>
          </div>
          <span className="text-sm font-semibold text-purple-600">{percentComplete}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentComplete}%` }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[10px] text-slate-400">
            <span className="font-medium text-slate-600">{resolved}</span>/{total} buổi đã xử lý
          </p>
          {percentComplete === 100 && (
            <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <CheckCircle size={9} />
              Hoàn thành
            </span>
          )}
        </div>
      </div>
      
      {/* Stats Grid - Premium Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.25 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={`${stat.bgColor} ${stat.borderColor} rounded-lg p-2.5 text-center border transition-all duration-200`}
          >
            <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${stat.bgColor} mx-auto mb-1`}>
              <stat.icon size={14} className={stat.color} />
            </div>
            <p className="text-base font-semibold text-slate-700">{stat.value}</p>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};