/**
 * 格式化工具函数测试
 */
import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  safeParseNumber,
  roundTo,
} from './format'

describe('formatCurrency', () => {
  it('应该正确格式化正数金额', () => {
    expect(formatCurrency(1234.56)).toBe('¥1,234.56')
  })

  it('应该正确格式化零', () => {
    expect(formatCurrency(0)).toBe('¥0.00')
  })

  it('应该正确格式化负数金额', () => {
    expect(formatCurrency(-1234.56)).toBe('-¥1,234.56')
  })

  it('应该保留两位小数', () => {
    expect(formatCurrency(1234.5)).toBe('¥1,234.50')
    expect(formatCurrency(1234.456)).toBe('¥1,234.46')
  })

  it('应该正确处理大额金额', () => {
    expect(formatCurrency(12345678.9)).toBe('¥12,345,678.90')
  })
})

describe('formatPercentage', () => {
  it('应该正确格式化百分比（默认2位小数）', () => {
    expect(formatPercentage(0.08)).toBe('8.00%')
    expect(formatPercentage(0.1234)).toBe('12.34%')
  })

  it('应该支持自定义小数位数', () => {
    expect(formatPercentage(0.08, 0)).toBe('8%')
    expect(formatPercentage(0.08333, 3)).toBe('8.333%')
  })

  it('应该正确处理边界值', () => {
    expect(formatPercentage(0)).toBe('0.00%')
    expect(formatPercentage(1)).toBe('100.00%')
  })

  it('应该四舍五入', () => {
    expect(formatPercentage(0.0855, 2)).toBe('8.55%')
  })
})

describe('formatNumber', () => {
  it('应该正确添加千分位分隔符', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber(1234567890)).toBe('1,234,567,890')
  })

  it('应该正确处理小数', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56')
  })

  it('应该正确处理零', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('应该正确处理负数', () => {
    expect(formatNumber(-1234567)).toBe('-1,234,567')
  })

  it('应该正确处理小于1000的数字', () => {
    expect(formatNumber(123)).toBe('123')
    expect(formatNumber(999)).toBe('999')
  })
})

describe('safeParseNumber', () => {
  it('应该正确解析数字字符串', () => {
    expect(safeParseNumber('123.45')).toBe(123.45)
    expect(safeParseNumber('-123.45')).toBe(-123.45)
  })

  it('应该正确解析数字', () => {
    expect(safeParseNumber(123.45)).toBe(123.45)
  })

  it('应该对无效值返回默认值', () => {
    expect(safeParseNumber('abc')).toBe(0)
    expect(safeParseNumber('')).toBe(0)
    expect(safeParseNumber(null)).toBe(0)
    expect(safeParseNumber(undefined)).toBe(0)
    expect(safeParseNumber(NaN)).toBe(0)
  })

  it('应该支持自定义默认值', () => {
    expect(safeParseNumber('abc', 100)).toBe(100)
    expect(safeParseNumber('', -1)).toBe(-1)
  })

  it('应该正确解析科学计数法', () => {
    expect(safeParseNumber('1.23e2')).toBe(123)
  })
})

describe('roundTo', () => {
  it('应该正确四舍五入到指定小数位', () => {
    expect(roundTo(123.456, 2)).toBe(123.46)
    expect(roundTo(123.454, 2)).toBe(123.45)
  })

  it('应该正确处理零小数位', () => {
    expect(roundTo(123.56, 0)).toBe(124)
    expect(roundTo(123.45, 0)).toBe(123)
  })

  it('应该正确处理更多小数位', () => {
    expect(roundTo(123.456789, 4)).toBe(123.4568)
  })

  it('应该正确处理负数', () => {
    expect(roundTo(-123.456, 2)).toBe(-123.46)
  })

  it('应该正确处理零', () => {
    expect(roundTo(0, 2)).toBe(0)
  })

  it('应该正确处理边界情况（5的舍入）', () => {
    // 注意：JavaScript 浮点数精度问题是已知的限制
    // 这个测试验证 roundTo 函数的实际行为，使用接近或接近整数的值

    // 测试简单的舍入情况
    expect(roundTo(1.234, 2)).toBe(1.23) // 下舍入
    expect(roundTo(1.235, 2)).toBe(1.24) // 上舍入（可能）
    expect(roundTo(1.236, 2)).toBe(1.24) // 上舍入

    // 测试更多边界值
    expect(roundTo(2.345, 2)).toBe(2.35)
    expect(roundTo(3.456, 2)).toBe(3.46)

    // 验证函数对常见数字能正确处理
    expect(roundTo(1.5, 0)).toBe(2) // 1.5 向上舍入
    expect(roundTo(2.5, 0)).toBe(3) // 2.5 向上舍入
    expect(roundTo(3.5, 0)).toBe(4) // 3.5 向上舍入
  })
})
