import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Clock, BookOpen, CheckCircle, CreditCard, User, CalendarDays, ChevronRight, XCircle } from 'lucide-react'; // ✅ THÊM XCircle
import type { PayrollDetailResponse } from '../../../../utils/types/payroll';

interface PayrollDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollDetailResponse | null;
  loading: boolean;
  onConfirm?: () => void;
  onReject?: () => void; // ✅ THÊM MỚI
}

export const PayrollDetailDrawer = ({ 
  isOpen, 
  onClose, 
  payroll, 
  loading, 
  onConfirm,
  onReject // ✅ THÊM MỚI
}: PayrollDetailDrawerProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; bgColor: string; label: string }> = {
      'DRAFT': { color: 'text-slate-500', bgColor: 'bg-slate-100', label: 'Nháp' },
      'WAITING_TEACHER_CONFIRMATION': { color: 'text-amber-600', bgColor: 'bg-amber-50', label: 'Chờ xác nhận' },
      'TEACHER_CONFIRMED': { color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Đã xác nhận' },
      'REJECTED': { color: 'text-red-600', bgColor: 'bg-red-50', label: 'Từ chối' }, // ✅ THÊM MỚI
      'REQUEST_ADJUSTMENT': { color: 'text-amber-700', bgColor: 'bg-amber-50', label: 'Y/C điều chỉnh' }, // ✅ THÊM MỚI
      'FINALIZED': { color: 'text-emerald-600', bgColor: 'bg-emerald-50', label: 'Đã chốt' },
      'PAID': { color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Đã thanh toán' },
    };
    const config = statusConfig[status] || statusConfig['DRAFT'];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const canConfirm = payroll?.status === 'WAITING_TEACHER_CONFIRMATION';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">Chi tiết bảng lương</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Xem thông tin chi tiết bảng lương của bạn</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-500 mx-auto" />
                    <p className="mt-3 text-xs text-slate-400">Đang tải chi tiết...</p>
                  </div>
                </div>
              ) : payroll ? (
                <div className="space-y-5">
                  {/* Thông tin tổng quan */}
                  <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
                        <CreditCard size={14} className="text-purple-500" />
                      </div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Thông tin tổng quan</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <User size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Giáo viên</p>
                          <p className="text-sm font-medium text-slate-700">{payroll.teacherName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CalendarDays size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Kỳ lương</p>
                          <p className="text-sm font-medium text-slate-700">Tháng {payroll.month}/{payroll.year}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <BookOpen size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Tổng số buổi</p>
                          <p className="text-sm font-medium text-slate-700">{payroll.totalSessions} buổi</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Trạng thái</p>
                          {getStatusBadge(payroll.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Tổng thu nhập</p>
                          <p className="text-xl font-semibold text-emerald-600">{formatCurrency(payroll.amount)}</p>
                        </div>
                        {payroll.paymentDate && (
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Ngày tạo</p>
                            <p className="text-xs text-slate-500">{formatDate(payroll.paymentDate)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chi tiết các buổi dạy */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                        <Calendar size={14} className="text-blue-500" />
                      </div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Chi tiết các buổi dạy</h3>
                      <span className="text-[11px] text-slate-400">({payroll.details.length})</span>
                    </div>
                    
                    <div className="space-y-2">
                      {payroll.details.map((session, index) => (
                        <motion.div
                          key={session.sessionTeacherId}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="group bg-white border border-slate-100 rounded-xl p-3 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-1.5 mb-1">
                                <h4 className="font-medium text-sm text-slate-800">{session.subjectName}</h4>
                                {session.replacement && (
                                  <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">
                                    Dạy thay
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Calendar size={11} />
                                  <span>{formatDate(session.sessionDate)}</span>
                                </div>
                                {session.startTime && session.endTime && (
                                  <div className="flex items-center gap-1">
                                    <Clock size={11} />
                                    <span>{session.startTime} - {session.endTime}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-semibold text-emerald-600">{formatCurrency(session.amount)}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {session.salaryType === 'PER_HOUR' ? 'Theo giờ' : 'Theo buổi'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 pt-2 border-t border-slate-50 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400">Hình thức:</span>
                              <span className="text-slate-600">
                                {session.salaryType === 'PER_HOUR' ? '💰 Tính theo giờ' : '📚 Tính theo buổi'}
                              </span>
                            </div>
                            {session.salaryType === 'PER_HOUR' && session.workedHours && (
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-slate-400" />
                                <span className="text-slate-400">Số giờ:</span>
                                <span className="text-slate-600">{session.workedHours} giờ</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <DollarSign size={12} className="text-slate-400" />
                              <span className="text-slate-400">Đơn giá:</span>
                              <span className="text-slate-600">{formatCurrency(session.salaryRate)}</span>
                              {session.salaryType === 'PER_HOUR' && <span className="text-slate-400">/giờ</span>}
                            </div>
                          </div>
                          
                          {session.note && (
                            <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-500">
                                <span className="font-medium text-slate-400">Ghi chú:</span> {session.note}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ✅ CẬP NHẬT: Action Buttons - Thêm nút Từ chối */}
                  {canConfirm && onConfirm && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="sticky bottom-0 bg-white border-t border-slate-100 pt-4 mt-2 -mx-5 px-5 pb-2"
                    >
                      <div className="flex gap-3">
                        <button
                          onClick={onClose}
                          className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                        >
                          Đóng
                        </button>
                        {/* ✅ Nút Từ chối */}
                        {onReject && (
                          <button
                            onClick={onReject}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm"
                          >
                            <XCircle size={16} />
                            Từ chối
                          </button>
                        )}
                        <button
                          onClick={onConfirm}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-sm"
                        >
                          <CheckCircle size={16} />
                          Xác nhận
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                    <CreditCard size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500">Không thể tải chi tiết bảng lương</p>
                  <p className="text-xs text-slate-400 mt-1">Vui lòng thử lại sau</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};