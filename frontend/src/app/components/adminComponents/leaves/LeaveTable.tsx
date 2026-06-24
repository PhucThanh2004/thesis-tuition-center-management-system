// src/app/components/adminComponents/leaves/LeaveTable.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeaveTableRow } from './LeaveTableRow';
import type { LeaveRequest } from '../../../utils/types/teacherLeave';
import { FileText, Inbox } from 'lucide-react';

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
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 }
};

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-dashed border-slate-300 shadow-sm"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-t-2xl" />
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-inner">
            <Inbox className="h-10 w-10 text-purple-300" />
          </div>
        </div>
        <p className="text-base font-semibold text-slate-700">Không có dữ liệu</p>
        <p className="text-sm text-slate-400 mt-1">Chưa có đơn nghỉ nào được gửi</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={tableVariants}
      initial="hidden"
      animate="visible"
      className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-slate-200/80"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 btn-gradient from-purple-400 via-purple-500 to-purple-600" />
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/50">
              <th className="w-10 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-200 focus:ring-offset-0 cursor-pointer transition-all"
                />
              </th>
              <th className="px-4 py-3.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Giáo viên</th>
              <th className="px-4 py-3.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Mã GV</th>
              <th className="px-4 py-3.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Loại nghỉ</th>
              <th className="px-4 py-3.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Ngày nghỉ</th>
              <th className="px-4 py-3.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Số ngày</th>
              <th className="px-4 py-3.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            <AnimatePresence mode="wait" initial={false}>
              {leaves.map((leave, index) => (
                <motion.tr
                  key={leave.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.03)' }}
                  className="group transition-all duration-200"
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
      
      {/* Footer với số lượng */}
      <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-400">
        <span>Hiển thị <span className="font-medium text-slate-600">{leaves.length}</span> đơn nghỉ</span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {leaves.filter(l => l.status === 'Đã duyệt').length} đã duyệt
        </span>
      </div>
    </motion.div>
  );
};