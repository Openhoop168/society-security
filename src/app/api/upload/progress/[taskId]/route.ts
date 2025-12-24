/**
 * 上传进度查询 API 路由
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    // 验证用户身份
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { taskId } = await params

    // 查询任务进度
    const { data: task, error } = await supabase
      .from('upload_tasks')
      .select('*')
      .eq('id', taskId)
      .eq('created_by', user.id)
      .single()

    if (error || !task) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 })
    }

    // 计算进度百分比
    const progress =
      task.total_rows > 0 ? (task.processed_rows / task.total_rows) * 100 : 0

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      progress: Math.round(progress),
      message: getStatusMessage(task.status),
      totalRows: task.total_rows,
      processedRows: task.processed_rows,
      successRows: task.success_rows,
      failedRows: task.failed_rows,
    })
  } catch (error) {
    console.error('查询进度错误:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '查询进度失败',
      },
      { status: 500 }
    )
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'pending':
      return '等待处理...'
    case 'processing':
      return '正在处理...'
    case 'completed':
      return '处理完成'
    case 'failed':
      return '处理失败'
    case 'cancelled':
      return '已取消'
    default:
      return '未知状态'
  }
}
