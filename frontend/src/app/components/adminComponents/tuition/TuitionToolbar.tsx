// src/components/adminComponents/tuition/TuitionToolbar.tsx
import React from 'react';
import { Search, ChevronDown, Filter, X } from 'lucide-react';
// src/components/adminComponents/tuition/TuitionToolbar.tsx
// Cập nhật interface và logic

interface TuitionToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedMonth: number;
  onMonthChange: (value: number) => void;
  selectedYear: number;
  onYearChange: (value: number) => void;
  selectedGrade: string;
  onGradeChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  monthOptions: { value: number; label: string }[];
  yearOptions: number[];
  gradeOptions: { value: string; label: string }[];  // ✅ Đổi type
  statusOptions: { value: string; label: string }[];
  onFilterClick: () => void;
  showFilters?: boolean;
  onClearFilters?: () => void;
}

const TuitionToolbar: React.FC<TuitionToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  selectedGrade,
  onGradeChange,
  selectedStatus,
  onStatusChange,
  monthOptions,
  yearOptions,
  gradeOptions,
  statusOptions,
  onFilterClick,
  showFilters = false,
  onClearFilters,
}) => {
  // ✅ Không cần getGradeLabel nữa vì đã có label từ options
  const getStatusLabel = (status: string) => {
    const found = statusOptions.find(s => s.value === status);
    return found?.label || 'Tất cả trạng thái';
  };

  const getMonthLabel = (month: number) => {
    return monthOptions.find(m => m.value === month)?.label || `Tháng ${month}`;
  };

  const hasActiveFilters = selectedGrade !== '' || selectedStatus !== '';

  return (
    <div className="sticky top-6 z-30 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg shadow-gray-100/50 mb-6 border border-gray-100">
      <div className="p-2.5 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex-1 min-w-[180px] relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Tìm kiếm học sinh..."
          />
        </div>
        
        {/* Month filter */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className="appearance-none pl-2.5 pr-6 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {monthOptions.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
        
        {/* Year filter */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="appearance-none pl-2.5 pr-6 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
        
        {/* Filter button */}
        <button
          onClick={onFilterClick}
          className={`p-1.5 rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-indigo-100 text-indigo-600' 
              : 'bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Active Filters Bar */}
      {(showFilters || hasActiveFilters) && (
        <div className="px-2.5 pb-2.5 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5">
          <span className="text-[10px] text-gray-500">Bộ lọc đang áp dụng:</span>
          
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 rounded-lg text-[10px] text-indigo-600">
            <span>Tháng: {getMonthLabel(selectedMonth)}</span>
          </div>
          
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 rounded-lg text-[10px] text-indigo-600">
            <span>Năm: {selectedYear}</span>
          </div>
          
          {selectedGrade && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 rounded-lg text-[10px] text-indigo-600">
              <span>Khối: {
                gradeOptions.find(g => g.value === selectedGrade)?.label || selectedGrade
              }</span>
              <X 
                className="w-2.5 h-2.5 cursor-pointer hover:text-indigo-800" 
                onClick={() => onGradeChange('')}
              />
            </div>
          )}
          
          {selectedStatus && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 rounded-lg text-[10px] text-indigo-600">
              <span>Trạng thái: {getStatusLabel(selectedStatus)}</span>
              <X 
                className="w-2.5 h-2.5 cursor-pointer hover:text-indigo-800" 
                onClick={() => onStatusChange('')}
              />
            </div>
          )}
          
          {onClearFilters && (selectedGrade || selectedStatus) && (
            <button
              onClick={onClearFilters}
              className="text-[10px] text-gray-400 hover:text-gray-600 ml-1"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      )}
      
      {/* Expanded Filters */}
      {showFilters && (
        <div className="px-2.5 pb-2.5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2.5">
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => onGradeChange(e.target.value)}
              className="appearance-none pl-2.5 pr-6 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {gradeOptions.map(grade => (
                <option key={grade.value || 'all'} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none pl-2.5 pr-6 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {statusOptions.map(status => (
                <option key={status.value || 'all'} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionToolbar;