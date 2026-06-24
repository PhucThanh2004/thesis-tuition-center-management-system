// src/components/teacherComponents/TeacherPayrollTable.tsx
import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Eye, Calendar, BookOpen, DollarSign, Search } from 'lucide-react';
import type { TeacherPayrollSummary } from '../../../../utils/types/payroll';

interface TeacherPayrollTableProps {
  payrolls: TeacherPayrollSummary[];
  loading: boolean;
  searchTerm: string;
  onViewDetail: (paymentId: number) => void;
  teacherId: number | null;
}

// Animation variants
const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2, ease: 'easeOut' },
  }),
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { bgColor: string; textColor: string; label: string; dotColor: string }> = {
    'DRAFT': { 
      bgColor: 'bg-slate-50', 
      textColor: 'text-slate-600', 
      label: 'Nháp',
      dotColor: 'bg-slate-400'
    },
    'WAITING_TEACHER_CONFIRMATION': { 
      bgColor: 'bg-amber-50', 
      textColor: 'text-amber-600', 
      label: 'Chờ xác nhận',
      dotColor: 'bg-amber-400'
    },
    'TEACHER_CONFIRMED': { 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600', 
      label: 'Đã xác nhận',
      dotColor: 'bg-blue-400'
    },
     'REJECTED': { 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-600', 
      label: 'Từ chối',
      dotColor: 'bg-red-400'
    },
    'REQUEST_ADJUSTMENT': { 
      bgColor: 'bg-amber-50', 
      textColor: 'text-amber-700', 
      label: 'Y/C điều chỉnh',
      dotColor: 'bg-amber-500'
    },
    'FINALIZED': { 
      bgColor: 'bg-emerald-50', 
      textColor: 'text-emerald-600', 
      label: 'Đã chốt',
      dotColor: 'bg-emerald-400'
    },
    'PAID': { 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600', 
      label: 'Đã thanh toán',
      dotColor: 'bg-purple-400'
    },
  };
  
  const config = statusConfig[status] || statusConfig['DRAFT'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Loading skeleton
const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-50/50 border-b border-slate-100">
          <tr>
            {[1, 2, 3, 4, 5].map(i => (
              <th key={i} className="px-5 py-3">
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map(i => (
            <tr key={i} className="border-b border-slate-100">
              {[1, 2, 3, 4, 5].map(j => (
                <td key={j} className="px-5 py-4">
                  <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Empty state component
const EmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center"
  >
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 rounded-2xl btn-gradient from-slate-100 to-slate-50 flex items-center justify-center">
        <Search size={28} className="text-slate-300" />
      </div>
    </div>
    <h3 className="text-base font-semibold text-slate-700 mb-1">
      {searchTerm ? 'Không tìm thấy bảng lương' : 'Chưa có dữ liệu bảng lương'}
    </h3>
    <p className="text-xs text-slate-400 max-w-sm mx-auto">
      {searchTerm 
        ? 'Thử thay đổi từ khóa tìm kiếm hoặc chọn kỳ lương khác'
        : 'Bạn chưa có bảng lương nào trong kỳ này'}
    </p>
  </motion.div>
);

// No teacher ID state
const NoTeacherIdState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center"
  >
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 rounded-2xl btn-gradient from-red-50 to-red-50/30 flex items-center justify-center">
        <DollarSign size={28} className="text-red-300" />
      </div>
    </div>
    <h3 className="text-base font-semibold text-slate-700 mb-1">Không tìm thấy ID giáo viên</h3>
    <p className="text-xs text-slate-400">Vui lòng đăng nhập lại để tiếp tục</p>
  </motion.div>
);

const TeacherPayrollTable: React.FC<TeacherPayrollTableProps> = ({ 
  payrolls, 
  loading, 
  searchTerm, 
  onViewDetail,
  teacherId 
}) => {
  const totalAmount = payrolls.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return <TableSkeleton />;
  }

  if (!teacherId) {
    return <NoTeacherIdState />;
  }

  if (payrolls.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <div className="space-y-3">
      {/* Premium Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Kỳ lương
                  </div>
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={12} />
                    Số buổi
                  </div>
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={12} />
                    Tổng tiền
                  </div>
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {payrolls.map((payroll, idx) => (
                  <motion.tr
                    key={payroll.paymentId}
                    custom={idx}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.02)' }}
                    className="transition-colors duration-150"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">
                        {payroll.month}/{payroll.year}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-600">{payroll.totalSessions}</span>
                        <span className="text-xs text-slate-400">buổi</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(payroll.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(payroll.status)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onViewDetail(payroll.paymentId)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <Eye size={14} />
                        Xem chi tiết
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500">
            Hiển thị <span className="font-medium text-slate-700">{payrolls.length}</span> bảng lương
          </div>
          <div className="text-[11px] text-slate-500">
            Tổng: <span className="font-medium text-emerald-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPayrollTable;