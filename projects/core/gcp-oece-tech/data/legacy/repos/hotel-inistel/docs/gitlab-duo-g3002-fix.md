# GitLab Duo G3002 错误解决方案

## 错误信息
```
I'm sorry, you have not selected a default GitLab Duo namespace. 
Please select a default GitLab namespace for Duo in Preferences > Behaviour in GitLab. 
Error code: G3002
```

## 解决步骤

### 1. 组织级别设置
- 访问: https://gitlab.com/oicc1/-/settings/duo
- 选择 "Always on"
- 启用 "Web and IDE features"

### 2. 用户偏好设置 ⭐ 关键步骤
- 访问: https://gitlab.com/-/profile/preferences
- 找到 "Behavior" → "GitLab Duo" 部分
- 在 "Default namespace" 选择 "oicc1"
- 保存更改

### 3. 等待生效
- 配置可能需要 10-15 分钟生效
- 清除浏览器缓存后重试

### 4. 验证设置
- 项目页面应显示 "GitLab Duo Chat" 按钮
- VS Code 中 GitLab Duo 功能正常工作
