import { apiFetch } from './client';
import type { User } from '../types/user';

export const getUsers = () => apiFetch<User[]>('/api/users');
export const getUser = (uid: string) => apiFetch<User>(`/api/users/${uid}`);
export const updateUser = (uid: string, body: Partial<User>) =>
  apiFetch<User>(`/api/users/${uid}`, { method: 'PATCH', body: JSON.stringify(body) });
export const deleteUser = (uid: string) =>
  apiFetch<void>(`/api/users/${uid}`, { method: 'DELETE' });
