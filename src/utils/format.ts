/**
 * 数字格式化工具函数
 */

/**
 * 格式化货币，保留2位小数
 * @param amount 金额
 * @returns 格式化的货币字符串
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * 格式化百分比
 * @param value 数值 (如 0.08 代表 8%)
 * @param decimals 小数位数，默认2位
 * @returns 格式化的百分比字符串
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化数字，添加千分位分隔符
 * @param num 数字
 * @returns 格式化的数字字符串
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}

/**
 * 安全的数字解析，避免NaN
 * @param value 要解析的值
 * @param defaultValue 默认值
 * @returns 解析后的数字
 */
export function safeParseNumber(value: any, defaultValue: number = 0): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 四舍五入到指定小数位
 * @param num 数字
 * @param decimals 小数位数
 * @returns 四舍五入后的数字
 */
export function roundTo(num: number, decimals: number): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}