/**
 * 任务详情 API
 * GET /api/calculate/tasks/:id
 *
 * 查询计算任务的详细状态和结果
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCalculationTask } from '@/lib/database';
import { handleApiError } from '@/middleware/error-handler';
import { authenticateRequest } from '@/middleware/auth';
import { CalculationTaskManager } from '@/lib/task-manager';
import { createErrorResponse } from '@/middleware/error-handler';
import type { TaskStatusData, ApiSuccessResponse } from '@/types/api';

/**
 * GET /api/calculate/tasks/:id
 * 获取任务详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ========== 1. 认证 ==========
    const userId = await authenticateRequest(request);

    // ========== 2. 验证任务 ID ==========
    const { id: taskId } = await params;
    if (!taskId || taskId.length < 10) {
      return createErrorResponse.notFound('任务');
    }

    // ========== 3. 获取任务 ==========
    const task = await getCalculationTask(taskId, userId);
    if (!task) {
      return createErrorResponse.notFound('任务');
    }

    // ========== 4. 计算进度百分比 ==========
    const progressPercentage = CalculationTaskManager.calculateProgress(
      task.processed_employees,
      task.total_employees
    );

    // ========== 5. 组装响应数据 ==========
    const data: TaskStatusData = {
      id: task.id,
      task_name: task.task_name,
      status: task.status,
      total_employees: task.total_employees,
      processed_employees: task.processed_employees,
      progress_percentage: progressPercentage,
      city_name: task.city_name || '佛山',
      calculation_year: task.calculation_year,
      error_message: task.error_message,
      summary: task.summary as any,
      created_at: task.created_at || '',
      started_at: task.started_at,
      completed_at: task.completed_at,
    };

    const response: ApiSuccessResponse<TaskStatusData> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    // ========== 6. 统一错误处理 ==========
    return handleApiError(error);
  }
}

/**
 * OPTIONS 方法支持（用于 CORS 预检）
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, OPTIONS',
    },
  });
}
