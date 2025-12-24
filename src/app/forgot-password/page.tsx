'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { authUtils } from '@/hooks/useAuth'
import { Button } from '@/components'
import { Input } from '@/components'
import { Card } from '@/components'

// 忘记密码页面内容组件
function ForgotPasswordPageContent() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { resetPassword, isLoading } = useAuth()
  const router = useRouter()

  // 处理输入变化
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError('')
  }

  // 验证邮箱
  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('请输入邮箱地址')
      return false
    }

    if (!authUtils.validateEmail(email)) {
      setError('请输入有效的邮箱地址')
      return false
    }

    return true
  }

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const { error } = await resetPassword(email)

      if (error) {
        const errorMessage = authUtils.getErrorMessage(error)
        setError(errorMessage || '发送重置邮件失败，请重试')
      } else {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('重置密码异常:', error)
      setError('重置密码过程中发生错误，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 重新尝试
  const handleRetry = () => {
    setEmail('')
    setError('')
    setIsSubmitted(false)
  }

  // 返回登录页面
  const handleBackToLogin = () => {
    router.push('/login')
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
          <h2 className="text-3xl font-bold text-gray-900">重置密码</h2>
          <p className="mt-2 text-sm text-gray-600">
            我们将向您的邮箱发送重置密码的链接
          </p>
        </div>

        {!isSubmitted ? (
          /* 重置密码表单 */
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 邮箱输入 */}
              <div>
                <Input
                  type="email"
                  label="邮箱地址"
                  placeholder="请输入您的邮箱地址"
                  value={email}
                  onChange={handleEmailChange}
                  error={error}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                />
              </div>

              {/* 提交按钮 */}
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
                variant="primary"
              >
                {isSubmitting || isLoading ? '发送中...' : '发送重置链接'}
              </Button>

              {/* 返回登录 */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  返回登录页面
                </button>
              </div>
            </form>
          </Card>
        ) : (
          /* 发送成功页面 */
          <Card className="p-6">
            <div className="text-center space-y-4">
              {/* 成功图标 */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              {/* 成功消息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">邮件已发送</h3>
                <p className="text-sm text-gray-600 mt-1">
                  我们已向 <span className="font-medium text-gray-900">{email}</span> 发送了重置密码的链接
                </p>
              </div>

              {/* 提示信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
                <p className="text-blue-800">
                  请检查您的邮箱（包括垃圾邮件文件夹），点击邮件中的链接来重置密码。
                  如果您没有收到邮件，请重新发送。
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleRetry}
                  disabled={isSubmitting}
                >
                  重新发送
                </Button>

                <Button
                  variant="ghost"
                  fullWidth
                  onClick={handleBackToLogin}
                >
                  返回登录页面
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* 帮助信息 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">需要帮助？</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">未收到邮件？</h4>
                <p className="text-gray-600">请检查垃圾邮件文件夹，或确认输入的邮箱地址是否正确</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">链接有效期</h4>
                <p className="text-gray-600">重置链接有效期为24小时，请及时使用</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// 忘记密码页面组件
export default function ForgotPasswordPage() {
  return <ForgotPasswordPageContent />
}