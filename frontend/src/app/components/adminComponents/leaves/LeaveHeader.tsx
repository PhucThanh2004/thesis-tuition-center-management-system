// src/app/components/leaves/LeaveHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, CalendarDays } from 'lucide-react';

interface LeaveHeaderProps {
  onCreateRequest: () => void;
}

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const LeaveHeader: React.FC<LeaveHeaderProps> = ({ onCreateRequest }) => {
  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
            <CalendarDays size={16} className="text-purple-600" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            Quản lý lịch nghỉ giáo viên
          </h1>
        </div>
        <p className="text-xs text-slate-400 pl-10">
          Hệ thống phê duyệt và theo dõi nhân sự tự động
        </p>
      </div>
    </motion.header>
  );
};