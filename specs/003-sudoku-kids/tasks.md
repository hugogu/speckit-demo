# Tasks: 儿童数独游戏

**Input**: Design documents from `/specs/003-sudoku-kids/`
**Prerequisites**: plan.md (tech stack, structure), spec.md (6 user stories with priorities), data-model.md (5 entities)

**Tests**: NOT requested in spec.md - tests are optional and not included

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Vue 3 + TypeScript project with Vite in sudoku-kids/
- [ ] T002 [P] Configure package.json with dependencies (Vue 3, Pinia, jsPDF, Vitest, Playwright)
- [ ] T003 [P] Configure vite.config.ts with TypeScript and build settings
- [ ] T004 [P] Configure tsconfig.json for Vue 3 TypeScript compilation
- [ ] T005 [P] Create project directory structure per plan.md (components/, composables/, utils/, stores/, assets/, tests/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create TypeScript type definitions in sudoku-kids/src/types/index.ts (Puzzle, GameSession, GameHistory, TimerState, PrintConfig)
- [ ] T007 [P] Implement LocalStorage utilities in sudoku-kids/src/utils/storage.ts (save, load, remove operations)
- [ ] T008 [P] Create Pinia store structure in sudoku-kids/src/stores/gameStore.ts (game state management)
- [ ] T009 [P] Create Pinia store structure in sudoku-kids/src/stores/historyStore.ts (history state management)
- [ ] T010 Create base CSS styles in sudoku-kids/src/assets/styles/main.css (variables, reset, typography)
- [ ] T011 Create root App.vue in sudoku-kids/src/App.vue with basic layout structure
- [ ] T012 Create main.ts entry point in sudoku-kids/src/main.ts (Vue app initialization)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 玩数独游戏 (Priority: P1) 🎯 MVP

**Goal**: Generate valid Sudoku puzzles with configurable difficulty and board size, allow users to fill numbers with automatic error checking

**Independent Test**: Load game, select difficulty/board size, complete puzzle with automatic validation, verify victory animation

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implement Sudoku generator algorithm in sudoku-kids/src/utils/sudokuGenerator.ts (generate valid solution, create puzzle with hints)
- [ ] T014 [P] [US1] Create Puzzle type utilities in sudoku-kids/src/utils/puzzleUtils.ts (validate solution, check conflicts)
- [ ] T015 [US1] Create useSudoku composable in sudoku-kids/src/composables/useSudoku.ts (game logic, board state, validation)
- [ ] T016 [US1] Create PuzzleBoard component in sudoku-kids/src/components/PuzzleBoard/PuzzleBoard.vue (render board grid)
- [ ] T017 [US1] Create Cell component in sudoku-kids/src/components/Cell/Cell.vue (individual cell with pre-filled/user-filled states)
- [ ] T018 [US1] Create VictoryModal component in sudoku-kids/src/components/VictoryModal/VictoryModal.vue (celebration animation)
- [ ] T019 [US1] Integrate components into App.vue for complete game flow (select difficulty → generate puzzle → play → victory)

**Checkpoint**: User Story 1 complete - basic Sudoku game with validation and victory animation works

---

## Phase 4: User Story 2 - 多种输入方式 (Priority: P1)

**Goal**: Support both click and drag-and-drop interactions for number input

**Independent Test**: Complete puzzle using only click interaction, then complete another using only drag-and-drop

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create useDragDrop composable in sudoku-kids/src/composables/useDragDrop.ts (drag start, drag over, drop handlers)
- [ ] T021 [P] [US2] Create NumberSelector component in sudoku-kids/src/components/NumberSelector/NumberSelector.vue (draggable numbers 1-N)
- [ ] T022 [US2] Update Cell component to support click-to-select and drag-drop targets in sudoku-kids/src/components/Cell/Cell.vue
- [ ] T023 [US2] Update PuzzleBoard component to coordinate drag-drop state in sudoku-kids/src/components/PuzzleBoard/PuzzleBoard.vue
- [ ] T024 [US2] Add touch support for mobile drag operations in useDragDrop composable

**Checkpoint**: User Story 2 complete - both click and drag-drop interactions work independently

---

## Phase 5: User Story 3 - 响应式游戏体验 (Priority: P1)

**Goal**: Responsive layout adapts to desktop and mobile screen sizes with appropriate touch targets

**Independent Test**: Open game on desktop (verify mouse-optimized layout), open on mobile (verify touch-optimized layout)

### Implementation for User Story 3

- [ ] T025 [P] [US3] Create responsive CSS in sudoku-kids/src/assets/styles/responsive.css (media queries for breakpoints)
- [ ] T026 [P] [US3] Update Cell component with responsive touch targets (min 44x44px) in sudoku-kids/src/components/Cell/Cell.vue
- [ ] T027 [US3] Update PuzzleBoard component with responsive grid layout in sudoku-kids/src/components/PuzzleBoard/PuzzleBoard.vue
- [ ] T028 [US3] Update NumberSelector component with responsive layout in sudoku-kids/src/components/NumberSelector/NumberSelector.vue
- [ ] T029 [US3] Update App.vue with responsive container structure in sudoku-kids/src/App.vue

**Checkpoint**: User Story 3 complete - game works on both desktop and mobile with appropriate layouts

---

## Phase 6: User Story 4 - 打印谜题用于离线练习 (Priority: P2)

**Goal**: Generate printable PDF with multiple Sudoku puzzles per page

**Independent Test**: Generate PDF, verify puzzles print correctly on paper

### Implementation for User Story 4

- [ ] T030 [P] [US4] Implement PDF generator utility in sudoku-kids/src/utils/pdfGenerator.ts (jsPDF integration, puzzle layout)
- [ ] T031 [P] [US4] Create PrintConfig type and validation in sudoku-kids/src/types/index.ts
- [ ] T032 [US4] Create PrintControls component in sudoku-kids/src/components/PrintControls/PrintControls.vue (print options UI)
- [ ] T033 [US4] Add print functionality to App.vue in sudoku-kids/src/App.vue (trigger PDF generation and print)

**Checkpoint**: User Story 4 complete - printable PDF generation works independently

---

## Phase 7: User Story 5 - 追踪学习进度 (Priority: P2)

**Goal**: Track and display game history including duration, error counts, and board states

**Independent Test**: Complete multiple games, verify history records accurate data including board states

### Implementation for User Story 5

- [ ] T034 [P] [US5] Implement GameSession persistence in historyStore.ts in sudoku-kids/src/stores/historyStore.ts (save/load sessions)
- [ ] T035 [P] [US5] Add statistics calculation (totals, averages) in historyStore.ts
- [ ] T036 [US5] Create GameHistory component in sudoku-kids/src/components/GameHistory/GameHistory.vue (display session list)
- [ ] T037 [US5] Create HistoryDetail component in sudoku-kids/src/components/HistoryDetail/HistoryDetail.vue (show saved board state)
- [ ] T038 [US5] Integrate history display into App.vue in sudoku-kids/src/App.vue

**Checkpoint**: User Story 5 complete - game history tracking and display works independently

---

## Phase 8: User Story 6 - 实时计时器显示 (Priority: P2)

**Goal**: Display real-time timer during gameplay with pause/resume functionality

**Independent Test**: Start puzzle, verify timer increments, pause and resume, verify accurate duration on completion

### Implementation for User Story 6

- [ ] T039 [P] [US6] Implement useTimer composable in sudoku-kids/src/composables/useTimer.ts (start, pause, resume, elapsed tracking)
- [ ] T040 [P] [US6] Create Timer component in sudoku-kids/src/components/Timer/Timer.vue (display elapsed time)
- [ ] T041 [US6] Integrate timer into game flow in useSudoku composable in sudoku-kids/src/composables/useSudoku.ts
- [ ] T042 [US6] Add timer display to App.vue in sudoku-kids/src/App.vue

**Checkpoint**: User Story 6 complete - real-time timer works independently

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T043 [P] Add auto-save game state on page refresh in sudoku-kids/src/stores/gameStore.ts
- [ ] T044 [P] Implement error handling with user-friendly messages in sudoku-kids/src/utils/errorHandler.ts
- [ ] T045 Add loading states for puzzle generation in sudoku-kids/src/components/PuzzleBoard/PuzzleBoard.vue
- [ ] T046 [P] Optimize animations for 60fps performance in sudoku-kids/src/assets/styles/animations.css
- [ ] T047 Add keyboard navigation support for accessibility in sudoku-kids/src/components/Cell/Cell.vue
- [ ] T048 Create index.html entry point in sudoku-kids/index.html

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - P1 stories (US1, US2, US3) can proceed in parallel after Foundational
  - P2 stories (US4, US5, US6) can proceed in parallel after Foundational
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories - MVP core
- **User Story 2 (P1)**: Can start after Foundational - Uses Cell component from US1
- **User Story 3 (P1)**: Can start after Foundational - Uses components from US1/US2
- **User Story 4 (P2)**: Can start after Foundational - Independent of other stories
- **User Story 5 (P2)**: Can start after Foundational - Uses historyStore from Foundational
- **User Story 6 (P2)**: Can start after Foundational - Uses useTimer composable

### Within Each User Story

- Models before services
- Services before components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational is done:
  - Developer A: User Story 1 (core game)
  - Developer B: User Story 2 (input modes)
  - Developer C: User Story 3 (responsive)
- P2 stories can be done in parallel after Foundational
- All tasks marked [P] within a story can run in parallel

---

## Parallel Example: User Story 1

```bash
# These tasks can run in parallel for User Story 1:
Task: "Implement Sudoku generator algorithm in sudoku-kids/src/utils/sudokuGenerator.ts"
Task: "Create Puzzle type utilities in sudoku-kids/src/utils/puzzleUtils.ts"
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
3. Add User Story 2 + User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 + User Story 5 + User Story 6 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (core game logic)
   - Developer B: User Story 2 + User Story 3 (input + responsive)
   - Developer C: User Story 4 + User Story 5 + User Story 6 (print + history + timer)
3. Stories complete and integrate independently

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 48 |
| **Phase 1 (Setup)** | 5 tasks |
| **Phase 2 (Foundational)** | 7 tasks |
| **Phase 3 (US1 - Play Game)** | 7 tasks |
| **Phase 4 (US2 - Input Modes)** | 5 tasks |
| **Phase 5 (US3 - Responsive)** | 5 tasks |
| **Phase 6 (US4 - Print)** | 4 tasks |
| **Phase 7 (US5 - History)** | 5 tasks |
| **Phase 8 (US6 - Timer)** | 4 tasks |
| **Phase 9 (Polish)** | 6 tasks |

| User Story | Priority | Task Count | Independent Test |
|------------|----------|------------|------------------|
| US1: Play Sudoku | P1 | 7 | Complete puzzle with validation |
| US2: Input Modes | P1 | 5 | Click-only + drag-drop-only completions |
| US3: Responsive | P1 | 5 | Desktop + mobile layouts |
| US4: Print | P2 | 4 | Generate and verify PDF |
| US5: History | P2 | 5 | Complete games, verify history data |
| US6: Timer | P2 | 4 | Start, pause, resume, verify duration |

**Parallel Opportunities**:
- All [P] tasks within each phase can run in parallel
- P1 stories (US1, US2, US3) can run in parallel after Foundational
- P2 stories (US4, US5, US6) can run in parallel after Foundational

**Suggested MVP Scope**: User Story 1 only (Phases 1-3, T001-T019)
- Core Sudoku game with puzzle generation, validation, and victory animation
- Validates tech stack and core game mechanics before adding features

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
