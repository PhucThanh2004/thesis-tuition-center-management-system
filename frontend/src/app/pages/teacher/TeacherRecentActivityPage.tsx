import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  UserPlus,
  BookOpen,
  DollarSign,
  Clock,
  CalendarDays,
  Search,
  GraduationCap,
  FileText,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MessageSquare,
  Calendar,
  UserCheck,
  UserX,
  Award,
  BarChart3,
  Inbox,
  RefreshCw,
  CheckCheck,
  EyeOff,
  Check,
  Users,
  School
} from 'lucide-react';
import { activityLogApi } from '../../utils/api/activity-log.api';
import { useAuth } from '../../contexts/AuthContext';
import type { ActivityLog, ActivityActionType, ActivityTargetType } from '../../utils/types/activity-log';

// Định nghĩa kiểu dữ liệu cho activity trong UI
type UIActivityType = 
  | 'student_enroll'
  | 'student_graduate'
  | 'student_dropout'
  | 'payment'
  | 'class_create'
  | 'class_assign'
  | 'teacher_assign'
  | 'attendance'
  | 'score_update'
  | 'schedule_change'
  | 'tuition_fee'
  | 'parent_contact'
  | 'certificate'
  | 'exam_create';

interface UIActivityItem {
  id: string;
  type: UIActivityType;
  title: string;
  description: string;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  target?: {
    name: string;
    type: string;
  };
  amount?: number;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, any>;
  isRead?: boolean;
  originalLog?: ActivityLog;
}

// Map action type và target type sang UI type
const mapToUIType = (actionType: ActivityActionType, targetType: ActivityTargetType): UIActivityType => {
  if (actionType === 'CREATE') {
    switch (targetType) {
      case 'STUDENT': return 'student_enroll';
      case 'TEACHER': return 'teacher_assign';
      case 'CLASSROOM': return 'class_create';
      case 'COURSE': return 'class_create';
      case 'PAYMENT': return 'payment';
      case 'ANNOUNCEMENT': return 'parent_contact';
      case 'SCHEDULE': return 'schedule_change';
      default: return 'attendance';
    }
  }
  
  if (actionType === 'UPDATE') {
    switch (targetType) {
      case 'STUDENT': return 'student_graduate';
      case 'TEACHER': return 'teacher_assign';
      case 'CLASSROOM': return 'class_assign';
      case 'COURSE': return 'class_assign';
      case 'PAYMENT': return 'tuition_fee';
      case 'ANNOUNCEMENT': return 'parent_contact';
      case 'SCHEDULE': return 'schedule_change';
      default: return 'attendance';
    }
  }
  
  if (actionType === 'DELETE') {
    switch (targetType) {
      case 'STUDENT': return 'student_dropout';
      case 'TEACHER': return 'teacher_assign';
      case 'CLASSROOM': return 'class_assign';
      default: return 'attendance';
    }
  }
  
  if (actionType === 'CHECKIN') return 'attendance';
  if (actionType === 'LOGIN' || actionType === 'LOGOUT') return 'attendance';
  if (actionType === 'APPROVE' || actionType === 'REJECT') return 'attendance';
  
  return 'attendance';
};

// Map status từ action type
const getStatusFromActivity = (activity: ActivityLog): 'success' | 'warning' | 'error' | 'info' => {
  if (activity.actionType === 'DELETE') return 'error';
  if (activity.actionType === 'CREATE') return 'success';
  if (activity.actionType === 'UPDATE') return 'warning';
  if (activity.actionType === 'APPROVE') return 'success';
  if (activity.actionType === 'REJECT') return 'error';
  if (activity.actionType === 'CHECKIN') {
    if (activity.description.toLowerCase().includes('vắng')) return 'warning';
    if (activity.description.toLowerCase().includes('muộn')) return 'warning';
    return 'success';
  }
  if (activity.actionType === 'LOGIN') return 'success';
  if (activity.actionType === 'LOGOUT') return 'info';
  return 'info';
};

// Format title từ activity
const getTitleFromActivity = (activity: ActivityLog): string => {
  const meta = parseMetaSafe(activity.meta);
  
  if (activity.actionType === 'CREATE') {
    switch (activity.targetType) {
      case 'STUDENT': return 'Học sinh mới';
      case 'TEACHER': return 'Giáo viên mới';
      case 'CLASSROOM': return 'Lớp học mới';
      case 'COURSE': return 'Khóa học mới';
      case 'PAYMENT': return 'Thanh toán mới';
      case 'ANNOUNCEMENT': return meta?.title || 'Thông báo mới';
      case 'SCHEDULE': return 'Lịch học mới';
      default: return 'Tạo mới';
    }
  }
  
  if (activity.actionType === 'UPDATE') {
    switch (activity.targetType) {
      case 'STUDENT': return 'Cập nhật học sinh';
      case 'TEACHER': return 'Cập nhật giáo viên';
      case 'CLASSROOM': return 'Cập nhật lớp học';
      case 'COURSE': return 'Cập nhật khóa học';
      case 'PAYMENT': return 'Cập nhật thanh toán';
      case 'ANNOUNCEMENT': return 'Cập nhật thông báo';
      case 'SCHEDULE': return 'Cập nhật lịch học';
      default: return 'Cập nhật';
    }
  }
  
  if (activity.actionType === 'DELETE') {
    switch (activity.targetType) {
      case 'STUDENT': return 'Học sinh nghỉ học';
      case 'TEACHER': return 'Xóa giáo viên';
      case 'CLASSROOM': return 'Xóa lớp học';
      default: return 'Xóa';
    }
  }
  
  if (activity.actionType === 'APPROVE') return 'Phê duyệt';
  if (activity.actionType === 'REJECT') return 'Từ chối';
  if (activity.actionType === 'LOGIN') return 'Đăng nhập';
  if (activity.actionType === 'LOGOUT') return 'Đăng xuất';
  if (activity.actionType === 'CHECKIN') return 'Điểm danh';
  
  return 'Hoạt động hệ thống';
};

// Format description chi tiết
const getDescriptionFromActivity = (activity: ActivityLog): string => {
  const meta = parseMetaSafe(activity.meta);
  let description = activity.description;
  
  if (meta?.title) {
    description = `${meta.title} - ${description}`;
  }
  
  if (meta?.status) {
    description = `${description} (${meta.status})`;
  }
  
  return description;
};

// Parse meta an toàn
const parseMetaSafe = (metaString: string | null): Record<string, any> | null => {
  if (!metaString) return null;
  try {
    return JSON.parse(metaString);
  } catch (error) {
    console.warn('Failed to parse meta JSON:', metaString);
    return null;
  }
};

// Format thời gian
const formatTime = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (targetDate.getTime() === today.getTime()) {
    return `Hôm nay, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return `Hôm qua, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
};

// Component icon cho từng loại hoạt động
const ActivityIcon: React.FC<{ type: UIActivityType }> = ({ type }) => {
  const iconMap: Record<UIActivityType, { icon: React.ReactNode; bgColor: string; iconColor: string }> = {
    student_enroll: { icon: <UserPlus size={18} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    student_graduate: { icon: <Award size={18} />, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    student_dropout: { icon: <UserX size={18} />, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    payment: { icon: <DollarSign size={18} />, bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    class_create: { icon: <BookOpen size={18} />, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    class_assign: { icon: <GraduationCap size={18} />, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    teacher_assign: { icon: <UserCheck size={18} />, bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
    attendance: { icon: <CheckCircle size={18} />, bgColor: 'bg-lime-100', iconColor: 'text-lime-600' },
    score_update: { icon: <BarChart3 size={18} />, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
    schedule_change: { icon: <Calendar size={18} />, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    tuition_fee: { icon: <CreditCard size={18} />, bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    parent_contact: { icon: <MessageSquare size={18} />, bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
    certificate: { icon: <FileText size={18} />, bgColor: 'bg-slate-100', iconColor: 'text-slate-600' },
    exam_create: { icon: <CalendarDays size={18} />, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
  };

  const { icon, bgColor, iconColor } = iconMap[type];
  return (
    <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center shrink-0 ${iconColor}`}>
      {icon}
    </div>
  );
};

// Dropdown menu component cho từng activity
const ActivityMenu: React.FC<{
  activityId: number;
  isRead: boolean;
  onMarkAsRead: (id: number) => void;
}> = ({ activityId, isRead, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
      >
        <MoreHorizontal size={18} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          {!isRead ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(activityId);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Check className="w-4 h-4" />
              Đánh dấu đã đọc
            </button>
          ) : (
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
              disabled
            >
              <EyeOff className="w-4 h-4" />
              Đã đọc
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Filter tabs cho giáo viên
const FilterTabs: React.FC<{
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}> = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { value: 'all', label: 'Tất cả', icon: <Activity size={16} /> },
    { value: 'class', label: 'Lớp học', icon: <School size={16} /> },
    { value: 'student', label: 'Học sinh', icon: <Users size={16} /> },
    { value: 'attendance', label: 'Điểm danh', icon: <CheckCircle size={16} /> },
    { value: 'schedule', label: 'Lịch học', icon: <Calendar size={16} /> },
    { value: 'unread', label: 'Chưa đọc', icon: <CheckCheck size={16} /> },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${activeFilter === filter.value
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {filter.icon}
          {filter.label}
          <span className={`ml-1 text-xs ${activeFilter === filter.value ? 'text-white/80' : 'text-gray-500'}`}>
            {counts[filter.value]}
          </span>
        </button>
      ))}
    </div>
  );
};

// Chuyển đổi ActivityLog từ API sang UI ActivityItem
const convertToUIActivity = (log: ActivityLog): UIActivityItem => {
  const uiType = mapToUIType(log.actionType, log.targetType);
  const meta = parseMetaSafe(log.meta);
  
  let role = 'Hệ thống';
  switch (log.targetType) {
    case 'STUDENT': role = 'Học sinh'; break;
    case 'TEACHER': role = 'Giáo viên'; break;
    case 'COURSE': role = 'Khóa học'; break;
    case 'CLASSROOM': role = 'Lớp học'; break;
    case 'PAYMENT': role = 'Thanh toán'; break;
    case 'ANNOUNCEMENT': role = 'Thông báo'; break;
    case 'SCHEDULE': role = 'Lịch học'; break;
    case 'SUBJECT': role = 'Môn học'; break;
  }
  
  let amount: number | undefined;
  if (meta?.amount) {
    amount = meta.amount;
  } else if (log.targetType === 'PAYMENT') {
    const match = log.description.match(/(\d[\d,.]*\d)/);
    if (match) {
      amount = parseInt(match[0].replace(/[^0-9]/g, ''));
    }
  }
  
  return {
    id: log.id.toString(),
    type: uiType,
    title: getTitleFromActivity(log),
    description: getDescriptionFromActivity(log),
    user: {
      name: log.userName,
      role: role,
      avatar: log.userImage || undefined,
    },
    target: {
      name: meta?.title || `${log.targetType} #${log.targetId}`,
      type: log.targetType,
    },
    amount: amount,
    timestamp: new Date(log.createdAt),
    status: getStatusFromActivity(log),
    metadata: meta || undefined,
    isRead: log.isRead || false,
    originalLog: log,
  };
};

const TeacherRecentActivityPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UIActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [markingSingleRead, setMarkingSingleRead] = useState<number | null>(null);
  const itemsPerPage = 20;

  const fetchActivities = async (showRefresh = false) => {
    try {
      if (!user) return;

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Gọi API lấy hoạt động của giáo viên
      const data = await activityLogApi.getTeacherActivities(user.id, 200);
      const uiActivities = data.map(convertToUIActivity);
      setActivities(uiActivities);
    } catch (err: any) {
      console.error('Error fetching teacher activities:', err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError('Bạn không có quyền xem hoạt động này');
      } else {
        setError('Không thể tải dữ liệu hoạt động');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  // Handle mark single as read
  const handleMarkAsRead = async (activityId: number) => {
    try {
      setMarkingSingleRead(activityId);
      await activityLogApi.markAsRead(activityId);
      
      setActivities(prev => 
        prev.map(activity => 
          parseInt(activity.id) === activityId 
            ? { ...activity, isRead: true } 
            : activity
        )
      );
      
      console.log(`Đã đánh dấu thông báo ${activityId} đã đọc`);
    } catch (err) {
      console.error('Error marking as read:', err);
    } finally {
      setMarkingSingleRead(null);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      setMarkingAllRead(true);
      await activityLogApi.markAllAsRead(user.id);
      
      setActivities(prev => 
        prev.map(activity => ({ ...activity, isRead: true }))
      );
      
      console.log('Đã đánh dấu tất cả thông báo đã đọc');
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setMarkingAllRead(false);
    }
  };

  // Đếm số lượng theo từng loại
  const counts = {
    all: activities.length,
    class: activities.filter(a => ['class_create', 'class_assign'].includes(a.type)).length,
    student: activities.filter(a => ['student_enroll', 'student_graduate', 'student_dropout'].includes(a.type)).length,
    attendance: activities.filter(a => a.type === 'attendance').length,
    schedule: activities.filter(a => ['schedule_change', 'exam_create'].includes(a.type)).length,
    unread: activities.filter(a => !a.isRead).length,
  };

  // Lọc theo loại
  let filteredByType = activities;
  if (filterType === 'class') {
    filteredByType = activities.filter(a => ['class_create', 'class_assign'].includes(a.type));
  } else if (filterType === 'student') {
    filteredByType = activities.filter(a => ['student_enroll', 'student_graduate', 'student_dropout'].includes(a.type));
  } else if (filterType === 'attendance') {
    filteredByType = activities.filter(a => a.type === 'attendance');
  } else if (filterType === 'schedule') {
    filteredByType = activities.filter(a => ['schedule_change', 'exam_create'].includes(a.type));
  } else if (filterType === 'unread') {
    filteredByType = activities.filter(a => !a.isRead);
  }

  // Tìm kiếm
  const filteredActivities = filteredByType.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activity.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activity.target?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
    setCurrentPage(1);
  };

  const unreadCount = activities.filter(a => !a.isRead).length;

  if (loading && activities.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-indigo-500 border-t-transparent"></div>
          <p className="text-gray-500 mt-4 text-sm">Đang tải hoạt động của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hoạt động của tôi</h1>
            <p className="text-sm text-gray-500 mt-1">
              Theo dõi các hoạt động bạn đã thực hiện trong trung tâm
            </p>
          </div>
          
          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAllRead}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl transition-colors text-sm font-medium shadow-sm"
            >
              {markingAllRead ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCheck size={18} />
                  Đánh dấu tất cả đã đọc ({unreadCount})
                </>
              )}
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Search Bar */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm hoạt động của bạn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
              <button
                onClick={() => fetchActivities(true)}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50 border border-gray-200"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                <span className="text-sm">Làm mới</span>
              </button>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mx-5 mt-4 p-4 bg-red-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
              <button
                onClick={() => fetchActivities()}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="px-5 pt-4 pb-2">
            <FilterTabs activeFilter={filterType} onFilterChange={handleFilterChange} counts={counts} />
          </div>

          {/* Activity List */}
          <div className="divide-y divide-gray-100">
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((activity) => {
                const isUnread = !activity.isRead;
                const isMarkingSingle = markingSingleRead === parseInt(activity.id);
                
                return (
                  <div 
                    key={activity.id} 
                    className={`p-5 transition-all duration-150 group ${
                      isUnread ? 'bg-blue-50/50 hover:bg-blue-100/50' : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex gap-4">
                      <ActivityIcon type={activity.type} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-base font-semibold text-gray-900">{activity.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            activity.status === 'success' ? 'bg-green-100 text-green-700' :
                            activity.status === 'error' ? 'bg-red-100 text-red-700' :
                            activity.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {activity.status === 'success' ? 'Thành công' :
                             activity.status === 'error' ? 'Thất bại' :
                             activity.status === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                          </span>
                          {isUnread && (
                            <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                              Mới
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">{activity.description}</p>
                        
                        {activity.amount && (
                          <p className="text-sm font-semibold text-emerald-600 mb-2">
                            {activity.amount.toLocaleString('vi-VN')}đ
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {formatTime(activity.timestamp)}
                          </span>
                          {activity.target && (
                            <span className="flex items-center gap-1.5">
                              <BookOpen size={13} />
                              {activity.target.type}
                            </span>
                          )}
                          {activity.metadata?.status && (
                            <span className="flex items-center gap-1.5">
                              <Activity size={13} />
                              {activity.metadata.status}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-1">
                        {isMarkingSingle ? (
                          <div className="p-2">
                            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></span>
                          </div>
                        ) : (
                          <ActivityMenu
                            activityId={parseInt(activity.id)}
                            isRead={!isUnread}
                            onMarkAsRead={handleMarkAsRead}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Inbox size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Không tìm thấy hoạt động nào</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? 'Thử thay đổi từ khóa tìm kiếm' : 'Bạn chưa có hoạt động nào gần đây'}
                </p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                Hiển thị <span className="font-medium text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> -{' '}
                <span className="font-medium text-gray-700">{Math.min(currentPage * itemsPerPage, filteredActivities.length)}</span> /{' '}
                <span className="font-medium text-gray-700">{filteredActivities.length}</span> hoạt động
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors text-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[36px] h-9 px-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'border border-gray-200 hover:bg-white text-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors text-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherRecentActivityPage;