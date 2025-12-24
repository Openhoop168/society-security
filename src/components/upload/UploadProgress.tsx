'use client'

import { useEffect, useState } from 'react'
import ProgressBar from '@/components/common/progress-bar'

interface UploadProgressProps {
  progress: number
  status: string
  taskId?: string
}

export function UploadProgress({ progress, status, taskId }: UploadProgressProps) {
  const [details, setDetails] = useState<{
    totalRows?: number
    processedRows?: number
    successRows?: number
    failedRows?: number
  }>({})

  useEffect(() => {
    if (taskId) {
      // 轮询获取任务进度
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/upload/progress/${taskId}`)
          if (response.ok) {
            const data = await response.json()
            setDetails(data)
          }
        } catch (error) {
          console.error('获取进度失败:', error)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [taskId])

  const getStatusIcon = () => {
    if (progress >= 100) {
      return (
        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return (
      <svg className="w-16 h-16 text-nbs-primary animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
      {/* 状态图标 */}
      <div className="text-center mb-8">
        {getStatusIcon()}
        <h2 className="text-2xl font-bold text-nbs-primary mt-4">
          {progress >= 100 ? '上传完成！' : '正在上传数据...'}
        </h2>
        <p className="text-neutral-600 mt-2">{status}</p>
      </div>

      {/* 进度条 */}
      <div className="mb-8">
        <ProgressBar value={progress} />
        <div className="flex justify-between text-sm text-neutral-500 mt-2">
          <span>进度</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
      </div>

      {/* 详细信息 */}
      {taskId && (details.totalRows || details.processedRows) && (
        <div className="bg-nbs-primary/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-nbs-primary mb-4">上传详情</h3>
          <div className="grid grid-cols-2 gap-4">
            {details.totalRows && (
              <div>
                <p className="text-sm text-neutral-500">总行数</p>
                <p className="text-2xl font-bold text-nbs-primary">{details.totalRows}</p>
              </div>
            )}
            {details.processedRows && (
              <div>
                <p className="text-sm text-neutral-500">已处理</p>
                <p className="text-2xl font-bold text-nbs-primary">{details.processedRows}</p>
              </div>
            )}
            {details.successRows !== undefined && (
              <div>
                <p className="text-sm text-neutral-500">成功</p>
                <p className="text-2xl font-bold text-green-500">{details.successRows}</p>
              </div>
            )}
            {details.failedRows !== undefined && (
              <div>
                <p className="text-sm text-neutral-500">失败</p>
                <p className="text-2xl font-bold text-red-500">{details.failedRows}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 提示信息 */}
      {progress < 100 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start">
          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-700">
            上传过程中请勿关闭页面，完成后将自动跳转
          </p>
        </div>
      )}
    </div>
  )
}
