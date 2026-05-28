// types/subjectSchedule.ts

export interface SubjectSchedule {
  id: number
  subjectId: number
  dayOfWeek: number
  startTime: string
  endTime: string
  roomId: number | null
  startDate: string
  endDate: string | null
}

export interface Session {
  id: number
  sessionDate: string
  startTime: string
  endTime: string
  roomId: number | null
  status: string
}

export interface CreateSubjectScheduleRequest {
  subjectId: number
  dayOfWeek: number
  startTime: string
  endTime: string
  roomId: number | null
  startDate: string
  endDate?: string | null
}

export interface CreateSubjectScheduleResponse {
  success: boolean
  message: string
  data: {
    schedule: SubjectSchedule
    sessions: Session[]
  }
}

export interface BaseSession {
  sessionId: number
  sessionDate: string
  startTime: string
  endTime: string
}

export interface UpcomingSession {
  subjectName: string
  grade: string
  teacherName: string
  sessionDate: string
  startTime: string
  endTime: string
}

export interface SessionOfTeacher {
  sessionId: number
  sessionDate: string
  startTime: string
  endTime: string
  status: string
  subjectId: number
  subjectName: string
  roomId: number
  roomName: string
}

export interface RoomDTO {
  name: string
}

export interface SubjectScheduleDTO {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface SessionOfSubject {
  id: number
  subjectId: number
  scheduleId: number
  sessionDate: string
  startTime: string
  endTime: string
  roomId: number
  status: string
  Room: RoomDTO
  SubjectSchedule: SubjectScheduleDTO
}

export interface SubjectScheduleResponse {
  message: string
  sessions: SessionOfSubject[]
}

export type TeacherLeaveType =
  | "NONE"
  | "PENDING"
  | "APPROVED"
  | "AWAITING_REPLACEMENT"
  | "RESOLVED"

export interface TeacherLeaveInfo {
  type: TeacherLeaveType
  replacementTeacherId: number | null
  replacementTeacherName: string | null
}

export type SessionStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "canceled"
  | "expired"

export interface DailySession {
  sessionId: number
  sessionDate: string
  subjectName: string
  startTime: string
  endTime: string
  roomName: string | null
  teacher: {
    id: number
    fullName: string
  } | null
  status: SessionStatus
  teacherLeaveInfo?: TeacherLeaveInfo
}

export interface SessionTeacherInfo {
  id: number
  fullName: string
  specialty: string
  email: string
  phoneNumber: string | null
  image: string
}

export interface SessionRoomInfo {
  id: number
  name: string
  seatCapacity: number
}

export interface StudentAttendanceInfo {
  studentId: number
  fullName: string
  email: string
  phoneNumber: string | null
  attendanceStatus: 'present' | 'absent' | 'late' | null
  attendanceNote: string | null
}

export interface TeacherAttendanceInfo {
  teacherId: number
  teacherName: string
  status: 'present' | 'absent' | 'late'
  note: string | null
}
export interface SessionDetail {
  id: number
  status: SessionStatus
  className: string | null
  subjectName: string
  subjectSlug: string | null
  sessionDate: string
  startTime: string
  endTime: string
  totalMinutes: number
  teacher: SessionTeacherInfo | null
  room: SessionRoomInfo | null
  studentAttendances: StudentAttendanceInfo[]
  teacherAttendance: TeacherAttendanceInfo | null
}

// ========== API REQUEST/RESPONSE TYPES ==========

// Request: Thêm buổi học thủ công
export interface AddManualSessionRequest {
  subjectId: number
  sessionDate: string      // YYYY-MM-DD
  startTime: string        // HH:MM:SS
  endTime: string          // HH:MM:SS
  roomId: number | null
  scheduleId?: number | null
  status?: string
}

// Response: Thêm buổi học thủ công
export interface AddManualSessionResponse {
  success: boolean
  message: string
  data: SessionDTO
}

// Request: Cập nhật buổi học
export interface UpdateSessionRequest {
  sessionDate?: string
  startTime?: string
  endTime?: string
  roomId?: number | null
  scheduleId?: number | null
  status?: string
}

// Response: Cập nhật buổi học
export interface UpdateSessionResponse {
  success: boolean
  message: string
  data: SessionDTO
}

// Response: Xóa buổi học
export interface DeleteSessionResponse {
  success: boolean
  message: string
  data: {
    message: string
    id: number
  }
}

// Response: Lấy session theo ID
export interface GetSessionByIdResponse {
  session: SessionDTO
}

// Session DTO chi tiết
export interface SessionDTO {
  id: number
  subjectId: number | null
  scheduleId: number | null
  sessionDate: string
  startTime: string
  endTime: string
  roomId: number | null
  status: SessionStatus
  room?: RoomDTO | null
  subjectSchedule?: SubjectScheduleDTO | null
}