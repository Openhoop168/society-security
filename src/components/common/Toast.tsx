/**
 * Toast 通知组件
 * 用于显示成功、错误、警告、信息提示
 */

'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, type, message, duration }

    setToasts(prev => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    return () => {
      setIsExiting(true)
    }
  }, [])

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    error: <ExclamationCircleIcon className="w-6 h-6 text-red-500" />,
    warning: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
  }

  const styles = {
    success: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    info: 'border-blue-500 bg-blue-50',
  }

  return (
    <div
      className={`
        pointer-events-auto transform transition-all duration-300
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        border-l-4 ${styles[toast.type]} rounded-lg shadow-lg p-4 flex items-start gap-3
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  )
}

// 便捷的 Hook 函数
export function useToastActions() {
  const { showToast, removeToast, clearAll } = useToast()

  return {
    success: (message: string, duration?: number) => showToast('success', message, duration),
    error: (message: string, duration?: number) => showToast('error', message, duration),
    warning: (message: string, duration?: number) => showToast('warning', message, duration),
    info: (message: string, duration?: number) => showToast('info', message, duration),
    remove: removeToast,
    clearAll,
  }
}
