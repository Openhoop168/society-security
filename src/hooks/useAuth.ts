import { AuthError } from '@supabase/supabase-js'
import { useAuth as useAuthContext } from '@/components/auth/AuthProvider'

// 重新导出 useAuth Hook，便于其他组件使用
export const useAuth = useAuthContext

// 认证相关的工具函数
export const authUtils = {
  // 检查是否为认证错误
  isAuthError: (error: any): error is AuthError => {
    return error && typeof error === 'object' && 'message' in error
  },

  // 获取友好的错误消息
  getErrorMessage: (error: AuthError | null): string => {
    if (!error) return ''

    switch (error.message) {
      case 'Invalid login credentials':
        return '邮箱或密码错误，请重试'
      case 'Email not confirmed':
        return '请先验证您的邮箱地址'
      case 'User already registered':
        return '该邮箱已被注册'
      case 'Password should be at least 6 characters':
        return '密码至少需要6个字符'
      case 'Invalid email':
        return '邮箱格式不正确'
      case 'Too many requests':
        return '请求过于频繁，请稍后再试'
      default:
        return error.message || '认证过程中发生错误'
    }
  },

  // 验证邮箱格式
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // 验证密码强度
  validatePassword: (password: string): {
    isValid: boolean
    errors: string[]
  } => {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('密码至少需要8个字符')
    }

    if (!/(?=.*[a-zA-Z])/.test(password)) {
      errors.push('密码需要包含至少一个字母')
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('密码需要包含至少一个数字')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  // 检查会话是否即将过期
  isSessionExpiringSoon: (expiresAt?: number): boolean => {
    if (!expiresAt) return false

    const now = Date.now() / 1000
    const timeUntilExpiry = expiresAt - now

    // 如果会在5分钟内过期，返回true
    return timeUntilExpiry < 300 && timeUntilExpiry > 0
  },
}