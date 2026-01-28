# 🎨 SVG装饰元素使用指南

## 📦 创建的组件

所有SVG装饰组件位于: `components/decorations/CyberDecorations.tsx`

---

## 🎭 装饰组件列表

### 1. HexagonGrid (六边形网格)
**效果**: 六边形蜂窝网格背景  
**用途**: 全屏背景装饰

```tsx
import { HexagonGrid } from '@/components/decorations/CyberDecorations'

<HexagonGrid className="text-pixel-primary opacity-5" />
```

---

### 2. CircuitPattern (电路板纹理)
**效果**: 电路板线路图案  
**用途**: 科技感背景

```tsx
<CircuitPattern className="opacity-10" />
```

---

### 3. RadarCircle (雷达扫描圈)
**效果**: 旋转雷达扫描动画  
**用途**: Hero区域背景装饰

```tsx
<RadarCircle size={800} className="opacity-10" />
```

---

### 4. DataStream (数据流)
**效果**: 流动的数据线条  
**用途**: 动态背景效果

```tsx
<DataStream className="opacity-20" />
```

---

### 5. FloatingParticles (浮动粒子)
**效果**: 上升的光点粒子  
**用途**: 增加空间感

```tsx
<FloatingParticles count={30} className="opacity-30" />
```

**参数**:
- `count`: 粒子数量 (默认20)
- `className`: 自定义样式

---

### 6. TechCorners (科技角落装饰)
**效果**: 四个角落的科技线条  
**用途**: 页面边角装饰

```tsx
<TechCorners className="text-pixel-primary opacity-30" />
```

---

### 7. DigitalRain (数字雨)
**效果**: 矩阵风格数字雨  
**用途**: 动态背景

```tsx
<DigitalRain className="opacity-20" />
```

---

### 8. HologramScanlines (全息扫描线)
**效果**: 水平扫描线  
**用途**: 全息投影效果

```tsx
<HologramScanlines className="opacity-10" />
```

---

### 9. EnergyPulse (能量脉冲)
**效果**: 扩散的能量圈  
**用途**: 局部动态装饰

```tsx
<EnergyPulse className="opacity-20" />
```

---

### 10. CubeGrid (立方体网格)
**效果**: 3D立方体网格  
**用途**: 立体感背景

```tsx
<CubeGrid className="text-pixel-accent opacity-5" />
```

---

## 🎯 完整使用示例

### 首页全套装饰

```tsx
'use client'

import { 
  HexagonGrid, 
  CircuitPattern, 
  RadarCircle, 
  DataStream,
  FloatingParticles,
  TechCorners,
  DigitalRain,
  HologramScanlines,
  EnergyPulse,
  CubeGrid
} from '@/components/decorations/CyberDecorations'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-pixel-darker overflow-hidden">
      {/* 背景装饰层 */}
      <HexagonGrid className="text-pixel-primary" />
      <CircuitPattern />
      <CubeGrid className="text-pixel-accent" />
      <HologramScanlines />
      <DataStream className="opacity-20" />
      <FloatingParticles count={30} className="opacity-30" />
      <DigitalRain className="opacity-20" />
      <TechCorners className="text-pixel-primary opacity-30" />
      
      {/* 主要内容 */}
      <div className="relative z-10">
        <section className="min-h-screen flex items-center justify-center">
          {/* 雷达扫描背景 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <RadarCircle size={800} />
          </div>
          
          {/* 能量脉冲 */}
          <div className="absolute top-20 left-20 w-64 h-64 opacity-20">
            <EnergyPulse />
          </div>
          
          {/* 你的内容 */}
          <div className="text-center">
            <h1>OECE.TECH</h1>
          </div>
        </section>
      </div>
    </div>
  )
}
```

---

## 📐 布局建议

### 层次结构
```
├── 背景层 (z-0, absolute)
│   ├── HexagonGrid
│   ├── CircuitPattern
│   ├── CubeGrid
│   └── HologramScanlines
│
├── 动画层 (z-5, absolute)
│   ├── DataStream
│   ├── FloatingParticles
│   └── DigitalRain
│
├── 装饰层 (z-8, absolute)
│   ├── TechCorners
│   └── RadarCircle
│
└── 内容层 (z-10, relative)
    ├── 实际内容
    └── EnergyPulse (局部装饰)
```

---

## 🎨 颜色搭配

### 主要颜色
```css
text-pixel-primary   /* #00ff88 - 霓虹绿 */
text-pixel-accent    /* #00d4ff - 霓虹蓝 */
text-pixel-secondary /* #ff3366 - 霓虹红 */
text-pixel-warning   /* #ffaa00 - 霓虹黄 */
```

### 透明度建议
```tsx
// 背景静态装饰
opacity-5    /* 5% - 非常淡 */
opacity-10   /* 10% - 淡 */

// 动态效果
opacity-20   /* 20% - 适中 */
opacity-30   /* 30% - 明显 */
```

---

## 🚀 性能优化

### 1. 减少同时使用的装饰
```tsx
// ✅ 推荐 (5-7个)
<HexagonGrid />
<DataStream />
<FloatingParticles count={20} />
<TechCorners />
<RadarCircle />

// ❌ 避免 (全部同时使用)
// 会影响性能
```

### 2. 移动端简化
```tsx
// 根据屏幕尺寸条件渲染
{typeof window !== 'undefined' && window.innerWidth > 768 && (
  <>
    <DigitalRain />
    <FloatingParticles count={30} />
  </>
)}

// 移动端只使用静态装饰
{typeof window !== 'undefined' && window.innerWidth <= 768 && (
  <>
    <HexagonGrid />
    <TechCorners />
  </>
)}
```

### 3. 调整粒子数量
```tsx
// 桌面端
<FloatingParticles count={30} />

// 移动端
<FloatingParticles count={10} />
```

---

## 📱 响应式建议

### 桌面端 (>1024px)
```tsx
<RadarCircle size={800} />
<FloatingParticles count={30} />
<DigitalRain />
```

### 平板端 (768px-1024px)
```tsx
<RadarCircle size={600} />
<FloatingParticles count={20} />
```

### 移动端 (<768px)
```tsx
<HexagonGrid />
<TechCorners />
<HologramScanlines />
// 只使用静态装饰
```

---

## 🎯 使用场景

### Hero区域
```tsx
<RadarCircle />
<FloatingParticles />
<EnergyPulse />
```

### 内容区域
```tsx
<HexagonGrid />
<CircuitPattern />
<HologramScanlines />
```

### 卡片装饰
```tsx
// 卡片内部
<div className="card-pixel relative">
  <div className="absolute inset-0 opacity-5">
    <svg>
      <pattern id="dots">...</pattern>
    </svg>
  </div>
  <div className="relative z-10">
    内容
  </div>
</div>
```

---

## 🎨 自定义SVG

### 创建新装饰
```tsx
export function MyCustomDecoration({ className = '' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`}>
      {/* 你的SVG内容 */}
      <circle cx="50" cy="50" r="40" fill="#00ff88" />
    </svg>
  )
}
```

### 添加动画
```tsx
<circle cx="50" cy="50" r="20">
  <animate
    attributeName="r"
    from="20"
    to="40"
    dur="2s"
    repeatCount="indefinite"
  />
</circle>
```

---

## 📦 快速启用新首页

### 方法1: 重命名文件
```bash
# 备份原首页
mv app/page.tsx app/page-old.tsx

# 使用新首页
mv app/page-svg-enhanced.tsx app/page.tsx
```

### 方法2: 直接替换内容
复制 `app/page-svg-enhanced.tsx` 的内容到 `app/page.tsx`

---

## ✅ 检查清单

使用SVG装饰前检查:
- [ ] 导入需要的组件
- [ ] 设置合适的透明度
- [ ] 检查移动端显示
- [ ] 测试性能影响
- [ ] 调整颜色搭配
- [ ] 确认层级顺序

---

**大量SVG装饰已就绪！赛博朋克风格，科技感满满！** ✨🎨

**新首页文件**: `app/page-svg-enhanced.tsx` 🚀

**随时可以启用查看效果！** 🎉
