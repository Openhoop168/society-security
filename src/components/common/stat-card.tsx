/**
 * 统计卡片组件
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: 'bg-blue-100 text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: 'bg-green-100 text-green-600',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    icon: 'bg-red-100 text-red-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    icon: 'bg-yellow-100 text-yellow-600',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    icon: 'bg-purple-100 text-purple-600',
  },
};

export default function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  color = 'blue',
  className,
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-6 shadow-sm', className)}>
      <div className="flex items-center">
        {icon && (
          <div className={cn('flex-shrink-0 rounded-lg p-3', colors.icon)}>
            {icon}
          </div>
        )}
        <div className={cn('ml-4 flex-1', icon ? '' : 'ml-0')}>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className={cn('text-2xl font-semibold', colors.text)}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <div className="ml-2 flex items-center text-sm">
                {trend.direction === 'up' ? (
                  <svg
                    className="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                )}
                <span
                  className={cn(
                    'ml-1 font-medium',
                    trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}