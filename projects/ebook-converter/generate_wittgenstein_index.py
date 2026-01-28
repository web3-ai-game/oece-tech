import os
from pathlib import Path
import re
from wittgenstein_indexer import WittgensteinIndexer
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger("IndexGenerator")

def parse_markdown(content):
    """
    Simple parser to extract structure from Markdown.
    Returns a dict with propositions, concepts, relations, hierarchy.
    """
    lines = content.split('\n')
    propositions = []
    concepts = []
    relations = []
    hierarchy = {"title": "Root", "children": []}
    
    current_section = hierarchy
    stack = [(0, hierarchy)] # (level, node)
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Headers as Concepts
        header_match = re.match(r'^(#+)\s+(.*)', line)
        if header_match:
            level = len(header_match.group(1))
            title = header_match.group(2)
            
            concept = {
                "name": title,
                "type": "section",
                "level": level
            }
            concepts.append(concept)
            
            # Build hierarchy
            new_node = {"title": title, "children": []}
            
            # Pop stack until we find a parent with lower level
            while stack and stack[-1][0] >= level:
                stack.pop()
                
            if stack:
                parent = stack[-1][1]
                parent["children"].append(new_node)
                
                # Add relation
                relations.append({
                    "from": parent.get("title", "Root"),
                    "to": title,
                    "type": "contains"
                })
            
            stack.append((level, new_node))
            current_section = new_node
            
        # Paragraphs as Propositions
        elif len(line) > 20: # arbitrary threshold to skip short noise
            propositions.append({
                "content": line,
                "context": current_section.get("title", "Unknown")
            })
            
    return {
        "propositions": propositions,
        "concepts": concepts,
        "relations": relations,
        "hierarchy": hierarchy
    }

def generate_index():
    print("🧠 正在構建維根斯坦索引 (Wittgenstein Index)...")
    
    indexer = WittgensteinIndexer()
    base_dir = Path("/home/sms/ebook-converter/data/markdown-output")
    
    if not base_dir.exists():
        print("❌ 數據目錄不存在")
        return

    count = 0
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".md") and file != "CATALOG.md":
                md_path = Path(root) / file
                
                try:
                    with open(md_path, 'r', encoding='utf-8', errors='replace') as f:
                        content = f.read()
                        
                    structure = parse_markdown(content)
                    
                    # Original path (reconstruct or approximate)
                    # We don't have the original PDF path easily here, so we use the MD path relative to root
                    rel_path = os.path.relpath(md_path, base_dir)
                    original_path = f"/知識庫/{rel_path}".replace(".md", "") # Approximation
                    
                    indexer.add_document(original_path, str(md_path), structure)
                    count += 1
                    
                    if count % 100 == 0:
                        print(f"已索引 {count} 個文檔...")
                        
                except Exception as e:
                    logger.error(f"索引失敗 {file}: {e}")

    indexer.save_index()
    stats = indexer.get_stats()
    
    print("\n" + "="*50)
    print("🧠 索引構建完成")
    print("="*50)
    print(f"文檔總數: {stats['total_documents']}")
    print(f"命題總數: {stats['total_propositions']}")
    print(f"概念總數: {stats['total_concepts']}")
    print(f"關係總數: {stats['total_relations']}")

if __name__ == "__main__":
    generate_index()
