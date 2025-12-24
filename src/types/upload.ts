/**
 * 上传相关类型定义
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

// 解析后的工资数据
export interface ParsedSalaryData {
  employee_id: string
  employee_name: string
  year_month: number
  salary_amount: number
  department?: string
  position?: string
  row_number: number // Excel 行号
}

// 解析后的城市数据
export interface ParsedCityData {
  city_name: string
  year: number
  base_min: number
  base_max: number
  pension_company: number
  pension_employee: number
  medical_company: number
  medical_employee: number
  unemployment_company: number
  unemployment_employee: number
  injury_company: number
  maternity_company: number
  provident_company: number
  provident_employee: number
  row_number: number // Excel 行号
}

// 数据验证结果
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  totalRows: number
  validRows: number
  invalidRows: number
}

// 验证错误
export interface ValidationError {
  row: number
  field: string
  value: any
  message: string
}

// 验证警告
export interface ValidationWarning {
  row: number
  field: string
  value: any
  message: string
}

// Excel 列定义
export interface ExcelColumn {
  key: string
  label: string
  required: boolean
  type: 'string' | 'number'
  validation?: (value: any) => boolean | string
}

// 工资数据 Excel 列定义
export const SALARY_EXCEL_COLUMNS: ExcelColumn[] = [
  { key: 'employee_id', label: '员工工号', required: true, type: 'string' },
  { key: 'employee_name', label: '员工姓名', required: true, type: 'string' },
  { key: 'year_month', label: '年月份', required: true, type: 'number' },
  { key: 'salary_amount', label: '工资金额', required: true, type: 'number' },
  { key: 'department', label: '部门', required: false, type: 'string' },
  { key: 'position', label: '职位', required: false, type: 'string' },
]

// 城市数据 Excel 列定义
export const CITY_EXCEL_COLUMNS: ExcelColumn[] = [
  { key: 'city_name', label: '城市名称', required: true, type: 'string' },
  { key: 'year', label: '年份', required: true, type: 'number' },
  { key: 'base_min', label: '基数下限', required: true, type: 'number' },
  { key: 'base_max', label: '基数上限', required: true, type: 'number' },
  { key: 'pension_company', label: '养老公司比例', required: true, type: 'number' },
  { key: 'pension_employee', label: '养老个人比例', required: true, type: 'number' },
  { key: 'medical_company', label: '医疗公司比例', required: true, type: 'number' },
  { key: 'medical_employee', label: '医疗个人比例', required: true, type: 'number' },
  { key: 'unemployment_company', label: '失业公司比例', required: true, type: 'number' },
  { key: 'unemployment_employee', label: '失业个人比例', required: true, type: 'number' },
  { key: 'injury_company', label: '工伤公司比例', required: true, type: 'number' },
  { key: 'maternity_company', label: '生育公司比例', required: true, type: 'number' },
  { key: 'provident_company', label: '公积金公司比例', required: true, type: 'number' },
  { key: 'provident_employee', label: '公积金个人比例', required: true, type: 'number' },
]

// 上传统计信息
export interface UploadStats {
  total: number
  success: number
  failed: number
  skipped: number
}

// 上传任务状态
export interface UploadTaskStatus {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message?: string
  stats?: UploadStats
}
