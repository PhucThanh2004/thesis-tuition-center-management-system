// src/app/components/adminComponents/leaves/RecentActivities.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Clock, XCircle, Upload, ChevronRight } from 'lucide-react';
import type { LeaveActivity } from '../../../utils/types/teacherLeave';

interface RecentActivitiesProps {
  activities: LeaveActivity[];
  onViewAll: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.1 },
  },
};

const activityVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.08, duration: 0.3 },
  }),
  hover: { 
    scale: 1.01,
    transition: { duration: 0.2 }
  },
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, onViewAll }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'person':
        return <UserCheck className="w-4 h-4" />;
      case 'history':
        return <Clock className="w-4 h-4" />;
      case 'block':
        return <XCircle className="w-4 h-4" />;
      case 'file_upload':
        return <Upload className="w-4 h-4" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'person':
        return 'bg-purple-100 text-purple-600';
      case 'history':
        return 'bg-blue-100 text-blue-600';
      case 'block':
        return 'bg-red-100 text-red-600';
      case 'file_upload':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-purple-100 text-purple-600';
    }
  };

  const displayActivities = activities.length > 0 ? activities : [
    { id: '1', user: 'Admin', action: 'đã duyệt đơn nghỉ của', target: 'Nguyễn Văn A', time: '5 phút trước', type: 'approve', icon: 'person', bgColor: '', textColor: '' },
    { id: '2', user: 'Trần Thị B', action: 'đã gửi đơn xin nghỉ', target: '', time: '1 giờ trước', type: 'submit', icon: 'file_upload', bgColor: '', textColor: '' },
    { id: '3', user: 'Admin', action: 'đã từ chối đơn của', target: 'Lê Văn C', time: '3 giờ trước', type: 'reject', icon: 'block', bgColor: '', textColor: '' },
  ];

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-bold text-gray-900 font-headline"
        >
          Hoạt động gần đây
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="text-purple-600 text-xs font-semibold hover:underline flex items-center gap-1"
        >
          Xem tất cả
          <ChevronRight className="w-3 h-3" />
        </motion.button>
      </div>
      
      <div className="space-y-4">
        {displayActivities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            custom={idx}
            variants={activityVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex gap-3 cursor-pointer"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-8 h-8 rounded-full ${getIconBg(activity.icon)} flex items-center justify-center flex-shrink-0`}
            >
              {getIcon(activity.icon)}
            </motion.div>
            <div className="flex-1">
              <motion.p className="text-sm text-gray-700">
                {activity.user && <span className="font-semibold text-gray-900">{activity.user}</span>} {activity.action}
                {activity.target && <span className="font-semibold text-purple-600"> {activity.target}</span>}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="text-xs text-gray-400 mt-0.5"
              >
                {activity.time}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};