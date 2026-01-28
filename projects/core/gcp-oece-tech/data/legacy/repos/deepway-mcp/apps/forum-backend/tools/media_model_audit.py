#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图像与多模态模型 可用性体检（按Key逐一探测）
- 覆盖截图中“生成模型/多模态/Live/TTS”等模型
- 对每个模型和每个Key:
  1) GET /models/{model} 元数据探测（存在性）
  2) 依次尝试以下端点（容错，主要为了判断“可达/受限/需专用端点”）：
     - :generateContent (简单文本prompt)
     - :generateImages 和 :generateImage （图像生成猜测端点）
     - :generateSpeech 和 :generateAudio （TTS猜测端点）
  - 将HTTP状态与错误短语纳入结果（200/400/403/404/429 等），据此判“可用/存在但需专用端点/不可用/限速”。
- 输出：.reports/media_audit_<timestamp>.json / .md
"""

import os
import re
import json
import time
import urllib.request
import urllib.error
from datetime import datetime

ROOT = "/mnt/volume_sgp1_01/svs_bot"
ENV_BAK = os.path.join(ROOT, ".env.bak")
REPORT_DIR = os.path.join(ROOT, ".reports")
API_BASE = "https://generativelanguage.googleapis.com/v1"

# 目标模型（覆盖截图中出现的类别，存在与否以Probe为准）
TARGET_MODELS = [
    # 生成/多模态
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.5-flash-preview-image",
    "gemini-2.5-flash-tts",
    "gemini-2.5-pro-tts",
    "imagen-3.0-generate",
    "imagen-4.0-fast-generate",
    "imagen-4.0-generate",
    "imagen-4.0-ultra-generate",
    "veo-2.0-generate-001",
    "veo-3.0-fast-generate",
    "veo-3.0-generate",
    # Live
    "gemini-2.0-flash-live",
    "gemini-2.5-flash-live",
    "gemini-2.5-flash-native-audio-dialog",
]

# 备选端点与示例payload（尽力匹配，允许400）
ENDPOINTS = [
    ("generateContent", {"contents": [{"parts": [{"text": "Ping"}]}]}),
    ("generateImages", {"prompt": {"text": "A cute cat, photorealistic"}}),
    ("generateImage", {"prompt": "A cute cat, photorealistic"}),
    ("generateSpeech", {"input": {"text": "Hello from audit"}, "audioConfig": {"audioEncoding": "MP3"}}),
    ("generateAudio", {"text": "Hello from audit"}),
]

HEADERS = {"Content-Type": "application/json"}


def load_keys_from_env(env_path: str):
    if not os.path.exists(env_path):
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
    # 去重
    seen, ordered = set(), []
    for k in keys:
        if k not in seen:
            seen.add(k)
            ordered.append(k)
    return ordered


def http_get(url: str, timeout=10):
    try:
        with urllib.request.urlopen(urllib.request.Request(url), timeout=timeout) as r:
            return 200, r.read().decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8", errors="ignore")
        except Exception:
            body = ""
        return e.code, body
    except Exception as e:
        return -1, str(e)


def http_post(url: str, payload: dict, timeout=15):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS)
    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read().decode("utf-8", errors="ignore")
            latency = time.time() - start
            return 200, body, latency
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8", errors="ignore")
        except Exception:
            body = ""
        latency = time.time() - start
        return e.code, body, latency
    except Exception as e:
        latency = time.time() - start
        return -1, str(e), latency


def probe_model_for_key(key: str, model: str):
    result = {
        "metadata": None,
        "endpoints": [],
    }

    # 1) 元数据
    meta_url = f"{API_BASE}/models/{model}?key={key}"
    code, body = http_get(meta_url)
    result["metadata"] = {"code": code, "snippet": (body or "")[:160]}

    # 2) 各端点尝试
    for ep, payload in ENDPOINTS:
        url = f"{API_BASE}/models/{model}:{ep}?key={key}"
        code, body, latency = http_post(url, payload)
        snippet = (body or "")[:160]
        result["endpoints"].append({
            "endpoint": ep,
            "code": code,
            "latency": round(latency, 3),
            "snippet": snippet,
        })
        # 降速
        time.sleep(0.2)

    return result


def summarize(results):
    summary = {"generated_at": datetime.utcnow().isoformat() + "Z", "models": {}}
    for model, per_key in results.items():
        total = len(per_key)
        meta_200 = 0
        any_200 = 0
        any_403 = 0
        any_404 = 0
        any_429 = 0
        for r in per_key.values():
            # metadata
            try:
                if int(r.get("metadata", {}).get("code", 0)) == 200:
                    meta_200 += 1
            except Exception:
                pass
            # endpoints list of dicts
            codes = []
            for ep in r.get("endpoints", []):
                try:
                    codes.append(int(ep.get("code", 0)))
                except Exception:
                    continue
            if any(c == 200 for c in codes):
                any_200 += 1
            if any(c == 403 for c in codes):
                any_403 += 1
            if any(c == 404 for c in codes):
                any_404 += 1
            if any(c == 429 for c in codes):
                any_429 += 1
        summary["models"][model] = {
            "keys": total,
            "metadata_200": meta_200,
            "any_200": any_200,
            "any_403": any_403,
            "any_404": any_404,
            "any_429": any_429,
        }
    return summary


def to_markdown(summary: dict) -> str:
    lines = []
    lines.append("# 图像/多模态模型体检摘要\n")
    lines.append(f"生成时间: {summary['generated_at']}\n")
    lines.append("## 模型汇总\n")
    for model, s in summary["models"].items():
        lines.append(f"- **{model}**: 元数据200={s['metadata_200']}/{s['keys']} | 任一端点200={s['any_200']} | 403={s['any_403']} | 404={s['any_404']} | 429={s['any_429']}")
    return "\n".join(lines) + "\n"


def main():
    os.makedirs(REPORT_DIR, exist_ok=True)
    keys = load_keys_from_env(ENV_BAK)
    if not keys:
        print("❌ 未发现任何Key (.env.bak)")
        return

    print(f"🔍 图像/多模态体检：{len(keys)} keys × {len(TARGET_MODELS)} models")
    results = {m: {} for m in TARGET_MODELS}

    # 限速控制：每模型×每Key 尝试多端点，注意节流
    for mi, model in enumerate(TARGET_MODELS, 1):
        print(f"\n== 模型 {mi}/{len(TARGET_MODELS)}: {model}")
        for ki, key in enumerate(keys, 1):
            print(f"  - Key {ki}/{len(keys)} {key[:20]}...")
            r = probe_model_for_key(key, model)
            results[model][f"key_{ki}"] = {
                "key_short": key[:15] + "...",
                "metadata": r["metadata"],
                "endpoints": r["endpoints"],
            }
            # 每5个Key稍作等待
            if ki % 5 == 0:
                time.sleep(2.0)
        # 模型之间冷却
        time.sleep(1.0)

    summary = summarize(results)
    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    json_path = os.path.join(REPORT_DIR, f"media_audit_{ts}.json")
    md_path = os.path.join(REPORT_DIR, f"media_audit_{ts}.md")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"summary": summary, "results": results}, f, indent=2, ensure_ascii=False)
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(to_markdown(summary))

    print("\n✅ 完成：")
    print("  ", json_path)
    print("  ", md_path)


if __name__ == "__main__":
    main()
