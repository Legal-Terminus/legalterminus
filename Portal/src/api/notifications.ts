import { apiFetch } from './client';
import type { Notification } from '../types/notification';

export const getNotifications = () => apiFetch<Notification[]>('/api/notifications');
export const markRead = (id: string) =>
  apiFetch<void>(`/api/notifications/${id}/read`, { method: 'PATCH' });
export const markAllRead = () =>
  apiFetch<void>('/api/notifications/read-all', { method: 'PATCH' });
