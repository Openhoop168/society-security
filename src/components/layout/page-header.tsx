/**
 * 页面头部组件
 */

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: Array<{
    title: string;
    href?: string;
  }>;
  actions?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* 面包屑导航 */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-4 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumb.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      index === breadcrumb.length - 1
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {item.title}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* 页面标题和描述 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600 sm:text-base">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>

      {/* 额外内容 */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}