# ✅ DeepWeay 统一布局检查清单

**目标**: 确保所有页面都有统一的Header、Footer和Sidebar

---

## 🎯 布局要求

### 必须组件
1. **AppHeader** - 全局顶部导航
   - Logo + 品牌名
   - 语言切换器（EN/繁中）
   - 移动端菜单
   
2. **Sidebar** - 左侧导航栏
   - Dashboard
   - Articles
   - AI Tools（带子菜单）
   - Forum
   - Settings
   - Logout

3. **AppFooter** - 全局底部
   - 4列布局
   - 社交媒体链接
   - 版权信息

---

## 📂 路由结构

### (authenticated) 路由组
**位置**: `/src/app/(authenticated)/`
**特点**: 自动继承 layout.tsx 中的所有布局组件

**包含页面:**
```
src/app/(authenticated)/
├── layout.tsx          ✅ 包含 Header + Sidebar + Footer
├── dashboard/          ✅ 继承布局
├── articles/           ✅ 继承布局
├── bbs/                ✅ 继承布局
├── ai-tools/           ✅ 继承布局
├── visa-comparison/    ✅ 继承布局
├── visa-assistant/     ✅ 继承布局
├── cost-of-living/     ✅ 继承布局
└── planner/            ✅ 继承布局
```

---

## 🛠️ AI工具导航

### Sidebar子菜单
当Sidebar展开时，显示AI工具列表：

```
AI Tools
  ▸ Visa Comparison
  ▸ Visa Assistant  
  ▸ Cost of Living
  ▸ Trip Planner
```

### 导航状态
- ✅ 当前工具高亮显示
- ✅ 父级菜单（AI Tools）激活
- ✅ 子菜单项可点击

---

## 📱 响应式设计

### Desktop (≥768px)
- Sidebar默认展开
- 显示子菜单
- Header完整显示
- Footer 4列布局

### Mobile (<768px)
- Sidebar折叠
- Header显示菜单按钮
- Sheet侧边菜单
- Footer简化布局

---

## 🎨 设计规范

### 颜色
- Primary: Cyan (#00FFFF)
- Accent: Purple/Pink
- Background: Dark

### 字体
- Headline: Orbitron
- Mono: VT323
- Body: Noto Sans TC

### 间距
- Container: max-w-7xl
- Padding: p-4 sm:p-6 lg:p-8

---

## 🔍 检查方法

### 1. 视觉检查
```bash
# 访问每个页面
http://localhost:3000/dashboard
http://localhost:3000/visa-comparison
http://localhost:3000/visa-assistant
http://localhost:3000/cost-of-living
http://localhost:3000/planner
http://localhost:3000/bbs
```

### 2. 验证组件
- [ ] Header显示在顶部
- [ ] Sidebar显示在左侧
- [ ] Footer显示在底部
- [ ] 语言切换器工作
- [ ] Sidebar可折叠
- [ ] 子菜单显示正确

### 3. 测试响应式
- [ ] 桌面端布局正常
- [ ] 移动端菜单可用
- [ ] Sidebar折叠状态正确

---

## ⚠️ 常见问题

### 问题1: 页面缺少Header/Footer
**原因**: 页面不在 (authenticated) 路由组
**解决**: 移动页面到正确位置

### 问题2: Sidebar不显示
**原因**: 缺少 SidebarProvider
**解决**: 检查 layout.tsx 包裹结构

### 问题3: 子菜单不显示
**原因**: Sidebar折叠状态
**解决**: 展开Sidebar查看子菜单

---

## ✅ 已完成

- [x] 创建 AppHeader 组件
- [x] 创建 AppFooter 组件
- [x] 集成到 (authenticated) layout
- [x] 添加 AI Tools 子菜单
- [x] 4个AI工具页面在正确位置
- [x] 响应式导航菜单
- [x] 语言切换功能

---

## 📋 下一步

### 新工具开发检查清单
每次添加新工具时：

1. **创建页面**
   ```bash
   src/app/(authenticated)/[tool-name]/page.tsx
   ```

2. **添加到Sidebar**
   ```typescript
   // layout.tsx
   subItems: [
     { href: '/new-tool', label: 'New Tool' }
   ]
   ```

3. **测试布局**
   - 访问页面
   - 检查Header/Footer/Sidebar
   - 验证导航高亮

---

**所有页面现在都有统一的布局！** ✨
