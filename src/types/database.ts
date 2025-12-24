/**
 * 数据库类型定义
 * 基于 Supabase 数据库 Schema
 * 创建时间: 2025-12-22
 * 版本: v0.1.0
 */

// 城市社保标准表 (cities)
export interface CityStandard {
  id: string;
  city_name: string;
  year: number;
  base_min: number;
  base_max: number;

  // 养老保险缴费比例
  pension_company: number;  // 公司缴纳比例 (0.1400 表示 14%)
  pension_employee: number; // 个人缴纳比例 (0.0800 表示 8%)

  // 医疗保险缴费比例
  medical_company: number;
  medical_employee: number;

  // 失业保险缴费比例
  unemployment_company: number;
  unemployment_employee: number;

  // 工伤保险缴费比例 (个人不缴费)
  injury_company: number;

  // 生育保险缴费比例 (个人不缴费)
  maternity_company: number;

  // 住房公积金缴费比例
  provident_company: number; // 使用 provident 而不是 housing_fund
  provident_employee: number;

  created_at?: string;
  updated_at?: string;
}

// 员工工资数据表 (salaries)
export interface EmployeeSalary {
  id: string;
  employee_id: string;     // 员工工号
  employee_name: string;   // 员工姓名
  year_month: number;      // 年份月份，格式：YYYYMM (整数)
  salary_amount: number;   // 工资金额

  // 可选字段
  department?: string;      // 部门
  position?: string;        // 职位

  // 关联用户
  created_by?: string;      // 谁上传的数据 (UUID)

  created_at?: string;
  updated_at?: string;
}

// 计算结果表 (results)
export interface CalculationResult {
  id: string;
  salary_id?: string;       // 关联工资记录 (可为空，基于汇总计算)
  employee_name: string;    // 员工姓名（冗余存储）
  avg_salary: number;       // 年度月平均工资
  contribution_base: number; // 最终缴费基数

  // 养老保险金额
  pension_company: number;   // 公司缴纳金额
  pension_employee: number;  // 个人缴纳金额

  // 医疗保险金额
  medical_company: number;
  medical_employee: number;

  // 失业保险金额
  unemployment_company: number;
  unemployment_employee: number;

  // 工伤保险金额 (个人不缴费)
  injury_company: number;

  // 生育保险金额 (个人不缴费)
  maternity_company: number;

  // 住房公积金金额
  provident_company: number;
  provident_employee: number;

  // 总计金额
  total_company: number;     // 公司总缴纳金额
  total_employee: number;    // 个人总缴纳金额
  total_all?: number;        // 总计 (生成列)

  // 计算相关信息
  created_by?: string;       // 谁的计算结果 (UUID)
  city_id?: string;          // 计算使用的城市标准 (UUID)
  calculation_year: number;  // 计算使用的年份

  created_at?: string;
}

// 上传任务记录表 (upload_tasks)
export interface UploadTask {
  id: string;
  task_name: string;         // 任务名称
  file_name: string;         // 原始文件名
  file_path?: string;        // 文件存储路径
  file_size?: number;        // 文件大小（字节）
  file_type?: string;        // 文件类型

  // 任务状态和进度
  total_rows: number;        // 总行数
  processed_rows: number;    // 已处理行数
  success_rows: number;      // 成功行数
  failed_rows: number;       // 失败行数
  status: TaskStatus;        // 任务状态

  // 任务结果
  error_message?: string;    // 错误信息
  summary?: Record<string, any>; // 任务摘要信息

  // 关联用户
  created_by: string;        // 创建者 (UUID，必填)

  // 时间戳
  created_at?: string;
  started_at?: string;
  completed_at?: string;
}

// 计算任务记录表 (calculation_tasks)
export interface CalculationTask {
  id: string;
  task_name: string;         // 任务名称
  upload_task_id?: string;   // 关联的上传任务 (UUID)

  // 任务参数
  city_name?: string;        // 使用的城市名称
  calculation_year: number;  // 计算年份

  // 任务状态和进度
  total_employees: number;   // 总员工数
  processed_employees: number; // 已处理员工数
  status: TaskStatus;        // 任务状态

  // 任务结果
  error_message?: string;    // 错误信息
  summary?: Record<string, any>; // 计算结果摘要

  // 关联用户
  created_by: string;        // 创建者 (UUID，必填)

  // 时间戳
  created_at?: string;
  started_at?: string;
  completed_at?: string;
}

// 用户配置表 (user_settings)
export interface UserSettings {
  id: string;
  user_id: string;           // 用户ID (UUID)

  // 默认计算设置
  default_city: string;      // 默认城市
  default_year: number;      // 默认年份

  // 通知设置
  email_notifications: boolean;     // 邮件通知
  task_completion_notifications: boolean; // 任务完成通知

  // 界面设置
  theme: 'light' | 'dark' | 'auto'; // 主题
  language: string;                  // 语言

  created_at?: string;
  updated_at?: string;
}

// 审计日志表 (audit_logs)
export interface AuditLog {
  id: string;
  user_id?: string;          // 用户ID (UUID)
  action: string;            // 操作类型 (INSERT, UPDATE, DELETE)
  table_name: string;        // 操作的表名
  record_id?: string;        // 记录ID (UUID)
  old_values?: Record<string, any>; // 旧值
  new_values?: Record<string, any>; // 新值
  ip_address?: string;       // IP地址
  user_agent?: string;       // 用户代理
  created_at?: string;
}

// 视图类型
export interface EmployeeSalarySummary {
  created_by: string;
  employee_id: string;
  employee_name: string;
  department?: string;
  position?: string;
  year: number;
  avg_monthly_salary: number;
  total_yearly_salary: number;
  months_count: number;
  first_month: number;
  last_month: number;
  last_updated?: string;
}

export interface CalculationSummary {
  created_by: string;
  calculation_year: number;
  employee_count: number;
  total_company_cost: number;
  total_employee_cost: number;
  total_cost: number;
  avg_cost_per_employee: number;
  last_calculation?: string;
}

export interface TaskStatistics {
  created_by: string;
  task_type: 'upload' | 'calculation';
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  processing_tasks: number;
  pending_tasks: number;
}

// 任务状态枚举
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// Supabase Auth 用户类型
export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 文件上传响应类型
export interface UploadResponse {
  taskId: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  message: string;
}

// 进度更新类型
export interface ProgressUpdate {
  taskId: string;
  progress: number;           // 进度百分比 (0-100)
  processedRows?: number;     // 已处理行数
  totalRows?: number;         // 总行数
  status: string;             // 状态
  message?: string;           // 消息
}

// 统计数据类型
export interface Statistics {
  totalEmployees: number;     // 总员工数
  totalCompanyAmount: number; // 单位总缴费
  totalEmployeeAmount: number;// 个人总缴费
  totalAmount: number;        // 合计总缴费
  averageSalary: number;      // 平均工资
  averageBase: number;        // 平均缴费基数
}

// 搜索和筛选参数类型
export interface SearchParams {
  keyword?: string;           // 关键词搜索
  employeeName?: string;      // 员工姓名
  employeeId?: string;        // 员工工号
  month?: string;            // 月份
  minSalary?: number;        // 最小工资
  maxSalary?: number;        // 最大工资
  city?: string;             // 城市
  year?: number;             // 年份
}

// 排序参数类型
export interface SortParams {
  field: string;             // 排序字段
  order: 'asc' | 'desc';     // 排序方向
}

// 分页参数类型
export interface PaginationParams {
  page: number;              // 页码
  pageSize: number;          // 每页大小
}

// 导出参数类型
export interface ExportParams {
  format: 'xlsx' | 'csv';    // 导出格式
  fields?: string[];         // 要导出的字段
  filters?: SearchParams;    // 筛选条件
  sort?: SortParams;         // 排序条件
}

// Supabase 数据库类型定义
export interface Database {
  public: {
    Tables: {
      // 城市社保标准表
      cities: {
        Row: CityStandard;
        Insert: Omit<CityStandard, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CityStandard, 'id' | 'created_at'>>;
      };

      // 员工工资数据表
      salaries: {
        Row: EmployeeSalary;
        Insert: Omit<EmployeeSalary, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EmployeeSalary, 'id' | 'created_at'>>;
      };

      // 计算结果表
      results: {
        Row: CalculationResult;
        Insert: Omit<CalculationResult, 'id' | 'created_at' | 'total_all'>;
        Update: Partial<Omit<CalculationResult, 'id' | 'created_at' | 'total_all'>>;
      };

      // 上传任务记录表
      upload_tasks: {
        Row: UploadTask;
        Insert: Omit<UploadTask, 'id' | 'created_at'>;
        Update: Partial<Omit<UploadTask, 'id' | 'created_at'>>;
      };

      // 计算任务记录表
      calculation_tasks: {
        Row: CalculationTask;
        Insert: Omit<CalculationTask, 'id' | 'created_at'>;
        Update: Partial<Omit<CalculationTask, 'id' | 'created_at'>>;
      };

      // 用户配置表
      user_settings: {
        Row: UserSettings;
        Insert: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserSettings, 'id' | 'created_at'>>;
      };

      // 审计日志表
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
      };

      // 视图
      employee_salary_summary: {
        Row: EmployeeSalarySummary;
        Insert: never; // 视图不可插入
        Update: never; // 视图不可更新
      };

      calculation_summary: {
        Row: CalculationSummary;
        Insert: never;
        Update: never;
      };

      task_statistics: {
        Row: TaskStatistics;
        Insert: never;
        Update: never;
      };
    };

    // Functions
    Functions: {
      calculate_monthly_contribution: {
        Args: {
          p_salary_amount: number;
          p_city_name?: string;
          p_calculation_year?: number;
        };
        Returns: Array<{
          base_min: number;
          base_max: number;
          contribution_base: number;
          pension_company: number;
          pension_employee: number;
          medical_company: number;
          medical_employee: number;
          unemployment_company: number;
          unemployment_employee: number;
          injury_company: number;
          maternity_company: number;
          provident_company: number;
          provident_employee: number;
          total_company: number;
          total_employee: number;
          total_all: number;
        }>;
      };

      batch_calculate_contributions: {
        Args: {
          p_user_id: string;
          p_city_name?: string;
          p_calculation_year?: number;
          p_calculation_year_month?: number;
        };
        Returns: Array<{
          success: boolean;
          message: string;
          processed_count: number;
          error_count: number;
        }>;
      };

      cleanup_old_audit_logs: {
        Args: Record<string, never>;
        Returns: number;
      };

      cleanup_deleted_data: {
        Args: Record<string, never>;
        Returns: number;
      };
    };

    // Views
    Views: {
      employee_salary_summary: EmployeeSalarySummary;
      calculation_summary: CalculationSummary;
      task_statistics: TaskStatistics;
    };
  };
}

// 数据库表名常量
export const TABLES = {
  CITIES: 'cities',
  SALARIES: 'salaries',
  RESULTS: 'results',
  UPLOAD_TASKS: 'upload_tasks',
  CALCULATION_TASKS: 'calculation_tasks',
  USER_SETTINGS: 'user_settings',
  AUDIT_LOGS: 'audit_logs',
} as const;

// 视图名称常量
export const VIEWS = {
  EMPLOYEE_SALARY_SUMMARY: 'employee_salary_summary',
  CALCULATION_SUMMARY: 'calculation_summary',
  TASK_STATISTICS: 'task_statistics',
} as const;

// 字段名常量
export const FIELDS = {
  // CityStandard
  CITY_NAME: 'city_name',
  YEAR: 'year',
  BASE_MIN: 'base_min',
  BASE_MAX: 'base_max',

  // EmployeeSalary
  EMPLOYEE_ID: 'employee_id',
  EMPLOYEE_NAME: 'employee_name',
  YEAR_MONTH: 'year_month',
  SALARY_AMOUNT: 'salary_amount',
  DEPARTMENT: 'department',
  POSITION: 'position',
  CREATED_BY: 'created_by',

  // CalculationResult
  AVG_SALARY: 'avg_salary',
  CONTRIBUTION_BASE: 'contribution_base',
  TOTAL_COMPANY: 'total_company',
  TOTAL_EMPLOYEE: 'total_employee',
  TOTAL_ALL: 'total_all',
  CALCULATION_YEAR: 'calculation_year',

  // UploadTask / CalculationTask
  TASK_NAME: 'task_name',
  FILE_NAME: 'file_name',
  STATUS: 'status',
  TOTAL_ROWS: 'total_rows',
  PROCESSED_ROWS: 'processed_rows',
  ERROR_MESSAGE: 'error_message',
} as const;

// 社保项目常量
export const INSURANCE_ITEMS = {
  PENSION: 'pension',           // 养老保险
  MEDICAL: 'medical',           // 医疗保险
  UNEMPLOYMENT: 'unemployment', // 失业保险
  INJURY: 'injury',            // 工伤保险
  MATERNITY: 'maternity',      // 生育保险
  PROVIDENT: 'provident',      // 住房公积金
} as const;

// 社保项目名称映射
export const INSURANCE_ITEM_NAMES = {
  [INSURANCE_ITEMS.PENSION]: '养老保险',
  [INSURANCE_ITEMS.MEDICAL]: '医疗保险',
  [INSURANCE_ITEMS.UNEMPLOYMENT]: '失业保险',
  [INSURANCE_ITEMS.INJURY]: '工伤保险',
  [INSURANCE_ITEMS.MATERNITY]: '生育保险',
  [INSURANCE_ITEMS.PROVIDENT]: '住房公积金',
} as const;

// 默认城市和年份
export const DEFAULT_CITY = '佛山';
export const DEFAULT_YEAR = new Date().getFullYear();

// 常用的年份月份范围
export const YEAR_MONTH_RANGES = {
  CURRENT_YEAR: {
    start: parseInt(`${new Date().getFullYear()}01`),
    end: parseInt(`${new Date().getFullYear()}12`),
  },
  LAST_YEAR: {
    start: parseInt(`${new Date().getFullYear() - 1}01`),
    end: parseInt(`${new Date().getFullYear() - 1}12`),
  },
} as const;