# 🎮 数独游戏 - Speckit 使用演示项目

这是一个使用 [GitHub Spec Kit](https://github.com/github/spec-kit) 进行规格驱动开发（Spec-Driven Development）的完整演示项目。通过构建一个面向小学生的数独游戏，展示 Speckit 的全部功能和最佳实践。

## 📋 项目概述

### 目标产品
一个专为小学生设计的数独游戏，具有以下特点：
- **可自定义大小**：支持 4×4、6×6、9×9 等不同尺寸的游戏棋盘
- **可调难度**：从简单到困难，适合不同年龄和技能水平
- **直观交互**：支持点击和拖拽数字完成游戏
- **打印功能**：可将游戏打印出来供线下练习
- **响应式设计**：同时适配 PC 和移动端浏览器

### 技术栈
- **前端框架**：Vue 3 + Nuxt.js
- **样式方案**：TailwindCSS
- **构建工具**：Vite
- **开发语言**：TypeScript

---

## 🌱 什么是 Spec Kit？

Spec Kit 是 GitHub 推出的规格驱动开发工具包，它帮助开发者通过结构化的规格说明来指导 AI 编码助手，从而构建高质量的软件。

### 核心理念

| 传统开发方式 | Spec Kit 方式 |
|-------------|---------------|
| 直接开始编码 | 先明确规格再编码 |
| 需求在脑中 | 需求在文档中 |
| AI 猜测意图 | AI 理解明确需求 |
| 频繁返工 | 一次做对 |

### Speckit 工作流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Spec-Driven Development                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Phase 1: Foundation (基础阶段)                                          │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                │
│  │ Constitution │ → │   Specify    │ → │   Clarify    │                │
│  │  建立原则     │   │  定义需求     │   │  澄清疑问     │                │
│  └──────────────┘   └──────────────┘   └──────────────┘                │
│                                                                         │
│  Phase 2: Implementation (实现阶段)                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                │
│  │    Plan      │ → │   Analyze    │ → │    Tasks     │                │
│  │  技术规划     │   │  一致性分析   │   │  任务分解     │                │
│  └──────────────┘   └──────────────┘   └──────────────┘                │
│         │                                     │                         │
│         ▼                                     ▼                         │
│  ┌──────────────┐                    ┌──────────────┐                  │
│  │  Checklist   │                    │  Implement   │                  │
│  │  质量清单     │ ←────────────────── │   开始实现    │                  │
│  └──────────────┘                    └──────────────┘                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Speckit 命令一览

| 命令 | 用途 | 阶段 |
|------|------|------|
| `/speckit.constitution` | 建立项目原则和开发准则 | 基础 |
| `/speckit.specify` | 创建功能规格说明书 | 基础 |
| `/speckit.clarify` | 通过提问澄清需求中的模糊点 | 基础 |
| `/speckit.plan` | 制定技术栈和架构规划 | 实现 |
| `/speckit.analyze` | 跨文档一致性和覆盖率分析 | 实现 |
| `/speckit.tasks` | 将规划分解为可执行的任务 | 实现 |
| `/speckit.implement` | 执行任务，生成代码 | 实现 |
| `/speckit.checklist` | 生成质量检查清单 | 验证 |

---

## 📚 演示结构

本项目通过 Git 提交历史展示 Speckit 的完整使用流程。每个提交对应一个 Speckit 功能的演示：

### Git 提交历史

| Commit | 演示功能 | 说明 |
|--------|---------|------|
| `commit-01` | 🏗️ 项目初始化 | `specify init` - 初始化 Speckit 项目结构 |
| `commit-02` | 📜 /speckit.constitution | 建立项目原则：代码质量、测试标准、用户体验 |
| `commit-03` | 📝 /speckit.specify | 创建数独游戏的功能规格说明书 |
| `commit-04` | ❓ /speckit.clarify | 澄清需求中的 5 个关键问题 |
| `commit-05` | 🔧 /speckit.plan | 制定 Vue + Nuxt 技术架构方案 |
| `commit-06` | 🔍 /speckit.analyze | 验证规格、计划、任务的一致性 |
| `commit-07` | ✅ /speckit.tasks | 生成详细的任务分解清单 |
| `commit-08` | 💻 /speckit.implement | 实现核心游戏逻辑 |
| `commit-09` | 🎨 /speckit.implement | 实现 UI 组件和交互 |
| `commit-10` | 🖨️ /speckit.implement | 实现打印和响应式功能 |
| `commit-11` | ✔️ /speckit.checklist | 最终质量验证清单 |

### 如何浏览演示

```bash
# 查看所有演示步骤
git log --oneline

# 切换到特定步骤
git checkout <commit-hash>

# 查看某个步骤的变更
git show <commit-hash>

# 比较两个步骤之间的差异
git diff <commit-1> <commit-2>
```

---

## 🚀 快速开始

### 前提条件

- Node.js 18+
- pnpm（推荐）或 npm
- Git
- [Specify CLI](https://github.com/github/spec-kit) (可选，用于自己体验 Speckit)

### 安装 Specify CLI

```bash
# 使用 uv 安装（推荐）
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 或使用 uvx 一次性运行
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
```

### 运行项目

```bash
# 克隆项目
git clone <repository-url>
cd speckit-demo

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

---

## 📁 项目结构

```
speckit-demo/
├── .specify/                    # Speckit 配置和模板
│   ├── templates/               # 文档模板
│   ├── scripts/                 # 辅助脚本
│   └── memory/                  # AI 记忆存储
├── .windsurf/                   # Windsurf AI 助手配置
│   └── workflows/               # Speckit 工作流定义
├── specs/                       # 规格文档（由 Speckit 生成）
│   ├── constitution.md          # 项目原则
│   ├── 001-sudoku-game/         # 功能规格目录
│   │   ├── spec.md              # 功能规格说明
│   │   ├── plan.md              # 技术实现计划
│   │   ├── tasks.md             # 任务分解
│   │   └── checklist.md         # 质量清单
├── src/                         # 源代码
│   ├── components/              # Vue 组件
│   ├── composables/             # 组合式函数
│   ├── pages/                   # 页面
│   └── utils/                   # 工具函数
├── public/                      # 静态资源
├── README.md                    # 本文件
├── nuxt.config.ts               # Nuxt 配置
├── tailwind.config.js           # Tailwind 配置
└── package.json                 # 项目依赖
```

---

## 🎓 学习资源

- [Spec Kit 官方文档](https://speckit.org/)
- [GitHub Spec Kit 仓库](https://github.com/github/spec-kit)
- [规格驱动开发详细指南](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [Spec Kit 视频教程](https://www.youtube.com/watch?v=example)

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

> 💡 **提示**：本项目是 Speckit 的学习演示项目。在实际项目中，你可以根据需要灵活使用 Speckit 的各个命令，不必严格按照本演示的顺序执行。
