/**
 * API 请求和响应类型定义
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { TaskStatus } from './database';

// =====================================================
// 通用 API 响应类型
// =====================================================

/**
 * API 成功响应
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * API 错误响应
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
  requestId?: string;
}

/**
 * API 响应联合类型
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// =====================================================
// 批量计算相关类型
// =====================================================

/**
 * 批量计算请求
 */
export interface BatchCalculateRequest {
  city_name?: string; // 城市名称，默认 '佛山'
  calculation_year?: number; // 计算年份，默认当前年份
  upload_task_id?: string; // 关联的上传任务 ID（可选）
}

/**
 * 批量计算响应
 */
export interface BatchCalculateResponse {
  task_id: string; // 任务 ID
  task_name: string; // 任务名称
  status: 'pending'; // 初始状态
  total_employees: number; // 待计算员工总数
  city_name: string; // 使用的城市名称
  calculation_year: number; // 计算年份
  message: string; // 提示信息
}

// =====================================================
// 任务状态相关类型
// =====================================================

/**
 * 计算摘要
 */
export interface CalculationSummary {
  employee_count: number; // 员工总数
  total_company_cost: number; // 公司总成本
  total_employee_cost: number; // 个人总成本
  average_cost: number; // 平均成本
}

/**
 * 任务状态详情
 */
export interface TaskStatusData {
  id: string; // 任务 ID
  task_name: string; // 任务名称
  status: TaskStatus; // 任务状态
  total_employees: number; // 总员工数
  processed_employees: number; // 已处理员工数
  progress_percentage: number; // 进度百分比 (0-100)
  city_name: string; // 城市名称
  calculation_year: number; // 计算年份
  error_message?: string; // 错误信息
  summary?: CalculationSummary; // 计算摘要（任务完成后）
  created_at: string; // 创建时间
  started_at?: string; // 开始时间
  completed_at?: string; // 完成时间
}

// =====================================================
// 进度查询相关类型
// =====================================================

/**
 * 进度信息
 */
export interface ProgressData {
  task_id: string; // 任务 ID
  status: TaskStatus; // 任务状态
  progress_percentage: number; // 进度百分比 (0-100)
  processed: number; // 已处理数量
  total: number; // 总数量
  message?: string; // 状态消息
}

// =====================================================
// 任务列表相关类型
// =====================================================

/**
 * 任务列表项（精简版）
 */
export interface TaskListItem {
  id: string; // 任务 ID
  task_name: string; // 任务名称
  status: TaskStatus; // 任务状态
  progress_percentage: number; // 进度百分比
  calculation_year: number; // 计算年份
  created_at: string; // 创建时间
  completed_at?: string; // 完成时间
}

/**
 * 任务列表查询参数
 */
export interface ListTasksRequest {
  status?: TaskStatus; // 筛选状态（可选）
  limit?: number; // 每页数量，默认 20
  offset?: number; // 偏移量，默认 0
}

/**
 * 任务列表响应
 */
export interface TaskListResponse {
  tasks: TaskListItem[]; // 任务列表
  total: number; // 总数
  has_more: boolean; // 是否有更多
}

// =====================================================
// 分页相关类型
// =====================================================

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number; // 页码，默认 1
  pageSize?: number; // 每页大小，默认 20
  limit?: number; // 限制数量
  offset?: number; // 偏移量
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  page: number; // 当前页
  pageSize: number; // 每页大小
  total: number; // 总数
  totalPages: number; // 总页数
  hasNext: boolean; // 是否有下一页
  hasPrev: boolean; // 是否有上一页
}

// =====================================================
// API 端点路径常量
// =====================================================

export const API_ENDPOINTS = {
  // 计算相关
  CALCULATE_BATCH: '/api/calculate/batch',
  CALCULATE_TASKS: '/api/calculate/tasks',
  CALCULATE_TASK_BY_ID: (id: string) => `/api/calculate/tasks/${id}`,
  CALCULATE_PROGRESS: (taskId: string) => `/api/calculate/progress/${taskId}`,

  // 数据库测试
  TEST_DB: '/api/test-db',

  // 认证相关（未来实现）
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_REFRESH: '/api/auth/refresh',
} as const;
