import { Star, Mail, Phone, Award } from 'lucide-react';

type Subject = 'Toán học' | 'Tiếng Anh' | 'Vật lý' | 'Hóa học';
interface Teacher {
  id: number;
  name: string;
  subject: Subject;
  email: string;
  phone: string;
  rating: number;
  students: number;
  experience: string;
  avatar: string;
}

const teachers: Teacher[] = [
  {
    id: 1,
    name: 'Thầy Nguyễn Văn X',
    subject: 'Toán học',
    email: 'nguyenvanx@edu.vn',
    phone: '0901111111',
    rating: 4.8,
    students: 156,
    experience: '10 năm',
    avatar: 'NX'
  },
  {
    id: 2,
    name: 'Cô Trần Thị Y',
    subject: 'Tiếng Anh',
    email: 'tranthiy@edu.vn',
    phone: '0902222222',
    rating: 4.9,
    students: 142,
    experience: '8 năm',
    avatar: 'TY'
  },
  {
    id: 3,
    name: 'Thầy Lê Văn Z',
    subject: 'Vật lý',
    email: 'levanz@edu.vn',
    phone: '0903333333',
    rating: 4.7,
    students: 98,
    experience: '12 năm',
    avatar: 'LZ'
  },
  {
    id: 4,
    name: 'Cô Phạm Thị K',
    subject: 'Hóa học',
    email: 'phamthik@edu.vn',
    phone: '0904444444',
    rating: 4.6,
    students: 87,
    experience: '7 năm',
    avatar: 'PK'
  }
];


const subjectColors: Record<Subject, string> = {
  'Toán học': 'from-blue-500 to-blue-600',
  'Tiếng Anh': 'from-purple-500 to-purple-600',
  'Vật lý': 'from-pink-500 to-pink-600',
  'Hóa học': 'from-orange-500 to-orange-600',
};

export function TeachersList() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Đội ngũ giáo viên</h3>
        <button 
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${subjectColors[teacher.subject] || 'from-gray-500 to-gray-600'})`
                }}
              >
                {teacher.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">{teacher.name}</h4>
                    <p className="text-sm text-purple-600 font-medium">{teacher.subject}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-700">{teacher.rating}</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Award className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span>Kinh nghiệm: {teacher.experience}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Học viên</p>
                    <p className="text-sm font-semibold text-gray-900">{teacher.students}</p>
                  </div>
                  <button className="ml-auto px-4 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
