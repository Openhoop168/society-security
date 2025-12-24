'use client'

import { useMemo } from 'react'
import type { ParsedSalaryData, ParsedCityData } from '@/types/upload'

interface DataPreviewProps {
  salaries?: ParsedSalaryData[]
  cities?: ParsedCityData[]
  dataType: 'salary' | 'city'
}

export function DataPreview({ salaries, cities, dataType }: DataPreviewProps) {
  // 限制显示前 10 条数据
  const displaySalaries = useMemo(() => salaries?.slice(0, 10) || [], [salaries])
  const displayCities = useMemo(() => cities?.slice(0, 10) || [], [cities])
  const totalCount = dataType === 'salary' ? (salaries?.length || 0) : (cities?.length || 0)
  const displayCount = dataType === 'salary' ? displaySalaries.length : displayCities.length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const formatDate = (yearMonth: number) => {
    const year = Math.floor(yearMonth / 100)
    const month = yearMonth % 100
    return `${year}年${month.toString().padStart(2, '0')}月`
  }

  return (
    <div>
      {/* 数据统计 */}
      <div className="mb-4 p-4 bg-nbs-primary/5 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">共解析到</p>
            <p className="text-2xl font-bold text-nbs-primary">{totalCount} 条数据</p>
          </div>
          {totalCount > displayCount && (
            <div className="text-sm text-neutral-500">
              仅显示前 {displayCount} 条预览
            </div>
          )}
        </div>
      </div>

      {/* 工资数据表格 */}
      {dataType === 'salary' && displaySalaries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-semibold text-nbs-primary">行号</th>
                <th className="text-left py-3 px-4 font-semibold text-nbs-primary">员工工号</th>
                <th className="text-left py-3 px-4 font-semibold text-nbs-primary">员工姓名</th>
                <th className="text-left py-3 px-4 font-semibold text-nbs-primary">年月份</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">工资金额</th>
                <th className="text-left py-3 px-4 font-semibold text-nbs-primary">部门</th>
                <th className="text-left py-3 px-4 font-semibold text-nbs-primary">职位</th>
              </tr>
            </thead>
            <tbody>
              {displaySalaries.map((salary, index) => (
                <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-4 text-neutral-500">{salary.row_number}</td>
                  <td className="py-3 px-4 font-medium">{salary.employee_id}</td>
                  <td className="py-3 px-4">{salary.employee_name}</td>
                  <td className="py-3 px-4">{formatDate(salary.year_month)}</td>
                  <td className="py-3 px-4 text-right font-medium text-nbs-primary">
                    {formatCurrency(salary.salary_amount)}
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{salary.department || '-'}</td>
                  <td className="py-3 px-4 text-neutral-600">{salary.position || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 城市数据表格 */}
      {dataType === 'city' && displayCities.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-semibold text-nbs-primary">行号</th>
                <th className="text-left py-3 px-4 font-semibold text-nbs-primary">城市名称</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">年份</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">基数下限</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">基数上限</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">养老</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">医疗</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">失业</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">工伤</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">生育</th>
                <th className="text-right py-3 px-4 font-semibold text-nbs-primary">公积金</th>
              </tr>
            </thead>
            <tbody>
              {displayCities.map((city, index) => (
                <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-4 text-neutral-500">{city.row_number}</td>
                  <td className="py-3 px-4 font-medium">{city.city_name}</td>
                  <td className="py-3 px-4 text-right">{city.year}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(city.base_min)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(city.base_max)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-xs">
                      <div>公司: {formatPercent(city.pension_company)}</div>
                      <div>个人: {formatPercent(city.pension_employee)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-xs">
                      <div>公司: {formatPercent(city.medical_company)}</div>
                      <div>个人: {formatPercent(city.medical_employee)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-xs">
                      <div>公司: {formatPercent(city.unemployment_company)}</div>
                      <div>个人: {formatPercent(city.unemployment_employee)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">{formatPercent(city.injury_company)}</td>
                  <td className="py-3 px-4 text-right">{formatPercent(city.maternity_company)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-xs">
                      <div>公司: {formatPercent(city.provident_company)}</div>
                      <div>个人: {formatPercent(city.provident_employee)}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 数据验证提示 */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start">
        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-blue-700">
          请仔细核对预览数据，确认无误后点击"确认上传"按钮导入数据
        </p>
      </div>
    </div>
  )
}
