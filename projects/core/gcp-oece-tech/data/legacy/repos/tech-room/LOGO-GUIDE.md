# 🎨 OECE.TECH Logo 使用指南

## 🎯 Logo 设计说明

### 设计理念
- **赛博朋克风格** - 霓虹光晕、科技感
- **字母造型** - OECE 四个字母组成
- **渐变配色** - 青绿到蓝色的科技渐变
- **动态效果** - 扫描线、脉冲光点

### 颜色方案
```
主色: #00ff88 (霓虹绿)
辅色: #00d4ff (霓虹蓝)
背景: #0a0e14 (深黑)
```

---

## 📦 Logo 组件

### 1. 完整版 Logo (OECELogo)

**尺寸**: 200x200px  
**特性**: 带动画、光晕效果、装饰元素

```tsx
import { OECELogo } from '@/components/logo/OECELogo'

<OECELogo 
  size={200}           // 尺寸
  animated={true}      // 启用动画
  glowing={true}       // 启用光晕
  className=""         // 自定义类名
/>
```

**使用场景**:
- 首页大Logo展示
- 关于页面
- Loading页面
- 品牌展示

---

### 2. 简化版 Logo (OECELogoSimple)

**尺寸**: 可自定义（推荐40-60px）  
**特性**: 静态、轻量、适合小尺寸

```tsx
import { OECELogoSimple } from '@/components/logo/OECELogo'

<OECELogoSimple 
  size={40}
  className="transition-transform hover:scale-110"
/>
```

**使用场景**:
- Header导航栏 ✅ (已使用)
- Footer
- 移动端菜单
- 小尺寸展示

---

### 3. Favicon (OECEFavicon)

**尺寸**: 32x32px  
**特性**: 极简、适合浏览器标签

```tsx
import { OECEFavicon } from '@/components/logo/OECELogo'

<OECEFavicon />
```

**文件位置**: `public/favicon.svg`

**使用场景**:
- 浏览器标签图标
- PWA应用图标
- 书签图标

---

## 🎨 使用示例

### 首页Hero区域

```tsx
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* 大Logo + 动画 */}
      <OECELogo 
        size={300}
        animated={true}
        glowing={true}
      />
      
      <h1 className="text-4xl font-mono text-neon mt-8">
        OECE.TECH
      </h1>
      <p className="text-pixel-light/70 mt-4">
        Anonymous Tech Community
      </p>
    </div>
  )
}
```

### Header导航栏 ✅

```tsx
<Link href="/" className="flex items-center gap-3 group">
  <OECELogoSimple 
    size={40} 
    className="transition-transform group-hover:scale-110" 
  />
  <div className="hidden sm:block">
    <div className="text-pixel-lg font-bold text-neon font-mono">
      OECE.TECH
    </div>
    <div className="text-pixel-xs text-pixel-light/50 font-mono">
      ANONYMOUS TECH
    </div>
  </div>
</Link>
```

### Loading状态

```tsx
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-pixel-darker flex items-center justify-center">
      <OECELogo 
        size={150}
        animated={true}
        glowing={true}
      />
    </div>
  )
}
```

---

## 🎭 动画效果

### 扫描线动画
- 从上到下扫描
- 30ms刷新率
- 营造赛博朋克感

### 脉冲光点
- 四角闪烁光点
- 不同频率
- 增强科技感

### 光晕效果
- 高斯模糊
- 双层叠加
- 霓虹发光感

---

## 📱 响应式适配

### 桌面端
```tsx
<OECELogo size={200} />          // 首页
<OECELogoSimple size={50} />     // Header
```

### 移动端
```tsx
<OECELogo size={150} />          // 首页
<OECELogoSimple size={40} />     // Header
<OECELogoSimple size={30} />     // 底部导航
```

### 自适应示例
```tsx
<OECELogo 
  size={window.innerWidth > 768 ? 200 : 150}
  animated={window.innerWidth > 768}
/>
```

---

## 🎨 配色变体

### 原版（推荐）
```
主色: #00ff88 (霓虹绿)
辅色: #00d4ff (霓虹蓝)
```

### 紫色变体
```tsx
// 修改渐变色
<linearGradient id="gradient-purple">
  <stop offset="0%" stopColor="#a855f7" />
  <stop offset="100%" stopColor="#ec4899" />
</linearGradient>
```

### 黄色变体
```tsx
<linearGradient id="gradient-gold">
  <stop offset="0%" stopColor="#fbbf24" />
  <stop offset="100%" stopColor="#f59e0b" />
</linearGradient>
```

---

## 🖼️ 导出格式

### SVG（推荐）
- 矢量格式
- 任意缩放不失真
- 文件小

### PNG
```bash
# 使用 Inkscape 或在线工具导出
- 32x32 (favicon)
- 192x192 (PWA)
- 512x512 (高清)
```

---

## 📝 品牌规范

### 使用规则
✅ 可以缩放  
✅ 可以改变颜色（保持品牌一致性）  
✅ 可以添加动画  

❌ 不要变形拉伸  
❌ 不要改变字母比例  
❌ 不要在低对比度背景使用  

### 最小尺寸
- 数字媒体: 24x24px
- 印刷品: 10mm x 10mm

### 留白空间
- 四周至少保留Logo高度的10%空间

---

## 🎯 快速参考

```tsx
// Header - 已实现 ✅
<OECELogoSimple size={40} />

// 首页Hero - 推荐
<OECELogo size={200} animated glowing />

// Loading
<OECELogo size={150} animated />

// Footer
<OECELogoSimple size={50} />

// 移动端导航
<OECELogoSimple size={32} />
```

---

## 🔗 相关文件

```
components/logo/OECELogo.tsx    - Logo组件
public/favicon.svg              - Favicon
public/logo-192.png             - PWA图标（待生成）
public/logo-512.png             - PWA图标（待生成）
```

---

**Logo已就绪！赛博朋克风格，霓虹光晕，完美展示！** ✨🎨

**Header已更新使用新Logo** ✅
