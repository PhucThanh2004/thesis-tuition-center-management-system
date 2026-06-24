
export interface TimeSlot {
    dayOfWeek: number;  // 1=Thứ 2, 2=Thứ 3, ..., 7=Chủ nhật
    startTime: string;  // "18:00"
    endTime: string;    // "21:00"
}

export interface TeacherSuggestionRequest {
    subjectName: string;
    grade: string;
    subjectTypeId?: number;
    preferredTimeSlots?: TimeSlot[];
    limit?: number;     // Số lượng gợi ý trả về, mặc định 5
}

export interface TeacherSuggestionDTO {
    teacherId: number;
    fullName: string;
    specialty: string;
    phoneNumber: string;
    email: string;
    image: string | null;
    gender: boolean;
    matchScore: number;      // Điểm phù hợp (0-100)
    availableSlots: number;   // Số buổi trống trong 2 tuần
    totalSubjects: number;    // Tổng số môn đã/dang dạy
    totalStudents: number;    // Tổng số học sinh đã dạy
    reason: string;           // Lý do đề xuất
    strengths: string[];      // Điểm mạnh của giáo viên
}

export interface ApiResponse {
    errCode?: number;
    code?: number;
    success?: boolean;
    message?: string;
    data?: any;
}