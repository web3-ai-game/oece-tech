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
    // 🎭 开发模式: SVS + TT 主题测试账户
    const mockUsers = [
      { email: 'svs@tt.com', password: 'svs123', user: { id: '1', username: 'svs-tt-admin', email: 'svs@tt.com', role: 'admin' as const } },
      { email: 'svs.tt@hotel.com', password: 'tt2024', user: { id: '2', username: 'svs-tt-manager', email: 'svs.tt@hotel.com', role: 'premium' as const } },
      { email: 'svstt@inistel.com', password: 'svs-tt', user: { id: '3', username: 'svs-tt-staff', email: 'svstt@inistel.com', role: 'user' as const } },
      { email: 'ttsvs@gmail.com', password: 'ttsvs123', user: { id: '4', username: 'tt-svs-demo', email: 'ttsvs@gmail.com', role: 'user' as const } }
    ];

    // 检查Mock用户
    const mockUser = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    if (mockUser) {
      const token = `mock-token-${mockUser.user.id}-${Date.now()}`;
      this.setAuthData(mockUser.user, token);
      return { user: mockUser.user, token };
    }

    // 如果不是Mock用户，尝试真实API
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      this.setAuthData(user, token);
      return { user, token };
    } catch (error) {
      // API失败时的友好提示
      throw new Error('请使用测试账户: svs@tt.com / svs123');
    }
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
