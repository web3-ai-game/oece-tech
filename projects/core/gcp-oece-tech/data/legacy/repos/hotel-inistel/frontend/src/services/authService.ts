import { apiClient } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'premium';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Initialize from localStorage
    this.token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('authUser');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        this.user = null;
      }
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    const { user, token } = response.data;
    
    this.setAuthData(user, token);
    return { user, token };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);
    const { user, token } = response.data;
    
    this.setAuthData(user, token);
    return { user, token };
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  private setAuthData(user: User, token: string): void {
    this.user = user;
    this.token = token;
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  }
}

export const authService = new AuthService();
