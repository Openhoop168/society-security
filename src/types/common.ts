/**
 * 通用类型定义
 */

// 基础响应类型
export interface BaseResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

// 选项类型（用于下拉选择等）
export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

// 表格列配置类型
export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

// 表格行操作类型
export interface TableAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: (record: any) => void;
  disabled?: (record: any) => boolean;
  hidden?: (record: any) => boolean;
}

// 状态枚举
// TaskStatus 已移至 database.ts 以避免冲突

export enum FileType {
  EXCEL_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  EXCEL_XLS = 'application/vnd.ms-excel',
}

export enum ExportFormat {
  EXCEL = 'xlsx',
  CSV = 'csv',
}

// 主题配置类型
export interface ThemeConfig {
  primaryColor: string;
  primaryHover: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
}

// 用户偏好设置类型
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  pageSize: number;
  autoSave: boolean;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  timestamp?: number;
}

// 模态框配置类型
export interface ModalConfig {
  title: string;
  visible: boolean;
  width?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

// 抽屉配置类型
export interface DrawerConfig {
  title: string;
  visible: boolean;
  width?: number | string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  closable?: boolean;
  maskClosable?: boolean;
  onClose?: () => void;
}

// 表单项配置类型
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'upload' | 'textarea' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: Option[];
  rules?: any[];
  disabled?: boolean;
  hidden?: boolean;
  span?: number;
  className?: string;
  description?: string;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: string | number;
}

// 面包屑项类型
export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
}

// 步骤配置类型
export interface Step {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
}

// 时间范围类型
export interface DateRange {
  startDate: string;
  endDate: string;
}

// 统计卡片数据类型
export interface StatCard {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
  icon?: React.ReactNode;
}

// 快捷操作类型
export interface QuickAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: string | number;
}

// 搜索条件类型
export interface SearchCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
  value: any;
  label?: string;
}

// 批量操作类型
export interface BatchAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: (selectedRows: any[]) => void;
  disabled?: (selectedRows: any[]) => boolean;
  confirm?: {
    title: string;
    content: string;
  };
}

// 上下文菜单项类型
export interface ContextMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
  onClick: (record: any) => void;
  children?: ContextMenuItem[];
}

// 加载状态类型
export interface LoadingState {
  loading: boolean;
  loadingText?: string;
  progress?: number;
  showProgress?: boolean;
}

// 错误状态类型
export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  retryAction?: () => void;
}

// 空状态类型
export interface EmptyState {
  description: string;
  image?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

// 拖拽配置类型
export interface DragConfig {
  draggable?: boolean;
  resizable?: boolean;
  bounds?: 'parent' | 'window' | { left: number; right: number; top: number; bottom: number };
  onStop?: (e: any, data: any) => void;
  onResize?: (e: any, data: any) => void;
}