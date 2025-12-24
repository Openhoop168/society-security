/**
 * 通用表格组件
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: any, index: number) => ReactNode;
  className?: string;
}

export interface TableProps {
  columns: TableColumn[];
  dataSource: any[];
  rowKey?: string | ((record: any) => string);
  loading?: boolean;
  empty?: string;
  className?: string;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange?: (page: number, pageSize: number) => void;
  };
}

export default function Table({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  empty = '暂无数据',
  className,
  pagination,
}: TableProps) {
  const getRowKey = (record: any, index: number) => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  const getCellClassName = (column: TableColumn) => {
    const alignClass = column.align === 'center' ? 'text-center' :
                       column.align === 'right' ? 'text-right' : 'text-left';
    return cn('px-6 py-4 whitespace-nowrap text-sm', alignClass, column.className);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dataSource || dataSource.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        {empty}
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.align === 'center' ? 'text-center' :
                    column.align === 'right' ? 'text-right' : 'text-left',
                    column.className
                  )}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataSource.map((record, index) => (
              <tr key={getRowKey(record, index)} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className={getCellClassName(column)}>
                    {column.render
                      ? column.render(record[column.dataIndex], record, index)
                      : record[column.dataIndex]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => pagination.onChange?.(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              onClick={() => pagination.onChange?.(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current * pagination.pageSize >= pagination.total}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示第{' '}
                <span className="font-medium">
                  {(pagination.current - 1) * pagination.pageSize + 1}
                </span>{' '}
                到{' '}
                <span className="font-medium">
                  {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                </span>{' '}
                条，共{' '}
                <span className="font-medium">{pagination.total}</span> 条记录
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => pagination.onChange?.(pagination.current - 1, pagination.pageSize)}
                  disabled={pagination.current <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {pagination.current}
                </span>
                <button
                  onClick={() => pagination.onChange?.(pagination.current + 1, pagination.pageSize)}
                  disabled={pagination.current * pagination.pageSize >= pagination.total}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}