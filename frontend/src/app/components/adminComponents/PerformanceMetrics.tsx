import { TrendingUp, TrendingDown, Target, Award, Clock, CheckCircle } from 'lucide-react';

const metrics = [
  {
    label: 'Tỷ lệ hoàn thành khóa học',
    value: '87%',
    target: '90%',
    trend: 'up',
    change: '+3%',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    label: 'Điểm trung bình',
    value: '8.2',
    target: '8.5',
    trend: 'up',
    change: '+0.3',
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    label: 'Tỷ lệ tham dự',
    value: '92%',
    target: '95%',
    trend: 'up',
    change: '+5%',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    label: 'Thời gian học trung bình',
    value: '4.2h',
    target: '5h',
    trend: 'down',
    change: '-0.3h',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
];

export function PerformanceMetrics() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Chỉ số hiệu suất</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          const percentage = (parseFloat(metric.value) / parseFloat(metric.target)) * 100;
          
          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`${metric.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                      <span className="text-xs text-gray-500">/ {metric.target}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{metric.change}</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 group-hover:animate-pulse"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-lg">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Mục tiêu tháng này</h4>
            <p className="text-xs text-gray-600">
              Đạt 90% tỷ lệ hoàn thành khóa học và 95% tỷ lệ tham dự. Bạn đang trên đà hoàn thành tốt!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
