// src/app/components/adminComponents/leaves/LeaveTable.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeaveTableRow } from './LeaveTableRow';
import type { LeaveRequest } from '../../../utils/types/teacherLeave';

interface LeaveTableProps {
  leaves: LeaveRequest[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const LeaveTable: React.FC<LeaveTableProps> = ({
  leaves,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onApprove,
  onReject,
  onViewDetail,
}) => {
  const allSelected = leaves.length > 0 && selectedIds.length === leaves.length;

  if (leaves.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-gray-100"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="font-medium">Không có dữ liệu</p>
        <p className="text-sm text-gray-400 mt-1">Chưa có đơn nghỉ nào được gửi</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </th>
              <th className="px-4 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Giáo viên</th>
              <th className="px-4 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Mã GV</th>
              <th className="px-4 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Loại nghỉ</th>
              <th className="px-4 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Ngày nghỉ</th>
              <th className="px-4 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Số ngày</th>
              <th className="px-4 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence mode="wait" initial={false}>
              {leaves.map((leave, index) => (
                <motion.tr
                  key={leave.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  whileHover={{ backgroundColor: '#fafafa' }}
                >
                  <LeaveTableRow
                    leave={leave}
                    isSelected={selectedIds.includes(leave.id)}
                    onSelect={onSelectRow}
                    onApprove={onApprove}
                    onReject={onReject}
                    onViewDetail={onViewDetail}
                  />
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};