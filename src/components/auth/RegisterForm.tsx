'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { authUtils } from '@/hooks/useAuth'
import { Button } from '@/components'
import { Input } from '@/components'
import { Card } from '@/components'
import { Checkbox } from '@/components'

interface RegisterFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signUp, isLoading } = useAuth()
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

    // 姓名验证
    if (!formData.name.trim()) {
      errors.name = '请输入姓名'
    } else if (formData.name.trim().length < 2) {
      errors.name = '姓名至少需要2个字符'
    }

    // 邮箱验证
    if (!formData.email.trim()) {
      errors.email = '请输入邮箱地址'
    } else if (!authUtils.validateEmail(formData.email)) {
      errors.email = '请输入有效的邮箱地址'
    }

    // 密码验证
    const passwordValidation = authUtils.validatePassword(formData.password)
    if (!formData.password) {
      errors.password = '请输入密码'
    } else if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors.join('，')
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致'
    }

    // 条款同意验证
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = '请同意用户协议和隐私政策'
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
      const { error } = await signUp(formData.email, formData.password, formData.name)

      if (error) {
        const errorMessage = authUtils.getErrorMessage(error)
        setFormErrors({
          submit: errorMessage || '注册失败，请重试'
        })
        onError?.(errorMessage || '注册失败')
      } else {
        console.log('注册成功')
        onSuccess?.()
      }
    } catch (error) {
      console.error('注册异常:', error)
      setFormErrors({
        submit: '注册过程中发生错误，请重试'
      })
      onError?.('注册过程中发生错误')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 跳转到登录页面
  const handleLoginClick = () => {
    router.push('/login')
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">创建账户</h1>
          <p className="text-sm text-gray-600 mt-2">
            注册账户以使用五险一金计算器
          </p>
        </div>

        {/* 注册表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 姓名输入 */}
          <div>
            <Input
              type="text"
              label="姓名"
              placeholder="请输入您的姓名"
              value={formData.name}
              onChange={handleInputChangeEvent('name')}
              error={formErrors.name}
              disabled={isLoading}
              autoComplete="name"
              required
            />
          </div>

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
              placeholder="请输入密码（至少8位，包含字母和数字）"
              value={formData.password}
              onChange={handleInputChangeEvent('password')}
              error={formErrors.password}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          {/* 确认密码输入 */}
          <div>
            <Input
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onChange={handleInputChangeEvent('confirmPassword')}
              error={formErrors.confirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          {/* 用户协议 */}
          <div>
            <Checkbox
              checked={formData.agreeToTerms}
              onChange={(checked) => handleInputChange('agreeToTerms', checked)}
              disabled={isLoading}
            />
            <label className="ml-2 text-sm text-gray-600">
              我已阅读并同意{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                用户协议
              </a>
              {' '}和{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                隐私政策
              </a>
            </label>
            {formErrors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600">{formErrors.agreeToTerms}</p>
            )}
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
            {isSubmitting || isLoading ? '注册中...' : '创建账户'}
          </Button>
        </form>

        {/* 登录链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            已有账户？{' '}
            <button
              onClick={handleLoginClick}
              className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
            >
              立即登录
            </button>
          </p>
        </div>
      </div>
    </Card>
  )
}