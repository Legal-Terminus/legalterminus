import { apiFetch } from './client';
import type { PortalUser } from './users';

/** Self-service profile + order history for the signed-in user. */

export interface MeResponse {
  success: boolean;
  user: PortalUser;
}

/** A payment/order record from users/{uid}/payments (PayU flow). */
export interface Order {
  id: string;
  orderId?: string;
  paymentId?: string;
  amount?: number;
  planName?: string;
  source?: string;
  sourceLabel?: string;
  status?: string;
  failureReason?: string | null;
  paymentDate?: unknown; // ISO string or Firestore Timestamp shape
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

/** Fields a user may edit on their own profile. */
export interface ProfileUpdate {
  name?: string;
  phone?: string;
  address?: string;
  businessName?: string;
  state?: string;
  organisation?: string;
}

export const getMe = () => apiFetch<MeResponse>('/api/auth/me');

export const updateMe = (body: ProfileUpdate) =>
  apiFetch<MeResponse>('/api/auth/me', { method: 'PATCH', body: JSON.stringify(body) });

export const getMyOrders = () => apiFetch<OrdersResponse>('/api/auth/me/orders');
