/**
 * 统一 API 错误处理中间件
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextResponse } from 'next/server';
import { isAppError, getErrorStatusCode, getErrorMessage, getErrorCode } from '@/lib/errors';
import { isDevelopment } from '@/utils/env';

/**
 * 错误响应接口
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
  requestId?: string;
}

/**
 * 处理 API 错误并返回标准化的错误响应
 * @param error 捕获的错误对象
 * @param requestId 请求ID（可选，用于日志追踪）
 */
export function handleApiError(error: unknown, requestId?: string): NextResponse<ErrorResponse> {
  // 记录错误日志
  console.error('[API Error]:', {
    error,
    requestId,
    timestamp: new Date().toISOString(),
  });

  // 获取错误信息
  const statusCode = getErrorStatusCode(error);
  const message = getErrorMessage(error);
  const code = getErrorCode(error);

  // 构建错误响应
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
    },
    timestamp: new Date().toISOString(),
    requestId,
  };

  // 开发环境返回更多错误详情
  if (isDevelopment()) {
    errorResponse.error.details = getErrorDetails(error);
    errorResponse.error.stack = getErrorStack(error);
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * 获取错误详情
 */
function getErrorDetails(error: unknown): any {
  if (isAppError(error)) {
    return error.details;
  }
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  return {
    type: typeof error,
    value: String(error),
  };
}

/**
 * 获取错误堆栈
 */
function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

/**
 * 创建错误响应的快捷方法
 */
export const createErrorResponse = {
  badRequest: (message: string, details?: any) =>
    NextResponse.json(
      {
        success: false,
        error: { message, code: 'BAD_REQUEST', details },
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    ),

  unauthorized: (message: string = '未认证') =>
    NextResponse.json(
      {
        success: false,
        error: { message, code: 'UNAUTHORIZED' },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    ),

  forbidden: (message: string = '无权限') =>
    NextResponse.json(
      {
        success: false,
        error: { message, code: 'FORBIDDEN' },
        timestamp: new Date().toISOString(),
      },
      { status: 403 }
    ),

  notFound: (resource: string) =>
    NextResponse.json(
      {
        success: false,
        error: { message: `${resource} 不存在`, code: 'NOT_FOUND' },
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    ),

  conflict: (message: string, details?: any) =>
    NextResponse.json(
      {
        success: false,
        error: { message, code: 'CONFLICT', details },
        timestamp: new Date().toISOString(),
      },
      { status: 409 }
    ),

  internalServer: (message: string = '服务器内部错误') =>
    NextResponse.json(
      {
        success: false,
        error: { message, code: 'INTERNAL_SERVER_ERROR' },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    ),

  serviceUnavailable: (message: string = '服务暂时不可用') =>
    NextResponse.json(
      {
        success: false,
        error: { message, code: 'SERVICE_UNAVAILABLE' },
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    ),
};
