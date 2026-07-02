import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  DollarSign,
  CheckCircle,
  AlertCircle,
  BookOpen,
  CreditCard,
  Loader2,
  CheckSquare,
  Square,
  Info,
  XCircle
} from 'lucide-react';
import { payrollApi } from '../../../utils/api/payroll.api';
import type { PayrollDetailResponse, PayrollSessionDetail } from '../../../utils/types/payroll';
import { useOutletContext } from 'react-router-dom';

interface PaymentModalProps {
  visible: boolean;
  payroll: PayrollDetailResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface ValidationError {
  message: string;
  type: 'error' | 'warning' | 'info';
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const ErrorMessage: React.FC<{ error: ValidationError | null; onClose: () => void }> = ({ error, onClose }) => {
  if (!error) return null;

  const config = {
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />,
    },
  };

  const style = config[error.type] || config.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-3 rounded-lg border ${style.bg} flex items-start gap-2.5`}
    >
      {style.icon}
      <p className={`text-xs flex-1 ${style.text}`}>{error.message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, payroll, onClose, onSuccess }) => {
  const { setAlert } = useOutletContext<any>();
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [selectedDetails, setSelectedDetails] = useState<Set<number>>(new Set());
  const [paymentMode, setPaymentMode] = useState<'full' | 'partial' | 'by_detail'>('full');
  const [error, setError] = useState<ValidationError | null>(null);

  const getDetailId = (detail: PayrollSessionDetail): number => {
    return detail.id || detail.sessionTeacherId;
  };

  useEffect(() => {
    if (visible && payroll) {
      const paidAmount = payroll.paidAmount || 0;
      const remaining = payroll.amount - paidAmount;
      setPaymentAmount(remaining > 0 ? remaining.toString() : '0');
      setPaymentNote('');
      setSelectedDetails(new Set());
      setPaymentMode('full');
      setError(null);
    }
  }, [visible, payroll]);

  if (!payroll) return null;

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === undefined || amount === null) {
      return '0đ';
    }
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const paidAmount = payroll.paidAmount || 0;
  const remainingAmount = payroll.amount - paidAmount;

  const totalSelectedAmount = payroll.details
    .filter(d => {
      const detailId = getDetailId(d);
      return selectedDetails.has(detailId);
    })
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  // Kiểm tra lỗi realtime
  const validateInput = (value: string): ValidationError | null => {
    const amount = parseInt(value.replace(/\D/g, ''));

    if (paymentMode === 'by_detail') {
      if (selectedDetails.size === 0) {
        return { message: 'Vui lòng chọn ít nhất một môn học để thanh toán', type: 'warning' };
      }
      if (amount > totalSelectedAmount) {
        return {
          message: `Số tiền không được vượt quá tổng tiền các môn đã chọn (${formatCurrency(totalSelectedAmount)})`,
          type: 'error'
        };
      }
    }

    if (paymentMode === 'partial') {
      if (amount > remainingAmount) {
        return {
          message: `Số tiền không được vượt quá số dư còn lại (${formatCurrency(remainingAmount)})`,
          type: 'error'
        };
      }
      if (amount === 0 && value !== '') {
        return { message: 'Số tiền thanh toán phải lớn hơn 0', type: 'warning' };
      }
    }

    return null;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxAmount = paymentMode === 'by_detail' ? totalSelectedAmount : remainingAmount;
    const numValue = parseInt(value) || 0;

    // Kiểm tra giới hạn
    if (value !== '' && numValue > maxAmount) {
      setError({
        message: `Số tiền không được vượt quá ${formatCurrency(maxAmount)}`,
        type: 'error'
      });
      setPaymentAmount(value);
      return;
    }

    setError(null);
    setPaymentAmount(value);
  };

  const handleToggleDetail = (detailId: number) => {
    const newSelected = new Set(selectedDetails);
    if (newSelected.has(detailId)) {
      newSelected.delete(detailId);
    } else {
      newSelected.add(detailId);
    }
    setSelectedDetails(newSelected);
    setError(null);
  };

  const handleSelectAll = () => {
    const allIds = payroll.details.map(d => getDetailId(d));
    if (selectedDetails.size === allIds.length) {
      setSelectedDetails(new Set());
    } else {
      setSelectedDetails(new Set(allIds));
    }
    setError(null);
  };

  const handlePaymentModeChange = (mode: 'full' | 'partial' | 'by_detail') => {
    setPaymentMode(mode);
    setError(null);
    if (mode === 'full') {
      setPaymentAmount(remainingAmount > 0 ? remainingAmount.toString() : '0');
      setSelectedDetails(new Set());
    } else if (mode === 'partial') {
      setPaymentAmount('');
      setSelectedDetails(new Set());
    } else {
      setPaymentAmount('');
      const allIds = payroll.details.map(d => getDetailId(d));
      setSelectedDetails(new Set(allIds));
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

      let amount = 0;
      if (paymentAmount && paymentAmount.trim() !== '') {
        amount = parseInt(paymentAmount.replace(/\D/g, ''));
      }

      // Validate theo từng mode
      if (paymentMode === 'by_detail') {
        if (selectedDetails.size === 0) {
          setError({ message: 'Vui lòng chọn ít nhất một môn học để thanh toán', type: 'warning' });
          setLoading(false);
          return;
        }

        if (amount === 0) {
          amount = totalSelectedAmount;
        } else if (amount > totalSelectedAmount) {
          setError({
            message: `Số tiền thanh toán không được vượt quá tổng tiền của các môn đã chọn (${formatCurrency(totalSelectedAmount)})`,
            type: 'error'
          });
          setLoading(false);
          return;
        }
      } else if (paymentMode === 'partial') {
        if (amount === 0) {
          setError({ message: 'Vui lòng nhập số tiền thanh toán', type: 'warning' });
          setLoading(false);
          return;
        }
        if (amount > remainingAmount) {
          setError({
            message: `Số tiền thanh toán không được vượt quá số dư còn lại (${formatCurrency(remainingAmount)})`,
            type: 'error'
          });
          setLoading(false);
          return;
        }
      } else if (paymentMode === 'full') {
        amount = remainingAmount;
      }

      if (amount <= 0) {
        setError({ message: 'Số tiền thanh toán phải lớn hơn 0', type: 'warning' });
        setLoading(false);
        return;
      }

      // Xây dựng request
      const request: any = {
        paymentId: payroll.paymentId,
        paidAmount: amount,
        paymentNote: paymentNote || undefined,
      };

      if (paymentMode === 'by_detail' && selectedDetails.size > 0) {
        request.detailIds = Array.from(selectedDetails);
      }

      if (paymentMode === 'full') {
        request.payAllDetails = true;
      }
      const response = await payrollApi.processPayment(request);
      setAlert?.({
        type: 'success',
        message: `Xác nhận thanh toán thành công! Đã thanh toán ${formatCurrency(amount)}`
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Không thể xác nhận thanh toán. Vui lòng thử lại!';

      setAlert?.({
        type: 'error',
        message: ` ${errorMessage}`
      });

      setError({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Xác nhận thanh toán
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-slate-500">{payroll.teacherName}</span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-xs text-slate-400">
                      Tháng {payroll.month}/{payroll.year}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-5">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500">Tổng lương</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(payroll.amount)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-emerald-600">Đã thanh toán</p>
                    <p className="text-lg font-bold text-emerald-700">{formatCurrency(paidAmount)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <p className="text-xs text-amber-600">Còn lại</p>
                    <p className="text-lg font-bold text-amber-700">{formatCurrency(remainingAmount)}</p>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <ErrorMessage error={error} onClose={() => setError(null)} />
                  )}
                </AnimatePresence>

                {/* Payment Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hình thức thanh toán
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handlePaymentModeChange('full')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${paymentMode === 'full'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50/50'
                        }`}
                    >
                      <CheckCircle className="h-4 w-4 mx-auto mb-1" />
                      Toàn bộ
                    </button>
                    <button
                      onClick={() => handlePaymentModeChange('partial')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${paymentMode === 'partial'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-slate-200 hover:border-amber-200 hover:bg-amber-50/50'
                        }`}
                    >
                      <DollarSign className="h-4 w-4 mx-auto mb-1" />
                      Từng phần
                    </button>
                    <button
                      onClick={() => handlePaymentModeChange('by_detail')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${paymentMode === 'by_detail'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                    >
                      <BookOpen className="h-4 w-4 mx-auto mb-1" />
                      Theo môn
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                {(paymentMode === 'partial' || paymentMode === 'by_detail') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Số tiền thanh toán
                      {paymentMode === 'by_detail' && selectedDetails.size > 0 && (
                        <span className="text-xs text-slate-500 ml-2">
                          (Tối đa: {formatCurrency(totalSelectedAmount)})
                        </span>
                      )}
                      {paymentMode === 'partial' && (
                        <span className="text-xs text-slate-500 ml-2">
                          (Tối đa: {formatCurrency(remainingAmount)})
                        </span>
                      )}
                    </label>
                    <div className={`relative ${error?.type === 'error' ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                      <input
                        type="text"
                        value={paymentAmount ? new Intl.NumberFormat('vi-VN').format(parseInt(paymentAmount.replace(/\D/g, '')) || 0) : ''}
                        onChange={handleAmountChange}
                        onFocus={() => {
                          if (paymentAmount) {
                            const err = validateInput(paymentAmount);
                            if (err) setError(err);
                          }
                        }}
                        placeholder="Nhập số tiền..."
                        className={`w-full px-4 py-3 pr-16 rounded-xl border ${error?.type === 'error'
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-slate-200 focus:border-purple-500'
                          } focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all`}
                        autoFocus={paymentMode === 'partial'}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">VNĐ</span>
                    </div>
                    {paymentMode === 'by_detail' && selectedDetails.size === 0 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Vui lòng chọn ít nhất một môn học để thanh toán
                      </p>
                    )}
                    <div className="flex justify-end mt-2">
                      {paymentMode === 'partial' && remainingAmount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentAmount(remainingAmount.toString());
                            setError(null);
                          }}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Thanh toán toàn bộ còn lại
                        </button>
                      )}
                      {paymentMode === 'by_detail' && totalSelectedAmount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentAmount(totalSelectedAmount.toString());
                            setError(null);
                          }}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Thanh toán các môn đã chọn
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Detail Selection */}
                {paymentMode === 'by_detail' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Chọn môn học cần thanh toán
                      </label>
                      <button
                        onClick={handleSelectAll}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {selectedDetails.size === payroll.details.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {payroll.details.map((detail) => {
                        const detailId = getDetailId(detail);
                        const isSelected = selectedDetails.has(detailId);

                        return (
                          <div
                            key={detailId}
                            onClick={() => handleToggleDetail(detailId)}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${isSelected
                                ? 'border-purple-300 bg-purple-50/50 hover:bg-purple-50'
                                : 'border-slate-100 hover:bg-slate-50'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              {isSelected ? (
                                <CheckSquare className="h-5 w-5 text-purple-600" />
                              ) : (
                                <Square className="h-5 w-5 text-slate-300" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-slate-700">{detail.subjectName}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>{detail.workedHours} giờ</span>
                                  <span>•</span>
                                  <span>{detail.salaryType === 'PER_HOUR' ? 'Theo giờ' : 'Theo buổi'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-purple-600">{formatCurrency(detail.amount)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selectedDetails.size > 0 && (
                      <div className="mt-2 text-xs text-slate-500">
                        Đã chọn {selectedDetails.size}/{payroll.details.length} môn - Tổng: {formatCurrency(totalSelectedAmount)}
                      </div>
                    )}
                  </div>
                )}

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ghi chú thanh toán
                    <span className="text-xs text-slate-400 ml-1">(không bắt buộc)</span>
                  </label>
                  <textarea
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Nhập ghi chú thanh toán..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
                    rows={2}
                  />
                </div>

                {/* Thông tin tổng kết */}
                {(paymentMode === 'partial' || paymentMode === 'by_detail') && (
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Số tiền sẽ thanh toán:</span>
                      <span className="font-semibold text-purple-600">
                        {paymentAmount ? formatCurrency(parseInt(paymentAmount.replace(/\D/g, '')) || 0) : '0đ'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Xác nhận sẽ cập nhật trạng thái thanh toán</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !!error}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2 ${loading || error
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'btn-gradient'
                      }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Xác nhận thanh toán
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;