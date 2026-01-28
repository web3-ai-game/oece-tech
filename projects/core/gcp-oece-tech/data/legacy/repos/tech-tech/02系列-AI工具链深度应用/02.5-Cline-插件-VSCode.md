# 02.5 VSCode AI插件实战：用Continue打造你的私人AI开发环境

**作者**: Cline | **发布日期**: 2025-11-05 | **更新日期**: 2025-10-25 | **分类**: `AI工具链` `VSCode` `Continue` `开发效率` `Ollama`

**摘要**: Visual Studio Code已成为全球开发者的首选编辑器，而AI代码助手正在重新定义我们的编码方式。除了广为人知的GitHub Copilot，一个更开放、更可定制的AI插件新浪潮正在兴起。**Continue**正是其中的佼佼者，它是一个开源的AI代码助手，其最大魅力在于“模型自由”——允许你连接任何AI模型，无论是顶级的GPT-4o、Claude 3，还是完全私有、在本地运行的Llama 3。本篇教程将是一份终极实战指南，带你从零开始安装、配置并精通Continue，学习如何利用它的上下文提供者（`@`）和自定义斜杠命令，将VSCode打造成一个真正属于你自己的、可无限扩展的私人AI开发环境。

**SEO关键词**: Continue VSCode插件, AI编程助手, VSCode AI, Ollama, 本地AI模型, 自定义AI命令, AI辅助开发

---

## 第1部分：为什么需要一个独立的AI插件？

在已经有GitHub Copilot的情况下，为什么我们还需要Continue这样的工具？答案是：**自由、控制和可扩展性**。

- **模型自由 (Model Freedom)**: 你不再被锁定在单一的AI提供商。今天你可以用GPT-4o来生成代码，明天可以切换到Claude 3 Opus来重构文档，甚至在处理敏感代码时，可以无缝切换到在本地通过Ollama运行的、完全离线的Code Llama模型。你可以为不同的任务，选择最合适的“大脑”。

- **深度定制 (Deep Customization)**: Continue允许你通过简单的配置文件，创建属于你自己的“斜杠命令”(`/` commands)。这意味着你可以将你最常用的、复杂的Prompt，封装成一个简单易用的命令，例如，创建一个`/review`命令，让AI按照你团队的代码审查清单来检查代码。

- **开源与隐私 (Open Source & Privacy)**: Continue本身是开源的，这提供了极高的透明度。结合本地运行的Ollama模型，你可以搭建一套**完全离线、代码不出本机**的AI辅助开发环境，解决了企业和个人对于代码隐私的终极关切。

---

## 第2部分：Continue插件安装与高级配置

### 2.1 安装与初体验

1.  在VSCode的扩展市场中搜索“Continue”并安装。
2.  安装后，VSCode的活动栏会出现Continue的图标，点击即可打开其聊天侧边栏。

### 2.2 核心配置文件 `config.ts`

Continue的所有魔力都源于其配置文件。通过命令面板(`Ctrl+Shift+P`)输入`Continue: Open Config File`，可以打开`config.ts`文件。下面是一个包含了多种模型配置的、可以直接使用的模板。

**前提**: 你需要先获取各个服务的API密钥，并将其设置为环境变量（如`OPENAI_API_KEY`）。对于Ollama，你需要先在本地安装并运行它。

```typescript
// ~/.continue/config.ts
import { OpenAI, Anthropic, Google, Ollama } from "@continue-ai/core/models";
import { Models } from "@continue-ai/core";

// 这是一个示例配置，你可以根据自己的需求进行修改
const config: Models = {
  // 默认模型，按`Cmd/Ctrl+L`时使用的模型
  default: new OpenAI({ 
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY
  }),
  
  // 模型列表，可以在UI中随时切换
  saved: [
    new OpenAI({ 
      title: "GPT-4o (OpenAI)",
      model: "gpt-4o",
      apiKey: process.env.OPENAI_API_KEY
    }),
    new Anthropic({
      title: "Claude 3 Opus",
      model: "claude-3-opus-20240229",
      apiKey: process.env.ANTHROPIC_API_KEY
    }),
    new Google({
      title: "Gemini 1.5 Flash",
      model: "gemini-1.5-flash-latest",
      apiKey: process.env.GOOGLE_API_KEY
    }),
    // --- 本地模型配置 ---
    new Ollama({
      title: "Llama 3 (Local)",
      model: "llama3",
      serverUrl: "http://localhost:11434" // Ollama服务的地址
    }),
    new Ollama({
      title: "Code Llama 7b (Local)",
      model: "codellama:7b",
      serverUrl: "http://localhost:11434"
    }),
  ],
};

export default config;
```

**本地模型Ollama配置指南**:
1.  访问[ollama.com](https://ollama.com/)下载并安装Ollama。
2.  在终端运行`ollama run llama3`来下载并运行Llama 3模型。
3.  将上述Ollama配置块添加到你的`config.ts`中。
4.  现在，你就可以在Continue的UI中，像切换云端模型一样，无缝切换到本地模型。

---

## 第3部分：核心功能实战

### 3.1 上下文驱动的AI聊天 (`@`)

Continue的聊天窗口通过`@`符号，可以精准地引入各种上下文，让AI的回答不再是泛泛而谈。

- **`@codebase`**: 引用整个项目。Continue会自动对你的项目文件进行索引（这个过程在本地完成，不会上传代码），让你可以提出项目全局性的问题。
  - **Prompt示例**: `@codebase 作为一个新加入的开发者，请向我介绍这个项目的整体架构、主要技术栈和启动方式。`
- **`@file`**: 引用一个或多个具体文件。
  - **Prompt示例**: `比较 @file:serviceA.js 和 @file:serviceB.js 的异同。`
- **`@terminal`**: 引用最近一次终端命令的输出。
  - **Prompt示例**: `我的 `npm install` 命令失败了，请帮我分析原因。@terminal`
- **`@docs`**: 引用你配置好的文档链接，进行知识库问答。

### 3.2 行内编辑与生成 (`Cmd/Ctrl+I` 和 `Cmd/Ctrl+L`)

这是最高频的用法，让你无需离开代码就能与AI协作。

1.  **编辑/重构已有代码 (`Cmd/Ctrl+I`)**:
    - 选中一段代码，按下`Cmd/Ctrl+I`，会出现一个内联输入框。
    - **示例1 (重构)**: 选中一个复杂的函数，输入 `refactor this to be more readable and add comments`。
    - **示例2 (添加功能)**: 选中一个React组件的`return`部分，输入 `add a button that increments a counter state`。
    - Continue会流式地生成修改建议，你可以一键接受或拒绝。

2.  **从零生成代码 (`Cmd/Ctrl+L`)**:
    - 在一个空行或空文件中，按下`Cmd/Ctrl+L`，然后描述你想要生成的代码。
    - **示例**: 在一个空的`Dockerfile`中，输入 `Create a production-ready, multi-stage Dockerfile for a Next.js application.`

---

## 第4部分：高级定制：创建你自己的“斜杠命令”

这是Continue最强大的功能，它让你从AI的“使用者”变为AI工作流的“创造者”。你可以在`config.ts`中定义自己的`/`命令。

```typescript
// ~/.continue/config.ts (续)
import { SlashCommand } from "@continue-ai/core/slash-commands";

// ... (模型配置部分)

// 添加自定义斜杠命令
config.slashCommands = [
  // 命令1: /test - 为选中的函数生成单元测试
  {
    name: "test",
    description: "Generate unit tests for the selected code",
    prompt: `Please write a comprehensive set of unit tests for the following code, using the Jest framework. Cover edge cases and provide mocks where necessary. The code is:\n\n{{selectedCode}}`,
  },
  // 命令2: /docs - 为选中的函数生成JSDoc文档
  {
    name: "docs",
    description: "Generate JSDoc documentation for the selected code",
    prompt: `Please generate a JSDoc comment block for the following TypeScript function. Describe the function's purpose, its parameters (with types), and what it returns. The function is:\n\n{{selectedCode}}`,
  },
  // 命令3: /review - 按照清单审查代码
  {
    name: "review",
    description: "Review selected code for bugs, performance, and style",
    prompt: `Act as a senior staff engineer performing a code review. Analyze the following code for potential bugs, performance issues, security vulnerabilities, and adherence to best practices. Provide your feedback as a bulleted list, with code suggestions for improvement where applicable. The code is:\n\n{{selectedCode}}`,
  },
];

export default config;
```

**工作流**:
1.  在编辑器中选中一个函数。
2.  在Continue的聊天框中，输入`/test`并回车。
3.  Continue会自动将你选中的代码（`{{selectedCode}}`）填充到Prompt模板中，然后发送给AI。
4.  AI返回的结果就是为你量身定做的单元测试。

通过定义一系列符合你团队规范的自定义命令，你可以将最佳实践固化为工具，极大地提升整个团队的效率和代码质量。

---

## 第5部分：结合本地模型：Ollama与私有化AI

- **为什么选择本地模型？**
    - **隐私**: 代码永远不会离开你的电脑，满足最严格的安全与合规要求。
    - **成本**: 无需支付任何API费用。
    - **离线**: 可以在没有网络连接的环境下使用。

- **性能与质量的权衡**:
    - **硬件要求**: 运行7B（70亿参数）级别的模型，至少需要8GB RAM（最好是16GB）。运行更大的模型则需要更强的GPU。
    - **质量差异**: 本地模型（如Llama 3 8B, Code Llama 7b）在代码生成和遵循复杂指令方面，与顶级的GPT-4o或Claude 3 Opus仍有差距。但对于代码补全、解释、简单重构等任务，它们已经表现得相当出色。

**最佳实践**: 在`config.ts`中同时配置云端和本地模型。在处理非敏感的、需要高质量创造性输出的任务时，使用云端模型。在处理公司核心的、高度敏感的代码时，一键切换到本地模型。

## 结论：从“AI使用者”到“AI工作流构建者”

以Continue为代表的开源、可定制化AI助手，标志着AI辅助开发进入了一个新阶段。它将选择权和控制权交还给了开发者。通过自由地切换AI“大脑”（模型），并利用斜杠命令等工具为自己和团队量身打造AI工作流，我们不再仅仅是AI功能的被动使用者，而是成为了一个主动的、能驾驭AI来解决特定领域问题的“AI工作流构建者”。这不仅关乎效率，更关乎在AI时代下，开发者如何保持自身的核心价值和创造力。

## 参考资料

1.  [Continue Official Website & Docs](https://continue.dev/)
2.  [Ollama - Run large language models locally](https://ollama.com/)
3.  [Awesome-Self-Hosted-AI](https://github.com/linexj/Awesome-Self-Hosted-AI)