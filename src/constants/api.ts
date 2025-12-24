/**
 * API相关常量定义
 */

// API端点路径
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },

  // 城市社保标准
  CITIES: {
    LIST: '/api/cities',
    CREATE: '/api/cities',
    UPDATE: '/api/cities/[id]',
    DELETE: '/api/cities/[id]',
    GET_BY_CITY_YEAR: '/api/cities/by-city-year',
  },

  // 员工工资
  SALARIES: {
    LIST: '/api/salaries',
    BULK_CREATE: '/api/salaries/bulk',
    DELETE: '/api/salaries/[id]',
    BY_EMPLOYEE: '/api/salaries/by-employee',
  },

  // 计算结果
  RESULTS: {
    LIST: '/api/results',
    CALCULATE: '/api/results/calculate',
    DELETE: '/api/results/[id]',
    EXPORT: '/api/results/export',
  },

  // 文件上传
  UPLOAD: {
    SALARY_FILE: '/api/upload/salary',
    CITY_FILE: '/api/upload/city',
  },

  // 系统状态
  SYSTEM: {
    STATUS: '/api/system/status',
    PROGRESS: '/api/system/progress',
  },
} as const;

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// HTTP方法
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// 请求头
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
} as const;

// MIME类型
export const MIME_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  EXCEL_XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  EXCEL_XLS: 'application/vnd.ms-excel',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const;

// 缓存键
export const CACHE_KEYS = {
  USER_INFO: 'userInfo',
  CITY_STANDARDS: 'cityStandards',
  CALCULATION_RESULTS: 'calculationResults',
  SYSTEM_STATUS: 'systemStatus',
} as const;

// 本地存储键
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  LAST_LOGIN: 'lastLogin',
} as const;

// 请求超时时间（毫秒）
export const TIMEOUTS = {
  SHORT: 5000,    // 5秒
  MEDIUM: 10000,  // 10秒
  LONG: 30000,    // 30秒
  UPLOAD: 60000,  // 60秒
} as const;

// 重试配置
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1秒
  RETRY_DELAY_MULTIPLIER: 2,
} as const;

// 进度事件类型
export const PROGRESS_EVENTS = {
  START: 'start',
  PROGRESS: 'progress',
  COMPLETE: 'complete',
  ERROR: 'error',
} as const;

// WebSocket事件
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  PROGRESS_UPDATE: 'progress_update',
  CALCULATION_COMPLETE: 'calculation_complete',
  ERROR: 'error',
} as const;