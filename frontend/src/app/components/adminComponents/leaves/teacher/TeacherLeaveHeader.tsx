// src/components/adminComponents/leaves/teacher/TeacherLeaveHeader.tsx
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

interface TeacherLeaveHeaderProps {
  pendingCount: number;
}

export const TeacherLeaveHeader = ({ pendingCount }: TeacherLeaveHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="btn-gradient from-purple-600 to-purple-500 rounded-2xl p-6 text-white shadow-lg"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-white/20 p-2 rounded-xl"
            >
              <CalendarDays size={28} className="text-white" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold">Đơn xin nghỉ dạy</h1>
          </div>
          <p className="text-white/80 text-sm md:text-base max-w-2xl">
            Quản lý các yêu cầu nghỉ giảng dạy của bạn. Tạo đơn mới, theo dõi trạng thái và xem lịch sử.
          </p>
        </div>
        
        {pendingCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 rounded-full bg-yellow-400"
            />
            <span className="font-semibold">{pendingCount} đơn chờ duyệt</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};