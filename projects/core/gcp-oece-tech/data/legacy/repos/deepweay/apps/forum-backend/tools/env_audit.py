#!/usr/bin/env python3
# 环境变量与服务审计脚本
# - 扫描项目内 .env / *.env.* / *.sh / *.json 以发现 API Token 与服务可用性
# - 输出 docs/ENV_SERVICES_AUDIT.md

import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / 'docs'
OUT = DOCS_DIR / 'ENV_SERVICES_AUDIT.md'

ENV_FILES = [
    ROOT / '.env',
    ROOT / '.env.template',
    ROOT / '.env.production.example',
    ROOT / '.env.gemini_keys',
]

SHELL_GLOBS = [
    '*.sh',
]

# 关键服务与变量特征
SERVICES = {
    'telegram': [r'TELEGRAM_BOT_TOKEN', r'TELEGRAM_.*_TOKEN'],
    'gemini': [r'GEMINI_API_KEY', r'GEMINI_KEYS', r'GEMINI_.*_KEY'],
    'redis': [r'REDIS_URL', r'REDIS_HOST', r'REDIS_PASSWORD'],
    'supabase': [r'SUPABASE_URL', r'SUPABASE_ANON_KEY', r'SUPABASE_SERVICE_KEY'],
    'postgres': [r'POSTGRES_URL', r'DATABASE_URL'],
    'datadog': [r'DATADOG_API_KEY', r'DD_API_KEY', r'DD_SITE', r'DD_ENV'],
    'github': [r'GITHUB_TOKEN', r'GH_TOKEN'],
    'honeybadger': [r'HONEYBADGER_API_KEY'],
    'poeditor': [r'POEDITOR_API_TOKEN'],
    'notion': [r'NOTION[_A-Z]*API[_A-Z]*KEY', r'NOTION_TOKEN'],
    'openrouter': [r'OPENROUTER_API_KEY'],
    'digitalocean': [r'DO_TOKEN', r'DIGITALOCEAN_ACCESS_TOKEN'],
    'blockchair': [r'BLOCKCHAIR_API_KEY'],
}

ENV_LINE = re.compile(r'^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)\s*$')
EXPORT_LINE = re.compile(r'^\s*export\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)\s*$')


def gather_kv_from_file(path: Path):
    kv = {}
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                m = ENV_LINE.match(line)
                if not m:
                    m = EXPORT_LINE.match(line)
                if m:
                    k, v = m.group(1), m.group(2)
                    v = v.strip().strip('"\'')
                    kv[k] = v
    except Exception:
        pass
    return kv


def list_shell_kv(root: Path):
    kv = {}
    for pat in SHELL_GLOBS:
        for p in root.glob(pat):
            kv.update(gather_kv_from_file(p))
    return kv


def detect_services(envmap):
    found = {}
    for svc, patterns in SERVICES.items():
        matches = []
        for k in envmap.keys():
            for pat in patterns:
                if re.fullmatch(pat, k):
                    matches.append(k)
        if matches:
            found[svc] = sorted(set(matches))
    return found


def main():
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    envmap = {}
    sources = []

    for f in ENV_FILES:
        if f.exists():
            envmap.update(gather_kv_from_file(f))
            sources.append(str(f.relative_to(ROOT)))

    # shell scripts
    envmap.update(list_shell_kv(ROOT))

    # process environment (runtime)
    for k, v in os.environ.items():
        if k not in envmap:
            envmap[k] = v

    services = detect_services(envmap)

    lines = []
    lines.append('# 环境变量与服务审计\n')
    lines.append('本文件由 tools/env_audit.py 自动生成。\n')
    lines.append('')
    lines.append('## 数据来源')
    lines.append('- ' + '\n- '.join(sources) if sources else '- 无（仅进程环境与脚本扫描）')
    lines.append('')
    lines.append('## 服务发现')
    if not services:
        lines.append('- 未发现关键服务变量')
    else:
        for svc, keys in sorted(services.items()):
            lines.append(f'- **{svc}**')
            for k in keys:
                redacted = '***' if not envmap.get(k) else (envmap[k][:4] + '...' if len(envmap[k]) > 8 else '***')
                lines.append(f'  - {k}: {redacted}')
    lines.append('')

    # Doppler 就绪度建议
    lines.append('## Doppler 就绪度建议')
    lines.append('- 为每个服务创建 Doppler 项目或配置分组（dev/prod）')
    lines.append('- 建议分组：gemini, bot, forum, worker, observability, integrations')
    lines.append('- 最小变量集：')
    lines.append('  - GEMINI_KEYS（逗号分隔或 JSON）')
    lines.append('  - TELEGRAM_BOT_TOKEN, REDIS_URL')
    lines.append('  - SUPABASE_URL, SUPABASE_ANON_KEY（或 POSTGRES_URL）')
    lines.append('  - DATADOG_API_KEY（可选）, GITHUB_TOKEN（可选）')

    OUT.write_text('\n'.join(lines), encoding='utf-8')
    print(f'生成: {OUT}')


if __name__ == '__main__':
    main()
