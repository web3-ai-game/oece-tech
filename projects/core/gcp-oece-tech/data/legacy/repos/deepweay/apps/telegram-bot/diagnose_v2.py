#!/usr/bin/env python3
"""诊断V2系统"""

# 测试关键词检测
XIAOAI_KEYWORDS = {
    "简体": ["小爱", "小爱同学", "群主", "管理", "我操", "都来", "接茬"],
    "繁体": ["小愛", "小愛同學", "群主", "管理", "我操", "都來", "接茬"],
    "英文": ["xiaoai", "admin", "manager", "help", "hey"]
}

def check_xiaoai_trigger(text: str) -> bool:
    """检查是否触发小爱同学"""
    if not text:
        return False
    
    text_lower = text.lower()
    
    # 检查所有关键词
    for lang, keywords in XIAOAI_KEYWORDS.items():
        for keyword in keywords:
            if keyword.lower() in text_lower:
                return True, lang, keyword
    
    return False, None, None

# 测试消息
test_messages = [
    "你說說,萬一菌絲都死了怎麼辦",
    "你能幫啥啊",
    "還回覆嗎?",
    "小爱 你好",
    "小愛 幫忙",
    "xiaoai help",
    "群主在嗎",
    "管理 來一下",
]

print("="*70)
print("🔍 V2关键词检测诊断")
print("="*70)
print()

for msg in test_messages:
    result, lang, keyword = check_xiaoai_trigger(msg)
    if result:
        print(f"✅ 触发: '{msg}'")
        print(f"   语言: {lang}, 关键词: {keyword}")
    else:
        print(f"❌ 未触发: '{msg}'")
    print()

print("="*70)
print("💡 提示:")
print("   消息必须包含关键词才会触发回复")
print("   例如: '小爱 你好' 或 '小愛 幫忙'")
print("="*70)
