// utils/types/evaluation.ts
export interface CurriculumEvaluation {
  curriculumId: number;
  curriculumTitle: string;
  understandingLevel: number;
  overallProgress: number;
  teacherNotes?: string;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  avgHomeworkQuality: number;
  completedSessions: number;
  totalSessions: number;
  updatedAt?: string;
  lastUpdated?: string;
}

export interface CurriculumEvaluationUpdateRequest {
  understandingLevel: number;
  overallProgress?: number;
  teacherNotes?: string;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
}

export interface SessionEvaluation {
  sessionDetailId: number;
  sessionNumber: number;
  topic: string;
  understandingLevel?: number;
  completionStatus: 'COMPLETED' | 'PARTIAL' | 'NOT_STARTED';
  teacherNotes?: string;
  homeworkQuality?: number;
  participationLevel?: number;
  updatedAt?: string;
}

export interface SessionEvaluationUpdateRequest {
  understandingLevel: number;
  completionStatus: string;
  teacherNotes?: string;
  homeworkQuality?: number;
  participationLevel?: number;
}

export interface AttendanceStatistics {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}