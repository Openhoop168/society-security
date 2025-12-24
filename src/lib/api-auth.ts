/**
 * API 路由身份验证工具
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { supabase } from './supabase'

export async function getAuthUser(request: Request) {
  try {
    // 从请求中获取 Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)

    // 验证 token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

export async function verifyAuthUser(request: Request) {
  const user = await getAuthUser(request)

  if (!user) {
    throw new Error('未授权访问')
  }

  return user
}
