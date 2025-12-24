'use client'

/**
 * ResultsTable 组件
 * 显示计算结果的数据表格
 * 功能：排序、格式化显示、响应式设计
 */

import { useMemo } from 'react'
import { formatCurrency } from '@/utils/format'
import type { CalculationResult } from '@/types/database'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface ResultsTableProps {
  results: CalculationResult[]
  sortField: string
  sortOrder: 'asc' | 'desc'
  onSort: (field: string) => void
}

// 表格列定义
const COLUMNS = [
  { key: 'employee_name', label: '员工姓名', sortable: true },
  { key: 'calculation_year', label: '计算年度', sortable: true },
  { key: 'avg_salary', label: '月平均工资', sortable: true },
  { key: 'contribution_base', label: '缴费基数', sortable: true },
  { key: 'pension_company', label: '养老(公司)', sortable: true },
  { key: 'medical_company', label: '医疗(公司)', sortable: true },
  { key: 'unemployment_company', label: '失业(公司)', sortable: true },
  { key: 'injury_company', label: '工伤(公司)', sortable: true },
  { key: 'maternity_company', label: '生育(公司)', sortable: true },
  { key: 'provident_company', label: '公积金(公司)', sortable: true },
  { key: 'total_company', label: '公司合计', sortable: true },
  { key: 'total_employee', label: '个人合计', sortable: true },
  { key: 'total_all', label: '总计', sortable: true },
] as const

type ColumnKey = typeof COLUMNS[number]['key']

// 格式化单元格数据
const formatCellValue = (key: string, value: any): string => {
  if (value === null || value === undefined) return '-'

  // 金额字段格式化
  const moneyFields = [
    'avg_salary',
    'contribution_base',
    'pension_company',
    'medical_company',
    'unemployment_company',
    'injury_company',
    'maternity_company',
    'provident_company',
    'pension_employee',
    'medical_employee',
    'unemployment_employee',
    'provident_employee',
    'total_company',
    'total_employee',
    'total_all',
  ]

  if (moneyFields.includes(key)) {
    return formatCurrency(value ?? 0)
  }

  return String(value)
}

export function ResultsTable({ results, sortField, sortOrder, onSort }: ResultsTableProps) {
  // 排序图标
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null

    return sortOrder === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 inline ml-1" />
    )
  }

  // 桌面端表格
  const DesktopTable = () => (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}
                `}
                onClick={() => column.sortable && onSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && <SortIcon field={column.key} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result, index) => (
            <tr
              key={result.id}
              className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
            >
              {COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {formatCellValue(column.key, (result as any)[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // 平板端表格（显示较少列）
  const TabletTable = () => {
    const tabletColumns = COLUMNS.filter(col =>
      ['employee_name', 'calculation_year', 'avg_salary', 'total_company', 'total_all'].includes(col.key)
    )

    return (
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {tabletColumns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}
                  `}
                  onClick={() => column.sortable && onSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && <SortIcon field={column.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr
                key={result.id}
                className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
              >
                {tabletColumns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatCellValue(column.key, (result as any)[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // 移动端卡片视图
  const MobileView = () => (
    <div className="md:hidden space-y-4 p-4">
      {results.map((result, index) => (
        <div
          key={result.id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* 员工姓名和年度 */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{result.employee_name}</h3>
              <p className="text-sm text-gray-500">{result.calculation_year} 年</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">总计</p>
              <p className="text-lg font-bold text-nbs-primary">
                {formatCurrency(result.total_all ?? 0)}
              </p>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">月平均工资</span>
              <span className="font-medium">{formatCurrency(result.avg_salary ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">缴费基数</span>
              <span className="font-medium">{formatCurrency(result.contribution_base ?? 0)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">公司合计</span>
                <span className="font-medium text-blue-600">{formatCurrency(result.total_company ?? 0)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-600">个人合计</span>
                <span className="font-medium text-orange-600">{formatCurrency(result.total_employee ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      {/* 移动端视图 */}
      <MobileView />

      {/* 平板端表格 */}
      <TabletTable />

      {/* 桌面端表格 */}
      <DesktopTable />
    </div>
  )
}
