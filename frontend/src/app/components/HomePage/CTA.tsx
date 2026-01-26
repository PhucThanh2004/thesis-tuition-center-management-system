import { ArrowRight, Phone } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="p-8 lg:p-12 text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Sẵn sàng bắt đầu hành trình học tập?
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt và học thử miễn phí buổi đầu tiên!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  Đăng ký ngay
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Liên hệ tư vấn
                </button>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <div className="text-2xl font-bold">Miễn phí</div>
                  <div className="text-sm text-blue-100">Buổi học thử</div>
                </div>
                <div className="w-px h-12 bg-blue-400"></div>
                <div>
                  <div className="text-2xl font-bold">Giảm 20%</div>
                  <div className="text-sm text-blue-100">Học phí tháng đầu</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="hidden lg:block h-full">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758685733907-42e9651721f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwaGVscGluZyUyMHN0dWRlbnR8ZW58MXx8fHwxNzY5MzA4MjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Teacher helping student"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
