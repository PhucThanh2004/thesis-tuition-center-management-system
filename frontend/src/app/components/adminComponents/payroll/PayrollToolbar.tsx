import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  Eye,
  X,
  Calendar,
  User,
  Tag,
  RefreshCw,
  LayoutGrid,
  Clock,
  FileCheck,
  PlusCircle,
  XCircle,
} from 'lucide-react';
import type { PayrollFilter } from '../../../utils/types/payroll';
import './payroll.css';

interface PayrollToolbarProps {
  activeTab: string;
  onTabChange: (tab: 'preview' | 'list' | 'waiting' | 'finalized' | 'rejected') => void; // ✅ THÊM 'rejected'
  filters: PayrollFilter;
  onFilterChange: (filters: Partial<PayrollFilter>) => void;
  onPreviewMonthly?: () => void;
}

// Tab configuration
const tabs = [
  { id: 'list', label: 'Danh sách', icon: LayoutGrid, description: 'Tất cả bảng lương' },
  { id: 'waiting', label: 'Chờ xác nhận', icon: Clock, description: 'Cần phản hồi từ GV' },
  { id: 'rejected', label: 'Từ chối', icon: XCircle, description: 'Bảng lương bị từ chối/cần điều chỉnh' },
  { id: 'finalized', label: 'Đã chốt', icon: FileCheck, description: 'Hoàn tất chốt lương' },
  { id: 'preview', label: 'Tạo mới', icon: PlusCircle, description: 'Tạo bảng lương mới' }
];

// Month options
const monthOptions = [
  { value: 'all', label: 'Tất cả các tháng' },
  { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' }, { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' }, { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' }, { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' }, { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' }
];

// Year options
const currentYear = new Date().getFullYear();
const yearOptions = [
  { value: 'all', label: 'Tất cả các năm' },
  { value: currentYear - 2, label: `${currentYear - 2}` },
  { value: currentYear - 1, label: `${currentYear - 1}` },
  { value: currentYear, label: `${currentYear}` },
  { value: currentYear + 1, label: `${currentYear + 1}` },
  { value: currentYear + 2, label: `${currentYear + 2}` }
];

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'WAITING_TEACHER_CONFIRMATION', label: 'Chờ xác nhận' },
  { value: 'TEACHER_CONFIRMED', label: 'Đã xác nhận' },
  { value: 'REJECTED', label: 'Từ chối' }, // ✅ THÊM MỚI
  { value: 'REQUEST_ADJUSTMENT', label: 'Y/C điều chỉnh' }, // ✅ THÊM MỚI
  { value: 'FINALIZED', label: 'Đã chốt' },
  { value: 'PAID', label: 'Đã thanh toán' }
];

const TabButton: React.FC<{
  tab: typeof tabs[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ tab, isActive, onClick }) => {
  const Icon = tab.icon;

  // ✅ THÊM MỚI: Xác định màu sắc cho từng tab
  const getActiveClasses = () => {
    if (tab.id === 'rejected') {
      return 'bg-red-50 text-red-600 border-red-200 shadow-sm';
    }
    return 'bg-primary-fixed text-primary border-primary/10 shadow-sm';
  };

  const getHoverClasses = () => {
    if (tab.id === 'rejected') {
      return 'hover:text-red-600 hover:bg-red-50/40';
    }
    return 'hover:text-primary hover:bg-primary-fixed/40';
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-normal text-sm transition-all duration-200 ${isActive
          ? getActiveClasses()
          : `text-secondary ${getHoverClasses()} border border-transparent`
        }`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">
        {tab.id === 'list' && 'DS'}
        {tab.id === 'waiting' && 'Chờ'}
        {tab.id === 'rejected' && 'Từ chối'}
        {tab.id === 'finalized' && 'Chốt'}
        {tab.id === 'preview' && 'Mới'}
      </span>
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${tab.id === 'rejected' ? 'bg-red-500' : 'bg-primary'
            }`}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

// Filter badge component
const ActiveFilterBadge: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-fixed border border-primary/20 text-[11px] font-normal text-primary"
  >
    {label}
    <button onClick={onRemove} className="hover:bg-primary-fixed-dim rounded-full p-0.5 transition-colors">
      <X className="h-2.5 w-2.5" />
    </button>
  </motion.span>
);

const PayrollToolbar: React.FC<PayrollToolbarProps> = ({
  activeTab,
  onTabChange,
  filters,
  onFilterChange,
  onPreviewMonthly
}) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const getMonthDisplayValue = (): string => {
    if (filters.month === undefined || filters.month === null) return 'all';
    return filters.month.toString();
  };

  const getYearDisplayValue = (): string => {
    if (filters.year === undefined || filters.year === null) return 'all';
    return filters.year.toString();
  };

  const activeFilterCount = [
    filters.month !== undefined && filters.month !== null,
    filters.year !== undefined && filters.year !== null,
    filters.status !== undefined,
    filters.teacherName && filters.teacherName !== ''
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onFilterChange({
      month: undefined,
      year: undefined,
      status: undefined,
      teacherName: ''
    });
  };

  const getActiveFilterLabels = () => {
    const labels = [];
    if (filters.month !== undefined && filters.month !== null) {
      const month = monthOptions.find(m => m.value === filters.month);
      if (month && month.value !== 'all') labels.push(month.label);
    }
    if (filters.year !== undefined && filters.year !== null) {
      labels.push(`Năm ${filters.year}`);
    }
    if (filters.status) {
      const status = statusOptions.find(s => s.value === filters.status);
      if (status && status.value !== '') labels.push(status.label);
    }
    if (filters.teacherName) {
      labels.push(`GV: ${filters.teacherName}`);
    }
    return labels;
  };

  const handleMonthChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({ month: undefined });
    } else {
      onFilterChange({ month: parseInt(value) });
    }
  };

  const handleYearChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({ year: undefined });
    } else {
      onFilterChange({ year: parseInt(value) });
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="relative">
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl glass-panel w-fit">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id as any)}
            />
          ))}
        </div>

        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-secondary mt-1.5 ml-2"
        >
          {tabs.find(t => t.id === activeTab)?.description}
        </motion.p>
      </div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl premium-card overflow-hidden"
      >
        {/* Filter Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-outline-variant cursor-pointer hover:bg-surface-variant/30 transition-colors"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-fixed">
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-on-surface">Bộ lọc dữ liệu</h4>
              <p className="text-[11px] text-secondary hidden sm:block">Lọc theo tháng, năm, trạng thái và giáo viên</p>
            </div>
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary-fixed text-primary">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onPreviewMonthly && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewMonthly();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-gradient text-xs font-medium"
              >
                <Eye className="h-3.5 w-3.5" />
                Xem trước tháng
              </motion.button>
            )}

            {activeFilterCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="text-[11px] text-secondary hover:text-primary flex items-center gap-1 px-1.5 py-1 rounded-md hover:bg-primary-fixed/50 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="hidden sm:inline">Xóa</span>
              </motion.button>
            )}

            <motion.div
              animate={{ rotate: isFilterExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-secondary"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.div>
          </div>
        </div>

        {/* Filter Content */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Month Filter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-secondary flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-primary" />
                      Tháng
                    </label>
                    <div className="relative">
                      <select
                        value={getMonthDisplayValue()}
                        onChange={(e) => handleMonthChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/10 focus:outline-none appearance-none bg-white text-on-surface text-sm transition-all"
                      >
                        {monthOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-secondary flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-primary" />
                      Năm
                    </label>
                    <div className="relative">
                      <select
                        value={getYearDisplayValue()}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/10 focus:outline-none appearance-none bg-white text-on-surface text-sm transition-all"
                      >
                        {yearOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-secondary flex items-center gap-1.5">
                      <Tag className="h-3 w-3 text-primary" />
                      Trạng thái
                    </label>
                    <div className="relative">
                      <select
                        value={filters.status || ''}
                        onChange={(e) => onFilterChange({ status: e.target.value as any || undefined })}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/10 focus:outline-none appearance-none bg-white text-on-surface text-sm transition-all"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Teacher Filter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-secondary flex items-center gap-1.5">
                      <User className="h-3 w-3 text-primary" />
                      Giáo viên
                    </label>
                    <input
                      type="text"
                      value={filters.teacherName || ''}
                      onChange={(e) => onFilterChange({ teacherName: e.target.value })}
                      placeholder="Tìm theo tên..."
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/10 focus:outline-none bg-white text-on-surface text-sm placeholder:text-secondary/60 transition-all"
                    />
                  </div>
                </div>

                {/* Active filters display */}
                {activeFilterCount > 0 && getActiveFilterLabels().length > 0 && (
                  <div className="mt-3 pt-2 border-t border-outline-variant">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-secondary">Đang lọc:</span>
                      <AnimatePresence>
                        {getActiveFilterLabels().map((label, idx) => (
                          <ActiveFilterBadge
                            key={idx}
                            label={label}
                            onRemove={() => {
                              if (label.includes('Tháng')) onFilterChange({ month: undefined });
                              else if (label.includes('Năm')) onFilterChange({ year: undefined });
                              else if (statusOptions.find(s => s.label === label)) onFilterChange({ status: undefined });
                              else if (label.includes('GV:')) onFilterChange({ teacherName: '' });
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

      {/* Mobile Preview Button */}
      {onPreviewMonthly && !isFilterExpanded && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPreviewMonthly}
          className="sm:hidden w-full py-2.5 rounded-lg gradient-btn text-white text-xs font-medium flex items-center justify-center gap-2"
        >
          <Eye className="h-3.5 w-3.5" />
          Xem trước lương tháng
        </motion.button>
      )}
    </div>
  );
};

export default PayrollToolbar;