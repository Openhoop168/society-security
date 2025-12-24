/**
 * 五险一金相关常量定义
 */

// 默认城市（佛山）
export const DEFAULT_CITY = '佛山';

// 默认年份（当前年份）
export const DEFAULT_YEAR = new Date().getFullYear();

// 默认社保基数（佛山2025年标准）
export const DEFAULT_BASE_MIN = 1900; // 社保基数下限
export const DEFAULT_BASE_MAX = 26421; // 社保基数上限

// 默认公积金基数（佛山2025年标准）
export const DEFAULT_HOUSING_FUND_MIN = 1900; // 公积金基数下限
export const DEFAULT_HOUSING_FUND_MAX = 31920; // 公积金基数上限

// 默认费率（佛山2025年标准）
export const DEFAULT_RATES = {
  // 养老保险
  pension_company: 0.14, // 14%
  pension_employee: 0.08, // 8%

  // 医疗保险
  medical_company: 0.055, // 5.5%
  medical_employee: 0.02, // 2%

  // 失业保险
  unemployment_company: 0.008, // 0.8%
  unemployment_employee: 0.002, // 0.2%

  // 工伤保险
  injury_company: 0.002, // 0.2%
  injury_employee: 0, // 0%

  // 生育保险
  maternity_company: 0.016, // 1.6%
  maternity_employee: 0, // 0%

  // 住房公积金
  housing_fund_company: 0.12, // 12%
  housing_fund_employee: 0.12, // 12%
};

// 五险一金项目名称
export const INSURANCE_ITEMS = {
  pension: '养老保险',
  medical: '医疗保险',
  unemployment: '失业保险',
  injury: '工伤保险',
  maternity: '生育保险',
  housing_fund: '住房公积金',
} as const;

// 缴费主体
export const PAYMENT_PARTIES = {
  company: '单位缴费',
  employee: '个人缴费',
  total: '合计',
} as const;

// 文件上传限制
export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ],
  ALLOWED_FILE_EXTENSIONS: ['.xlsx', '.xls'],
  MAX_ROWS_PER_FILE: 10000, // 单文件最大行数
} as const;

// Excel表头映射
export const EXCEL_HEADERS = {
  // 员工工资表
  SALARY: {
    employee_id: ['员工工号', '工号', '员工编号', '编号'],
    employee_name: ['员工姓名', '姓名', '员工名称'],
    month: ['年月', '月份', '工资月份'],
    salary_amount: ['工资金额', '工资', '基本工资', '应发工资'],
  },

  // 城市社保标准表
  CITY_STANDARD: {
    city_name: ['城市名称', '城市', '城市名'],
    year: ['年份', '年度'],
    base_min: ['基数下限', '社保基数下限', '缴费基数下限'],
    base_max: ['基数上限', '社保基数上限', '缴费基数上限'],
    pension_company: ['养老单位', '养老保险单位'],
    pension_employee: ['养老个人', '养老保险个人'],
    medical_company: ['医疗单位', '医疗保险单位'],
    medical_employee: ['医疗个人', '医疗保险个人'],
    unemployment_company: ['失业单位', '失业保险单位'],
    unemployment_employee: ['失业个人', '失业保险个人'],
    injury_company: ['工伤单位', '工伤保险单位'],
    injury_employee: ['工伤个人', '工伤保险个人'],
    maternity_company: ['生育单位', '生育保险单位'],
    maternity_employee: ['生育个人', '生育保险个人'],
    housing_fund_company: ['公积金单位', '住房公积金单位'],
    housing_fund_employee: ['公积金个人', '住房公积金个人'],
  },
} as const;

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZES: [10, 20, 50, 100],
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  // 文件上传错误
  FILE_TOO_LARGE: '文件大小不能超过10MB',
  INVALID_FILE_TYPE: '只支持Excel文件（.xlsx、.xls）',
  FILE_UPLOAD_FAILED: '文件上传失败',

  // 数据验证错误
  INVALID_SALARY_DATA: '工资数据格式不正确',
  INVALID_CITY_STANDARD: '城市社保标准数据格式不正确',
  MISSING_REQUIRED_FIELDS: '缺少必填字段',
  DUPLICATE_EMPLOYEE: '员工数据重复',

  // 计算错误
  NO_SALARY_DATA: '没有找到员工工资数据',
  NO_CITY_STANDARD: '没有找到城市社保标准',
  CALCULATION_FAILED: '计算失败',

  // 系统错误
  NETWORK_ERROR: '网络连接错误',
  SERVER_ERROR: '服务器错误',
  UNKNOWN_ERROR: '未知错误',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: '文件上传成功',
  DATA_IMPORTED: '数据导入成功',
  CALCULATION_COMPLETED: '计算完成',
  DATA_EXPORTED: '数据导出成功',
} as const;

// UI常量
export const UI_CONSTANTS = {
  // 动画时长（毫秒）
  ANIMATION_DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },

  // 延迟时间（毫秒）
  DELAY: {
    SHORT: 500,
    MEDIUM: 1000,
    LONG: 2000,
  },

  // 颜色主题
  COLORS: {
    PRIMARY: '#1e40af', // 国家统计局蓝色
    PRIMARY_HOVER: '#1e3a8a',
    SUCCESS: '#16a34a',
    WARNING: '#f59e0b',
    ERROR: '#dc2626',
    INFO: '#3b82f6',
  },
} as const;