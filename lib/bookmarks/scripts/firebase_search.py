#!/usr/bin/env python3
"""
Firebase 书签查询 CLI
替代 MongoDB 查询，直接查询 Firebase Realtime DB
"""

import sys
import os
from firebase_admin import credentials, db, initialize_app
from typing import Optional, List

class FirebaseBookmarkSearch:
    def __init__(self, cred_path=None, db_url=None):
        """初始化Firebase连接"""
        self.db_url = db_url or os.getenv('FIREBASE_DATABASE_URL',
                                          'https://oece-tech-9aa8d-default-rtdb.firebaseio.com/')
        
        # 初始化Firebase Admin SDK
        if cred_path:
            cred = credentials.Certificate(cred_path)
        else:
            cred_json = os.getenv('FIREBASE_SERVICE_ACCOUNT')
            if cred_json:
                import json
                cred = credentials.Certificate(json.loads(cred_json))
            else:
                cred = credentials.ApplicationDefault()
        
        try:
            initialize_app(cred, {'databaseURL': self.db_url})
        except ValueError:
            # 已经初始化过了
            pass
    
    def search_by_text(self, query: str, category: Optional[str] = None, 
                       min_stars: int = 3, limit: int = 10) -> List[dict]:
        """
        文本搜索（简单版，客户端过滤）
        """
        ref = db.reference('bookmarks')
        
        # 获取数据
        if category:
            data = ref.child(category).get() or {}
        else:
            all_data = ref.get() or {}
            data = {}
            for cat, items in all_data.items():
                data.update(items)
        
        # 过滤和排序
        results = []
        query_lower = query.lower()
        
        for bm_id, bm in data.items():
            # 文本匹配
            searchable = f"{bm['title']} {bm.get('value', '')} {' '.join(bm.get('tags', []))}"
            if query_lower not in searchable.lower():
                continue
            
            # 重要性过滤
            if bm.get('importance', 0) < min_stars:
                continue
            
            results.append(bm)
        
        # 按重要性排序
        results.sort(key=lambda x: x.get('importance', 0), reverse=True)
        
        return results[:limit]
    
    def get_by_category(self, category: str, min_stars: int = 3) -> List[dict]:
        """按类别获取"""
        ref = db.reference(f'bookmarks/{category}')
        data = ref.get() or {}
        
        results = [
            bm for bm in data.values()
            if bm.get('importance', 0) >= min_stars
        ]
        
        results.sort(key=lambda x: x.get('importance', 0), reverse=True)
        return results
    
    def get_top_bookmarks(self, limit: int = 20) -> List[dict]:
        """获取最高分书签"""
        ref = db.reference('search_index')
        index = ref.get() or []
        return index[:limit]
    
    def get_by_tags(self, tags: List[str], min_stars: int = 3) -> List[dict]:
        """按标签搜索"""
        ref = db.reference('bookmarks')
        all_data = ref.get() or {}
        
        results = []
        for category, items in all_data.items():
            for bm in items.values():
                bm_tags = set(bm.get('tags', []))
                if any(tag in bm_tags for tag in tags) and bm.get('importance', 0) >= min_stars:
                    results.append(bm)
        
        results.sort(key=lambda x: x.get('importance', 0), reverse=True)
        return results
    
    def print_results(self, results: List[dict], show_url: bool = True):
        """格式化输出"""
        if not results:
            print("❌ 未找到匹配的书签")
            return
        
        print(f"\n📚 找到 {len(results)} 条结果:\n")
        for i, r in enumerate(results, 1):
            stars = '⭐' * r.get('importance', 0)
            print(f"{i}. {stars} {r['title']}")
            
            if r.get('summary'):
                print(f"   💡 {r['summary']}")
            
            if r.get('value'):
                value = r['value'][:100] + "..." if len(r['value']) > 100 else r['value']
                print(f"   📝 {value}")
            
            if r.get('key_features'):
                features = ', '.join(r['key_features'][:3])
                print(f"   ⚙️  {features}")
            
            if r.get('scenarios'):
                print(f"   🎯 {', '.join(r['scenarios'][:3])}")
            
            if r.get('tags'):
                tags = ' '.join([f'#{tag}' for tag in r['tags'][:5]])
                print(f"   🏷️  {tags}")
            
            if show_url:
                print(f"   🔗 {r['url']}")
            
            print()


def main():
    if len(sys.argv) < 2:
        print("📖 用法:")
        print("  python3 firebase_search.py <搜索词> [分类] [最低星级]")
        print("\n示例:")
        print("  python3 firebase_search.py 'AI API'")
        print("  python3 firebase_search.py 'Next.js' hosting 4")
        print("  python3 firebase_search.py --top")
        print("  python3 firebase_search.py --category ai-tools")
        print("  python3 firebase_search.py --tags free-tier api")
        return
    
    searcher = FirebaseBookmarkSearch()
    
    # 特殊命令
    if sys.argv[1] == '--top':
        results = searcher.get_top_bookmarks(20)
        searcher.print_results(results)
        return
    
    if sys.argv[1] == '--category':
        if len(sys.argv) < 3:
            print("❌ 需要指定类别")
            return
        results = searcher.get_by_category(sys.argv[2])
        searcher.print_results(results)
        return
    
    if sys.argv[1] == '--tags':
        if len(sys.argv) < 3:
            print("❌ 需要指定标签")
            return
        tags = sys.argv[2:]
        results = searcher.get_by_tags(tags)
        searcher.print_results(results)
        return
    
    # 普通搜索
    query = sys.argv[1]
    category = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].isdigit() else None
    min_stars = int(sys.argv[3]) if len(sys.argv) > 3 else 3
    
    results = searcher.search_by_text(query, category, min_stars)
    searcher.print_results(results)


if __name__ == '__main__':
    main()
