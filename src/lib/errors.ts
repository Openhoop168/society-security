/**
 * 自定义错误类定义
 * 用于 API 错误处理和响应
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

/**
 * 基础应用错误类
 * 所有自定义错误的基类
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

/**
 * 认证错误 (401)
 * 用户未提供有效的认证令牌
 */
export class AuthenticationError extends AppError {
  constructor(message: string = '未认证') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * 授权错误 (403)
 * 用户已认证但无权限执行操作
 */
export class AuthorizationError extends AppError {
  constructor(message: string = '无权限') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * 验证错误 (400)
 * 请求参数不符合要求
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * 资源未找到错误 (404)
 * 请求的资源不存在
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} 不存在`, 404, 'NOT_FOUND_ERROR');
  }
}

/**
 * 业务逻辑错误 (400)
 * 业务规则验证失败
 */
export class BusinessError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'BUSINESS_ERROR', details);
  }
}

/**
 * 冲突错误 (409)
 * 请求与现有资源冲突
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 409, 'CONFLICT_ERROR', details);
  }
}

/**
 * 速率限制错误 (429)
 * 请求过于频繁
 */
export class RateLimitError extends AppError {
  constructor(message: string = '请求过于频繁，请稍后再试') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

/**
 * 服务不可用错误 (503)
 * 服务暂时不可用
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = '服务暂时不可用，请稍后再试') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
  }
}

/**
 * 错误类型守卫
 * 判断错误是否为自定义错误
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * 获取错误状态码
 * 如果是自定义错误返回其状态码，否则返回 500
 */
export function getErrorStatusCode(error: unknown): number {
  if (isAppError(error)) {
    return error.statusCode;
  }
  return 500;
}

/**
 * 获取错误消息
 * 优先使用自定义错误消息，否则使用默认消息
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '未知错误';
}

/**
 * 获取错误代码
 */
export function getErrorCode(error: unknown): string | undefined {
  if (isAppError(error)) {
    return error.code;
  }
  return undefined;
}
