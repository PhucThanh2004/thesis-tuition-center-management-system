import { GraduationCap, Award, BookOpen, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: GraduationCap,
    value: '1,000+',
    label: 'Học viên đã đăng ký',
    color: 'bg-blue-600'
  },
  {
    icon: Award,
    value: '98%',
    label: 'Học viên hài lòng',
    color: 'bg-purple-600'
  },
  {
    icon: BookOpen,
    value: '50+',
    label: 'Khóa học đa dạng',
    color: 'bg-green-600'
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Tỷ lệ đậu cao',
    color: 'bg-orange-600'
  }
];

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Thành tích của chúng tôi
          </h2>
          <p className="text-lg text-blue-100">
            Con số ấn tượng từ hành trình phát triển giáo dục chất lượng
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
