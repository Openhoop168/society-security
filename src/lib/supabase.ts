import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '缺少 Supabase 环境变量。请在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义（与数据库表结构对应）
export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: number
          city_name: string
          year: string
          base_min: number
          base_max: number
          pension_rate_company: number
          medical_rate_company: number
          unemployment_rate_company: number
          injury_rate_company: number
          maternity_rate_company: number
          housing_rate_company: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          city_name: string
          year: string
          base_min: number
          base_max: number
          pension_rate_company: number
          medical_rate_company: number
          unemployment_rate_company: number
          injury_rate_company: number
          maternity_rate_company: number
          housing_rate_company: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          city_name?: string
          year?: string
          base_min?: number
          base_max?: number
          pension_rate_company?: number
          medical_rate_company?: number
          unemployment_rate_company?: number
          injury_rate_company?: number
          maternity_rate_company?: number
          housing_rate_company?: number
          created_at?: string
          updated_at?: string
        }
      }
      salaries: {
        Row: {
          id: number
          employee_id: string
          employee_name: string
          month: string
          salary_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          employee_id: string
          employee_name: string
          month: string
          salary_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          employee_id?: string
          employee_name?: string
          month?: string
          salary_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      results: {
        Row: {
          id: number
          employee_name: string
          avg_salary: number
          contribution_base: number
          pension_company: number
          medical_company: number
          unemployment_company: number
          injury_company: number
          maternity_company: number
          housing_company: number
          total_company: number
          calculation_date: string
          created_at: string
        }
        Insert: {
          id?: number
          employee_name: string
          avg_salary: number
          contribution_base: number
          pension_company: number
          medical_company: number
          unemployment_company: number
          injury_company: number
          maternity_company: number
          housing_company: number
          total_company: number
          calculation_date?: string
          created_at?: string
        }
        Update: {
          id?: number
          employee_name?: string
          avg_salary?: number
          contribution_base?: number
          pension_company?: number
          medical_company?: number
          unemployment_company?: number
          injury_company?: number
          maternity_company?: number
          housing_company?: number
          total_company?: number
          calculation_date?: string
          created_at?: string
        }
      }
    }
  }
}