export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  recipientUid: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  taskId?: string;
  createdAt: string;
}
