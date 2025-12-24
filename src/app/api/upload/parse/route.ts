/**
 * 文件解析 API 路由
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { parseSalaryExcel, parseCityExcel } from '@/utils/excel-parser'

export async function POST(request: NextRequest) {
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

    // 获取表单数据
    const formData = await request.formData()
    const file = formData.get('file') as File
    const dataType = formData.get('dataType') as string

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 })
    }

    if (!['salary', 'city'].includes(dataType)) {
      return NextResponse.json({ error: '无效的数据类型' }, { status: 400 })
    }

    // 验证文件类型
    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json({ error: '文件格式不支持，请上传 Excel 文件' }, { status: 400 })
    }

    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小超过限制（最大 10MB）' }, { status: 400 })
    }

    // 解析文件
    let result
    if (dataType === 'salary') {
      result = await parseSalaryExcel(file)
    } else {
      result = await parseCityExcel(file)
    }

    // 检查是否有数据
    if (result.data.length === 0) {
      return NextResponse.json(
        { error: '文件中没有有效数据' },
        { status: 400 }
      )
    }

    // 检查是否有错误
    if (!result.validation.valid) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          validation: result.validation,
        },
        { status: 400 }
      )
    }

    // 限制数据量
    const maxRows = 1000
    if (result.data.length > maxRows) {
      return NextResponse.json(
        { error: `数据量超过限制（最大 ${maxRows} 条），请分批上传` },
        { status: 400 }
      )
    }

    // 返回解析结果
    return NextResponse.json({
      success: true,
      data: result.data,
      validation: result.validation,
      message: `成功解析 ${result.data.length} 条数据`,
    })
  } catch (error) {
    console.error('文件解析错误:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '文件解析失败',
      },
      { status: 500 }
    )
  }
}
