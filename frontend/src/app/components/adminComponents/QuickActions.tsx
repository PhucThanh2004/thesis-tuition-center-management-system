import { UserPlus, BookPlus, Calendar, FileText, Users, DollarSign } from 'lucide-react';

const actions = [
  {
    title: 'Thêm học viên',
    description: 'Đăng ký học viên mới',
    icon: UserPlus,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    title: 'Tạo khóa học',
    description: 'Thêm khóa học mới',
    icon: BookPlus,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  {
    title: 'Xếp lịch học',
    description: 'Tạo lịch học mới',
    icon: Calendar,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600'
  },
  {
    title: 'Tạo báo cáo',
    description: 'Xuất báo cáo thống kê',
    icon: FileText,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600'
  },
  {
    title: 'Quản lý giáo viên',
    description: 'Thêm/sửa giáo viên',
    icon: Users,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600'
  },
  {
    title: 'Thu học phí',
    description: 'Ghi nhận thanh toán',
    icon: DollarSign,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  }
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="group p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all hover:shadow-lg"
            >
              <div className={`${action.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${action.textColor}`} />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{action.title}</h4>
              <p className="text-xs text-gray-500">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
