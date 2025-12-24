'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Card } from '@/components'
import { Button } from '@/components'

// 注册页面内容组件（使用 Suspense 包裹 useSearchParams）
function RegisterPageContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    }>
      <RegisterPageContentInner />
    </Suspense>
  )
}

// 内部组件使用 useSearchParams
function RegisterPageContentInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  useEffect(() => {
    // 处理 URL 参数中的消息
    const messageParam = searchParams.get('message')
    const typeParam = searchParams.get('type') as 'success' | 'error' | 'info' || 'info'

    if (messageParam) {
      setMessage(decodeURIComponent(messageParam))
      setMessageType(typeParam)
    }
  }, [searchParams])

  // 处理注册成功
  const handleRegisterSuccess = () => {
    // 重定向到登录页面，显示注册成功消息
    router.push('/login?registered=true')
  }

  // 处理注册错误
  const handleRegisterError = (error: string) => {
    console.error('注册失败:', error)
  }

  // 处理消息关闭
  const handleMessageClose = () => {
    setMessage('')
    // 清除 URL 参数
    const newUrl = new URL(window.location.pathname, window.location.origin)
    window.history.replaceState({}, '', newUrl.toString())
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">五险一金计算器</h2>
          <p className="mt-2 text-sm text-gray-600">
            专业的社保公积金计算工具
          </p>
        </div>

        {/* 消息提示 */}
        {message && (
          <Card className={`mb-6 p-4 ${
            messageType === 'success' ? 'bg-green-50 border-green-200' :
            messageType === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {messageType === 'success' && (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {messageType === 'error' && (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {messageType === 'info' && (
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm ${
                  messageType === 'success' ? 'text-green-800' :
                  messageType === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMessageClose}
                    className={`
                      ${messageType === 'success' ? 'text-green-500 hover:bg-green-100' :
                        messageType === 'error' ? 'text-red-500 hover:bg-red-100' :
                        'text-blue-500 hover:bg-blue-100'
                      }
                    `}
                  >
                    <span className="sr-only">关闭</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 注册表单 */}
        <RegisterForm onSuccess={handleRegisterSuccess} onError={handleRegisterError} />

        {/* 功能特性 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">注册后您可以享受：</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">实时计算</h4>
                <p className="text-sm text-gray-600">实时更新最新社保政策，计算结果及时准确</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">数据存储</h4>
                <p className="text-sm text-gray-600">云端安全存储，随时随地查看历史计算记录</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">数据分析</h4>
                <p className="text-sm text-gray-600">智能数据分析，帮助您优化企业人力成本</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 服务条款说明 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            注册即表示您同意我们的{' '}
            <a
              href="/terms"
              className="text-blue-600 hover:text-blue-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              服务条款
            </a>
            {' '}和{' '}
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              隐私政策
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// 注册页面组件
export default function RegisterPage() {
  return <RegisterPageContent />
}