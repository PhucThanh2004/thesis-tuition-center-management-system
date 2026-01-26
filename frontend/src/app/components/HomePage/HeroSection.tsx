import { ArrowRight, PlayCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="home" className="relative pt-20 sm:pt-24 overflow-hidden">
      <div className="gradient-bg min-h-[90vh] sm:min-h-[85vh] relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 bg-white" />
          <div className="absolute top-40 right-20 w-32 h-32 rounded-full opacity-10 bg-white" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full opacity-15 bg-white" />
          <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full opacity-10 bg-white" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left slide-up">
              <div className="inline-flex items-center px-5 py-2.5 rounded-full mb-6 neon-border glassmorphism">
                <span 
                  className="w-2 h-2 rounded-full mr-2 animate-pulse"
                  style={{ 
                    background: '#FFD700',
                    boxShadow: '0 0 10px #FFD700'
                  }}
                />
                <span className="text-white text-sm font-bold tracking-wide">
                  ✨ NỀN TẢNG QUẢN LÝ #1 VIỆT NAM ✨
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-8">
                <span className="inline-block transform hover:scale-105 transition-transform">Quản Lý</span>{' '}
                <span className="inline-block transform hover:scale-105 transition-transform">Trung Tâm</span>
                <br />
                <span className="relative inline-block sparkle">
                  <span 
                    className="relative z-10"
                    style={{ 
                      color: '#FFD700',
                      textShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    Thông Minh & Hiệu Quả
                  </span>
                  <span className="absolute -bottom-3 left-0 w-full h-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 opacity-50 blur-sm rounded-full" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0">
                Giải pháp toàn diện giúp các trung tâm học thêm quản lý học viên, giáo viên, lớp học và tài chính một cách dễ dàng.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  className="group px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-110 hover:shadow-2xl flex items-center justify-center glow-effect sparkle"
                  style={{
                    background: 'white',
                    color: '#667eea',
                    boxShadow: '0 10px 40px rgba(255,255,255,0.3)'
                  }}
                >
                  🚀 Bắt đầu miễn phí
                  <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-3" strokeWidth={3} />
                </button>
                <button className="group px-10 py-5 rounded-2xl font-black text-xl text-white transition-all glassmorphism hover:bg-white/30 flex items-center justify-center border-[3px] border-white">
                  <PlayCircle className="w-7 h-7 mr-3 transition-transform group-hover:scale-125" />
                  Xem demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="stat-card rounded-xl p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
                  <div className="text-white/80 text-sm">Trung tâm</div>
                </div>
                <div className="stat-card rounded-xl p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">50K+</div>
                  <div className="text-white/80 text-sm">Học viên</div>
                </div>
                <div className="stat-card rounded-xl p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">98%</div>
                  <div className="text-white/80 text-sm">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative float-animation hidden lg:block">
              <div className="relative">
                {/* Dashboard Preview Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 transform rotate-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ff6b6b' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ffd93d' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#6bcb77' }} />
                    </div>
                    <div className="text-xs text-gray-400">Dashboard</div>
                  </div>
                  <div className="space-y-4">
                    <DashboardItem
                      icon="👥"
                      title="Học viên mới"
                      subtitle="Hôm nay"
                      value="+24"
                      color="#7494ec"
                    />
                    <DashboardItem
                      icon="💰"
                      title="Doanh thu"
                      subtitle="Tháng này"
                      value="125M"
                      color="#6bcb77"
                    />
                    <DashboardItem
                      icon="📅"
                      title="Lớp học"
                      subtitle="Đang hoạt động"
                      value="32"
                      color="#ff6b6b"
                    />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 transform -rotate-6">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ background: '#ffd93d' }}
                    >
                      ⭐
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Đánh giá</div>
                      <div className="font-bold" style={{ color: '#1a1a2e' }}>4.9/5</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div 
                        className="w-12 h-12 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #7494ec, #5a7de0)' }}
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>
                        Giáo viên online
                      </div>
                      <div className="text-xs text-gray-400">15 đang hoạt động</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8faff"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

function DashboardItem({ icon, title, subtitle, value, color }: {
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#f8faff' }}>
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
            {title}
          </div>
          <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
      </div>
      <div className="text-xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
