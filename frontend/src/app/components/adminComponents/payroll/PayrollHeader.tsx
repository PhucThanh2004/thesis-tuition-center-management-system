import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Users, TrendingUp } from 'lucide-react';
import './payroll.css';

interface PayrollHeaderProps {
  onCreatePayroll: () => void;
}

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const PayrollHeader: React.FC<PayrollHeaderProps> = ({ onCreatePayroll }) => {
  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm"
    >
      {/* Decorative elements - nhẹ nhàng, không gây rối */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 opacity-50" />

      {/* Subtle pattern - rất nhẹ, dùng tailwind chuẩn */}
      <div className="absolute inset-0 bg-[radial-gradient(#7C3AED_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none" />

      <div className="relative px-5 py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Left: Title & Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            {/* Icon container - dùng gradient nhẹ */}
            <div className="relative">
              <div className="absolute inset-0 bg-purple-200 rounded-lg blur-sm opacity-50" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/50">
                <Shield size={15} className="text-purple-600" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-800 tracking-tight">
                Quản lý bảng lương giáo viên
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                <div className="flex items-center gap-1">
                  <Users size={10} className="text-slate-400" />
                  <span className="text-[11px] text-slate-400">Quản trị</span>
                </div>
                <div className="w-px h-3 bg-slate-200" />
                <div className="flex items-center gap-1">
                  <TrendingUp size={10} className="text-slate-400" />
                  <span className="text-[11px] text-slate-400">Theo dõi lương</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed pl-10">
            Kiểm tra, xác nhận và chốt lương giáo viên theo từng kỳ thanh toán một cách minh bạch và chính xác nhất.
          </p>
        </div>
      </div>
    </motion.header>
  );
};

export default PayrollHeader;