// src/components/teacherComponents/payroll/TeacherPayrollToolbar.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Calendar,
  Tag,
  RefreshCw,
} from 'lucide-react';

interface TeacherPayrollToolbarProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  monthFilter: number | string;
  onMonthChange: (value: number | string) => void;
  yearFilter: number | string;
  onYearChange: (value: number | string) => void;
  onExport: () => void;
  onRefresh: () => void;
}

// Tháng options - Thêm "Tất cả"
const months = [
  { value: 'all', label: 'Tất cả các tháng' },
  { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' }, { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' }, { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' }
];

// Năm options - Thêm "Tất cả"
const getYearOptions = (currentYear: number) => {
  return [
    { value: 'all', label: 'Tất cả các năm' },
    { value: currentYear - 2, label: `Năm ${currentYear - 2}` },
    { value: currentYear - 1, label: `Năm ${currentYear - 1}` },
    { value: currentYear, label: `Năm ${currentYear}` },
    { value: currentYear + 1, label: `Năm ${currentYear + 1}` },
    { value: currentYear + 2, label: `Năm ${currentYear + 2}` }
  ];
};

// Trạng thái options
const statusOptions = [
  { value: 'all', label: 'Tất cả', color: 'slate' },
  { value: 'DRAFT', label: 'Nháp', color: 'slate' },
  { value: 'WAITING_TEACHER_CONFIRMATION', label: 'Chờ xác nhận', color: 'amber' },
  { value: 'TEACHER_CONFIRMED', label: 'Đã xác nhận', color: 'blue' },
  { value: 'REJECTED', label: 'Từ chối', color: 'red' },
  { value: 'REQUEST_ADJUSTMENT', label: 'Y/C điều chỉnh', color: 'amber' },
  { value: 'FINALIZED', label: 'Đã chốt', color: 'purple' },
  { value: 'PAID', label: 'Đã thanh toán', color: 'emerald' }
];

// Active filter badge component
const ActiveFilterBadge: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-medium text-purple-700"
  >
    {label}
    <button onClick={onRemove} className="hover:bg-purple-100 rounded-full p-0.5 transition-colors">
      <X className="h-3 w-3" />
    </button>
  </motion.span>
);

export const TeacherPayrollToolbar = ({
  searchKeyword,
  onSearchChange,
  statusFilter,
  onStatusChange,
  monthFilter,
  onMonthChange,
  yearFilter,
  onYearChange,
  onExport,
  onRefresh,
}: TeacherPayrollToolbarProps) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = getYearOptions(currentYear);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // Đếm số filter đang active
  const activeFilterCount = [
    monthFilter !== 'all',
    yearFilter !== 'all',
    statusFilter !== 'all'
  ].filter(Boolean).length;

  // Xóa tất cả filters
  const clearAllFilters = () => {
    onMonthChange('all');
    onYearChange('all');
    onStatusChange('all');
    onSearchChange('');
  };

  // Lấy danh sách filter đang active để hiển thị
  const getActiveFilterLabels = () => {
    const labels = [];
    if (monthFilter !== 'all') {
      const month = months.find(m => m.value === monthFilter);
      if (month) labels.push(month.label);
    }
    if (yearFilter !== 'all') {
      labels.push(`Năm ${yearFilter}`);
    }
    if (statusFilter !== 'all') {
      const status = statusOptions.find(s => s.value === statusFilter);
      if (status) labels.push(status.label);
    }
    if (searchKeyword) {
      labels.push(`Tìm: ${searchKeyword}`);
    }
    return labels;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'all': 'text-slate-600',
      'DRAFT': 'text-slate-600',
      'WAITING_TEACHER_CONFIRMATION': 'text-amber-600',
      'TEACHER_CONFIRMED': 'text-blue-600',
      'REJECTED': 'text-red-600',
      'REQUEST_ADJUSTMENT': 'text-amber-700', 
      'FINALIZED': 'text-purple-600',
      'PAID': 'text-emerald-600'
    };
    return statusColors[status] || 'text-slate-600';
  };

  // Format hiển thị giá trị month
  const getMonthDisplayValue = () => {
    if (monthFilter === 'all') return 'all';
    return monthFilter;
  };

  // Format hiển thị giá trị year
  const getYearDisplayValue = () => {
    if (yearFilter === 'all') return 'all';
    return yearFilter;
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Filter Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50/50 transition-colors"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50">
              <SlidersHorizontal className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700">Bộ lọc dữ liệu</h4>
              <p className="text-xs text-slate-400 hidden sm:block">Lọc bảng lương theo tháng, năm và trạng thái</p>
            </div>
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">

            {activeFilterCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="text-xs text-slate-400 hover:text-purple-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="hidden sm:inline">Xóa tất cả</span>
              </motion.button>
            )}

            <motion.div
              animate={{ rotate: isFilterExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-400"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </div>

        {/* Filter Content - Collapsible */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-5">
                {/* Search Input - Tìm kiếm theo tháng/năm */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tháng/năm (ví dụ: 5/2026)..."
                      value={searchKeyword}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white text-slate-700 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Month Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Tháng
                    </label>
                    <div className="relative">
                      <select
                        value={getMonthDisplayValue()}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'all') {
                            onMonthChange('all');
                          } else {
                            onMonthChange(parseInt(value));
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 focus:outline-none appearance-none bg-white text-slate-700 text-sm transition-all"
                      >
                        {months.map(month => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-4 w-4" />
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Năm
                    </label>
                    <div className="relative">
                      <select
                        value={getYearDisplayValue()}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'all') {
                            onYearChange('all');
                          } else {
                            onYearChange(parseInt(value));
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 focus:outline-none appearance-none bg-white text-slate-700 text-sm transition-all"
                      >
                        {yearOptions.map(year => (
                          <option key={year.value} value={year.value}>
                            {year.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-4 w-4" />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Trạng thái
                    </label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 focus:outline-none appearance-none bg-white text-sm transition-all ${getStatusColor(statusFilter)}`}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Active filters display */}
                {activeFilterCount > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400">Đang áp dụng:</span>
                      <AnimatePresence>
                        {getActiveFilterLabels().map((label, idx) => (
                          <ActiveFilterBadge
                            key={idx}
                            label={label}
                            onRemove={() => {
                              if (label.includes('Tháng')) onMonthChange('all');
                              else if (label.includes('Năm')) onYearChange('all');
                              else if (statusOptions.find(s => s.label === label)) onStatusChange('all');
                              else if (label.includes('Tìm:')) onSearchChange('');
                            }}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};