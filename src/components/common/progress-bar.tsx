/**
 * 进度条组件
 */

import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showText?: boolean;
  textFormat?: 'percentage' | 'fraction' | 'custom';
  customText?: string;
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const colorClasses = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  red: 'bg-red-600',
  yellow: 'bg-yellow-600',
  purple: 'bg-purple-600',
};

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'blue',
  showText = false,
  textFormat = 'percentage',
  customText,
  className,
  animate = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getText = () => {
    switch (textFormat) {
      case 'percentage':
        return `${Math.round(percentage)}%`;
      case 'fraction':
        return `${value}/${max}`;
      case 'custom':
        return customText || '';
      default:
        return `${Math.round(percentage)}%`;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {showText && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{getText()}</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorClasses[color],
            animate && 'transition-all duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}