import { ArrowRight } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Toán Nâng Cao Lớp 12',
    description: 'Luyện thi THPT Quốc gia với phương pháp giải nhanh và hiệu quả.',
    category: 'Toán học',
    level: 'Lớp 12',
    teacher: 'Thầy Minh',
    price: '2.500.000đ',
    badge: 'Phổ biến',
    gradient: 'linear-gradient(135deg, #7494ec, #5a7de0)',
    icon: '🎵',
    categoryColor: '#7494ec'
  },
  {
    id: 2,
    title: 'IELTS Band 7.0+',
    description: 'Khóa học IELTS toàn diện với cam kết đầu ra Band 7.0+.',
    category: 'Tiếng Anh',
    level: 'IELTS',
    teacher: 'Cô Linh',
    price: '4.500.000đ',
    badge: 'Mới',
    gradient: 'linear-gradient(135deg, #6bcb77, #4ade80)',
    icon: '🌐',
    categoryColor: '#6bcb77'
  },
  {
    id: 3,
    title: 'Lập Trình Python Cơ Bản',
    description: 'Bước đầu tiên vào thế giới lập trình với Python dành cho học sinh.',
    category: 'Tin học',
    level: 'Python',
    teacher: 'Thầy Hùng',
    price: '1.800.000đ',
    badge: 'Hot 🔥',
    gradient: 'linear-gradient(135deg, #ffd93d, #f59e0b)',
    icon: '💻',
    categoryColor: '#d97706'
  }
];

export function CoursesSection() {
  return (
    <section id="courses" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full mb-4"
            style={{ background: 'rgba(116,148,236,0.1)' }}
          >
            <span className="text-sm font-semibold" style={{ color: '#7494ec' }}>
              Khóa học phổ biến
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#1a1a2e' }}>
            Các khóa học <span style={{ color: '#7494ec' }}>được yêu thích</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các khóa học chất lượng cao được thiết kế bởi đội ngũ giáo viên giàu kinh nghiệm
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            className="px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105 border-2"
            style={{ color: '#7494ec', borderColor: '#7494ec' }}
          >
            Xem tất cả khóa học
            <ArrowRight className="w-5 h-5 inline-block ml-2" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: typeof courses[0] }) {
  return (
    <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      {/* Course Header */}
      <div className="h-48 relative" style={{ background: course.gradient }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-30">
            {course.icon}
          </div>
        </div>
        <div 
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          {course.badge}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <span 
            className="px-2 py-1 rounded-md text-xs font-medium"
            style={{ 
              background: `${course.categoryColor}1A`,
              color: course.categoryColor
            }}
          >
            {course.category}
          </span>
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
            {course.level}
          </span>
        </div>

        <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a2e' }}>
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-full"
              style={{ background: course.gradient }}
            />
            <span className="text-sm text-gray-600">{course.teacher}</span>
          </div>
          <span className="font-bold" style={{ color: '#7494ec' }}>
            {course.price}
          </span>
        </div>
      </div>
    </div>
  );
}
