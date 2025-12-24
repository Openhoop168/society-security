'use client'

/**
 * ResultFilters 组件
 * 搜索和筛选功能
 * 功能：员工姓名搜索、筛选条件
 */

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ResultFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearch: (term: string) => void
}

export function ResultFilters({
  searchTerm,
  onSearchChange,
  onSearch,
}: ResultFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  // 同步外部搜索词
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  // 处理回车搜索
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(localSearchTerm)
    }
  }

  // 清除搜索
  const handleClear = () => {
    setLocalSearchTerm('')
    onSearchChange('')
    onSearch('')
  }

  return (
    <div className="flex items-center gap-3">
      {/* 搜索输入框 */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索员工姓名..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
                   text-sm placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-nbs-primary focus:border-transparent
                   transition-shadow"
        />

        {/* 清除按钮 */}
        {localSearchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                     text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="清除搜索"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 搜索按钮 */}
      <button
        type="button"
        onClick={() => onSearch(localSearchTerm)}
        className="inline-flex items-center px-4 py-2 border border-transparent
                 rounded-lg shadow-sm text-sm font-medium text-white
                 bg-nbs-primary hover:bg-nbs-primary-dark
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nbs-primary
                 transition-colors"
      >
        <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
        搜索
      </button>
    </div>
  )
}
