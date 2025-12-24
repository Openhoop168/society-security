-- =====================================================
-- 五险一金计算器 - Supabase 数据库 Schema
-- 版本: v0.1.0
-- 创建时间: 2025-12-23
-- =====================================================

-- =====================================================
-- 1. 启用必要的扩展
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. 启用 Row Level Security (RLS)
-- =====================================================
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. 城市社保标准表 (cities)
-- =====================================================
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_name VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,

  -- 社保缴费基数
  base_min DECIMAL(10, 2) NOT NULL CHECK (base_min > 0),
  base_max DECIMAL(10, 2) NOT NULL CHECK (base_max >= base_min),

  -- 养老保险缴费比例
  pension_company DECIMAL(5, 4) NOT NULL CHECK (pension_company >= 0 AND pension_company <= 1),
  pension_employee DECIMAL(5, 4) NOT NULL CHECK (pension_employee >= 0 AND pension_employee <= 1),

  -- 医疗保险缴费比例
  medical_company DECIMAL(5, 4) NOT NULL CHECK (medical_company >= 0 AND medical_company <= 1),
  medical_employee DECIMAL(5, 4) NOT NULL CHECK (medical_employee >= 0 AND medical_employee <= 1),

  -- 失业保险缴费比例
  unemployment_company DECIMAL(5, 4) NOT NULL CHECK (unemployment_company >= 0 AND unemployment_company <= 1),
  unemployment_employee DECIMAL(5, 4) NOT NULL CHECK (unemployment_employee >= 0 AND unemployment_employee <= 1),

  -- 工伤保险缴费比例 (个人不缴费)
  injury_company DECIMAL(5, 4) NOT NULL CHECK (injury_company >= 0 AND injury_company <= 1),

  -- 生育保险缴费比例 (个人不缴费)
  maternity_company DECIMAL(5, 4) NOT NULL CHECK (maternity_company >= 0 AND maternity_company <= 1),

  -- 住房公积金缴费比例
  provident_company DECIMAL(5, 4) NOT NULL CHECK (provident_company >= 0 AND provident_company <= 1),
  provident_employee DECIMAL(5, 4) NOT NULL CHECK (provident_employee >= 0 AND provident_employee <= 1),

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 约束：同一城市同年份只能有一条记录
  UNIQUE(city_name, year)
);

-- 创建索引
CREATE INDEX idx_cities_city_year ON cities(city_name, year);
CREATE INDEX idx_cities_year ON cities(year);

-- 添加注释
COMMENT ON TABLE cities IS '城市社保标准表';
COMMENT ON COLUMN cities.base_min IS '社保缴费基数下限';
COMMENT ON COLUMN cities.base_max IS '社保缴费基数上限';
COMMENT ON COLUMN cities.pension_company IS '养老保险公司缴纳比例 (0.14 = 14%)';
COMMENT ON COLUMN cities.pension_employee IS '养老保险个人缴纳比例';

-- =====================================================
-- 4. 员工工资数据表 (salaries)
-- =====================================================
CREATE TABLE IF NOT EXISTS salaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(100) NOT NULL,
  year_month INTEGER NOT NULL CHECK (year_month >= 197001 AND year_month <= 209912),
  salary_amount DECIMAL(10, 2) NOT NULL CHECK (salary_amount >= 0),

  -- 可选字段
  department VARCHAR(100),
  position VARCHAR(100),

  -- 关联用户 (谁上传的数据)
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 约束：同一员工同年月只能有一条记录
  UNIQUE(employee_id, year_month, created_by)
);

-- 创建索引
CREATE INDEX idx_salaries_employee ON salaries(employee_id);
CREATE INDEX idx_salaries_name ON salaries(employee_name);
CREATE INDEX idx_salaries_year_month ON salaries(year_month);
CREATE INDEX idx_salaries_created_by ON salaries(created_by);
CREATE INDEX idx_salaries_user_date ON salaries(created_by, year_month);

-- 添加注释
COMMENT ON TABLE salaries IS '员工工资数据表';
COMMENT ON COLUMN salaries.year_month IS '年月，格式：YYYYMM (整数)';

-- =====================================================
-- 5. 计算结果表 (results)
-- =====================================================
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 关联信息
  salary_id UUID REFERENCES salaries(id) ON DELETE CASCADE,
  employee_name VARCHAR(100) NOT NULL,

  -- 计算基础数据
  avg_salary DECIMAL(10, 2) NOT NULL,
  contribution_base DECIMAL(10, 2) NOT NULL,

  -- 养老保险金额
  pension_company DECIMAL(10, 2) NOT NULL DEFAULT 0,
  pension_employee DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- 医疗保险金额
  medical_company DECIMAL(10, 2) NOT NULL DEFAULT 0,
  medical_employee DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- 失业保险金额
  unemployment_company DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unemployment_employee DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- 工伤保险金额 (个人不缴费)
  injury_company DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- 生育保险金额 (个人不缴费)
  maternity_company DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- 住房公积金金额
  provident_company DECIMAL(10, 2) NOT NULL DEFAULT 0,
  provident_employee DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- 总计金额
  total_company DECIMAL(10, 2) NOT NULL GENERATED ALWAYS AS (
    pension_company + medical_company + unemployment_company +
    injury_company + maternity_company + provident_company
  ) STORED,
  total_employee DECIMAL(10, 2) NOT NULL GENERATED ALWAYS AS (
    pension_employee + medical_employee + unemployment_employee + provident_employee
  ) STORED,
  total_all DECIMAL(10, 2) GENERATED ALWAYS AS (
    pension_company + medical_company + unemployment_company +
    injury_company + maternity_company + provident_company +
    pension_employee + medical_employee + unemployment_employee + provident_employee
  ) STORED,

  -- 计算相关信息
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  calculation_year INTEGER NOT NULL,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_results_employee_name ON results(employee_name);
CREATE INDEX idx_results_created_by ON results(created_by);
CREATE INDEX idx_results_calculation_year ON results(calculation_year);
CREATE INDEX idx_results_city ON results(city_id);

-- 添加注释
COMMENT ON TABLE results IS '五险一金计算结果表';
COMMENT ON COLUMN results.avg_salary IS '年度月平均工资';
COMMENT ON COLUMN results.contribution_base IS '最终缴费基数';
COMMENT ON COLUMN results.total_company IS '公司总缴纳 (自动计算)';
COMMENT ON COLUMN results.total_employee IS '个人总缴纳 (自动计算)';
COMMENT ON COLUMN results.total_all IS '总缴纳金额 (自动计算)';

-- =====================================================
-- 6. 上传任务记录表 (upload_tasks)
-- =====================================================
CREATE TABLE IF NOT EXISTS upload_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_name VARCHAR(200) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT,
  file_size BIGINT,
  file_type VARCHAR(50),

  -- 任务状态和进度
  total_rows INTEGER NOT NULL DEFAULT 0,
  processed_rows INTEGER NOT NULL DEFAULT 0,
  success_rows INTEGER NOT NULL DEFAULT 0,
  failed_rows INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  -- 任务结果
  error_message TEXT,
  summary JSONB,

  -- 关联用户
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 创建索引
CREATE INDEX idx_upload_tasks_created_by ON upload_tasks(created_by);
CREATE INDEX idx_upload_tasks_status ON upload_tasks(status);
CREATE INDEX idx_upload_tasks_created_at ON upload_tasks(created_at DESC);

-- 添加注释
COMMENT ON TABLE upload_tasks IS '文件上传任务记录表';

-- =====================================================
-- 7. 计算任务记录表 (calculation_tasks)
-- =====================================================
CREATE TABLE IF NOT EXISTS calculation_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_name VARCHAR(200) NOT NULL,
  upload_task_id UUID REFERENCES upload_tasks(id) ON DELETE SET NULL,

  -- 任务参数
  city_name VARCHAR(100),
  calculation_year INTEGER NOT NULL,

  -- 任务状态和进度
  total_employees INTEGER NOT NULL DEFAULT 0,
  processed_employees INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  -- 任务结果
  error_message TEXT,
  summary JSONB,

  -- 关联用户
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 创建索引
CREATE INDEX idx_calculation_tasks_created_by ON calculation_tasks(created_by);
CREATE INDEX idx_calculation_tasks_status ON calculation_tasks(status);
CREATE INDEX idx_calculation_tasks_upload_task ON calculation_tasks(upload_task_id);

-- 添加注释
COMMENT ON TABLE calculation_tasks IS '计算任务记录表';

-- =====================================================
-- 8. 用户配置表 (user_settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 默认计算设置
  default_city VARCHAR(100) NOT NULL DEFAULT '佛山',
  default_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),

  -- 通知设置
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  task_completion_notifications BOOLEAN NOT NULL DEFAULT true,

  -- 界面设置
  theme VARCHAR(10) NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  language VARCHAR(10) NOT NULL DEFAULT 'zh-CN',

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- 添加注释
COMMENT ON TABLE user_settings IS '用户配置表';

-- =====================================================
-- 9. 审计日志表 (audit_logs)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')),
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 添加注释
COMMENT ON TABLE audit_logs IS '审计日志表';

-- =====================================================
-- 10. 创建视图 (Views)
-- =====================================================

-- 员工工资汇总视图
CREATE OR REPLACE VIEW employee_salary_summary AS
SELECT
  s.created_by,
  s.employee_id,
  s.employee_name,
  s.department,
  s.position,
  EXTRACT(YEAR FROM (s.year_month::text || '01')::date) AS year,
  AVG(s.salary_amount) AS avg_monthly_salary,
  SUM(s.salary_amount) AS total_yearly_salary,
  COUNT(*) AS months_count,
  MIN(s.year_month) AS first_month,
  MAX(s.year_month) AS last_month,
  MAX(s.updated_at) AS last_updated
FROM salaries s
GROUP BY
  s.created_by,
  s.employee_id,
  s.employee_name,
  s.department,
  s.position;

COMMENT ON VIEW employee_salary_summary IS '员工工资年度汇总视图';

-- 计算结果汇总视图
CREATE OR REPLACE VIEW calculation_summary AS
SELECT
  r.created_by,
  r.calculation_year,
  COUNT(DISTINCT r.employee_name) AS employee_count,
  SUM(r.total_company) AS total_company_cost,
  SUM(r.total_employee) AS total_employee_cost,
  SUM(r.total_all) AS total_cost,
  SUM(r.total_all) / COUNT(DISTINCT r.employee_name) AS avg_cost_per_employee,
  MAX(r.created_at) AS last_calculation
FROM results r
GROUP BY
  r.created_by,
  r.calculation_year;

COMMENT ON VIEW calculation_summary IS '计算结果汇总视图';

-- 任务统计视图
CREATE OR REPLACE VIEW task_statistics AS
SELECT
  created_by,
  'upload' AS task_type,
  COUNT(*) AS total_tasks,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_tasks,
  COUNT(*) FILTER (WHERE status = 'failed') AS failed_tasks,
  COUNT(*) FILTER (WHERE status = 'processing') AS processing_tasks,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_tasks
FROM upload_tasks
GROUP BY created_by
UNION ALL
SELECT
  created_by,
  'calculation' AS task_type,
  COUNT(*) AS total_tasks,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_tasks,
  COUNT(*) FILTER (WHERE status = 'failed') AS failed_tasks,
  COUNT(*) FILTER (WHERE status = 'processing') AS processing_tasks,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_tasks
FROM calculation_tasks
GROUP BY created_by;

COMMENT ON VIEW task_statistics IS '任务统计视图';

-- =====================================================
-- 11. 创建存储函数 (Functions)
-- =====================================================

-- 计算月度五险一金
CREATE OR REPLACE FUNCTION calculate_monthly_contribution(
  p_salary_amount DECIMAL,
  p_city_name VARCHAR DEFAULT '佛山',
  p_calculation_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)
)
RETURNS TABLE (
  base_min DECIMAL,
  base_max DECIMAL,
  contribution_base DECIMAL,
  pension_company DECIMAL,
  pension_employee DECIMAL,
  medical_company DECIMAL,
  medical_employee DECIMAL,
  unemployment_company DECIMAL,
  unemployment_employee DECIMAL,
  injury_company DECIMAL,
  maternity_company DECIMAL,
  provident_company DECIMAL,
  provident_employee DECIMAL,
  total_company DECIMAL,
  total_employee DECIMAL,
  total_all DECIMAL
) AS $$
DECLARE
  v_city cities%ROWTYPE;
  v_base DECIMAL;
BEGIN
  -- 获取城市标准
  SELECT * INTO v_city
  FROM cities
  WHERE city_name = p_city_name
    AND year = p_calculation_year
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION '未找到城市 % 在 % 年的社保标准', p_city_name, p_calculation_year;
  END IF;

  -- 计算缴费基数
  v_base := GREATEST(v_city.base_min, LEAST(p_salary_amount, v_city.base_max));

  -- 计算各项金额
  RETURN QUERY
  SELECT
    v_city.base_min,
    v_city.base_max,
    v_base,
    ROUND(v_base * v_city.pension_company, 2),
    ROUND(v_base * v_city.pension_employee, 2),
    ROUND(v_base * v_city.medical_company, 2),
    ROUND(v_base * v_city.medical_employee, 2),
    ROUND(v_base * v_city.unemployment_company, 2),
    ROUND(v_base * v_city.unemployment_employee, 2),
    ROUND(v_base * v_city.injury_company, 2),
    ROUND(v_base * v_city.maternity_company, 2),
    ROUND(v_base * v_city.provident_company, 2),
    ROUND(v_base * v_city.provident_employee, 2),
    ROUND(v_base * (
      v_city.pension_company + v_city.medical_company +
      v_city.unemployment_company + v_city.injury_company +
      v_city.maternity_company + v_city.provident_company
    ), 2),
    ROUND(v_base * (
      v_city.pension_employee + v_city.medical_employee +
      v_city.unemployment_employee + v_city.provident_employee
    ), 2),
    ROUND(v_base * (
      v_city.pension_company + v_city.pension_employee +
      v_city.medical_company + v_city.medical_employee +
      v_city.unemployment_company + v_city.unemployment_employee +
      v_city.injury_company + v_city.maternity_company +
      v_city.provident_company + v_city.provident_employee
    ), 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_monthly_contribution IS '计算月度五险一金缴纳金额';

-- 批量计算五险一金
CREATE OR REPLACE FUNCTION batch_calculate_contributions(
  p_user_id UUID,
  p_city_name VARCHAR DEFAULT '佛山',
  p_calculation_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  p_calculation_year_month INTEGER DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message VARCHAR,
  processed_count INTEGER,
  error_count INTEGER
) AS $$
DECLARE
  v_city_id UUID;
  v_employee RECORD;
  v_avg_salary DECIMAL;
  v_contribution DECIMAL;
  v_processed INTEGER := 0;
  v_error INTEGER := 0;
BEGIN
  -- 获取城市ID
  SELECT id INTO v_city_id
  FROM cities
  WHERE city_name = p_city_name
    AND year = p_calculation_year
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, '未找到城市社保标准', 0, 0;
    RETURN;
  END IF;

  -- 遍历每个员工
  FOR v_employee IN
    SELECT
      employee_id,
      employee_name,
      AVG(salary_amount) AS avg_salary
    FROM salaries
    WHERE created_by = p_user_id
      AND (p_calculation_year_month IS NULL OR year_month = p_calculation_year_month)
    GROUP BY employee_id, employee_name
  LOOP
    BEGIN
      -- 获取计算结果
      SELECT * INTO v_contribution
      FROM calculate_monthly_contribution(
        v_employee.avg_salary,
        p_city_name,
        p_calculation_year
      )
      LIMIT 1;

      -- 插入结果
      INSERT INTO results (
        employee_name,
        avg_salary,
        contribution_base,
        pension_company,
        pension_employee,
        medical_company,
        medical_employee,
        unemployment_company,
        unemployment_employee,
        injury_company,
        maternity_company,
        provident_company,
        provident_employee,
        created_by,
        city_id,
        calculation_year
      ) VALUES (
        v_employee.employee_name,
        v_employee.avg_salary,
        v_contribution.contribution_base,
        v_contribution.pension_company,
        v_contribution.pension_employee,
        v_contribution.medical_company,
        v_contribution.medical_employee,
        v_contribution.unemployment_company,
        v_contribution.unemployment_employee,
        v_contribution.injury_company,
        v_contribution.maternity_company,
        v_contribution.provident_company,
        v_contribution.provident_employee,
        p_user_id,
        v_city_id,
        p_calculation_year
      );

      v_processed := v_processed + 1;
    EXCEPTION WHEN OTHERS THEN
      v_error := v_error + 1;
    END;
  END LOOP;

  RETURN QUERY SELECT true, '计算完成', v_processed, v_error;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION batch_calculate_contributions IS '批量计算员工的五险一金';

-- 清理旧审计日志
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- 删除90天前的日志
  DELETE FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_audit_logs IS '清理90天前的审计日志';

-- =====================================================
-- 12. 创建触发器函数 (Triggers)
-- =====================================================

-- 更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为各表添加 updated_at 触发器
CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salaries_updated_at
  BEFORE UPDATE ON salaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 审计日志触发器函数
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_values
    ) VALUES (
      COALESCE((OLD.created_by)::uuid, auth.uid()),
      TG_OP,
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD)
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values
    ) VALUES (
      COALESCE((NEW.created_by)::uuid, auth.uid()),
      TG_OP,
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      new_values
    ) VALUES (
      COALESCE((NEW.created_by)::uuid, auth.uid()),
      TG_OP,
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 13. Row Level Security (RLS) 策略
-- =====================================================

-- cities 表策略 (所有人可读，仅认证用户可写)
CREATE POLICY "允许所有人查看城市标准"
  ON cities FOR SELECT
  USING (true);

CREATE POLICY "允许认证用户插入城市标准"
  ON cities FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户更新城市标准"
  ON cities FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户删除城市标准"
  ON cities FOR DELETE
  USING (auth.role() = 'authenticated');

-- salaries 表策略 (用户只能访问自己的数据)
CREATE POLICY "允许用户查看自己的工资数据"
  ON salaries FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "允许用户插入自己的工资数据"
  ON salaries FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "允许用户更新自己的工资数据"
  ON salaries FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "允许用户删除自己的工资数据"
  ON salaries FOR DELETE
  USING (auth.uid() = created_by);

-- results 表策略 (用户只能访问自己的计算结果)
CREATE POLICY "允许用户查看自己的计算结果"
  ON results FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "允许用户插入自己的计算结果"
  ON results FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "允许用户删除自己的计算结果"
  ON results FOR DELETE
  USING (auth.uid() = created_by);

-- upload_tasks 表策略
CREATE POLICY "允许用户查看自己的上传任务"
  ON upload_tasks FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "允许用户插入自己的上传任务"
  ON upload_tasks FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "允许用户更新自己的上传任务"
  ON upload_tasks FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- calculation_tasks 表策略
CREATE POLICY "允许用户查看自己的计算任务"
  ON calculation_tasks FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "允许用户插入自己的计算任务"
  ON calculation_tasks FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "允许用户更新自己的计算任务"
  ON calculation_tasks FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- user_settings 表策略
CREATE POLICY "允许用户查看自己的设置"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "允许用户插入自己的设置"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "允许用户更新自己的设置"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- audit_logs 表策略 (用户只能查看自己的日志)
CREATE POLICY "允许用户查看自己的审计日志"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "允许系统插入审计日志"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 14. 插入初始数据 - 佛山市 2025 年社保标准
-- =====================================================
INSERT INTO cities (
  city_name,
  year,
  base_min,
  base_max,
  pension_company,
  pension_employee,
  medical_company,
  medical_employee,
  unemployment_company,
  unemployment_employee,
  injury_company,
  maternity_company,
  provident_company,
  provident_employee
) VALUES (
  '佛山',
  2025,
  1900.00,           -- 社保基数下限
  28002.00,          -- 社保基数上限 (2024年广东省平均工资的300%)
  0.1400,            -- 养老保险公司 14%
  0.0800,            -- 养老保险个人 8%
  0.0450,            -- 医疗保险公司 4.5% (基本+大病)
  0.0200,            -- 医疗保险个人 2%
  0.0080,            -- 失业保险公司 0.8%
  0.0050,            -- 失业保险个人 0.5%
  0.0020,            -- 工伤保险公司 0.2% (按行业浮动)
  0.0080,            -- 生育保险公司 0.8%
  0.0500,            -- 住房公积金公司 5% (最低档)
  0.0500             -- 住房公积金个人 5% (最低档)
) ON CONFLICT (city_name, year) DO NOTHING;

-- =====================================================
-- 15. 创建新用户自动创建设置的任务
-- =====================================================

-- 新用户注册时自动创建默认设置
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 完成！
-- =====================================================
