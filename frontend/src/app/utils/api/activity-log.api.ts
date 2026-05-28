import axios from "../axios";
import type { ActivityLog } from "../types/activity-log";

export const activityLogApi = {

  getRecentActivities(limit = 10): Promise<ActivityLog[]> {
    return axios.get(`/activity-logs/recent/admin?limit=${limit}`);
  },

  getTeacherActivities(userId: number, limit = 10): Promise<ActivityLog[]> {
    return axios.get(`/activity-logs/recent/teacher/${userId}?limit=${limit}`);
  }

};