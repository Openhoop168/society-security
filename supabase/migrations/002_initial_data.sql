-- 初始化数据
-- 创建时间: 2025-12-22
-- 版本: v0.1.0
-- 目的: 插入初始数据，包括佛山市2025年社保标准

-- 插入佛山市2025年社保标准
INSERT INTO cities (
    city_name,
    year,
    base_min,
    base_max,
    pension_company,      -- 养老保险公司缴纳 14%
    pension_employee,     -- 养老保险个人缴纳 8%
    medical_company,      -- 医疗保险公司缴纳 5.5%
    medical_employee,     -- 医疗保险个人缴纳 2%
    unemployment_company, -- 失业保险公司缴纳 0.8%
    unemployment_employee,-- 失业保险个人缴纳 0.2%
    injury_company,       -- 工伤保险公司缴纳 0.2%
    maternity_company,    -- 生育保险公司缴纳 0.5%
    provident_company,    -- 住房公积金公司缴纳 5%
    provident_employee    -- 住房公积金个人缴纳 5%
) VALUES (
    '佛山',
    2025,
    4250.00,   -- 社保基数下限
    26421.00,  -- 社保基数上限
    0.1400,    -- 养老保险公司 14%
    0.0800,    -- 养老保险个人 8%
    0.0550,    -- 医疗保险公司 5.5%
    0.0200,    -- 医疗保险个人 2%
    0.0080,    -- 失业保险公司 0.8%
    0.0020,    -- 失业保险个人 0.2%
    0.0020,    -- 工伤保险公司 0.2%
    0.0050,    -- 生育保险公司 0.5%
    0.0500,    -- 住房公积金公司 5%
    0.0500     -- 住房公积金个人 5%
);

-- 插入一些其他常见城市的社保标准作为示例（可选）
INSERT INTO cities (
    city_name, year, base_min, base_max,
    pension_company, pension_employee,
    medical_company, medical_employee,
    unemployment_company, unemployment_employee,
    injury_company, maternity_company,
    provident_company, provident_employee
) VALUES
-- 广州 2025
('广州', 2025, 4592.00, 26421.00,
 0.1400, 0.0800,  -- 养老保险
 0.0550, 0.0200,  -- 医疗保险
 0.0080, 0.0020,  -- 失业保险
 0.0020, 0.0050,  -- 工伤、生育保险
 0.0500, 0.0500), -- 住房公积金

-- 深圳 2025
('深圳', 2025, 4478.00, 26421.00,
 0.1400, 0.0800,  -- 养老保险
 0.0550, 0.0200,  -- 医疗保险
 0.0080, 0.0020,  -- 失业保险
 0.0020, 0.0050,  -- 工伤、生育保险
 0.0500, 0.0500), -- 住房公积金

-- 东莞 2025
('东莞', 2025, 4250.00, 26421.00,
 0.1400, 0.0800,  -- 养老保险
 0.0550, 0.0200,  -- 医疗保险
 0.0080, 0.0020,  -- 失业保险
 0.0020, 0.0050,  -- 工伤、生育保险
 0.0500, 0.0500); -- 住房公积金

-- 创建数据库函数用于社保计算验证
CREATE OR REPLACE FUNCTION calculate_monthly_contribution(
    p_salary_amount DECIMAL,
    p_city_name TEXT DEFAULT '佛山',
    p_calculation_year INTEGER DEFAULT 2025
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
    city_record RECORD;
BEGIN
    -- 获取城市社保标准
    SELECT * INTO city_record
    FROM cities
    WHERE city_name = p_city_name AND year = p_calculation_year;

    IF city_record IS NULL THEN
        RAISE EXCEPTION '未找到城市 % 在 % 年的社保标准', p_city_name, p_calculation_year;
    END IF;

    -- 计算缴费基数（在基数上下限之间）
    RETURN QUERY
    SELECT
        city_record.base_min,
        city_record.base_max,
        -- 确定缴费基数
        GREATEST(
            city_record.base_min,
            LEAST(p_salary_amount, city_record.base_max)
        ) as contribution_base,
        -- 计算各项费用
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.pension_company as pension_company,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.pension_employee as pension_employee,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.medical_company as medical_company,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.medical_employee as medical_employee,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.unemployment_company as unemployment_company,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.unemployment_employee as unemployment_employee,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.injury_company as injury_company,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.maternity_company as maternity_company,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.provident_company as provident_company,
        GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.provident_employee as provident_employee,
        -- 计算总计
        (
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.pension_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.medical_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.unemployment_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.injury_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.maternity_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.provident_company
        ) as total_company,
        (
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.pension_employee +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.medical_employee +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.unemployment_employee +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.provident_employee
        ) as total_employee,
        (
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.pension_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.pension_employee +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.medical_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.medical_employee +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.unemployment_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.unemployment_employee +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.injury_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.maternity_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.provident_company +
            GREATEST(city_record.base_min, LEAST(p_salary_amount, city_record.base_max)) * city_record.provident_employee
        ) as total_all;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建存储过程用于批量计算
CREATE OR REPLACE FUNCTION batch_calculate_contributions(
    p_user_id UUID,
    p_city_name TEXT DEFAULT '佛山',
    p_calculation_year INTEGER DEFAULT 2025,
    p_calculation_year_month INTEGER DEFAULT 202412 -- 计算年度的年月
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    processed_count INTEGER,
    error_count INTEGER
) AS $$
DECLARE
    employees_cursor CURSOR FOR
        SELECT
            employee_id,
            employee_name,
            AVG(salary_amount) as avg_salary
        FROM salaries
        WHERE created_by = p_user_id
          AND year_month BETWEEN (p_calculation_year_month - 100) AND p_calculation_year_month
        GROUP BY employee_id, employee_name;

    employee_record RECORD;
    calculation_result RECORD;
    processed_count INTEGER := 0;
    error_count INTEGER := 0;
    city_record cities%ROWTYPE;
BEGIN
    -- 获取城市标准
    SELECT * INTO city_record FROM cities
    WHERE city_name = p_city_name AND year = p_calculation_year;

    IF city_record IS NULL THEN
        RETURN QUERY SELECT false, '未找到城市社保标准', 0, 0;
        RETURN;
    END IF;

    -- 删除该用户同年度的旧计算结果
    DELETE FROM results
    WHERE created_by = p_user_id
      AND calculation_year = p_calculation_year;

    -- 逐个处理员工
    OPEN employees_cursor;
    LOOP
        FETCH employees_cursor INTO employee_record;
        EXIT WHEN NOT FOUND;

        BEGIN
            -- 计算缴费基数
            calculation_result.contribution_base := GREATEST(
                city_record.base_min,
                LEAST(employee_record.avg_salary, city_record.base_max)
            );

            -- 计算各项费用
            calculation_result.pension_company := calculation_result.contribution_base * city_record.pension_company;
            calculation_result.pension_employee := calculation_result.contribution_base * city_record.pension_employee;
            calculation_result.medical_company := calculation_result.contribution_base * city_record.medical_company;
            calculation_result.medical_employee := calculation_result.contribution_base * city_record.medical_employee;
            calculation_result.unemployment_company := calculation_result.contribution_base * city_record.unemployment_company;
            calculation_result.unemployment_employee := calculation_result.contribution_base * city_record.unemployment_employee;
            calculation_result.injury_company := calculation_result.contribution_base * city_record.injury_company;
            calculation_result.maternity_company := calculation_result.contribution_base * city_record.maternity_company;
            calculation_result.provident_company := calculation_result.contribution_base * city_record.provident_company;
            calculation_result.provident_employee := calculation_result.contribution_base * city_record.provident_employee;

            -- 计算总计
            calculation_result.total_company :=
                calculation_result.pension_company + calculation_result.medical_company +
                calculation_result.unemployment_company + calculation_result.injury_company +
                calculation_result.maternity_company + calculation_result.provident_company;

            calculation_result.total_employee :=
                calculation_result.pension_employee + calculation_result.medical_employee +
                calculation_result.unemployment_employee + calculation_result.provident_employee;

            -- 插入计算结果
            INSERT INTO results (
                salary_id,  -- 这里使用 NULL，因为我们是基于汇总计算
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
                total_company,
                total_employee,
                created_by,
                city_id,
                calculation_year
            ) VALUES (
                NULL,
                employee_record.employee_name,
                employee_record.avg_salary,
                calculation_result.contribution_base,
                calculation_result.pension_company,
                calculation_result.pension_employee,
                calculation_result.medical_company,
                calculation_result.medical_employee,
                calculation_result.unemployment_company,
                calculation_result.unemployment_employee,
                calculation_result.injury_company,
                calculation_result.maternity_company,
                calculation_result.provident_company,
                calculation_result.provident_employee,
                calculation_result.total_company,
                calculation_result.total_employee,
                p_user_id,
                city_record.id,
                p_calculation_year
            );

            processed_count := processed_count + 1;

        EXCEPTION
            WHEN OTHERS THEN
                error_count := error_count + 1;
                -- 记录错误但不中断处理
                CONTINUE;
        END IF;
    END LOOP;

    CLOSE employees_cursor;

    -- 返回结果
    RETURN QUERY
    SELECT
        true,
        format('计算完成，成功处理 %d 个员工，%d 个失败', processed_count, error_count),
        processed_count,
        error_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加注释说明函数用途
COMMENT ON FUNCTION calculate_monthly_contribution IS '计算单个员工月度社保缴费金额';
COMMENT ON FUNCTION batch_calculate_contributions IS '批量计算员工年度社保缴费金额';