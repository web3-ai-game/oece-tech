#!/usr/bin/env python3
import os
from pathlib import Path
from typing import List, Dict, Union
import urllib.parse

class CatalogGenerator:
    def __init__(self, root_dir: str, output_file: str = "CATALOG.md"):
        self.root_dir = Path(root_dir)
        self.output_file = self.root_dir / output_file
        self.ignore_dirs = {'.git', '__pycache__', 'images', 'assets'}
        self.ignore_files = {'CATALOG.md', 'SUMMARY.md', '.DS_Store'}

    def generate(self):
        print(f"Generating catalog for {self.root_dir}...")
        
        content_lines = ["# 📚 Digital Library Catalog", "", "---", ""]
        
        # Build directory tree structure
        tree = self._build_tree(self.root_dir)
        
        # Convert tree to markdown
        self._tree_to_markdown(tree, content_lines, level=0)
        
        # Write to file
        with open(self.output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(content_lines))
            
        print(f"Catalog generated at: {self.output_file}")

    def _build_tree(self, path: Path) -> Dict:
        tree = {"_files": []}
        
        try:
            # Sort for consistent order
            items = sorted(list(path.iterdir()), key=lambda x: (not x.is_dir(), x.name.lower()))
            
            for item in items:
                if item.name.startswith('.'):
                    continue
                    
                if item.is_dir():
                    if item.name in self.ignore_dirs:
                        continue
                    tree[item.name] = self._build_tree(item)
                
                elif item.is_file():
                    if item.name in self.ignore_files:
                        continue
                    if item.suffix.lower() == '.md':
                        tree["_files"].append(item)
                        
        except PermissionError:
            pass
            
        return tree

    def _tree_to_markdown(self, tree: Dict, lines: List[str], level: int, current_path: str = ""):
        # Indentation for list items
        indent = "  " * level
        
        # Process files in current directory
        for file_path in tree.get("_files", []):
            # Calculate relative path for the link
            rel_path = file_path.relative_to(self.root_dir)
            # URL encode the path for markdown link
            link_path = urllib.parse.quote(str(rel_path))
            
            display_name = file_path.stem
            lines.append(f"{indent}- 📄 [{display_name}]({link_path})")
            
        # Process subdirectories
        for name, subtree in tree.items():
            if name == "_files":
                continue
                
            # Skip empty directories if desired, or keep them
            # if not subtree.get("_files") and len(subtree) <= 1: continue
            
            lines.append(f"{indent}- 📂 **{name}**")
            self._tree_to_markdown(subtree, lines, level + 1, os.path.join(current_path, name))

if __name__ == "__main__":
    generator = CatalogGenerator(
        root_dir="/home/sms/ebook-converter/data/markdown-output"
    )
    generator.generate()
