// src/components/teacherComponents/payroll/ConfirmPayrollModal.tsx
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { AlertTriangle, CheckCircle, X, DollarSign, Calendar, BookOpen, Shield, Clock } from 'lucide-react';
import type { PayrollDetailResponse } from '../../../../utils/types/payroll';

interface ConfirmPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  payroll: PayrollDetailResponse | null;
}

// Animation variants
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.4, bounce: 0.25, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', duration: 0.5, bounce: 0.4, delay: 0.1 },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.3 },
  },
};

const infoRowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.25 + i * 0.05, duration: 0.2 },
  }),
};

export const ConfirmPayrollModal = ({ isOpen, onClose, onConfirm, loading, payroll }: ConfirmPayrollModalProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Premium Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium Gradient Border Top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 from-amber-400 via-amber-500 to-amber-600" />

              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
                    <Shield className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Xác nhận bảng lương</h3>
                    <p className="text-xs text-slate-400">Vui lòng kiểm tra kỹ thông tin</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                {/* Animated Warning Icon */}
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center mb-5"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient from-amber-100 to-amber-50 rounded-full flex items-center justify-center shadow-md">
                      <AlertTriangle size={32} className="text-amber-600" />
                    </div>
                  </div>
                </motion.div>

                {/* Payroll Information Card */}
                {payroll && (
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-5 rounded-xl bg-gradient from-slate-50 to-white border border-slate-200 shadow-sm overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100">
                          <Calendar className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Thông tin bảng lương
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <motion.div
                        custom={0}
                        variants={infoRowVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-slate-500 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Kỳ lương
                        </span>
                        <span className="font-semibold text-slate-700">
                          Tháng {payroll.month}/{payroll.year}
                        </span>
                      </motion.div>

                      <motion.div
                        custom={1}
                        variants={infoRowVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-slate-500 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          Số buổi
                        </span>
                        <span className="font-semibold text-slate-700">{payroll.totalSessions} buổi</span>
                      </motion.div>

                      <motion.div
                        custom={2}
                        variants={infoRowVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between items-center pt-3 mt-1 border-t border-slate-100"
                      >
                        <span className="text-sm text-slate-600 flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          Tổng tiền
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-bold bg-gradient from-emerald-600 to-emerald-500 bg-clip-text gradient-text">
                            {formatCurrency(payroll.amount)}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Confirmation Message */}
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center mb-6"
                >
                  <p className="text-slate-800 font-semibold text-base mb-1">
                    Xác nhận bảng lương này là chính xác?
                  </p>
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Sau khi xác nhận, bạn sẽ không thể chỉnh sửa</span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex gap-3"
                >
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium btn-gradient from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span>Xác nhận</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </div>

              {/* Decorative Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1  from-transparent via-slate-100 to-transparent" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};