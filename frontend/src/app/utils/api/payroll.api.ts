import axios from '../axios';
import type {
  PayrollPreviewResponse,
  PayrollDetailResponse,
  TeacherPayment,
  PayrollPreviewRequest,
  TeacherPayrollConfirmRequest,
  PayrollFinalizeRequest,
  PayrollStats,
  PayrollListItem,
  MonthlyPayrollPreview,
  MonthlyPayrollStats,
  TeacherPayrollSummary,
  TeacherPayrollRejectRequest,
  TeacherPaymentResponse,
  PayrollPaymentRequest,
  PayrollPaymentResponse
} from '../types/payroll';

const logRequest = (method: string, url: string, params?: any, data?: any) => {
  console.log(`${method} ${url}`, { params, data });
};

const logError = (method: string, url: string, error: any) => {
  console.error(`${method} ${url} - Error:`, error.response?.data || error.message);
};


export const payrollApi = {
  // ========== Preview - 1 giáo viên ==========
  previewPayroll(request: PayrollPreviewRequest): Promise<PayrollPreviewResponse> {
    logRequest('POST', '/payroll/preview', undefined, request);
    return axios.post('/payroll/preview', request);
  },

  // ========== Generate - 1 giáo viên ==========
  generatePayroll(request: PayrollPreviewRequest): Promise<TeacherPayment> {
    logRequest('POST', '/payroll/generate', undefined, request);
    return axios.post('/payroll/generate', request);
  },

  // ========== Giáo viên xác nhận ==========
  confirmPayroll(request: TeacherPayrollConfirmRequest): Promise<string> {
    logRequest('POST', '/payroll/confirm', undefined, request);
    return axios.post('/payroll/confirm', request);
  },

  // ========== Giáo viên từ chối bảng lương  ==========
  rejectPayroll(request: TeacherPayrollRejectRequest): Promise<string> {
    logRequest('POST', '/payroll/reject', undefined, request);
    return axios.post('/payroll/reject', request);
  },

  // ========== Admin chốt lương ==========
  finalizePayroll(request: PayrollFinalizeRequest, adminId: number): Promise<string> {
    logRequest('POST', `/payroll/finalize?adminId=${adminId}`, undefined, request);
    return axios.post('/payroll/finalize', request, {
      params: { adminId }
    });
  },

  // ========== Admin tái tạo bảng lương ==========
  regeneratePayroll(request: PayrollPreviewRequest): Promise<TeacherPaymentResponse> {
    logRequest('POST', '/payroll/regenerate', undefined, request);
    return axios.post('/payroll/regenerate', request);
  },

  // ========== Lấy danh sách bảng lương (Admin) ==========
  getAllPayrolls(): Promise<PayrollListItem[]> {
    logRequest('GET', '/payroll');
    return axios.get('/payroll');
  },

  // ========== Lấy chi tiết bảng lương theo ID (Admin) ==========
  getPayrollById(id: number): Promise<PayrollDetailResponse> {
    logRequest('GET', `/payroll/${id}`);
    return axios.get(`/payroll/${id}`);
  },
  // ========== Export 1 bảng lương ra Excel ==========
  async exportPayrollToExcel(id: number): Promise<Blob> {
    logRequest('GET', `/payroll/${id}/export`);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8088/v1/api';

      const response = await fetch(`${baseUrl}/payroll/${id}/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('Export response blob:', {
        size: blob.size,
        type: blob.type
      });

      return blob;
    } catch (error) {
      logError('GET', `/payroll/${id}/export`, error);
      throw error;
    }
  },

  // ========== Export tất cả bảng lương ra Excel ==========
  async exportAllPayrollsToExcel(): Promise<Blob> {
    logRequest('GET', '/payroll/export/all');
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8088/v1/api';

      const response = await fetch(`${baseUrl}/payroll/export/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('Export all response blob:', {
        size: blob.size,
        type: blob.type
      });

      return blob;
    } catch (error) {
      logError('GET', '/payroll/export/all', error);
      throw error;
    }
  },

  // ========== Preview tất cả giáo viên trong tháng ==========
  previewMonthlyPayroll(month: number, year: number): Promise<MonthlyPayrollPreview> {
    logRequest('GET', '/payroll/monthly-preview', { month, year });
    return axios.get('/payroll/monthly-preview', {
      params: { month, year }
    });
  },

  // ========== Tạo bảng lương hàng loạt ==========
  generateMonthlyPayroll(month: number, year: number): Promise<TeacherPayment[]> {
    logRequest('POST', '/payroll/generate-month', { month, year });
    return axios.post('/payroll/generate-month', null, {
      params: { month, year }
    });
  },

  // ========== Thống kê bảng lương theo tháng ==========
  getMonthlyStats(month: number, year: number): Promise<MonthlyPayrollStats> {
    logRequest('GET', '/payroll/monthly-stats', { month, year });
    return axios.get('/payroll/monthly-stats', {
      params: { month, year }
    });
  },

  // ========== Giáo viên xem danh sách lương của mình ==========
  getMyPayrolls(teacherId: number): Promise<TeacherPayrollSummary[]> {
    logRequest('GET', '/payroll/my', { teacherId });
    return axios.get('/payroll/my', {
      params: { teacherId }
    });
  },

  // ========== Giáo viên xem chi tiết 1 bảng lương của mình ==========
  getMyPayrollDetail(paymentId: number, teacherId: number): Promise<PayrollDetailResponse> {
    logRequest('GET', `/payroll/my/${paymentId}`, { teacherId });
    return axios.get(`/payroll/my/${paymentId}`, {
      params: { teacherId }
    });
  },

  processPayment(request: PayrollPaymentRequest): Promise<PayrollPaymentResponse> {
    logRequest('POST', '/payroll/pay', undefined, request);
    return axios.post('/payroll/pay', request);
  },
  // ========== Utility Functions ==========
  async checkPayrollExists(teacherId: number, month: number, year: number): Promise<boolean> {
    try {
      const payrolls = await this.getAllPayrolls();
      return payrolls.some(p => p.teacherId === teacherId && p.month === month && p.year === year);
    } catch (error) {
      console.error('API checkPayrollExists error:', error);
      return false;
    }
  },

  async getPayrollStats(month?: number, year?: number): Promise<PayrollStats> {
  try {
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    // Lấy tất cả bảng lương
    const allPayrolls = await this.getAllPayrolls();
    console.log('📊 All payrolls for stats:', allPayrolls);

    // Lọc theo tháng/năm
    const filteredPayrolls = allPayrolls.filter(p => 
      p.month === currentMonth && p.year === currentYear
    );
    console.log('📊 Filtered payrolls:', filteredPayrolls);

    // Tính toán các chỉ số từ dữ liệu thực tế
    const totalPayrolls = filteredPayrolls.length;
    const totalAmount = filteredPayrolls.reduce((sum, p) => sum + p.amount, 0);
    
    // Đếm theo status
    const waitingConfirmationCount = filteredPayrolls.filter(p => p.status === 'WAITING_TEACHER_CONFIRMATION').length;
    const confirmedCount = filteredPayrolls.filter(p => p.status === 'TEACHER_CONFIRMED').length;
    const rejectedCount = filteredPayrolls.filter(p => p.status === 'REJECTED' || p.status === 'REQUEST_ADJUSTMENT').length;
    const finalizedCount = filteredPayrolls.filter(p => p.status === 'FINALIZED' || p.status === 'PAID').length;
    const paidCount = filteredPayrolls.filter(p => p.status === 'PAID').length;

    console.log('📊 Stats calculated:', {
      totalPayrolls,
      totalAmount,
      waitingConfirmationCount,
      confirmedCount,
      rejectedCount,
      finalizedCount,
      paidCount
    });

    return {
      totalAmount,
      totalPaidAmount: 0,
      totalPayrolls,
      draftCount: 0,
      waitingConfirmationCount,
      confirmedCount,
      rejectedCount,
      finalizedCount,
      paidCount,
      completionRate: totalPayrolls > 0
        ? Math.round((finalizedCount / totalPayrolls) * 100)
        : 0
    };
  } catch (error) {
    console.error('❌ API getPayrollStats error:', error);
    return {
      totalAmount: 0,
      totalPaidAmount: 0,
      totalPayrolls: 0,
      draftCount: 0,
      waitingConfirmationCount: 0,
      confirmedCount: 0,
      rejectedCount: 0,
      finalizedCount: 0,
      paidCount: 0,
      completionRate: 0
    };
  }
},
};