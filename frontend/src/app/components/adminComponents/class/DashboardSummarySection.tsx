import { useState, useEffect } from "react";
import {
  Layers,
  PlayCircle,
  Inbox,
  CalendarX,
  Search,
  Plus,
  Loader2,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { SubjectResponse } from "../../../utils/types/subject";
import { subjectApi } from "../../../utils/api";

export const DashboardSummarySection = ({ onAdd }: { onAdd: () => void }) => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [stats, setStats] = useState({
    all: 0,
    active: 0,
    upcoming: 0,
    nearFull: 0,
  });

  const getGreetingByTime = () => {
    const now = new Date();
    const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    const hour = vietnamTime.getHours();

    if (hour >= 5 && hour < 10) return "Chào buổi sáng";
    if (hour >= 10 && hour < 12) return "Chào buổi trưa";
    if (hour >= 12 && hour < 14) return "Chào buổi chiều";
    if (hour >= 14 && hour < 18) return "Chào buổi chiều tốt lành";
    if (hour >= 18 && hour < 22) return "Chào buổi tối";
    return "Chào buổi đêm";
  };

  const getCurrentVietnamTime = () => {
    const now = new Date();
    const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    return vietnamTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const updateGreetingAndTime = () => {
      setGreeting(getGreetingByTime());
      setCurrentTime(getCurrentVietnamTime());
    };

    updateGreetingAndTime();
    const interval = setInterval(updateGreetingAndTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res: SubjectResponse = await subjectApi.getAll(1, 100);

        if (res.success) {
          const nearFullCount = res.data.filter((s) => {
            const ratio = s.currentStudents / s.maxStudents;
            return ratio >= 0.8 && ratio < 1;
          }).length;

          setStats({
            all: res.stats.all,
            active: res.stats.active,
            upcoming: res.stats.upcoming,
            nearFull: nearFullCount,
          });
        }
      } catch (error) {
        console.error("Lỗi fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryCards = [
    { 
      label: "Tổng số lớp", 
      value: stats.all, 
      icon: Layers, 
      color: "#8b5cf6",
      lightColor: "#f3e8ff",
      trend: "+12%",
      trendUp: true
    },
    { 
      label: "Đang học", 
      value: stats.active, 
      icon: PlayCircle, 
      color: "#14b8a6",
      lightColor: "#ccfbf1",
trend: "+5%",
      trendUp: true
    },
    { 
      label: "Sắp khai giảng", 
      value: stats.upcoming, 
      icon: CalendarX, 
      color: "#3b82f6",
      lightColor: "#dbeafe",
      trend: "-2%",
      trendUp: false
    },
    { 
      label: "Gần đầy", 
      value: stats.nearFull, 
      icon: AlertCircle, 
      color: "#f59e0b",
      lightColor: "#fed7aa",
      trend: "+8%",
      trendUp: true
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header Section - Glassmorphism Style */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-100 via-purple-50 to-transparent rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100 via-cyan-50 to-transparent rounded-full blur-3xl -ml-40 -mb-40"></div>
        
        <div className="relative px-6 py-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full shadow-sm">
                  <Sparkles size={14} className="text-white" />
                  <span className="text-white text-xs font-medium">Quản trị viên</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50/80 backdrop-blur-sm rounded-full">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-gray-600 text-sm">{currentTime}</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-gray-900 text-3xl lg:text-4xl font-bold tracking-tight">
                  {greeting}, Quản trị viên!
                </h1>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                  <span>Chào mừng bạn quay trở lại</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <TrendingUp size={14} />
                    Hôm nay có {stats.active} lớp đang hoạt động
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="search"
                  value={searchValue}
onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Tìm kiếm lớp học..."
                  className="w-80 pl-10 pr-4 py-2.5 bg-gray-50/80 backdrop-blur-sm rounded-xl text-sm text-gray-700 outline-none border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-gray-400"
                />
              </div>
              <button 
                onClick={onAdd} 
                className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Thêm lớp mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Section - Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-violet-500" />
              <h3 className="font-semibold text-gray-900">Tổng quan nhanh</h3>
            </div>
            <button className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 group">
              <span>Xem chi tiết</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
              <p className="text-xs text-gray-500 mt-1">Tổng số lớp học</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">Lớp đang hoạt động</p>
            </div>
          </div>
        </div>

        {/* Right Section - Status */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-600">Hệ thống</span>
          </div>
          <p className="text-gray-900 font-semibold mb-2">Đang hoạt động tốt</p>
          <p className="text-xs text-gray-500">Dữ liệu được cập nhật tự động</p>
        </div>
      </div>
    </div>
  );
};