/**
 * 国家统计局主题配置
 *
 * 本文件定义了应用的完整主题系统，包括：
 * - 色彩系统 (基于国家统计局标准蓝色 #1e40af)
 * - 字体系统
 * - 间距系统
 * - 阴影系统
 * - 边框半径系统
 */

export interface ThemeConfig {
  // 色彩系统
  colors: {
    // 主色调 - 国家统计局蓝
    primary: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
      950: string
    }
    // 中性色
    neutral: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
      950: string
    }
    // 功能色彩
    success: {
      50: string
      500: string
      600: string
    }
    warning: {
      50: string
      500: string
      600: string
    }
    error: {
      50: string
      500: string
      600: string
    }
  }

  // 字体系统
  fonts: {
    sans: string[]
    mono: string[]
  }

  // 间距系统
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }

  // 阴影系统
  shadows: {
    sm: string
    md: string
    lg: string
  }

  // 边框半径系统
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
}

// 国家统计局主题配置
export const nbsTheme: ThemeConfig = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // 主蓝色
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af', // 深蓝色 - 主要品牌色
      900: '#1e3a8a',
      950: '#172554',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
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
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
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

  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
    '4xl': '8rem',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(30, 64, 175, 0.05)',
    md: '0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06)',
    lg: '0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(30, 64, 175, 0.05)',
  },

  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
}

// CSS 自定义属性生成器
export function generateCSSVariables(theme: ThemeConfig): string {
  const cssVars: string[] = []

  // 生成色彩变量
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    cssVars.push(`--nbs-primary-${key}: ${value}`)
  })

  Object.entries(theme.colors.neutral).forEach(([key, value]) => {
    cssVars.push(`--neutral-${key}: ${value}`)
  })

  // 生成功能色彩变量
  Object.entries(theme.colors.success).forEach(([key, value]) => {
    cssVars.push(`--success-${key}: ${value}`)
  })

  Object.entries(theme.colors.warning).forEach(([key, value]) => {
    cssVars.push(`--warning-${key}: ${value}`)
  })

  Object.entries(theme.colors.error).forEach(([key, value]) => {
    cssVars.push(`--error-${key}: ${value}`)
  })

  // 生成阴影变量
  Object.entries(theme.shadows).forEach(([key, value]) => {
    cssVars.push(`--shadow-nbs${key === 'md' ? '' : `-${key}`}: ${value}`)
  })

  // 生成边框半径变量
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars.push(`--radius-nbs${key === 'md' ? '' : `-${key}`}: ${value}`)
  })

  return cssVars.join(';\n  ')
}

// 主题颜色工具函数
export const getThemeColor = {
  // 主色调
  primary: (shade: keyof ThemeConfig['colors']['primary'] = 800) => nbsTheme.colors.primary[shade],
  secondary: (shade: keyof ThemeConfig['colors']['primary'] = 600) => nbsTheme.colors.primary[shade],
  accent: (shade: keyof ThemeConfig['colors']['primary'] = 500) => nbsTheme.colors.primary[shade],

  // 中性色
  background: (shade: keyof ThemeConfig['colors']['neutral'] = 50) => nbsTheme.colors.neutral[shade],
  surface: (shade: 'white' | keyof ThemeConfig['colors']['neutral'] = 'white') => shade === 'white' ? '#ffffff' : nbsTheme.colors.neutral[shade],
  text: (shade: keyof ThemeConfig['colors']['neutral'] = 900) => nbsTheme.colors.neutral[shade],
  textSecondary: (shade: keyof ThemeConfig['colors']['neutral'] = 600) => nbsTheme.colors.neutral[shade],

  // 功能色彩
  success: (shade: keyof ThemeConfig['colors']['success'] = 500) => nbsTheme.colors.success[shade],
  warning: (shade: keyof ThemeConfig['colors']['warning'] = 500) => nbsTheme.colors.warning[shade],
  error: (shade: keyof ThemeConfig['colors']['error'] = 500) => nbsTheme.colors.error[shade],
}

// 主题样式类名映射
export const themeClasses = {
  // 背景色
  bgPrimary: (shade: keyof ThemeConfig['colors']['primary'] = 800) => `bg-nbs-primary-${shade}`,
  bgNeutral: (shade: keyof ThemeConfig['colors']['neutral'] = 50) => `bg-neutral-${shade}`,
  bgSuccess: 'bg-success-500',
  bgWarning: 'bg-warning-500',
  bgError: 'bg-error-500',

  // 文字色
  textPrimary: (shade: keyof ThemeConfig['colors']['primary'] = 800) => `text-nbs-primary-${shade}`,
  textNeutral: (shade: keyof ThemeConfig['colors']['neutral'] = 600) => `text-neutral-${shade}`,
  textSuccess: 'text-success-600',
  textWarning: 'text-warning-600',
  textError: 'text-error-600',

  // 边框色
  borderPrimary: (shade: keyof ThemeConfig['colors']['primary'] = 300) => `border-nbs-primary-${shade}`,
  borderNeutral: (shade: keyof ThemeConfig['colors']['neutral'] = 300) => `border-neutral-${shade}`,

  // 阴影
  shadow: 'shadow-nbs',
  shadowLg: 'shadow-nbs-lg',

  // 圆角
  rounded: 'rounded-nbs',
  roundedLg: 'rounded-nbs-lg',
}

// 主题常量
export const THEME_CONSTANTS = {
  PRIMARY_BLUE: '#1e40af', // 国家统计局标准蓝色
  SECONDARY_BLUE: '#3b82f6',
  MAX_WIDTH: '1280px',
  CONTAINER_PADDING_X: '1rem',
  HEADER_HEIGHT: '64px',
  SIDEBAR_WIDTH: '256px',
  TRANSITION_DURATION: '200ms',
  TRANSITION_TIMING: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

export default nbsTheme