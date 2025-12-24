/**
 * ResponsiveContainer 组件
 * 响应式容器组件
 */

'use client'

import React from 'react'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-8 lg:px-12',
  }

  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Grid 系统
 */
export interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 4,
  className = '',
}: ResponsiveGridProps) {
  const gridClasses = [
    'grid',
    cols.sm && `grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gap}`,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={`${gridClasses} ${className}`}>{children}</div>
}

/**
 * 隐藏/显示组件
 */
export interface HiddenProps {
  children: React.ReactNode
  below?: 'sm' | 'md' | 'lg' | 'xl'
  above?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Hidden({ children, below, above }: HiddenProps) {
  let className = ''

  if (below) {
    className = `hidden ${below}:block`
  }

  if (above) {
    className = `block ${above}:hidden`
  }

  return <div className={className}>{children}</div>
}

/**
 * Show 组件
 */
export interface ShowProps {
  children: React.ReactNode
  above?: 'sm' | 'md' | 'lg' | 'xl'
  below?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Show({ children, above, below }: ShowProps) {
  let className = ''

  if (above) {
    className = `hidden ${above}:block`
  }

  if (below) {
    className = `block ${below}:hidden`
  }

  return <div className={className}>{children}</div>
}
