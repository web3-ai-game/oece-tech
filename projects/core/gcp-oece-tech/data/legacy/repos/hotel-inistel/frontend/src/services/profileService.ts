import { apiClient } from './api';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  rank: string;
  avatar: string;
  favorites: any[];
  purchases: any[];
  learningPath: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export const profileService = {
  // 获取用户个人信息
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/user/profile');
    return response.data.profile;
  },

  // 更新用户个人信息
  async updateProfile(data: { username: string }): Promise<void> {
    await apiClient.put('/user/profile', data);
  },

  // 获取用户收藏
  async getFavorites(): Promise<any[]> {
    // TODO: 实现收藏API
    return [];
  },

  // 获取用户购买记录
  async getPurchases(): Promise<any[]> {
    // TODO: 实现购买记录API
    return [];
  },

  // 添加收藏
  async addFavorite(tutorialId: string): Promise<void> {
    // TODO: 实现添加收藏API
  },

  // 移除收藏
  async removeFavorite(tutorialId: string): Promise<void> {
    // TODO: 实现移除收藏API
  }
};
