/**
 * 错误处理工具
 * 统一的错误处理和用户提示
 */

import { log } from './logger'
import type { AppError } from '@/lib/errors'

export interface ErrorDisplay {
  title: string
  message: string
  action?: string
}

/**
 * 将错误转换为用户友好的显示信息
 */
export function getErrorDisplay(error: Error): ErrorDisplay {
  // 处理自定义错误类型
  if ('code' in error) {
    const appError = error as any
    return {
      title: appError.name || '操作失败',
      message: appError.message || appError.userMessage || '操作失败，请稍后重试',
      action: appError.action,
    }
  }

  // 处理网络错误
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      title: '网络错误',
      message: '无法连接到服务器，请检查您的网络连接',
      action: '重试',
    }
  }

  // 处理认证错误
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    return {
      title: '认证失败',
      message: '登录已过期，请重新登录',
      action: '重新登录',
    }
  }

  // 处理权限错误
  if (error.message.includes('403') || error.message.includes('Forbidden')) {
    return {
      title: '权限不足',
      message: '您没有权限执行此操作',
    }
  }

  // 处理数据验证错误
  if (error.message.includes('validation') || error.message.includes('Invalid')) {
    return {
      title: '数据验证失败',
      message: '请检查输入的数据格式是否正确',
    }
  }

  // 默认错误信息
  return {
    title: '发生错误',
    message: error.message || '操作失败，请稍后重试',
    action: '重试',
  }
}

/**
 * 错误边界处理器
 */
export function handleError(error: Error, errorInfo?: React.ErrorInfo): void {
  // 记录错误日志
  log.error('Error boundary caught an error', error, {
    componentStack: errorInfo?.componentStack,
  })

  // 在开发环境显示详细错误
  if (process.env.NODE_ENV === 'development') {
    console.error('Error caught by boundary:', error)
    console.error('Component stack:', errorInfo?.componentStack)
  }

  // TODO: 发送错误到监控服务
  // 例如：Sentry, LogRocket 等
}

/**
 * 异步操作错误处理器
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  errorHandler?: (error: Error) => void
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))

    // 记录错误
    log.error('Async operation failed', err)

    // 调用自定义错误处理器
    if (errorHandler) {
      errorHandler(err)
    }

    return null
  }
}

/**
 * 表单验证错误处理
 */
export function handleFormError(error: unknown): Record<string, string> {
  if (error instanceof Error && 'errors' in error) {
    const validationError = error as { errors: Record<string, string> }
    return validationError.errors
  }

  // 返回通用错误
  return {
    _form: error instanceof Error ? error.message : '操作失败，请稍后重试',
  }
}

/**
 * API 错误处理
 */
export function handleApiError(error: unknown): ErrorDisplay {
  if (error instanceof Error) {
    return getErrorDisplay(error)
  }

  if (typeof error === 'string') {
    return {
      title: '操作失败',
      message: error,
    }
  }

  return {
    title: '未知错误',
    message: '发生未知错误，请稍后重试',
  }
}

/**
 * 重试逻辑
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (i < maxRetries - 1) {
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError || new Error('Operation failed after retries')
}
