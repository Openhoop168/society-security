/**
 * 空状态组件
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  image?: ReactNode;
  title: string;
  description?: string;
  action?: {
    text: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'py-6',
  md: 'py-12',
  lg: 'py-16',
};

export default function EmptyState({
  image,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', sizeClasses[size], className)}>
      {image && (
        <div className="mb-4">
          {image}
        </div>
      )}

      {/* 默认空状态图标 */}
      {!image && (
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

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-gray-500 mb-6 max-w-sm">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {action.icon && (
            <span className="mr-2">{action.icon}</span>
          )}
          {action.text}
        </button>
      )}
    </div>
  );
}