export function EduCTA() {
  return (
    <section className="py-16 sm:py-24 bg-[#f8faff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gradient-bg rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-white transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white transform -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Sẵn sàng nâng cấp
              <br />
              trung tâm của bạn?
            </h2>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Tham gia cùng hơn 500+ trung tâm đã tin tưởng sử dụng EduCenter Pro
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl bg-white text-[#7494ec]">
                Dùng thử miễn phí 14 ngày
              </button>
              <button className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:bg-white/20 border-2 border-white">
                Liên hệ tư vấn
              </button>
            </div>

            <p className="text-white/70 text-sm mt-6">
              Không cần thẻ tín dụng • Hủy bất cứ lúc nào
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
