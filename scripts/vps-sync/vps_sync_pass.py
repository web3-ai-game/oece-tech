#!/usr/bin/env python3
"""
VPS vault sync tool for deepweay-me and oece-tech.

Implements pass1 full sync and supports pass2 incremental sync.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

SOURCE_ROOTS = {
    "TXT_mega_distill_2_final_output": Path("/root/TXT/mega-distill/2-final-output"),
    "TXT_txt": Path("/root/TXT/txt"),
    "TXT_distilled_output": Path("/root/TXT/distilled-output"),
    "vps_knowledge_base": Path("/root/vps-knowledge-vault/knowledge-base"),
    "vps_oece_docs": Path("/root/vps-knowledge-vault/vps-docs/oece-tech-docs/docs"),
}

TEXT_EXTENSIONS = {
    ".md",
    ".markdown",
    ".txt",
    ".json",
    ".ndjson",
    ".yml",
    ".yaml",
    ".sql",
    ".csv",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".go",
    ".py",
    ".sh",
    ".xml",
    ".html",
}

SKIP_DIR_NAMES = {
    ".git",
    "node_modules",
    ".next",
    "out",
    "build",
    "dist",
    ".cache",
}

HIGH_RISK_PATTERNS = {
    "xai_key": re.compile(r"xai-[A-Za-z0-9\-_]{12,}"),
    "google_api_key": re.compile(r"AIza[0-9A-Za-z\-_]{20,}"),
    "mongodb_srv": re.compile(r"mongodb\+srv://[^\s'\"`)]+"),
    "private_key": re.compile(
        r"-----BEGIN " r"PRIVATE KEY-----[\s\S]*?-----END " r"PRIVATE KEY-----",
        re.M,
    ),
    "bot_token": re.compile(r"\b\d{8,}:[A-Za-z0-9_-]{20,}\b"),
    "jwt": re.compile(r"eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}"),
    "github_pat": re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),
    "ghp": re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
}

ASSIGN_SECRET_PATTERN = re.compile(
    r"(?i)(\b(?:token|password)\b\s*[:=]\s*[\"']?)([^\s\"',]{6,})([\"']?)"
)

NON_SECRET_ASSIGN_VALUES = {
    "string",
    "number",
    "boolean",
    "object",
    "any",
    "unknown",
    "null",
    "none",
    "true",
    "false",
}

FRONTMATTER_RE = re.compile(r"^---\n([\s\S]*?)\n---\n", re.M)

CHINESE_CHAR_RE = re.compile(r"[\u4e00-\u9fff]")


@dataclass
class SourceFile:
    source_root: str
    absolute_path: Path
    relative_path: str


@dataclass
class DocRecord:
    doc_id: str
    file_hash: str
    canonical_source_root: str
    canonical_source_path: str
    canonical_relpath: str
    extension: str
    content: str
    utf8_valid: bool
    had_frontmatter: bool
    has_frontmatter: bool
    code_fence_closed: bool
    chinese_chars: int
    project_scope: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    lang: str = "zh"
    vector_ready: bool = True
    source_paths: List[str] = field(default_factory=list)


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def run(cmd: List[str], cwd: Optional[Path] = None) -> str:
    return subprocess.check_output(cmd, cwd=str(cwd) if cwd else None, text=True)


def git_tracked_files(repo: Path) -> List[Path]:
    output = run(["git", "ls-files", "-z"], cwd=repo)
    raw = output.split("\0")
    return [repo / x for x in raw if x]


def is_probably_text(path: Path) -> bool:
    if path.suffix.lower() in TEXT_EXTENSIONS:
        return True
    try:
        data = path.read_bytes()[:4096]
    except Exception:
        return False
    if b"\x00" in data:
        return False
    try:
        data.decode("utf-8")
        return True
    except UnicodeDecodeError:
        return False


def walk_text_files(root: Path) -> Iterable[Path]:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIR_NAMES]
        base = Path(dirpath)
        for fn in filenames:
            p = base / fn
            if is_probably_text(p):
                yield p


def scan_high_risk(repo: Path) -> Dict[str, Dict[str, int]]:
    stats: Dict[str, Dict[str, int]] = {}
    for p in walk_text_files(repo):
        rel = str(p.relative_to(repo))
        try:
            text = p.read_text("utf-8", errors="ignore")
        except Exception:
            continue
        file_hits = {}
        for name, rx in HIGH_RISK_PATTERNS.items():
            c = len(rx.findall(text))
            if c:
                file_hits[name] = c
        if file_hits:
            stats[rel] = file_hits
    return stats


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def collect_source_files() -> List[SourceFile]:
    collected: List[SourceFile] = []
    for source_name, root in SOURCE_ROOTS.items():
        if not root.exists():
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIR_NAMES]
            base = Path(dirpath)
            for fn in filenames:
                p = base / fn
                if not is_probably_text(p):
                    continue
                rel = str(p.relative_to(root))
                collected.append(SourceFile(source_name, p, rel))
    return collected


def normalize_newlines_and_entities(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("&#10;", "\n").replace("&#13;", "\n")
    text = text.replace("&nbsp;", " ")
    return text


def ensure_frontmatter(text: str, source_path: str) -> Tuple[str, bool, bool]:
    has_fm = bool(FRONTMATTER_RE.match(text))
    if has_fm:
        return text, True, True

    stem = Path(source_path).stem
    title = stem.replace("_", " ").strip() or "untitled"
    slug = re.sub(r"[^a-zA-Z0-9\-]+", "-", stem.lower()).strip("-") or "untitled"
    category = str(Path(source_path).parent).replace("\\", "/") or "root"
    fm = (
        "---\n"
        f"title: {title}\n"
        f"slug: {slug}\n"
        f"category: {category}\n"
        "tags: [vps-sync]\n"
        "lang: zh\n"
        f"created: {datetime.now().strftime('%Y-%m-%d')}\n"
        "source: vps-pass1-sync\n"
        "vector_ready: true\n"
        "---\n\n"
    )
    return fm + text.lstrip("\n"), False, True


def close_unbalanced_code_fences(text: str) -> Tuple[str, bool]:
    fences = len(re.findall(r"^```", text, flags=re.M))
    if fences % 2 == 0:
        return text, True
    return text + "\n```\n", False


def infer_scope_and_tags(source_path: str, content: str) -> Tuple[List[str], List[str], str]:
    s = (source_path + "\n" + content[:2000]).lower()
    scopes = []
    tags = set()

    deepweay_keywords = ["deepweay", "ethical-hacking", "red-team", "blue-team", "companion"]
    oece_keywords = ["oece", "novel-script-engine", "tools", "engineering", "orbital"]

    if any(k in s for k in deepweay_keywords):
        scopes.append("deepweay")
        tags.update(["deepweay"])
    if any(k in s for k in oece_keywords):
        scopes.append("oece")
        tags.update(["oece"])
    if not scopes:
        scopes = ["shared"]

    if "ethical" in s or "hacking" in s:
        tags.update(["security", "ethical-hacking"])
    if "firebase" in s:
        tags.add("firebase")
    if "vector" in s:
        tags.add("vector")
    if "gemini" in s:
        tags.add("gemini")
    if "grok" in s:
        tags.add("grok")
    if "book" in s or "ebook" in s:
        tags.add("books")

    lang = "zh" if CHINESE_CHAR_RE.search(content) else "en"
    return scopes, sorted(tags), lang


def strip_frontmatter(text: str) -> str:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return text
    return text[m.end():]


def split_chunks(text: str, min_len: int = 500, max_len: int = 800, overlap: int = 100) -> List[str]:
    text = text.strip()
    if not text:
        return []
    if len(text) <= max_len:
        return [text]

    chunks: List[str] = []
    start = 0
    while start < len(text):
        end = min(start + max_len, len(text))
        if end < len(text):
            split_pos = text.rfind("\n", start + min_len, end)
            if split_pos != -1 and (split_pos - start) >= min_len:
                end = split_pos
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(text):
            break
        start = max(0, end - overlap)

    if len(chunks) > 1 and len(chunks[-1]) < min_len:
        chunks[-2] = (chunks[-2] + "\n" + chunks[-1]).strip()
        chunks.pop()

    return chunks


def relative_safe_path(path: str) -> str:
    path = path.replace("\\", "/")
    parts = [p for p in path.split("/") if p not in ("", ".", "..")]
    return "/".join(parts)


def load_previous_hashes(repo: Path, manifest_rel: Optional[str]) -> set[str]:
    if not manifest_rel:
        return set()
    p = repo / manifest_rel
    if not p.exists():
        return set()
    try:
        data = json.loads(p.read_text("utf-8"))
    except Exception:
        return set()
    return {x.get("hash") for x in data.get("documents", []) if x.get("hash")}


def sanitize_repo(repo: Path) -> Dict[str, object]:
    touched: Dict[str, Dict[str, int]] = {}

    def apply_replacements(text: str) -> Tuple[str, Dict[str, int]]:
        counts: Dict[str, int] = {}
        original = text

        for name, rx in HIGH_RISK_PATTERNS.items():
            text, c = rx.subn("***REDACTED***", text)
            if c:
                counts[name] = counts.get(name, 0) + c

        def repl_assign(m: re.Match) -> str:
            key_prefix, value, quote = m.group(1), m.group(2), m.group(3)
            low = value.lower()
            # Avoid mutating source code type annotations and runtime expressions.
            if low in NON_SECRET_ASSIGN_VALUES:
                return m.group(0)
            if "process.env" in value or value.startswith(("req.", "res.", "ctx.", "${", "env.")):
                return m.group(0)
            if "***REDACTED***" in value:
                return m.group(0)
            return f"{key_prefix}***REDACTED***{quote}"

        text, c = ASSIGN_SECRET_PATTERN.subn(repl_assign, text)
        if c:
            counts["assign_secret"] = counts.get("assign_secret", 0) + c

        changed = text != original
        return text, counts if changed else {}

    for file_path in walk_text_files(repo):
        try:
            text = file_path.read_text("utf-8", errors="ignore")
        except Exception:
            continue
        new_text, counts = apply_replacements(text)
        if counts:
            rel = str(file_path.relative_to(repo))
            file_path.write_text(new_text, encoding="utf-8")
            touched[rel] = counts

    post_scan = scan_high_risk(repo)
    return {
        "touched_files": touched,
        "post_scan_high_risk": post_scan,
    }


def create_baseline(repo: Path, manifests_dir: Path) -> None:
    tracked = git_tracked_files(repo)
    file_entries = []
    for f in tracked:
        if not f.exists():
            continue
        try:
            b = f.read_bytes()
        except Exception:
            continue
        file_entries.append(
            {
                "path": str(f.relative_to(repo)),
                "bytes": len(b),
                "sha256": sha256_bytes(b),
            }
        )

    baseline = {
        "generated_at": now_iso(),
        "repo": str(repo),
        "tracked_file_count": len(file_entries),
        "files": file_entries,
    }
    write_json(manifests_dir / "baseline-pre-sync.json", baseline)

    sensitive = {
        "generated_at": now_iso(),
        "repo": str(repo),
        "high_risk_matches": scan_high_risk(repo),
    }
    write_json(manifests_dir / "baseline-sensitive-pre-sync.json", sensitive)


def sync_repo(
    repo: Path,
    pass_label: str,
    mode: str,
    previous_manifest_rel: Optional[str] = None,
) -> Dict[str, object]:
    manifests_dir = repo / "knowledge" / "vps-vault" / "manifests"
    manifests_dir.mkdir(parents=True, exist_ok=True)

    create_baseline(repo, manifests_dir)

    previous_hashes = load_previous_hashes(repo, previous_manifest_rel) if mode == "pass2" else set()

    raw_files = collect_source_files()
    total_input = len(raw_files)
    unique: Dict[str, DocRecord] = {}
    duplicate_count = 0

    normalization_warnings = []

    for sf in raw_files:
        try:
            b = sf.absolute_path.read_bytes()
            text = b.decode("utf-8")
            utf8_valid = True
        except UnicodeDecodeError:
            text = sf.absolute_path.read_text("utf-8", errors="replace")
            utf8_valid = False
        except Exception as e:
            normalization_warnings.append(
                {"source": f"{sf.source_root}/{sf.relative_path}", "warning": f"read_error: {e}"}
            )
            continue

        text = normalize_newlines_and_entities(text)
        rel_source = f"{sf.source_root}/{relative_safe_path(sf.relative_path)}"

        had_frontmatter = False
        has_frontmatter = False
        if sf.absolute_path.suffix.lower() in {".md", ".markdown", ".txt"}:
            text, had_frontmatter, has_frontmatter = ensure_frontmatter(text, rel_source)
        else:
            has_frontmatter = False

        text, balanced = close_unbalanced_code_fences(text)

        file_hash = sha256_text(text)

        if mode == "pass2" and previous_hashes and file_hash in previous_hashes:
            continue

        if file_hash in unique:
            unique[file_hash].source_paths.append(rel_source)
            duplicate_count += 1
            continue

        doc_id = f"doc_{file_hash[:16]}"
        scopes, tags, lang = infer_scope_and_tags(rel_source, text)

        rec = DocRecord(
            doc_id=doc_id,
            file_hash=file_hash,
            canonical_source_root=sf.source_root,
            canonical_source_path=rel_source,
            canonical_relpath=relative_safe_path(sf.relative_path),
            extension=sf.absolute_path.suffix.lower() or ".txt",
            content=text,
            utf8_valid=utf8_valid,
            had_frontmatter=had_frontmatter,
            has_frontmatter=has_frontmatter,
            code_fence_closed=balanced,
            chinese_chars=len(CHINESE_CHAR_RE.findall(text)),
            project_scope=scopes,
            tags=tags,
            lang=lang,
            vector_ready=True,
            source_paths=[rel_source],
        )
        unique[file_hash] = rec

    docs = list(unique.values())

    # Reset only the current pass folders
    full_root = repo / "knowledge" / "vps-vault" / "full" / pass_label
    deep_root = repo / "knowledge" / "vps-vault" / "adapters" / "deepweay" / pass_label
    oece_root = repo / "knowledge" / "vps-vault" / "adapters" / "oece" / pass_label
    for p in (full_root, deep_root, oece_root):
        if p.exists():
            shutil.rmtree(p)
        p.mkdir(parents=True, exist_ok=True)

    files_manifest_docs = []
    source_map = {}
    firebase_docs = []
    firebase_chunks = []
    quality = []

    for rec in docs:
        relpath = Path(rec.canonical_source_root) / Path(rec.canonical_relpath)
        full_repo_rel = Path("knowledge") / "vps-vault" / "full" / pass_label / relpath
        full_abs = repo / full_repo_rel
        full_abs.parent.mkdir(parents=True, exist_ok=True)
        full_abs.write_text(rec.content, encoding="utf-8")

        adapter_rel_paths = []
        base_name = f"{rec.doc_id}__{Path(rec.canonical_relpath).name}"

        if "deepweay" in rec.project_scope:
            adapter_rel = Path("knowledge") / "vps-vault" / "adapters" / "deepweay" / pass_label / base_name
            (repo / adapter_rel).write_text(rec.content, encoding="utf-8")
            adapter_rel_paths.append(str(adapter_rel))

        if "oece" in rec.project_scope:
            adapter_rel = Path("knowledge") / "vps-vault" / "adapters" / "oece" / pass_label / base_name
            (repo / adapter_rel).write_text(rec.content, encoding="utf-8")
            adapter_rel_paths.append(str(adapter_rel))

        files_manifest_docs.append(
            {
                "doc_id": rec.doc_id,
                "hash": rec.file_hash,
                "canonical_path": str(full_repo_rel),
                "canonical_source_path": rec.canonical_source_path,
                "source_paths": rec.source_paths,
                "project_scope": rec.project_scope,
                "tags": rec.tags,
                "lang": rec.lang,
                "vector_ready": rec.vector_ready,
                "utf8_valid": rec.utf8_valid,
                "had_frontmatter": rec.had_frontmatter,
                "has_frontmatter": rec.has_frontmatter,
                "code_fence_closed": rec.code_fence_closed,
                "chinese_chars": rec.chinese_chars,
                "bytes": len(rec.content.encode("utf-8")),
                "adapter_paths": adapter_rel_paths,
            }
        )

        source_map[rec.doc_id] = {
            "canonical_path": str(full_repo_rel),
            "source_paths": rec.source_paths,
        }

        body_text = strip_frontmatter(rec.content).strip()
        if body_text:
            title = Path(rec.canonical_relpath).stem
            fm_match = FRONTMATTER_RE.match(rec.content)
            if fm_match:
                fm_text = fm_match.group(1)
                for line in fm_text.splitlines():
                    if line.lower().startswith("title:"):
                        title = line.split(":", 1)[1].strip() or title
                        break

            firebase_docs.append(
                {
                    "doc_id": rec.doc_id,
                    "project_scope": rec.project_scope,
                    "tags": rec.tags,
                    "lang": rec.lang,
                    "vector_ready": rec.vector_ready,
                    "source_path": rec.canonical_source_path,
                    "hash": rec.file_hash,
                    "title": title,
                    "canonical_path": str(full_repo_rel),
                    "text": body_text,
                    "text_chars": len(body_text),
                }
            )

            chunks = split_chunks(body_text, min_len=500, max_len=800, overlap=100)
            for idx, chunk in enumerate(chunks, start=1):
                firebase_chunks.append(
                    {
                        "doc_id": rec.doc_id,
                        "chunk_id": f"{rec.doc_id}::c{idx:04d}",
                        "chunk_index": idx,
                        "project_scope": rec.project_scope,
                        "tags": rec.tags,
                        "lang": rec.lang,
                        "vector_ready": rec.vector_ready,
                        "source_path": rec.canonical_source_path,
                        "hash": rec.file_hash,
                        "text": chunk,
                        "text_chars": len(chunk),
                    }
                )

        quality.append(
            {
                "doc_id": rec.doc_id,
                "utf8_valid": rec.utf8_valid,
                "has_frontmatter": rec.has_frontmatter,
                "code_fence_closed": rec.code_fence_closed,
                "chinese_chars": rec.chinese_chars,
                "has_replacement_char": "�" in rec.content,
            }
        )

    files_manifest = {
        "generated_at": now_iso(),
        "pass": pass_label,
        "mode": mode,
        "sources": {k: str(v) for k, v in SOURCE_ROOTS.items()},
        "total_input_files": total_input,
        "unique_documents": len(files_manifest_docs),
        "duplicates_removed": duplicate_count,
        "documents": files_manifest_docs,
        "normalization_warnings": normalization_warnings,
    }

    write_json(manifests_dir / "files-manifest.json", files_manifest)
    write_json(manifests_dir / "source-map.json", source_map)
    write_json(manifests_dir / "quality-report.json", {"generated_at": now_iso(), "checks": quality})

    docs_ndjson = manifests_dir / "firebase-docs.ndjson"
    chunks_ndjson = manifests_dir / "firebase-chunks.ndjson"

    with docs_ndjson.open("w", encoding="utf-8") as f:
        for row in firebase_docs:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    with chunks_ndjson.open("w", encoding="utf-8") as f:
        for row in firebase_chunks:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    redaction = sanitize_repo(repo)

    redaction_report = [
        "# Redaction Report",
        "",
        f"- generated_at: {now_iso()}",
        f"- pass: {pass_label}",
        f"- mode: {mode}",
        "",
        "## Touched Files",
    ]

    touched = redaction["touched_files"]
    if touched:
        for file_path, counts in sorted(touched.items()):
            redaction_report.append(f"- `{file_path}`: {counts}")
    else:
        redaction_report.append("- none")

    redaction_report.extend(["", "## Post-scan High Risk Matches"])
    post_scan = redaction["post_scan_high_risk"]
    if post_scan:
        for file_path, counts in sorted(post_scan.items()):
            redaction_report.append(f"- `{file_path}`: {counts}")
    else:
        redaction_report.append("- none")

    (manifests_dir / "redaction-report.md").write_text("\n".join(redaction_report) + "\n", encoding="utf-8")

    return {
        "repo": str(repo),
        "pass": pass_label,
        "mode": mode,
        "input_files": total_input,
        "unique_documents": len(files_manifest_docs),
        "duplicates_removed": duplicate_count,
        "firebase_docs": len(firebase_docs),
        "firebase_chunks": len(firebase_chunks),
        "redaction_touched_files": len(touched),
        "post_scan_high_risk_files": len(post_scan),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repos", nargs="+", required=True, help="Target repo paths")
    parser.add_argument("--mode", choices=["pass1", "pass2"], default="pass1")
    parser.add_argument("--pass-label", default="2026-02-13-pass1")
    parser.add_argument(
        "--previous-manifest-rel",
        default="knowledge/vps-vault/manifests/files-manifest.json",
        help="Relative path for previous manifest (pass2 only)",
    )
    args = parser.parse_args()

    summaries = []
    for repo_arg in args.repos:
        repo = Path(repo_arg).resolve()
        if not (repo / ".git").exists():
            raise SystemExit(f"Not a git repo: {repo}")
        summary = sync_repo(
            repo=repo,
            pass_label=args.pass_label,
            mode=args.mode,
            previous_manifest_rel=args.previous_manifest_rel if args.mode == "pass2" else None,
        )
        summaries.append(summary)

    print(json.dumps({"generated_at": now_iso(), "summaries": summaries}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
