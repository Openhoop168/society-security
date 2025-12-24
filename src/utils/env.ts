/**
 * 环境相关工具函数
 * 创建时间: 2025-12-23
 */

/**
 * 判断是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 判断是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * 判断是否为测试环境
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * 获取环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value;
}

/**
 * 获取必需的环境变量
 * 如果环境变量不存在则抛出错误
 * @param key 环境变量键名
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`环境变量 ${key} 未定义`);
  }
  return value;
}
