import { UserPlus, BookOpen, DollarSign, Calendar, Clock } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'student',
    title: 'Học viên mới đăng ký',
    description: 'Nguyễn Văn A đã đăng ký khóa Toán 10',
    time: '5 phút trước',
    icon: UserPlus,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    type: 'course',
    title: 'Khóa học mới',
    description: 'Khóa "Tiếng Anh giao tiếp" đã được tạo',
    time: '1 giờ trước',
    icon: BookOpen,
    color: 'bg-purple-500'
  },
  {
    id: 3,
    type: 'payment',
    title: 'Thanh toán thành công',
    description: 'Trần Thị B đã thanh toán học phí ₫2.500.000',
    time: '2 giờ trước',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  {
    id: 4,
    type: 'schedule',
    title: 'Lịch học mới',
    description: 'Lịch học tuần tới đã được cập nhật',
    time: '3 giờ trước',
    icon: Calendar,
    color: 'bg-pink-500'
  },
  {
    id: 5,
    type: 'student',
    title: 'Học viên mới đăng ký',
    description: 'Lê Văn C đã đăng ký khóa Vật lý 11',
    time: '4 giờ trước',
    icon: UserPlus,
    color: 'bg-blue-500'
  }
];

const upcomingClasses = [
  {
    id: 1,
    course: 'Toán 10 - Lớp A',
    teacher: 'Thầy Nguyễn Văn X',
    time: '14:00 - 16:00',
    date: 'Hôm nay',
    students: 25
  },
  {
    id: 2,
    course: 'Tiếng Anh - Lớp B',
    teacher: 'Cô Trần Thị Y',
    time: '16:30 - 18:30',
    date: 'Hôm nay',
    students: 20
  },
  {
    id: 3,
    course: 'Vật lý 11 - Lớp C',
    teacher: 'Thầy Lê Văn Z',
    time: '09:00 - 11:00',
    date: 'Ngày mai',
    students: 18
  }
];

export function RecentActivities() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Activities */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`${activity.color} p-2 rounded-lg flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                </div>
                <div className="flex items-center space-x-1 text-gray-500 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{activity.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Lịch học sắp tới</h3>
        <div className="space-y-4">
          {upcomingClasses.map((classItem) => (
            <div 
              key={classItem.id} 
              className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
              style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(240, 147, 251, 0.05) 100%)'
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{classItem.course}</h4>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {classItem.date}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{classItem.teacher}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{classItem.time}</span>
                </div>
                <span>{classItem.students} học viên</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
