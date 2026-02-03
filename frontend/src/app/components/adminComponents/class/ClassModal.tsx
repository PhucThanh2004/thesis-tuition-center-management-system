import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Class, Schedule } from '../../../pages/admin/ClassListPage';

interface ClassModalProps {
  classData: Class | null;
  onSave: (classData: Class) => void;
  onClose: () => void;
}

export function ClassModal({ classData, onSave, onClose }: ClassModalProps) {
  const [formData, setFormData] = useState<Partial<Class>>({
    name: '',
    subject: '',
    grade: '6',
    teacher: '',
    teacherPhone: '',
    schedule: [{ day: 'Thứ 2', startTime: '18:00', endTime: '20:00' }],
    studentCount: 0,
    maxStudents: 20,
    startDate: '',
    fee: 0,
    room: '',
    status: 'upcoming',
    students: [],
  });

  useEffect(() => {
    if (classData) {
      setFormData(classData);
    }
  }, [classData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Class);
  };

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedule: [
        ...(formData.schedule || []),
        { day: 'Thứ 2', startTime: '18:00', endTime: '20:00' }
      ]
    });
  };

  const removeSchedule = (index: number) => {
    const newSchedule = formData.schedule?.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: newSchedule });
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: string) => {
    const newSchedule = formData.schedule?.map((sch, i) => 
      i === index ? { ...sch, [field]: value } : sch
    );
    setFormData({ ...formData, schedule: newSchedule });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {classData ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Toán 8A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn môn học</option>
                  <option value="Toán học">Toán học</option>
                  <option value="Ngữ văn">Ngữ văn</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Vật lý">Vật lý</option>
                  <option value="Hóa học">Hóa học</option>
                  <option value="Sinh học">Sinh học</option>
                  <option value="Lịch sử">Lịch sử</option>
                  <option value="Địa lý">Địa lý</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khối <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="6">Khối 6</option>
                  <option value="7">Khối 7</option>
                  <option value="8">Khối 8</option>
                  <option value="9">Khối 9</option>
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phòng học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Phòng 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số học sinh tối đa <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Học phí (VNĐ/tháng) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="10000"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: 800000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày khai giảng <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="upcoming">Sắp khai giảng</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="completed">Đã kết thúc</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thông tin giáo viên */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Thông tin giáo viên</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.teacherPhone}
                  onChange={(e) => setFormData({ ...formData, teacherPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: 0901234567"
                />
              </div>
            </div>
          </div>

          {/* Lịch học */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Lịch học</h3>
              <button
                type="button"
                onClick={addSchedule}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Thêm buổi học
              </button>
            </div>

            <div className="space-y-3">
              {formData.schedule?.map((sch, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <select
                    value={sch.day}
                    onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Thứ 2">Thứ 2</option>
                    <option value="Thứ 3">Thứ 3</option>
                    <option value="Thứ 4">Thứ 4</option>
                    <option value="Thứ 5">Thứ 5</option>
                    <option value="Thứ 6">Thứ 6</option>
                    <option value="Thứ 7">Thứ 7</option>
                    <option value="Chủ nhật">Chủ nhật</option>
                  </select>

                  <input
                    type="time"
                    value={sch.startTime}
                    onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <input
                    type="time"
                    value={sch.endTime}
                    onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {formData.schedule && formData.schedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all shadow-md"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
            >
              {classData ? 'Cập nhật' : 'Thêm lớp học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}