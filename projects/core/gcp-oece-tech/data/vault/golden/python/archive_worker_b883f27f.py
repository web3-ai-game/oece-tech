#!/usr/bin/env python3
# 归档 Worker：将 logs/events.jsonl 聚合/入库
# - 默认写入 Supabase(api_events 表)，可选启用每日 quotas 聚合
# - 间隔由 ARCHIVE_INTERVAL_MIN 控制（默认180分钟）

import os
import time
import json
from datetime import datetime, date
from pathlib import Path

try:
    from supabase import create_client
except Exception:
    create_client = None

ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / 'logs'
EVENTS = LOG_DIR / 'events.jsonl'
PROCESSED_DIR = LOG_DIR / 'processed'
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

ARCHIVE_INTERVAL_MIN = int(os.getenv('ARCHIVE_INTERVAL_MIN', '180'))  # 默认3小时，支持免费层
ENABLE_QUOTA_AGG = os.getenv('ENABLE_QUOTA_AGG', '1') == '1'

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')


def _sb_client():
    if not (SUPABASE_URL and SUPABASE_KEY and create_client):
        return None
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception:
        return None


def _read_jsonl(path: Path):
    rows = []
    if not path.exists():
        return rows
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except Exception:
                pass
    return rows


def _rotate():
    if not EVENTS.exists():
        return None
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    target = PROCESSED_DIR / f'events_{ts}.jsonl'
    try:
        EVENTS.replace(target)
        return target
    except Exception:
        return None


def _insert_api_events(sb, rows):
    if not sb or not rows:
        return 0
    # 规范字段
    sanitized = []
    for r in rows:
        sanitized.append({
            'ts': r.get('ts'),
            'user_id': r.get('user_id'),
            'model': r.get('model'),
            'key_short': r.get('key_short'),
            'tokens': r.get('tokens') or 0,
            'latency_ms': r.get('latency_ms') or 0,
            'ok': bool(r.get('ok')),
            'error': r.get('error'),
        })
    # 分批写入
    CHUNK = 500
    total = 0
    for i in range(0, len(sanitized), CHUNK):
        batch = sanitized[i:i+CHUNK]
        try:
            sb.table('api_events').insert(batch).execute()
            total += len(batch)
        except Exception as e:
            print('插入失败: ', e)
            break
    return total


def _upsert_quotas(sb, rows):
    if not sb or not rows or not ENABLE_QUOTA_AGG:
        return 0
    # 按日期×模型×key_short 聚合
    agg = {}
    for r in rows:
        if not r.get('ts'):
            continue
        d = r['ts'][:10]
        k = (d, r.get('model'), r.get('key_short'))
        if k not in agg:
            agg[k] = {'rpm_used': 0, 'rpd_used': 0}
        agg[k]['rpd_used'] += 1
    # upsert 简化：删除重写（按同一批）
    count = 0
    for (d, model, key_short), met in agg.items():
        try:
            sb.table('quotas').insert({
                'date': d,
                'model': model,
                'key_short': key_short,
                'rpm_used': met['rpm_used'],
                'rpd_used': met['rpd_used'],
            }).execute()
            count += 1
        except Exception:
            # 若表存在唯一键(date, model, key_short)，可改为 upsert
            pass
    return count


def once():
    rotated = _rotate()
    if not rotated:
        return 0, 0
    rows = _read_jsonl(rotated)
    sb = _sb_client()
    inserted = _insert_api_events(sb, rows)
    quotas = _upsert_quotas(sb, rows)
    print(f'归档: events={inserted}, quotas={quotas}, from={rotated.name}')
    return inserted, quotas


def main():
    print('归档 Worker 启动...')
    while True:
        try:
            once()
            time.sleep(ARCHIVE_INTERVAL_MIN * 60)
        except KeyboardInterrupt:
            print('停止')
            break
        except Exception as e:
            print('错误: ', e)
            time.sleep(30)


if __name__ == '__main__':
    main()
