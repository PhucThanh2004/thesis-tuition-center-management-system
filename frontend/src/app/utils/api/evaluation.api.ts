import axios from '../axios';
import type {
  CurriculumEvaluation,
  CurriculumEvaluationUpdateRequest,
  SessionEvaluation,
  SessionEvaluationUpdateRequest,
  AttendanceStatistics
} from '../types/evaluation';

export const evaluationApi = {
  // ============ Curriculum Evaluation APIs ============
  
  /**
   * Lấy TẤT CẢ đánh giá curriculum của một môn học (cho nhiều lộ trình)
   * API MỚI: GET /student-evaluations/curriculums/{studentId}/{subjectId}
   */
  getCurriculumEvaluations: (studentId: number, subjectId: number): Promise<CurriculumEvaluation[]> => {
    return axios.get(`/student-evaluations/curriculums/${studentId}/${subjectId}`);
  },

  /**
   * Lấy đánh giá curriculum theo curriculumId
   * API MỚI: GET /student-evaluations/curriculum/{studentId}/{curriculumId}
   */
  getCurriculumEvaluation: (studentId: number, curriculumId: number): Promise<CurriculumEvaluation> => {
    return axios.get(`/student-evaluations/curriculum/${studentId}/${curriculumId}`);
  },

  /**
   * Tạo mới đánh giá curriculum (chỉ khi chưa có)
   * API MỚI: POST /student-evaluations/curriculum/{studentId}/{curriculumId}
   */
  createCurriculumEvaluation: (
    studentId: number,
    curriculumId: number,
    data: CurriculumEvaluationUpdateRequest
  ): Promise<CurriculumEvaluation> => {
    return axios.post(`/student-evaluations/curriculum/${studentId}/${curriculumId}`, data);
  },

  /**
   * Cập nhật đánh giá curriculum (tạo mới nếu chưa có)
   * API MỚI: PUT /student-evaluations/curriculum/{studentId}/{curriculumId}
   */
  updateCurriculumEvaluation: (
    studentId: number,
    curriculumId: number,
    data: CurriculumEvaluationUpdateRequest
  ): Promise<CurriculumEvaluation> => {
    return axios.put(`/student-evaluations/curriculum/${studentId}/${curriculumId}`, data);
  },

  /**
   * Xóa đánh giá curriculum
   * API MỚI: DELETE /student-evaluations/curriculum/{studentId}/{curriculumId}
   */
  deleteCurriculumEvaluation: (studentId: number, curriculumId: number): Promise<void> => {
    return axios.delete(`/student-evaluations/curriculum/${studentId}/${curriculumId}`);
  },

  /**
   * Kiểm tra tồn tại đánh giá curriculum
   * API MỚI: GET /student-evaluations/curriculum/{studentId}/{curriculumId}/exists
   */
  hasCurriculumEvaluation: (studentId: number, curriculumId: number): Promise<boolean> => {
    return axios.get(`/student-evaluations/curriculum/${studentId}/${curriculumId}/exists`);
  },

  // ============ Session Evaluation APIs ============

  /**
   * Lấy danh sách đánh giá các session theo curriculum (trả về Map)
   * API MỚI: GET /student-evaluations/sessions/by-curriculum/{studentId}/{subjectId}
   */
  getSessionEvaluationsByCurriculum: (studentId: number, subjectId: number): Promise<Record<number, SessionEvaluation[]>> => {
    return axios.get(`/student-evaluations/sessions/by-curriculum/${studentId}/${subjectId}`);
  },

  /**
   * Lấy danh sách đánh giá tất cả session (gộp từ các curriculum)
   * API: GET /student-evaluations/sessions/{studentId}/{subjectId}
   */
  getSessionEvaluations: (studentId: number, subjectId: number): Promise<SessionEvaluation[]> => {
    return axios.get(`/student-evaluations/sessions/${studentId}/${subjectId}`);
  },

  /**
   * Lấy đánh giá session theo sessionDetailId
   * API MỚI: GET /student-evaluations/session/{studentId}/{sessionDetailId}
   */
  getSessionEvaluation: (studentId: number, sessionDetailId: number): Promise<SessionEvaluation> => {
    return axios.get(`/student-evaluations/session/${studentId}/${sessionDetailId}`);
  },

  /**
   * Tạo mới đánh giá session (chỉ khi chưa có)
   * API: POST /student-evaluations/session/{studentId}/{sessionDetailId}
   */
  createSessionEvaluation: (
    studentId: number,
    sessionDetailId: number,
    data: SessionEvaluationUpdateRequest
  ): Promise<SessionEvaluation> => {
    return axios.post(`/student-evaluations/session/${studentId}/${sessionDetailId}`, data);
  },

  /**
   * Cập nhật đánh giá session (tạo mới nếu chưa có)
   * API: PUT /student-evaluations/session/{studentId}/{sessionDetailId}
   */
  updateSessionEvaluation: (
    studentId: number,
    sessionDetailId: number,
    data: SessionEvaluationUpdateRequest
  ): Promise<SessionEvaluation> => {
    return axios.put(`/student-evaluations/session/${studentId}/${sessionDetailId}`, data);
  },

  /**
   * Xóa đánh giá session
   * API: DELETE /student-evaluations/session/{studentId}/{sessionDetailId}
   */
  deleteSessionEvaluation: (studentId: number, sessionDetailId: number): Promise<void> => {
    return axios.delete(`/student-evaluations/session/${studentId}/${sessionDetailId}`);
  },

  /**
   * Kiểm tra tồn tại đánh giá session
   * API: GET /student-evaluations/session/{studentId}/{sessionDetailId}/exists
   */
  hasSessionEvaluation: (studentId: number, sessionDetailId: number): Promise<boolean> => {
    return axios.get(`/student-evaluations/session/${studentId}/${sessionDetailId}/exists`);
  },

  // ============ Statistics APIs ============

  /**
   * Thống kê điểm danh
   * API: GET /student-evaluations/attendance-stats/{studentId}/{subjectId}
   */
  getAttendanceStatistics: (studentId: number, subjectId: number): Promise<AttendanceStatistics> => {
    return axios.get(`/student-evaluations/attendance-stats/${studentId}/${subjectId}`);
  }
};