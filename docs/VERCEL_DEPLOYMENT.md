# Vercel 部署指南

本指南将帮助你将五险一金计算器部署到 Vercel 平台。

## 📋 部署前准备

### 1. 确认 Supabase 配置

确保你的 Supabase 项目已经：
- ✅ 创建完成
- ✅ 数据库表已创建
- ✅ 环境变量已配置在 `.env.local` 中
- ✅ 用户认证功能已测试通过

### 2. 准备部署信息

你需要准备以下信息：
- **Vercel 账号**（GitHub 账号可直接登录）
- **Supabase API 密钥**（已在 `.env.local` 中配置）

---

## 🚀 部署步骤

### 步骤 1: 登录 Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Login"
3. 使用 GitHub、GitLab 或 Bitbucket 账号登录

### 步骤 2: 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. Vercel 会请求访问你的 GitHub 仓库
3. 点击 **"Import"** 授权访问
4. 找到 `society-security` 项目并点击 **"Import"**

### 步骤 3: 配置项目

在项目配置页面：

**Framework Preset**: Next.js ✅ (自动检测)

**Root Directory**: `./` (默认)

**Build Command**: `npm run build` (自动检测)

**Output Directory**: `.next` (自动检测)

### 步骤 4: 配置环境变量

在 **Environment Variables** 部分，添加以下变量：

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key-here` | Production, Preview |

**重要**：
- 点击 "Add" 添加每个变量
- 确保选择 **Production** 和 **Preview** 环境
- 不要勾选 Development

### 步骤 5: 配置 Supabase CORS

在部署之前，你需要在 Supabase 中配置 CORS：

1. 访问 Supabase Dashboard → 你的项目
2. 点击 **Settings** → **API**
3. 找到 **CORS allowed origins**
4. 添加以下域名（每行一个）：
   ```
   https://your-project.vercel.app
   http://localhost:3000
   ```
5. 点击 **Save**

**注意**: 替换 `your-project.vercel.app` 为你的实际 Vercel 域名（部署后获得）。

### 步骤 6: 部署

1. 点击页面底部的 **"Deploy"** 按钮
2. Vercel 会开始构建和部署你的应用
3. 等待大约 1-2 分钟
4. 部署完成后，你会看到绿色的 "Deployed" 状态
5. 点击生成的域名（如 `https://society-security-xxx.vercel.app`）访问应用

---

## 🎯 部署后验证

### 1. 基本功能测试

- ✅ 访问主页是否正常加载
- ✅ 点击注册按钮
- ✅ 填写注册信息并提交
- ✅ 确认能够成功注册并登录

### 2. Supabase 验证

在 Supabase Dashboard 中：
- 进入 **Authentication** → **Users**
- 确认新用户已注册

### 3. 数据库验证

在 Supabase Dashboard 中：
- 进入 **Table Editor**
- 确认三张表存在：
  - `cities`
  - `salaries`
  - `results`

---

## 🔄 自动部署

配置完成后，每次你推送代码到 GitHub 主分支时，Vercel 会自动：

1. 检测到代码变更
2. 自动构建新版本
3. 运行测试（如果配置）
4. 部署到生产环境

---

## 🌐 自定义域名（可选）

### 配置步骤

1. 在 Vercel 项目中，点击 **Settings** → **Domains**
2. 输入你的域名（如 `app.yourdomain.com`）
3. 按照提示配置 DNS 记录：
   - 类型: `CNAME`
   - 名称: `app` (或你的子域名)
   - 值: `cname.vercel-dns.com`

4. 等待 DNS 生效（通常 5-30 分钟）

---

## ⚠️ 常见问题

### Q1: 部署后无法连接 Supabase

**原因**: CORS 配置问题

**解决**:
1. 在 Supabase Dashboard → Settings → API
2. 在 **CORS allowed origins** 中添加你的 Vercel 域名
3. 保存并等待 1-2 分钟

### Q2: 环境变量未生效

**原因**: 变量名称错误或未选择正确环境

**解决**:
1. 检查变量名称是否完全匹配（包括大小写）
2. 确保选择了 **Production** 和 **Preview** 环境
3. 重新部署项目

### Q3: 构建失败

**原因**: 依赖安装失败或类型错误

**解决**:
1. 检查 GitHub Actions 的构建日志
2. 确保 `package.json` 中的依赖正确
3. 本地运行 `npm run build` 测试

### Q4: 注册/登录失败

**原因**: 邮箱验证未确认

**解决**:
1. 在 Supabase Dashboard → Authentication → Users
2. 手动确认测试用户的邮箱
3. 或在 Authentication → Settings 中关闭 "Confirm email"

---

## 📊 性能优化建议

### 1. 启用 Vercel Analytics

```bash
npm install @vercel/analytics
```

在 `src/app/layout.tsx` 中添加：

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. 配置图片优化

使用 Next.js Image 组件：

```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority
/>
```

### 3. 启用 ISR (增量静态再生成)

对于不常变化的页面，可以配置 ISR：

```typescript
// src/app/page.tsx
export const revalidate = 3600 // 每小时重新生成
```

---

## 🔒 安全性检查清单

- [ ] `.env.local` 在 `.gitignore` 中
- [ ] 生产环境变量已正确配置
- [ ] Supabase RLS 策略已启用
- [ ] CORS 配置正确
- [ ] 邮箱验证已开启（生产环境）
- [ ] 错误页面已配置（404, 500）

---

## 📚 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Supabase 部署指南](https://supabase.com/docs/guides/deployment)

---

**创建时间**: 2025-12-23
**最后更新**: 2025-12-23
**维护者**: Society Security Team
