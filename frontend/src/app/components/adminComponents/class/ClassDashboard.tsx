import { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Users, Calendar, Phone } from 'lucide-react';
import type { Class } from '../../../pages/admin/ClassListPage';
import { mockClasses } from './mockData';
import { ClassModal } from './ClassModal';

interface ClassDashboardProps {
  onSelectClass: (classData: Class) => void;
}

const colors = ["#EDE9FE", "#DBEAFE", "#EBFCEF", "#FFFDE7", "#FFF5F5"];

export function ClassDashboard({ onSelectClass }: ClassDashboardProps) {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || cls.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || cls.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleSaveClass = (classData: Class) => {
    if (editingClass) {
      setClasses(classes.map(c => c.id === classData.id ? classData : c));
    } else {
      setClasses([...classes, { ...classData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleEditClass = (classData: Class, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClass(classData);
    setIsModalOpen(true);
  };

  const stats = {
    total: classes.length,
    active: classes.filter(c => c.status === 'active').length,
    students: classes.reduce((sum, c) => sum + c.studentCount, 0),
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lớp học</h1>
        <p className="text-gray-600">Trung tâm dạy thêm cấp 2, 3</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng số lớp</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Lớp đang hoạt động</p>
              <p className="text-3xl font-bold mt-1" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stats.active}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng học sinh</p>
              <p className="text-3xl font-bold mt-1" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stats.students}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên lớp, môn học, giáo viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả khối</option>
                <option value="6">Khối 6</option>
                <option value="7">Khối 7</option>
                <option value="8">Khối 8</option>
                <option value="9">Khối 9</option>
                <option value="10">Khối 10</option>
                <option value="11">Khối 11</option>
                <option value="12">Khối 12</option>
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="upcoming">Sắp khai giảng</option>
              <option value="completed">Đã kết thúc</option>
            </select>

            <button
              onClick={() => {
                setEditingClass(null);
                setIsModalOpen(true);
              }}
              className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap shadow-md"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
            >
              <Plus className="w-5 h-5" />
              Thêm lớp học
            </button>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classData, index) => (
          <div
            key={classData.id}
            onClick={() => onSelectClass(classData)}
            className="rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            {/* Image */}
            {classData.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={classData.imageUrl} 
                  alt={classData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{classData.name}</h3>
                  <p className="text-sm text-gray-600">{classData.subject} - Khối {classData.grade}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  classData.status === 'active' ? 'bg-green-100 text-green-700' :
                  classData.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {classData.status === 'active' ? 'Hoạt động' :
                   classData.status === 'upcoming' ? 'Sắp diễn ra' :
                   'Đã kết thúc'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{classData.studentCount}/{classData.maxStudents} học sinh</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>GV: {classData.teacher}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{classData.teacherPhone}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {classData.schedule.map(s => `${s.day} (${s.startTime}-${s.endTime})`).join(', ')}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Học phí: {classData.fee.toLocaleString('vi-VN')}đ/tháng
                </span>
                <button
                  onClick={(e) => handleEditClass(classData, e)}
                  className="text-sm hover:opacity-80 font-medium transition-colors"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy lớp học nào</p>
        </div>
      )}

      {/* Class Modal */}
      {isModalOpen && (
        <ClassModal
          classData={editingClass}
          onSave={handleSaveClass}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClass(null);
          }}
        />
      )}
    </div>
  );
}