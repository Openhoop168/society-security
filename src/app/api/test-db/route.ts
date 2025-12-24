/**
 * 数据库连接测试 API
 * GET /api/test-db
 *
 * 用于测试 Supabase 数据库连接是否正常
 */
import { NextRequest, NextResponse } from 'next/server'
import { testConnection } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const result = await testConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '数据库连接成功！',
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: '数据库连接失败',
          error: result.error,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '数据库测试过程中发生错误',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
