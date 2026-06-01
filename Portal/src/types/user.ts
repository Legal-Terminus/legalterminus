export type Role = 'admin' | 'manager' | 'team_member' | 'client';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export interface ClientProfile extends User {
  role: 'client';
  phone?: string;
  company?: string;
}

export interface TeamMember extends User {
  role: 'team_member' | 'manager' | 'admin';
  department?: string;
}
