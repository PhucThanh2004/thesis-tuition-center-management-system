// ========== Enums ==========
export type AssignmentStatus = 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';

export type AssignmentType = 'MAIN' | 'REPLACEMENT';

export type SalaryType = 'PER_SESSION' | 'PER_HOUR' | 'PER_MONTH';

export type TeacherPaymentStatus =
  | 'WAITING_TEACHER_CONFIRMATION'
  | 'TEACHER_CONFIRMED'
  | 'REJECTED'
  | 'REQUEST_ADJUSTMENT'
  | 'FINALIZED'
  | 'PAID'
  | 'PARTIAL_PAID'
// ========== Response Types từ API ==========
export interface PayrollPreviewResponse {
  teacherId: number;
  teacherName: string;
  month: number;
  year: number;
  totalSessions: number;
  totalAmount: number;
  sessions: PayrollSessionDetail[];
}

export interface PayrollDetailResponse {
  paymentId: number;
  teacherId: number;
  teacherName: string;
  month: number;
  year: number;
  amount: number;
  paidAmount: number; 
  totalSessions: number;
  status: TeacherPaymentStatus;
  paymentDate: string;
  revisionNo?: number;
  previousAmount?: number;
  lastAdjustmentReason?: string;
  adjustedAt?: string;
  details: PayrollSessionDetail[];
  teacherFeedback?: string;
  teacherRejectedAt?: string;
  rejectionReason?: string;
}

export interface TeacherPayment {
  id: number;
  teacherInfo: {
    id: number;
    userInfo: {
      fullName: string;
    };
  };
  amount: number;
  paidAmount: number;
  totalSessions: number;
  paymentDate: string;
  month: number;
  year: number;
  status: TeacherPaymentStatus;
  notes?: string;
  payrollNote?: string;
  teacherFeedback?: string;
  teacherConfirmedAt?: string;
  teacherConfirmedBy?: number;
  finalizedAt?: string;
  finalizedBy?: number;
  createdAt: string;
  updatedAt: string;
  revisionNo?: number;
  previousAmount?: number;
  lastAdjustmentReason?: string;
  adjustedAt?: string;
}
export interface TeacherPaymentDetail {
  id: number;
  paymentInfo: TeacherPayment;
  sessionTeacherInfo: SessionTeacher;
  salaryType: SalaryType;
  salaryRate: number;
  workedHours: number;
  baseAmount: number;
  bonusAmount: number;
  penaltyAmount: number;
  finalAmount: number;
  payrollDate: string; // LocalDate
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionTeacher {
  id: number;
  sessionInfo: {
    id: number;
    subject: {
      name: string;
    };
    sessionDate: string;
    startTime?: string;
    endTime?: string;
    status: string;
  };
  teacherInfo: {
    id: number;
    userInfo: {
      fullName: string;
    };
  };
  assignmentType: AssignmentType;
  assignmentStatus: AssignmentStatus;
  actualStartTime?: string;
  actualEndTime?: string;
  workedHours: number;
  salaryType: SalaryType;
  salaryRate: number;
  baseAmount: number;
  bonusAmount: number;
  penaltyAmount: number;
  finalAmount: number;
  payrollLocked: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ========== UI Types ==========
export interface PayrollSessionDetail {
  id?: number;
  sessionTeacherId: number;
  sessionId: number;
  subjectName: string;
  sessionDate: string; // LocalDate
  startTime?: string; // LocalTime
  endTime?: string; // LocalTime
  assignmentType?: AssignmentType;
  salaryType: SalaryType;
  salaryRate: number;
  workedHours: number;
  amount: number;
  replacement?: boolean;
  note?: string;
}

export interface PayrollSummary {
  id: number;
  teacherName: string;
  teacherId: number;
  month: number;
  year: number;
  amount: number;
  paidAmount: number;
  totalSessions: number;
  status: TeacherPaymentStatus;
  paymentDate: string;
  createdAt: string;
}

export interface PayrollStats {
  totalAmount: number;
  totalPaidAmount: number;
  totalPayrolls: number;
  draftCount: number;
  waitingConfirmationCount: number;
  confirmedCount: number;
  rejectedCount?: number;
  finalizedCount: number;
    partialPaidCount?: number;
  paidCount: number;
  completionRate: number;    // ✅ Thêm dòng này
  //growthPercentage: number;  
}

// ========== Request Types ==========
export interface PayrollPreviewRequest {
  teacherId: number;
  month: number;
  year: number;
  overwriteExisting?: boolean;
}

export interface TeacherPayrollConfirmRequest {
  paymentId: number;
  teacherFeedback?: string;
}

export interface PayrollFinalizeRequest {
  paymentId: number;
  payrollNote?: string;
}

export interface PayrollFilter {
  page?: number;
  size?: number;
  status?: TeacherPaymentStatus;
  teacherId?: number;
  teacherName?: string;
  month?: number;
  year?: number;
  fromDate?: string;
  toDate?: string;
}

// ========== Component Types ==========
export interface PayrollCardProps {
  payroll: TeacherPayment;
  onView?: (id: number) => void;
  onConfirm?: (id: number, feedback?: string) => void;
  onFinalize?: (id: number, note?: string) => void;
  onExport?: (id: number) => void;
  onPay?: (id: number, amount?: number) => void;
}

export interface PayrollDetailModalProps {
  visible: boolean;
  payrollId: number | null;
  onClose: () => void;
  onConfirm?: (id: number, feedback?: string) => void;
  onFinalize?: (id: number, note?: string) => void;
  onPay?: (id: number, amount?: number) => void;
}

export interface PayrollGenerationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (paymentId: number) => void;
  teacherId?: number; // Optional, có thể chọn teacher trong modal
  defaultMonth?: number;
  defaultYear?: number;
}

// ========== API Response Wrapper ==========
export interface ApiResponse<T = any> {
  errCode: number;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}
export interface PayrollListItem {
  paymentId: number;
  teacherId: number;
  teacherName: string;
  month: number;
  year: number;
  amount: number;
  paidAmount?: number; 
  remainingAmount?: number;
  totalSessions: number;
  status: TeacherPaymentStatus;
  paymentDate: string;
  revisionNo?: number;
  feedback?: string;
}

export interface MonthlyPayrollTeacherDTO {
  teacherId: number;
  teacherName: string;
  totalSessions: number;
  amount: number;
}

export interface MonthlyPayrollPreview {
  month: number;
  year: number;
  teachers: MonthlyPayrollTeacherDTO[];
  totalTeachers: number;
  totalPayrollAmount: number;
  totalAmount: number;
  payrolls: TeacherPayrollSummary[];
}

export interface MonthlyPayrollStats {
  month: number;
  year: number;
  totalPayrolls: number;
  totalAmount: number;
  statusCounts: Record<string, number>;
  averageAmount: number;
  minAmount: number;
  maxAmount: number;
}

export interface TeacherPayrollSummary {
  paymentId: number;
  month: number;
  year: number;
  amount: number;
  totalSessions: number;
  status: TeacherPaymentStatus;
}

// Cập nhật PayrollStats
export interface PayrollStats {
  totalAmount: number;
  totalPaidAmount: number;
  totalPayrolls: number;
  draftCount: number;
  waitingConfirmationCount: number;
  confirmedCount: number;
  rejectedCount?: number;
  finalizedCount: number;
  paidCount: number;
  completionRate: number;
}
export interface TeacherPayrollRejectRequest {
  paymentId: number;
  reason: string;
}

export interface PayrollFinalizeRequest {
  paymentId: number;
  payrollNote?: string;
}

// *** THÊM MỚI: Request điều chỉnh (nếu có) ***
export interface TeacherPayrollAdjustmentRequest {
  paymentId: number;
  adjustmentReason: string;
}

export interface TeacherPaymentResponse {
  id: number;
  teacherId: number;
  teacherName: string;
  month: number;
  year: number;
  amount: number;
  status: string;
  revisionNo: number;
}


export interface PayrollPaymentRequest {
  paymentId: number;
  paidAmount?: number;      
  paymentNote?: string;        
  paymentDate?: string;     
  detailIds?: number[];        
  payAllDetails?: boolean;     
}

export interface PaymentDetailStatusDTO {
  detailId: number;
  subjectName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  fullyPaid: boolean;
}

export interface PayrollPaymentResponse {
  paymentId: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: TeacherPaymentStatus;
  paymentDate: string;
  paymentNote?: string;
  detailStatuses?: PaymentDetailStatusDTO[];
}