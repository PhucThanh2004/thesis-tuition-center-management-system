import { Clock, Users, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const courses = [
  {
    id: 1,
    title: 'Toán học THCS',
    description: 'Chương trình Toán học từ lớp 6-9, tập trung vào tư duy logic và giải quyết vấn đề',
    image: 'https://images.unsplash.com/photo-1613563696477-85af63b3b602?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjkyOTI2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    duration: '3 tháng',
    students: 120,
    rating: 4.8,
    price: '2.500.000đ'
  },
  {
    id: 2,
    title: 'Khoa học tự nhiên',
    description: 'Vật lý, Hóa học, Sinh học với phương pháp thực nghiệm sinh động',
    image: 'https://images.unsplash.com/photo-1628864005140-7770b9b8e7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFib3JhdG9yeSUyMGxlYXJuaW5nfGVufDF8fHx8MTc2OTMwODI1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    duration: '4 tháng',
    students: 95,
    rating: 4.9,
    price: '3.000.000đ'
  },
  {
    id: 3,
    title: 'Tiếng Anh giao tiếp',
    description: 'Phát triển kỹ năng nghe - nói - đọc - viết với giáo viên bản ngữ',
    image: 'https://images.unsplash.com/photo-1567206163313-9e34c830557a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGFuZ3VhZ2UlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjkzMDgyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    duration: '6 tháng',
    students: 180,
    rating: 5.0,
    price: '3.500.000đ'
  }
];

export function Courses() {
  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Khóa học nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Chương trình học đa dạng, phù hợp với mọi lứa tuổi và trình độ
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {course.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students} học viên</span>
                  </div>
                </div>

                {/* Rating and CTA */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{course.rating}</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
            Xem tất cả khóa học
          </button>
        </div>
      </div>
    </section>
  );
}
