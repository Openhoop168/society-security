'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { authUtils } from '@/hooks/useAuth'
import { Button } from '@/components'
import { Input } from '@/components'
import { Card } from '@/components'
import { Checkbox } from '@/components'

interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn, isLoading } = useAuth()
  const router = useRouter()

  // 处理输入变化
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // 清除相关字段的错误
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // 处理 Input 组件的 onChange 事件
  const handleInputChangeEvent = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(field, e.target.value)
  }

  // 验证表单
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email.trim()) {
      errors.email = '请输入邮箱地址'
    } else if (!authUtils.validateEmail(formData.email)) {
      errors.email = '请输入有效的邮箱地址'
    }

    if (!formData.password) {
      errors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      errors.password = '密码至少需要6个字符'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        const errorMessage = authUtils.getErrorMessage(error)
        setFormErrors({
          submit: errorMessage || '登录失败，请重试'
        })
        onError?.(errorMessage || '登录失败')
      } else {
        console.log('登录成功')
        onSuccess?.()
      }
    } catch (error) {
      console.error('登录异常:', error)
      setFormErrors({
        submit: '登录过程中发生错误，请重试'
      })
      onError?.('登录过程中发生错误')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 跳转到注册页面
  const handleRegisterClick = () => {
    router.push('/register')
  }

  // 跳转到忘记密码页面
  const handleForgotPasswordClick = () => {
    router.push('/forgot-password')
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">欢迎回来</h1>
          <p className="text-sm text-gray-600 mt-2">
            登录您的账户以继续使用五险一金计算器
          </p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 邮箱输入 */}
          <div>
            <Input
              type="email"
              label="邮箱地址"
              placeholder="请输入您的邮箱地址"
              value={formData.email}
              onChange={handleInputChangeEvent('email')}
              error={formErrors.email}
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          {/* 密码输入 */}
          <div>
            <Input
              type="password"
              label="密码"
              placeholder="请输入您的密码"
              value={formData.password}
              onChange={handleInputChangeEvent('password')}
              error={formErrors.password}
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          {/* 记住我和忘记密码 */}
          <div className="flex items-center justify-between">
            <Checkbox
              checked={formData.rememberMe}
              onChange={(checked) => handleInputChange('rememberMe', checked)}
              label="记住我"
            />

            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              忘记密码？
            </button>
          </div>

          {/* 提交错误 */}
          {formErrors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{formErrors.submit}</p>
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting || isLoading}
            loading={isSubmitting || isLoading}
            variant="primary"
          >
            {isSubmitting || isLoading ? '登录中...' : '登录'}
          </Button>
        </form>

        {/* 注册链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            还没有账户？{' '}
            <button
              onClick={handleRegisterClick}
              className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
            >
              立即注册
            </button>
          </p>
        </div>
      </div>
    </Card>
  )
}