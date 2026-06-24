import axios from '../axios';
import type {
  TuitionCalculationDTO,
  TuitionDetailResponse,
  TuitionPaymentRequest,
  TuitionDetailUpdateRequest,
  TuitionFilterParams,
  TuitionStats,
  TopDebtStudent
} from '../types/tuition';

const logRequest = (method: string, url: string, params?: any, data?: any) => {
  console.log(`📤 ${method} ${url}`, { params, data });
};

const logResponse = (method: string, url: string, response: any) => {
  console.log(`📥 ${method} ${url} - Status: OK`);
};

const extractData = (response: any): any => {
  const payload = response && response.data !== undefined ? response.data : response;
  if (payload && payload.errCode === 0 && payload.data) {
    return payload.data;
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object') {
    return payload;
  }
  return null;
};

export const tuitionApi = {
  // ========== Tạo hóa đơn hàng loạt ==========
  createTuitions(month: number, year: number, note?: string): Promise<TuitionDetailResponse[]> {
    logRequest('POST', '/tuitions/create', { month, year, note });
    return axios.post('/tuitions/create', null, {
      params: { month, year, note }
    }).then(res => extractData(res));
  },

  // ========== Lấy danh sách hóa đơn có lọc ==========
  getTuitionList(params: TuitionFilterParams): Promise<TuitionCalculationDTO[]> {
    logRequest('GET', '/tuitions/list', params);
    return axios.get('/tuitions/list', { params }).then(res => extractData(res));
  },



  getTuitionDetail(studentId: number, month: number, year: number): Promise<TuitionDetailResponse | null> {
    logRequest('GET', '/tuitions/detail', { studentId, month, year });
    return axios.get('/tuitions/detail', {
      params: { studentId, month, year }
    }).then(res => {
      console.log('📥 Raw axios response:', res);
      console.log('📥 response.data:', res.data);
      const payload = res && res.data !== undefined ? res.data : res;
      console.log('📥 Payload:', payload);

      // Trường hợp 1: errCode === 0 và có data
      if (payload && payload.errCode === 0 && payload.data) {
        console.log('✅ Case 1: Data found in payload.data');
        return payload.data;
      }

      // Trường hợp 2: payload là object trực tiếp có id
      if (payload && typeof payload === 'object' && payload.id) {
        console.log('✅ Case 2: Direct object with id');
        return payload;
      }

      // Trường hợp 3: payload có errCode === 1 (không tìm thấy)
      if (payload && payload.errCode === 1) {
        console.log('ℹ️ No data found (errCode=1):', payload.message);
        return null;
      }

      console.warn('⚠️ Unknown response structure:', payload);
      return null;
    }).catch(error => {
      console.error('❌ API Error:', error);
      throw error;
    });
  },

  // ========== Thanh toán học phí ==========
  payTuition(tuitionId: number, amount: number): Promise<TuitionDetailResponse> {
    logRequest('POST', '/tuitions/pay', undefined, { tuitionId, amount });
    return axios.post('/tuitions/pay', { tuitionId, amount }).then(res => extractData(res));
  },

  // ========== Cập nhật chi tiết học phí ==========
  updateTuitionDetail(request: TuitionDetailUpdateRequest): Promise<TuitionDetailResponse> {
    logRequest('POST', '/tuitions/detail/update', undefined, request);
    return axios.post('/tuitions/detail/update', request).then(res => extractData(res));
  },

  // ========== Thống kê (tính từ dữ liệu có sẵn) ==========
  async getStats(month: number, year: number): Promise<TuitionStats> {
    try {
      const invoices = await this.getTuitionList({ month, year });

      const totalInvoices = invoices.length;
      const paidCount = invoices.filter(i => i.status === 'PAID').length;
      const paidPercentage = totalInvoices > 0 ? Math.round((paidCount / totalInvoices) * 100) : 0;
      const pendingCount = invoices.filter(i => i.status === 'WAITING_PAYMENT' || i.status === 'PARTIAL_PAID').length;
      const pendingPercentage = totalInvoices > 0 ? Math.round((pendingCount / totalInvoices) * 100) : 0;
      const totalRevenue = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
      const overdueCount = invoices.filter(i => i.remainingAmount > 0 && i.status !== 'PAID').length;

      // Tính tổng số học sinh nợ và tổng tiền nợ
      const debtors = invoices.filter(i => i.remainingAmount > 0);
      const totalDebtors = debtors.length;
      const totalDebtAmount = debtors.reduce((sum, i) => sum + i.remainingAmount, 0);

      // Tính tỷ lệ thu hồi nợ
      const totalDebt = invoices.reduce((sum, i) => sum + i.remainingAmount, 0);
      const totalExpected = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
      const debtRecoveryRate = totalExpected > 0
        ? Math.round(((totalExpected - totalDebt) / totalExpected) * 100)
        : 100;

      // Xác định mức độ rủi ro
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      if (overdueCount > 30 || debtRecoveryRate < 70) {
        riskLevel = 'HIGH';
      } else if (overdueCount > 15 || debtRecoveryRate < 85) {
        riskLevel = 'MEDIUM';
      }

      return {
        totalInvoices,
        paidCount,
        paidPercentage,
        pendingCount,
        pendingPercentage,
        totalRevenue,
        revenueGrowth: 12,
        debtRecoveryRate,
        riskLevel,
        overdueCount,
        totalDebtors,        
        totalDebtAmount      
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return {
        totalInvoices: 0,
        paidCount: 0,
        paidPercentage: 0,
        pendingCount: 0,
        pendingPercentage: 0,
        totalRevenue: 0,
        revenueGrowth: 0,
        debtRecoveryRate: 0,
        riskLevel: 'LOW',
        overdueCount: 0,
        totalDebtors: 0,     
        totalDebtAmount: 0   
      };
    }
  },

  // ========== Lấy top học sinh nợ nhiều nhất ==========
  async getTopDebtors(month: number, year: number, limit: number = 5): Promise<TopDebtStudent[]> {
    try {
      const invoices = await this.getTuitionList({ month, year });
      const debtors = invoices
        .filter(i => i.remainingAmount > 0)
        .map(i => ({
          id: i.studentId,
          name: i.fullName,
          className: i.grade,
          studentCode: `#SCH${i.studentId}`,
          debtAmount: i.remainingAmount
        }))
        .sort((a, b) => b.debtAmount - a.debtAmount)
        .slice(0, limit);

      return debtors;
    } catch (error) {
      console.error('Failed to get top debtors:', error);
      return [];
    }
  },

  async countStudentsWithDebt(month: number, year: number): Promise<{ totalDebtors: number; totalDebtAmount: number }> {
    logRequest('GET', '/tuitions/debt-count', { month, year });
    try {
      const stats = await this.getStats(month, year);
      return {
        totalDebtors: stats.totalDebtors,
        totalDebtAmount: stats.totalDebtAmount
      };
    } catch (error) {
      console.error('Failed to count students with debt:', error);
      return { totalDebtors: 0, totalDebtAmount: 0 };
    }
  },
  async checkTuitionExists(month: number, year: number): Promise<boolean> {
    logRequest('GET', '/tuitions/check-exists', { month, year });
    try {
      const invoices = await this.getTuitionList({ month, year });
      return invoices.length > 0;
    } catch (error) {
      console.error('Failed to check tuition exists:', error);
      return false;
    }
  },
};
