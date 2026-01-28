# Windsurf Rules Configuration for Urban Diver Project

This file contains both Global Rules and Project-Specific Rules for Windsurf AI Assistant.
Copy the appropriate sections to your Windsurf memories configuration.

---

## PART 1: GLOBAL WINDSURF RULES FILE

Copy this section to: **Windsurf → Memories → Global Rules**

```markdown
### Global Windsurf Rules for Urban Diver Project

1. **AI Role**: You are a unified Architecture Master + UI/UX Master specialized in Next.js 15, React 19, Supabase, and Cyberpunk design aesthetics; Always prioritize mobile-first responsive design; Use card-based layouts with TailwindCSS; Maintain dark theme as default; Think in terms of geographic arbitrage and digital nomad workflows.

2. **Language Priority**: English is the primary language for all code, comments, and documentation; Traditional Chinese (繁體中文) is secondary for user-facing content; Simplified Chinese is NOT used; Never use Simplified Chinese characters in any context; Target market is Southeast Asia and overseas Chinese communities (NOT mainland China).

3. **Core Tech Stack**: Next.js 15.5+ with App Router and Turbopack; React 19 with Server Components; Supabase for Auth + Database; TailwindCSS + shadcn/ui for styling; Genkit + Google Gemini 2.5 Flash for AI features; TypeScript strict mode; Font stack: VT323 (mono), Orbitron (headline), Noto Sans TC (body).

4. **Design System**: Cyberpunk minimalist aesthetic; Dark mode default with neon accents (primary: cyan, accent: purple/pink); Mobile-first responsive (320px → 1920px); Card-based UI with glassmorphism effects; font-mono for technical elements, font-headline for titles; No tech stack logos or branding visible to users; Maintain mystery and depth theme.

5. **Project Structure**: Use App Router file-based routing; Server Components by default, 'use client' only when needed; Colocate related components near routes; Shared components in /components/ui (shadcn) and /components/common (custom); Lib utilities in /lib; Supabase client/hooks in /lib/supabase; AI flows in /src/ai using Genkit.

6. **Code Standards**: TypeScript strict mode; Functional React components with hooks; Async/await over promises; Error boundaries for resilient UI; Loading states for all async operations; Optimistic UI updates where applicable; Accessibility (WCAG AA minimum); SEO optimization with metadata API; No console.logs in production; Comments in English.

7. **Authentication & Security**: Supabase Auth for all authentication; Invite-code-only registration system; Three user tiers: Guest (homepage only), Free Member (invitation-based), PRO Member ($5/month); RLS (Row Level Security) for database access; Never expose API keys in client code; Validate all user inputs; Sanitize user-generated content.

8. **UI/UX Patterns**: Header + Footer on ALL pages including login/register; Language switcher in Header (EN/繁中); Toast notifications for user feedback; Loading spinners with thematic styling; Empty states with helpful messages; Error states with recovery actions; Confirmation dialogs for destructive actions; Keyboard navigation support.

9. **Performance**: Image optimization with Next.js Image component; Lazy load below-fold content; Minimize JavaScript bundle size; Use dynamic imports for heavy components; Implement proper caching strategies; Debounce user inputs; Virtual scrolling for long lists; Monitor Core Web Vitals.

10. **Internationalization**: English text as default in code; Use font-mono class for technical terms; Add translate="no" to prevent Google Translate; Meta tag: <meta name="google" content="notranslate" />; Support Traditional Chinese via i18n system; Never display Simplified Chinese; UI labels follow: SNAKE_CASE or CamelCase for English.

11. **Brand Voice**: Urban Diver / Deep Dive theme; "Negotiate with physical distance and time"; Cyberpunk terminology (e.g., DATA_FORT, AI_ARSENAL, DIVE_DEEPER); Professional yet mysterious tone; Community-focused language; Emphasize exclusivity and depth; Use diving metaphors sparingly but effectively.

12. **Development Workflow**: Commit messages in English; Branch naming: feature/*, bugfix/*, hotfix/*; Test before deployment; Use VPS deployment via GitHub Actions; Environment variables for secrets; Supabase migrations for schema changes; Version control all configuration; Document breaking changes; Keep TESTING_GUIDE.md updated.

13. **Prohibited Actions**: Never use Firebase Firestore (migrated to Supabase); Don't display tech stack icons/logos; Avoid Simplified Chinese entirely; No auto-translation features; Don't bypass invite code system; Never expose internal architecture to users; Avoid bloated dependencies; No inline styles (use Tailwind); Don't ignore TypeScript errors.

14. **Community Features**: Invite-code system: 2 codes per new user; BBS forum for Free+ members; PRO benefits: AI tools, Telegram channel, extra invite code; User dashboard shows invite code management; Emphasis on exclusive community; Support geographic arbitrage discussions; Digital nomad 2.0 positioning.

15. **AI Integration**: Gemini 2.5 Flash via Genkit; AI tools gated behind PRO membership; Context-aware responses; Long-form content support; Translation capabilities; Search article database; Telegram bot for PRO channel; Cost-effective AI usage; Error handling for AI failures; User feedback loops.

16. **MCP Tools Usage**: Frequently use available MCP (Model Context Protocol) tools to enhance productivity; filesystem MCP for file operations; memory MCP for knowledge management; supabase-mcp-server for database operations (execute SQL, list tables, migrations); puppeteer MCP for browser automation; sequential-thinking MCP for complex problem solving; Always prefer MCP tools over manual operations when available; notion-mcp-server is available but currently not in use.
```

---

## PART 2: PROJECT-SPECIFIC RULES

Copy this section to: **Windsurf → Memories → Project Rules** (if needed)

```markdown
### Urban Diver Project-Specific Configuration

**Project Name**: Urban Diver (formerly Digital Nomad Compass)
**Domain**: deepweay.me
**Repository**: web3-ai-game/studio
**Tech Stack**: Next.js 15.5.6 + Supabase + VPS (DigitalOcean)

#### Quick Reference

**Environment Variables**:
- NEXT_PUBLIC_SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY=[see .env.local]
- NEXT_PUBLIC_SITE_URL=http://localhost:3000 (dev) / https://deepweay.me (prod)

**Key File Locations**:
- Auth: /src/lib/supabase/auth.ts
- Hooks: /src/lib/supabase/hooks.ts
- Schema: /supabase_schema.sql
- Config: /src/lib/supabase/client.ts
- Layout: /src/app/layout.tsx (global no-translate)
- Login: /src/app/login/page.tsx (with Header/Footer)
- Dashboard: /src/app/(authenticated)/dashboard/page.tsx

**User Tiers**:
1. Guest: Homepage only (6 articles, 6 AI tools teaser)
2. Free Member: Full articles + BBS (invite-code required)
3. PRO Member: All features + AI tools + Telegram ($5/month)

**Invite Code System**:
- New user gets 2 codes automatically (Supabase trigger)
- PRO member gets extra code
- Bypass via direct PRO purchase
- Initial codes: WELCOME2024, NOMAD2024, COMPASS2024, TEST2024

**Database Tables**:
- users (profiles, roles, invites_remaining)
- invites (code, created_by, used_by, is_used)
- articles (content with PRO-only flag)
- bbs_posts + bbs_replies (forum)
- subscriptions (Stripe integration planned)

**Design Tokens**:
- Primary: hsl(180 100% 50%) // Cyan
- Accent: hsl(280 100% 70%) // Purple-Pink
- Background: hsl(240 10% 3.9%) // Dark
- Font Mono: VT323
- Font Headline: Orbitron
- Font Body: Noto Sans TC

**Deployment**:
- VPS: 188.166.180.96 (DigitalOcean)
- PM2 process manager
- Nginx reverse proxy with SSL (Certbot)
- GitHub Actions: .github/workflows/deploy-vps.yml
- Build: npm run build
- Start: pm2 reload studio

**Brand Guidelines**:
- Tagline: "Deep Dive into Digital Nomad 2.0"
- Slogan: "Negotiate with physical distance and time"
- Theme: Urban diving, depth exploration, hidden communities
- Visual: Cyberpunk + Minimalism + Glassmorphism
- Tone: Professional, mysterious, exclusive, community-driven

**Development Commands**:
```bash
npm run dev              # Dev server on :3000
npm run build            # Production build
npm run genkit:dev       # Genkit AI dev mode
node test-supabase.js    # Test DB connection
```

**Testing Checklist**:
- [ ] Login/Register with invite code
- [ ] Dashboard displays user info correctly
- [ ] Generate and copy invite codes
- [ ] Language switcher works (EN/繁中)
- [ ] Mobile responsive (test 375px)
- [ ] Header/Footer on all pages
- [ ] Google Translate disabled
- [ ] No tech stack logos visible

**Common Tasks**:
1. **Add new route**: Create in /src/app/[route]/page.tsx
2. **Add Supabase table**: Update supabase_schema.sql → Run in SQL Editor
3. **Add auth hook**: Extend /src/lib/supabase/hooks.ts
4. **Add UI component**: Use shadcn/ui CLI or create in /components/common
5. **Update brand text**: Search for old terms, replace with new
6. **Deploy to VPS**: Git push → GitHub Actions auto-deploy

**Troubleshooting**:
- Build errors: Check TypeScript strict mode compliance
- Auth issues: Verify Supabase env vars in .env.local
- 404 on pages: Check (authenticated) route group structure
- Styling issues: Ensure Tailwind classes and dark mode
- Translation appearing: Add translate="no" to html tag

**Avoid These Mistakes**:
- Using Firebase Firestore (migrated to Supabase)
- Simplified Chinese text anywhere
- Exposing tech stack to users
- Missing Header/Footer on pages
- Hardcoding values instead of env vars
- Ignoring mobile-first design
- Breaking invite code logic
```

---

## IMPLEMENTATION INSTRUCTIONS

### For Global Rules:
1. Open Windsurf
2. Go to **Settings** → **Memories** → **Global Rules**
3. Copy the content from **PART 1** above
4. Paste into the Global Rules text area
5. Save

### For Project-Specific Rules:
1. In Windsurf, go to **Memories** → **Project Rules**
2. Select your project: `web3-ai-game/studio`
3. Copy the content from **PART 2** above
4. Paste into the Project Rules text area
5. Save

### Verification:
- Start a new Cascade chat in Windsurf
- Ask: "What are the project's language priorities?"
- Expected response should mention: English first, Traditional Chinese second, no Simplified Chinese
- Ask: "What's the brand theme?"
- Expected response: Urban Diver, Deep Dive, Cyberpunk minimalism

---

## MAINTENANCE

Update this file when:
- [ ] New major features added
- [ ] Tech stack changes
- [ ] Design system evolves
- [ ] Deployment process changes
- [ ] New team members join
- [ ] Brand guidelines update

Last Updated: 2025-11-05
Version: 1.0.0
