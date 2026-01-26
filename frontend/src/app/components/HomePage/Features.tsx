import { Users, Calendar, Award, HeadphonesIcon, BookOpen, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Giáo viên giàu kinh nghiệm',
    description: 'Đội ngũ giáo viên tận tâm, nhiệt huyết với nhiều năm kinh nghiệm giảng dạy',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Calendar,
    title: 'Lịch học linh hoạt',
    description: 'Thời gian học linh động, phù hợp với lịch trình của học viên',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Award,
    title: 'Chứng nhận uy tín',
    description: 'Cấp chứng chỉ hoàn thành khóa học được công nhận',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: BookOpen,
    title: 'Tài liệu chất lượng',
    description: 'Giáo trình được biên soạn khoa học, cập nhật liên tục',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: TrendingUp,
    title: 'Theo dõi tiến độ',
    description: 'Hệ thống đánh giá và báo cáo tiến độ học tập định kỳ',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: HeadphonesIcon,
    title: 'Hỗ trợ 24/7',
    description: 'Tư vấn và giải đáp thắc mắc mọi lúc, mọi nơi',
    color: 'bg-indigo-100 text-indigo-600'
  }
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-lg text-gray-600">
            Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất với các dịch vụ và tiện ích vượt trội
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
