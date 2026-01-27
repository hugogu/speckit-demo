# speckit-demo Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-27

## Active Technologies

- TypeScript 5.x, Node.js 20.x LTS + Vue 3.4+, Nuxt 3.x, TailwindCSS 3.x, Pinia 2.x (001-sudoku-game)
- Browser localStorage (001-sudoku-game)

## Project Structure

```text
src/
├── components/
│   ├── game/           # 游戏相关组件
│   ├── history/        # 历史记录组件
│   ├── print/          # 打印功能组件
│   └── ui/             # 通用 UI 组件
├── composables/        # 可复用逻辑
├── stores/             # Pinia 状态管理
├── pages/              # Nuxt 页面路由
├── types/              # TypeScript 类型
└── utils/              # 工具函数

tests/
├── unit/
└── e2e/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript: Follow standard conventions
- 使用 ESLint + Prettier 配置
- 组件独立、可复用、有明确的 Props/Events 接口
- 使用 TypeScript 严格模式

## Recent Changes

- 001-sudoku-game: Added TypeScript 5.x, Node.js 20.x LTS + Vue 3.4+, Nuxt 3.x, TailwindCSS 3.x, Pinia 2.x

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
