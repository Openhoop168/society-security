/**
 * 验证工具函数测试
 */
import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidPhone,
  isValidIdCard,
  validateSalary,
  validateEmployeeName,
  validateMonth,
  validateCityStandard,
} from './validation'

describe('isValidEmail', () => {
  it('应该接受有效的邮箱地址', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@example.com')).toBe(true)
    expect(isValidEmail('user+tag@example.co.uk')).toBe(true)
    expect(isValidEmail('123@example.com')).toBe(true)
  })

  it('应该拒绝无效的邮箱地址', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('invalid@')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('invalid@.com')).toBe(false)
    expect(isValidEmail('invalid@com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail(' ')).toBe(false)
  })
})

describe('isValidPhone', () => {
  it('应该接受有效的中国大陆手机号', () => {
    expect(isValidPhone('13812345678')).toBe(true)
    expect(isValidPhone('15912345678')).toBe(true)
    expect(isValidPhone('18612345678')).toBe(true)
    expect(isValidPhone('19112345678')).toBe(true)
  })

  it('应该拒绝无效的手机号', () => {
    expect(isValidPhone('12812345678')).toBe(false) // 12开头无效
    expect(isValidPhone('1381234567')).toBe(false) // 少一位
    expect(isValidPhone('138123456789')).toBe(false) // 多一位
    expect(isValidPhone('1381234567a')).toBe(false) // 包含字母
    expect(isValidPhone('')).toBe(false)
    expect(isValidPhone(' ')).toBe(false)
  })
})

describe('isValidIdCard', () => {
  it('应该接受有效的身份证号', () => {
    expect(isValidIdCard('123456789012345')).toBe(true) // 15位
    expect(isValidIdCard('123456789012345678')).toBe(true) // 18位
    expect(isValidIdCard('12345678901234567X')).toBe(true) // 18位带X
    expect(isValidIdCard('12345678901234567x')).toBe(true) // 18位带x
  })

  it('应该拒绝无效的身份证号', () => {
    expect(isValidIdCard('12345678901234')).toBe(false) // 14位
    expect(isValidIdCard('1234567890123456')).toBe(false) // 16位
    expect(isValidIdCard('1234567890123456789')).toBe(false) // 19位
    expect(isValidIdCard('12345678901234567A')).toBe(false) // 非X字母
    expect(isValidIdCard('')).toBe(false)
    expect(isValidIdCard(' ')).toBe(false)
  })
})

describe('validateSalary', () => {
  it('应该接受有效的工资金额', () => {
    expect(validateSalary(5000)).toEqual({ isValid: true, errors: [] })
    expect(validateSalary('5000')).toEqual({ isValid: true, errors: [] })
    expect(validateSalary(5000.5)).toEqual({ isValid: true, errors: [] })
    expect(validateSalary(0)).toEqual({ isValid: true, errors: [] })
  })

  it('应该拒绝空值', () => {
    const result = validateSalary(null)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('工资金额不能为空')

    expect(validateSalary(undefined).isValid).toBe(false)
    expect(validateSalary('').isValid).toBe(false)
  })

  it('应该拒绝非数字', () => {
    const result = validateSalary('abc')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('工资金额必须是数字')
  })

  it('应该拒绝负数', () => {
    const result = validateSalary(-100)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('工资金额不能为负数')
  })

  it('应该拒绝超出合理范围的金额', () => {
    const result = validateSalary(10000001)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('工资金额超出合理范围')
  })
})

describe('validateEmployeeName', () => {
  it('应该接受有效的员工姓名', () => {
    expect(validateEmployeeName('张三')).toEqual({ isValid: true, errors: [] })
    expect(validateEmployeeName('John Doe')).toEqual({ isValid: true, errors: [] })
    expect(validateEmployeeName('李四 Smith')).toEqual({ isValid: true, errors: [] })
  })

  it('应该拒绝空值', () => {
    const result = validateEmployeeName('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('员工姓名不能为空')

    expect(validateEmployeeName('   ').isValid).toBe(false)
  })

  it('应该拒绝过长的姓名', () => {
    const longName = '张'.repeat(51)
    const result = validateEmployeeName(longName)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('员工姓名不能超过50个字符')
  })

  it('应该拒绝包含非法字符的姓名', () => {
    const result = validateEmployeeName('张三123')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('员工姓名只能包含中文、英文和空格')

    expect(validateEmployeeName('张三!@#').isValid).toBe(false)
  })
})

describe('validateMonth', () => {
  it('应该接受有效的月份格式', () => {
    expect(validateMonth('202501')).toEqual({ isValid: true, errors: [] })
    expect(validateMonth('202412')).toEqual({ isValid: true, errors: [] })
    expect(validateMonth('200001')).toEqual({ isValid: true, errors: [] })
    expect(validateMonth('210012')).toEqual({ isValid: true, errors: [] })
  })

  it('应该拒绝空值', () => {
    const result = validateMonth('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('月份不能为空')
  })

  it('应该拒绝错误的格式', () => {
    const result = validateMonth('2025-01')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('月份格式不正确，应为YYYYMM格式')

    expect(validateMonth('2501').isValid).toBe(false)
    expect(validateMonth('2025011').isValid).toBe(false)
  })

  it('应该拒绝无效的年份', () => {
    const result = validateMonth('199901')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('年份应在2000-2100之间')

    expect(validateMonth('210101').isValid).toBe(false)
  })

  it('应该拒绝无效的月份', () => {
    const result = validateMonth('202500')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('月份应在1-12之间')

    expect(validateMonth('202513').isValid).toBe(false)
  })
})

describe('validateCityStandard', () => {
  const validStandard = {
    city_name: '佛山',
    year: 2025,
    base_min: 2000,
    base_max: 30000,
    pension_company: 0.14,
    pension_employee: 0.08,
    medical_company: 0.06,
    medical_employee: 0.02,
    unemployment_company: 0.01,
    unemployment_employee: 0.005,
    injury_company: 0.005,
    injury_employee: 0,
    maternity_company: 0.01,
    maternity_employee: 0,
    housing_fund_company: 0.12,
    housing_fund_employee: 0.12,
  }

  it('应该接受有效的城市社保标准', () => {
    expect(validateCityStandard(validStandard)).toEqual({ isValid: true, errors: [] })
  })

  it('应该拒绝空的城市名称', () => {
    const result = validateCityStandard({ ...validStandard, city_name: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('城市名称不能为空')
  })

  it('应该拒绝无效的年份', () => {
    let result = validateCityStandard({ ...validStandard, year: 1999 })
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('年份应在2000-2100之间')

    result = validateCityStandard({ ...validStandard, year: 2101 })
    expect(result.isValid).toBe(false)
  })

  it('应该拒绝无效的基数', () => {
    let result = validateCityStandard({ ...validStandard, base_min: -1 })
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('社保基数下限不能为空或负数')

    result = validateCityStandard({ ...validStandard, base_max: -1 })
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('社保基数上限不能为空或负数')
  })

  it('应该拒绝基数下限大于上限', () => {
    const result = validateCityStandard({ ...validStandard, base_min: 30000, base_max: 2000 })
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('社保基数下限不能大于上限')
  })

  it('应该拒绝无效的比例值', () => {
    let result = validateCityStandard({ ...validStandard, pension_company: 1.5 })
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('pension_company 必须是0-1之间的数字')

    result = validateCityStandard({ ...validStandard, pension_company: -0.1 })
    expect(result.isValid).toBe(false)

    result = validateCityStandard({ ...validStandard, pension_company: null })
    expect(result.isValid).toBe(false)
  })
})
