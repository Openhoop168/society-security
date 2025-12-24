-- ========================================
-- 五险一金计算器 - 数据库初始化脚本
-- ========================================
-- 使用说明：
-- 1. 在 Supabase Dashboard 中打开 SQL Editor
-- 2. 复制整个脚本
-- 3. 点击 "Run" 执行
-- ========================================

-- ========================================
-- 1. 创建城市社保标准表
-- ========================================
CREATE TABLE IF NOT EXISTS cities (
  id BIGSERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min NUMERIC NOT NULL,
  base_max NUMERIC NOT NULL,
  pension_rate_company NUMERIC NOT NULL,
  medical_rate_company NUMERIC NOT NULL,
  unemployment_rate_company NUMERIC NOT NULL,
  injury_rate_company NUMERIC NOT NULL,
  maternity_rate_company NUMERIC NOT NULL,
  housing_rate_company NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_cities_city_year ON cities(city_name, year);

-- ========================================
-- 2. 创建员工工资表
-- ========================================
CREATE TABLE IF NOT EXISTS salaries (
  id BIGSERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_salaries_employee ON salaries(employee_id, employee_name);
CREATE INDEX IF NOT EXISTS idx_salaries_month ON salaries(month);

-- ========================================
-- 3. 创建计算结果表
-- ========================================
CREATE TABLE IF NOT EXISTS results (
  id BIGSERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  avg_salary NUMERIC NOT NULL,
  contribution_base NUMERIC NOT NULL,
  pension_company NUMERIC NOT NULL,
  medical_company NUMERIC NOT NULL,
  unemployment_company NUMERIC NOT NULL,
  injury_company NUMERIC NOT NULL,
  maternity_company NUMERIC NOT NULL,
  housing_company NUMERIC NOT NULL,
  total_company NUMERIC NOT NULL,
  calculation_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_results_employee ON results(employee_name);
CREATE INDEX IF NOT EXISTS idx_results_date ON results(calculation_date);

-- ========================================
-- 4. 启用行级安全策略（RLS）
-- ========================================
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. 创建 RLS 策略
-- ========================================

-- 允许所有认证用户访问城市数据
CREATE POLICY "允许认证用户查看城市数据"
ON cities FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户插入城市数据"
ON cities FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户更新城市数据"
ON cities FOR UPDATE
USING (auth.role() = 'authenticated');

-- 允许所有认证用户访问工资数据
CREATE POLICY "允许认证用户查看工资数据"
ON salaries FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户插入工资数据"
ON salaries FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户更新工资数据"
ON salaries FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户删除工资数据"
ON salaries FOR DELETE
USING (auth.role() = 'authenticated');

-- 允许所有认证用户访问结果数据
CREATE POLICY "允许认证用户查看结果数据"
ON results FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户插入结果数据"
ON results FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "允许认证用户删除结果数据"
ON results FOR DELETE
USING (auth.role() = 'authenticated');

-- ========================================
-- 6. 插入示例数据
-- ========================================

-- 佛山 2025 年社保标准
INSERT INTO cities (city_name, year, base_min, base_max,
  pension_rate_company, medical_rate_company,
  unemployment_rate_company, injury_rate_company,
  maternity_rate_company, housing_rate_company)
VALUES (
  '佛山', '2025',
  1900, 28017,
  0.14, 0.045, 0.008, 0.002, 0.001, 0.05
)
ON CONFLICT DO NOTHING;

-- 广州 2025 年社保标准（示例）
INSERT INTO cities (city_name, year, base_min, base_max,
  pension_rate_company, medical_rate_company,
  unemployment_rate_company, injury_rate_company,
  maternity_rate_company, housing_rate_company)
VALUES (
  '广州', '2025',
  2400, 28017,
  0.14, 0.045, 0.008, 0.002, 0.001, 0.05
)
ON CONFLICT DO NOTHING;

-- 深圳 2025 年社保标准（示例）
INSERT INTO cities (city_name, year, base_min, base_max,
  pension_rate_company, medical_rate_company,
  unemployment_rate_company, injury_rate_company,
  maternity_rate_company, housing_rate_company)
VALUES (
  '深圳', '2025',
  2360, 28017,
  0.14, 0.045, 0.008, 0.002, 0.001, 0.05
)
ON CONFLICT DO NOTHING;

-- ========================================
-- 7. 创建视图（可选）
-- ========================================

-- 创建计算结果摘要视图
CREATE OR REPLACE VIEW results_summary AS
SELECT
  calculation_date,
  COUNT(*) as employee_count,
  SUM(total_company) as total_amount,
  AVG(avg_salary) as average_salary
FROM results
GROUP BY calculation_date
ORDER BY calculation_date DESC;

-- ========================================
-- 8. 创建触发器（自动更新 updated_at）
-- ========================================

-- cities 表触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- salaries 表触发器
CREATE TRIGGER update_salaries_updated_at
  BEFORE UPDATE ON salaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 验证安装
-- ========================================

-- 检查表是否创建成功
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('cities', 'salaries', 'results')
ORDER BY table_name, ordinal_position;

-- 检查示例数据
SELECT * FROM cities;

-- 检查 RLS 策略
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 完成！
-- ========================================
-- 执行完成后，你应该看到：
-- ✅ 三个表创建成功
-- ✅ RLS 策略已启用
-- ✅ 示例数据已插入
-- ✅ 索引和触发器已创建
-- ========================================
