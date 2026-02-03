import { useState } from 'react';
import { ArrowLeft, Users, Calendar, DollarSign, MapPin, Phone, Mail, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import type { Class, Student } from '../../../pages/admin/ClassListPage';
import { StudentModal } from './StudentModal';

interface ClassDetailProps {
  classData: Class;
  onBack: () => void;
}

export function ClassDetail({ classData, onBack }: ClassDetailProps) {
  const [students, setStudents] = useState<Student[]>(classData.students || []);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleSaveStudent = (student: Student) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === student.id ? student : s));
    } else {
      setStudents([...students, { ...student, id: Date.now().toString() }]);
    }
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const activeStudents = students.filter(s => s.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại</span>
      </button>

      {/* Class Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.name}</h1>
            <p className="text-lg text-gray-600">{classData.subject} - Khối {classData.grade}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            classData.status === 'active' ? 'bg-green-100 text-green-700' :
            classData.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {classData.status === 'active' ? 'Đang hoạt động' :
             classData.status === 'upcoming' ? 'Sắp khai giảng' :
             'Đã kết thúc'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Học sinh</p>
              <p className="text-xl font-bold text-gray-900">
                {activeStudents}/{classData.maxStudents}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Học phí/tháng</p>
              <p className="text-xl font-bold text-gray-900">
                {classData.fee.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phòng học</p>
              <p className="text-xl font-bold text-gray-900">{classData.room}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Khai giảng</p>
              <p className="text-xl font-bold text-gray-900">
                {new Date(classData.startDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Thông tin giáo viên</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{classData.teacher}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{classData.teacherPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Lịch học
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classData.schedule.map((sch, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-semibold text-blue-900 mb-1">{sch.day}</p>
              <p className="text-blue-700">{sch.startTime} - {sch.endTime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Danh sách học sinh ({students.length})
          </h2>
          <button
            onClick={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
            className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
          >
            <Plus className="w-5 h-5" />
            Thêm học sinh
          </button>
        </div>

        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STT</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Họ và tên</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Khối</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SĐT học sinh</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SĐT phụ huynh</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">Khối {student.grade}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{student.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{student.parentPhone}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {student.status === 'active' ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Đang học
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            Nghỉ học
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Chưa có học sinh nào</p>
            <p className="text-gray-400 text-sm">Nhấn "Thêm học sinh" để thêm học sinh vào lớp</p>
          </div>
        )}
      </div>

      {/* Student Modal */}
      {isStudentModalOpen && (
        <StudentModal
          student={editingStudent}
          classGrade={classData.grade}
          onSave={handleSaveStudent}
          onClose={() => {
            setIsStudentModalOpen(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
}