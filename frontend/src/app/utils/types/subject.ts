export interface SubjectStatistics {
  totalSubjects: number
  totalSubjectsThisMonth: number
  percentageIncreaseSubject: number
}

export interface SubjectStatisticsLevel {
  total: number
  level: String
}

export interface SubjectResponse {
  total: number
  data: Subject[]
  stats: {
    all: number
    ended: number
    active: number
    upcoming: number
  }
  success: boolean
  limit: number
  totalPages: number
  page: number
}

export const BillingType = {
  PER_HOUR: 'PER_HOUR',
  PER_SUBJECT: 'PER_SUBJECT'
} as const

export type BillingType =
  (typeof BillingType)[keyof typeof BillingType]

export const PaymentPlanType = {
  FULL: 'FULL',
  INSTALLMENT: 'INSTALLMENT'
} as const

export type PaymentPlanType =
  (typeof PaymentPlanType)[keyof typeof PaymentPlanType]

export interface Subject {
  id: number
  name: string
  grade: string
  price: number
  status: 'active' | 'upcoming' | 'ended'
  maxStudents: number
  sessionsPerWeek: number
  image: string | null
  note: string
  currentStudents: number

  // === THÊM 3 FIELD BILLING ===
  billingType: BillingType | null
  paymentPlanType: PaymentPlanType | null
  installmentCount: number | null

  subjectType: {
    id: number
    name: string
    academicLevel: {
      id: number
      name: string
    }
  }

  teacherSubjects: {
    salaryRate: number
    teacher: {
      id: number
      specialty: string
      user: {
        id: number
        fullName: string
        phoneNumber: string
        gender: boolean
        email?: string
        image?: string | null
      }
    }
  }[]
}

export interface SubjectName {
  id: number
  name: string
}

// === CẬP NHẬT CREATE SUBJECT REQUEST ===
export interface CreateSubjectRequest {
  name: string
  grade: string
  price?: number
  status?: 'active' | 'upcoming' | 'ended'
  maxStudents?: string
  sessionsPerWeek?: string
  note?: string
  teacherId?: number
  image?: File | null
  imageUrl?: string
  subjectTypeId?: number
  
  // === THÊM 3 FIELD BILLING ===
  billingType?: BillingType
  paymentPlanType?: PaymentPlanType
  installmentCount?: number
}

// === CẬP NHẬT UPDATE SUBJECT REQUEST ===
export interface UpdateSubjectRequest {
  name?: string
  grade?: string
  price?: number
  status?: 'active' | 'upcoming' | 'ended'
  maxStudents?: number
  sessionsPerWeek?: number
  note?: string
  teacherId?: number
  subjectTypeId?: number
  imageUrl?: string
  salaryRate?: number // Thêm field này nếu backend cần
  
  // === THÊM 3 FIELD BILLING ===
  billingType?: BillingType
  paymentPlanType?: PaymentPlanType
  installmentCount?: number
}

export interface TeacherSubjectResponse {
  success: boolean;
  data: Subject[];     
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    all: number;
    active: number;
    upcoming: number;
    ended: number;
  };
}