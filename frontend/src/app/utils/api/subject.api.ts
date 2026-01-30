import axios from '../axios'
import type { SubjectStatistics } from '../types/subject'

export const subjectApi = {
  getStatistics(): Promise<SubjectStatistics> {
    return axios.get('/subjects/statistics')
  },
}