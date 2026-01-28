#!/usr/bin/env python3
import os
import json
import hashlib
from pathlib import Path
from typing import Dict, List
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WittgensteinIndexer:
    def __init__(self, index_dir: str = "/home/sms/ebook-converter/data/wittgenstein-index"):
        self.index_dir = Path(index_dir)
        self.index_dir.mkdir(parents=True, exist_ok=True)
        
        self.master_index_file = self.index_dir / "master_index.json"
        self.propositions_file = self.index_dir / "propositions.json"
        self.concepts_file = self.index_dir / "concepts.json"
        self.relations_file = self.index_dir / "relations.json"
        
        self.index = self._load_or_create_index()
    
    def _load_or_create_index(self) -> Dict:
        """載入或創建索引"""
        if self.master_index_file.exists():
            with open(self.master_index_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        return {
            'version': '2.0',
            'created_at': datetime.now().isoformat(),
            'documents': {},
            'total_propositions': 0,
            'total_concepts': 0,
            'total_relations': 0
        }
    
    def add_document(self, file_path: str, markdown_path: str, structure: Dict) -> str:
        """添加文檔到索引"""
        doc_id = hashlib.sha256(file_path.encode()).hexdigest()[:16]
        
        self.index['documents'][doc_id] = {
            'id': doc_id,
            'original_file': file_path,
            'markdown_file': markdown_path,
            'filename': Path(file_path).name,
            'indexed_at': datetime.now().isoformat(),
            'propositions_count': len(structure.get('propositions', [])),
            'concepts_count': len(structure.get('concepts', [])),
            'relations_count': len(structure.get('relations', [])),
            'structure': structure.get('hierarchy', {})
        }
        
        self._save_propositions(doc_id, structure.get('propositions', []))
        self._save_concepts(doc_id, structure.get('concepts', []))
        self._save_relations(doc_id, structure.get('relations', []))
        
        self.index['total_propositions'] += len(structure.get('propositions', []))
        self.index['total_concepts'] += len(structure.get('concepts', []))
        self.index['total_relations'] += len(structure.get('relations', []))
        
        logger.info(f"文檔已索引: {doc_id} - {Path(file_path).name}")
        return doc_id
    
    def _save_propositions(self, doc_id: str, propositions: List[Dict]):
        """保存命題"""
        props_data = {}
        if self.propositions_file.exists():
            with open(self.propositions_file, 'r', encoding='utf-8') as f:
                props_data = json.load(f)
        
        props_data[doc_id] = propositions
        
        with open(self.propositions_file, 'w', encoding='utf-8') as f:
            json.dump(props_data, f, ensure_ascii=False, indent=2)
    
    def _save_concepts(self, doc_id: str, concepts: List[Dict]):
        """保存概念"""
        concepts_data = {}
        if self.concepts_file.exists():
            with open(self.concepts_file, 'r', encoding='utf-8') as f:
                concepts_data = json.load(f)
        
        concepts_data[doc_id] = concepts
        
        with open(self.concepts_file, 'w', encoding='utf-8') as f:
            json.dump(concepts_data, f, ensure_ascii=False, indent=2)
    
    def _save_relations(self, doc_id: str, relations: List[Dict]):
        """保存關係"""
        relations_data = {}
        if self.relations_file.exists():
            with open(self.relations_file, 'r', encoding='utf-8') as f:
                relations_data = json.load(f)
        
        relations_data[doc_id] = relations
        
        with open(self.relations_file, 'w', encoding='utf-8') as f:
            json.dump(relations_data, f, ensure_ascii=False, indent=2)
    
    def save_index(self):
        """保存主索引"""
        with open(self.master_index_file, 'w', encoding='utf-8') as f:
            json.dump(self.index, f, ensure_ascii=False, indent=2)
        
        logger.info(f"索引已保存: {len(self.index['documents'])} 個文檔")
    
    def get_stats(self) -> Dict:
        """獲取統計信息"""
        return {
            'total_documents': len(self.index['documents']),
            'total_propositions': self.index['total_propositions'],
            'total_concepts': self.index['total_concepts'],
            'total_relations': self.index['total_relations']
        }
    
    def export_for_s3(self) -> Dict:
        """導出用於 S3 的完整索引"""
        return {
            'master_index': self.index,
            'propositions': self._load_json(self.propositions_file),
            'concepts': self._load_json(self.concepts_file),
            'relations': self._load_json(self.relations_file)
        }
    
    def _load_json(self, file_path: Path) -> Dict:
        """載入 JSON 文件"""
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}

if __name__ == "__main__":
    indexer = WittgensteinIndexer()
    print("維根斯坦索引器初始化完成")
    print(f"統計: {indexer.get_stats()}")
