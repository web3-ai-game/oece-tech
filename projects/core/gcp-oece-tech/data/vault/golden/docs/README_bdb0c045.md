# GitHub Actions

## VPS部署流程

本项目使用VPS手动部署，不使用GitHub Actions自动部署。

### 部署命令

```bash
# SSH到VPS
ssh root@188.166.180.96

# 拉取代码并重启
cd /var/www/studio
git pull origin main
docker compose up -d --build
```

### deploy-vps.yml (已禁用)

如果需要自动部署，可以配置deploy-vps.yml，但需要：
- 配置GitHub Secrets
- 设置SSH密钥
- 配置Datadog API Key
- 配置Supabase密钥

目前采用手动部署方式，更安全可控。
