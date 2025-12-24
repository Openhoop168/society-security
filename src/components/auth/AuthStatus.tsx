'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components'
import { Card } from '@/components'

export function AuthStatus() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  // 处理登出
  const handleSignOut = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      // AuthProvider 会自动处理路由跳转
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // 获取用户显示名称
  const getUserDisplayName = (): string => {
    if (!user) return ''

    // 优先使用 user.user_metadata.name
    if (user.user_metadata?.name) {
      return user.user_metadata.name
    }

    // 其次使用 user.email 的用户名部分
    if (user.email) {
      return user.email.split('@')[0]
    }

    // 最后使用 user.id 的前8位
    return user.id.slice(0, 8)
  }

  // 获取用户邮箱
  const getUserEmail = (): string => {
    return user?.email || ''
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-pulse">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">您还未登录</p>
          <div className="space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/login')}
            >
              登录
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/register')}
            >
              注册
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        {/* 用户信息 */}
        <div className="flex items-center space-x-3">
          {/* 用户头像 */}
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
          </div>

          {/* 用户详情 */}
          <div>
            <div className="font-medium text-gray-900">
              {getUserDisplayName()}
            </div>
            <div className="text-sm text-gray-500">
              {getUserEmail()}
            </div>
          </div>
        </div>

        {/* 登出按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          loading={isLoggingOut}
        >
          {isLoggingOut ? '登出中...' : '登出'}
        </Button>
      </div>
    </Card>
  )
}