// src/app/components/adminComponents/leaves/LeaveStats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Clock, CheckCircle, XCircle } from 'lucide-react';

interface LeaveStatItem {
  title: string;
  value: number;
  icon: string;
}

interface LeaveStatsProps {
  stats: LeaveStatItem[];
}

// Animation variants - không gán type
const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.4 },
  }),
  hover: {
    y: -4,
    transition: { duration: 0.2 },
  },
};

export const LeaveStats: React.FC<LeaveStatsProps> = ({ stats }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard': return <LayoutDashboard className="w-5 h-5" />;
      case 'pending_actions': return <Clock className="w-5 h-5" />;
      case 'check_circle': return <CheckCircle className="w-5 h-5" />;
      case 'cancel': return <XCircle className="w-5 h-5" />;
      default: return <LayoutDashboard className="w-5 h-5" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'dashboard': return 'bg-purple-100 text-purple-600';
      case 'pending_actions': return 'bg-amber-100 text-amber-600';
      case 'check_circle': return 'bg-emerald-100 text-emerald-600';
      case 'cancel': return 'bg-red-100 text-red-600';
      default: return 'bg-purple-100 text-purple-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          custom={idx}
          variants={statCardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`p-3 rounded-xl ${getIconBg(stat.icon)}`}
            >
              {getIcon(stat.icon)}
            </motion.div>
            {stat.title === 'Tổng đơn' && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"
              >
                +12%
              </motion.span>
            )}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
            {stat.title}
          </motion.p>
          <motion.p 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.05, type: "spring" }}
            className="text-2xl font-bold text-gray-900 mt-1"
          >
            {stat.value}
          </motion.p>
        </motion.div>
      ))}
    </div>
  );
};