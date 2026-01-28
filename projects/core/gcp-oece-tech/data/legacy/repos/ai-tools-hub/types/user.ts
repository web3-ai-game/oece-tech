export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  balance: number;
  totalSpent: number;
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled';
  subscriptionId?: string;
}

export interface UserProfile extends User {
  bio?: string;
  website?: string;
  company?: string;
  location?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    marketingEmails: boolean;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
