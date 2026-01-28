# 🧪 Urban Diver Testing Guide

## ✅ 已完成的修复

### 1. 品牌重塑：都市潜航者 🏙️
- ❌ 旧品牌：Digital Nomad Compass
- ✅ 新品牌：Urban Diver | Deep Dive into Digital Nomad 2.0
- 主题口号：用物理距离和时间谈判
- 定位：数字游民 2.0 - 更深层次的都市潜航探索

### 2. 多语言配置 🌐
- ✅ 英文为默认语言
- ✅ 支持繁体中文切换（Header）
- ✅ 全局禁止 Google 自动翻译
  - `<html translate="no">`
  - `<meta name="google" content="notranslate" />`

### 3. 登录注册页面修复 🔐
- ✅ 添加 Header 和 Footer
- ✅ 修复输入框 disabled 锁定问题
- ✅ 更新为英文文案和都市潜航者主题
- ✅ 改进 Cyberpunk 风格（font-mono）

### 4. UI 清理 🎨
- ✅ 移除技术栈图标展示
- ✅ 保持极简主义设计
- ✅ 不暴露 Firebase/Next.js 等技术标识

---

## 🧭 完整测试流程

### Step 1: 验证 Supabase 连接

```bash
node test-supabase.js
```

**预期输出：**
```
✅ Supabase 配置正确！
✅ invites 表连接成功
   可用邀请码数量: 4
```

---

### Step 2: 注册新账号

1. **访问登录页**
   ```
   http://localhost:3000/login
   ```

2. **点击 "CREATE_ACCOUNT"**

3. **填写注册信息**
   ```
   Username: Urban Diver
   Email: test@urban.zone
   Password: 123456
   Invite Code: WELCOME2024
   ```

4. **点击 "CREATE_ACCOUNT" 提交**

5. **预期结果：**
   - ✅ Toast 提示："Account created"
   - ✅ 自动切换到登录表单
   - ✅ 邮箱自动填充

---

### Step 3: 登录账号

1. **填写登录信息**
   ```
   Email: test@urban.zone
   Password: 123456
   ```

2. **点击 "SIGN_IN"**

3. **预期结果：**
   - ✅ Toast 提示："Sign in successful - Welcome back, diver!"
   - ✅ 自动跳转到 Dashboard
   - ✅ URL 变为：`http://localhost:3000/dashboard`

---

### Step 4: 测试 Dashboard 功能

#### 4.1 查看用户信息
- ✅ 显示用户名和邮箱
- ✅ 会员等级：FREE
- ✅ 剩余邀请码：2

#### 4.2 生成新邀请码
1. 点击 "GENERATE_CODE" 按钮
2. 预期：
   - ✅ 生成 8 位随机码（如：AB12CD34）
   - ✅ Toast 提示成功
   - ✅ 实时显示在列表中
   - ✅ 剩余邀请码数量 -1

#### 4.3 复制邀请码
1. 点击未使用邀请码旁的复制按钮
2. 预期：
   - ✅ 复制到剪贴板
   - ✅ 按钮变为绿色 ✓ 图标
   - ✅ Toast 提示："已复制"
   - ✅ 2秒后恢复原样

#### 4.4 退出登录
1. 点击右上角 "EXIT" 按钮
2. 预期：
   - ✅ 退出登录
   - ✅ 跳转到登录页

---

## 🔍 功能检查清单

### 登录注册页面
- [ ] Header 正常显示（带语言切换）
- [ ] Footer 正常显示（版权信息）
- [ ] 页面标题：URBAN_DIVER / DIVE_DEEPER
- [ ] 表单输入框可以正常输入（未锁定）
- [ ] 切换登录/注册状态正常
- [ ] Google 翻译被禁用（英文不会自动翻译）

### Dashboard 页面
- [ ] 用户信息卡片显示正确
- [ ] 站点简介卡片显示（新增）
- [ ] 邀请码管理功能正常
- [ ] 生成邀请码按钮可用
- [ ] 复制邀请码功能正常
- [ ] 快捷入口卡片显示
- [ ] PRO 升级卡片显示（FREE 会员）
- [ ] 退出登录按钮正常

### 多语言功能
- [ ] Header 语言切换器显示
- [ ] 英文为默认语言
- [ ] 可以切换到繁体中文
- [ ] Google 翻译被禁用

---

## 🐛 常见问题排查

### Q1: 登录后没有跳转到 Dashboard
**原因：** Supabase 认证失败或路由保护问题
**解决：**
```bash
# 检查浏览器控制台错误
# 确认 .env.local 配置正确
# 重启开发服务器
npm run dev
```

### Q2: 注册时提示"邀请码无效"
**原因：** 邀请码已被使用或不存在
**解决：**
```sql
-- 在 Supabase SQL Editor 查询可用邀请码
SELECT code, is_used FROM public.invites WHERE is_used = false;
```

### Q3: 生成邀请码失败
**原因：** 剩余邀请码为 0 或数据库触发器未执行
**解决：**
```sql
-- 手动增加邀请码额度
UPDATE public.users 
SET invites_remaining = 2 
WHERE email = 'test@urban.zone';
```

### Q4: 页面显示中文而不是英文
**原因：** 浏览器语言设置或 i18n 配置问题
**解决：**
- 检查浏览器语言设置（应为 English）
- 清除浏览器缓存
- 确认 `<html lang="en">` 存在

### Q5: Google 翻译仍然出现
**原因：** 浏览器插件或设置覆盖
**解决：**
- 禁用 Google 翻译浏览器插件
- 检查 Chrome 设置 → 语言 → 关闭自动翻译

---

## 📊 测试数据

### 可用邀请码（初始）
```
WELCOME2024  - 欢迎码
NOMAD2024    - 数字游民码
COMPASS2024  - 指南针码
TEST2024     - 测试码
```

### 测试账号（可选创建）
```
Email: 123@123.com
Password: 123123
Display Name: 测试账号
```

---

## 🚀 下一步开发

- [ ] 实现 PRO 会员订阅（Stripe）
- [ ] BBS 论坛功能
- [ ] AI 工具集成
- [ ] 邀请码使用统计
- [ ] 用户邀请排行榜
- [ ] Telegram Bot 集成
- [ ] 文章内容管理

---

## 📝 项目记忆

### 品牌定位
- 主题：都市潜航者 深潜（Urban Diver / Deep Dive）
- 定位：数字游民 2.0
- 风格：Cyberpunk 极简主义

### 语言设置
1. 英文（默认）
2. 繁体中文
3. 禁止简体中文
4. 全局禁止 Google 翻译

### UI 原则
- 极简主义
- 不暴露技术栈
- 保持神秘感
- Cyberpunk 风格

---

**测试完成后，项目可以部署到 VPS！** 🎉
