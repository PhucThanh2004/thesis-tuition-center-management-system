import axios from "../axios";
import type { ActivityLog } from "../types/activity-log";

export const activityLogApi = {

  // =========================
  // GET ACTIVITIES
  // =========================

  getRecentActivities(limit = 10): Promise<ActivityLog[]> {
    return axios.get(`/activity-logs/recent/admin?limit=${limit}`);
  },

  getTeacherActivities(userId: number, limit = 10): Promise<ActivityLog[]> {
    return axios.get(`/activity-logs/recent/teacher/${userId}?limit=${limit}`);
  },

  // =========================
  // GET ACTIVITIES BY USER
  // =========================

  getActivitiesByUser(userId: number, limit = 10): Promise<ActivityLog[]> {
    return axios.get(`/activity-logs/user/${userId}?limit=${limit}`);
  },

  // =========================
  // UNREAD ACTIVITIES
  // =========================

  getUnreadActivities(userId: number, limit = 10): Promise<ActivityLog[]> {
    return axios.get(`/activity-logs/user/${userId}/unread?limit=${limit}`);
  },

  getUnreadCount(userId: number): Promise<{ userId: number; unreadCount: number }> {
    return axios.get(`/activity-logs/user/${userId}/unread-count`);
  },

  // =========================
  // MARK AS READ
  // =========================

  markAsRead(activityLogId: number): Promise<{ message: string; id: string }> {
    return axios.put(`/activity-logs/${activityLogId}/read`);
  },

  markAllAsRead(userId: number): Promise<{ message: string; userId: string }> {
    return axios.put(`/activity-logs/user/${userId}/read-all`);
  }

};