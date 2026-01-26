# Implementation Plan: 数独游戏 (Sudoku Kids)

**Branch**: `001-sudoku-game` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-sudoku-game/spec.md`

## Summary

为小学生构建一个可自定义大小（4×4/6×6/9×9）和难度的数独游戏，支持点击和拖拽交互、答案验证、游戏状态保存和打印功能。采用 Vue 3 + Nuxt.js 技术栈，TailwindCSS 样式方案，实现响应式设计以适配 PC 和移动端。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+  
**Primary Dependencies**: 
- Vue 3.4+ (Composition API)
- Nuxt 3.x (SSG mode)
- TailwindCSS 3.x
- @vueuse/core (拖拽、存储等实用函数)

**Storage**: localStorage (客户端游戏状态持久化)  
**Testing**: Vitest (单元测试), Playwright (E2E 测试)  
**Target Platform**: 现代浏览器 (Chrome 90+, Safari 14+, Firefox 90+, Edge 90+)  
**Project Type**: Web 应用 (纯前端，SSG 部署)  
**Performance Goals**: 
- FCP < 1.5s
- 交互响应 < 100ms
- 动画 60fps

**Constraints**: 
- 离线可用（PWA 可选，核心功能不依赖网络）
- 触摸目标 ≥ 44×44px
- 无后端依赖

**Scale/Scope**: 单用户本地应用，无并发/多用户需求

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原则 | 状态 | 说明 |
|------|------|------|
| I. 用户体验优先 | ✅ 通过 | 设计围绕小学生用户，大触摸目标，友好反馈 |
| II. 响应式设计 | ✅ 通过 | TailwindCSS 响应式断点，触摸/鼠标双支持 |
| III. 可访问性 | ✅ 通过 | 键盘导航、ARIA 标签、对比度检查 |
| IV. 代码质量 | ✅ 通过 | TypeScript strict，组件化，Composables 分离逻辑 |
| V. 简洁性 | ✅ 通过 | 最小依赖，使用框架内置功能 |

## Project Structure

### Documentation (this feature)

```text
specs/001-sudoku-game/
├── spec.md              # 功能规格说明书
├── plan.md              # 本文件 - 技术实现计划
└── tasks.md             # 任务分解（由 /speckit.tasks 生成）
```

### Source Code (repository root)

```text
sudoku-kids/                    # Nuxt 项目根目录
├── nuxt.config.ts              # Nuxt 配置
├── tailwind.config.js          # TailwindCSS 配置
├── package.json                # 项目依赖
├── tsconfig.json               # TypeScript 配置
│
├── app.vue                     # 根组件
├── pages/
│   └── index.vue               # 首页（游戏主界面）
│
├── components/
│   ├── game/
│   │   ├── SudokuBoard.vue     # 数独棋盘容器
│   │   ├── SudokuCell.vue      # 单个格子组件
│   │   ├── NumberPad.vue       # 数字选择面板
│   │   └── GameControls.vue    # 游戏控制按钮（新游戏、检查、打印）
│   ├── setup/
│   │   ├── DifficultySelector.vue  # 难度选择
│   │   └── SizeSelector.vue        # 棋盘大小选择
│   └── ui/
│       ├── BaseButton.vue      # 基础按钮
│       └── CelebrationModal.vue # 完成庆祝弹窗
│
├── composables/
│   ├── useSudoku.ts            # 数独核心逻辑（生成、验证）
│   ├── useGameState.ts         # 游戏状态管理
│   ├── useDragDrop.ts          # 拖拽交互逻辑
│   └── useLocalStorage.ts      # 本地存储（可用 @vueuse）
│
├── utils/
│   ├── sudoku-generator.ts     # 数独谜题生成算法
│   ├── sudoku-solver.ts        # 数独求解器（用于生成和验证）
│   └── print-styles.ts         # 打印样式处理
│
├── types/
│   └── sudoku.ts               # TypeScript 类型定义
│
├── assets/
│   └── css/
│       └── print.css           # 打印专用样式
│
└── tests/
    ├── unit/
    │   ├── sudoku-generator.test.ts
    │   └── sudoku-solver.test.ts
    └── e2e/
        └── game-flow.spec.ts
```

**Structure Decision**: 采用标准 Nuxt 3 项目结构，单页面应用。业务逻辑通过 Composables 封装，UI 组件按功能分组（game/setup/ui）。无后端需求，采用 SSG 模式静态部署。

## Technical Design

### 核心数据模型

```typescript
// types/sudoku.ts

type BoardSize = 4 | 6 | 9;
type Difficulty = 'easy' | 'medium' | 'hard';

interface Cell {
  row: number;
  col: number;
  value: number | null;      // 1-9 或 null（空）
  isPreFilled: boolean;      // 是否为预填充（不可编辑）
  isError: boolean;          // 是否标记为错误
  notes: number[];           // 候选数字笔记（可选功能）
}

interface SudokuBoard {
  size: BoardSize;
  cells: Cell[][];           // 二维数组
  solution: number[][];      // 正确答案（用于验证）
}

interface GameState {
  board: SudokuBoard | null;
  difficulty: Difficulty;
  size: BoardSize;
  isComplete: boolean;
  startTime: number;         // 仅用于记录，不显示计时
}
```

### 算法设计

**数独生成算法** (sudoku-generator.ts):
1. 使用回溯算法生成完整的有效数独解
2. 根据难度等级移除相应数量的数字：
   - Easy: 移除 30-40%
   - Medium: 移除 45-55%
   - Hard: 移除 60-70%
3. 确保生成的谜题有唯一解

**数独验证算法** (sudoku-solver.ts):
1. 检查每行、每列、每宫格是否符合规则
2. 与预存的 solution 对比用户填写

### 响应式布局断点

```text
Mobile (<640px):     棋盘占满宽度，数字面板在下方
Tablet (640-1024px): 棋盘居中，数字面板可在侧边或下方
Desktop (>1024px):   棋盘和控制面板左右并排
```

### 拖拽实现

使用 HTML5 Drag and Drop API，配合 @vueuse/core 的 useDraggable：
- 桌面端：标准拖拽事件
- 移动端：touch 事件模拟拖拽

### 打印实现

使用 CSS @media print 和 window.print()：
- 隐藏交互元素（按钮、数字面板）
- 优化棋盘边框和格线
- 支持批量生成多个不同谜题后触发打印

## Dependencies

| 包名 | 版本 | 用途 |
|------|------|------|
| nuxt | ^3.10 | 框架 |
| vue | ^3.4 | UI 库 |
| @nuxtjs/tailwindcss | ^6.10 | 样式集成 |
| @vueuse/core | ^10.7 | 实用组合式函数 |
| vitest | ^1.2 | 单元测试 |
| @playwright/test | ^1.40 | E2E 测试 |

## Risk Assessment

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 移动端拖拽体验不佳 | 中 | 高 | 提供点击作为主要交互，拖拽为增强体验 |
| 数独生成算法性能问题 | 低 | 中 | 使用 Web Worker 异步生成 |
| 打印样式兼容性 | 中 | 低 | 测试主流浏览器，提供 PDF 导出备选 |
| localStorage 容量限制 | 低 | 低 | 仅存储当前游戏，定期清理 |

## Complexity Tracking

> 无 Constitution 违规，无需额外复杂度说明。

| 决策 | 原因 | 替代方案 |
|------|------|----------|
| 纯前端无后端 | 符合简洁性原则，游戏逻辑完全本地化 | 后端存储用户数据（过度设计） |
| SSG 而非 SSR | 无动态内容需求，部署简单 | SSR（不必要的复杂度） |
| @vueuse 而非自己实现 | 成熟库，减少代码量 | 手写所有工具函数（浪费时间） |
