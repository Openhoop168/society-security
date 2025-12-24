/**
 * 空状态组件 V2
 * 增强版，支持更多图标和操作
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  DocumentIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export interface EmptyStatePropsV2 {
  icon?: 'document' | 'error' | 'success'
  image?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const iconMap = {
  document: DocumentIcon,
  error: ExclamationCircleIcon,
  success: ExclamationCircleIcon,
}

const sizeClasses = {
  sm: 'py-6',
  md: 'py-12',
  lg: 'py-16',
}

export default function EmptyStateV2({
  icon,
  image,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStatePropsV2) {
  const IconComponent = icon ? iconMap[icon] : null

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size],
        className
      )}
    >
      {/* 图标 */}
      {image && <div className="mb-4">{image}</div>}
      {!image && IconComponent && (
        <div className="mb-4">
          <IconComponent className="mx-auto h-16 w-16 text-gray-400" />
        </div>
      )}
      {!image && !icon && (
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}

      {/* 标题 */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      {/* 描述 */}
      {description && <p className="text-gray-500 mb-6 max-w-sm">{description}</p>}

      {/* 操作按钮 */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-nbs-primary hover:bg-nbs-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nbs-primary"
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </button>
      )}
    </div>
  )
}
