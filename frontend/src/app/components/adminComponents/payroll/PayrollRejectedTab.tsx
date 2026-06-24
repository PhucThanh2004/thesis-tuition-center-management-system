// src/components/payroll/PayrollRejectedTab.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  RotateCcw, 
  Eye, 
  FileText,
  RefreshCw,
  Calendar,
  User,
  DollarSign,
  Clock,
  XCircle
} from 'lucide-react';
import { payrollApi } from '../../../utils/api/payroll.api';
import type { 
  PayrollListItem, 
  TeacherPaymentStatus,
  TeacherPaymentResponse
} from '../../../utils/types/payroll';
import { useOutletContext } from 'react-router-dom';

interface PayrollRejectedTabProps {
  refreshTrigger?: number;
  onRegenerateSuccess?: () => void;
}

const PayrollRejectedTab: React.FC<PayrollRejectedTabProps> = ({ 
  refreshTrigger = 0, 
  onRegenerateSuccess 
}) => {
  const [rejectedPayrolls, setRejectedPayrolls] = useState<PayrollListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState<number | null>(null);
  const { setAlert } = useOutletContext<any>();

  const fetchRejectedPayrolls = async () => {
    try {
      setLoading(true);
      const allPayrolls = await payrollApi.getAllPayrolls();
      
      // Lọc các bảng lương có status REJECTED hoặc REQUEST_ADJUSTMENT
      const rejected = allPayrolls.filter(p => 
        p.status === 'REJECTED' || p.status === 'REQUEST_ADJUSTMENT'
      );
      
      // Sắp xếp theo thời gian mới nhất
      rejected.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
      
      setRejectedPayrolls(rejected);
    } catch (error) {
      console.error('Failed to fetch rejected payrolls:', error);
      setAlert?.({
        type: 'error',
        message: 'Không thể tải danh sách bảng lương bị từ chối'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedPayrolls();
  }, [refreshTrigger]);

  const handleRegenerate = async (payroll: PayrollListItem) => {
    try {
      setRegeneratingId(payroll.paymentId);
      
      const request = {
        teacherId: payroll.teacherId,
        month: payroll.month,
        year: payroll.year
      };
      
      const response: TeacherPaymentResponse = await payrollApi.regeneratePayroll(request);
      
      setAlert?.({
        type: 'success',
        message: `Đã tái tạo bảng lương cho ${payroll.teacherName} - Tháng ${payroll.month}/${payroll.year} (Phiên bản ${response.revisionNo})`
      });
      
      setShowRegenerateConfirm(null);
      onRegenerateSuccess?.();
      await fetchRejectedPayrolls();
      
    } catch (error: any) {
      console.error('Failed to regenerate payroll:', error);
      setAlert?.({
        type: 'error',
        message: error?.response?.data?.message || 'Không thể tái tạo bảng lương'
      });
    } finally {
      setRegeneratingId(null);
    }
  };

  const getStatusBadge = (status: TeacherPaymentStatus) => {
    const statusMap = {
      'REJECTED': {
        label: 'Từ chối',
        className: 'bg-red-50 text-red-700 border-red-200'
      },
      'REQUEST_ADJUSTMENT': {
        label: 'Yêu cầu điều chỉnh',
        className: 'bg-amber-50 text-amber-700 border-amber-200'
      }
    };
    
    const info = statusMap[status as keyof typeof statusMap];
    return info ? (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${info.className}`}>
        <AlertCircle className="h-3 w-3" />
        {info.label}
      </span>
    ) : status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
          <span className="ml-3 text-slate-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (rejectedPayrolls.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Không có bảng lương bị từ chối</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md">
            Tất cả bảng lương đều đang trong trạng thái tốt. 
            Bạn sẽ thấy các bảng lương bị từ chối hoặc yêu cầu điều chỉnh tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-800">
            Bảng lương cần tái tạo
          </h3>
          <span className="text-sm text-slate-500">
            ({rejectedPayrolls.length} bảng)
          </span>
        </div>
        <button
          onClick={fetchRejectedPayrolls}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rejectedPayrolls.map((payroll, index) => (
          <motion.div
            key={payroll.paymentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left - Teacher Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-base font-semibold text-slate-800 truncate">
                        {payroll.teacherName}
                      </h4>
                      {getStatusBadge(payroll.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Tháng {payroll.month}/{payroll.year}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" />
                        {formatCurrency(payroll.amount)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {payroll.totalSessions} buổi
                      </span>
                      {payroll.revisionNo && payroll.revisionNo > 1 && (
                        <span className="flex items-center gap-1.5 text-amber-600">
                          <FileText className="h-3.5 w-3.5" />
                          Phiên bản {payroll.revisionNo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => window.open(`/payroll/${payroll.paymentId}`, '_blank')}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Chi tiết</span>
                  </button>
                  
                  {showRegenerateConfirm === payroll.paymentId ? (
                    <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1">
                      <span className="text-xs text-amber-700 px-2">Xác nhận tái tạo?</span>
                      <button
                        onClick={() => handleRegenerate(payroll)}
                        disabled={regeneratingId === payroll.paymentId}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                      >
                        {regeneratingId === payroll.paymentId ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Đồng ý'
                        )}
                      </button>
                      <button
                        onClick={() => setShowRegenerateConfirm(null)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowRegenerateConfirm(payroll.paymentId)}
                      disabled={regeneratingId === payroll.paymentId}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white btn-gradient from-purple-600 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 disabled:opacity-50"
                    >
                      {regeneratingId === payroll.paymentId ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4" />
                          Tái tạo
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Lưu ý:</strong> Chỉ những bảng lương có trạng thái 
            <span className="font-medium mx-1">"Từ chối"</span> hoặc 
            <span className="font-medium mx-1">"Yêu cầu điều chỉnh"</span> 
            mới có thể tái tạo. Sau khi tái tạo, bảng lương sẽ chuyển sang trạng thái 
            <span className="font-medium mx-1">"Chờ giáo viên xác nhận"</span>.
          </span>
        </p>
      </div>
    </div>
  );
};

export default PayrollRejectedTab;