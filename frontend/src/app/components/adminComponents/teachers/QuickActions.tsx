// src/app/components/teachers/QuickActions.tsx
import React from 'react';
import { Users, Calendar, Bell, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onExport?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onExport }) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Lớp học',
      onClick: () => navigate('/admin/class')
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Lịch học',
      onClick: () => navigate('/admin/schedule')
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Thông báo',
      onClick: () => navigate('/admin/announcement')
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: 'Xuất dữ liệu',
      onClick: onExport
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-4">Thao tác nhanh</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100 hover:border-purple-500 hover:shadow-md transition-all group"
          >
            <div className="p-2.5 bg-purple-50 rounded-xl mb-2 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-slate-600 group-hover:text-purple-600">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;