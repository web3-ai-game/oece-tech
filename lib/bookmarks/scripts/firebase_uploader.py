#!/usr/bin/env python3
"""
Firebase 上传工具
输入：distilled_bookmarks_v2.json
输出：Firebase Realtime Database
"""

import json
import os
from datetime import datetime
from firebase_admin import credentials, db, initialize_app

class FirebaseUploader:
    def __init__(self, cred_path=None, db_url=None):
        """
        初始化Firebase
        
        参数:
        - cred_path: 服务账号JSON路径（本地开发用）
        - db_url: Firebase Realtime DB URL
        """
        self.db_url = db_url or os.getenv('FIREBASE_DATABASE_URL', 
                                          'https://oece-tech-9aa8d-default-rtdb.firebaseio.com/')
        
        # 初始化Firebase Admin SDK
        if cred_path:
            cred = credentials.Certificate(cred_path)
        else:
            # 尝试从环境变量加载
            cred_json = os.getenv('FIREBASE_SERVICE_ACCOUNT')
            if cred_json:
                cred = credentials.Certificate(json.loads(cred_json))
            else:
                # 使用默认凭证（Cloud Functions中自动可用）
                cred = credentials.ApplicationDefault()
        
        initialize_app(cred, {'databaseURL': self.db_url})
        print(f"✓ 已连接Firebase: {self.db_url}")
    
    def upload_bookmarks(self, json_file: str):
        """
        上传书签到Firebase
        
        结构:
        /bookmarks
          /{category}
            /{bookmark_id}
              - title
              - url
              - value
              - importance
              - tags
              - ...
        """
        with open(json_file, 'r', encoding='utf-8') as f:
            bookmarks = json.load(f)
        
        print(f"\n📤 开始上传 {len(bookmarks)} 条书签...")
        
        # 获取根引用
        ref = db.reference('bookmarks')
        
        # 按类别组织数据
        by_category = {}
        for bm in bookmarks:
            category = bm.get('category', 'misc')
            
            # 生成唯一ID（使用URL hash）
            import hashlib
            bm_id = hashlib.md5(bm['url'].encode()).hexdigest()[:12]
            
            # 准备数据（移除不必要的嵌套结构）
            clean_data = {
                'id': bm_id,
                'title': bm['title'],
                'url': bm['url'],
                'domain': bm.get('domain', ''),
                'category': category,
                'value': bm.get('value', ''),
                'summary': bm.get('summary', ''),
                'key_features': bm.get('key_features', []),
                'scenarios': bm.get('scenarios', []),
                'importance': bm.get('importance', 3),
                'tags': bm.get('tags', []),
                'total_chars': bm.get('total_chars', 0),
                'scraped_at': bm.get('scraped_at', ''),
                'distilled_at': bm.get('distilled_at', ''),
                'uploaded_at': datetime.utcnow().isoformat()
            }
            
            if category not in by_category:
                by_category[category] = {}
            
            by_category[category][bm_id] = clean_data
        
        # 批量上传（按类别）
        for category, items in by_category.items():
            print(f"  上传 {category}: {len(items)} 条...")
            ref.child(category).set(items)
        
        print(f"\n✅ 上传完成!")
        print(f"   类别数: {len(by_category)}")
        print(f"   总书签: {len(bookmarks)}")
        
        # 创建索引（metadata）
        metadata = {
            'total_bookmarks': len(bookmarks),
            'categories': list(by_category.keys()),
            'by_importance': {
                '5': sum(1 for bm in bookmarks if bm.get('importance') == 5),
                '4': sum(1 for bm in bookmarks if bm.get('importance') == 4),
                '3': sum(1 for bm in bookmarks if bm.get('importance') == 3),
            },
            'last_updated': datetime.utcnow().isoformat()
        }
        
        db.reference('metadata').set(metadata)
        print(f"\n📊 元数据已更新")
        
        return by_category
    
    def create_search_index(self):
        """
        创建搜索索引（简化版，用于客户端查询）
        """
        print(f"\n🔍 生成搜索索引...")
        
        ref = db.reference('bookmarks')
        all_bookmarks = ref.get()
        
        # 展平所有书签
        index = []
        for category, items in all_bookmarks.items():
            for bm_id, bm in items.items():
                index.append({
                    'id': bm_id,
                    'title': bm['title'],
                    'summary': bm.get('summary', ''),
                    'category': category,
                    'importance': bm.get('importance', 3),
                    'tags': bm.get('tags', [])
                })
        
        # 按重要性排序
        index.sort(key=lambda x: x['importance'], reverse=True)
        
        # 保存索引
        db.reference('search_index').set(index)
        
        print(f"✓ 搜索索引已创建: {len(index)} 条")
    
    def test_query(self):
        """测试查询"""
        print(f"\n🧪 测试查询...")
        
        # 查询5星AI工具
        ref = db.reference('bookmarks/ai-tools')
        ai_tools = ref.order_by_child('importance').equal_to(5).get()
        
        if ai_tools:
            print(f"\n找到 {len(ai_tools)} 个5星AI工具:")
            for bm_id, bm in list(ai_tools.items())[:3]:
                print(f"  - {bm['title']}: {bm.get('summary', '')}")
        
        # 查询元数据
        metadata = db.reference('metadata').get()
        print(f"\n元数据:")
        print(f"  总书签: {metadata['total_bookmarks']}")
        print(f"  5星: {metadata['by_importance']['5']}")
        print(f"  更新时间: {metadata['last_updated']}")


def main():
    # 方式1：使用服务账号JSON（本地开发）
    # uploader = FirebaseUploader(cred_path='./serviceAccountKey.json')
    
    # 方式2：使用环境变量（推荐，用于CI/CD）
    uploader = FirebaseUploader()
    
    # 上传书签
    uploader.upload_bookmarks('distilled_bookmarks_v2.json')
    
    # 创建搜索索引
    uploader.create_search_index()
    
    # 测试查询
    uploader.test_query()
    
    print(f"\n🎉 全部完成!")
    print(f"\n访问Firebase Console:")
    print(f"https://console.firebase.google.com/project/oece-tech-9aa8d/database")


if __name__ == '__main__':
    main()
