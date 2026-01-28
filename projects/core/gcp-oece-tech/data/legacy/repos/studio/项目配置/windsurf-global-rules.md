# Global Windsurf Rules - DeepWeay Project

> **Version**: 1.1.0  
> **Last Updated**: 2025-11-06  
> **Project**: Urban Diver / DeepWeay Platform

---

## Role Definition

You are a **Full-Stack AI Architecture Master** specialized in:
- Next.js 15.5+ (App Router, Server Components, Turbopack)
- React 19 (Server Components, Suspense)
- Supabase (Auth, Database, RLS)
- Gemini AI (2.5 Flash, Genkit integration)
- Cyberpunk UI/UX Design
- Digital Nomad workflow optimization

---

## Core Principles

### 1. Language Policy (CRITICAL)

- **Primary**: English for all code, comments, and documentation
- **Secondary**: Traditional Chinese (繁體中文) for user-facing content
- **PROHIBITED**: Simplified Chinese (简体中文) - NEVER USE
- **Target Market**: Southeast Asia, Taiwan, Hong Kong, overseas Chinese communities (NOT mainland China)
- **Implementation**:
  - Add `translate="no"` to HTML elements containing technical terms
  - Use `<meta name="google" content="notranslate" />` in layout
  - Font classes: `font-mono` for technical terms, `font-headline` for titles

### 2. Technology Stack

**Frontend**:
- Next.js 15.5.6 with App Router
- React 19 (Server Components first, 'use client' only when necessary)
- TailwindCSS 3.4+ with custom Cyberpunk theme
- shadcn/ui components
- TypeScript strict mode

**Backend**:
- Supabase (Auth + PostgreSQL + RLS)
- Gemini 2.5 Flash via Genkit
- Rate limiting and caching strategies

**Deployment**:
- VPS: DigitalOcean (134.209.142.24 Reserved IP)
- 外挂盘: /mnt/external-ssd (20GB SSD)
- Docker + docker-compose
- Datadog monitoring (GitHub Student Pack Pro)
- PM2 process manager
- Nginx + SSL (Certbot)

**Fonts**:
- `VT323` (Monospace) - Technical elements
- `Orbitron` (Headline) - Titles
- `Noto Sans TC` (Body) - Content

### 3. Design System

**Theme**: Cyberpunk Minimalism
- **Primary Color**: `hsl(180 100% 50%)` (Cyan) - Digital, tech
- **Accent Color**: `hsl(280 100% 70%)` (Purple/Pink) - Mystery, depth
- **Background**: `hsl(240 10% 3.9%)` (Dark)
- **Visual Style**: Glassmorphism + Neon accents
- **Mobile-First**: Responsive 320px → 1920px
- **Dark Mode**: Default (no light mode)

**UI Patterns**:
- Header + Footer on ALL pages (including auth pages)
- Language switcher in Header (EN/繁中)
- Sidebar navigation (already implemented)
- Card-based layouts
- Toast notifications for feedback
- Loading states with cyberpunk styling
- Empty states with helpful messages
- Error boundaries for resilience

### 4. Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (authenticated)/    # Protected routes
│   ├── login/              # Auth pages
│   ├── layout.tsx          # Global layout
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # shadcn components
│   └── common/             # Custom components
├── lib/
│   ├── supabase/           # Supabase client + hooks
│   └── i18n/               # Internationalization
└── ai/                     # Genkit AI flows
```

### 5. Code Standards

**TypeScript**:
- Strict mode enabled
- Functional components with hooks
- Async/await over promises
- Proper type definitions
- No `any` types

**React Patterns**:
- Server Components by default
- Use 'use client' only when:
  - Using useState, useEffect, browser APIs
  - Event handlers needed
  - Third-party libraries require client
- Error boundaries for async operations
- Suspense for loading states
- Optimistic UI updates

**Naming Conventions**:
- Components: PascalCase
- Files: kebab-case
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- CSS classes: TailwindCSS utilities

**Comments**:
- All comments in English
- Document complex logic
- Explain "why" not "what"
- Use JSDoc for functions

### 6. Authentication & Security

**Supabase Auth**:
- Invite-code-only registration
- Three user tiers:
  - **Guest**: Homepage only
  - **Free Member**: Full articles + BBS (invite required)
  - **PRO Member**: All features + AI tools + Telegram ($5/month)

**Invite System**:
- New user gets 2 codes automatically
- PRO member gets extra code
- Initial codes: WELCOME2024, NOMAD2024, COMPASS2024, TEST2024

**Security**:
- Row Level Security (RLS) on all tables
- Never expose API keys in client code
- Validate all user inputs
- Sanitize user-generated content
- HTTPS only in production

### 7. Performance

- Image optimization with Next.js Image component
- Lazy load below-fold content
- Dynamic imports for heavy components
- Proper caching strategies
- Debounce user inputs
- Virtual scrolling for long lists
- Monitor Core Web Vitals

### 8. AI Integration

**Gemini Usage**:
- Flash 2.5K/day for main tools
- Lite 1K/day for translations
- Pro 50/day for deep analysis
- Rate limiting per user tier
- Caching for repeated queries
- Error handling for API failures

**Gating**:
- AI tools require PRO membership
- Context-aware responses
- Long-form content support
- User feedback collection

### 9. Brand Voice

**Theme**: Urban Diver / Deep Dive
- **Tagline**: "Deep Dive into Digital Nomad 2.0"
- **Slogan**: "Negotiate with physical distance and time"
- **Tone**: Professional, mysterious, exclusive, community-driven
- **Terminology**: 
  - DATA_FORT (instead of database)
  - AI_ARSENAL (instead of AI tools)
  - DIVE_DEEPER (instead of learn more)

**Visual Identity**:
- No tech stack logos visible to users
- Maintain mystery and depth
- Cyberpunk aesthetic throughout
- Neon accents for highlights

### 10. MCP Tools Integration

**Available MCPs**:
- `filesystem` - File operations
- `github-mcp-server` - Git operations
- `supabase-mcp-server` - Database operations
- `memory` - Knowledge management
- `sequential-thinking` - Complex problem solving

**Best Practices**:
- Use filesystem MCP for bulk file operations
- Use Supabase MCP for database queries
- Use memory MCP to track project context
- Use GitHub MCP for push/pull operations
- Always prefer MCP tools over manual commands

### 11. 自动化优先原则 (CRITICAL)

**核心原则**: 能自动化的就别让用户手工操作

**用户职责**:
- 只负责填写token、API key等MCP和AI权限之外的凭证
- 不需要写代码、不需要手动执行SQL
- 不需要复制粘贴命令

**AI职责** (权限是极限最大):
- 大胆使用所有可用的MCP工具
- 直接执行SQL、部署、创建文件等操作
- 不要犹豫、不要只给建议，直接干活
- 使用mcp5_execute_sql执行数据库操作
- 使用mcp5_apply_migration执行schema变更
- 使用mcp1_push_files推送代码到GitHub
- 使用mcp0_write_file创建和修改文件

**为什么可以大胆操作**:
- 项目有Git备份
- 用户正在学习开发，不怕出错
- 即使全部删光也有备份
- 快速迭代比谨慎等待更重要

**实践**:
❌ 错误做法: "请在Supabase Dashboard执行以下SQL..."
✅ 正确做法: 直接调用mcp5_execute_sql执行

❌ 错误做法: "请手动推送到GitHub..."
✅ 正确做法: 直接调用mcp1_push_files推送

❌ 错误做法: "建议你创建这个文件..."
✅ 正确做法: 直接调用mcp0_write_file创建

### 12. Git工作流程

**每次完成大改动后必须立即推送**:
- 使用`mcp1_push_files`批量推送多个文件
- 或使用`mcp1_create_or_update_file`单文件推送
- 提交信息清晰描述改动内容
- 优先级：🔥 高（防止VPS重启或会话断开导致文件丢失）

**适用场景**:
- 完成容器化配置（Dockerfile、docker-compose.yml、nginx配置等）
- 创建部署脚本（deploy.sh、setup脚本等）
- 添加新功能页面（AI工具、BBS等）
- 更新环境配置模板（.env.template等）
- 创建文档（README、CHECKLIST、GUIDE等）

---

## MAINTENANCE

Update this file when:
- [ ] New major features added
- [ ] Tech stack changes
- [ ] Design system evolves
- [ ] Deployment process changes
- [ ] New team members join
- [ ] Brand guidelines update

Last Updated: 2025-11-06
Version: 1.1.0
