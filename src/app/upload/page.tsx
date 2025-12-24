'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { FileUploader } from '@/components/upload/FileUploader'
import { UploadProgress } from '@/components/upload/UploadProgress'
import { DataPreview } from '@/components/upload/DataPreview'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { Button } from '@/components'
import type { ParsedSalaryData, ParsedCityData } from '@/types/upload'

type UploadStep = 'upload' | 'preview' | 'uploading' | 'complete'

export default function UploadPage() {
  const router = useRouter()
  const [step, setStep] = useState<UploadStep>('upload')
  const [dataType, setDataType] = useState<'salary' | 'city'>('salary')
  const [parsedData, setParsedData] = useState<{
    salaries?: ParsedSalaryData[]
    cities?: ParsedCityData[]
  }>({})
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const [taskId, setTaskId] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    try {
      setUploadStatus('正在解析文件...')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('dataType', dataType)

      const response = await fetch('/api/upload/parse', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '文件解析失败')
      }

      const result = await response.json()

      if (dataType === 'salary') {
        setParsedData({ salaries: result.data })
      } else {
        setParsedData({ cities: result.data })
      }

      setStep('preview')
      setUploadStatus('')
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : '文件解析失败')
      setTimeout(() => setUploadStatus(''), 5000)
    }
  }

  const handleConfirmUpload = async () => {
    if (!parsedData.salaries && !parsedData.cities) return

    setStep('uploading')
    setUploadProgress(0)
    setUploadStatus('正在上传数据...')

    try {
      const response = await fetch('/api/upload/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataType,
          data: dataType === 'salary' ? parsedData.salaries : parsedData.cities,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '数据上传失败')
      }

      const result = await response.json()
      setTaskId(result.taskId)

      // 模拟进度更新
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setUploadStatus('上传完成！')
          setStep('complete')
        }
      }, 200)
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : '数据上传失败')
      setStep('preview')
    }
  }

  const handleCancel = () => {
    setParsedData({})
    setStep('upload')
    setUploadProgress(0)
    setUploadStatus('')
  }

  const handleBack = () => {
    router.push('/')
  }

  const getDataTypeLabel = () => {
    return dataType === 'salary' ? '员工工资数据' : '城市社保标准'
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-nbs-primary/5 via-blue-50 to-nbs-primary/10">
        {/* 顶部导航栏 */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-nbs-primary/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-nbs-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-nbs-primary to-nbs-secondary rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-nbs-primary">数据上传</h1>
                  <p className="text-xs text-neutral-500">批量导入社保标准和工资数据</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <AuthStatus />
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* 数据类型选择 */}
          {step === 'upload' && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-nbs-primary mb-4">选择数据类型</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDataType('salary')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      dataType === 'salary'
                        ? 'border-nbs-primary bg-nbs-primary/10'
                        : 'border-neutral-200 hover:border-nbs-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-nbs-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-nbs-primary">员工工资数据</h3>
                    <p className="text-sm text-neutral-500 mt-1">上传员工工资记录</p>
                  </button>

                  <button
                    onClick={() => setDataType('city')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      dataType === 'city'
                        ? 'border-nbs-primary bg-nbs-primary/10'
                        : 'border-neutral-200 hover:border-nbs-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-nbs-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-nbs-primary">城市社保标准</h3>
                    <p className="text-sm text-neutral-500 mt-1">上传城市缴费标准</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 文件上传区域 */}
          {step === 'upload' && (
            <FileUploader
              onFileSelect={handleFileSelect}
              dataType={dataType}
              status={uploadStatus}
            />
          )}

          {/* 数据预览 */}
          {step === 'preview' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-nbs-primary">
                    预览 {getDataTypeLabel()}
                  </h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      取消
                    </Button>
                    <Button onClick={handleConfirmUpload}>
                      确认上传
                    </Button>
                  </div>
                </div>
                <DataPreview
                  salaries={parsedData.salaries}
                  cities={parsedData.cities}
                  dataType={dataType}
                />
              </div>
            </div>
          )}

          {/* 上传进度 */}
          {step === 'uploading' && (
            <div className="max-w-3xl mx-auto">
              <UploadProgress
                progress={uploadProgress}
                status={uploadStatus}
                taskId={taskId || undefined}
              />
            </div>
          )}

          {/* 上传完成 */}
          {step === 'complete' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-nbs-primary mb-4">上传完成！</h2>
                <p className="text-neutral-600 mb-6">
                  {dataType === 'salary'
                    ? `成功导入 ${parsedData.salaries?.length || 0} 条工资数据`
                    : `成功导入 ${parsedData.cities?.length || 0} 条城市标准`}
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={handleCancel}>
                    继续上传
                  </Button>
                  <Button onClick={handleBack}>
                    返回首页
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
