import { Clock, UserPlus, FileText, Settings, LogIn, Shield } from 'lucide-react';

const activities = [
  {
    id: 1,
    action: 'Đăng nhập hệ thống',
    time: '2 phút trước',
    icon: LogIn,
    color: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    id: 2,
    action: 'Thêm học viên mới',
    time: '30 phút trước',
    icon: UserPlus,
    color: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    id: 3,
    action: 'Cập nhật báo cáo',
    time: '1 giờ trước',
    icon: FileText,
    color: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    id: 4,
    action: 'Thay đổi cài đặt',
    time: '2 giờ trước',
    icon: Settings,
    color: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
  {
    id: 5,
    action: 'Cập nhật quyền',
    time: '3 giờ trước',
    icon: Shield,
    color: 'bg-pink-50',
    iconColor: 'text-pink-600'
  }
];

export function ActivityHistory() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div 
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`${activity.color} p-2 rounded-lg flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
        Xem tất cả hoạt động
      </button>
    </div>
  );
}
