// 👤 用户资料 API（升级版示例）
// 展示新的架构：认证中间件 + 标准响应格式 + 完整错误处理

import { NextRequest } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth.middleware';
import { successResponse, APIError } from '@/lib/utils/api-response';
import { logger } from '@/lib/utils/logger';
import { adminDb } from '@/lib/firebase-admin';
import { UserData } from '@/lib/types/user';

/**
 * GET - 获取用户资料
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  return withAuth(request, async (authenticatedRequest: AuthenticatedRequest) => {
    try {
      const userId = authenticatedRequest.userId!;

      logger.apiRequest('GET', '/api/user/profile', { userId });

      // 获取用户数据
      if (!adminDb) {
        throw new Error('Database not initialized');
      }

      const userDoc = await adminDb.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        logger.warn('User not found', { userId });
        return APIError.notFound('User not found');
      }

      const userData = userDoc.data() as UserData;

      // 移除敏感信息
      delete (userData as any).invitedBy;
      delete (userData as any).metadata;

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/user/profile', 200, duration);

      return successResponse(userData, 200, { requestTime: duration });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      logger.error('Failed to get user profile', error, {
        userId: authenticatedRequest.userId
      });
      logger.apiResponse('GET', '/api/user/profile', 500, duration);

      return APIError.internalError('Failed to get user profile', {
        message: error.message
      });
    }
  });
}

/**
 * PATCH - 更新用户资料
 */
export async function PATCH(request: NextRequest) {
  const startTime = Date.now();

  return withAuth(request, async (authenticatedRequest: AuthenticatedRequest) => {
    try {
      const userId = authenticatedRequest.userId!;
      const body = await request.json();

      logger.apiRequest('PATCH', '/api/user/profile', { userId, updates: Object.keys(body) });

      // 验证更新字段（仅允许特定字段）
      const allowedFields = ['displayName', 'photoURL', 'phoneNumber', 'preferences'];
      const updates: Partial<UserData> = {};

      for (const field of allowedFields) {
        if (field in body) {
          updates[field as keyof UserData] = body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return APIError.badRequest('No valid fields to update', {
          allowedFields
        });
      }

      // 更新数据库
      if (!adminDb) {
        throw new Error('Database not initialized');
      }

      await adminDb.collection('users').doc(userId).update({
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // 获取更新后的数据
      const updatedDoc = await adminDb.collection('users').doc(userId).get();
      const userData = updatedDoc.data() as UserData;

      const duration = Date.now() - startTime;
      logger.apiResponse('PATCH', '/api/user/profile', 200, duration);

      return successResponse(userData, 200, {
        requestTime: duration,
        fieldsUpdated: Object.keys(updates)
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      logger.error('Failed to update user profile', error, {
        userId: authenticatedRequest.userId
      });
      logger.apiResponse('PATCH', '/api/user/profile', 500, duration);

      return APIError.internalError('Failed to update user profile', {
        message: error.message
      });
    }
  });
}
