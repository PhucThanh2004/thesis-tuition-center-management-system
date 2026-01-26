import { useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(116,148,236,0.1)',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center glow-effect sparkle"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold gradient-text">
              EduCenter Pro
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="nav-link font-semibold gradient-text">
              Trang chủ
            </a>
            <a href="#about" onClick={(e) => handleLinkClick(e, '#about')} className="nav-link font-medium text-gray-700 hover:text-gray-900">
              Giới thiệu
            </a>
            <a href="#features" onClick={(e) => handleLinkClick(e, '#features')} className="nav-link font-medium text-gray-700 hover:text-gray-900">
              Tính năng
            </a>
            <a href="#courses" onClick={(e) => handleLinkClick(e, '#courses')} className="nav-link font-medium text-gray-700 hover:text-gray-900">
              Khóa học
            </a>
            <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="nav-link font-medium text-gray-700 hover:text-gray-900">
              Liên hệ
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button 
              className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-100"
              style={{ color: '#667eea' }}
            >
              Đăng nhập
            </button>
            <button className="btn-gradient px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:shadow-2xl hover:scale-105">
              Đăng ký ngay
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: '#7494ec' }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden border-t"
          style={{ borderColor: 'rgba(116,148,236,0.1)', background: 'white' }}
        >
          <div className="px-4 py-4 space-y-3">
            <a 
              href="#home" 
              onClick={(e) => handleLinkClick(e, '#home')}
              className="block py-2 font-medium"
              style={{ color: '#667eea' }}
            >
              Trang chủ
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleLinkClick(e, '#about')}
              className="block py-2 font-medium"
              style={{ color: '#4a5568' }}
            >
              Giới thiệu
            </a>
            <a 
              href="#features" 
              onClick={(e) => handleLinkClick(e, '#features')}
              className="block py-2 font-medium"
              style={{ color: '#4a5568' }}
            >
              Tính năng
            </a>
            <a 
              href="#courses" 
              onClick={(e) => handleLinkClick(e, '#courses')}
              className="block py-2 font-medium"
              style={{ color: '#4a5568' }}
            >
              Khóa học
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="block py-2 font-medium"
              style={{ color: '#4a5568' }}
            >
              Liên hệ
            </a>
            <div className="pt-3 space-y-2">
              <button 
                className="w-full py-2.5 rounded-lg font-medium border-2 transition-all"
                style={{ color: '#7494ec', borderColor: '#7494ec' }}
              >
                Đăng nhập
              </button>
              <button 
                className="w-full py-2.5 rounded-lg font-medium text-white"
                style={{ background: '#7494ec' }}
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
