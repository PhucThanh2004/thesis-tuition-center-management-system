import { TrendingUp, Clock, Target, Zap } from 'lucide-react';

const stats = [
  {
    icon: Clock,
    label: 'Thời gian online',
    value: '8h 24m',
    subtext: 'Hôm nay',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Target,
    label: 'Mục tiêu hoàn thành',
    value: '87%',
    subtext: 'Tuần này',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: TrendingUp,
    label: 'Tăng trưởng',
    value: '+12%',
    subtext: 'So với tháng trước',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Zap,
    label: 'Hiệu suất',
    value: '95%',
    subtext: 'Xuất sắc',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50'
  }
];

export function ActivityStats() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Thống kê hoạt động</h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="p-4 rounded-xl border border-gray-100 hover:border-purple-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 text-${stat.color.split('-')[1]}-600`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-0.5">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    <span className="text-xs text-gray-500">{stat.subtext}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Progress */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Tiến độ tuần này</span>
          <span className="text-sm font-bold text-purple-600">6/7 ngày</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`flex-1 h-2 rounded-full ${
                day <= 6
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">T2</span>
          <span className="text-xs text-gray-500">CN</span>
        </div>
      </div>
    </div>
  );
}
