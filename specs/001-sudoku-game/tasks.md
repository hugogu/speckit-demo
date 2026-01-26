# Tasks: 数独游戏 (Sudoku Kids)

**Input**: Design documents from `/specs/001-sudoku-game/`
**Prerequisites**: plan.md ✅, spec.md ✅, analyze-report.md ✅

**Generated**: 2026-01-26

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup (项目初始化)

**Purpose**: 创建 Nuxt 项目结构和基础配置

- [x] T001 初始化 Nuxt 3 项目: `pnpm create nuxt-app sudoku-kids`
- [x] T002 [P] 配置 TailwindCSS: `tailwind.config.js`, `nuxt.config.ts`
- [x] T003 [P] 配置 TypeScript 严格模式: `tsconfig.json`
- [x] T004 [P] 安装核心依赖: `@vueuse/core`
- [x] T005 [P] 配置测试框架: Vitest + Playwright

**Checkpoint**: 项目可运行 `pnpm dev` 显示默认页面

---

## Phase 2: Foundational (核心基础设施)

**Purpose**: 数独核心算法和类型定义，所有 UI 功能依赖此阶段

**⚠️ CRITICAL**: UI 组件开发必须在此阶段完成后开始

- [x] T006 [P] 创建类型定义: `types/sudoku.ts`
  - `BoardSize`, `Difficulty`, `Cell`, `SudokuBoard`, `GameState`
- [x] T007 [P] 实现数独求解器: `utils/sudoku-solver.ts`
  - 回溯算法验证解的唯一性
  - 行/列/宫格规则验证
- [x] T008 实现数独生成器: `utils/sudoku-generator.ts` (依赖 T007)
  - 生成完整有效解
  - 按难度移除数字 (Easy 30-40%, Medium 45-55%, Hard 60-70%)
  - 支持 4×4, 6×6, 9×9 三种尺寸
- [x] T009 [P] 编写生成器单元测试: `tests/unit/sudoku-generator.test.ts`
- [x] T010 [P] 编写求解器单元测试: `tests/unit/sudoku-solver.test.ts`

**Checkpoint**: 算法测试全部通过，可生成有效数独谜题

---

## Phase 3: User Story 1 - 开始一局数独游戏 (Priority: P1) 🎯 MVP

**Goal**: 用户可以选择难度和棋盘大小，开始一局新游戏

**Independent Test**: 访问首页 → 选择难度和大小 → 点击开始 → 显示生成的棋盘

### Implementation for US1

- [x] T011 [P] [US1] 创建游戏状态 composable: `composables/useGameState.ts`
  - 管理 `GameState` 响应式状态
  - 提供 `startNewGame(size, difficulty)` 方法
- [x] T012 [P] [US1] 创建难度选择组件: `components/setup/DifficultySelector.vue`
  - 三个难度选项: 简单/中等/困难
  - 触摸友好的按钮 (≥44×44px)
- [x] T013 [P] [US1] 创建棋盘大小选择组件: `components/setup/SizeSelector.vue`
  - 三个尺寸选项: 4×4/6×6/9×9
  - 清晰的视觉提示
- [x] T014 [US1] 创建游戏设置面板: `components/setup/GameSetup.vue` (依赖 T012, T013)
  - 组合难度和大小选择器
  - "开始游戏" 按钮
- [x] T015 [P] [US1] 创建基础按钮组件: `components/ui/BaseButton.vue`
  - 支持不同尺寸和变体
  - 触摸目标 ≥44×44px
- [x] T016 [US1] 创建首页布局: `pages/index.vue` (依赖 T011, T014)
  - 显示游戏设置或游戏棋盘
  - 响应式布局

**Checkpoint**: 用户可以选择参数并开始游戏，棋盘数据已生成（UI 显示待后续任务）

---

## Phase 4: User Story 2 - 通过点击填写数字 (Priority: P1)

**Goal**: 用户可以点击空格并选择数字填入

**Independent Test**: 点击空白格子 → 显示数字面板 → 选择数字 → 数字填入格子

### Implementation for US2

- [x] T017 [P] [US2] 创建单元格组件: `components/game/SudokuCell.vue`
  - 显示数字或空白
  - 区分预填充和用户填写样式
  - 显示错误标记状态
  - 支持点击事件
  - 键盘可访问 (tabindex, aria-label)
- [x] T018 [P] [US2] 创建数字选择面板: `components/game/NumberPad.vue`
  - 根据棋盘大小显示 1-4/1-6/1-9
  - 清除按钮
  - 触摸友好布局
- [x] T019 [US2] 创建数独棋盘组件: `components/game/SudokuBoard.vue` (依赖 T017)
  - 渲染 Cell 网格
  - 根据尺寸调整宫格边框 (2×2/2×3/3×3)
  - 响应式尺寸适配
- [x] T020 [US2] 实现点击填写逻辑: `composables/useSudoku.ts` (依赖 T011)
  - `selectCell(row, col)` 方法
  - `fillNumber(value)` 方法
  - `clearCell()` 方法
  - 禁止编辑预填充格子
- [x] T021 [US2] 集成棋盘和数字面板到首页 (依赖 T019, T018, T020)
  - 更新 `pages/index.vue`
  - 实现格子选中状态

**Checkpoint**: 用户可以通过点击完成数独游戏填写

---

## Phase 5: User Story 4 - 验证答案正确性 (Priority: P1)

**Goal**: 用户可以检查答案，错误格子被标记，全部正确时显示庆祝

**Independent Test**: 填写答案（含错误）→ 点击检查 → 错误格子高亮 → 修正后再次检查 → 庆祝动画

### Implementation for US4

- [x] T022 [P] [US4] 创建游戏控制组件: `components/game/GameControls.vue`
  - "检查答案" 按钮
  - "新游戏" 按钮
  - "打印" 按钮 (占位，P2实现)
- [x] T023 [P] [US4] 创建庆祝弹窗组件: `components/ui/CelebrationModal.vue`
  - 成功动画效果
  - 鼓励性文字
  - "再来一局" 按钮
- [x] T024 [US4] 实现验证逻辑: `composables/useSudoku.ts` 扩展
  - `checkAnswers()` 方法
  - 标记错误格子 (`cell.isError = true`)
  - 检测游戏完成状态
- [x] T025 [US4] 集成验证功能到首页 (依赖 T022, T023, T024)
  - 连接控制按钮
  - 触发庆祝弹窗

**Checkpoint**: 核心游戏循环完整 - 开始、填写、验证、庆祝

---

## Phase 6: User Story 6 - 响应式布局适配 (Priority: P1)

**Goal**: 应用在手机、平板、PC 上都有良好体验

**Independent Test**: 在不同屏幕尺寸下测试布局，验证触摸/鼠标交互

### Implementation for US6

- [x] T026 [P] [US6] 实现移动端布局: `pages/index.vue` 更新
  - <640px: 棋盘占满宽度，控制在下方
- [x] T027 [P] [US6] 实现平板布局: TailwindCSS 响应式类
  - 640-1024px: 棋盘居中，控制在侧边或下方
- [x] T028 [P] [US6] 实现桌面布局: TailwindCSS 响应式类
  - >1024px: 棋盘和控制面板并排
- [x] T029 [US6] 测试触摸交互: 所有按钮 ≥44×44px
- [x] T030 [US6] 添加屏幕旋转过渡动画

**Checkpoint**: 响应式布局完成，可在各设备上流畅使用

---

## Phase 7: User Story 3 - 通过拖拽填写数字 (Priority: P2)

**Goal**: 用户可以从数字面板拖拽数字到空格

**Independent Test**: 拖拽数字 → 目标格子高亮 → 释放 → 数字填入

### Implementation for US3

- [x] T031 [P] [US3] 实现拖拽 composable: `composables/useDragDrop.ts`
  - 使用 @vueuse/core 的拖拽相关函数
  - 支持触摸设备 (touch events)
  - 拖拽状态管理
- [x] T032 [US3] 更新数字面板支持拖拽: `components/game/NumberPad.vue`
  - 数字可拖拽
  - 拖拽时视觉反馈
- [x] T033 [US3] 更新单元格支持放置: `components/game/SudokuCell.vue`
  - 接收拖拽放置
  - 悬停时高亮提示
  - 预填充格子显示不可放置
- [x] T034 [US3] 集成拖拽功能到游戏流程
- [x] T035 [US3] 添加拖拽不支持时的降级处理
  - 检测浏览器支持
  - 隐藏拖拽相关提示

**Checkpoint**: 拖拽作为增强交互方式可用，不支持时自动降级

---

## Phase 8: User Story 5 - 打印游戏棋盘 (Priority: P2)

**Goal**: 用户可以将数独游戏打印出来供线下练习

**Independent Test**: 点击打印 → 浏览器打印预览显示优化的棋盘

### Implementation for US5

- [x] T036 [P] [US5] 创建打印样式: `assets/css/print.css`
  - 隐藏交互元素
  - 优化棋盘边框和格线
  - 清晰的数字显示
- [x] T037 [P] [US5] 实现打印工具函数: `utils/print-styles.ts`
  - 应用打印专用样式
  - 处理打印后恢复
- [x] T038 [US5] 更新游戏控制实现打印: `components/game/GameControls.vue`
  - 连接打印按钮
  - 调用 window.print()
- [x] T039 [US5] 实现批量打印功能 (最多10张)
  - 生成多个不同谜题
  - 优化多页打印布局
- [x] T040 [US5] 添加打印选项对话框
  - 选择打印当前状态还是空白棋盘
  - 选择批量打印数量

**Checkpoint**: 打印功能完成，输出清晰可读

---

## Phase 9: 游戏状态持久化 (FR-014)

**Purpose**: 刷新页面后可恢复游戏进度

- [ ] T041 [P] 实现本地存储: `composables/useLocalStorage.ts`
  - 或使用 @vueuse/core 的 `useStorage`
- [ ] T042 更新游戏状态自动保存: `composables/useGameState.ts`
  - 每次状态变化时保存
  - 页面加载时恢复
- [ ] T043 添加恢复游戏提示 UI
  - 检测到保存的游戏时询问是否恢复

**Checkpoint**: 刷新页面可恢复之前的游戏

---

## Phase 10: Polish & 质量保证

**Purpose**: 最终优化和质量检查

- [ ] T044 [P] 运行 Lighthouse 可访问性检查
  - 目标: ≥90 分
- [ ] T045 [P] 运行 Lighthouse 性能检查
  - 目标: FCP < 1.5s
- [ ] T046 [P] 添加 ARIA 标签完善可访问性
- [ ] T047 [P] 添加键盘导航完整支持
  - 方向键导航格子
  - 数字键直接输入
  - Enter 确认，Escape 取消
- [ ] T048 添加错误边界和友好错误提示
- [ ] T049 [P] 编写 E2E 测试: `tests/e2e/game-flow.spec.ts`
  - 完整游戏流程测试
- [ ] T050 代码审查和清理
  - 移除未使用代码
  - 确保类型完整
- [ ] T051 更新 README 文档
  - 使用说明
  - 开发指南

**Checkpoint**: 项目达到生产就绪状态

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS ALL UI WORK
    ↓
┌───────────────────────────────────────────────────────┐
│  Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US4)       │
│       └─────────────────────────────────┘             │
│                     ↓                                 │
│              Phase 6 (US6)                            │
│                     ↓                                 │
│  ┌─────────────────────────────────┐                 │
│  │ Phase 7 (US3)  │  Phase 8 (US5) │  (可并行)       │
│  └─────────────────────────────────┘                 │
│                     ↓                                 │
│              Phase 9 (持久化)                         │
└───────────────────────────────────────────────────────┘
    ↓
Phase 10 (Polish)
```

### 关键路径

1. T001 → T006/T007 → T008 → T011 → T019 → T020 → T024 → T026-28 → T044-51

### Parallel Opportunities

- Phase 1: T002-T005 可并行
- Phase 2: T006, T007, T009, T010 可并行
- Phase 3: T012, T013, T015 可并行
- US1/US2/US4 核心任务需顺序执行
- Phase 7 和 Phase 8 可并行
- Phase 10 多数任务可并行

---

## Task Summary

| Phase | 任务数 | 预估工时 |
|-------|--------|----------|
| 1. Setup | 5 | 1h |
| 2. Foundational | 5 | 3h |
| 3. US1 开始游戏 | 6 | 2h |
| 4. US2 点击填写 | 5 | 3h |
| 5. US4 验证答案 | 4 | 2h |
| 6. US6 响应式 | 5 | 2h |
| 7. US3 拖拽 | 5 | 3h |
| 8. US5 打印 | 5 | 2h |
| 9. 持久化 | 3 | 1h |
| 10. Polish | 8 | 3h |
| **总计** | **51** | **~22h** |
