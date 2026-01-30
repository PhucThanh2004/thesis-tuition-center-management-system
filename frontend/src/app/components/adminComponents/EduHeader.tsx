import { useState, useEffect } from 'react';
import { BookOpen, Menu, X, Bell, Settings, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom';
import {  getRoleName } from "../../utils/helpers";

export function EduHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToPage = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

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
            <button
              onClick={() => navigateToPage('/admin/home')}
              className={`nav-link font-semibold transition-all
      ${isActive('/admin/home')
                  ? 'gradient-text'
                  : 'text-gray-600 hover:text-gray-800'}
    `}
            >
              Trang chủ
            </button>

            <button
              onClick={() => navigateToPage('/admin/student')}
              className={`nav-link font-medium transition-all
      ${isActive('/admin/student')
                  ? 'gradient-text'
                  : 'text-gray-600 hover:text-gray-800'}
    `}
            >
              Học sinh
            </button>

            <button
              onClick={() => navigateToPage('#')}
              className={`nav-link font-medium transition-all
      ${isActive('/admin/teacher')
                  ? 'gradient-text'
                  : 'text-gray-600 hover:text-gray-800'}
    `}
            >
              Giáo viên
            </button>

            <button
              onClick={() => navigateToPage('#')}
              className={`nav-link font-medium transition-all
      ${isActive('/admin/class')
                  ? 'gradient-text'
                  : 'text-gray-600 hover:text-gray-800'}
    `}
            >
              Lớp học
            </button>

            <button
              onClick={() => navigateToPage('#')}
              className={`nav-link font-medium transition-all
      ${isActive('/admin/report')
                  ? 'gradient-text'
                  : 'text-gray-600 hover:text-gray-800'}
    `}
            >
              Báo cáo
            </button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notifications */}
            <button className="relative p-2 sm:p-2.5  text-gray-600 hover:text-gray-800 rounded-xl transition-all">
              <Bell className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            </button>

            {/* Messages */}
            <button className="sm:block relative p-2.5  text-gray-600 hover:text-gray-800 rounded-xl transition-all">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Divider */}
            <div className="mx-1 h-8 w-px bg-gray-300/70" />
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2  hover:bg-white rounded-xl px-3 py-2 transition-all backdrop-blur-sm"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex items-center justify-center ring-1 ring-purple/30 bg-white">
                  {user?.image ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL_IMAGE}${user.image}`}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 gradient-text" />
                  )}
                </div>
                <div className="lg:block text-left">
                  <span className="gradient-text text-sm font-bold block">
                    {user?.fullName}
                  </span>
                  <span className="text-xs gradient-text">
                    {user?.roleId && getRoleName(user.roleId)}
                  </span>
                </div>

              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <a href="/admin/profile" className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Hồ sơ cá nhân</span>
                  </a>

                  <a href="#" className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Cài đặt mật khẩu</span>
                  </a>

                  <hr className="my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>

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
        <div
          className="md:hidden border-t bg-white"
          style={{ borderColor: 'rgba(116,148,236,0.1)' }}
        >
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => navigateToPage('/admin/home')}
              className={`block w-full text-left py-2 font-medium transition-all
         ${isActive('/admin/home')
                  ? 'gradient-text relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gradient-to-r before:from-[#667eea] before:to-[#764ba2]'
                  : 'text-[#4a5568]'}

        `}
            >
              Trang chủ
            </button>

            <button
              onClick={() => navigateToPage('/admin/student')}
              className={`block w-full text-left py-2 font-medium transition-all
          ${isActive('/admin/student')
                  ? 'gradient-text relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gradient-to-r before:from-[#667eea] before:to-[#764ba2]'
                  : 'text-[#4a5568]'}
        `}
            >
              Học sinh
            </button>

            <button
              onClick={() => navigateToPage('#')}
              className={`block w-full text-left py-2 font-medium transition-all
          ${isActive('/admin/teacher')
                  ? 'gradient-text relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gradient-to-r before:from-[#667eea] before:to-[#764ba2]'
                  : 'text-[#4a5568]'}
        `}
            >
              Giáo viên
            </button>

            <button
              onClick={() => navigateToPage('#')}
              className={`block w-full text-left py-2 font-medium transition-all
          ${isActive('/admin/class')
                  ? 'gradient-text relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gradient-to-r before:from-[#667eea] before:to-[#764ba2]'
                  : 'text-[#4a5568]'}
        `}
            >
              Lớp học
            </button>

            <button
              onClick={() => navigateToPage('#')}
              className={`block w-full text-left py-2 font-medium transition-all
          ${isActive('/admin/report')
                  ? 'gradient-text relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gradient-to-r before:from-[#667eea] before:to-[#764ba2]'
                  : 'text-[#4a5568]'}
        `}
            >
              Báo cáo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
