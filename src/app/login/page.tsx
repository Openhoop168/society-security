'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card } from '@/components'
import { Button } from '@/components'

// 登录页面内容组件（使用 Suspense 包裹 useSearchParams）
function LoginPageContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    }>
      <LoginPageContentInner />
    </Suspense>
  )
}

// 内部组件使用 useSearchParams
function LoginPageContentInner() {
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

    // 处理注册成功后的重定向
    const registered = searchParams.get('registered')
    if (registered === 'true') {
      setMessage('注册成功！请登录您的账户')
      setMessageType('success')
    }
  }, [searchParams])

  // 处理登录成功
  const handleLoginSuccess = () => {
    // 获取返回 URL
    const returnUrl = searchParams.get('returnUrl')

    if (returnUrl) {
      router.push(decodeURIComponent(returnUrl))
    } else {
      router.push('/')
    }
  }

  // 处理登录错误
  const handleLoginError = (error: string) => {
    console.error('登录失败:', error)
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

        {/* 登录表单 */}
        <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />

        {/* 功能介绍 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">为什么选择我们？</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">精准计算</h4>
                <p className="text-sm text-gray-600">基于最新政策标准，确保计算结果准确无误</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">数据安全</h4>
                <p className="text-sm text-gray-600">采用银行级加密技术，保护您的数据隐私</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">批量处理</h4>
                <p className="text-sm text-gray-600">支持Excel批量导入，一键计算多人社保费用</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// 登录页面组件
export default function LoginPage() {
  return <LoginPageContent />
}