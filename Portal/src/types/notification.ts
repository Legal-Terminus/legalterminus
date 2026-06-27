export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  recipientUid: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  taskId?: string;
  /** Step the notification relates to (resolved when that step/matter completes). */
  stepNumber?: number;
  createdAt: string;
}
