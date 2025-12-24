'use client'

/**
 * 结果展示页面
 * 显示五险一金计算结果
 * 功能：分页、搜索、排序、导出
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import PageHeader from '@/components/layout/page-header'
import LoadingSpinner from '@/components/layout/loading-spinner'
import EmptyStateV2 from '@/components/common/empty-state-v2'
import Button from '@/components/ui/Button'
import { ResultsTable } from '@/components/results/ResultsTable'
import { ResultFilters } from '@/components/results/ResultFilters'
import { Pagination } from '@/components/results/Pagination'
import { getResultsPaginated } from '@/lib/database'
import type { CalculationResult } from '@/types/database'
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import * as XLSX from 'xlsx'

// 分页状态类型
interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 排序状态类型
interface SortState {
  field: string
  order: 'asc' | 'desc'
}

function ResultsPageContent() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  // 数据状态
  const [results, setResults] = useState<CalculationResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 分页状态
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  // 搜索和排序状态
  const [searchTerm, setSearchTerm] = useState('')
  const [sort, setSort] = useState<SortState>({
    field: 'created_at',
    order: 'desc',
  })

  // 获取结果数据
  const fetchResults = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const response = await getResultsPaginated(
        user.id,
        pagination.page,
        pagination.limit,
        searchTerm || undefined,
        sort.field,
        sort.order
      )

      setResults(response.data)
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      })
    } catch (err) {
      console.error('获取结果失败:', err)
      setError(err instanceof Error ? err.message : '获取结果失败')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // 初始化加载
  useEffect(() => {
    if (user) {
      fetchResults()
    }
  }, [user, pagination.page, pagination.limit, searchTerm, sort.field, sort.order])

  // 处理搜索
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setPagination((prev) => ({ ...prev, page: 1 })) // 重置到第一页
  }

  // 处理排序
  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }))
  }

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  // 处理每页条数变化
  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }))
  }

  // 导出 Excel
  const handleExportExcel = async () => {
    if (!user || results.length === 0) return

    try {
      // 准备导出数据
      const exportData = results.map((result) => ({
        '员工姓名': result.employee_name,
        '计算年度': result.calculation_year,
        '年度月平均工资': result.avg_salary,
        '缴费基数': result.contribution_base,
        '养老保险(公司)': result.pension_company,
        '医疗保险(公司)': result.medical_company,
        '失业保险(公司)': result.unemployment_company,
        '工伤保险(公司)': result.injury_company,
        '生育保险(公司)': result.maternity_company,
        '公积金(公司)': result.provident_company,
        '公司总缴纳': result.total_company,
        '养老保险(个人)': result.pension_employee,
        '医疗保险(个人)': result.medical_employee,
        '失业保险(个人)': result.unemployment_employee,
        '公积金(个人)': result.provident_employee,
        '个人总缴纳': result.total_employee,
        '合计': result.total_all,
      }))

      // 创建工作簿
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // 设置列宽
      worksheet['!cols'] = [
        { wch: 12 }, // 员工姓名
        { wch: 12 }, // 计算年度
        { wch: 15 }, // 年度月平均工资
        { wch: 12 }, // 缴费基数
        { wch: 15 }, // 养老保险(公司)
        { wch: 15 }, // 医疗保险(公司)
        { wch: 15 }, // 失业保险(公司)
        { wch: 15 }, // 工伤保险(公司)
        { wch: 15 }, // 生育保险(公司)
        { wch: 15 }, // 公积金(公司)
        { wch: 12 }, // 公司总缴纳
        { wch: 15 }, // 养老保险(个人)
        { wch: 15 }, // 医疗保险(个人)
        { wch: 15 }, // 失业保险(个人)
        { wch: 15 }, // 公积金(个人)
        { wch: 12 }, // 个人总缴纳
        { wch: 12 }, // 合计
      ]

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '计算结果')

      // 生成文件名
      const fileName = `五险一金计算结果_${new Date().getTime()}.xlsx`

      // 下载文件
      XLSX.writeFile(workbook, fileName)
    } catch (err) {
      console.error('导出失败:', err)
      alert('导出失败，请重试')
    }
  }

  // 加载状态
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-nbs-primary/10">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-nbs-primary/10">
      {/* 页面头部 */}
      <PageHeader
        title="计算结果"
        description="查看和管理五险一金计算结果"
        breadcrumb={[
          { title: '首页', href: '/' },
          { title: '计算结果', href: '/results' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 操作栏 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* 搜索和筛选 */}
            <div className="flex-1">
              <ResultFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchResults}
                disabled={loading}
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                刷新
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleExportExcel}
                disabled={results.length === 0}
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                导出 Excel
              </Button>
            </div>
          </div>

          {/* 统计信息 */}
          {pagination.total > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  共 <span className="font-semibold text-nbs-primary">{pagination.total}</span> 条记录
                </div>
                <div>
                  第 <span className="font-semibold">{pagination.page}</span> / {pagination.totalPages} 页
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 数据表格 */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <EmptyStateV2
              icon="error"
              title="加载失败"
              description={error}
              action={{
                label: '重试',
                onClick: fetchResults,
              }}
            />
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <EmptyStateV2
              icon="document"
              title="暂无计算结果"
              description={
                searchTerm
                  ? '未找到匹配的计算结果'
                  : '请先上传工资数据并执行计算'
              }
              action={
                searchTerm
                  ? {
                      label: '清除搜索',
                      onClick: () => handleSearch(''),
                    }
                  : {
                      label: '前往上传',
                      onClick: () => router.push('/upload'),
                    }
              }
            />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <ResultsTable
                results={results}
                sortField={sort.field}
                sortOrder={sort.order}
                onSort={handleSort}
              />
            </div>

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.limit}
                  totalItems={pagination.total}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <ResultsPageContent />
    </ProtectedRoute>
  )
}
