---
distilled_by: grok-4-0709
mode: B
---
part: 6
---

## 6. 代碼範例

以下提供5-8個代碼範例，聚焦shell腳本與Python，帶註釋，用於電子書管理。

6.1 範例1: 解壓縮腳本 (Shell)  
```bash
#!/bin/bash
# 解壓縮.tar.gz到臨時目錄
tar -xzf ebooks_20260108_154120.tar.gz -C /tmp/markdown-output/
# 註釋: -xzf 表示解壓、gzip、文件；-C 指定目錄
```

6.2 範例2: 移動文件 (Shell)  
```bash
#!/bin/bash
# 移動文件到目標目錄
mv /tmp/markdown-output/*.md /mnt/volume_sgp1_01/Ebook/
# 註釋: * 通配符匹配所有.md文件
```

6.3 範例3: 刪除原始包 (Shell)  
```bash
#!/bin/bash
# 刪除原始壓縮包
rm ebooks_20260108_154120.tar.gz
# 註釋: rm 命令移除文件，需小心使用
```

6.4 範例4: 文件計數驗證 (Python)  
```python
import os
# 計數目錄中文件數
def count_files(directory):
    return len([f for f in os.listdir(directory) if f.endswith('.md')])
# 註釋: os.listdir 列出文件，過濾.md後綴
print(count_files('/mnt/volume_sgp1_01/Ebook/'))  # 預期輸出: 4103
```

6.5 範例5: 磁盤空間檢查 (Shell)  
```bash
#!/bin/bash
# 檢查磁盤使用率
df -h /mnt/volume_sgp1_01
# 註釋: df -h 以人類可讀格式顯示
```

6.6 範例6: 隨機推薦書籍 (Python)  
```python
import random
import os
# 隨機選擇一本書
files = [f for f in os.listdir('/mnt/volume_sgp1_01/Ebook/') if f.endswith('.md')]
random_book = random.choice(files)
print(f"推薦: {random_book}")
# 註釋: random.choice 從列表隨機選取
```

6.7 範例7: 搜索關鍵詞 (Python)  
```python
import os
# 搜索包含關鍵詞的文件
def search_books(keyword, directory):
    return [f for f in os.listdir(directory) if keyword.lower() in f.lower()]
# 註釋: 忽略大小寫匹配文件名
print(search_books('1984', '/mnt/volume_sgp1_01/Ebook/'))
```

6.8 範例8: 備份到S3 (Shell with AWS CLI)  
```bash
#!/bin/bash
# 備份目錄到AWS S3
aws s3 sync /mnt/volume_sgp1_01/Ebook/ s3://my-ebook-bucket/
# 註釋: aws s3 sync 同步文件到S3桶
```
