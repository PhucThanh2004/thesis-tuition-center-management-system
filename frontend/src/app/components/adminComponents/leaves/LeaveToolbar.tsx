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
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// Helper function to format date
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
  onApply: (range: { start: DateValue | null; end: DateValue | null }) => void;
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
      days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
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
            w-9 h-9 rounded-full text-xs font-medium transition-all
            ${isSelected ? 'bg-purple-600 text-white' : 'hover:bg-purple-50 text-slate-700'}
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

  const handleApply = () => {
    if (tempRange.start && tempRange.end) {
      onApply(tempRange);
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden border border-slate-200">
      <div className="flex">
        {/* Presets sidebar */}
        <div className="w-36 border-r border-slate-100 p-3 space-y-1">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide px-3 py-1">Nhanh</p>
          {Object.entries(presets).map(([label, preset]) => (
            <button
              key={label}
              onClick={() => handlePresetClick(preset)}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={16} className="text-slate-400" />
            </button>
            <span className="text-sm font-medium text-slate-700">
              {monthNames[currentMonth.month - 1]} {currentMonth.year}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1.5">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
              <div key={day} className="w-9 h-9 flex items-center justify-center text-[10px] font-medium text-slate-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-slate-400">Từ:</span>
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
                  className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Chọn ngày"
                />
              </div>
              <span className="text-slate-300">—</span>
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-slate-400">Đến:</span>
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
                  className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Chọn ngày"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setTempRange({ start: null, end: null });
                onChange({ start: null, end: null });
                onClose();
              }}
              className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Xóa
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1.5 text-xs font-medium text-white btn-gradient from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
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

  const dateToCalendarDate = useCallback((date: Date): DateValue => {
    return toCalendarDateTime(today(getLocalTimeZone())).set({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    });
  }, []);

  const [tempRange, setTempRange] = useState<{ start: DateValue | null; end: DateValue | null }>(() => {
    if (dateRange?.from) {
      try {
        const fromDate = new Date(dateRange.from);
        if (isNaN(fromDate.getTime())) {
          return { start: null, end: null };
        }
        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        return {
          start: dateToCalendarDate(fromDate),
          end: toDate && !isNaN(toDate.getTime()) ? dateToCalendarDate(toDate) : null,
        };
      } catch (error) {
        return { start: null, end: null };
      }
    }
    return { start: null, end: null };
  });

  useEffect(() => {
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
    if (!onDateRangeChange) {
      setShowDatePicker(false);
      return;
    }
    
    if (appliedRange.start) {
      const from = `${appliedRange.start.year}-${String(appliedRange.start.month).padStart(2, '0')}-${String(appliedRange.start.day).padStart(2, '0')}`;
      
      if (appliedRange.end) {
        const to = `${appliedRange.end.year}-${String(appliedRange.end.month).padStart(2, '0')}-${String(appliedRange.end.day).padStart(2, '0')}`;
        onDateRangeChange({ from, to });
      } else {
        onDateRangeChange({ from, to: '' });
      }
    }
    setShowDatePicker(false);
  };

  const handleClearDateRange = () => {
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
        className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3"
      >
        {/* Search input */}
        <div className="flex-1 min-w-[220px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all text-slate-700 text-sm placeholder:text-slate-400"
            placeholder="Tìm kiếm giáo viên..."
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.select
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-purple-500 focus:border-purple-500 cursor-pointer text-slate-600"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </motion.select>

          <motion.select
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            value={selectedLeaveType}
            onChange={(e) => onLeaveTypeChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-purple-500 focus:border-purple-500 cursor-pointer text-slate-600"
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
            className={`bg-slate-50 border rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              hasActiveDateRange
                ? 'border-purple-300 bg-purple-50 text-purple-600'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden md:inline">{getDisplayText()}</span>
            <span className="md:hidden">Ngày</span>
          </motion.button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-auto">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onClearFilters}
            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Xóa bộ lọc"
          >
            <FilterX className="w-4 h-4" />
          </motion.button>

          
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setShowDatePicker(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
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