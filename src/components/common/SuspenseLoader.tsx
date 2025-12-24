/**
 * SuspenseLoader 组件
 * 用于 Suspense 边界的加载状态
 */

'use client'

import React from 'react'

interface SuspenseLoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SuspenseLoader({ message = '加载中...', size = 'md' }: SuspenseLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className={`animate-spin rounded-full border-4 border-gray-200 ${sizeClasses[size]}`} />
          <div className={`animate-spin rounded-full border-4 border-t-nbs-primary ${sizeClasses[size]} absolute top-0 left-0`} />
        </div>
        {message && (
          <p className="text-sm text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  )
}

/**
 * PageTransition 组件
 * 页面切换过渡效果
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {children}
    </div>
  )
}

/**
 * FadeIn 组件
 * 淡入动画组件
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 300,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
}) {
  return (
    <div
      className="animate-in fade-in"
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

/**
 * SlideIn 组件
 * 滑入动画组件
 */
export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
}: {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
}) {
  const directionClasses = {
    up: 'slide-in-from-bottom-4',
    down: 'slide-in-from-top-4',
    left: 'slide-in-from-left-4',
    right: 'slide-in-from-right-4',
  }

  return (
    <div
      className={`animate-in fade-in slide-in ${directionClasses[direction]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
