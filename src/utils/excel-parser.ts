/**
 * Excel 解析和验证工具函数
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import * as XLSX from 'xlsx'
import type {
  ParsedSalaryData,
  ParsedCityData,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '@/types/upload'
import { SALARY_EXCEL_COLUMNS, CITY_EXCEL_COLUMNS } from '@/types/upload'

// =====================================================
// Excel 解析函数
// =====================================================

/**
 * 解析 Excel 文件为 JSON 数据
 */
export function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })

        // 获取第一个工作表
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // 转换为 JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: null,
        })

        resolve(jsonData)
      } catch (error) {
        reject(new Error(`Excel 解析失败: ${error instanceof Error ? error.message : '未知错误'}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * 解析工资数据 Excel
 */
export async function parseSalaryExcel(file: File): Promise<{
  data: ParsedSalaryData[]
  validation: ValidationResult
}> {
  const jsonData = await parseExcelFile(file)
  const salaries: ParsedSalaryData[] = []
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  jsonData.forEach((row: any, index) => {
    const rowNumber = index + 2 // Excel 行号（从1开始，第1行是表头）

    try {
      // 提取必填字段
      const employee_id = String(row['员工工号'] || row['employee_id'] || '').trim()
      const employee_name = String(row['员工姓名'] || row['employee_name'] || '').trim()
      const year_month = Number(row['年月份'] || row['year_month'] || 0)
      const salary_amount = Number(row['工资金额'] || row['salary_amount'] || 0)

      // 提取可选字段
      const department = String(row['部门'] || row['department'] || '').trim() || undefined
      const position = String(row['职位'] || row['position'] || '').trim() || undefined

      // 验证必填字段
      if (!employee_id) {
        errors.push({
          row: rowNumber,
          field: 'employee_id',
          value: row['员工工号'] || row['employee_id'],
          message: '员工工号不能为空',
        })
        return
      }

      if (!employee_name) {
        errors.push({
          row: rowNumber,
          field: 'employee_name',
          value: row['员工姓名'] || row['employee_name'],
          message: '员工姓名不能为空',
        })
        return
      }

      if (!year_month || year_month < 200001 || year_month > 209912) {
        errors.push({
          row: rowNumber,
          field: 'year_month',
          value: row['年月份'] || row['year_month'],
          message: '年月份格式不正确（应为 YYYYMM，如 202501）',
        })
        return
      }

      if (!salary_amount || salary_amount <= 0) {
        errors.push({
          row: rowNumber,
          field: 'salary_amount',
          value: row['工资金额'] || row['salary_amount'],
          message: '工资金额必须大于 0',
        })
        return
      }

      // 添加警告
      if (salary_amount < 2000) {
        warnings.push({
          row: rowNumber,
          field: 'salary_amount',
          value: salary_amount,
          message: '工资金额低于最低工资标准',
        })
      }

      if (salary_amount > 1000000) {
        warnings.push({
          row: rowNumber,
          field: 'salary_amount',
          value: salary_amount,
          message: '工资金额异常偏高',
        })
      }

      salaries.push({
        employee_id,
        employee_name,
        year_month,
        salary_amount,
        department,
        position,
        row_number: rowNumber,
      })
    } catch (error) {
      errors.push({
        row: rowNumber,
        field: 'unknown',
        value: row,
        message: error instanceof Error ? error.message : '解析失败',
      })
    }
  })

  const validation: ValidationResult = {
    valid: errors.length === 0,
    errors,
    warnings,
    totalRows: jsonData.length,
    validRows: salaries.length,
    invalidRows: errors.length,
  }

  return { data: salaries, validation }
}

/**
 * 解析城市数据 Excel
 */
export async function parseCityExcel(file: File): Promise<{
  data: ParsedCityData[]
  validation: ValidationResult
}> {
  const jsonData = await parseExcelFile(file)
  const cities: ParsedCityData[] = []
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  jsonData.forEach((row: any, index) => {
    const rowNumber = index + 2

    try {
      // 提取必填字段
      const city_name = String(row['城市名称'] || row['city_name'] || '').trim()
      const year = Number(row['年份'] || row['year'] || 0)
      const base_min = Number(row['基数下限'] || row['base_min'] || 0)
      const base_max = Number(row['基数上限'] || row['base_max'] || 0)
      const pension_company = Number(row['养老公司比例'] || row['pension_company'] || 0)
      const pension_employee = Number(row['养老个人比例'] || row['pension_employee'] || 0)
      const medical_company = Number(row['医疗公司比例'] || row['medical_company'] || 0)
      const medical_employee = Number(row['医疗个人比例'] || row['medical_employee'] || 0)
      const unemployment_company = Number(row['失业公司比例'] || row['unemployment_company'] || 0)
      const unemployment_employee = Number(row['失业个人比例'] || row['unemployment_employee'] || 0)
      const injury_company = Number(row['工伤公司比例'] || row['injury_company'] || 0)
      const maternity_company = Number(row['生育公司比例'] || row['maternity_company'] || 0)
      const provident_company = Number(row['公积金公司比例'] || row['provident_company'] || 0)
      const provident_employee = Number(row['公积金个人比例'] || row['provident_employee'] || 0)

      // 验证必填字段
      if (!city_name) {
        errors.push({
          row: rowNumber,
          field: 'city_name',
          value: row['城市名称'] || row['city_name'],
          message: '城市名称不能为空',
        })
        return
      }

      if (!year || year < 2000 || year > 2100) {
        errors.push({
          row: rowNumber,
          field: 'year',
          value: row['年份'] || row['year'],
          message: '年份不正确（应为 2000-2100 之间）',
        })
        return
      }

      if (!base_min || base_min <= 0) {
        errors.push({
          row: rowNumber,
          field: 'base_min',
          value: row['基数下限'] || row['base_min'],
          message: '基数下限必须大于 0',
        })
        return
      }

      if (!base_max || base_max <= 0) {
        errors.push({
          row: rowNumber,
          field: 'base_max',
          value: row['基数上限'] || row['base_max'],
          message: '基数上限必须大于 0',
        })
        return
      }

      if (base_min > base_max) {
        errors.push({
          row: rowNumber,
          field: 'base_min',
          value: base_min,
          message: '基数下限不能大于基数上限',
        })
        return
      }

      // 验证比例字段（0-1 之间）
      const ratios = [
        { field: 'pension_company', value: pension_company, name: '养老公司比例' },
        { field: 'pension_employee', value: pension_employee, name: '养老个人比例' },
        { field: 'medical_company', value: medical_company, name: '医疗公司比例' },
        { field: 'medical_employee', value: medical_employee, name: '医疗个人比例' },
        { field: 'unemployment_company', value: unemployment_company, name: '失业公司比例' },
        { field: 'unemployment_employee', value: unemployment_employee, name: '失业个人比例' },
        { field: 'injury_company', value: injury_company, name: '工伤公司比例' },
        { field: 'maternity_company', value: maternity_company, name: '生育公司比例' },
        { field: 'provident_company', value: provident_company, name: '公积金公司比例' },
        { field: 'provident_employee', value: provident_employee, name: '公积金个人比例' },
      ]

      for (const ratio of ratios) {
        if (ratio.value < 0 || ratio.value > 1) {
          errors.push({
            row: rowNumber,
            field: ratio.field,
            value: ratio.value,
            message: `${ratio.name}必须在 0-1 之间（0.14 表示 14%）`,
          })
          return
        }
      }

      cities.push({
        city_name,
        year,
        base_min,
        base_max,
        pension_company,
        pension_employee,
        medical_company,
        medical_employee,
        unemployment_company,
        unemployment_employee,
        injury_company,
        maternity_company,
        provident_company,
        provident_employee,
        row_number: rowNumber,
      })
    } catch (error) {
      errors.push({
        row: rowNumber,
        field: 'unknown',
        value: row,
        message: error instanceof Error ? error.message : '解析失败',
      })
    }
  })

  const validation: ValidationResult = {
    valid: errors.length === 0,
    errors,
    warnings,
    totalRows: jsonData.length,
    validRows: cities.length,
    invalidRows: errors.length,
  }

  return { data: cities, validation }
}

// =====================================================
// 数据验证函数
// =====================================================

/**
 * 验证工资数据
 */
export function validateSalaryData(salaries: ParsedSalaryData[]): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  salaries.forEach((salary) => {
    // 检查重复记录
    const duplicates = salaries.filter(
      (s) =>
        s.employee_id === salary.employee_id &&
        s.year_month === salary.year_month &&
        s.row_number !== salary.row_number
    )

    if (duplicates.length > 0) {
      warnings.push({
        row: salary.row_number,
        field: 'employee_id',
        value: salary.employee_id,
        message: `存在重复记录（行号: ${duplicates.map((d) => d.row_number).join(', ')}）`,
      })
    }

    // 检查工资合理性
    if (salary.salary_amount < 2000) {
      warnings.push({
        row: salary.row_number,
        field: 'salary_amount',
        value: salary.salary_amount,
        message: '工资金额低于最低工资标准',
      })
    }

    if (salary.salary_amount > 100000) {
      warnings.push({
        row: salary.row_number,
        field: 'salary_amount',
        value: salary.salary_amount,
        message: '工资金额异常偏高',
      })
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    totalRows: salaries.length,
    validRows: salaries.length - errors.length,
    invalidRows: errors.length,
  }
}

/**
 * 验证城市数据
 */
export function validateCityData(cities: ParsedCityData[]): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  cities.forEach((city) => {
    // 检查重复记录
    const duplicates = cities.filter(
      (c) =>
        c.city_name === city.city_name &&
        c.year === city.year &&
        c.row_number !== city.row_number
    )

    if (duplicates.length > 0) {
      warnings.push({
        row: city.row_number,
        field: 'city_name',
        value: city.city_name,
        message: `存在重复记录（行号: ${duplicates.map((d) => d.row_number).join(', ')}）`,
      })
    }

    // 检查基数合理性
    if (city.base_max < city.base_min) {
      errors.push({
        row: city.row_number,
        field: 'base_max',
        value: city.base_max,
        message: '基数上限不能小于基数下限',
      })
    }

    // 检查比例总和
    const companyTotal =
      city.pension_company +
      city.medical_company +
      city.unemployment_company +
      city.injury_company +
      city.maternity_company +
      city.provident_company

    if (companyTotal > 0.5) {
      warnings.push({
        row: city.row_number,
        field: 'total',
        value: companyTotal,
        message: `公司缴费比例总和偏高 (${(companyTotal * 100).toFixed(2)}%)`,
      })
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    totalRows: cities.length,
    validRows: cities.length - errors.length,
    invalidRows: errors.length,
  }
}
