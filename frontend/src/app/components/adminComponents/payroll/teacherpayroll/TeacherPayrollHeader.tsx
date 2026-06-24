// src/components/teacherComponents/payroll/TeacherPayrollHeader.tsx
import { motion } from 'framer-motion';
import { DollarSign, RefreshCw, User, CalendarDays } from 'lucide-react';

interface TeacherPayrollHeaderProps {
  teacherName: string;
  teacherId: number;
  onRefresh: () => void;
}

export const TeacherPayrollHeader = ({ teacherName, teacherId, onRefresh }: TeacherPayrollHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl btn-gradient from-purple-600 via-purple-500 to-indigo-600 shadow-md shadow-purple-200"
    >
      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
      
      <div className="relative px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shadow-sm">
            <DollarSign size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight">
              Bảng lương của tôi
            </h1>
           
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRefresh}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
          title="Làm mới"
        >
          <RefreshCw size={15} />
        </motion.button>
      </div>
    </motion.div>
  );
};