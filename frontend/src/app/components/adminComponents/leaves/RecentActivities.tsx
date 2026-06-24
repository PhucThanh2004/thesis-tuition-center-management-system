// src/app/components/adminComponents/leaves/RecentActivities.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Clock, XCircle, Upload, ChevronRight, Activity } from 'lucide-react';
import type { LeaveActivity } from '../../../utils/types/teacherLeave';

interface RecentActivitiesProps {
  activities: LeaveActivity[];
  onViewAll: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.05 },
  },
};

const activityVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.05, duration: 0.25 },
  }),
  hover: { 
    x: 2,
    transition: { duration: 0.2 }
  },
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, onViewAll }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'person':
        return <UserCheck className="h-3.5 w-3.5" />;
      case 'history':
        return <Clock className="h-3.5 w-3.5" />;
      case 'block':
        return <XCircle className="h-3.5 w-3.5" />;
      case 'file_upload':
        return <Upload className="h-3.5 w-3.5" />;
      default:
        return <UserCheck className="h-3.5 w-3.5" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'person':
        return 'bg-purple-50 text-purple-600';
      case 'history':
        return 'bg-blue-50 text-blue-600';
      case 'block':
        return 'bg-red-50 text-red-600';
      case 'file_upload':
        return 'bg-emerald-50 text-emerald-600';
      default:
        return 'bg-purple-50 text-purple-600';
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
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
            <Activity className="h-3 w-3 text-blue-600" />
          </div>
          <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Hoạt động gần đây
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewAll}
          className="flex items-center gap-0.5 text-[10px] font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          Xem tất cả
          <ChevronRight className="h-3 w-3" />
        </motion.button>
      </div>
      
      <div className="space-y-2.5 bg-white rounded-lg p-3 border border-slate-200/60 shadow-sm">
        {displayActivities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            custom={idx}
            variants={activityVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex gap-3 cursor-pointer group"
          >
            <div className={`flex-shrink-0 h-8 w-8 rounded-lg ${getIconBg(activity.icon)} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              {getIcon(activity.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-600">
                {activity.user && <span className="font-medium text-slate-700">{activity.user}</span>} {activity.action}
                {activity.target && <span className="font-medium text-purple-600"> {activity.target}</span>}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};