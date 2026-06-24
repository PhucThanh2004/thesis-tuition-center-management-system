// src/utils/types/tuition.ts

export type PaymentStatus = 'WAITING_PAYMENT' | 'PARTIAL_PAID' | 'PAID';

export interface TuitionCalculationDTO {
  tuitionId: number;
  studentId: number;
  fullName: string;
  phoneNumber: string;
  grade: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: PaymentStatus;
}

export interface TuitionDetailResponse {
  id: number;
  student: {
    id: number;
    userInfo: {
      fullName: string;
      phoneNumber: string;
      image?: string;  
    };
    grade: string;
  };
  studentId?: number;      
  studentName?: string;   
  studentCode?: string;    
  month: number;
  year: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: PaymentStatus;
  details: TuitionDetailItem[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface TuitionDetailItem {
  id: number;
  subject: {
    id: number;
    name: string;
  };
  subjectName?: string;    
  subjectCode?: string;   
  billingType: 'PER_HOUR' | 'PER_SUBJECT';
  paymentPlanType: 'ONE_TIME' | 'INSTALLMENT';
  installmentNo: number;
  totalInstallments: number;
  attendedSessions: number;
  totalHours: number;
  totalMoney: number;
  note?: string;
  teacher?: string;        
  unitPrice?: number;     
  discount?: number;     
  amount?: number;        
  sessions?: number;      
}
export interface TuitionPaymentRequest {
  tuitionId: number;
  amount: number;
}

export interface TuitionDetailUpdateRequest {
  detailId: number;
  attendedSessions?: number;
  totalMoney?: number;
  note?: string;
}

export interface TuitionStats {
  totalInvoices: number;
  paidCount: number;
  paidPercentage: number;
  pendingCount: number;
  pendingPercentage: number;
  totalRevenue: number;
  revenueGrowth: number;
  debtRecoveryRate: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  overdueCount: number;
  totalDebtors: number;      
  totalDebtAmount: number;   
}

export interface TopDebtStudent {
  id: number;
  name: string;
  className: string;
  studentCode: string;
  debtAmount: number;
  avatar?: string;
}

export interface TuitionFilterParams {
  month: number;
  year: number;
  name?: string;
  grade?: string;
  status?: PaymentStatus;
}