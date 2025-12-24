# 🚀 Vercel 部署检查清单

本文档提供了完整的 Vercel 部署步骤和检查清单。

## ✅ 部署前检查

### 1. 代码准备
- [x] 代码已推送到 GitHub
- [x] `.gitignore` 包含敏感文件：
  - [x] `.env.local`
  - [x] `.env.*.local`
  - [x] `node_modules`
- [x] `package.json` 脚本正确
- [x] `next.config.js` 配置正确

### 2. 环境变量准备
- [x] `NEXT_PUBLIC_SUPABASE_URL` 已获取
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已获取
- [x] `SUPABASE_SERVICE_ROLE_KEY` 已获取

### 3. Supabase 配置
- [x] Supabase 项目已创建
- [x] 数据库表已创建
- [x] RLS 策略已配置
- [ ] CORS 已配置（部署后添加域名）

---

## 📋 Vercel 部署步骤

### 步骤 1: 登录 Vercel

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 进入 Dashboard

### 步骤 2: 创建新项目

1. 点击 **"Add New..."**
2. 选择 **"Project"**
3. 授权 Vercel 访问你的 GitHub
4. 选择 `society-security` 仓库
5. 点击 **"Import"**

### 步骤 3: 配置项目设置

**项目名称**: `society-security` (或自定义)

**Framework Preset**: Next.js ✅

**Root Directory**: `./`

**Build Command**: `npm run build`

**Output Directory**: `.next`

**Install Command**: `npm install`

### 步骤 4: 配置环境变量

在 **Environment Variables** 部分，添加以下变量：

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key-here` | Production, Preview |

**操作步骤**：
1. 点击 **"Add New"** 按钮
2. 输入变量名和值
3. 选择环境：Production ✅ 和 Preview ✅
4. 点击 **"Save"**
5. 重复以上步骤添加所有三个变量

### 步骤 5: 部署

1. 检查所有配置正确
2. 点击页面底部的 **"Deploy"** 按钮
3. 等待构建和部署（约 1-2 分钟）
4. 部署成功后会显示绿色状态

### 步骤 6: 获取部署域名

部署成功后，Vercel 会提供一个域名：
- 格式：`https://society-security-xxx.vercel.app`
- 或自定义域名

**记录这个域名**，后续配置 Supabase CORS 需要用到。

---

## 🔧 部署后配置

### 配置 Supabase CORS

1. 访问 Supabase Dashboard → 你的项目
2. 点击 **Settings** → **API**
3. 找到 **CORS allowed origins** 部分
4. 添加以下域名：
   ```
   https://society-security-xxx.vercel.app
   ```
5. 点击 **Save**

### 验证部署

访问你的 Vercel 域名：
- [ ] 主页正常加载
- [ ] 注册页面可访问
- [ ] 能够注册新用户
- [ ] 注册后能正常登录
- [ ] 数据上传功能正常
- [ ] 计算功能正常

---

## 🧪 生产环境测试

### 功能测试

1. **用户认证**:
   - [ ] 注册新用户
   - [ ] 登录已有用户
   - [ ] 登出功能
   - [ ] 会话持久化

2. **数据上传**:
   - [ ] 上传城市社保标准 Excel
   - [ ] 上传员工工资 Excel
   - [ ] 数据验证正确
   - [ ] 错误提示友好

3. **计算功能**:
   - [ ] 计算结果正确
   - [ ] 基数计算符合规则
   - [ ] 各项费率正确
   - [ ] 总金额准确

4. **结果展示**:
   - [ ] 数据表格正确显示
   - [ ] 分页功能正常
   - [ ] 搜索功能正常
   - [ ] 导出 Excel 功能正常

### 性能测试

- [ ] 首屏加载时间 < 3 秒
- [ ] 页面切换流畅
- [ ] 无明显卡顿
- [ ] 响应式布局正常

### 安全性检查

- [ ] 未登录无法访问受保护页面
- [ ] 用户只能访问自己的数据
- [ ] API 调用正确认证
- [ ] 环境变量不暴露

---

## 🔄 自动部署

配置完成后，以下操作会触发自动部署：

- ✅ 推送代码到 `main` 分支
- ✅ 创建 Pull Request
- ✅ 合并 Pull Request

每次部署大约需要 1-2 分钟。

---

## 🐛 常见问题排查

### 构建失败

**检查**:
1. 查看构建日志
2. 检查 `package.json` 脚本
3. 确认所有依赖已安装
4. 本地运行 `npm run build` 测试

### 环境变量未生效

**解决**:
1. 确认变量名称正确（区分大小写）
2. 确认选择了正确的环境（Production）
3. 重新触发部署

### 无法连接 Supabase

**解决**:
1. 检查环境变量是否正确
2. 确认 Supabase CORS 已配置
3. 验证 Supabase 项目状态正常

### 注册/登录失败

**解决**:
1. 检查 Supabase Auth 设置
2. 确认邮箱验证配置
3. 查看 Supabase 日志

---

## 📊 部署后监控

### Vercel Dashboard

- [ ] 部署历史
- [ ] 构建日志
- [ ] 函数执行时间
- [ ] 带宽使用情况

### Supabase Dashboard

- [ ] 数据库大小
- [ ] API 请求数
- [ ] 用户数量
- [ ] 错误日志

---

## ✅ 部署完成清单

- [x] 代码已推送到 GitHub
- [x] Vercel 项目已创建
- [x] 环境变量已配置
- [x] 首次部署成功
- [ ] Supabase CORS 已配置
- [ ] 功能测试通过
- [ ] 性能测试通过
- [ ] 安全检查通过
- [ ] 监控已配置

---

## 🎉 部署成功！

恭喜！你的五险一金计算器已成功部署到生产环境。

**你的应用地址**: `https://society-security-xxx.vercel.app`

**下一步**:
1. 配置自定义域名（可选）
2. 设置监控和告警
3. 收集用户反馈
4. 持续优化性能

---

**创建时间**: 2025-12-23
**最后更新**: 2025-12-23
