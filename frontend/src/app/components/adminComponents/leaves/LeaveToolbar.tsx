// src/app/components/adminComponents/leaves/LeaveToolbar.tsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, FilterX, Table, CalendarDays, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getLocalTimeZone,
  today,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  toCalendarDateTime,
  CalendarDate,
  getWeeksInMonth
} from '@internationalized/date';
import { useLocale, type DateValue } from 'react-aria-components';

interface LeaveToolbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedLeaveType: string;
  onLeaveTypeChange: (type: string) => void;
  onClearFilters: () => void;
  onViewModeChange?: (mode: 'list' | 'calendar') => void;
  currentViewMode?: 'list' | 'calendar';
  statusOptions: string[];
  leaveTypeOptions: string[];
  dateRange?: { from: string; to: string };
  onDateRangeChange?: (range: { from: string; to: string }) => void;
}

const toolbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// Helper function to format date for display
const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Range Calendar Component
interface RangeCalendarProps {
  value: { start: DateValue | null; end: DateValue | null };
  onChange: (range: { start: DateValue | null; end: DateValue | null }) => void;
  onClose: () => void;
  onApply: (range: { start: DateValue | null; end: DateValue | null }) => void;  // ← Thêm tham số
}
const RangeCalendarComponent: React.FC<RangeCalendarProps> = ({ value, onChange, onClose, onApply }) => {
  const { locale } = useLocale();
  const now = useMemo(() => toCalendarDateTime(today(getLocalTimeZone())), []);
  const [currentMonth, setCurrentMonth] = useState(() => value?.start || now);
  const [hoveredDate, setHoveredDate] = useState<DateValue | null>(null);
  const [tempRange, setTempRange] = useState(value);

  const presets = useMemo(() => ({
    'Hôm nay': { start: now, end: now },
    'Hôm qua': { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) },
    'Tuần này': { start: startOfWeek(now, locale), end: endOfWeek(now, locale) },
    'Tuần trước': {
      start: startOfWeek(now, locale).subtract({ weeks: 1 }),
      end: endOfWeek(now, locale).subtract({ weeks: 1 }),
    },
    'Tháng này': { start: startOfMonth(now), end: endOfMonth(now) },
    'Tháng trước': {
      start: startOfMonth(now).subtract({ months: 1 }),
      end: endOfMonth(now).subtract({ months: 1 }),
    },
  }), [locale, now]);

  const handlePresetClick = (preset: { start: DateValue; end: DateValue }) => {
    setTempRange({ start: preset.start, end: preset.end });
    setCurrentMonth(preset.start);
  };

  const handleDateClick = (date: DateValue) => {
    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      setTempRange({ start: date, end: null });
    } else if (tempRange.start && !tempRange.end) {
      if (date.compare(tempRange.start) < 0) {
        setTempRange({ start: date, end: tempRange.start });
      } else {
        setTempRange({ start: tempRange.start, end: date });
      }
    }
  };

  const isInRange = (date: DateValue) => {
    if (!tempRange.start || !tempRange.end) return false;
    return date.compare(tempRange.start) >= 0 && date.compare(tempRange.end) <= 0;
  };

  const isRangeStart = (date: DateValue) => {
    return tempRange.start && date.compare(tempRange.start) === 0;
  };

  const isRangeEnd = (date: DateValue) => {
    return tempRange.end && date.compare(tempRange.end) === 0;
  };

  const isHoveredInRange = (date: DateValue) => {
    if (!tempRange.start || !hoveredDate || tempRange.end) return false;
    return date.compare(tempRange.start) >= 0 && date.compare(hoveredDate) <= 0;
  };

  const getDaysInMonth = (date: DateValue) => {
    const year = date.year;
    const month = date.month;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    return { daysInMonth, startDayOfWeek };
  };

  const renderCalendar = () => {
    const { daysInMonth, startDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.set({ day: i });
      const isSelected = isInRange(date);
      const isStart = isRangeStart(date);
      const isEnd = isRangeEnd(date);
      const isHovered = isHoveredInRange(date);
      const isToday = date.compare(now) === 0;

      days.push(
        <button
          key={i}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => !tempRange.end && setHoveredDate(date)}
          className={`
            w-10 h-10 rounded-full text-sm font-medium transition-all
            ${isSelected ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 text-gray-700'}
            ${isStart ? 'rounded-l-full bg-purple-600 text-white' : ''}
            ${isEnd ? 'rounded-r-full bg-purple-600 text-white' : ''}
            ${isHovered && !isSelected ? 'bg-purple-100' : ''}
            ${isToday && !isSelected ? 'border border-purple-300' : ''}
          `}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(currentMonth.add({ months: delta }));
  };

  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  // Trong RangeCalendarComponent, sửa handleApply:
  const handleApply = () => {
    console.log('🔵 RangeCalendar handleApply - tempRange:', tempRange);
    if (tempRange.start && tempRange.end) {
      console.log('✅ Valid range, applying');
      // ✅ Truyền tempRange hiện tại vào onApply
      onApply(tempRange);  // ← Thêm tham số
      onClose();           // ← Đóng modal
    }
  };



  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
      <div className="flex">
        {/* Presets sidebar */}
        <div className="w-40 border-r border-gray-100 p-3 space-y-1">
          {Object.entries(presets).map(([label, preset]) => (
            <button
              key={label}
              onClick={() => handlePresetClick(preset)}
              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="flex-1 p-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={18} className="text-gray-500" />
            </button>
            <span className="font-semibold text-gray-800">
              {monthNames[currentMonth.month - 1]} {currentMonth.year}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
              <div key={day} className="w-10 h-10 flex items-center justify-center text-xs font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {/* Date range display */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-gray-500">Từ:</span>
                <input
                  type="date"
                  value={tempRange.start ? `${tempRange.start.year}-${String(tempRange.start.month).padStart(2, '0')}-${String(tempRange.start.day).padStart(2, '0')}` : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [year, month, day] = e.target.value.split('-');
                      const newDate = currentMonth.set({ year: Number(year), month: Number(month), day: Number(day) });
                      setTempRange({ ...tempRange, start: newDate });
                    } else {
                      setTempRange({ ...tempRange, start: null });
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Chọn ngày"
                />
              </div>
              <span className="text-gray-300">—</span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-gray-500">Đến:</span>
                <input
                  type="date"
                  value={tempRange.end ? `${tempRange.end.year}-${String(tempRange.end.month).padStart(2, '0')}-${String(tempRange.end.day).padStart(2, '0')}` : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [year, month, day] = e.target.value.split('-');
                      const newDate = currentMonth.set({ year: Number(year), month: Number(month), day: Number(day) });
                      setTempRange({ ...tempRange, end: newDate });
                    } else {
                      setTempRange({ ...tempRange, end: null });
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Chọn ngày"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                setTempRange({ start: null, end: null });
                onChange({ start: null, end: null });
                onClose();
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Xóa
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm btn-gradient from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LeaveToolbar: React.FC<LeaveToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedLeaveType,
  onLeaveTypeChange,
  onClearFilters,
  onViewModeChange,
  currentViewMode = 'list',
  statusOptions,
  leaveTypeOptions,
  dateRange,
  onDateRangeChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Helper function để chuyển đổi date an toàn
  const dateToCalendarDate = useCallback((date: Date): DateValue => {
    return toCalendarDateTime(today(getLocalTimeZone())).set({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    });
  }, []);
  // Khởi tạo tempRange từ dateRange
  const [tempRange, setTempRange] = useState<{ start: DateValue | null; end: DateValue | null }>(() => {
    if (dateRange?.from) {
      try {
        const fromDate = new Date(dateRange.from);
        if (isNaN(fromDate.getTime())) {
          console.error('Invalid from date:', dateRange.from);
          return { start: null, end: null };
        }

        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        if (toDate && isNaN(toDate.getTime())) {
          console.error('Invalid to date:', dateRange.to);
          return { start: dateToCalendarDate(fromDate), end: null };
        }

        return {
          start: dateToCalendarDate(fromDate),
          end: toDate ? dateToCalendarDate(toDate) : null,
        };
      } catch (error) {
        console.error('Error parsing date range:', error);
        return { start: null, end: null };
      }
    }
    return { start: null, end: null };
  });

  // Đồng bộ tempRange với dateRange khi dateRange thay đổi từ bên ngoài
  useEffect(() => {
    console.log('🔄 Syncing tempRange with dateRange:', dateRange);
    if (dateRange?.from) {
      try {
        const fromDate = new Date(dateRange.from);
        if (isNaN(fromDate.getTime())) {
          setTempRange({ start: null, end: null });
          return;
        }

        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        setTempRange({
          start: dateToCalendarDate(fromDate),
          end: toDate && !isNaN(toDate.getTime()) ? dateToCalendarDate(toDate) : null,
        });
      } catch (error) {
        setTempRange({ start: null, end: null });
      }
    } else {
      setTempRange({ start: null, end: null });
    }
  }, [dateRange, dateToCalendarDate]);

const handleApplyDateRange = (appliedRange: { start: DateValue | null; end: DateValue | null }) => {
  console.log('🔵 handleApplyDateRange called with:', appliedRange);
  
  if (!onDateRangeChange) {
    console.warn('onDateRangeChange is not provided');
    setShowDatePicker(false);
    return;
  }
  
  // ✅ Dùng appliedRange từ component con, không dùng tempRange từ state
  if (appliedRange.start) {
    const from = `${appliedRange.start.year}-${String(appliedRange.start.month).padStart(2, '0')}-${String(appliedRange.start.day).padStart(2, '0')}`;
    
    if (appliedRange.end) {
      const to = `${appliedRange.end.year}-${String(appliedRange.end.month).padStart(2, '0')}-${String(appliedRange.end.day).padStart(2, '0')}`;
      console.log('✅ Applying full date range:', { from, to });
      onDateRangeChange({ from, to });
    } else {
      console.log('✅ Applying only from date:', { from, to: '' });
      onDateRangeChange({ from, to: '' });
    }
  } else {
    console.log('⚠️ No date selected, keeping current filter');
  }
  
  setShowDatePicker(false);
};

  // Handle clear date range riêng
  const handleClearDateRange = () => {
    console.log('🔵 Clearing date range');
    setTempRange({ start: null, end: null });
    if (onDateRangeChange) {
      onDateRangeChange({ from: '', to: '' });
    }
    setShowDatePicker(false);
  };

  const hasActiveDateRange = dateRange?.from && dateRange.from !== '';
  const getDisplayText = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${formatDisplayDate(dateRange.from)} → ${formatDisplayDate(dateRange.to)}`;
    }
    if (dateRange?.from) {
      return `Từ ${formatDisplayDate(dateRange.from)}`;
    }
    return "Khoảng ngày";
  };

  return (
    <>
      <motion.div
        variants={toolbarVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4"
      >
        {/* Search input */}
        <motion.div
          className="flex-1 min-w-[300px] relative"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="Tìm kiếm giáo viên hoặc mã GV..."
          />
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer text-gray-700"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </motion.select>

          <motion.select
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            value={selectedLeaveType}
            onChange={(e) => onLeaveTypeChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer text-gray-700"
          >
            {leaveTypeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </motion.select>

          {/* Date Range Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowDatePicker(true)}
            className={`bg-gray-50 border rounded-2xl px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${hasActiveDateRange
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:bg-gray-100 text-gray-700'
              }`}
          >
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="hidden md:inline">{getDisplayText()}</span>
            <span className="md:hidden">Ngày</span>
          </motion.button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onClearFilters}
            className="p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
            title="Xóa bộ lọc"
          >
            <FilterX className="w-5 h-5" />
          </motion.button>

          {onViewModeChange && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex bg-gray-100 p-1 rounded-2xl"
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-xl transition-all flex items-center gap-1 ${currentViewMode === 'list'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-purple-600'
                  }`}
                title="Dạng bảng"
              >
                <Table className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Bảng</span>
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => onViewModeChange('calendar')}
                className={`p-2 rounded-xl transition-all flex items-center gap-1 ${currentViewMode === 'calendar'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-purple-600'
                  }`}
                title="Dạng lịch"
              >
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Lịch</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Date Range Picker Modal */}
      <AnimatePresence>
        {showDatePicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowDatePicker(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="pointer-events-auto"
              >
                <RangeCalendarComponent
                  value={tempRange}
                  onChange={setTempRange}
                  onClose={() => setShowDatePicker(false)}
                  onApply={handleApplyDateRange}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};