import { apiFetch } from './client';
import type { Payment } from '../types/payment';

export const getPayments = (taskId: string) =>
  apiFetch<Payment[]>(`/api/tasks/${taskId}/payments`);
export const recordPayment = (taskId: string, body: Partial<Payment>) =>
  apiFetch<Payment>(`/api/tasks/${taskId}/payments`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
