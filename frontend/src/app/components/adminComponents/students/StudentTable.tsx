// src/app/components/students/StudentTable.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  School, 
  Calendar, 
  Mail, 
  Phone,
  MapPin,
  BookOpen,
  ChevronDown,
  Eye,
  Edit,
  Check
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { Student } from '../../../utils/types/student';

interface StudentTableProps {
  students: Student[];
  total?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSelectionChange?: (selectedIds: number[]) => void;
  onEditStudent?: (student: Student) => void;
  onViewStudent?: (student: Student) => void;
  loading?: boolean;
}

// Helper to get full image URL
const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_BACKEND_URL_IMAGE || import.meta.env.VITE_BACKEND_URL || '';
  const cleanBaseUrl = baseUrl.replace(/\/v1\/api$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${cleanBaseUrl}${path}`;
};

// Custom Checkbox Component
const CustomCheckbox = ({ 
  checked, 
  onChange, 
  onClick,
  indeterminate = false,
  className = ""
}: { 
  checked: boolean; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent) => void;
  indeterminate?: boolean;
  className?: string;
}) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        ref={input => {
          if (input) {
            input.indeterminate = indeterminate;
          }
        }}
        className="peer appearance-none w-4 h-4 rounded-md border-2 border-slate-300 bg-white 
          checked:border-violet-600 checked:bg-violet-600 
          hover:border-violet-400 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:ring-offset-0
          transition-all duration-200 cursor-pointer
          checked:hover:bg-violet-700 checked:hover:border-violet-700"
      />
      {checked && (
        <Check 
          size={10} 
          className="absolute text-white pointer-events-none 
            peer-checked:opacity-100 opacity-0 transition-opacity duration-200"
          strokeWidth={3}
        />
      )}
      {indeterminate && !checked && (
        <div className="absolute w-2 h-0.5 bg-violet-600 rounded-full pointer-events-none" />
      )}
    </div>
  );
};

const StudentTable: React.FC<StudentTableProps> = ({ 
  students, 
  total = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSelectionChange,
  onEditStudent,
  onViewStudent,
  loading = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  const handleSelectAll = (checked: boolean) => {
    const newSelectedIds = checked ? students.map(s => s.id) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedIds, id]
      : selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const handleEditClick = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditStudent?.(student);
  };

  const handleViewClick = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    onViewStudent?.(student);
  };

  const handleRowClick = (student: Student) => {
    onViewStudent?.(student);
  };

  const toggleExpand = (studentId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getGenderText = (gender: boolean) => {
    return gender ? 'Nam' : 'Nữ';
  };

  const getGenderColor = (gender: boolean) => {
    return gender === true 
      ? 'bg-blue-50 text-blue-600' 
      : 'bg-pink-50 text-pink-600';
  };

  const getFullImageUrlFn = (student: Student) => {
    if (student.image) {
      const url = getFullImageUrl(student.image);
      return url ? `url('${url}')` : '';
    }
    return `url('https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=${encodeURIComponent(student.fullName)}')`;
  };

  const allSelected = students.length > 0 && selectedIds.length === students.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < students.length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-3 text-sm text-slate-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
      {/* Header - chỉ hiển thị số lượng */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            Danh sách học sinh
          </span>
          <span className="text-xs text-slate-400">({total})</span>
        </div>
        
        {/* Checkbox select all - custom */}
        {students.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium cursor-pointer select-none">
              Chọn tất cả
            </label>
            <CustomCheckbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
        )}
      </div>

      {/* Students Grid/Cards */}
      <div className="p-4 space-y-2">
        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Không có dữ liệu học sinh</p>
          </div>
        ) : (
          <AnimatePresence>
            {students.map((student, idx) => {
              const isExpanded = expandedStudent === student.id;
              const avatarStyle = getFullImageUrlFn(student);
              const isSelected = selectedIds.includes(student.id);
              
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  onClick={() => handleRowClick(student)}
                  className={cn(
                    "group flex flex-col p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "border-violet-300 bg-violet-50/50 shadow-sm"
                      : "border-slate-100 bg-white hover:shadow-md hover:border-slate-200"
                  )}
                >
                  {/* Main row - always visible */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Custom Checkbox */}
                      <CustomCheckbox
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(student.id, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full bg-center bg-cover border-2 border-white shadow-sm flex-shrink-0"
                        style={{ backgroundImage: avatarStyle }}
                      />

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {student.fullName}
                          </p>
                          <span className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0",
                            getGenderColor(student.gender)
                          )}>
                            {getGenderText(student.gender)}
                          </span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 flex-shrink-0">
                            Lớp {student.grade}
                          </span>
                        </div>
                        
                        {/* Thông tin chi tiết */}
                        <div className="flex items-center gap-4 mt-0.5 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Mail size={11} className="text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] text-slate-600 truncate max-w-[150px]">
                              {student.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={11} className="text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] text-slate-600">
                              {student.phoneNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] text-slate-600">
                              {formatDate(student.dateOfBirth)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Subjects and Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      {/* Subjects */}
                      <div className="hidden md:flex items-center gap-1 max-w-[150px]">
                        {student.subjects && student.subjects.length > 0 ? (
                          <>
                            {student.subjects.slice(0, 2).map(subject => (
                              <span 
                                key={subject.id} 
                                className="px-1.5 py-0.5 bg-violet-50 text-violet-700 text-[11px] font-medium rounded-full truncate max-w-[60px]"
                              >
                                {subject.name}
                              </span>
                            ))}
                            {student.subjects.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-full">
                                +{student.subjects.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400">Chưa có môn</span>
                        )}
                      </div>

                      {/* School - căn trái với độ rộng cố định để thẳng hàng */}
                      <div className="hidden sm:flex items-center gap-1.5 min-w-[120px] max-w-[160px]">
                        <School size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="text-[11px] text-slate-600 truncate text-left w-full">
                          {student.schoolName}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleViewClick(student, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-50 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleEditClick(student, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => toggleExpand(student.id, e)}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            isExpanded 
                              ? "text-violet-500 bg-violet-50" 
                              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          )}
                          title="Xem thêm"
                        >
                          <ChevronDown 
                            size={14} 
                            className={cn(
                              "transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Address */}
                          {student.address && student.address.details && (
                            <div className="flex items-start gap-2">
                              <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[10px] font-medium text-slate-500">Địa chỉ</p>
                                <p className="text-xs text-slate-700">{student.address.details}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* All Subjects */}
                          {student.subjects && student.subjects.length > 0 && (
                            <div className="flex items-start gap-2">
                              <BookOpen size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[10px] font-medium text-slate-500">Tất cả môn học</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {student.subjects.map(subject => (
                                    <span 
                                      key={subject.id} 
                                      className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-medium rounded-full"
                                    >
                                      {subject.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Additional Info */}
                          <div className="flex items-start gap-2">
                            <School size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] font-medium text-slate-500">Trường học</p>
                              <p className="text-xs text-slate-700">{student.schoolName}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50/30">
          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-violet-500" />
            Hiển thị {students.length} trên {total} học sinh
          </p>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-violet-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trước</span>
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all min-w-[28px]",
                    currentPage === pageNum
                      ? 'btn-gradient text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-violet-300'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-violet-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="hidden sm:inline">Sau</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTable;