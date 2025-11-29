// 🔐 API 认证中间件（Next.js App Router）

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getUserData } from '@/lib/firebase-admin';
import { UserData, UserRole, isAccountActive } from '@/lib/types/user';

export interface AuthenticatedRequest extends NextRequest {
  user?: UserData;
  userId?: string;
}

/**
 * API 认证中间件 - 验证 Firebase ID Token
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // 1. 从 Header 中获取 Token
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];

    // 2. 验证 Token
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Authentication service not available' },
        { status: 503 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 3. 获取用户数据
    const userData = await getUserData(userId);

    // 4. 检查账号状态
    if (!isAccountActive(userData as UserData)) {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 403 }
      );
    }

    // 5. 附加用户信息到请求
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = userData as UserData;
    authenticatedRequest.userId = userId;

    // 6. 调用处理函数
    return await handler(authenticatedRequest);
  } catch (error: any) {
    console.error('Auth middleware error:', error);

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    if (error.code === 'auth/argument-error') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * 管理员权限中间件
 */
export async function withAdminAuth(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (authenticatedRequest) => {
    const user = authenticatedRequest.user;

    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return await handler(authenticatedRequest);
  });
}

/**
 * 可选认证中间件 - 如果有 Token 则验证，否则继续
 */
export async function withOptionalAuth(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    // 没有 Token，直接调用处理函数
    return await handler(request as AuthenticatedRequest);
  }

  // 有 Token，使用认证中间件
  return withAuth(request, handler);
}

/**
 * API Key 认证中间件
 */
export async function withAPIKey(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key required' },
        { status: 401 }
      );
    }

    // TODO: 验证 API Key（从数据库查询）
    // 暂时简单实现
    if (!apiKey.startsWith('oece_')) {
      return NextResponse.json(
        { error: 'Invalid API Key' },
        { status: 401 }
      );
    }

    return await handler(request as AuthenticatedRequest);
  } catch (error) {
    return NextResponse.json(
      { error: 'API Key verification failed' },
      { status: 401 }
    );
  }
}
