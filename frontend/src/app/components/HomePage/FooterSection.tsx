import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export function FooterSection() {
  return (
    <footer id="contact" className="py-16" style={{ background: '#1a1a2e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7494ec, #5a7de0)' }}
              >
                <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <span className="text-xl font-bold text-white">EduCenter Pro</span>
            </div>
            <p className="text-gray-400 mb-6">
              Giải pháp quản lý trung tâm học thêm hàng đầu Việt Nam.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon="twitter" />
              <SocialLink icon="facebook" />
              <SocialLink icon="instagram" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Liên kết nhanh</h4>
            <ul className="space-y-3">
              <FooterLink href="#" text="Trang chủ" />
              <FooterLink href="#" text="Tính năng" />
              <FooterLink href="#" text="Bảng giá" />
              <FooterLink href="#" text="Blog" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6">Hỗ trợ</h4>
            <ul className="space-y-3">
              <FooterLink href="#" text="Trung tâm trợ giúp" />
              <FooterLink href="#" text="Hướng dẫn sử dụng" />
              <FooterLink href="#" text="API Documentation" />
              <FooterLink href="#" text="Cộng đồng" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5" style={{ color: '#7494ec' }} />
                <span className="text-gray-400">support@educenterpro.vn</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5" style={{ color: '#7494ec' }} />
                <span className="text-gray-400">1900 xxxx xx</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1" style={{ color: '#7494ec' }} />
                <span className="text-gray-400">
                  123 Nguyễn Văn Linh,<br />
                  Quận 7, TP.HCM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2024 EduCenter Pro. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon }: { icon: string }) {
  const icons: Record<string, string> = {
    twitter: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
    facebook: 'M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.14 4.02-.79-.02-1.53-.24-2.18-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.96 2.45 3.39 4.61 3.43-1.69 1.32-3.83 2.1-6.15 2.1-.4 0-.8-.02-1.19-.07 2.19 1.4 4.78 2.22 7.57 2.22 9.07 0 14.02-7.52 14.02-14.02 0-.21 0-.43-.01-.64.96-.69 1.79-1.56 2.45-2.55-.88.39-1.83.65-2.82.77z',
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
  };

  return (
    <a 
      href="#"
      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
      style={{ background: 'rgba(116,148,236,0.2)' }}
    >
      <svg 
        className="w-5 h-5"
        style={{ color: '#7494ec' }}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d={icons[icon]} />
      </svg>
    </a>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <a href={href} className="text-gray-400 hover:text-white transition-colors">
        {text}
      </a>
    </li>
  );
}
