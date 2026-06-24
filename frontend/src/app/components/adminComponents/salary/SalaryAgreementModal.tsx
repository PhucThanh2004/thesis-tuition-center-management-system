// src/app/components/salary/SalaryAgreementModal.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, DollarSign, Clock, Calendar, FileText, User, BookOpen, Sparkles } from 'lucide-react';
import { teacherApi } from '../../../utils/api/teacher.api';
import { subjectApi } from '../../../utils/api/subject.api';
import type { TeacherBasic } from '../../../utils/types/teacher';
import type { Subject } from '../../../utils/types/subject';
import type { TeacherSubjectRequest } from '../../../utils/types/teacherSubject';

interface SalaryAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeacherSubjectRequest) => void;
  initialData?: any;
  isEdit?: boolean;
}

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.4, bounce: 0.25, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const SalaryAgreementModal: React.FC<SalaryAgreementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEdit = false,
}) => {
  const [teachers, setTeachers] = useState<TeacherBasic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<TeacherSubjectRequest>({
    teacherId: 0,
    subjectId: 0,
    salaryRate: 0,
  });

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        teacherApi.getBasicList(),
        subjectApi.getAll(1, 100)
      ]).then(([teacherList, subjectRes]) => {
        setTeachers(teacherList);
        setSubjects(subjectRes.data || []);
        setLoading(false);
      }).catch(err => {
        console.error('Lỗi tải dữ liệu', err);
        setLoading(false);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        teacherId: initialData.teacherId,
        subjectId: initialData.subjectId,
        salaryRate: parseInt(initialData.salaryRate.replace(/\D/g, ''), 10) || 0,
      });
    } else {
      setFormData({ teacherId: 0, subjectId: 0, salaryRate: 0 });
    }
  }, [initialData]);

  const handleChange = (field: keyof TeacherSubjectRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data before submit:', formData);
    if (!formData.teacherId || !formData.subjectId || !formData.salaryRate) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-50">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">
                      {isEdit ? 'Chỉnh sửa thỏa thuận lương' : 'Thêm thỏa thuận lương'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEdit ? 'Cập nhật các điều khoản tài chính' : 'Tạo thỏa thuận lương mới'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {/* Loading state */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <div className="h-8 w-8 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-xs text-slate-400">Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  <>
                    {/* Teacher Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-purple-500" />
                        Giáo viên <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.teacherId}
                        onChange={(e) => handleChange('teacherId', Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white text-slate-700 text-sm transition-all appearance-none"
                        required
                        disabled={loading}
                      >
                        <option value="">-- Chọn giáo viên --</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.fullName}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subject Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-purple-500" />
                        Môn học <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.subjectId}
                        onChange={(e) => handleChange('subjectId', Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white text-slate-700 text-sm transition-all appearance-none"
                        required
                        disabled={loading}
                      >
                        <option value="">-- Chọn môn học --</option>
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Salary Rate */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        Mức lương / Giờ <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">đ</span>
                        <input
                          type="number"
                          value={formData.salaryRate}
                          onChange={(e) => handleChange('salaryRate', parseInt(e.target.value) || 0)}
                          className="w-full pl-6 pr-16 py-2.5 rounded-lg border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white text-slate-700 text-sm transition-all"
                          placeholder="150000"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                          /giờ
                        </span>
                      </div>
                    </div>

                    {/* Preview Card */}
                    {formData.teacherId > 0 && formData.subjectId > 0 && formData.salaryRate > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                          <span className="text-[10px] font-medium text-purple-500 uppercase tracking-wide">Thông tin thỏa thuận</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <p className="text-slate-400">Giáo viên</p>
                            <p className="font-medium text-slate-700 truncate">
                              {teachers.find(t => t.id === formData.teacherId)?.fullName || 'Chưa chọn'}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400">Môn học</p>
                            <p className="font-medium text-slate-700 truncate">
                              {subjects.find(s => s.id === formData.subjectId)?.name || 'Chưa chọn'}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400">Mức lương</p>
                            <p className="font-medium text-emerald-600">
                              {formData.salaryRate.toLocaleString('vi-VN')}đ/giờ
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-lg text-sm font-medium text-white btn-gradient from-purple-500 to-purple-600 shadow-sm shadow-purple-200 hover:shadow-md hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {isEdit ? 'Lưu thay đổi' : 'Thêm thỏa thuận'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};