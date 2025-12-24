/**
 * 批量数据上传 API 路由
 * 创建时间: 2025-12-23
 * 版本: v0.1.0
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createUploadTask, updateUploadTask, createSalariesBatch, createCity } from '@/lib/database'
import type { ParsedSalaryData, ParsedCityData } from '@/types/upload'

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

    // 获取请求数据
    const body = await request.json()
    const { dataType, data } = body

    if (!dataType || !data || !Array.isArray(data)) {
      return NextResponse.json({ error: '无效的请求数据' }, { status: 400 })
    }

    if (!['salary', 'city'].includes(dataType)) {
      return NextResponse.json({ error: '无效的数据类型' }, { status: 400 })
    }

    // 创建上传任务
    const taskName = dataType === 'salary' ? '批量上传工资数据' : '批量上传城市标准'
    const uploadTask = await createUploadTask(user.id, {
      task_name: taskName,
      file_name: `${dataType}_${Date.now()}.xlsx`,
      total_rows: data.length,
      processed_rows: 0,
      success_rows: 0,
      failed_rows: 0,
      status: 'processing',
    })

    // 异步处理上传
    processUploadAsync(uploadTask.id, user.id, dataType, data).catch((error) => {
      console.error('异步处理上传失败:', error)
    })

    return NextResponse.json({
      success: true,
      taskId: uploadTask.id,
      message: '上传任务已创建',
    })
  } catch (error) {
    console.error('批量上传错误:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '批量上传失败',
      },
      { status: 500 }
    )
  }
}

/**
 * 异步处理上传任务
 */
async function processUploadAsync(
  taskId: string,
  userId: string,
  dataType: string,
  data: (ParsedSalaryData | ParsedCityData)[]
) {
  let successCount = 0
  let failedCount = 0
  const errors: string[] = []

  try {
    if (dataType === 'salary') {
      // 处理工资数据
      const salaries = data as ParsedSalaryData[]

      // 分批插入（每批 100 条）
      const batchSize = 100
      for (let i = 0; i < salaries.length; i += batchSize) {
        const batch = salaries.slice(i, i + batchSize)

        try {
          await createSalariesBatch(
            userId,
            batch.map((s) => ({
              employee_id: s.employee_id,
              employee_name: s.employee_name,
              year_month: s.year_month,
              salary_amount: s.salary_amount,
              department: s.department,
              position: s.position,
            }))
          )
          successCount += batch.length
        } catch (error) {
          failedCount += batch.length
          errors.push(error instanceof Error ? error.message : '批量插入失败')
        }

        // 更新进度
        const processedRows = Math.min(i + batchSize, salaries.length)
        await updateUploadTask(taskId, userId, {
          processed_rows: processedRows,
          success_rows: successCount,
          failed_rows: failedCount,
        })
      }
    } else {
      // 处理城市数据
      const cities = data as ParsedCityData[]

      for (const city of cities) {
        try {
          await createCity({
            city_name: city.city_name,
            year: city.year,
            base_min: city.base_min,
            base_max: city.base_max,
            pension_company: city.pension_company,
            pension_employee: city.pension_employee,
            medical_company: city.medical_company,
            medical_employee: city.medical_employee,
            unemployment_company: city.unemployment_company,
            unemployment_employee: city.unemployment_employee,
            injury_company: city.injury_company,
            maternity_company: city.maternity_company,
            provident_company: city.provident_company,
            provident_employee: city.provident_employee,
          })
          successCount++
        } catch (error) {
          failedCount++
          errors.push(`行 ${city.row_number}: ${error instanceof Error ? error.message : '插入失败'}`)
        }

        // 更新进度
        const processedRows = cities.indexOf(city) + 1
        await updateUploadTask(taskId, userId, {
          processed_rows: processedRows,
          success_rows: successCount,
          failed_rows: failedCount,
        })
      }
    }

    // 更新任务状态为完成
    await updateUploadTask(taskId, userId, {
      status: failedCount > 0 ? 'completed' : 'completed',
      processed_rows: data.length,
      success_rows: successCount,
      failed_rows: failedCount,
      error_message: errors.length > 0 ? errors.join('; ') : undefined,
      summary: {
        total: data.length,
        success: successCount,
        failed: failedCount,
      },
      completed_at: new Date().toISOString(),
    })
  } catch (error) {
    // 更新任务状态为失败
    await updateUploadTask(taskId, userId, {
      status: 'failed',
      error_message: error instanceof Error ? error.message : '上传失败',
      completed_at: new Date().toISOString(),
    })
  }
}
