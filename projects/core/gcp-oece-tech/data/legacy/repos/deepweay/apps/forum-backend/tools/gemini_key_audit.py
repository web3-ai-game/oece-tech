#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gemini 全Key×多模型 体检脚本
- 逐个Key测试指定模型可用性与延迟
- 可选短突发以粗测RPM阈值（避免过载，默认5次/Key/模型）
- 结果写入：
  * JSON: .reports/gemini_audit_<timestamp>.json
  * Markdown: .reports/gemini_audit_<timestamp>.md
  * Redis（可选）: audit:{date}:<keyprefix>:<model>

用法示例：
  python3 tools/gemini_key_audit.py \
    --models gemini-2.0-flash-lite gemini-2.0-flash gemini-2.5-flash-lite gemini-2.5-flash gemini-2.5-pro \
    --burst 5 --delay 0.15
"""

import os
import re
import sys
import json
import time
import math
import argparse
import urllib.request
import urllib.error
from datetime import datetime

try:
    import redis  # 可选
except Exception:
    redis = None

ROOT = "/mnt/volume_sgp1_01/svs_bot"
ENV_BAK = os.path.join(ROOT, ".env.bak")
REPORT_DIR = os.path.join(ROOT, ".reports")

DEFAULT_MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
]

HEADERS = {"Content-Type": "application/json"}
API_FMT = "https://generativelanguage.googleapis.com/v1/models/{model}:generateContent?key={key}"


def load_keys_from_env(env_path: str):
    """从 .env.bak 读取所有 GEMINI_GROUP_* Key"""
    if not os.path.exists(env_path):
        print(f"❌ 未找到 {env_path}")
        return []
    keys = []
    pat = re.compile(r"^\s*(GEMINI_GROUP_[A-D]_KEY_\d+)\s*=\s*\"?([^\"\n]+)\"?\s*$")
    with open(env_path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            m = pat.match(line)
            if m:
                value = m.group(2).strip()
                if value and len(value) > 20:
                    keys.append(value)
    # 去重保持顺序
    seen = set()
    ordered = []
    for k in keys:
        if k not in seen:
            seen.add(k)
            ordered.append(k)
    return ordered


def call_model(key: str, model: str, text: str = "Hi", timeout_s: float = 12.0):
    """对指定模型做一次简单调用，返回 (ok, latency, code, tokens, err)"""
    url = API_FMT.format(model=model, key=key)
    payload = {"contents": [{"parts": [{"text": text}]}]}
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS)

    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            raw = resp.read().decode("utf-8", errors="ignore")
            latency = time.time() - start
            try:
                obj = json.loads(raw)
            except Exception:
                obj = {}
            tokens = 0
            if isinstance(obj, dict):
                usage = obj.get("usageMetadata") or {}
                tokens = usage.get("totalTokenCount", 0)
                ok = bool(obj.get("candidates"))
            else:
                ok = False
            return ok, latency, 200, tokens, None
    except urllib.error.HTTPError as e:
        latency = time.time() - start
        detail = None
        try:
            detail = e.read().decode("utf-8", errors="ignore")
        except Exception:
            detail = None
        return False, latency, e.code, 0, detail
    except Exception as e:
        latency = time.time() - start
        return False, latency, -1, 0, str(e)


def burst_probe(key: str, model: str, n: int = 5, delay: float = 0.15):
    """短突发探测：连续 n 次快速调用，返回成功次数与是否触发429"""
    success = 0
    got_429 = False
    latencies = []
    for i in range(n):
        ok, lat, code, tokens, err = call_model(key, model)
        latencies.append(lat)
        if ok:
            success += 1
        if code == 429:
            got_429 = True
        time.sleep(max(0.0, delay))
    return {
        "attempts": n,
        "success": success,
        "avg_latency": round(sum(latencies) / len(latencies), 3) if latencies else 0.0,
        "got_429": got_429,
    }


def connect_redis():
    if not redis:
        return None
    try:
        r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
        r.ping()
        return r
    except Exception:
        return None


def write_redis(r, date_prefix: str, key: str, model: str, record: dict):
    if not r:
        return
    kp = f"audit:{date_prefix}:{key[:15]}:{model}"
    try:
        r.hset(kp, mapping={k: json.dumps(v) if isinstance(v, (dict, list)) else v for k, v in record.items()})
        r.expire(kp, 86400 * 7)
    except Exception:
        pass


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def to_markdown(summary: dict) -> str:
    lines = []
    lines.append("# Gemini 全Key×多模型体检报告")
    lines.append("")
    lines.append(f"生成时间: {summary['generated_at']}")
    lines.append("")

    # 模型总体
    lines.append("## 模型可用性总览")
    for m in summary["models_stats"]:
        s = summary["models_stats"][m]
        lines.append(f"- **{m}**: 可用Keys {s['available_keys']}/{s['total_keys']} (可用率 {s['availability_rate']}) | 平均延迟 {s['avg_latency']}s | 429触发率 {s['rate_limit_rate']}")
    lines.append("")

    # Key 健康
    lines.append("## Key健康度排名 (前10)")
    ranked = sorted(summary["keys"].items(), key=lambda kv: kv[1]["health_score"], reverse=True)
    for i, (k, info) in enumerate(ranked[:10], 1):
        lines.append(f"{i}. {info['key_short']}: 健康度 {info['health_score']:.2f} (通过 {info['passed_tests']}/{info['total_tests']})")
    lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Gemini 全Key×多模型 体检脚本")
    parser.add_argument("--models", nargs="*", default=DEFAULT_MODELS, help="待测试的模型列表")
    parser.add_argument("--burst", type=int, default=5, help="每Key每模型突发请求次数(用于粗测RPM)")
    parser.add_argument("--delay", type=float, default=0.15, help="突发请求间隔秒")
    parser.add_argument("--keys", nargs="*", default=None, help="直接提供Keys(可选)，否则从.env.bak读取")
    args = parser.parse_args()

    ensure_dir(REPORT_DIR)

    keys = args.keys if args.keys else load_keys_from_env(ENV_BAK)
    if not keys:
        print("❌ 未发现任何Gemini Keys，请检查 .env.bak 或传入 --keys")
        sys.exit(1)

    test_models = args.models
    date_prefix = datetime.utcnow().strftime("%Y-%m-%d")

    r = connect_redis()
    if r:
        print("✅ Redis已连接，结果将写入Redis")
    else:
        print("⚠️ Redis未连接，跳过Redis写入")

    print(f"🔍 开始体检：{len(keys)} 个Keys × {len(test_models)} 个模型")

    results = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "keys": {},
        "models_stats": {},
    }

    # 主循环
    for idx, key in enumerate(keys, 1):
        print(f"\n【Key {idx}/{len(keys)}】{key[:20]}...")
        key_info = {
            "key_short": key[:15] + "...",
            "models": {},
            "healthy": True,
            "total_tests": 0,
            "passed_tests": 0,
        }

        for model in test_models:
            # 先单次功能测试
            ok, latency, code, tokens, err = call_model(key, model)
            record = {
                "single_ok": ok,
                "single_latency": round(latency, 3),
                "code": code,
                "tokens": tokens,
            }

            # 短突发RPM粗测
            burst = burst_probe(key, model, n=args.burst, delay=args.delay)
            record.update({
                "burst_attempts": burst["attempts"],
                "burst_success": burst["success"],
                "burst_avg_latency": burst["avg_latency"],
                "burst_got_429": burst["got_429"],
            })

            key_info["total_tests"] += 1
            if ok:
                key_info["passed_tests"] += 1
            if code in (403, 429) or burst["got_429"]:
                key_info["healthy"] = False

            key_info["models"][model] = record
            write_redis(r, date_prefix, key, model, record)

            print(
                f"  {model}: {'✅' if ok else '❌'} | 单次 {record['single_latency']}s | "
                f"突发 {record['burst_success']}/{record['burst_attempts']} | 429={record['burst_got_429']}"
            )
            time.sleep(0.2)

        key_info["health_score"] = (
            key_info["passed_tests"] / key_info["total_tests"] if key_info["total_tests"] else 0.0
        )
        results["keys"][f"key_{idx}"] = key_info

        if idx % 5 == 0:
            print("  ⏸️ 批次休息 2s 以避免限速...")
            time.sleep(2.0)

    # 模型聚合
    for model in test_models:
        available = 0
        total = len(keys)
        total_latency = 0.0
        rate429 = 0
        for key_info in results["keys"].values():
            rec = key_info["models"].get(model)
            if not rec:
                continue
            if rec.get("single_ok"):
                available += 1
                total_latency += rec.get("single_latency", 0.0)
            if rec.get("burst_got_429"):
                rate429 += 1
        avg_latency = round(total_latency / available, 3) if available else 0.0
        results["models_stats"][model] = {
            "available_keys": available,
            "total_keys": total,
            "availability_rate": f"{(available/total*100):.0f}%",
            "avg_latency": avg_latency,
            "rate_limit_rate": f"{(rate429/total*100):.0f}%",
        }

    # 写报告
    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    ensure_dir(REPORT_DIR)
    json_path = os.path.join(REPORT_DIR, f"gemini_audit_{ts}.json")
    md_path = os.path.join(REPORT_DIR, f"gemini_audit_{ts}.md")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(to_markdown(results))

    print("\n✅ 体检完成：")
    print(f"  JSON: {json_path}")
    print(f"  Markdown: {md_path}")
    if r:
        print("  Redis: 已写入（保存7天）")


if __name__ == "__main__":
    main()
