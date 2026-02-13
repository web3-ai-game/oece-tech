---
title: 04-zhuge-legion-architecture-03-3-
slug: 04-zhuge-legion-architecture-03-3
category: TXT_mega_distill_2_final_output/2-knowledge-base/2.4-engineering
tags: [vps-sync]
lang: zh
created: 2026-02-13
source: vps-pass1-sync
vector_ready: true
---

## 3. 核心組件設計

### 3.1 代理角色與Prompt配置

#### 3.11 角色分工原理

五個角色（Architect, Adversary, Realist, Chaos, Arbiter）模擬決策流程。背景：源自紅隊藍隊（Red Team-Blue Team）安全實踐。原理：溫度參數（Temperature）控制輸出隨機性，高溫促進創新。

#### 3.12 Prompt工程深度

每個代理有特定system_prompt，原理是Prompt Engineering優化模型輸出。實例：Architect的無限資源假設鼓勵理想化設計。

代碼範例3：Prompt YAML載入（Go）

```go
// config/config.go
package config

import (
    "gopkg.in/yaml.v2"
    "io/ioutil"
)

type AgentConfig struct {
    SystemPrompt string `yaml:"system_prompt"`
    Temperature  float32 `yaml:"temperature"`
}

var Prompts map[string]AgentConfig

func LoadPrompts(file string) error {
    data, _ := ioutil.ReadFile(file)
    yaml.Unmarshal(data, &Prompts) // 解析YAML
    return nil
}
```

此範例展示配置載入。

### 3.2 仲裁與納什均衡

#### 3.21 仲裁原理

Arbiter整合輸出，尋找納什均衡。背景：納什均衡源自約翰·納什的博弈論。原理：評估各方案權衡，確保無單方改進。

實例：在供應鏈優化中，均衡成本與風險。
