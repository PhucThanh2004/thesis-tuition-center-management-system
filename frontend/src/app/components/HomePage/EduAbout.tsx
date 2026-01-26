import { Check } from 'lucide-react';

export function EduAbout() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full mb-6 bg-[#667eea]/10">
              <span className="text-sm font-semibold text-[#667eea]">Về chúng tôi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 heading-font text-[#1a1a2e]">
              Giải pháp quản lý
              <br />
              <span className="text-[#667eea]">thông minh & hiệu quả</span>
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              EduCenter Pro là hệ thống được xây dựng trong khuôn khổ đồ án tốt nghiệp, kết hợp giữa kiến thức giáo dục và công nghệ nhằm mô phỏng quy trình quản lý trung tâm đào tạo.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Chúng tôi hiểu rõ những thách thức mà các trung tâm học thêm đang gặp phải và tạo ra giải pháp toàn diện giúp tối ưu hóa quy trình vận hành, nâng cao chất lượng giảng dạy và gia tăng doanh thu.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 rounded-xl bg-[#667eea]/5">
                <div className="text-3xl font-bold mb-1 heading-font text-[#667eea]">6+</div>
                <div className="text-sm text-gray-600">Chức năng chính</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#764ba2]/5">
                <div className="text-3xl font-bold mb-1 heading-font text-[#764ba2]">10+</div>
                <div className="text-sm text-gray-600">Module quản lý</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#667eea]/5">
                <div className="text-3xl font-bold mb-1 heading-font text-[#667eea]">1</div>
                <div className="text-sm text-gray-600">Hệ thống hoàn chỉnh</div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
                  <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[#1a1a2e]">Dễ dàng sử dụng</h4>
                  <p className="text-gray-600">Giao diện thân thiện, không cần đào tạo phức tạp</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
                  <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[#1a1a2e]">Bảo mật tuyệt đối</h4>
                  <p className="text-gray-600">Dữ liệu được mã hóa và sao lưu tự động hàng ngày</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
                  <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[#1a1a2e]">Hỗ trợ 24/7</h4>
                  <p className="text-gray-600">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2]">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tỷ lệ hoàn thành</div>
                    <div className="text-2xl font-bold heading-font text-[#667eea]">98%</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Quản lý học viên</span>
                      <span className="text-sm font-bold text-[#667eea]">100%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tài chính</span>
                      <span className="text-sm font-bold text-[#667eea]">95%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Báo cáo</span>
                      <span className="text-sm font-bold text-[#667eea]">99%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]" style={{ width: '99%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-[#ffd93d] to-[#f59e0b]">
                    ⭐
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Đánh giá</div>
                    <div className="font-bold text-lg text-[#1a1a2e]">4.9/5</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 hover:scale-110 transition-transform">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <div className="text-xs text-gray-500">Định hướng</div>
                    <div className="font-bold text-sm text-[#1a1a2e]">Hệ thống quản lý tiêu chuẩn</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20 bg-gradient-to-br from-[#667eea] to-[#764ba2]"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full opacity-20 bg-gradient-to-br from-[#764ba2] to-[#f093fb]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
