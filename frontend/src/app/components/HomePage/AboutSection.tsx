import { Check } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(102, 126, 234, 0.1)' }}
            >
              <span className="text-sm font-semibold" style={{ color: '#667eea' }}>
                Về chúng tôi
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#1a1a2e' }}>
              Giải pháp quản lý<br />
              <span style={{ color: '#667eea' }}>hàng đầu Việt Nam</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              EduCenter Pro được phát triển bởi đội ngũ chuyên gia giáo dục và công nghệ với hơn 10 năm kinh nghiệm trong lĩnh vực quản lý trung tâm đào tạo.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Chúng tôi hiểu rõ những thách thức mà các trung tâm học thêm đang gặp phải và tạo ra giải pháp toàn diện giúp tối ưu hóa quy trình vận hành, nâng cao chất lượng giảng dạy và gia tăng doanh thu.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                <div className="text-3xl font-bold mb-1" style={{ color: '#667eea' }}>10+</div>
                <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(118, 75, 162, 0.05)' }}>
                <div className="text-3xl font-bold mb-1" style={{ color: '#764ba2' }}>500+</div>
                <div className="text-sm text-gray-600">Trung tâm tin dùng</div>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                <div className="text-3xl font-bold mb-1" style={{ color: '#667eea' }}>50K+</div>
                <div className="text-sm text-gray-600">Học viên hài lòng</div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <FeatureItem
                title="Dễ dàng sử dụng"
                description="Giao diện thân thiện, không cần đào tạo phức tạp"
              />
              <FeatureItem
                title="Bảo mật tuyệt đối"
                description="Dữ liệu được mã hóa và sao lưu tự động hàng ngày"
              />
              <FeatureItem
                title="Hỗ trợ 24/7"
                description="Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ"
              />
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                  >
                    <Check className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tỷ lệ hoàn thành</div>
                    <div className="text-2xl font-bold" style={{ color: '#667eea' }}>98%</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <ProgressBar label="Quản lý học viên" value={100} />
                  <ProgressBar label="Tài chính" value={95} />
                  <ProgressBar label="Báo cáo" value={99} />
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: 'linear-gradient(135deg, #ffd93d, #f59e0b)' }}
                  >
                    ⭐
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Đánh giá</div>
                    <div className="font-bold text-lg" style={{ color: '#1a1a2e' }}>4.9/5</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 hover:scale-110 transition-transform">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <div className="text-xs text-gray-500">Giải thưởng</div>
                    <div className="font-bold text-sm" style={{ color: '#1a1a2e' }}>
                      Best EdTech 2024
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
              <div 
                className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              />
              <div 
                className="absolute bottom-10 left-10 w-24 h-24 rounded-full opacity-20"
                style={{ background: 'linear-gradient(135deg, #764ba2, #f093fb)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
      >
        <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="font-bold text-lg mb-1" style={{ color: '#1a1a2e' }}>
          {title}
        </h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold" style={{ color: '#667eea' }}>{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full"
          style={{ 
            width: `${value}%`,
            background: 'linear-gradient(90deg, #667eea, #764ba2)'
          }}
        />
      </div>
    </div>
  );
}
