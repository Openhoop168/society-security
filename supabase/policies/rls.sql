-- Row Level Security (RLS) 策略配置
-- 创建时间: 2025-12-22
-- 版本: v0.1.0
-- 目的: 确保用户只能访问自己的数据，实现数据隔离

-- ===============================================
-- 启用所有表的 RLS
-- ===============================================

-- 为用户相关表启用 RLS
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- cities 表为公共数据，不需要启用 RLS（用户需要查询城市标准）
-- ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- cities 表策略（公共数据，但防止未认证用户修改）
-- ===============================================

-- 允许所有人查询城市标准（公共数据）
CREATE POLICY "Allow public read access to cities"
  ON cities FOR SELECT
  TO public
  USING (true);

-- 只允许认证用户插入城市标准（如果需要动态添加）
CREATE POLICY "Allow authenticated users to insert cities"
  ON cities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 只允许认证用户更新城市标准（如果需要动态修改）
CREATE POLICY "Allow authenticated users to update cities"
  ON cities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===============================================
-- salaries 表策略（用户数据隔离）
-- ===============================================

-- 用户只能查看自己上传的工资数据
CREATE POLICY "Users can only view their own salaries"
  ON salaries FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- 用户只能插入自己的工资数据
CREATE POLICY "Users can insert their own salaries"
  ON salaries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- 用户只能更新自己的工资数据
CREATE POLICY "Users can update their own salaries"
  ON salaries FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- 用户只能删除自己的工资数据
CREATE POLICY "Users can delete their own salaries"
  ON salaries FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ===============================================
-- results 表策略（计算结果隔离）
-- ===============================================

-- 用户只能查看自己的计算结果
CREATE POLICY "Users can only view their own results"
  ON results FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- 用户只能插入自己的计算结果
CREATE POLICY "Users can insert their own results"
  ON results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- 用户只能更新自己的计算结果
CREATE POLICY "Users can update their own results"
  ON results FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- 用户只能删除自己的计算结果
CREATE POLICY "Users can delete their own results"
  ON results FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ===============================================
-- upload_tasks 表策略（上传任务隔离）
-- ===============================================

-- 用户只能查看自己的上传任务
CREATE POLICY "Users can only view their own upload tasks"
  ON upload_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- 用户只能插入自己的上传任务
CREATE POLICY "Users can insert their own upload tasks"
  ON upload_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- 用户只能更新自己的上传任务
CREATE POLICY "Users can update their own upload tasks"
  ON upload_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- 用户只能删除自己的上传任务
CREATE POLICY "Users can delete their own upload tasks"
  ON upload_tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ===============================================
-- calculation_tasks 表策略（计算任务隔离）
-- ===============================================

-- 用户只能查看自己的计算任务
CREATE POLICY "Users can only view their own calculation tasks"
  ON calculation_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- 用户只能插入自己的计算任务
CREATE POLICY "Users can insert their own calculation tasks"
  ON calculation_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- 用户只能更新自己的计算任务
CREATE POLICY "Users can update their own calculation tasks"
  ON calculation_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- 用户只能删除自己的计算任务
CREATE POLICY "Users can delete their own calculation tasks"
  ON calculation_tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ===============================================
-- user_settings 表策略（用户配置隔离）
-- ===============================================

-- 用户只能查看自己的配置
CREATE POLICY "Users can only view their own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 用户只能插入自己的配置（第一次创建）
CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的配置
CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的配置
CREATE POLICY "Users can delete their own settings"
  ON user_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ===============================================
-- audit_logs 表策略（审计日志隔离）
-- ===============================================

-- 用户只能查看自己的审计日志
CREATE POLICY "Users can only view their own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 系统可以插入审计日志（通过服务端函数）
CREATE POLICY "Allow service role to insert audit logs"
  ON audit_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ===============================================
-- 创建触发器用于自动记录审计日志
-- ===============================================

-- 创建审计日志函数
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- 只记录重要表的变更
    IF TG_TABLE_NAME IN ('salaries', 'results', 'upload_tasks', 'calculation_tasks') THEN
        -- 记录删除操作
        IF TG_OP = 'DELETE' THEN
            INSERT INTO audit_logs (
                user_id,
                action,
                table_name,
                record_id,
                old_values,
                created_at
            ) VALUES (
                COALESCE(auth.uid(), NULL),
                'DELETE',
                TG_TABLE_NAME,
                OLD.id,
                row_to_json(OLD),
                NOW()
            );
            RETURN OLD;

        -- 记录更新操作
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO audit_logs (
                user_id,
                action,
                table_name,
                record_id,
                old_values,
                new_values,
                created_at
            ) VALUES (
                COALESCE(auth.uid(), NULL),
                'UPDATE',
                TG_TABLE_NAME,
                NEW.id,
                row_to_json(OLD),
                row_to_json(NEW),
                NOW()
            );
            RETURN NEW;

        -- 记录插入操作
        ELSIF TG_OP = 'INSERT' THEN
            INSERT INTO audit_logs (
                user_id,
                action,
                table_name,
                record_id,
                new_values,
                created_at
            ) VALUES (
                COALESCE(auth.uid(), NULL),
                'INSERT',
                TG_TABLE_NAME,
                NEW.id,
                row_to_json(NEW),
                NOW()
            );
            RETURN NEW;
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 为相关表创建审计触发器
CREATE TRIGGER audit_salaries_changes
    AFTER INSERT OR UPDATE OR DELETE ON salaries
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_results_changes
    AFTER INSERT OR UPDATE OR DELETE ON results
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_upload_tasks_changes
    AFTER INSERT OR UPDATE OR DELETE ON upload_tasks
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_calculation_tasks_changes
    AFTER INSERT OR UPDATE OR DELETE ON calculation_tasks
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- ===============================================
-- 创建用户默认配置函数
-- ===============================================

-- 创建默认用户配置函数
CREATE OR REPLACE FUNCTION create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    -- 当新用户注册时，自动创建默认配置
    INSERT INTO user_settings (
        user_id,
        default_city,
        default_year,
        email_notifications,
        task_completion_notifications,
        theme,
        language
    ) VALUES (
        NEW.id,
        '佛山',
        EXTRACT(YEAR FROM NOW()),
        true,
        true,
        'light',
        'zh-CN'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建新用户注册时的触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_default_user_settings();

-- ===============================================
-- 创建数据清理函数
-- ===============================================

-- 清理过期的审计日志（保留6个月）
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs
    WHERE created_at < NOW() - INTERVAL '6 months';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 清理已删除的关联数据（软删除清理）
CREATE OR REPLACE FUNCTION cleanup_deleted_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- 清理已删除用户的数据（可选，根据业务需求）
    -- 这里可以根据需要添加清理逻辑

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- 添加视图用于简化查询
-- ===============================================

-- 创建员工年度工资汇总视图
CREATE OR REPLACE VIEW employee_salary_summary AS
SELECT
    created_by,
    employee_id,
    employee_name,
    department,
    position,
    EXTRACT(YEAR FROM TO_DATE(year_month::TEXT, 'YYYYMM')) as year,
    AVG(salary_amount) as avg_monthly_salary,
    SUM(salary_amount) as total_yearly_salary,
    COUNT(*) as months_count,
    MIN(year_month) as first_month,
    MAX(year_month) as last_month,
    MAX(created_at) as last_updated
FROM salaries
GROUP BY
    created_by, employee_id, employee_name, department, position,
    EXTRACT(YEAR FROM TO_DATE(year_month::TEXT, 'YYYYMM'));

-- 创建计算结果汇总视图
CREATE OR REPLACE VIEW calculation_summary AS
SELECT
    created_by,
    calculation_year,
    COUNT(DISTINCT employee_name) as employee_count,
    SUM(total_company) as total_company_cost,
    SUM(total_employee) as total_employee_cost,
    SUM(total_all) as total_cost,
    AVG(total_all) as avg_cost_per_employee,
    MAX(created_at) as last_calculation
FROM results
GROUP BY created_by, calculation_year;

-- 创建任务统计视图
CREATE OR REPLACE VIEW task_statistics AS
SELECT
    created_by,
    'upload' as task_type,
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_tasks,
    COUNT(*) FILTER (WHERE status = 'processing') as processing_tasks,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks
FROM upload_tasks
GROUP BY created_by

UNION ALL

SELECT
    created_by,
    'calculation' as task_type,
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_tasks,
    COUNT(*) FILTER (WHERE status = 'processing') as processing_tasks,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks
FROM calculation_tasks
GROUP BY created_by;

-- ===============================================
-- 为视图创建 RLS 策略
-- ===============================================

-- 用户只能查看自己的工资汇总
ALTER VIEW employee_salary_summary SET (security_barrier = true);
CREATE POLICY "Users can only view their own salary summary"
  ON employee_salary_summary FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- 用户只能查看自己的计算汇总
ALTER VIEW calculation_summary SET (security_barrier = true);
CREATE POLICY "Users can only view their own calculation summary"
  ON calculation_summary FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- 用户只能查看自己的任务统计
ALTER VIEW task_statistics SET (security_barrier = true);
CREATE POLICY "Users can only view their own task statistics"
  ON task_statistics FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);