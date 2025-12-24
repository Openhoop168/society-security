# Supabase 配置指南

本指南将帮助你配置真实的 Supabase 项目，使五险一金计算器的认证和数据库功能正常工作。

## 📋 配置概览

**预计耗时**: 15-30 分钟
**难度**: ⭐⭐☆☆☆（中等）
**费用**: 免费套餐足够使用

---

## 步骤 1: 注册 Supabase 账号

### 1.1 访问 Supabase

打开浏览器，访问 https://supabase.com

### 1.2 注册账号

你有两种注册方式：

**方式 A**: 使用 GitHub 注册（推荐）
- 点击 "Sign in with GitHub"
- 授权 GitHub 登录

**方式 B**: 使用邮箱注册
- 点击 "Start your project"
- 输入邮箱地址和密码
- 验证邮箱

---

## 步骤 2: 创建新项目

### 2.1 创建项目

登录后，点击 "New Project" 按钮。

### 2.2 填写项目信息

| 字段 | 填写内容 | 说明 |
|------|---------|------|
| **Name** | `society-security` | 项目名称 |
| **Database Password** | `设置强密码` | ⚠️ 请保存此密码 |
| **Region** | `Northeast Asia (Seoul)` | 选择最近的区域 |
| **Pricing Plan** | `Free` | 免费套餐 |

### 2.3 等待创建

- 项目创建需要 2-3 分钟
- 创建成功后会自动进入项目 Dashboard

---

## 步骤 3: 获取 API 密钥

### 3.1 进入 API 设置页面

1. 在左侧菜单点击 **Settings**
2. 选择 **API**

### 3.2 复制 API 密钥

你需要复制以下三个信息：

#### ① Project URL
```
格式: https://xxxxx.supabase.co
示例: https://abcdefgh.supabase.co
```

#### ② anon public key
```
格式: 以 eyJhbGci 开头的 JWT 字符串
```

#### ③ service_role key
```
格式: 以 eyJhbGci 开头的 JWT 字符串
⚠️ 警告: 此密钥仅在服务端使用，不要泄露！
```

### 3.3 保存密钥

将这三个值复制到记事本，稍后需要填入 `.env.local` 文件。

---

## 步骤 4: 配置环境变量

### 4.1 打开 `.env.local` 文件

在你的项目根目录下找到 `.env.local` 文件并打开。

### 4.2 替换为真实密钥

将文件内容替换为：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key

# 开发环境配置
NODE_ENV=development
```

**示例**:
```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 开发环境配置
NODE_ENV=development
```

### 4.3 保存文件

保存 `.env.local` 文件。

---

## 步骤 5: 创建数据库表

### 5.1 打开 SQL Editor

1. 在 Supabase Dashboard 左侧菜单
2. 点击 **SQL Editor**
3. 点击 **New query**

### 5.2 执行建表 SQL

复制以下完整的 SQL 脚本到编辑器，然后点击 **Run**：

```sql
-- ========================================
-- 五险一金计算器 - 数据库表创建脚本
-- ========================================

-- 1. 城市社保标准表
CREATE TABLE cities (
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

-- 2. 员工工资表
CREATE TABLE salaries (
  id BIGSERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 计算结果表
CREATE TABLE results (
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

-- ========================================
-- 行级安全策略 (RLS)
-- ========================================

-- 启用 RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 允许认证用户访问所有表
CREATE POLICY "允许所有认证用户访问 cities"
ON cities FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "允许所有认证用户访问 salaries"
ON salaries FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "允许所有认证用户访问 results"
ON results FOR ALL USING (auth.role() = 'authenticated');

-- ========================================
-- 插入示例数据
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
);
```

### 5.3 验证表创建

1. 点击左侧 **Table Editor**
2. 你应该能看到三个表：
   - `cities`
   - `salaries`
   - `results`

点击 `cities` 表，应该能看到一条佛山 2025 的示例数据。

---

## 步骤 6: 配置认证设置

### 6.1 进入 Authentication 设置

1. 在左侧菜单点击 **Authentication**
2. 点击 **Settings**

### 6.2 配置 Email Provider

确保以下设置：

| 设置项 | 状态 | 说明 |
|--------|------|------|
| **Enable Email provider** | ✅ 开启 | 允许邮箱注册登录 |
| **Confirm email** | ❌ 关闭（开发阶段） | 关闭后可直接登录，无需验证邮箱 |
| **Secure email change** | ✅ 开启 | 修改邮箱需要确认 |

### 6.3 保存设置

点击 **Save** 保存配置。

---

## 步骤 7: 测试认证功能

### 7.1 重启开发服务器

```bash
# 停止当前服务器（在终端按 Ctrl+C）
# 然后重新启动
npm run dev
```

### 7.2 测试注册

1. 打开浏览器，访问 http://localhost:3000/register
2. 填写注册表单：
   - **姓名**: 张三
   - **邮箱**: test@example.com
   - **密码**: 设置一个密码（至少 6 位）
3. 点击 "注册"

### 7.3 验证注册成功

**成功标志**：
- ✅ 页面自动跳转到首页
- ✅ 显示"欢迎，张三"
- ✅ 在 Supabase Dashboard → Authentication → Users 能看到新用户

### 7.4 测试登录

1. 点击右上角 "登出"
2. 访问 http://localhost:3000/login
3. 使用刚才注册的邮箱和密码登录
4. 验证登录成功并跳转到首页

---

## 步骤 8: 验证数据库连接

### 8.1 上传测试数据

1. 在主页点击"数据上传"
2. 上传一个 Excel 文件（测试数据）
3. 等待计算完成
4. 查看"结果查询"

### 8.2 检查数据库

在 Supabase Dashboard → Table Editor：
- 检查 `salaries` 表是否有数据
- 检查 `results` 表是否有计算结果

---

## ✅ 配置完成检查清单

- [ ] Supabase 账号创建成功
- [ ] 项目创建成功
- [ ] API 密钥已复制
- [ ] `.env.local` 已更新为真实密钥
- [ ] 数据库三张表创建成功
- [ ] RLS 策略已配置
- [ ] 示例数据插入成功
- [ ] Email Auth 已配置
- [ ] 注册功能测试通过
- [ ] 登录功能测试通过
- [ ] 数据库连接测试通过

---

## 🔒 安全性提醒

### 重要注意事项

1. **不要提交 `.env.local` 到 Git**
   ```bash
   # 确保 .gitignore 包含
   .env.local
   ```

2. **service_role_key 仅在服务端使用**
   - 不要在客户端代码中使用
   - 不要暴露给浏览器

3. **生产环境必须开启邮箱确认**
   - 在步骤 6.2 中开启 "Confirm email"
   - 防止垃圾注册

---

## 🆘 常见问题

### Q1: 注册时报错 "Failed to fetch"

**原因**: `.env.local` 中的 URL 或密钥不正确

**解决**:
1. 检查 `NEXT_PUBLIC_SUPABASE_URL` 格式是否正确
2. 确认 `anon` key 已正确复制
3. 重启开发服务器

---

### Q2: 用户注册成功但看不到数据

**原因**: RLS 策略阻止访问

**解决**:
1. 检查步骤 5.2 中的 RLS 策略是否已执行
2. 确认用户已登录（`auth.role()` = 'authenticated'）

---

### Q3: SQL 执行时报错

**原因**: 表已存在或权限问题

**解决**:
```sql
-- 删除已存在的表（谨慎使用！）
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS salaries CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

-- 重新执行建表脚本
```

---

### Q4: 忘记数据库密码

**解决**:
1. 在 Supabase Dashboard → Settings → Database
2. 点击 "Reset database password"
3. 设置新密码并保存

---

## 📚 下一步

配置完成后，你可以：

1. **测试完整功能**:
   - 上传 Excel 数据
   - 进行五险一金计算
   - 查看和导出结果

2. **添加更多城市数据**:
   ```sql
   INSERT INTO cities (city_name, year, ...)
   VALUES ('广州', '2025', ...);
   ```

3. **部署到生产环境**:
   - 配置自定义域名
   - 开启邮箱确认
   - 设置自动备份

---

## 🔗 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Next.js + Supabase 快速开始](https://supabase.com/docs/guides/with-nextjs)
- [项目文档](../README.md)

---

**创建时间**: 2025-12-23
**最后更新**: 2025-12-23
**维护者**: Society Security Team
