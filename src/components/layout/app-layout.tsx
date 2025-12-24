/**
 * 应用主布局组件
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentArrowUpIcon,
  TableCellsIcon,
  CogIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: '首页',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: '数据上传',
    href: '/upload',
    icon: DocumentArrowUpIcon,
  },
  {
    name: '结果查询',
    href: '/results',
    icon: TableCellsIcon,
  },
];

const userNavigation = [
  {
    name: '个人设置',
    href: '/profile',
    icon: CogIcon,
  },
  {
    name: '退出登录',
    href: '/logout',
    icon: ArrowRightOnRectangleIcon,
  },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端侧边栏 */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold text-gray-900">五险一金计算器</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 桌面端侧边栏 */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex h-16 flex-shrink-0 items-center px-6">
            <h1 className="text-xl font-bold text-gray-900">五险一金计算器</h1>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 用户信息 */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-8 w-8 rounded-full bg-gray-300 p-1 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">管理员</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="lg:pl-64">
        {/* 顶部导航栏 */}
        <div className="sticky top-0 z-40 flex h-16 flex-shrink-0 bg-white shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1">
              <h1 className="flex items-center text-lg font-semibold text-gray-900">
                {navigation.find(item => item.href === pathname)?.name || '五险一金计算器'}
              </h1>
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}