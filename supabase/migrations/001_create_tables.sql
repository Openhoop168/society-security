-- 五险一金计算器数据库表结构
-- 创建时间: 2025-12-22
-- 版本: v0.1.0

-- 创建城市社保标准表
CREATE TABLE cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  base_min DECIMAL(10,2) NOT NULL, -- 社保基数下限
  base_max DECIMAL(10,2) NOT NULL, -- 社保基数上限

  -- 养老保险缴费比例
  pension_company DECIMAL(5,4) NOT NULL, -- 公司缴纳比例 (如 0.1400 表示 14%)
  pension_employee DECIMAL(5,4) NOT NULL, -- 个人缴纳比例 (如 0.0800 表示 8%)

  -- 医疗保险缴费比例
  medical_company DECIMAL(5,4) NOT NULL, -- 公司缴纳比例
  medical_employee DECIMAL(5,4) NOT NULL, -- 个人缴纳比例

  -- 失业保险缴费比例
  unemployment_company DECIMAL(5,4) NOT NULL, -- 公司缴纳比例
  unemployment_employee DECIMAL(5,4) NOT NULL, -- 个人缴纳比例

  -- 工伤保险缴费比例
  injury_company DECIMAL(5,4) NOT NULL, -- 公司缴纳比例
  -- 工伤保险个人不缴费

  -- 生育保险缴费比例
  maternity_company DECIMAL(5,4) NOT NULL, -- 公司缴纳比例
  -- 生育保险个人不缴费

  -- 住房公积金缴费比例
  provident_company DECIMAL(5,4) NOT NULL, -- 公司缴纳比例
  provident_employee DECIMAL(5,4) NOT NULL, -- 个人缴纳比例

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建员工工资数据表
CREATE TABLE salaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL, -- 员工工号
  employee_name TEXT NOT NULL, -- 员工姓名
  year_month INTEGER NOT NULL, -- 年份月份 (YYYYMM格式)
  salary_amount DECIMAL(10,2) NOT NULL, -- 工资金额

  -- 可选字段
  department TEXT, -- 部门
  position TEXT, -- 职位

  -- 关联用户（谁上传的数据）
  created_by UUID REFERENCES auth.users(id),

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建计算结果表
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salary_id UUID NOT NULL REFERENCES salaries(id) ON DELETE CASCADE, -- 关联工资记录

  employee_name TEXT NOT NULL, -- 员工姓名（冗余存储，便于查询）
  avg_salary DECIMAL(10,2) NOT NULL, -- 年度月平均工资
  contribution_base DECIMAL(10,2) NOT NULL, -- 最终缴费基数

  -- 养老保险金额
  pension_company DECIMAL(10,2) NOT NULL, -- 公司缴纳金额
  pension_employee DECIMAL(10,2) NOT NULL, -- 个人缴纳金额

  -- 医疗保险金额
  medical_company DECIMAL(10,2) NOT NULL, -- 公司缴纳金额
  medical_employee DECIMAL(10,2) NOT NULL, -- 个人缴纳金额

  -- 失业保险金额
  unemployment_company DECIMAL(10,2) NOT NULL, -- 公司缴纳金额
  unemployment_employee DECIMAL(10,2) NOT NULL, -- 个人缴纳金额

  -- 工伤保险金额
  injury_company DECIMAL(10,2) NOT NULL, -- 公司缴纳金额
  -- injury_employee 不存在，个人不缴费

  -- 生育保险金额
  maternity_company DECIMAL(10,2) NOT NULL, -- 公司缴纳金额
  -- maternity_employee 不存在，个人不缴费

  -- 住房公积金金额
  provident_company DECIMAL(10,2) NOT NULL, -- 公司缴纳金额
  provident_employee DECIMAL(10,2) NOT NULL, -- 个人缴纳金额

  -- 总计金额
  total_company DECIMAL(10,2) NOT NULL, -- 公司总缴纳金额
  total_employee DECIMAL(10,2) NOT NULL, -- 个人总缴纳金额
  total_all DECIMAL(10,2) GENERATED ALWAYS AS (total_company + total_employee) STORED, -- 总计

  -- 关联用户（谁的计算结果）
  created_by UUID REFERENCES auth.users(id),

  -- 计算使用的城市标准
  city_id UUID REFERENCES cities(id),
  calculation_year INTEGER NOT NULL, -- 计算使用的年份

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建上传任务记录表
CREATE TABLE upload_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_name TEXT NOT NULL, -- 任务名称
  file_name TEXT NOT NULL, -- 原始文件名
  file_path TEXT, -- 文件存储路径
  file_size BIGINT, -- 文件大小（字节）
  file_type TEXT, -- 文件类型

  -- 任务状态
  total_rows INTEGER NOT NULL DEFAULT 0, -- 总行数
  processed_rows INTEGER NOT NULL DEFAULT 0, -- 已处理行数
  success_rows INTEGER NOT NULL DEFAULT 0, -- 成功行数
  failed_rows INTEGER NOT NULL DEFAULT 0, -- 失败行数
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  -- 任务结果
  error_message TEXT, -- 错误信息
  summary JSONB, -- 任务摘要信息

  -- 关联用户
  created_by UUID REFERENCES auth.users(id) NOT NULL,

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 创建计算任务记录表
CREATE TABLE calculation_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_name TEXT NOT NULL, -- 任务名称
  upload_task_id UUID REFERENCES upload_tasks(id), -- 关联的上传任务

  -- 任务参数
  city_name TEXT, -- 使用的城市名称
  calculation_year INTEGER, -- 计算年份

  -- 任务状态
  total_employees INTEGER NOT NULL DEFAULT 0, -- 总员工数
  processed_employees INTEGER NOT NULL DEFAULT 0, -- 已处理员工数
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  -- 任务结果
  error_message TEXT, -- 错误信息
  summary JSONB, -- 计算结果摘要

  -- 关联用户
  created_by UUID REFERENCES auth.users(id) NOT NULL,

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 创建用户配置表（可选）
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,

  -- 默认计算设置
  default_city TEXT DEFAULT '佛山', -- 默认城市
  default_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()), -- 默认年份

  -- 通知设置
  email_notifications BOOLEAN DEFAULT true, -- 邮件通知
  task_completion_notifications BOOLEAN DEFAULT true, -- 任务完成通知

  -- 界面设置
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'zh-CN',

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建审计日志表（可选，用于记录重要操作）
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 操作类型
  table_name TEXT, -- 操作的表名
  record_id UUID, -- 记录ID
  old_values JSONB, -- 旧值
  new_values JSONB, -- 新值
  ip_address INET, -- IP地址
  user_agent TEXT, -- 用户代理

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要 updated_at 字段的表创建触发器
CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON cities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salaries_updated_at
    BEFORE UPDATE ON salaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建索引以提高查询性能
-- cities 表索引
CREATE INDEX idx_cities_city_year ON cities(city_name, year);
CREATE INDEX idx_cities_year ON cities(year);

-- salaries 表索引
CREATE INDEX idx_salaries_employee_id ON salaries(employee_id);
CREATE INDEX idx_salaries_employee_name ON salaries(employee_name);
CREATE INDEX idx_salaries_year_month ON salaries(year_month);
CREATE INDEX idx_salaries_created_by ON salaries(created_by);
CREATE INDEX idx_salaries_composite ON salaries(year_month, employee_id, created_by);

-- results 表索引
CREATE INDEX idx_results_employee_name ON results(employee_name);
CREATE INDEX idx_results_created_by ON results(created_by);
CREATE INDEX idx_results_salary_id ON results(salary_id);
CREATE INDEX idx_results_calculation_year ON results(calculation_year);
CREATE INDEX idx_results_composite ON results(calculation_year, employee_name, created_by);

-- upload_tasks 表索引
CREATE INDEX idx_upload_tasks_created_by ON upload_tasks(created_by);
CREATE INDEX idx_upload_tasks_status ON upload_tasks(status);
CREATE INDEX idx_upload_tasks_created_at ON upload_tasks(created_at);

-- calculation_tasks 表索引
CREATE INDEX idx_calculation_tasks_created_by ON calculation_tasks(created_by);
CREATE INDEX idx_calculation_tasks_status ON calculation_tasks(status);
CREATE INDEX idx_calculation_tasks_upload_task_id ON calculation_tasks(upload_task_id);
CREATE INDEX idx_calculation_tasks_created_at ON calculation_tasks(created_at);

-- audit_logs 表索引
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- 为生成的 always 列创建索引
CREATE INDEX idx_results_total_all ON results(total_all);

-- 添加表注释
COMMENT ON TABLE cities IS '城市社保标准表，存储各城市不同年度的五险一金缴费基数和比例';
COMMENT ON TABLE salaries IS '员工工资数据表，存储员工的基本信息和工资数据';
COMMENT ON TABLE results IS '计算结果表，存储五险一金计算结果';
COMMENT ON TABLE upload_tasks IS '上传任务记录表，跟踪文件上传和处理的进度';
COMMENT ON TABLE calculation_tasks IS '计算任务记录表，跟踪批量计算的进度';
COMMENT ON TABLE user_settings IS '用户配置表，存储用户的个人设置和偏好';
COMMENT ON TABLE audit_logs IS '审计日志表，记录重要操作的数据变更历史';

-- 添加约束：确保年月格式正确
ALTER TABLE salaries ADD CONSTRAINT check_year_month_format
  CHECK (year_month >= 202301 AND year_month <= 209912);

-- 添加约束：确保工资金额为正数
ALTER TABLE salaries ADD CONSTRAINT check_salary_amount_positive
  CHECK (salary_amount > 0);

-- 添加约束：确保社保基数合理
ALTER TABLE cities ADD CONSTRAINT check_base_min_positive
  CHECK (base_min > 0);
ALTER TABLE cities ADD CONSTRAINT check_base_max_gte_min
  CHECK (base_max >= base_min);

-- 添加约束：确保缴费比例在合理范围内
ALTER TABLE cities ADD CONSTRAINT check_pension_rate_range
  CHECK (pension_company >= 0 AND pension_company <= 1 AND
         pension_employee >= 0 AND pension_employee <= 1);
ALTER TABLE cities ADD CONSTRAINT check_medical_rate_range
  CHECK (medical_company >= 0 AND medical_company <= 1 AND
         medical_employee >= 0 AND medical_employee <= 1);
ALTER TABLE cities ADD CONSTRAINT check_unemployment_rate_range
  CHECK (unemployment_company >= 0 AND unemployment_company <= 1 AND
         unemployment_employee >= 0 AND unemployment_employee <= 1);
ALTER TABLE cities ADD CONSTRAINT check_injury_rate_range
  CHECK (injury_company >= 0 AND injury_company <= 1);
ALTER TABLE cities ADD CONSTRAINT check_maternity_rate_range
  CHECK (maternity_company >= 0 AND maternity_company <= 1);
ALTER TABLE cities ADD CONSTRAINT check_provident_rate_range
  CHECK (provident_company >= 0 AND provident_company <= 1 AND
         provident_employee >= 0 AND provident_employee <= 1);

-- 添加唯一约束：同一城市同一年份只能有一条记录
ALTER TABLE cities ADD CONSTRAINT unique_city_year
  UNIQUE (city_name, year);