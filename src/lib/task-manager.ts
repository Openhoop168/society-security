/**
 * 计算任务管理器
 * 负责创建、执行和管理五险一金批量计算任务
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import {
  getCalculationTask,
  createCalculationTask,
  updateCalculationTask,
  getCalculationTasks,
  getSalariesByYear,
  getCalculationSummary,
  getCityByYearAndName,
  batchCalculateContributions,
} from '@/lib/database';
import { NotFoundError, BusinessError, ConflictError } from '@/lib/errors';
import type { BatchCalculateRequest, CalculationSummary } from '@/types/api';
import { supabase } from '@/lib/supabase';

/**
 * 计算任务管理器类
 */
export class CalculationTaskManager {
  /**
   * 创建并启动批量计算任务
   * @param userId 用户 ID
   * @param params 计算参数
   * @returns 任务 ID 和员工总数
   */
  static async createAndStartBatchTask(
    userId: string,
    params: BatchCalculateRequest
  ): Promise<{ taskId: string; totalEmployees: number }> {
    const {
      city_name = '佛山',
      calculation_year = new Date().getFullYear(),
      upload_task_id,
    } = params;

    // 1. 验证年份参数
    if (calculation_year < 2000 || calculation_year > 2100) {
      throw new BusinessError('年份必须在 2000-2100 之间', {
        field: 'calculation_year',
        value: calculation_year,
      });
    }

    // 2. 验证城市标准存在
    const cityStandard = await getCityByYearAndName(calculation_year, city_name);
    if (!cityStandard) {
      throw new NotFoundError(`未找到 ${city_name} ${calculation_year} 年的社保标准`);
    }

    // 3. 检查是否有进行中的任务
    const existingTasks = await getCalculationTasks(userId, 'processing');
    if (existingTasks.length > 0) {
      throw new ConflictError('已有进行中的计算任务，请等待完成后再创建新任务');
    }

    // 4. 获取员工工资数据
    const salaries = await getSalariesByYear(userId, calculation_year);
    if (salaries.length === 0) {
      throw new BusinessError(
        `没有可计算的工资数据。请先上传 ${calculation_year} 年的员工工资数据。`,
        { year: calculation_year }
      );
    }

    // 5. 统计员工数量（按 employee_id 去重）
    const uniqueEmployees = new Set(salaries.map((s) => s.employee_id));
    const totalEmployees = uniqueEmployees.size;

    // 6. 创建计算任务
    const task = await createCalculationTask(userId, {
      task_name: `${city_name}${calculation_year}年五险一金计算`,
      upload_task_id,
      city_name,
      calculation_year,
      total_employees: totalEmployees,
      processed_employees: 0,
      status: 'pending',
    });

    // 7. 异步执行计算（不等待完成）
    this.executeCalculationAsync(task.id, userId, city_name, calculation_year).catch(
      (error) => {
        console.error('[TaskManager] 计算任务执行失败:', error);
      }
    );

    return {
      taskId: task.id,
      totalEmployees,
    };
  }

  /**
   * 异步执行计算任务
   * @param taskId 任务 ID
   * @param userId 用户 ID
   * @param cityName 城市名称
   * @param calculationYear 计算年份
   */
  private static async executeCalculationAsync(
    taskId: string,
    userId: string,
    cityName: string,
    calculationYear: number
  ): Promise<void> {
    let processedCount = 0;
    let errorCount = 0;

    try {
      console.log(`[TaskManager] 开始执行任务 ${taskId}`);

      // ========== 阶段1：任务开始 ==========
      await updateCalculationTask(taskId, userId, {
        status: 'processing',
        started_at: new Date().toISOString(),
        processed_employees: 0,
      });

      // ========== 阶段2：批量计算 ==========
      const result = await batchCalculateContributions(userId, cityName, calculationYear);

      if (!result) {
        throw new Error('批量计算函数返回空值');
      }

      if (!result.success) {
        throw new Error(result.message || '批量计算失败');
      }

      processedCount = result.processed_count || 0;
      errorCount = result.error_count || 0;

      console.log(`[TaskManager] 批量计算完成: 处理 ${processedCount} 条，错误 ${errorCount} 条`);

      // ========== 阶段3：生成摘要 ==========
      const summaryData = await getCalculationSummary(userId, calculationYear);

      if (!summaryData) {
        throw new Error('无法获取计算摘要');
      }

      const summary: CalculationSummary = {
        employee_count: summaryData.employee_count,
        total_company_cost: summaryData.total_company_cost,
        total_employee_cost: summaryData.total_employee_cost,
        average_cost: summaryData.avg_cost_per_employee,
      };

      // ========== 阶段4：任务完成 ==========
      await updateCalculationTask(taskId, userId, {
        status: 'completed',
        processed_employees: processedCount,
        completed_at: new Date().toISOString(),
        summary,
        error_message:
          errorCount > 0 ? `计算完成，但有 ${errorCount} 条记录失败` : undefined,
      });

      console.log(`[TaskManager] 任务 ${taskId} 完成`);
    } catch (error) {
      // ========== 错误处理 ==========
      console.error('[TaskManager] 计算任务失败:', error);

      await updateCalculationTask(taskId, userId, {
        status: 'failed',
        processed_employees: processedCount,
        error_message: error instanceof Error ? error.message : '未知错误',
        completed_at: new Date().toISOString(),
      });

      console.log(`[TaskManager] 任务 ${taskId} 标记为失败`);
    }
  }

  /**
   * 计算进度百分比
   * @param processed 已处理数量
   * @param total 总数量
   * @returns 进度百分比 (0-100)
   */
  static calculateProgress(processed: number, total: number): number {
    if (total === 0) return 0;
    return Math.min(100, Math.floor((processed / total) * 100));
  }

  /**
   * 生成友好的进度消息
   * @param status 任务状态
   * @param progress 进度百分比
   * @returns 状态消息
   */
  static getProgressMessage(status: string, progress: number): string {
    switch (status) {
      case 'pending':
        return '任务等待开始...';
      case 'processing':
        return `正在计算中... ${progress}%`;
      case 'completed':
        return '计算已完成！';
      case 'failed':
        return '计算失败';
      case 'cancelled':
        return '任务已取消';
      default:
        return '';
    }
  }

  /**
   * 取消计算任务
   * @param taskId 任务 ID
   * @param userId 用户 ID
   */
  static async cancelTask(taskId: string, userId: string): Promise<void> {
    const task = await getCalculationTask(taskId, userId);

    if (!task) {
      throw new NotFoundError('任务不存在');
    }

    // 只有 pending 或 processing 状态的任务可以取消
    if (task.status !== 'pending' && task.status !== 'processing') {
      throw new BusinessError('只有待处理或进行中的任务可以取消');
    }

    // 更新任务状态
    await updateCalculationTask(taskId, userId, {
      status: 'cancelled',
      completed_at: new Date().toISOString(),
    });
  }

  /**
   * 删除计算任务
   * @param taskId 任务 ID
   * @param userId 用户 ID
   */
  static async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await getCalculationTask(taskId, userId);

    if (!task) {
      throw new NotFoundError('任务不存在');
    }

    // 只有 completed, failed, cancelled 状态的任务可以删除
    if (task.status === 'pending' || task.status === 'processing') {
      throw new BusinessError('请先取消或等待任务完成后再删除');
    }

    // 注意：这里需要实现 deleteCalculationTask 方法
    // 由于 DatabaseService 中还没有该方法，暂时跳过
    // TODO: 在 DatabaseService 中添加 deleteCalculationTask 方法

    throw new BusinessError('删除功能暂未实现');
  }
}
