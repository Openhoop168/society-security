/**
 * 类型定义统一导出
 */

export * from './database';
export * from './common';

// 兼容旧版本类型定义
export interface City {
  id: number
  city_name: string
  year: string
  base_min: number
  base_max: number
  pension_rate_company: number
  medical_rate_company: number
  unemployment_rate_company: number
  injury_rate_company: number
  maternity_rate_company: number
  housing_rate_company: number
  created_at: string
  updated_at: string
}

export interface Salary {
  id: number
  employee_id: string
  employee_name: string
  month: string
  salary_amount: number
  created_at: string
  updated_at: string
}

export interface Result {
  id: number
  employee_name: string
  avg_salary: number
  contribution_base: number
  pension_company: number
  medical_company: number
  unemployment_company: number
  injury_company: number
  maternity_company: number
  housing_company: number
  total_company: number
  calculation_date: string
  created_at: string
}

// 用户相关类型
export interface User {
  id: string
  email: string
  created_at: string
}

// 计算相关类型
export interface CalculationInput {
  employee_name: string
  monthly_salaries: number[]
  city_standards: City
}

export interface CalculationResult {
  employee_name: string
  avg_salary: number
  contribution_base: number
  breakdown: {
    pension: number
    medical: number
    unemployment: number
    injury: number
    maternity: number
    housing: number
  }
  total_company: number
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 文件上传类型
export interface FileUploadResult {
  success: boolean
  processed: number
  errors: string[]
  inserted: number
}

// 分页类型
export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}