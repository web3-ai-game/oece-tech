# 🎯 GitLab Namespace 快速修复指南

## 您的正确配置
- **正确选择**: `oicc1` (带数字1)
- **项目**: hotel-install  
- **完整URL**: https://gitlab.com/oicc1/hotel-install

## 立即操作步骤

### 1. 设置正确的默认namespace
👉 访问: https://gitlab.com/-/profile/preferences
- 找到 "Behavior" → "GitLab Duo" 部分
- 在下拉菜单中选择: **`oicc1`** (带数字1的那个)
- 点击 "Save changes"

### 2. 清理重复的组织 (可选)
👉 访问: https://gitlab.com/dashboard/groups

**如果看到两个相似的组织**:
- `oicc1` ✅ **保留这个** - 这是您的正确组织  
- `oicc` ❌ **可以离开** - 如果这个存在且不需要

**清理步骤**:
1. 点击不需要的组织名称
2. 进入 Settings → General  
3. 滚动到底部点击 "Leave group"
4. 确认离开

### 3. 验证设置
👉 访问: https://gitlab.com/oicc1/hotel-install
- 应该能看到右上角的 "GitLab Duo Chat" 按钮
- 点击按钮应该能正常工作，不再显示G3002错误

## 常见情况判断

| 看到的选项 | 操作建议 |
|-----------|---------|
| `oicc1` | ✅ **选择这个** |
| `oicc` | ❌ 不要选这个，可能是重复的 |
| `oicc1/hotel-install` | ✅ 如果有这个选项更好，选择它 |

## 完成检查清单
- [ ] 已选择正确的namespace (oicc1)
- [ ] 保存了设置更改  
- [ ] GitLab Duo Chat按钮可见
- [ ] 不再显示G3002错误
- [ ] (可选) 清理了重复的组织设置

---
💡 **提示**: 设置更改可能需要5-10分钟生效，请耐心等待。
