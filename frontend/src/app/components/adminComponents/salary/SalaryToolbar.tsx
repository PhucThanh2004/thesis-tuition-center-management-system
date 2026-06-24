// src/app/components/salary/SalaryToolbar.tsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Filter } from 'lucide-react';
import { subjectApi } from '../../../utils/api/subject.api';
import type { Subject } from '../../../utils/types/subject';

interface SalaryToolbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSubjectId: number | undefined;
  onSubjectChange: (id: number | undefined) => void;
  selectedGrade: number | undefined;
  onGradeChange: (grade: number | undefined) => void;
  onAddAgreement: () => void;
  onClearFilters: () => void;
}

export const SalaryToolbar: React.FC<SalaryToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSubjectId,
  onSubjectChange,
  selectedGrade,
  onGradeChange,
  onAddAgreement,
  onClearFilters,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const grades = [6, 7, 8, 9, 10, 11, 12];
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await subjectApi.getAll(1, 100);
        if (res.data) setSubjects(res.data);
      } catch (error) {
        console.error('Không thể tải môn học', error);
      }
    };
    fetchSubjects();
  }, []);

  const hasActiveFilters = selectedSubjectId || selectedGrade;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Box */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/80 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400/50 focus:bg-white focus:border-indigo-300 transition-all duration-200 placeholder:text-gray-400 text-sm"
            placeholder="Tìm kiếm theo tên giảng viên..."
          />
        </div>

        {/* Filters và Actions */}
        <div className="flex gap-3 w-full lg:w-auto flex-wrap items-center">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden px-4 py-2.5 bg-gray-50/80 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium"
          >
            <Filter size={18} />
            <span>Bộ lọc</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            )}
          </button>

          {/* Desktop Filters */}
          <div className={`${isFilterOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-3 w-full lg:w-auto`}>
            <select
              value={selectedSubjectId || ''}
              onChange={(e) => onSubjectChange(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-400/50 focus:bg-white focus:border-indigo-300 transition-all min-w-[140px] text-gray-700"
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>

            <select
              value={selectedGrade || ''}
              onChange={(e) => onGradeChange(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-400/50 focus:bg-white focus:border-indigo-300 transition-all min-w-[140px] text-gray-700"
            >
              <option value="">Tất cả khối</option>
              {grades.map(g => <option key={g} value={g}>Lớp {g}</option>)}
            </select>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border border-red-200"
              >
                <X size={16} />
                <span>Xóa lọc</span>
              </button>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={onAddAgreement}
            className="btn-gradient text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105 whitespace-nowrap text-sm"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Thêm thỏa thuận</span>
          </button>
        </div>
      </div>

      {/* Active Filters Tags - Mobile */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 lg:hidden">
          {selectedSubjectId && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
              {subjects.find(s => s.id === selectedSubjectId)?.name || 'Môn học'}
              <button
                onClick={() => onSubjectChange(undefined)}
                className="hover:text-indigo-900"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedGrade && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
              Lớp {selectedGrade}
              <button
                onClick={() => onGradeChange(undefined)}
                className="hover:text-indigo-900"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={onClearFilters}
            className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
};