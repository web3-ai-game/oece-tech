#!/usr/bin/env python3
"""
Grok 蒸馏 v2.0 - 使用 grok-4-1-fast-reasoning
输入：scraped_content.json（爬取的全文内容）
输出：distilled_bookmarks_v2.json
"""

import json
import os
import time
from typing import List, Dict
import requests
from datetime import datetime

class GrokDistillerV2:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('GROK_API_KEY')
        self.base_url = "https://api.x.ai/v1"
        self.model = "grok-4-1-fast-reasoning"  # 最新模型
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        self.stats = {
            'input_tokens': 0,
            'output_tokens': 0,
            'cost_usd': 0.0
        }
    
    def calculate_cost(self, input_tokens: int, output_tokens: int) -> float:
        """
        计算成本
        grok-4-1-fast-reasoning: $0.20/M输入, $0.50/M输出
        """
        input_cost = (input_tokens / 1_000_000) * 0.20
        output_cost = (output_tokens / 1_000_000) * 0.50
        return input_cost + output_cost
    
    def flatten_content(self, node: Dict, depth: int = 0) -> str:
        """
        将递归结构的内容展平为文本
        格式：[深度N] URL\n内容...\n\n
        """
        if not node:
            return ""
        
        indent = "  " * depth
        result = f"{indent}[深度{depth}] {node['url']}\n"
        
        if node.get('text'):
            # 限制每层最多5000字符
            text = node['text'][:5000]
            result += f"{indent}{text}\n\n"
        
        # 递归处理子页面
        for child in node.get('children', []):
            result += self.flatten_content(child, depth + 1)
        
        return result
    
    def distill_bookmark(self, bookmark: Dict, batch_num: int, total: int) -> Dict:
        """
        用Grok蒸馏单个书签
        """
        url = bookmark['url']
        title = bookmark['title']
        category = bookmark.get('category', 'misc')
        
        print(f"\n[{batch_num}/{total}] 蒸馏: {title}")
        print(f"  类别: {category}")
        print(f"  URL: {url}")
        
        # 处理内容
        if not bookmark.get('content'):
            print(f"  ⏭️  跳过: 无抓取内容")
            return {
                **bookmark,
                'distilled_at': datetime.utcnow().isoformat(),
                'value': '未能抓取内容',
                'scenarios': [],
                'importance': 2,
                'tags': ['failed-scrape'],
                'summary': '',
                'key_features': []
            }
        
        # 展平内容
        full_content = self.flatten_content(bookmark['content'])
        content_preview = full_content[:2000] + "..." if len(full_content) > 2000 else full_content
        
        print(f"  内容长度: {len(full_content)} 字符")
        
        # 构建提示词
        prompt = f"""你是技术资源分析专家。分析以下网站的完整内容，提取关键价值。

**网站信息**
标题: {title}
类别: {category}
URL: {url}

**抓取的完整内容**（包含多层页面）：
{content_preview}

**任务**
1. **核心价值**（1-2句话，突出最独特的点）
2. **关键功能**（3-5个主要feature，简短描述）
3. **适用场景**（3-5个具体use case）
4. **重要性评分**（1-5星）
   - 5星: 必备工具/顶级资源
   - 4星: 高价值推荐
   - 3星: 值得关注
   - 2星: 一般参考
   - 1星: 低价值/过时
5. **智能标签**（5-8个，如：free-tier, api-tool, no-code等）
6. **一句话总结**（15字内，适合快速浏览）

**输出格式**（纯JSON，不要markdown包裹）：
{{
  "value": "核心价值描述",
  "key_features": ["功能1", "功能2", "功能3"],
  "scenarios": ["场景1", "场景2", "场景3"],
  "importance": 4,
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "一句话总结"
}}

**重要**：
- 基于实际抓取的内容，不要编造
- 如果是付费服务，importance不超过4星（除非极度独特）
- 如果内容不清晰或是导航页，importance降为2星
- 标签要具体（避免generic、good、useful等无意义词）
"""

        # 调用API
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system", 
                    "content": "你是技术资源蒸馏专家。输出纯JSON，不要markdown包裹。基于实际内容分析，不编造信息。"
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "temperature": 0.3,
            "max_tokens": 2000
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            
            result = response.json()
            
            # 统计token
            usage = result.get('usage', {})
            input_tokens = usage.get('prompt_tokens', 0)
            output_tokens = usage.get('completion_tokens', 0)
            cost = self.calculate_cost(input_tokens, output_tokens)
            
            self.stats['input_tokens'] += input_tokens
            self.stats['output_tokens'] += output_tokens
            self.stats['cost_usd'] += cost
            
            print(f"  Tokens: {input_tokens:,} 输入 + {output_tokens:,} 输出")
            print(f"  成本: ${cost:.4f}")
            
            # 解析响应
            content = result['choices'][0]['message']['content']
            
            # 清理markdown包裹
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '').strip()
            elif content.startswith('```'):
                content = content.replace('```', '').strip()
            
            distilled = json.loads(content)
            
            # 合并数据
            enriched = {
                **bookmark,
                'distilled_at': datetime.utcnow().isoformat(),
                'value': distilled.get('value', ''),
                'key_features': distilled.get('key_features', []),
                'scenarios': distilled.get('scenarios', []),
                'importance': distilled.get('importance', 3),
                'tags': distilled.get('tags', []),
                'summary': distilled.get('summary', ''),
                'tokens_used': {
                    'input': input_tokens,
                    'output': output_tokens,
                    'cost_usd': cost
                }
            }
            
            stars = '⭐' * distilled.get('importance', 0)
            print(f"  {stars} {distilled.get('summary', '')}")
            print(f"  ✓ 完成")
            
            return enriched
            
        except requests.exceptions.Timeout:
            print(f"  ✗ 超时")
            return self._create_fallback(bookmark, 'API timeout')
        
        except json.JSONDecodeError as e:
            print(f"  ✗ JSON解析失败: {e}")
            print(f"  原始响应: {content[:200]}...")
            return self._create_fallback(bookmark, 'JSON parse error')
        
        except Exception as e:
            print(f"  ✗ 错误: {e}")
            return self._create_fallback(bookmark, str(e))
    
    def _create_fallback(self, bookmark: Dict, error: str) -> Dict:
        """失败时的回退数据"""
        return {
            **bookmark,
            'distilled_at': datetime.utcnow().isoformat(),
            'value': '蒸馏失败',
            'key_features': [],
            'scenarios': [],
            'importance': 2,
            'tags': ['failed-distill'],
            'summary': '',
            'error': error
        }
    
    def process_all(self, scraped_file: str, delay: int = 2):
        """
        批量处理所有书签
        """
        with open(scraped_file, 'r', encoding='utf-8') as f:
            bookmarks = json.load(f)
        
        print(f"📦 开始蒸馏 {len(bookmarks)} 个书签...")
        print(f"   模型: {self.model}")
        print(f"   定价: $0.20/M输入, $0.50/M输出\n")
        
        results = []
        for i, bm in enumerate(bookmarks, 1):
            enriched = self.distill_bookmark(bm, i, len(bookmarks))
            results.append(enriched)
            
            # 礼貌延迟
            if i < len(bookmarks):
                time.sleep(delay)
        
        # 按重要性排序
        results.sort(key=lambda x: x.get('importance', 0), reverse=True)
        
        # 保存结果
        output_file = 'distilled_bookmarks_v2.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"\n\n✅ 蒸馏完成! 保存到: {output_file}")
        print(f"\n📊 统计:")
        print(f"   总计: {len(results)} 条")
        print(f"   5星: {sum(1 for x in results if x.get('importance') == 5)}")
        print(f"   4星: {sum(1 for x in results if x.get('importance') == 4)}")
        print(f"   3星: {sum(1 for x in results if x.get('importance') == 3)}")
        print(f"\n💰 成本:")
        print(f"   输入tokens: {self.stats['input_tokens']:,}")
        print(f"   输出tokens: {self.stats['output_tokens']:,}")
        print(f"   总计: ${self.stats['cost_usd']:.2f}")
        print(f"   剩余余额: ${50 - self.stats['cost_usd']:.2f} / $50")
        
        # 保存统计
        with open('distilling_stats_v2.json', 'w', encoding='utf-8') as f:
            json.dump({
                **self.stats,
                'total_bookmarks': len(results),
                'by_importance': {
                    '5': sum(1 for x in results if x.get('importance') == 5),
                    '4': sum(1 for x in results if x.get('importance') == 4),
                    '3': sum(1 for x in results if x.get('importance') == 3),
                    '2': sum(1 for x in results if x.get('importance') == 2),
                    '1': sum(1 for x in results if x.get('importance') == 1),
                },
                'timestamp': datetime.utcnow().isoformat()
            }, f, indent=2, ensure_ascii=False)
        
        return results
    
    def generate_markdown_report(self, distilled_file='distilled_bookmarks_v2.json'):
        """生成Markdown报告"""
        with open(distilled_file, 'r', encoding='utf-8') as f:
            bookmarks = json.load(f)
        
        # 按类别分组
        by_category = {}
        for bm in bookmarks:
            cat = bm.get('category', 'misc')
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(bm)
        
        # 生成Markdown
        md = "# 📚 书签知识库 v2.0\n\n"
        md += f"> 基于全文抓取 + Grok 4.1 深度蒸馏\n\n"
        md += f"**总计**: {len(bookmarks)} 条 | "
        md += f"**5星**: {sum(1 for x in bookmarks if x.get('importance') == 5)} 条\n\n"
        md += "---\n\n"
        
        # 类别名称映射
        category_names = {
            'ai-apis': '🤖 AI API',
            'ai-tools': '🛠️ AI 工具',
            'dev-tools': '👨‍💻 开发工具',
            'hosting': '🚀 部署托管',
            'cloud': '☁️ 云服务',
            'backend': '⚙️ 后端服务',
            'payment': '💳 支付集成',
            'learning': '📖 学习资源',
            'design': '🎨 设计资源',
            'misc': '📦 其他'
        }
        
        for cat in sorted(by_category.keys(), key=lambda x: len(by_category[x]), reverse=True):
            items = by_category[cat]
            # 只显示3星以上
            items = [x for x in items if x.get('importance', 0) >= 3]
            if not items:
                continue
            
            cat_name = category_names.get(cat, cat)
            md += f"## {cat_name} ({len(items)} 条)\n\n"
            
            for bm in sorted(items, key=lambda x: x.get('importance', 0), reverse=True):
                stars = '⭐' * bm.get('importance', 0)
                md += f"### {stars} {bm['title']}\n\n"
                md += f"**一句话**: {bm.get('summary', '暂无')}\n\n"
                md += f"**价值**: {bm.get('value', '暂无')}\n\n"
                
                if bm.get('key_features'):
                    md += "**关键功能**:\n"
                    for feat in bm['key_features'][:5]:
                        md += f"- {feat}\n"
                    md += "\n"
                
                if bm.get('scenarios'):
                    md += f"**适用场景**: {', '.join(bm['scenarios'][:5])}\n\n"
                
                if bm.get('tags'):
                    tags = ' '.join([f'`{tag}`' for tag in bm['tags'][:8]])
                    md += f"**标签**: {tags}\n\n"
                
                md += f"**链接**: [{bm['url']}]({bm['url']})\n\n"
                md += "---\n\n"
        
        with open('bookmark_report_v2.md', 'w', encoding='utf-8') as f:
            f.write(md)
        
        print(f"\n📝 Markdown报告已生成: bookmark_report_v2.md")


def main():
    # 检查API密钥
    api_key = os.getenv('GROK_API_KEY')
    if not api_key:
        print("❌ 错误: 未设置 GROK_API_KEY 环境变量")
        print("   设置方法: export GROK_API_KEY='xai-...'")
        return
    
    print(f"✓ API密钥: {api_key[:10]}...\n")
    
    distiller = GrokDistillerV2(api_key=api_key)
    
    # 批量蒸馏
    distilled = distiller.process_all('scraped_content.json', delay=1)
    
    # 生成报告
    distiller.generate_markdown_report()


if __name__ == '__main__':
    main()
