# 用户界面设计系统

## 🎨 设计理念

融合 **x.ai** 的专业简洁与 **Web3** 的现代美学，去除杂乱感，强调稳重可靠。

## 🎯 核心特点

### 1. 色彩系统
```css
/* 主色调 */
--primary-gradient: from-purple-500 to-blue-500;
--background: #000000;
--surface: rgba(17, 17, 17, 0.5);
--border: #1f2937;

/* 文本色彩 */
--text-primary: #ffffff;
--text-secondary: #9ca3af;
--text-muted: #6b7280;

/* 功能色 */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### 2. 布局结构

#### 侧边栏导航（类x.ai）
- 固定宽度: 256px (w-64)
- 深色背景: bg-gray-950
- 边框分隔: border-gray-800
- 图标+文字组合
- 悬停效果: 渐变高亮

#### 内容区域
- 弹性布局: flex-1
- 微渐变背景: from-gray-950 via-gray-950 to-gray-900
- 卡片容器: bg-gray-900/50 backdrop-blur
- 圆角设计: rounded-2xl

### 3. 组件设计

#### 按钮
```jsx
// 主要按钮
<button className="bg-gradient-to-r from-purple-500 to-blue-500 
  rounded-xl px-4 py-2 font-medium hover:shadow-lg transition">
  Primary Action
</button>

// 次要按钮
<button className="bg-gray-900 border border-gray-800 
  rounded-xl px-4 py-2 hover:bg-gray-800 transition">
  Secondary Action
</button>
```

#### 卡片
```jsx
<div className="bg-gray-900/50 backdrop-blur 
  border border-gray-800 rounded-2xl p-6">
  <!-- Content -->
</div>
```

#### 输入框
```jsx
<input className="bg-gray-900/50 border border-gray-800 
  rounded-xl px-4 py-3 text-white placeholder-gray-500 
  focus:outline-none focus:border-purple-500 transition" />
```

## 📱 页面架构

### 1. 登录/注册流程
```
/account/login     → 登录页面
/account/register  → 注册页面（两步流程）
/invite           → 获取邀请码
```

### 2. 用户仪表板
```
/account/dashboard
├── Overview      # 概览页
├── API Keys      # API密钥管理
├── Playground    # 在线测试
├── Usage        # 使用统计
├── Documentation # 文档
├── Billing      # 账单
└── Settings     # 设置
```

## 🎭 交互设计

### 动画效果
- **过渡**: transition-all duration-200
- **悬停**: hover:scale-105 hover:shadow-lg
- **加载**: animate-spin animate-pulse
- **渐变动画**: bg-[length:200%_100%] animate-shimmer

### 视觉反馈
- **成功**: 绿色图标 + 提示
- **错误**: 红色边框 + 错误信息
- **加载**: 旋转动画 + 文字提示
- **复制**: 图标切换 (Copy → Check)

## 📊 数据展示

### 统计卡片
```jsx
<div className="bg-gray-900/50 backdrop-blur 
  border border-gray-800 rounded-2xl p-6">
  <div className="flex items-center justify-between mb-4">
    <Icon className="w-8 h-8 text-purple-400" />
    <span className="text-xs text-gray-400">Label</span>
  </div>
  <div className="text-2xl font-bold">Value</div>
  <div className="text-sm text-gray-400 mt-1">Description</div>
</div>
```

### 进度条
```jsx
<div className="w-full bg-gray-800 rounded-full h-3">
  <div className="h-3 bg-gradient-to-r from-purple-500 to-blue-500 
    rounded-full transition-all" style={{ width: `${percentage}%` }} />
</div>
```

## 🔐 安全元素

### API密钥展示
- 默认隐藏: 使用 • 替代字符
- 显示/隐藏切换: Eye/EyeOff图标
- 一键复制: Copy图标
- 复制确认: Check图标动画

### 敏感操作
- 二次确认弹窗
- 密码验证
- 操作日志记录

## 🌐 响应式设计

### 断点
```css
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板竖屏 */
lg: 1024px  /* 平板横屏 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏 */
```

### 适配策略
- 移动端: 侧边栏收起为汉堡菜单
- 平板: 侧边栏可切换显示
- 桌面: 完整侧边栏+内容区

## 💡 最佳实践

### 1. 保持简洁
- 避免过多装饰元素
- 使用充足留白
- 清晰的视觉层级

### 2. 一致性
- 统一的圆角大小 (rounded-xl/2xl)
- 一致的间距系统 (p-4/6/8)
- 相同的过渡效果

### 3. 可访问性
- 高对比度文本
- 清晰的焦点状态
- 键盘导航支持

### 4. 性能优化
- backdrop-blur谨慎使用
- 动画使用transform/opacity
- 图片懒加载

## 📦 组件库

### 核心组件
- `Button` - 按钮组件
- `Card` - 卡片容器
- `Input` - 输入框
- `Select` - 下拉选择
- `Modal` - 模态框
- `Toast` - 提示信息
- `Table` - 数据表格
- `Chart` - 图表组件

### 布局组件
- `Sidebar` - 侧边栏
- `Header` - 顶部栏
- `Container` - 内容容器
- `Grid` - 网格布局

## 🚀 使用示例

```jsx
// 完整页面示例
export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* 侧边栏 */}
        <Sidebar />
        
        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto">
          <Header />
          <Container>
            <Grid>
              <Card>
                {/* 内容 */}
              </Card>
            </Grid>
          </Container>
        </div>
      </div>
    </div>
  )
}
```

## 🎯 设计目标

1. **专业感** - 企业级界面质感
2. **现代性** - 跟上最新设计趋势
3. **易用性** - 直观的用户体验
4. **一致性** - 统一的设计语言
5. **可扩展** - 易于添加新功能

---

**设计系统版本**: v1.0.0
**参考**: x.ai Dashboard + Web3 Modern UI
**更新日期**: 2024-01-20
