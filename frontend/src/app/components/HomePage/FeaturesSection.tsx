import { Users, Calendar, DollarSign, BarChart3, MessageSquare, Smartphone, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Quản lý học viên',
    description: 'Theo dõi thông tin, điểm danh, học phí và tiến độ học tập của từng học viên một cách chi tiết.',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    emoji: '🎓',
    featured: true
  },
  {
    icon: Calendar,
    title: 'Sắp xếp lịch học',
    description: 'Tự động xếp lịch thông minh, tránh trùng lặp và tối ưu phòng học.',
    gradient: 'linear-gradient(135deg, #6bcb77, #4ade80)',
    emoji: '📅'
  },
  {
    icon: DollarSign,
    title: 'Quản lý tài chính',
    description: 'Theo dõi học phí, doanh thu, chi phí và báo cáo tài chính chi tiết.',
    gradient: 'linear-gradient(135deg, #ffd93d, #f59e0b)',
    emoji: '💰'
  },
  {
    icon: BarChart3,
    title: 'Báo cáo & Thống kê',
    description: 'Dashboard trực quan với các biểu đồ và báo cáo theo thời gian thực.',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ef4444)',
    emoji: '📊'
  },
  {
    icon: MessageSquare,
    title: 'Tương tác phụ huynh',
    description: 'Gửi thông báo, nhắn tin và cập nhật tình hình học tập cho phụ huynh.',
    gradient: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
    emoji: '💬'
  },
  {
    icon: Smartphone,
    title: 'Ứng dụng di động',
    description: 'Quản lý mọi lúc mọi nơi với ứng dụng iOS và Android.',
    gradient: 'linear-gradient(135deg, #2dd4bf, #14b8a6)',
    emoji: '📱'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24" style={{ background: '#f8faff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full mb-4"
            style={{ background: 'rgba(116,148,236,0.1)' }}
          >
            <span className="text-sm font-semibold" style={{ color: '#7494ec' }}>
              Tính năng nổi bật
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#1a1a2e' }}>
            Mọi thứ bạn cần để<br />
            <span style={{ color: '#7494ec' }}>quản lý hiệu quả</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hệ thống tích hợp đầy đủ các công cụ giúp bạn quản lý trung tâm một cách chuyên nghiệp
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const Icon = feature.icon;
  
  if (feature.featured) {
    return (
      <div className="card-hover bg-white rounded-3xl p-8 shadow-2xl border-2 hover:border-purple-300 neon-border pattern-dots relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-200 opacity-20 rounded-full -mr-16 -mt-16" />
        
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 feature-icon-glow relative z-10"
          style={{ background: feature.gradient }}
        >
          <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>
        
        <h3 className="text-2xl font-black mb-4 gradient-text">
          {feature.title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed text-base">
          {feature.description}
        </p>
        
        <a href="#" className="inline-flex items-center font-bold gradient-text hover:underline text-lg group">
          Tìm hiểu thêm
          <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" strokeWidth={2.5} />
        </a>
        
        <div className="absolute bottom-4 right-4 text-6xl opacity-10">
          {feature.emoji}
        </div>
      </div>
    );
  }

  return (
    <div className="card-hover bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: feature.gradient }}
      >
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </div>
      
      <h3 className="text-xl font-bold mb-3" style={{ color: '#1a1a2e' }}>
        {feature.title}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {feature.description}
      </p>
      
      <a href="#" className="inline-flex items-center font-semibold" style={{ color: '#7494ec' }}>
        Tìm hiểu thêm
        <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2} />
      </a>
    </div>
  );
}
