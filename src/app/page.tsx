'use client'

/**
 * 主页组件 - 优化版本
 * 改进：移动端适配、加载状态、用户体验优化
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components'
import { Button } from '@/components'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoadingSpinner } from '@/components'
import { MobileNav } from '@/components/layout/MobileNav'
import { SuspenseLoader } from '@/components/common/SuspenseLoader'

// 桌面端导航栏组件
function DesktopNav() {
  return (
    <nav className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-nbs-primary to-nbs-secondary rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 7h.01M12 21a9 9 0 11-9-9c0 1.65.5 3.2 1.35 4.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-nbs-primary">五险一金计算器</h1>
              <p className="text-xs text-neutral-500">专业、准确、高效</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <AuthStatus />
          </div>
        </div>
      </div>
    </nav>
  )
}

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // 页面加载完成后触发动画
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // 优化的导航处理
  const handleNavigation = useCallback((href: string) => {
    // 平滑滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-nbs-primary/5 via-blue-50 to-nbs-primary/10">
        {/* 响应式导航 */}
        <DesktopNav />
        <MobileNav />

        <div className="container mx-auto px-4 py-8 lg:py-12">
          {/* 欢迎区域 - 添加淡入动画 */}
          <div className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="inline-block mb-4 lg:mb-6 px-4 py-2 bg-nbs-primary/10 rounded-full">
              <span className="text-sm font-semibold text-nbs-primary">
                🎉 智能计算系统
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-nbs-primary mb-4 lg:mb-6 bg-gradient-to-r from-nbs-primary to-nbs-secondary bg-clip-text text-transparent">
              五险一金计算器
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-6 lg:mb-8 px-4">
              基于城市社保标准和员工工资数据，精确计算公司应缴纳的五险一金费用
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-sm text-neutral-500 px-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>精确计算</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>批量处理</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>数据安全</span>
              </div>
            </div>
          </div>

          {/* 功能卡片区域 - 响应式布局 */}
          <div className={`grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* 数据上传卡片 */}
            <Card hover className="h-full group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-nbs-primary/50">
              <CardHeader>
                <div className="flex items-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-nbs-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <CardTitle className="text-nbs-primary text-lg lg:text-xl">
                      数据上传
                    </CardTitle>
                    <p className="text-sm text-neutral-500 mt-1">
                      批量导入社保标准和工资数据
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600 text-sm">支持 Excel (.xlsx) 格式</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600 text-sm">自动验证数据格式</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600 text-sm">实时显示上传进度</span>
                  </li>
                </ul>
                <Link href="/upload" className="block" onClick={() => handleNavigation('/upload')}>
                  <Button className="w-full group-hover:bg-nbs-primary/90 transition-colors shadow-lg hover:shadow-xl">
                    开始上传
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 结果查询卡片 */}
            <Card hover className="h-full group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-500/50">
              <CardHeader>
                <div className="flex items-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <CardTitle className="text-nbs-primary text-lg lg:text-xl">
                      结果查询
                    </CardTitle>
                    <p className="text-sm text-neutral-500 mt-1">
                      查看计算结果并导出数据
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600 text-sm">员工搜索和筛选</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600 text-sm">结果排序和分页</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600 text-sm">导出 Excel 报表</span>
                  </li>
                </ul>
                <Link href="/results" className="block" onClick={() => handleNavigation('/results')}>
                  <Button variant="outline" className="w-full group-hover:bg-green-50 group-hover:border-green-500 transition-all shadow-lg hover:shadow-xl">
                    查看结果
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 特性说明区域 - 响应式网格 */}
          <div className={`mt-12 lg:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-center p-4 lg:p-6 rounded-xl bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-nbs-primary rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base lg:text-lg font-bold text-nbs-primary mb-2">
                精确计算
              </h3>
              <p className="text-neutral-600 text-xs lg:text-sm leading-relaxed">
                基于最新社保政策，确保计算结果准确可靠
              </p>
            </div>

            <div className="text-center p-4 lg:p-6 rounded-xl bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base lg:text-lg font-bold text-nbs-primary mb-2">
                快速处理
              </h3>
              <p className="text-neutral-600 text-xs lg:text-sm leading-relaxed">
                支持批量数据处理，实时显示计算进度
              </p>
            </div>

            <div className="text-center p-4 lg:p-6 rounded-xl bg-white hover:shadow-lg transition-all duration-300 group sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-base lg:text-lg font-bold text-nbs-primary mb-2">
                数据安全
              </h3>
              <p className="text-neutral-600 text-xs lg:text-sm leading-relaxed">
                采用加密存储，确保员工数据隐私和安全
              </p>
            </div>
          </div>

          {/* 底部说明 - 移动端优化 */}
          <div className={`text-center mt-12 lg:mt-16 p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-nbs-primary/10 rounded-2xl max-w-4xl mx-auto border border-blue-100 transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex items-start text-left sm:text-center sm:items-start sm:flex sm:justify-start lg:justify-center">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-nbs-primary mt-0.5 mr-2 lg:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm lg:text-base text-nbs-primary font-semibold mb-1 lg:mb-2">
                  使用说明
                </p>
                <p className="text-xs lg:text-sm text-neutral-700 leading-relaxed">
                  系统支持佛山市五险一金计算，数据仅供参考，具体缴费比例和基数以当地最新政策为准。
                </p>
              </div>
            </div>
          </div>

          {/* 页脚 */}
          <div className={`text-center mt-12 lg:mt-16 text-xs lg:text-sm text-neutral-500 transition-all duration-1000 delay-900 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}>
            <p>© 2025 五险一金计算器 | 基于最新社保标准</p>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}

export default function Home() {
  return <HomePage />
}
