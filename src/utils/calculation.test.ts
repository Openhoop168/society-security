/**
 * 计算逻辑测试
 */
import { describe, it, expect } from 'vitest'
import {
  calculateAverageSalary,
  determineContributionBase,
  calculateSocialInsurance,
  calculateCompanyTotal,
  calculateEmployeeTotal,
  calculateFullResult,
} from './calculation'
import type { CityStandard, EmployeeSalary } from '@/types/database'

describe('calculateAverageSalary', () => {
  it('应该正确计算平均工资', () => {
    const salaries: EmployeeSalary[] = [
      { salary_amount: '5000' } as EmployeeSalary,
      { salary_amount: '6000' } as EmployeeSalary,
      { salary_amount: '7000' } as EmployeeSalary,
    ]
    expect(calculateAverageSalary(salaries)).toBe(6000)
  })

  it('应该处理空数组', () => {
    expect(calculateAverageSalary([])).toBe(0)
  })

  it('应该处理单个工资', () => {
    const salaries: EmployeeSalary[] = [{ salary_amount: '5000' } as EmployeeSalary]
    expect(calculateAverageSalary(salaries)).toBe(5000)
  })

  it('应该处理小数工资', () => {
    const salaries: EmployeeSalary[] = [
      { salary_amount: '5000.5' } as EmployeeSalary,
      { salary_amount: '6000.5' } as EmployeeSalary,
    ]
    expect(calculateAverageSalary(salaries)).toBe(5500.5)
  })

  it('应该处理数字类型工资', () => {
    const salaries: EmployeeSalary[] = [
      { salary_amount: 5000 } as any,
      { salary_amount: 6000 } as any,
    ]
    expect(calculateAverageSalary(salaries)).toBe(5500)
  })
})

describe('determineContributionBase', () => {
  const cityStandard: CityStandard = {
    base_min: 2000,
    base_max: 30000,
  } as CityStandard

  it('应该使用基数下限当平均工资低于下限时', () => {
    expect(determineContributionBase(1500, cityStandard)).toBe(2000)
  })

  it('应该使用基数上限当平均工资高于上限时', () => {
    expect(determineContributionBase(35000, cityStandard)).toBe(30000)
  })

  it('应该使用平均工资在范围内', () => {
    expect(determineContributionBase(10000, cityStandard)).toBe(10000)
  })

  it('应该处理边界值', () => {
    expect(determineContributionBase(2000, cityStandard)).toBe(2000)
    expect(determineContributionBase(30000, cityStandard)).toBe(30000)
  })

  it('应该处理小数平均工资', () => {
    expect(determineContributionBase(10000.56, cityStandard)).toBe(10000.56)
  })
})

describe('calculateSocialInsurance', () => {
  const cityStandard: CityStandard = {
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
    provident_company: 0.12,
    provident_employee: 0.12,
  } as CityStandard

  it('应该正确计算五险一金金额', () => {
    const base = 10000
    const result = calculateSocialInsurance(base, cityStandard)

    expect(result.pension_company).toBe(1400) // 10000 * 0.14
    expect(result.pension_employee).toBe(800) // 10000 * 0.08
    expect(result.medical_company).toBe(600) // 10000 * 0.06
    expect(result.medical_employee).toBe(200) // 10000 * 0.02
    expect(result.unemployment_company).toBe(100) // 10000 * 0.01
    expect(result.unemployment_employee).toBe(50) // 10000 * 0.005
    expect(result.injury_company).toBe(50) // 10000 * 0.005
    expect(result.injury_employee).toBe(0) // 个人不缴费
    expect(result.maternity_company).toBe(100) // 10000 * 0.01
    expect(result.maternity_employee).toBe(0) // 个人不缴费
    expect(result.provident_company).toBe(1200) // 10000 * 0.12
    expect(result.provident_employee).toBe(1200) // 10000 * 0.12
  })

  it('应该正确四舍五入到两位小数', () => {
    const base = 10001
    const result = calculateSocialInsurance(base, cityStandard)

    expect(result.pension_company).toBe(1400.14) // 10001 * 0.14 = 1400.14
    expect(result.pension_employee).toBe(800.08) // 10001 * 0.08 = 800.08
  })

  it('应该处理零基数', () => {
    const result = calculateSocialInsurance(0, cityStandard)
    expect(result.pension_company).toBe(0)
    expect(result.pension_employee).toBe(0)
  })

  it('应该确保工伤和生育保险个人不缴费', () => {
    const result = calculateSocialInsurance(10000, cityStandard)
    expect(result.injury_employee).toBe(0)
    expect(result.maternity_employee).toBe(0)
  })
})

describe('calculateCompanyTotal', () => {
  it('应该正确计算公司总缴纳金额', () => {
    const insurance = {
      pension_company: 1400,
      pension_employee: 800,
      medical_company: 600,
      medical_employee: 200,
      unemployment_company: 100,
      unemployment_employee: 50,
      injury_company: 50,
      injury_employee: 0,
      maternity_company: 100,
      maternity_employee: 0,
      provident_company: 1200,
      provident_employee: 1200,
    }

    const total = calculateCompanyTotal(insurance)
    expect(total).toBe(3450) // 1400+600+100+50+100+1200
  })

  it('应该只计算公司部分', () => {
    const insurance = {
      pension_company: 1000,
      pension_employee: 500,
      medical_company: 500,
      medical_employee: 200,
      unemployment_company: 50,
      unemployment_employee: 25,
      injury_company: 25,
      injury_employee: 0,
      maternity_company: 50,
      maternity_employee: 0,
      provident_company: 600,
      provident_employee: 600,
    }

    const total = calculateCompanyTotal(insurance)
    expect(total).toBe(2225) // 1000+500+50+25+50+600
  })
})

describe('calculateEmployeeTotal', () => {
  it('应该正确计算员工总缴纳金额', () => {
    const insurance = {
      pension_company: 1400,
      pension_employee: 800,
      medical_company: 600,
      medical_employee: 200,
      unemployment_company: 100,
      unemployment_employee: 50,
      injury_company: 50,
      injury_employee: 0,
      maternity_company: 100,
      maternity_employee: 0,
      provident_company: 1200,
      provident_employee: 1200,
    }

    const total = calculateEmployeeTotal(insurance)
    expect(total).toBe(2250) // 800+200+50+0+0+1200
  })

  it('应该只计算员工部分', () => {
    const insurance = {
      pension_company: 1000,
      pension_employee: 500,
      medical_company: 500,
      medical_employee: 200,
      unemployment_company: 50,
      unemployment_employee: 25,
      injury_company: 25,
      injury_employee: 0,
      maternity_company: 50,
      maternity_employee: 0,
      provident_company: 600,
      provident_employee: 600,
    }

    const total = calculateEmployeeTotal(insurance)
    expect(total).toBe(1325) // 500+200+25+0+0+600
  })
})

describe('calculateFullResult', () => {
  const salaries: EmployeeSalary[] = [
    { employee_name: '张三', salary_amount: '5000' } as EmployeeSalary,
    { employee_name: '张三', salary_amount: '6000' } as EmployeeSalary,
    { employee_name: '张三', salary_amount: '7000' } as EmployeeSalary,
  ]

  const cityStandard: CityStandard = {
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
    provident_company: 0.12,
    provident_employee: 0.12,
  } as CityStandard

  it('应该正确计算完整结果', () => {
    const result = calculateFullResult(
      'emp001',
      salaries,
      cityStandard,
      2025,
      'user123',
      'city001'
    )

    expect(result.employee_name).toBe('张三')
    expect(result.avg_salary).toBe(6000)
    expect(result.contribution_base).toBe(6000)
    expect(result.pension_company).toBe(840) // 6000 * 0.14
    expect(result.pension_employee).toBe(480) // 6000 * 0.08
    expect(result.total_company).toBe(2070) // 公司总计
    expect(result.total_employee).toBe(1350) // 员工总计
    expect(result.total_all).toBe(3420) // 总计
    expect(result.calculation_year).toBe(2025)
    expect(result.created_by).toBe('user123')
    expect(result.city_id).toBe('city001')
  })

  it('应该使用基数下限当平均工资过低时', () => {
    const lowSalaries: EmployeeSalary[] = [
      { employee_name: '李四', salary_amount: '1000' } as EmployeeSalary,
      { employee_name: '李四', salary_amount: '1500' } as EmployeeSalary,
    ]

    const result = calculateFullResult(
      'emp002',
      lowSalaries,
      cityStandard,
      2025,
      'user123'
    )

    expect(result.avg_salary).toBe(1250)
    expect(result.contribution_base).toBe(2000) // 使用基数下限
  })

  it('应该使用基数上限当平均工资过高时', () => {
    const highSalaries: EmployeeSalary[] = [
      { employee_name: '王五', salary_amount: '40000' } as EmployeeSalary,
      { employee_name: '王五', salary_amount: '50000' } as EmployeeSalary,
    ]

    const result = calculateFullResult(
      'emp003',
      highSalaries,
      cityStandard,
      2025,
      'user123'
    )

    expect(result.avg_salary).toBe(45000)
    expect(result.contribution_base).toBe(30000) // 使用基数上限
  })

  it('应该处理没有员工姓名的情况', () => {
    const salariesWithoutName: EmployeeSalary[] = [
      { salary_amount: '5000' } as EmployeeSalary,
    ]

    const result = calculateFullResult(
      'emp004',
      salariesWithoutName,
      cityStandard,
      2025,
      'user123'
    )

    expect(result.employee_name).toBe('员工emp004')
  })

  it('应该正确计算总计', () => {
    const result = calculateFullResult(
      'emp001',
      salaries,
      cityStandard,
      2025,
      'user123'
    )

    expect(result.total_all).toBe(result.total_company + result.total_employee)
  })
})
