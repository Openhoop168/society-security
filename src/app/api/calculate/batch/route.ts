/**
 * 批量计算 API
 * POST /api/calculate/batch
 *
 * 创建并启动五险一金批量计算任务
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { CalculationTaskManager } from '@/lib/task-manager';
import { handleApiError } from '@/middleware/error-handler';
import { authenticateRequest } from '@/middleware/auth';
import { ValidationError } from '@/lib/errors';
import type { BatchCalculateRequest, ApiSuccessResponse } from '@/types/api';

/**
 * POST /api/calculate/batch
 * 创建批量计算任务
 */
export async function POST(request: NextRequest) {
  try {
    // ========== 1. 认证 ==========
    const userId = await authenticateRequest(request);

    // ========== 2. 解析请求体 ==========
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError('请求体格式错误，请提供有效的 JSON 数据');
    }

    const { city_name, calculation_year, upload_task_id } = body;

    // ========== 3. 验证参数 ==========
    if (calculation_year !== undefined) {
      const year = Number(calculation_year);
      if (isNaN(year) || year < 2000 || year > 2100) {
        throw new ValidationError(
          '年份必须在 2000-2100 之间',
          { field: 'calculation_year', value: calculation_year }
        );
      }
    }

    if (city_name !== undefined && typeof city_name !== 'string') {
      throw new ValidationError(
        '城市名称必须是字符串',
        { field: 'city_name', value: city_name }
      );
    }

    if (upload_task_id !== undefined && typeof upload_task_id !== 'string') {
      throw new ValidationError(
        '上传任务 ID 必须是字符串',
        { field: 'upload_task_id', value: upload_task_id }
      );
    }

    // ========== 4. 创建并启动任务 ==========
    const params: BatchCalculateRequest = {
      city_name,
      calculation_year: calculation_year ? Number(calculation_year) : undefined,
      upload_task_id,
    };

    const result = await CalculationTaskManager.createAndStartBatchTask(userId, params);

    // ========== 5. 返回成功响应 ==========
    const response: ApiSuccessResponse<{
      task_id: string;
      task_name: string;
      status: 'pending';
      total_employees: number;
      city_name: string;
      calculation_year: number;
      message: string;
    }> = {
      success: true,
      data: {
        task_id: result.taskId,
        task_name: `${city_name || '佛山'}${calculation_year || new Date().getFullYear()}年五险一金计算`,
        status: 'pending',
        total_employees: result.totalEmployees,
        city_name: city_name || '佛山',
        calculation_year: calculation_year || new Date().getFullYear(),
        message: `计算任务已创建，共有 ${result.totalEmployees} 名员工待计算`,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
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
      'Allow': 'POST, OPTIONS',
    },
  });
}
