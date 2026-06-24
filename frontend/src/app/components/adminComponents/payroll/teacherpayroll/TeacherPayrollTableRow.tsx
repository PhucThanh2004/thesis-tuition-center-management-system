import { motion } from 'framer-motion';
import { Eye, CheckCircle, Clock, AlertCircle, Calendar, BookOpen, DollarSign, XCircle } from 'lucide-react'; // ✅ THÊM XCircle
import type { TeacherPayrollSummary } from '../../../../utils/types/payroll';

interface TeacherPayrollTableRowProps {
  payroll: TeacherPayrollSummary;
  onViewDetail: (paymentId: number) => void;
  onConfirm: (paymentId: number) => void;
  onReject: (paymentId: number) => void; // ✅ THÊM MỚI
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  hover: { y: -1, transition: { duration: 0.15 } },
};

export const TeacherPayrollTableRow = ({ 
  payroll, 
  onViewDetail, 
  onConfirm, 
  onReject // ✅ THÊM MỚI
}: TeacherPayrollTableRowProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = () => {
    const statusConfig: Record<string, { bgColor: string; textColor: string; label: string; icon: any; dotColor: string }> = {
      'DRAFT': { 
        bgColor: 'bg-slate-50', 
        textColor: 'text-slate-600', 
        label: 'Nháp', 
        icon: AlertCircle,
        dotColor: 'bg-slate-400'
      },
      'WAITING_TEACHER_CONFIRMATION': { 
        bgColor: 'bg-amber-50', 
        textColor: 'text-amber-600', 
        label: 'Chờ xác nhận', 
        icon: Clock,
        dotColor: 'bg-amber-400'
      },
      'TEACHER_CONFIRMED': { 
        bgColor: 'bg-blue-50', 
        textColor: 'text-blue-600', 
        label: 'Đã xác nhận', 
        icon: CheckCircle,
        dotColor: 'bg-blue-400'
      },
      'REJECTED': { // ✅ THÊM MỚI
        bgColor: 'bg-red-50', 
        textColor: 'text-red-600', 
        label: 'Từ chối', 
        icon: XCircle,
        dotColor: 'bg-red-400'
      },
      'REQUEST_ADJUSTMENT': { // ✅ THÊM MỚI
        bgColor: 'bg-amber-50', 
        textColor: 'text-amber-700', 
        label: 'Y/C điều chỉnh', 
        icon: Clock,
        dotColor: 'bg-amber-500'
      },
      'FINALIZED': { 
        bgColor: 'bg-emerald-50', 
        textColor: 'text-emerald-600', 
        label: 'Đã chốt', 
        icon: CheckCircle,
        dotColor: 'bg-emerald-400'
      },
      'PAID': { 
        bgColor: 'bg-purple-50', 
        textColor: 'text-purple-600', 
        label: 'Đã thanh toán', 
        icon: CheckCircle,
        dotColor: 'bg-purple-400'
      },
    };
    
    const config = statusConfig[payroll.status] || statusConfig['DRAFT'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
        <Icon size={10} />
        {config.label}
      </span>
    );
  };

  const canConfirm = payroll.status === 'WAITING_TEACHER_CONFIRMATION';

  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Period */}
        <div className="min-w-[100px]">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={11} className="text-slate-400" />
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Kỳ lương</p>
          </div>
          <p className="text-sm font-medium text-slate-700">
            {payroll.month}/{payroll.year}
          </p>
        </div>

        {/* Sessions */}
        <div className="min-w-[80px]">
          <div className="flex items-center gap-1.5 mb-1">
            <BookOpen size={11} className="text-slate-400" />
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Số buổi</p>
          </div>
          <p className="text-sm font-medium text-slate-700">
            {payroll.totalSessions} <span className="text-xs text-slate-400">buổi</span>
          </p>
        </div>

        {/* Amount */}
        <div className="min-w-[130px]">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign size={11} className="text-slate-400" />
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Tổng tiền</p>
          </div>
          <p className="text-sm font-semibold text-emerald-600">
            {formatCurrency(payroll.amount)}
          </p>
        </div>

        {/* Status */}
        <div className="min-w-[110px]">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">Trạng thái</p>
          {getStatusBadge()}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewDetail(payroll.paymentId)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </motion.button>
          
          {canConfirm && (
            <>
              {/* ✅ Nút Xác nhận */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onConfirm(payroll.paymentId)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 shadow-sm flex items-center gap-1"
              >
                <CheckCircle size={12} />
                Xác nhận
              </motion.button>
              
              {/* ✅ THÊM MỚI: Nút Từ chối */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onReject(payroll.paymentId)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-sm flex items-center gap-1"
                title="Từ chối bảng lương"
              >
                <XCircle size={12} />
                Từ chối
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};