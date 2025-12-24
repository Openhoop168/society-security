/**
 * 五险一金计算工具函数
 */

import type { CityStandard, EmployeeSalary, CalculationResult } from '@/types/database';
import { safeParseNumber, roundTo } from './format';

/**
 * 计算员工的年度月平均工资
 * @param salaries 员工工资数据
 * @returns 年度月平均工资
 */
export function calculateAverageSalary(salaries: EmployeeSalary[]): number {
  if (salaries.length === 0) return 0;

  const totalSalary = salaries.reduce((sum, salary) => {
    return sum + safeParseNumber(salary.salary_amount);
  }, 0);

  return totalSalary / salaries.length;
}

/**
 * 确定社保缴费基数
 * @param averageSalary 月平均工资
 * @param cityStandard 城市社保标准
 * @returns 缴费基数
 */
export function determineContributionBase(
  averageSalary: number,
  cityStandard: CityStandard
): number {
  return Math.max(
    safeParseNumber(cityStandard.base_min),
    Math.min(averageSalary, safeParseNumber(cityStandard.base_max))
  );
}

/**
 * 计算五险一金金额
 * @param base 缴费基数
 * @param cityStandard 城市社保标准
 * @returns 五险一金金额对象
 */
export function calculateSocialInsurance(base: number, cityStandard: CityStandard) {
  return {
    pension_company: roundTo(base * safeParseNumber(cityStandard.pension_company), 2),
    pension_employee: roundTo(base * safeParseNumber(cityStandard.pension_employee), 2),
    medical_company: roundTo(base * safeParseNumber(cityStandard.medical_company), 2),
    medical_employee: roundTo(base * safeParseNumber(cityStandard.medical_employee), 2),
    unemployment_company: roundTo(base * safeParseNumber(cityStandard.unemployment_company), 2),
    unemployment_employee: roundTo(base * safeParseNumber(cityStandard.unemployment_employee), 2),
    injury_company: roundTo(base * safeParseNumber(cityStandard.injury_company), 2),
    injury_employee: 0, // 工伤保险个人不缴费
    maternity_company: roundTo(base * safeParseNumber(cityStandard.maternity_company), 2),
    maternity_employee: 0, // 生育保险个人不缴费
    provident_company: roundTo(base * safeParseNumber(cityStandard.provident_company), 2),
    provident_employee: roundTo(base * safeParseNumber(cityStandard.provident_employee), 2),
  };
}

/**
 * 计算公司总缴纳金额
 * @param insurance 五险一金金额对象
 * @returns 公司总缴纳金额
 */
export function calculateCompanyTotal(insurance: ReturnType<typeof calculateSocialInsurance>): number {
  return (
    insurance.pension_company +
    insurance.medical_company +
    insurance.unemployment_company +
    insurance.injury_company +
    insurance.maternity_company +
    insurance.provident_company
  );
}

/**
 * 计算员工总缴纳金额
 * @param insurance 五险一金金额对象
 * @returns 员工总缴纳金额
 */
export function calculateEmployeeTotal(insurance: ReturnType<typeof calculateSocialInsurance>): number {
  return (
    insurance.pension_employee +
    insurance.medical_employee +
    insurance.unemployment_employee +
    insurance.injury_employee +
    insurance.maternity_employee +
    insurance.provident_employee
  );
}

/**
 * 完整的计算流程
 * @param employeeId 员工ID
 * @param salaries 员工工资数据
 * @param cityStandard 城市社保标准
 * @param calculationYear 计算年份
 * @param created_by 创建者用户ID
 * @param cityId 城市ID
 * @returns 计算结果
 */
export function calculateFullResult(
  employeeId: string,
  salaries: EmployeeSalary[],
  cityStandard: CityStandard,
  calculationYear: number,
  created_by: string,
  cityId?: string
): Omit<CalculationResult, 'id' | 'created_at'> {
  const avgSalary = calculateAverageSalary(salaries);
  const contributionBase = determineContributionBase(avgSalary, cityStandard);
  const insurance = calculateSocialInsurance(contributionBase, cityStandard);
  const companyTotal = calculateCompanyTotal(insurance);
  const employeeTotal = calculateEmployeeTotal(insurance);

  // 获取员工姓名（从第一条工资记录获取）
  const employeeName = salaries[0]?.employee_name || `员工${employeeId}`;

  return {
    employee_name: employeeName,
    avg_salary: roundTo(avgSalary, 2),
    contribution_base: roundTo(contributionBase, 2),
    ...insurance,
    total_company: roundTo(companyTotal, 2),
    total_employee: roundTo(employeeTotal, 2),
    total_all: roundTo(companyTotal + employeeTotal, 2),
    calculation_year: calculationYear,
    created_by,
    city_id: cityId,
  };
}