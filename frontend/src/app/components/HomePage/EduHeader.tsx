import { useState, useEffect } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';

interface EduHeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function EduHeader({ onLoginClick, onRegisterClick }: EduHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''
        }`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(116,148,236,0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center glow-effect sparkle bg-gradient-to-br from-[#667eea] to-[#764ba2]">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold gradient-text heading-font">
              EduCenter Pro
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="nav-link font-semibold gradient-text">
              Trang chủ
            </button>
            <button onClick={() => scrollToSection('about')} className="nav-link font-medium text-gray-700 hover:text-gray-900">
              Giới thiệu
            </button>
            <button onClick={() => scrollToSection('features')} className="nav-link font-medium text-gray-700 hover:text-gray-900">
              Tính năng
            </button>
            <button onClick={() => scrollToSection('contact')} className="nav-link font-medium text-gray-700 hover:text-gray-900">
              Liên hệ
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-100 text-[#667eea]"
            >
              Đăng nhập
            </button>
            <button
              onClick={onRegisterClick}
              className="btn-gradient px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:shadow-2xl hover:scale-105"
            >
              Đăng ký ngay
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#7494ec]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: 'rgba(116,148,236,0.1)' }}>
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 font-medium text-[#667eea]">
              Trang chủ
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 font-medium text-[#4a5568]">
              Giới thiệu
            </button>
            <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 font-medium text-[#4a5568]">
              Tính năng
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 font-medium text-[#4a5568]">
              Liên hệ
            </button>
            <div className="pt-3 space-y-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  onLoginClick()
                }}
                className="w-full py-2.5 rounded-lg font-medium border-2 transition-all text-[#7494ec] border-[#7494ec]"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  onRegisterClick()
                }}
                className="w-full py-2.5 rounded-lg font-medium text-white bg-[#7494ec]"
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
