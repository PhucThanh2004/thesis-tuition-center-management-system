// src/app/components/adminComponents/leaves/QuickActions.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Download } from 'lucide-react';

interface QuickActionsProps {
  onQuickCreate: () => void;
  onExport: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.1, duration: 0.3 },
  }),
  hover: { 
    scale: 1.02,
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
      className="space-y-4"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-bold text-gray-900 font-headline"
      >
        Thao tác nhanh
      </motion.h2>
      
      <div className="grid grid-cols-1 gap-3">
        <motion.button
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          onClick={onQuickCreate}
          className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
        >
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all"
          >
            <Zap className="w-5 h-5" />
          </motion.div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">Tạo nhanh</p>
            <p className="text-xs text-gray-400">Sử dụng mẫu có sẵn</p>
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
          className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
        >
          <motion.div 
            whileHover={{ y: 2 }}
            className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all"
          >
            <Download className="w-5 h-5" />
          </motion.div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">Xuất Excel</p>
            <p className="text-xs text-gray-400">Tải báo cáo tháng 4</p>
          </div>
        </motion.button>
      </div>
    </motion.section>
  );
};