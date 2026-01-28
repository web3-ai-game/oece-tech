# 🎨 UI资产索引 | UI Assets Index

**关键词**: UI库, 组件库, React组件, SVG图标, 游戏模块, Web3组件, 酒店管理, 数字资产

**仓库**: https://github.com/svsbeta/hotel-ui  
**路径**: `./hotel-ui/`  
**文件数**: 324+  
**标签**: #UI组件 #React #SVG #游戏 #Web3 #酒店管理

## 🔍 快速索引表

| 组件类型 | 关键词 | 路径 | 文件类型 | 用途场景 |
|---------|--------|------|----------|----------|
| BASE_COMPONENTS | button,card,modal,input | ui-kit/base/ | .tsx | 基础UI构建 |
| HOTEL_COMPONENTS | hotel,room,service,amenities | digital-assets/icons/hospitality/ | .svg | 酒店管理系统 |
| GAME_MODULES | game,casino,slot,entertainment | game-pool/ | .html | 互动娱乐功能 |
| WEB3_COMPONENTS | web3,trading,defi,crypto,finance | web3-components/ | .js/.css | 金融交易系统 |
| DIGITAL_ASSETS | svg,icon,background,visual | digital-assets/ | .svg | 视觉设计资源 |
| REACT_COMPONENTS | react,page,component,layout | frontend/src/ | .tsx | 完整页面组件 |

## 📋 详细组件清单

### 🧩 基础UI组件 | BASE_COMPONENTS

**路径**: `hotel-ui/ui-kit/base/`  
**关键词**: button, card, modal, input, loading  
**用途**: 基础UI构建

- `Button.tsx` - 交互按钮组件 #按钮 #交互 #点击
- `Card.tsx` - 卡片容器组件 #卡片 #容器 #布局  
- `Modal.tsx` - 弹窗对话框组件 #弹窗 #对话框 #模态
- `Input.tsx` - 输入框表单组件 #输入框 #表单 #用户输入
- `Loading.tsx` - 加载动画组件 #加载 #动画 #等待状态

**使用示例**:
```typescript
import { Button, Card, Modal } from './hotel-ui/ui-kit/base';
```

### 🏨 酒店管理组件 | HOTEL_COMPONENTS

**路径**: `hotel-ui/digital-assets/icons/hospitality/`  
**关键词**: hotel, room, service, amenities  
**用途**: 酒店管理系统

- `hotel-amenities.svg` - 酒店设施图标 #酒店设施 #服务 #便民
- `room-types.svg` - 房型分类图标 #房型 #客房 #住宿
- `service-icons.svg` - 服务项目图标 #服务 #客服 #接待

**使用示例**:
```javascript
import HotelIcon from './hotel-ui/digital-assets/icons/hospitality/room-types.svg';
```

### 🎮 游戏娱乐模块 | GAME_MODULES

**路径**: `hotel-ui/game-pool/`  
**关键词**: game, casino, slot, entertainment  
**用途**: 互动娱乐功能

- `slot-machine.html` - 老虎机游戏 #老虎机 #3D动画 #音效系统
- `airdrop-rush.html` - 空投抢夺游戏 #空投游戏 #实时交互 #Canvas动画
- `price-predict.html` - 价格预测游戏 #预测游戏 #金融数据 #图表分析
- `index.html` - 游戏中心首页 #游戏中心 #导航 #入口页面

**使用示例**:
```html
<iframe src="./hotel-ui/game-pool/slot-machine.html" width="800" height="600"></iframe>
```

### 💰 Web3金融组件 | WEB3_COMPONENTS

**路径**: `hotel-ui/web3-components/`  
**关键词**: web3, trading, defi, crypto, finance  
**用途**: 金融交易系统

#### JavaScript模块 `/js/`
- `trading.js` - 交易终端核心 #交易终端 #实时数据 #订单管理
- `defi.js` - DeFi协议接口 #DeFi协议 #流动性池 #收益计算
- `charts.js` - 金融图表系统 #金融图表 #技术指标 #K线图
- `algorithms.js` - 算法交易引擎 #算法交易 #策略引擎 #风控系统
- `utils.js` - 工具函数库 #工具函数 #辅助方法 #通用函数

#### 样式文件 `/styles/`
- `trading.css` - 交易界面样式 #交易UI #界面样式 #主题
- `defi.css` - DeFi界面样式 #DeFi界面 #协议UI #流动性
- `nft.css` - NFT展示样式 #NFT展示 #数字收藏 #艺术品

**使用示例**:
```javascript
import { TradingTerminal } from './hotel-ui/web3-components/js/trading.js';
import './hotel-ui/web3-components/styles/trading.css';
```

### 🎨 数字视觉资产 | DIGITAL_ASSETS

**路径**: `hotel-ui/digital-assets/`  
**关键词**: svg, icon, background, visual  
**用途**: 视觉设计资源

#### 背景资源 `/backgrounds/`

**抽象风格 `/abstract/`**
- `fluid-waves.svg` - 流体波浪背景 #流体波浪 #抽象风格 #动感背景
- `gradient-blobs.svg` - 渐变气泡背景 #渐变气泡 #柔和背景 #现代设计
- `particle-mesh.svg` - 粒子网格背景 #粒子网格 #科技感 #网络连接

**几何图案 `/geometric/`**
- `hexagon-pattern.svg` - 六边形图案 #六边形 #几何图案 #重复纹理
- `triangle-grid.svg` - 三角网格图案 #三角网格 #几何美学 #简约设计
- `diamond-lattice.svg` - 钻石晶格图案 #钻石晶格 #奢华感 #精致纹理
- `circuit-lines.svg` - 电路线条图案 #电路线条 #科技风格 #电子元素
- `dots-grid.svg` - 点阵网格图案 #点阵网格 #简洁背景 #规整排列
- `wave-patterns.svg` - 波浪图案背景 #波浪图案 #动态感 #流动效果

**科技风格 `/tech/`**
- `matrix-code.svg` - 矩阵代码背景 #矩阵代码 #编程风格 #黑客美学
- `neural-network.svg` - 神经网络图案 #神经网络 #AI风格 #智能科技

#### 图标资源 `/icons/`

**金融图标 `/finance/`**
- `crypto-coins.svg` - 加密货币图标集 #加密货币 #数字货币 #比特币
- `stock-charts.svg` - 股票图表图标 #股票图表 #金融数据 #投资理财
- `trading-indicators.svg` - 交易指标图标 #交易指标 #技术分析 #市场数据

**游戏图标 `/gaming/`**
- `slot-symbols.svg` - 老虎机符号集 #老虎机符号 #游戏元素 #赌场图标
- `poker-cards.svg` - 扑克牌图标集 #扑克牌 #卡牌游戏 #娱乐元素
- `dice-collection.svg` - 骰子图标集 #骰子 #随机游戏 #概率元素

#### 装饰元素 `/decorative/`

**粒子效果 `/particles/`**
- `floating-dots.svg` - 浮动点阵效果 #浮动点阵 #动态效果 #装饰元素
- `light-rays.svg` - 光线效果图案 #光线效果 #光影美学 #视觉冲击

**几何形状 `/shapes/`**
- `geometric-crystals.svg` - 几何水晶图案 #几何水晶 #立体感 #现代艺术
- `prismatic-gems.svg` - 棱镜宝石图案 #棱镜宝石 #奢华质感 #光影折射

#### 赌场元素 `/casino/`
- `slot-machine.svg` - 老虎机图标 #老虎机图标 #赌场设备 #娱乐设施
- `slot-machine-interactive.html` - 互动老虎机 #互动老虎机 #HTML5游戏 #在线娱乐

**使用示例**:
```css
.hero-section {
  background-image: url('./hotel-ui/digital-assets/backgrounds/geometric/hexagon-pattern.svg');
}
```

### ⚛️ React完整组件 | REACT_COMPONENTS

**路径**: `hotel-ui/frontend/src/`  
**关键词**: react, page, component, layout  
**用途**: 完整页面和功能组件

#### 页面组件 `/pages/`
- `HomePage.tsx` - 首页主页面 #首页 #着陆页 #主入口
- `LoginPage.tsx` - 用户登录页面 #登录页 #用户认证 #身份验证
- `RegisterPage.tsx` - 用户注册页面 #注册页 #新用户 #账号创建
- `ProfilePage.tsx` - 个人资料页面 #个人资料 #用户信息 #账号管理
- `AdminPage.tsx` - 管理后台页面 #管理后台 #权限控制 #系统管理
- `TicketPage.tsx` - 票务管理页面 #票务页面 #订单管理 #支付处理
- `TutorialsPage.tsx` - 教程指南页面 #教程页面 #使用指南 #帮助文档

#### 功能组件 `/components/`

**认证组件 `/Auth/`**
- `ProtectedRoute.tsx` - 路由保护组件 #路由保护 #权限验证 #访问控制

**布局组件 `/Layout/`**
- `Navbar.tsx` - 导航栏组件 #导航栏 #页面头部 #菜单导航
- `Footer.tsx` - 页脚组件 #页脚 #页面底部 #版权信息

**业务组件**
- `HeroSection.tsx` - 英雄区块组件 #英雄区块 #首页Banner #主要展示
- `AnimatedVisual.tsx` - 动画可视化组件 #动画组件 #可视化效果 #交互动画
- `Icons.tsx` - 图标管理组件 #图标组件 #图标库 #矢量图标
- `FeaturesShowcase.tsx` - 功能展示组件 #功能展示 #特性介绍 #产品亮点

**专业组件**
- `/CodeDisplay/` - 代码显示器组件 #代码显示 #语法高亮 #编程展示
- `/Progress/` - 进度条组件库 #进度条 #进度指示 #状态展示
- `/Quiz/` - 测验问答系统 #测验系统 #问答功能 #互动学习
- `/Roadmap/` - 学习路径组件 #学习路径 #路线图 #进程管理
- `/Stats/` - 统计数据组件 #统计组件 #数据可视化 #图表展示
- `/Testimonials/` - 用户评价组件 #用户评价 #推荐展示 #社会证明

**使用示例**:
```typescript
import { HomePage } from './hotel-ui/frontend/src/pages/HomePage';
import { Navbar } from './hotel-ui/frontend/src/components/Layout/Navbar';
```

## 🎯 场景化使用指南

### 酒店管理系统集成
- **基础UI**: Button, Card, Modal, Input
- **酒店图标**: hotel-amenities.svg, room-types.svg
- **页面组件**: HomePage, AdminPage, ProfilePage

### 游戏娱乐中心
- **游戏模块**: slot-machine.html, airdrop-rush.html
- **游戏图标**: slot-symbols.svg, poker-cards.svg
- **装饰元素**: casino/slot-machine.svg

### 金融交易平台
- **Web3组件**: trading.js, defi.js, charts.js
- **金融图标**: crypto-coins.svg, stock-charts.svg
- **样式文件**: trading.css, defi.css

### 视觉设计资源
- **背景资源**: geometric/hexagon-pattern.svg
- **装饰元素**: particles/floating-dots.svg
- **几何形状**: shapes/geometric-crystals.svg

## 🔍 搜索索引

### 按功能搜索
- **按钮相关**: Button.tsx, 交互, 点击事件
- **卡片相关**: Card.tsx, 容器, 布局组件
- **弹窗相关**: Modal.tsx, 对话框, 用户交互
- **酒店相关**: hospitality/, 房型, 服务设施
- **游戏相关**: game-pool/, 老虎机, 娱乐功能
- **金融相关**: web3-components/, 交易, DeFi

### 按技术类型搜索
- **React组件**: .tsx文件, 页面组件, 功能组件
- **SVG图标**: .svg文件, 矢量图标, 可缩放图形
- **HTML5游戏**: .html文件, 互动游戏, Canvas动画
- **JavaScript模块**: .js文件, 业务逻辑, 功能库
- **CSS样式**: .css文件, 界面样式, 主题设计

### 按使用场景搜索
- **首页构建**: HomePage, HeroSection, 导航组件
- **用户认证**: LoginPage, RegisterPage, ProtectedRoute
- **管理后台**: AdminPage, 权限控制, 数据管理
- **娱乐功能**: 游戏模块, 互动元素, 动画效果
- **金融功能**: 交易组件, 图表系统, 数据分析
