/**
 * 实时进度查询 API
 * GET /api/calculate/progress/:taskId
 *
 * 轻量级接口，用于轮询获取任务的实时进度
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCalculationTask } from '@/lib/database';
import { handleApiError } from '@/middleware/error-handler';
import { authenticateRequest } from '@/middleware/auth';
import { CalculationTaskManager } from '@/lib/task-manager';
import { createErrorResponse } from '@/middleware/error-handler';
import type { ProgressData, ApiSuccessResponse } from '@/types/api';

/**
 * GET /api/calculate/progress/:taskId
 * 获取任务实时进度（轻量级）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    // ========== 1. 认证 ==========
    const userId = await authenticateRequest(request);

    // ========== 2. 验证任务 ID ==========
    const { taskId } = await params;
    if (!taskId || taskId.length < 10) {
      return createErrorResponse.notFound('任务');
    }

    // ========== 3. 获取任务（仅提取必要字段） ==========
    const task = await getCalculationTask(taskId, userId);
    if (!task) {
      return createErrorResponse.notFound('任务');
    }

    // ========== 4. 计算进度百分比 ==========
    const progressPercentage = CalculationTaskManager.calculateProgress(
      task.processed_employees,
      task.total_employees
    );

    // ========== 5. 组装轻量级响应 ==========
    const data: ProgressData = {
      task_id: task.id,
      status: task.status,
      progress_percentage: progressPercentage,
      processed: task.processed_employees,
      total: task.total_employees,
      message: CalculationTaskManager.getProgressMessage(
        task.status,
        progressPercentage
      ),
    };

    const response: ApiSuccessResponse<ProgressData> = {
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
