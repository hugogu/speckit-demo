# Quickstart: 数独学习游戏

**Feature**: 001-sudoku-game  
**Date**: 2026-01-27

## Prerequisites

- Node.js 20.x LTS
- pnpm 8.x (recommended) or npm 10.x

## Setup

```bash
# Clone and enter project
git clone <repo-url>
cd speckit-demo
git checkout 001-sudoku-game

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

访问 http://localhost:3000 查看应用。

## Project Structure

```
src/
├── components/          # Vue 组件
│   ├── game/           # 游戏相关组件
│   ├── history/        # 历史记录组件
│   ├── print/          # 打印功能组件
│   └── ui/             # 通用 UI 组件
├── composables/        # 可复用逻辑
├── stores/             # Pinia 状态管理
├── pages/              # Nuxt 页面路由
├── types/              # TypeScript 类型
└── utils/              # 工具函数
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产构建 |
| `pnpm test` | 运行单元测试 |
| `pnpm test:e2e` | 运行 E2E 测试 |
| `pnpm lint` | 代码检查 |
| `pnpm typecheck` | TypeScript 类型检查 |

## Development Workflow

### 1. 游戏核心逻辑

核心逻辑位于 `composables/`:

- `useSudokuGenerator.ts` - 生成数独题目
- `useSudokuValidator.ts` - 验证填入数字
- `useDragAndDrop.ts` - 拖拽交互
- `useGameTimer.ts` - 计时器

### 2. 状态管理

使用 Pinia stores (`stores/`):

- `game.ts` - 当前游戏状态
- `history.ts` - 历史记录
- `settings.ts` - 用户设置

### 3. 页面路由

Nuxt 文件路由 (`pages/`):

- `/` - 游戏主页
- `/history` - 历史记录
- `/print` - 打印页面
- `/settings` - 设置页面

## Testing

```bash
# 单元测试 (Vitest)
pnpm test

# 带覆盖率
pnpm test:coverage

# E2E 测试 (Playwright)
pnpm test:e2e

# E2E 测试 UI 模式
pnpm test:e2e:ui
```

## Build & Deploy

```bash
# 生产构建
pnpm build

# 预览构建结果
pnpm preview

# 生成静态站点 (SSG)
pnpm generate
```

构建产物位于 `.output/` 目录，可部署到任何静态托管服务。

## PWA / Offline

应用支持 PWA 离线使用：

1. 首次访问后自动缓存资源
2. 离线状态下可正常游戏
3. 游戏记录保存在 localStorage

## Troubleshooting

### 开发服务器启动失败

```bash
# 清除缓存重试
rm -rf node_modules .nuxt
pnpm install
pnpm dev
```

### TypeScript 类型错误

```bash
# 重新生成类型
pnpm nuxi prepare
```

### 测试失败

```bash
# 更新快照
pnpm test -u
```

