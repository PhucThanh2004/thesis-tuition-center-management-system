export type ActivityActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "LOGIN"
  | "LOGOUT"
  | "CHECKIN";

export type ActivityTargetType =
  | "STUDENT"
  | "TEACHER"
  | "COURSE"
  | "CLASSROOM"
  | "ANNOUNCEMENT"
  | "SCHEDULE"
  | "PAYMENT"
  | "SUBJECT";

export interface ActivityLogMeta {
  title?: string;
  status?: string;
  pinned?: boolean;
}

export interface ActivityLog {
  id: number;

  userId: number
  userName: string;
  userImage: string | null;

  actionType: ActivityActionType;

  targetType: ActivityTargetType;

  targetId: number;

  description: string;

  meta: string | null;

  createdAt: string;
}