// src/components/adminComponents/leaves/teacher/TeacherLeaveToolbar.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TeacherLeaveToolbarProps {
  onSearch: (keyword: string) => void;
  onStatusChange: (status: string) => void;
  searchValue: string;
  statusValue: string;
}

export const TeacherLeaveToolbar = ({ 
  onSearch, 
  onStatusChange, 
  searchValue, 
  statusValue 
}: TeacherLeaveToolbarProps) => {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchSubmit = () => {
    onSearch(localSearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    onSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    >
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <motion.div 
          className="flex-1 relative"
          animate={{ scale: isFocused ? 1.01 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 text-sm transition-all"
            placeholder="Tìm kiếm theo lý do hoặc mã đơn..."
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <AnimatePresence>
            {localSearch && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer min-w-[140px]"
              value={statusValue}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">Trạng thái (Tất cả)</option>
              <option value="PENDING">⏳ Chờ duyệt</option>
              <option value="APPROVED">✅ Đã duyệt</option>
              <option value="REJECTED">❌ Từ chối</option>
              <option value="CANCELLED">📪 Đã hủy</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            onClick={handleSearchSubmit}
          >
            <Filter size={16} />
            Lọc
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};