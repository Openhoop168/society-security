/**
 * 认证和授权中间件
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AuthenticationError } from '@/lib/errors';

/**
 * 从请求中认证用户身份
 * 从 Authorization header 中提取 Bearer token 并验证
 * @param request Next.js 请求对象
 * @returns 用户 ID
 * @throws AuthenticationError 如果认证失败
 */
export async function authenticateRequest(request: NextRequest): Promise<string> {
  // 获取 Authorization header
  const authHeader = request.headers.get('authorization');

  // 检查 header 是否存在
  if (!authHeader) {
    throw new AuthenticationError('缺少认证令牌');
  }

  // 检查格式是否为 Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('认证令牌格式错误');
  }

  // 提取 token
  const token = authHeader.substring(7);

  // 验证 token
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    throw new AuthenticationError('无效的认证令牌');
  }

  if (!user) {
    throw new AuthenticationError('用户不存在');
  }

  // 返回用户 ID
  return user.id;
}

/**
 * 从请求中获取用户信息
 * 尝试从 session 获取用户，如果没有返回 null
 * 主要用于服务端渲染场景
 * @param request Next.js 请求对象
 * @returns 用户 ID 或 null
 */
export async function getUserFromRequest(request: NextRequest): Promise<string | null> {
  try {
    // 首先尝试从 Authorization header 获取
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (!error && user) {
        return user.id;
      }
    }

    // 其次尝试从 session cookie 获取
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      return session.user.id;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 检查用户是否有权限访问资源
 * @param userId 当前用户 ID
 * @param resourceOwnerId 资源所有者 ID
 * @throws AuthorizationError 如果无权限
 */
export function checkOwnership(
  userId: string,
  resourceOwnerId: string
): void {
  if (userId !== resourceOwnerId) {
    throw new AuthenticationError('无权限访问此资源');
  }
}

/**
 * 可选认证：如果提供了 token 则验证，否则返回 null
 * 用于需要用户信息但非必需认证的场景
 * @param request Next.js 请求对象
 * @returns 用户 ID 或 null
 */
export async function optionalAuth(request: NextRequest): Promise<string | null> {
  try {
    return await authenticateRequest(request);
  } catch {
    return null;
  }
}
