/**
 * MobileNav 组件
 * 移动端导航栏
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bars3Icon, XMarkIcon, HomeIcon, DocumentArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components'
import { AuthStatus } from '@/components/auth/AuthStatus'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { href: '/', label: '首页', icon: HomeIcon },
    { href: '/upload', label: '数据上传', icon: DocumentArrowUpIcon },
    { href: '/results', label: '结果查询', icon: DocumentTextIcon },
  ]

  const handleNavigate = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* 移动端头部 */}
      <nav className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-nbs-primary to-nbs-secondary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 7h.01M12 21a9 9 0 11-9-9c0 1.65.5 3.2 1.35 4.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-nbs-primary">五险一金计算器</h1>
                <p className="text-xs text-gray-500">专业、准确、高效</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <AuthStatus />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="切换菜单"
              >
                {isOpen ? (
                  <XMarkIcon className="w-6 h-6 text-gray-700" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigate(item.href)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-nbs-primary/10 transition-colors text-left"
                  >
                    <Icon className="w-5 h-5 text-nbs-primary" />
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
