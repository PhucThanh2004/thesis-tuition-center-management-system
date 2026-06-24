// src/components/adminComponents/payroll/teacherpayroll/RejectPayrollModal.tsx
import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, AlertCircle, XCircle } from 'lucide-react';
import type { PayrollDetailResponse } from '../../../../utils/types/payroll';

interface RejectPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  reason: string;
  onReasonChange: (value: string) => void;
  payroll: PayrollDetailResponse | null;
}

const modalOverlayVariants = {
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
    transition: { duration: 0.25, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

export const RejectPayrollModal: React.FC<RejectPayrollModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  reason,
  onReasonChange,
  payroll,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Từ chối bảng lương</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {payroll ? `Tháng ${payroll.month}/${payroll.year}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Warning message */}
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-700">Bạn sắp từ chối bảng lương này</p>
                    <p className="text-[11px] text-amber-600 mt-0.5">
                      Hành động này sẽ chuyển bảng lương sang trạng thái "Từ chối". 
                      Bạn cần nhập lý do để quản trị viên xem xét.
                    </p>
                  </div>
                </div>

                {/* Payroll info */}
                {payroll && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Giáo viên</span>
                      <span className="font-medium text-slate-700">{payroll.teacherName}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-slate-500">Tổng lương</span>
                      <span className="font-semibold text-slate-700">{formatCurrency(payroll.amount)}đ</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-slate-500">Số buổi</span>
                      <span className="font-medium text-slate-700">{payroll.totalSessions} buổi</span>
                    </div>
                  </div>
                )}

                {/* Reason input */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">
                    Lý do từ chối <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                    placeholder="Vui lòng nhập lý do từ chối bảng lương..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 transition-all min-h-[80px] resize-y"
                    disabled={loading}
                    autoFocus
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {reason.trim().length === 0 ? '⚠️ Vui lòng nhập lý do' : `✅ ${reason.trim().length} ký tự`}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading || !reason.trim()}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium text-white btn-gradient from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      Xác nhận từ chối
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};