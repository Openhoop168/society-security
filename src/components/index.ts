/**
 * 组件统一导出
 */

// UI Components
export { default as Button } from './ui/Button'
export {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from './ui/Card'
export { default as Input } from './ui/input'
export { Checkbox } from './ui/Checkbox'
export { default as Table } from './ui/table'
export { default as Modal } from './ui/modal'

// Layout Components
export { default as AppLayout } from './layout/app-layout'
export { default as PageHeader } from './layout/page-header'
export { default as LoadingSpinner } from './layout/loading-spinner'
export { MobileNav } from './layout/MobileNav'
export { ResponsiveContainer, ResponsiveGrid, Hidden, Show } from './layout/ResponsiveContainer'

// Common Components
export { default as StatCard } from './common/stat-card'
export { default as ProgressBar } from './common/progress-bar'
export { default as EmptyState } from './common/empty-state'
export { ErrorBoundary, withErrorBoundary } from './common/ErrorBoundary'
export { ToastProvider, useToast, useToastActions } from './common/Toast'
export { SuspenseLoader, PageTransition, FadeIn, SlideIn } from './common/SuspenseLoader'

// Auth Components
export { AuthProvider } from './auth/AuthProvider'
export { AuthStatus } from './auth/AuthStatus'
export { LoginForm } from './auth/LoginForm'
export { RegisterForm } from './auth/RegisterForm'
export { ProtectedRoute } from './auth/ProtectedRoute'

// Upload Components
export { FileUploader, UploadProgress, DataPreview } from './upload'

// Results Components
export { ResultsTable, ResultFilters, Pagination } from './results'

// 主题提供者
export { ThemeProvider } from './theme-provider'
