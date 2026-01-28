# 个人资料库系统

## 核心模块

### 1. 个人信息
- 头像、用户名、等级
- 加入时间、探险天数
- 称号/徽章
- 个人签名

### 2. 学习数据
- 完成任务数量
- 学习总时长
- 获得装备数
- 社区贡献值

### 3. 思维导图笔记
- Markdown编辑器
- 思维导图可视化
- 标签分类
- 全文搜索

### 4. 装备库
- 已购买装备
- 下载记录
- 激活状态
- 使用统计

### 5. 订阅管理
- 当前套餐
- 到期时间
- 续费历史
- 发票下载

### 6. 成就系统
- 解锁成就
- 进度追踪
- 稀有度
- 奖励领取

### 7. 收藏夹
- 收藏的任务
- 书签管理
- 快速访问

### 8. 探险历史
- 时间线
- 关键里程碑
- 学习轨迹

---

## 思维导图集成

支持库: React-Flow / Mermaid

```typescript
// 笔记格式
interface Note {
  id: string
  title: string
  content: string // Markdown
  mindmap?: MindmapData // 思维导图
  tags: string[]
  createdAt: Date
}
```

**文档位置**: `PROFILE-SYSTEM.md`
