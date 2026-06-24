// src/app/components/adminComponents/leaves/QuickActions.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Download, Sparkles, FileSpreadsheet } from 'lucide-react';

interface QuickActionsProps {
  onQuickCreate: () => void;
  onExport: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.05, duration: 0.3 },
  }),
  hover: { 
    scale: 1.01,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 },
};

export const QuickActions: React.FC<QuickActionsProps> = ({ onQuickCreate, onExport }) => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100">
          <Sparkles className="h-3 w-3 text-purple-600" />
        </div>
        <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Thao tác nhanh
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <motion.button
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          onClick={onQuickCreate}
          className="group relative w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/0 to-purple-50/0 group-hover:from-purple-50/30 transition-all duration-300" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-all duration-200">
            <Zap className="h-4 w-4" />
          </div>
          <div className="relative text-left">
            <p className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors">
              Tạo nhanh
            </p>
            <p className="text-[10px] text-slate-400">Sử dụng mẫu có sẵn</p>
          </div>
          <div className="relative ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          </div>
        </motion.button>
        
        <motion.button
          custom={1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          onClick={onExport}
          className="group relative w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/0 to-purple-50/0 group-hover:from-purple-50/30 transition-all duration-300" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div className="relative text-left">
            <p className="text-sm font-medium text-slate-700 group-hover:text-emerald-600 transition-colors">
              Xuất Excel
            </p>
            <p className="text-[10px] text-slate-400">Tải báo cáo tháng này</p>
          </div>
          <div className="relative ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <Download className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        </motion.button>
      </div>
    </motion.section>
  );
};