import axios from '../axios'
import type { TeacherStatistics } from '../types/teacher'

export const teacherApi = {
  getStatistics(): Promise<TeacherStatistics> {
    return axios.get('/teachers/statistics')
  },
}
