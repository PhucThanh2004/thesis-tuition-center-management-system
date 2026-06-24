import axios from '../axios';
import type {
    TeacherSuggestionRequest,
    TeacherSuggestionDTO,
    TimeSlot
} from '../types/teacherSuggestion';

export const teacherSuggestionApi = {
    /**
     * Gợi ý giáo viên phù hợp
     * @param request Thông tin yêu cầu gợi ý
     * @returns Danh sách giáo viên được gợi ý
     */
    async suggestTeachers(request: TeacherSuggestionRequest): Promise<TeacherSuggestionDTO[]> {
        try {
            const response = await axios.post('/teachers/suggest', request);

            if (Array.isArray(response)) {
                return response;
            }
            
            return [];
        } catch (error) {
            console.error('Lỗi khi gợi ý giáo viên:', error);
            throw error;
        }
    },

    /**
     * Gợi ý giáo viên với khung giờ mong muốn
     * @param subjectName Tên môn học
     * @param grade Khối lớp
     * @param preferredTimeSlots Danh sách khung giờ mong muốn
     * @param limit Số lượng kết quả
     */
    async suggestWithTimeSlots(
        subjectName: string,
        grade: string,
        preferredTimeSlots?: TimeSlot[],
        limit: number = 5
    ): Promise<TeacherSuggestionDTO[]> {
        const result = await this.suggestTeachers({
            subjectName,
            grade,
            preferredTimeSlots,
            limit
        });
        return result;
    },

    /**
     * Gợi ý giáo viên cơ bản (không có khung giờ)
     */
    async suggestBasic(subjectName: string, grade: string, limit: number = 5): Promise<TeacherSuggestionDTO[]> {
        return this.suggestTeachers({
            subjectName,
            grade,
            limit
        });
    }
};