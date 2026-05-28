import axios from '../axios'
import type {
  AddManualSessionRequest,
  AddManualSessionResponse,
  CreateSubjectScheduleRequest,
  CreateSubjectScheduleResponse,
  DeleteSessionResponse,
  UpdateSessionRequest,
  UpdateSessionResponse
} from '../types/subjectSchedule'

export const subjectScheduleApi = {
  create(
    data: CreateSubjectScheduleRequest
  ): Promise<CreateSubjectScheduleResponse> {
    return axios.post('/subject-schedules', data)
  },

  // Thêm buổi học thủ công
  addManualSession(data: AddManualSessionRequest): Promise<AddManualSessionResponse> {
    return axios.post('/manual-session', data)
  },

  // Cập nhật buổi học
  updateSession(sessionId: number, data: UpdateSessionRequest): Promise<UpdateSessionResponse> {
    return axios.put(`/session/${sessionId}`, data)
  },

  // Xóa buổi học
  deleteSession(sessionId: number): Promise<DeleteSessionResponse> {
    return axios.delete(`/session/${sessionId}`)
  }
}