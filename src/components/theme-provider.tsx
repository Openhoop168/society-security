'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// 主题配置接口
interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  fonts: {
    sans: string[]
    mono: string[]
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
}

// 国家统计局主题配置
const nbsTheme: ThemeConfig = {
  colors: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#2563eb',
    background: '#fafafa',
    surface: '#ffffff',
    text: '#171717',
    textSecondary: '#525252',
  },
  fonts: {
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif',
    ],
    mono: [
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      '"Courier New"',
      'monospace',
    ],
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(30, 64, 175, 0.05)',
    md: '0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06)',
    lg: '0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(30, 64, 175, 0.05)',
  },
}

interface ThemeContextType {
  theme: ThemeConfig
  isDark: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false)

  // 从 localStorage 读取深色模式设置
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setIsDark(JSON.parse(savedMode))
    }
  }, [])

  // 保存深色模式设置到 localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark))
    // 在这里可以添加深色模式的 CSS 类切换逻辑
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  const value: ThemeContextType = {
    theme: nbsTheme,
    isDark,
    toggleDarkMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          '--nbs-primary': nbsTheme.colors.primary,
          '--nbs-secondary': nbsTheme.colors.secondary,
          '--nbs-accent': nbsTheme.colors.accent,
          '--nbs-background': nbsTheme.colors.background,
          '--nbs-surface': nbsTheme.colors.surface,
          '--nbs-text': nbsTheme.colors.text,
          '--nbs-text-secondary': nbsTheme.colors.textSecondary,
          '--nbs-border-radius-sm': nbsTheme.borderRadius.sm,
          '--nbs-border-radius-md': nbsTheme.borderRadius.md,
          '--nbs-border-radius-lg': nbsTheme.borderRadius.lg,
          '--nbs-shadow-sm': nbsTheme.shadows.sm,
          '--nbs-shadow-md': nbsTheme.shadows.md,
          '--nbs-shadow-lg': nbsTheme.shadows.lg,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}