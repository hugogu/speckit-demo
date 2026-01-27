# Tasks: 数独学习游戏

**Input**: Design documents from `/specs/001-sudoku-game/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: 根据 Constitution 要求，核心游戏逻辑需要单元测试覆盖。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure (Nuxt 3 web application):

- **Source**: `src/` at repository root
- **Docker**: `Dockerfile`, `nginx.conf`, `.dockerignore` at repository root
- **Scripts**: `scripts/` at repository root
- **Components**: `src/components/{game,history,print,ui}/`
- **Composables**: `src/composables/`
- **Stores**: `src/stores/`
- **Pages**: `src/pages/`
- **Types**: `src/types/`
- **Utils**: `src/utils/`
- **Tests**: `tests/{unit,e2e}/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Nuxt 3 + Vue 3 + TailwindCSS + Pinia setup

- [ ] T001 Initialize Nuxt 3 project with TypeScript in repository root
- [ ] T002 Install and configure TailwindCSS 3.x in nuxt.config.ts
- [ ] T003 [P] Install and configure Pinia 2.x for state management
- [ ] T004 [P] Install and configure @vite-pwa/nuxt for offline support
- [ ] T005 [P] Configure ESLint + Prettier per constitution standards
- [ ] T006 [P] Setup Vitest for unit testing in vitest.config.ts
- [ ] T007 [P] Setup Playwright for E2E testing in playwright.config.ts
- [ ] T008 Create project directory structure per plan.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, utilities, and shared infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Define TypeScript types for Game, Board, Cell, GameRecord, Settings in src/types/index.ts
- [ ] T010 [P] Define difficulty presets (PREFILLED_COUNTS) in src/types/index.ts
- [ ] T011 [P] Define print configuration (PRINT_COUNTS) in src/types/index.ts
- [ ] T012 [P] Define storage keys constants in src/types/index.ts
- [ ] T013 Implement localStorage wrapper with LRU eviction in src/utils/storage.ts
- [ ] T014 [P] Implement sudoku generator algorithm (backtracking) in src/composables/useSudokuGenerator.ts
- [ ] T015 [P] Implement sudoku validator logic in src/composables/useSudokuValidator.ts
- [ ] T016 Unit test for sudoku generator in tests/unit/sudoku-generator.test.ts
- [ ] T017 Unit test for sudoku validator in tests/unit/sudoku-validator.test.ts
- [ ] T018 Create base UI components: Button.vue in src/components/ui/Button.vue
- [ ] T019 [P] Create base UI components: Modal.vue in src/components/ui/Modal.vue
- [ ] T020 [P] Create base UI components: Select.vue in src/components/ui/Select.vue

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 开始并完成一局数独游戏 (Priority: P1) 🎯 MVP

**Goal**: 用户可以选择难度和棋盘大小，开始一局数独游戏，填入数字并获得即时反馈，完成游戏后看到胜利提示

**Independent Test**: 选择 4×4 简单难度 → 开始游戏 → 填入数字 → 看到对错反馈 → 完成游戏 → 看到胜利提示和用时

### Implementation for User Story 1

- [ ] T021 [US1] Create game store with state management in src/stores/game.ts
- [ ] T022 [P] [US1] Implement game timer composable in src/composables/useGameTimer.ts
- [ ] T023 [US1] Create SudokuCell component with click interaction in src/components/game/SudokuCell.vue
- [ ] T024 [US1] Create SudokuBoard component (grid layout) in src/components/game/SudokuBoard.vue
- [ ] T025 [US1] Create NumberPad component for digit selection in src/components/game/NumberPad.vue
- [ ] T026 [US1] Create GameTimer component display in src/components/game/GameTimer.vue
- [ ] T027 [US1] Create GameControls component (new game, pause) in src/components/game/GameControls.vue
- [ ] T028 [US1] Create victory modal with stats in src/components/game/VictoryModal.vue
- [ ] T029 [US1] Implement game page with difficulty/size selection in src/pages/index.vue
- [ ] T030 [US1] Add instant feedback animations (correct/error) in SudokuCell.vue
- [ ] T031 [US1] Add error auto-revert logic with friendly animation
- [ ] T032 [US1] Unit test for game store in tests/unit/stores/game.test.ts

**Checkpoint**: User Story 1 complete - core game is fully playable with click interaction

---

## Phase 4: User Story 2 - 使用拖拽方式填入数字 (Priority: P1)

**Goal**: 用户可以通过拖拽数字到格子的方式填写数独，拖拽过程有视觉反馈

**Independent Test**: 从数字面板拖拽数字 5 → 经过格子时看到高亮 → 放入格子 → 数字填入并验证

### Implementation for User Story 2

- [ ] T033 [US2] Implement drag and drop composable in src/composables/useDragAndDrop.ts
- [ ] T034 [US2] Add drag source behavior to NumberPad.vue
- [ ] T035 [US2] Add drop target behavior to SudokuCell.vue
- [ ] T036 [US2] Add drag-over highlight styling to SudokuCell.vue
- [ ] T037 [US2] Add touch event support for mobile drag in useDragAndDrop.ts
- [ ] T038 [US2] Unit test for drag and drop composable in tests/unit/composables/useDragAndDrop.test.ts

**Checkpoint**: User Story 2 complete - both click and drag interactions work seamlessly

---

## Phase 5: User Story 3 - 查看游戏历史记录 (Priority: P2)

**Goal**: 用户可以查看已完成游戏的历史记录，包含详细信息和筛选功能

**Independent Test**: 完成几局游戏 → 打开历史页面 → 看到记录列表 → 点击查看详情 → 按难度筛选

### Implementation for User Story 3

- [ ] T039 [US3] Create history store for records management in src/stores/history.ts
- [ ] T040 [US3] Integrate game completion with history store (save record)
- [ ] T041 [US3] Create HistoryList component in src/components/history/HistoryList.vue
- [ ] T042 [US3] Create HistoryDetail component in src/components/history/HistoryDetail.vue
- [ ] T043 [US3] Create HistoryFilter component (difficulty, date) in src/components/history/HistoryFilter.vue
- [ ] T044 [US3] Implement history page in src/pages/history.vue
- [ ] T045 [US3] Unit test for history store in tests/unit/stores/history.test.ts

**Checkpoint**: User Story 3 complete - game records are saved and viewable

---

## Phase 6: User Story 4 - 打印数独练习题 (Priority: P2)

**Goal**: 用户可以选择棋盘大小和难度，生成多个题目的打印预览，并打印到纸上

**Independent Test**: 选择 9×9 困难 → 生成 4 个题目 → 查看打印预览 → 点击打印 → 调用系统打印

### Implementation for User Story 4

- [ ] T046 [US4] Implement print utility functions in src/utils/print.ts
- [ ] T047 [US4] Create PrintLayout component with CSS Grid in src/components/print/PrintLayout.vue
- [ ] T048 [US4] Create PrintPreview component in src/components/print/PrintPreview.vue
- [ ] T049 [US4] Create print page with options in src/pages/print.vue
- [ ] T050 [US4] Add @media print styles for optimized printing
- [ ] T051 [US4] Ensure minimum cell size 1cm x 1cm per SC-005

**Checkpoint**: User Story 4 complete - users can print practice sheets

---

## Phase 7: User Story 5 - 在不同设备上无缝使用 (Priority: P2)

**Goal**: 游戏在 PC 和移动端都有良好体验，触摸目标足够大，布局自适应

**Independent Test**: 在 PC 调整窗口大小 → 布局自适应 → 在手机模拟器测试 → 横竖屏切换正常

### Implementation for User Story 5

- [ ] T052 [US5] Add responsive breakpoints to all game components
- [ ] T053 [US5] Ensure touch targets >= 44x44px on mobile (min-w-11 min-h-11)
- [ ] T054 [US5] Add landscape/portrait layout variants to SudokuBoard.vue
- [ ] T055 [US5] Add responsive layout to NumberPad.vue
- [ ] T056 [US5] E2E test for responsive behavior in tests/e2e/responsive.spec.ts

**Checkpoint**: User Story 5 complete - app works well on all devices

---

## Phase 8: User Story 6 - 自定义游戏设置 (Priority: P3)

**Goal**: 用户可以设置默认棋盘大小和难度，设置持久化保存

**Independent Test**: 打开设置 → 修改默认难度 → 关闭应用 → 重新打开 → 设置保留

### Implementation for User Story 6

- [ ] T057 [US6] Create settings store with persistence in src/stores/settings.ts
- [ ] T058 [US6] Create settings page in src/pages/settings.vue
- [ ] T059 [US6] Integrate settings with game initialization
- [ ] T060 [US6] Add game resume prompt (continue or new game) on app open
- [ ] T061 [US6] Unit test for settings store in tests/unit/stores/settings.test.ts

**Checkpoint**: User Story 6 complete - user preferences are saved

---

## Phase 9: Docker Deployment (Priority: P2)

**Goal**: 提供 Docker 部署支持，包括 Dockerfile 和构建脚本

**Independent Test**: 运行构建脚本 → 生成 Docker 镜像 → 启动容器 → 访问应用正常

### Implementation for Docker Deployment

- [ ] T062 [P] Create multi-stage Dockerfile in Dockerfile
- [ ] T063 [P] Create nginx configuration for SPA routing in nginx.conf
- [ ] T064 Create Docker build script with version tagging in scripts/docker-build.sh
- [ ] T065 Create .dockerignore file to exclude unnecessary files
- [ ] T066 Add Docker deployment documentation to README.md
- [ ] T067 Verify Docker image size < 50MB per FR-035

**Checkpoint**: Docker deployment ready - app can be deployed via Docker

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T068 [P] Add WCAG AA color contrast validation to all components
- [ ] T069 [P] Add keyboard navigation support per FR-023
- [ ] T070 [P] Add Chinese/English language support per constitution
- [ ] T071 [P] Configure PWA manifest (name, icons, theme color)
- [ ] T072 [P] Add service worker for offline caching
- [ ] T073 E2E test for complete game flow in tests/e2e/game-flow.spec.ts
- [ ] T074 Performance optimization: ensure < 1s first load (3G)
- [ ] T075 Run quickstart.md validation
- [ ] T076 Final code cleanup and documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 and US2 are both P1, can run in parallel
  - US3, US4, US5 are P2, can run in parallel after US1/US2
  - US6 is P3, can start after Foundational
- **Docker (Phase 9)**: Can start after Setup - independent of user stories
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Enhances US1 but independently testable
- **User Story 3 (P2)**: Depends on game completion logic from US1 (T040 integrates with game store)
- **User Story 4 (P2)**: Can start after Foundational - Uses generator from Foundational
- **User Story 5 (P2)**: Can start after US1 - Applies responsive styles to existing components
- **User Story 6 (P3)**: Can start after Foundational - Integrates with game initialization

### Within Each User Story

- Models/Types before services/composables
- Composables before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:
- T003, T004, T005, T006, T007 can all run in parallel

**Phase 2 (Foundational)**:
- T010, T011, T012 can run in parallel (type definitions)
- T014, T015 can run in parallel (composables)
- T016, T017 can run in parallel (tests)
- T018, T019, T020 can run in parallel (UI components)

**Phase 3+ (User Stories)**:
- US1 and US2 can be developed in parallel by different developers
- US3, US4, US5 can be developed in parallel after US1/US2

---

## Parallel Example: Phase 2 Foundational

```bash
# Launch type definitions in parallel:
Task: "Define difficulty presets in src/types/index.ts"
Task: "Define print configuration in src/types/index.ts"
Task: "Define storage keys in src/types/index.ts"

# Launch composables in parallel:
Task: "Implement sudoku generator in src/composables/useSudokuGenerator.ts"
Task: "Implement sudoku validator in src/composables/useSudokuValidator.ts"

# Launch UI components in parallel:
Task: "Create Button.vue in src/components/ui/Button.vue"
Task: "Create Modal.vue in src/components/ui/Modal.vue"
Task: "Create Select.vue in src/components/ui/Select.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - users can play basic sudoku with click interaction

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (enhanced interaction)
4. Add User Story 3 → Test independently → Deploy/Demo (history tracking)
5. Add User Story 4 → Test independently → Deploy/Demo (print support)
6. Add User Story 5 → Test independently → Deploy/Demo (mobile optimized)
7. Add User Story 6 → Test independently → Deploy/Demo (customization)
8. Polish phase → Final release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (core game)
   - Developer B: User Story 2 (drag interaction)
3. After US1/US2:
   - Developer A: User Story 3 (history)
   - Developer B: User Story 4 (print)
   - Developer C: User Story 5 (responsive)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution requires: child-friendly UI, responsive design, dual interaction, instant feedback
- All interactive elements must be >= 44x44px on mobile
- localStorage limit: 100 records with LRU eviction
