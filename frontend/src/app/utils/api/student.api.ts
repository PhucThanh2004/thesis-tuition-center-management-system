import axios from '../axios'
import type { StudentStatistics } from '../types/student'

export const studentApi = {
  getStatistics(): Promise<StudentStatistics> {
    return axios.get('/students/statistics')
  },
}