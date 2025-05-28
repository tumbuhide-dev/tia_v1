export type UserRole = 'brand' | 'creator' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  accountType: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profileCompleted: boolean;
} 