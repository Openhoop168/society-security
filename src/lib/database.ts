/**
 * 数据库操作工具函数
 * 基于 Supabase 和新的数据库 Schema
 * 创建时间: 2025-12-23
 * 版本: v0.2.0
 */

import { supabase } from './supabase'
import type {
  CityStandard,
  EmployeeSalary,
  CalculationResult,
  UploadTask,
  CalculationTask,
  UserSettings,
  TaskStatus,
} from '@/types/database'

// =====================================================
// 数据库服务类
// =====================================================

export class DatabaseService {
  // -----------------------------------------------------
  // 连接测试
  // -----------------------------------------------------

  /**
   * 测试数据库连接
   */
  static async testConnection(): Promise<{
    success: boolean
    error?: string
    data?: { cities: number; salaries: number; results: number }
  }> {
    try {
      // 并行查询各表的记录数
      const [{ count: cities }, { count: salaries }, { count: results }] = await Promise.all([
        supabase.from('cities').select('*', { count: 'exact', head: true }),
        supabase.from('salaries').select('*', { count: 'exact', head: true }),
        supabase.from('results').select('*', { count: 'exact', head: true }),
      ])

      if (cities === null || salaries === null || results === null) {
        return { success: false, error: '查询失败' }
      }

      return {
        success: true,
        data: {
          cities,
          salaries,
          results,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      }
    }
  }

  // -----------------------------------------------------
  // 城市社保标准 (cities)
  // -----------------------------------------------------

  /**
   * 获取所有城市标准
   */
  static async getCities(): Promise<CityStandard[]> {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('year', { ascending: false })
      .order('city_name', { ascending: true })

    if (error) {
      throw new Error(`获取城市数据失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 根据城市和年份获取标准
   */
  static async getCityByYearAndName(
    year: number,
    cityName: string = '佛山'
  ): Promise<CityStandard | null> {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('year', year)
      .eq('city_name', cityName)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`获取城市数据失败: ${error.message}`)
    }

    return data
  }

  /**
   * 创建城市标准
   */
  static async createCity(
    city: Omit<CityStandard, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CityStandard> {
    const { data, error } = await supabase
      .from('cities')
      .insert(city)
      .select()
      .single()

    if (error) {
      throw new Error(`创建城市数据失败: ${error.message}`)
    }

    return data
  }

  /**
   * 更新城市标准
   */
  static async updateCity(
    id: string,
    updates: Partial<Omit<CityStandard, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<CityStandard> {
    const { data, error } = await supabase
      .from('cities')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`更新城市数据失败: ${error.message}`)
    }

    return data
  }

  /**
   * 删除城市标准
   */
  static async deleteCity(id: string): Promise<void> {
    const { error } = await supabase.from('cities').delete().eq('id', id)

    if (error) {
      throw new Error(`删除城市数据失败: ${error.message}`)
    }
  }

  // -----------------------------------------------------
  // 员工工资数据 (salaries)
  // -----------------------------------------------------

  /**
   * 获取当前用户的所有工资数据
   */
  static async getSalaries(userId: string): Promise<EmployeeSalary[]> {
    const { data, error } = await supabase
      .from('salaries')
      .select('*')
      .eq('created_by', userId)
      .order('year_month', { ascending: false })

    if (error) {
      throw new Error(`获取工资数据失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 根据员工姓名获取工资数据
   */
  static async getSalariesByEmployee(
    userId: string,
    employeeName: string
  ): Promise<EmployeeSalary[]> {
    const { data, error } = await supabase
      .from('salaries')
      .select('*')
      .eq('created_by', userId)
      .eq('employee_name', employeeName)
      .order('year_month', { ascending: true })

    if (error) {
      throw new Error(`获取员工工资数据失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 根据年份获取工资数据
   */
  static async getSalariesByYear(userId: string, year: number): Promise<EmployeeSalary[]> {
    const { data, error } = await supabase
      .from('salaries')
      .select('*')
      .eq('created_by', userId)
      .gte('year_month', year * 100)
      .lt('year_month', (year + 1) * 100)
      .order('year_month', { ascending: true })

    if (error) {
      throw new Error(`获取年度工资数据失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 创建单条工资记录
   */
  static async createSalary(
    userId: string,
    salary: Omit<EmployeeSalary, 'id' | 'created_at' | 'updated_at' | 'created_by'>
  ): Promise<EmployeeSalary> {
    const { data, error } = await supabase
      .from('salaries')
      .insert({ ...salary, created_by: userId })
      .select()
      .single()

    if (error) {
      throw new Error(`创建工资数据失败: ${error.message}`)
    }

    return data
  }

  /**
   * 批量创建工资记录
   */
  static async createSalariesBatch(
    userId: string,
    salaries: Omit<EmployeeSalary, 'id' | 'created_at' | 'updated_at' | 'created_by'>[]
  ): Promise<EmployeeSalary[]> {
    const records = salaries.map((s) => ({ ...s, created_by: userId }))

    const { data, error } = await supabase
      .from('salaries')
      .insert(records)
      .select()

    if (error) {
      throw new Error(`批量创建工资数据失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 删除工资记录
   */
  static async deleteSalary(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('salaries')
      .delete()
      .eq('id', id)
      .eq('created_by', userId) // RLS 保护

    if (error) {
      throw new Error(`删除工资数据失败: ${error.message}`)
    }
  }

  /**
   * 删除用户的所有工资数据
   */
  static async deleteAllSalaries(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('salaries')
      .delete({ count: 'exact' })
      .eq('created_by', userId)

    if (error) {
      throw new Error(`清空工资数据失败: ${error.message}`)
    }

    return count || 0
  }

  // -----------------------------------------------------
  // 计算结果 (results)
  // -----------------------------------------------------

  /**
   * 获取用户的所有计算结果
   */
  static async getResults(userId: string): Promise<CalculationResult[]> {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`获取计算结果失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 分页获取计算结果
   */
  static async getResultsPaginated(
    userId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{
    data: CalculationResult[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    let query = supabase
      .from('results')
      .select('*', { count: 'exact' })
      .eq('created_by', userId)

    // 搜索功能
    if (search) {
      query = query.ilike('employee_name', `%${search}%`)
    }

    // 排序
    query = query.order(sortBy as any, { ascending: sortOrder === 'asc' })

    // 分页
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`获取计算结果失败: ${error.message}`)
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages,
    }
  }

  /**
   * 根据年份获取计算结果
   */
  static async getResultsByYear(
    userId: string,
    year: number
  ): Promise<CalculationResult[]> {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('created_by', userId)
      .eq('calculation_year', year)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`获取年度计算结果失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 创建单条计算结果
   */
  static async createResult(
    userId: string,
    result: Omit<CalculationResult, 'id' | 'created_at' | 'created_by'>
  ): Promise<CalculationResult> {
    const { data, error } = await supabase
      .from('results')
      .insert({ ...result, created_by: userId })
      .select()
      .single()

    if (error) {
      throw new Error(`创建计算结果失败: ${error.message}`)
    }

    return data
  }

  /**
   * 批量创建计算结果
   */
  static async createResultsBatch(
    userId: string,
    results: Omit<CalculationResult, 'id' | 'created_at' | 'created_by'>[]
  ): Promise<CalculationResult[]> {
    const records = results.map((r) => ({ ...r, created_by: userId }))

    const { data, error } = await supabase
      .from('results')
      .insert(records)
      .select()

    if (error) {
      throw new Error(`批量创建计算结果失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 删除单条计算结果
   */
  static async deleteResult(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('results')
      .delete()
      .eq('id', id)
      .eq('created_by', userId)

    if (error) {
      throw new Error(`删除计算结果失败: ${error.message}`)
    }
  }

  /**
   * 删除用户的所有计算结果
   */
  static async deleteAllResults(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('results')
      .delete({ count: 'exact' })
      .eq('created_by', userId)

    if (error) {
      throw new Error(`清空计算结果失败: ${error.message}`)
    }

    return count || 0
  }

  // -----------------------------------------------------
  // 上传任务 (upload_tasks)
  // -----------------------------------------------------

  /**
   * 创建上传任务
   */
  static async createUploadTask(
    userId: string,
    task: Omit<UploadTask, 'id' | 'created_at' | 'created_by'>
  ): Promise<UploadTask> {
    const { data, error } = await supabase
      .from('upload_tasks')
      .insert({ ...task, created_by: userId })
      .select()
      .single()

    if (error) {
      throw new Error(`创建上传任务失败: ${error.message}`)
    }

    return data
  }

  /**
   * 更新上传任务
   */
  static async updateUploadTask(
    id: string,
    userId: string,
    updates: Partial<
      Omit<UploadTask, 'id' | 'created_at' | 'created_by' | 'file_name' | 'task_name'>
    >
  ): Promise<UploadTask> {
    const { data, error } = await supabase
      .from('upload_tasks')
      .update(updates)
      .eq('id', id)
      .eq('created_by', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`更新上传任务失败: ${error.message}`)
    }

    return data
  }

  /**
   * 获取上传任务
   */
  static async getUploadTask(id: string, userId: string): Promise<UploadTask | null> {
    const { data, error } = await supabase
      .from('upload_tasks')
      .select('*')
      .eq('id', id)
      .eq('created_by', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`获取上传任务失败: ${error.message}`)
    }

    return data
  }

  /**
   * 获取用户的所有上传任务
   */
  static async getUploadTasks(
    userId: string,
    status?: TaskStatus
  ): Promise<UploadTask[]> {
    let query = supabase
      .from('upload_tasks')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`获取上传任务列表失败: ${error.message}`)
    }

    return data || []
  }

  // -----------------------------------------------------
  // 计算任务 (calculation_tasks)
  // -----------------------------------------------------

  /**
   * 创建计算任务
   */
  static async createCalculationTask(
    userId: string,
    task: Omit<CalculationTask, 'id' | 'created_at' | 'created_by'>
  ): Promise<CalculationTask> {
    const { data, error } = await supabase
      .from('calculation_tasks')
      .insert({ ...task, created_by: userId })
      .select()
      .single()

    if (error) {
      throw new Error(`创建计算任务失败: ${error.message}`)
    }

    return data
  }

  /**
   * 更新计算任务
   */
  static async updateCalculationTask(
    id: string,
    userId: string,
    updates: Partial<
      Omit<
        CalculationTask,
        'id' | 'created_at' | 'created_by' | 'task_name' | 'calculation_year'
      >
    >
  ): Promise<CalculationTask> {
    const { data, error } = await supabase
      .from('calculation_tasks')
      .update(updates)
      .eq('id', id)
      .eq('created_by', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`更新计算任务失败: ${error.message}`)
    }

    return data
  }

  /**
   * 获取计算任务
   */
  static async getCalculationTask(
    id: string,
    userId: string
  ): Promise<CalculationTask | null> {
    const { data, error } = await supabase
      .from('calculation_tasks')
      .select('*')
      .eq('id', id)
      .eq('created_by', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`获取计算任务失败: ${error.message}`)
    }

    return data
  }

  /**
   * 获取用户的所有计算任务
   */
  static async getCalculationTasks(
    userId: string,
    status?: TaskStatus
  ): Promise<CalculationTask[]> {
    let query = supabase
      .from('calculation_tasks')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`获取计算任务列表失败: ${error.message}`)
    }

    return data || []
  }

  // -----------------------------------------------------
  // 用户设置 (user_settings)
  // -----------------------------------------------------

  /**
   * 获取用户设置
   */
  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`获取用户设置失败: ${error.message}`)
    }

    return data
  }

  /**
   * 创建或更新用户设置
   */
  static async upsertUserSettings(
    userId: string,
    settings: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ ...settings, user_id: userId })
      .select()
      .single()

    if (error) {
      throw new Error(`保存用户设置失败: ${error.message}`)
    }

    return data
  }

  // -----------------------------------------------------
  // 统计查询
  // -----------------------------------------------------

  /**
   * 获取员工工资汇总（按员工分组）
   */
  static async getEmployeeSalarySummary(
    userId: string,
    year: number
  ): Promise<
    Array<{
      employee_id: string
      employee_name: string
      avg_salary: number
      total_salary: number
      months_count: number
    }>
  > {
    const { data, error } = await supabase
      .from('salaries')
      .select('employee_id, employee_name, salary_amount, year_month')
      .eq('created_by', userId)
      .gte('year_month', year * 100)
      .lt('year_month', (year + 1) * 100)
      .order('employee_name')

    if (error) {
      throw new Error(`获取工资汇总失败: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return []
    }

    // 按员工分组
    const summaryMap = new Map<
      string,
      {
        employee_id: string
        employee_name: string
        salaries: number[]
      }
    >()

    data.forEach((record) => {
      const key = record.employee_id
      const existing = summaryMap.get(key)
      if (existing) {
        existing.salaries.push(record.salary_amount)
      } else {
        summaryMap.set(key, {
          employee_id: record.employee_id,
          employee_name: record.employee_name,
          salaries: [record.salary_amount],
        })
      }
    })

    // 计算汇总
    return Array.from(summaryMap.values()).map((item) => ({
      employee_id: item.employee_id,
      employee_name: item.employee_name,
      avg_salary:
        item.salaries.reduce((sum, s) => sum + s, 0) / item.salaries.length,
      total_salary: item.salaries.reduce((sum, s) => sum + s, 0),
      months_count: item.salaries.length,
    }))
  }

  /**
   * 获取计算结果汇总
   */
  static async getCalculationSummary(
    userId: string,
    year: number
  ): Promise<{
    employee_count: number
    total_company_cost: number
    total_employee_cost: number
    total_cost: number
    avg_cost_per_employee: number
  } | null> {
    const { data, error } = await supabase
      .from('results')
      .select('total_company, total_employee')
      .eq('created_by', userId)
      .eq('calculation_year', year)

    if (error) {
      throw new Error(`获取计算汇总失败: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return null
    }

    const employee_count = data.length
    const total_company_cost = data.reduce((sum, r) => sum + r.total_company, 0)
    const total_employee_cost = data.reduce((sum, r) => sum + r.total_employee, 0)
    const total_cost = total_company_cost + total_employee_cost
    const avg_cost_per_employee = total_cost / employee_count

    return {
      employee_count,
      total_company_cost,
      total_employee_cost,
      total_cost,
      avg_cost_per_employee,
    }
  }

  // -----------------------------------------------------
  // 调用数据库函数
  // -----------------------------------------------------

  /**
   * 调用计算月度五险一金函数
   */
  static async calculateMonthlyContribution(
    salaryAmount: number,
    cityName: string = '佛山',
    calculationYear: number = new Date().getFullYear()
  ): Promise<{
    base_min: number
    base_max: number
    contribution_base: number
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
    total_company: number
    total_employee: number
    total_all: number
  } | null> {
    const { data, error } = await supabase.rpc('calculate_monthly_contribution', {
      p_salary_amount: salaryAmount,
      p_city_name: cityName,
      p_calculation_year: calculationYear,
    })

    if (error) {
      throw new Error(`计算五险一金失败: ${error.message}`)
    }

    return data?.[0] || null
  }

  /**
   * 批量计算五险一金
   */
  static async batchCalculateContributions(
    userId: string,
    cityName: string = '佛山',
    calculationYear: number = new Date().getFullYear()
  ): Promise<{
    success: boolean
    message: string
    processed_count: number
    error_count: number
  } | null> {
    const { data, error } = await supabase.rpc('batch_calculate_contributions', {
      p_user_id: userId,
      p_city_name: cityName,
      p_calculation_year: calculationYear,
    })

    if (error) {
      throw new Error(`批量计算失败: ${error.message}`)
    }

    return data?.[0] || null
  }
}

// =====================================================
// 导出便捷函数
// =====================================================

// 连接测试
export const testConnection = DatabaseService.testConnection

// Cities
export const getCities = DatabaseService.getCities
export const getCityByYearAndName = DatabaseService.getCityByYearAndName
export const createCity = DatabaseService.createCity
export const updateCity = DatabaseService.updateCity
export const deleteCity = DatabaseService.deleteCity

// Salaries
export const getSalaries = DatabaseService.getSalaries
export const getSalariesByEmployee = DatabaseService.getSalariesByEmployee
export const getSalariesByYear = DatabaseService.getSalariesByYear
export const createSalary = DatabaseService.createSalary
export const createSalariesBatch = DatabaseService.createSalariesBatch
export const deleteSalary = DatabaseService.deleteSalary
export const deleteAllSalaries = DatabaseService.deleteAllSalaries

// Results
export const getResults = DatabaseService.getResults
export const getResultsPaginated = DatabaseService.getResultsPaginated
export const getResultsByYear = DatabaseService.getResultsByYear
export const createResult = DatabaseService.createResult
export const createResultsBatch = DatabaseService.createResultsBatch
export const deleteResult = DatabaseService.deleteResult
export const deleteAllResults = DatabaseService.deleteAllResults

// Upload Tasks
export const createUploadTask = DatabaseService.createUploadTask
export const updateUploadTask = DatabaseService.updateUploadTask
export const getUploadTask = DatabaseService.getUploadTask
export const getUploadTasks = DatabaseService.getUploadTasks

// Calculation Tasks
export const createCalculationTask = DatabaseService.createCalculationTask
export const updateCalculationTask = DatabaseService.updateCalculationTask
export const getCalculationTask = DatabaseService.getCalculationTask
export const getCalculationTasks = DatabaseService.getCalculationTasks

// User Settings
export const getUserSettings = DatabaseService.getUserSettings
export const upsertUserSettings = DatabaseService.upsertUserSettings

// Statistics
export const getEmployeeSalarySummary = DatabaseService.getEmployeeSalarySummary
export const getCalculationSummary = DatabaseService.getCalculationSummary

// Functions
export const calculateMonthlyContribution = DatabaseService.calculateMonthlyContribution
export const batchCalculateContributions = DatabaseService.batchCalculateContributions
