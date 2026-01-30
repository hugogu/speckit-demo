# Tasks: 数独学习游戏

**Input**: Design documents from `/specs/001-sudoku-learning-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize TypeScript project with Vue 3 + Nuxt 3 dependencies
- [ ] T003 [P] Configure ESLint and Prettier for code quality
- [ ] T004 [P] Setup Tailwind CSS with responsive design configuration
- [ ] T005 [P] Configure Vitest for unit testing
- [ ] T006 [P] Configure Playwright for E2E testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create TypeScript type definitions in app/types/index.ts
- [ ] T008 [P] Implement Sudoku generator composable in app/composables/useSudokuGenerator.ts
- [ ] T009 [P] Implement Sudoku validator composable in app/composables/useSudokuValidator.ts
- [ ] T010 [P] Create base UI components (Button, Select) in app/components/ui/
- [ ] T011 Setup localStorage utility functions in app/utils/storage.ts
- [ ] T012 Configure routing structure in app/pages/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 基础数独游戏 (Priority: P1) 🎯 MVP

**Goal**: 用户可以开始一个数独游戏，选择不同的棋盘大小和难度级别，在棋盘上填入数字并完成游戏

**Independent Test**: 用户选择4×4简单难度 → 开始游戏 → 填入正确数字 → 完成游戏 → 显示胜利提示

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create Game store in app/stores/game.ts
- [ ] T014 [P] [US1] Create SudokuBoard component in app/components/game/SudokuBoard.vue
- [ ] T015 [P] [US1] Create SudokuCell component in app/components/game/SudokuCell.vue
- [ ] T016 [P] [US1] Create NumberPad component in app/components/game/NumberPad.vue
- [ ] T017 [US1] Implement game initialization logic in Game store
- [ ] T018 [US1] Create main page in app/pages/index.vue with game setup and board
- [ ] T019 [US1] Add number input handling (click)
- [ ] T020 [US1] Implement game completion detection
- [ ] T021 [US1] Create victory modal in app/components/game/VictoryModal.vue

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 多种交互方式 (Priority: P1)

**Goal**: 用户可以通过点击或拖拽的方式在棋盘上填入数字

**Independent Test**: 用户选择一个格子 → 通过点击数字面板上的数字填入 → 选择另一个格子 → 通过拖拽数字面板上的数字到格子中填入

### Implementation for User Story 2

- [ ] T022 [P] [US2] Implement drag and drop composable in app/composables/useDragAndDrop.ts
- [ ] T023 [US2] Add drag and drop support to SudokuCell component
- [ ] T024 [US2] Add drag and drop support to NumberPad component
- [ ] T025 [US2] Integrate drag and drop with game logic in Game store

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 游戏计时和统计 (Priority: P1)

**Goal**: 游戏过程中显示计时器，记录游戏用时、填错次数和步数

**Independent Test**: 用户开始游戏 → 等待30秒 → 检查计时器显示 → 故意填错一个数字 → 检查错误计数 → 填入几个正确数字 → 检查步数计数

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create Timer component in app/components/game/Timer.vue
- [ ] T027 [P] [US3] Create GameControls component in app/components/game/GameControls.vue
- [ ] T028 [US3] Implement timer logic in Game store
- [ ] T029 [US3] Add error counting and move counting to Game store
- [ ] T030 [US3] Display statistics in main page

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - 游戏历史记录 (Priority: P2)

**Goal**: 用户可以查看已完成游戏的历史记录，包括棋盘大小、难度、用时、错误次数等信息

**Independent Test**: 用户完成一局游戏 → 打开历史记录页面 → 查看刚刚完成的游戏记录

### Implementation for User Story 4

- [ ] T031 [P] [US4] Create History store in app/stores/history.ts
- [ ] T032 [P] [US4] Create HistoryList component in app/components/history/HistoryList.vue
- [ ] T033 [P] [US4] Create HistoryDetail component in app/components/history/HistoryDetail.vue
- [ ] T034 [US4] Create history page in app/pages/history.vue
- [ ] T035 [US4] Implement game record saving logic
- [ ] T036 [US4] Add game record listing functionality

**Checkpoint**: User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - 打印练习题 (Priority: P2)

**Goal**: 用户可以生成并打印数独练习题，支持自定义棋盘大小和难度

**Independent Test**: 用户选择9×9困难难度 → 生成4个题目 → 查看打印预览 → 点击打印 → 调用系统打印功能

### Implementation for User Story 5

- [ ] T037 [P] [US5] Create print utility functions in app/utils/print.ts
- [ ] T038 [P] [US5] Create PrintOptions component in app/components/print/PrintOptions.vue
- [ ] T039 [P] [US5] Create PrintPreview component in app/components/print/PrintPreview.vue
- [ ] T040 [P] [US5] Create PrintLayout component in app/components/print/PrintLayout.vue
- [ ] T041 [US5] Create print page in app/pages/print.vue
- [ ] T042 [US5] Add print generation functionality
- [ ] T043 [US5] Add print styling and layout optimization

**Checkpoint**: User Story 5 should be fully functional and testable independently

---

## Phase 8: User Story 6 - 响应式设计 (Priority: P2)

**Goal**: 游戏界面能自适应PC Web端和手机移动端的屏幕尺寸

**Independent Test**: 在桌面浏览器中打开游戏 → 检查布局和交互 → 在手机模拟器中打开游戏 → 检查布局和交互

### Implementation for User Story 6

- [ ] T044 [P] [US6] Optimize SudokuBoard for mobile touch targets
- [ ] T045 [P] [US6] Optimize NumberPad for mobile touch targets
- [ ] T046 [US6] Implement responsive layouts for all pages
- [ ] T047 [US6] Test and adjust print layout for mobile
- [ ] T048 [US6] Verify drag and drop works on touch devices

**Checkpoint**: User Story 6 should be fully functional and testable independently

---

## Phase 9: User Story 7 - 个性化设置 (Priority: P3)

**Goal**: 用户可以设置默认的棋盘大小和难度级别

**Independent Test**: 用户打开设置页面 → 修改默认棋盘大小为9×9 → 修改默认难度为专家 → 关闭并重新打开应用 → 检查默认设置已保存

### Implementation for User Story 7

- [ ] T049 [P] [US7] Create Settings store in app/stores/settings.ts
- [ ] T050 [P] [US7] Create SettingsForm component in app/components/settings/SettingsForm.vue
- [ ] T051 [US7] Create settings page in app/pages/settings.vue
- [ ] T052 [US7] Integrate settings with main page defaults
- [ ] T053 [US7] Add settings persistence to localStorage

**Checkpoint**: User Story 7 should be fully functional and testable independently

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T054 [P] Documentation updates in README.md
- [ ] T055 Code cleanup and refactoring
- [ ] T056 Performance optimization across all stories
- [ ] T057 [P] Additional unit tests in tests/unit/
- [ ] T058 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Independent of other stories

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create SudokuBoard component in app/components/game/SudokuBoard.vue"
Task: "Create SudokuCell component in app/components/game/SudokuCell.vue"
Task: "Create NumberPad component in app/components/game/NumberPad.vue"
Task: "Create Game store in app/stores/game.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
