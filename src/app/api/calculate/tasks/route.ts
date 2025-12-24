/**
 * 任务列表 API
 * GET /api/calculate/tasks
 *
 * 获取用户的所有计算任务
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCalculationTasks } from '@/lib/database';
import { handleApiError } from '@/middleware/error-handler';
import { authenticateRequest } from '@/middleware/auth';
import { CalculationTaskManager } from '@/lib/task-manager';
import type { TaskListItem, ApiSuccessResponse } from '@/types/api';
import type { TaskStatus } from '@/types/database';

/**
 * GET /api/calculate/tasks
 * 获取任务列表
 */
export async function GET(request: NextRequest) {
  try {
    // ========== 1. 认证 ==========
    const userId = await authenticateRequest(request);

    // ========== 2. 解析查询参数 ==========
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as TaskStatus | null;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 验证参数
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'limit 必须在 1-100 之间',
            code: 'INVALID_LIMIT',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'offset 不能为负数',
            code: 'INVALID_OFFSET',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 验证 status 参数
    const validStatuses: TaskStatus[] = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `无效的 status 值，必须是以下之一: ${validStatuses.join(', ')}`,
            code: 'INVALID_STATUS',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // ========== 3. 获取任务列表 ==========
    const tasks = await getCalculationTasks(userId, status || undefined);

    // ========== 4. 分页 ==========
    const paginatedTasks = tasks.slice(offset, offset + limit);

    // ========== 5. 组装响应 ==========
    const taskList: TaskListItem[] = paginatedTasks.map((task) => ({
      id: task.id,
      task_name: task.task_name,
      status: task.status,
      progress_percentage: CalculationTaskManager.calculateProgress(
        task.processed_employees,
        task.total_employees
      ),
      calculation_year: task.calculation_year,
      created_at: task.created_at || '',
      completed_at: task.completed_at,
    }));

    const response: ApiSuccessResponse<{
      tasks: TaskListItem[];
      total: number;
      has_more: boolean;
    }> = {
      success: true,
      data: {
        tasks: taskList,
        total: tasks.length,
        has_more: offset + limit < tasks.length,
      },
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
