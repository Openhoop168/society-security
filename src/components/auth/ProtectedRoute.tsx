'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components'

interface ProtectedRouteProps {
  children: ReactNode
  fallbackPath?: string
  loadingComponent?: ReactNode
}

export function ProtectedRoute({
  children,
  fallbackPath = '/login',
  loadingComponent = <LoadingSpinner />
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 如果没有在加载中且未认证，重定向到登录页面
    if (!isLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`${fallbackPath}?returnUrl=${returnUrl}`)
    }
  }, [isAuthenticated, isLoading, router, fallbackPath])

  // 加载中显示加载组件
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {loadingComponent}
      </div>
    )
  }

  // 未认证时返回空（等待重定向）
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  // 认证通过，显示子组件
  return <>{children}</>
}

// 高阶组件版本
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  fallbackPath?: string
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute fallbackPath={fallbackPath}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// 用于页面级别的路由保护
export function ProtectedPage({
  children,
  title,
  description,
}: {
  children: ReactNode
  title?: string
  description?: string
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {title && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="mt-2 text-lg text-gray-600">{description}</p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}