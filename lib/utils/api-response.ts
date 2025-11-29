// 📤 标准化 API 响应格式

import { NextResponse } from 'next/server';

/**
 * 标准 API 响应接口
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    version?: string;
  };
}

/**
 * 成功响应
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, any>
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    },
    { status }
  );
}

/**
 * 错误响应
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: any
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    },
    { status }
  );
}

/**
 * 常见错误响应快捷方法
 */
export class APIError {
  static badRequest(message: string = 'Bad Request', details?: any) {
    return errorResponse('BAD_REQUEST', message, 400, details);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return errorResponse('UNAUTHORIZED', message, 401);
  }

  static forbidden(message: string = 'Forbidden') {
    return errorResponse('FORBIDDEN', message, 403);
  }

  static notFound(message: string = 'Not Found') {
    return errorResponse('NOT_FOUND', message, 404);
  }

  static conflict(message: string = 'Conflict') {
    return errorResponse('CONFLICT', message, 409);
  }

  static tooManyRequests(message: string = 'Too Many Requests') {
    return errorResponse('TOO_MANY_REQUESTS', message, 429);
  }

  static internalError(message: string = 'Internal Server Error', details?: any) {
    return errorResponse('INTERNAL_ERROR', message, 500, details);
  }

  static serviceUnavailable(message: string = 'Service Unavailable') {
    return errorResponse('SERVICE_UNAVAILABLE', message, 503);
  }
}

/**
 * 分页响应
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  status: number = 200
): NextResponse<APIResponse<T[]>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    },
    { status }
  );
}
