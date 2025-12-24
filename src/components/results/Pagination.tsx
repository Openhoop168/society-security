'use client'

/**
 * Pagination 组件
 * 分页功能
 * 功能：页码导航、每页条数设置、跳转到指定页
 */

import { useState, useCallback } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

// 每页条数选项
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [jumpToPage, setJumpToPage] = useState('')
  const [isJumping, setIsJumping] = useState(false)

  // 计算显示的页码范围
  const getPageRange = useCallback(() => {
    const range = 5 // 显示5个页码
    const halfRange = Math.floor(range / 2)

    let startPage = Math.max(1, currentPage - halfRange)
    let endPage = Math.min(totalPages, startPage + range - 1)

    // 调整起始页，确保显示足够的页码
    if (endPage - startPage < range - 1) {
      startPage = Math.max(1, endPage - range + 1)
    }

    return { startPage, endPage }
  }, [currentPage, totalPages])

  const { startPage, endPage } = getPageRange()

  // 生成页码数组
  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // 处理跳转页码
  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpToPage('')
      setIsJumping(false)
    } else {
      alert(`请输入 1 到 ${totalPages} 之间的页码`)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* 左侧：每页条数和总数 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* 每页条数 */}
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-700">
              每页显示:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="block w-20 pl-3 pr-8 py-1.5 text-base border-gray-300
                       focus:outline-none focus:ring-nbs-primary focus:border-nbs-primary
                       sm:text-sm rounded-md border"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">条</span>
          </div>

          {/* 总数 */}
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-nbs-primary">{totalItems}</span> 条记录
          </div>
        </div>

        {/* 右侧：分页导航 */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* 页码信息 */}
          <div className="text-sm text-gray-600 hidden sm:block">
            第 <span className="font-semibold">{currentPage}</span> / {totalPages} 页
          </div>

          {/* 分页按钮 */}
          <div className="flex items-center gap-1">
            {/* 第一页 */}
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-50 transition-colors
                       text-gray-700"
              aria-label="第一页"
            >
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            </button>

            {/* 上一页 */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-50 transition-colors
                       text-gray-700"
              aria-label="上一页"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* 页码按钮 */}
            {startPage > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300
                           hover:bg-gray-50 transition-colors text-gray-700"
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}

            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[2.5rem] px-3 py-1.5 text-sm rounded-md border
                  transition-colors
                  ${
                    page === currentPage
                      ? 'bg-nbs-primary text-white border-nbs-primary'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300
                           hover:bg-gray-50 transition-colors text-gray-700"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* 下一页 */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-50 transition-colors
                       text-gray-700"
              aria-label="下一页"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            {/* 最后一页 */}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-50 transition-colors
                       text-gray-700"
              aria-label="最后一页"
            >
              <ChevronDoubleRightIcon className="h-4 w-4" />
            </button>
          </div>

          {/* 跳转到指定页 */}
          {totalPages > 10 && (
            <div className="flex items-center gap-2 ml-2">
              {isJumping ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleJumpToPage()
                      }
                    }}
                    placeholder="页码"
                    className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md
                             focus:outline-none focus:ring-nbs-primary focus:border-nbs-primary"
                    autoFocus
                  />
                  <button
                    onClick={handleJumpToPage}
                    className="px-3 py-1.5 text-sm bg-nbs-primary text-white rounded-md
                             hover:bg-nbs-primary-dark transition-colors"
                  >
                    跳转
                  </button>
                  <button
                    onClick={() => {
                      setIsJumping(false)
                      setJumpToPage('')
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md
                             hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsJumping(true)}
                  className="text-sm text-nbs-primary hover:text-nbs-primary-dark
                           underline underline-offset-2"
                >
                  跳转
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
