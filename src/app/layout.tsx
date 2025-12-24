import '../styles/globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  title: '五险一金计算器',
  description: '基于城市社保标准和员工工资数据的五险一金费用计算系统',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="min-h-screen bg-neutral-50 antialiased">
        <AuthProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}