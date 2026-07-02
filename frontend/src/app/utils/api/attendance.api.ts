import axios from "../axios"
import type { ApiResponse } from "../types/api"
import type { AttendanceExportItem, AttendanceResponse, AttendanceStatistics, AttendanceToday, ExportFormat, ImportResponse, ImportResult, UpdateAttendanceNotePayload, UpdateAttendanceStatusPayload } from "../types/attendance"

export const attendanceApi = {
  getBySubjectAndDate(
    subjectId: number,
    date: string
  ): Promise<ApiResponse<AttendanceToday>> {
    return axios.get(`/subjects/${subjectId}/attendance`, {
      params: { date },
    })
  },

  getBySubject(
    subjectId: number
  ): Promise<ApiResponse<AttendanceResponse>> {
    return axios.get(`/subject/${subjectId}/attendance`)
  },

  updateStatus(
    payload: UpdateAttendanceStatusPayload
  ): Promise<ApiResponse<string>> {
    return axios.put(`/attendance/status`, payload)
  },

  // =========================
  // PUT - Update Note
  // =========================
  updateNote(
    payload: UpdateAttendanceNotePayload
  ): Promise<ApiResponse<string>> {
    return axios.put(`/attendance/note`, payload)
  },

  getStudentAttendanceStatistics(
    studentId: number,
    subjectId: number
  ): Promise<AttendanceStatistics> {
    return axios.get(`/attendance/statistics/student/${studentId}/subject/${subjectId}`)
  },

  /**
   * Export attendance của 1 môn học
   * @param subjectId - ID của môn học
   * @param startDate - Ngày bắt đầu (optional)
   * @param endDate - Ngày kết thúc (optional)
   * @param format - Định dạng file: 'excel' | 'csv' (default: 'excel')
   * @returns File blob
   */
  exportAttendanceBySubject(
    subjectId: number,
    startDate?: string,
    endDate?: string,
    format: ExportFormat = 'excel'
  ): Promise<Blob> {
    return axios.get(`/attendance/export/subject/${subjectId}`, {
      params: {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        format
      },
      responseType: 'blob'
    })
  },

  /**
   * Export attendance của 1 môn học (trả về dữ liệu JSON)
   */
  exportAttendanceBySubjectJson(
    subjectId: number,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<AttendanceExportItem[]>> {
    return axios.get(`/attendance/export/subject/${subjectId}`, {
      params: {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        format: 'json'
      }
    })
  },


  /**
   * Import attendance từ file
   * @param file - File Excel hoặc CSV
   * @param format - Định dạng file: 'excel' | 'csv' (default: 'excel')
   * @returns Kết quả import
   */
  importAttendance(
    file: File,
    format: ExportFormat = 'excel'
  ): Promise<ImportResult> {
    const formData = new FormData()
    formData.append('file', file)
    
    return axios.post(`/attendance/import`, formData, {
      params: { format },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      const data = response.data || {}
      return {
        successCount: typeof data.success_count === 'number' ? data.success_count : 0,
        errorCount: typeof data.error_count === 'number' ? data.error_count : 0,
        totalRecords: typeof data.total_records === 'number' ? data.total_records : 0,
        message: typeof data.message === 'string' ? data.message : 'Import hoàn tất',
        status: data.status || (data.error_count > 0 ? 'partial_success' : 'success'),
        errors: Array.isArray(data.errors) ? data.errors : []
      } as ImportResult
    })
    .catch((error) => {
      console.error('Import error:', error)
      
      let errorMessage = 'Import thất bại'
      let errorDetail = ''
      
      if (error.response) {
        const errorData = error.response.data
        errorDetail = errorData?.message || errorData?.error || JSON.stringify(errorData)
        errorMessage = `Server error: ${errorDetail}`
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
      } else {
        errorMessage = error.message || 'Có lỗi xảy ra'
      }
      
      return {
        successCount: 0,
        errorCount: 1,
        totalRecords: 0,
        message: errorMessage,
        status: 'error',
        errors: [{
          rowNumber: 0,
          data: null as any,
          errorMessage: errorDetail || errorMessage
        }]
      } as ImportResult
    })
  },


  /**
   * Download template import
   * @param format - Định dạng file: 'excel' | 'csv' (default: 'excel')
   * @returns File blob
   */
  downloadImportTemplate(
    format: ExportFormat = 'excel'
  ): Promise<Blob> {
    return axios.get(`/attendance/import/template`, {
      params: { format },
      responseType: 'blob'
    })
  },
}
