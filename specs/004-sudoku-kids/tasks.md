# Tasks: 小学生数独学习游戏

**Feature**: 小学生数独学习游戏  
**Branch**: `004-sudoku-kids`  
**Generated**: 2025-02-12  
**Status**: Draft

---

## Phase 1: Project Setup

### Goal
Initialize Nuxt 3 project with all required dependencies and configuration.

### Setup Tasks

- [ ] T001 Create project directory `sudoku-kids/` and initialize with `npx nuxi@latest init`
- [ ] T002 [P] Install core dependencies: `vue@^3.4`, `@pinia/nuxt`, `tailwindcss`, `@nuxtjs/tailwindcss`
- [ ] T003 [P] Install utility dependencies: `qrcode`, `idb-keyval`, `uuid`
- [ ] T004 [P] Install dev dependencies: `vitest`, `@nuxt/test-utils`, `@playwright/test`, `eslint`, `prettier`
- [ ] T005 Configure `nuxt.config.ts` with Pinia, TailwindCSS, and auto-imports
- [ ] T006 Configure `tailwind.config.ts` with custom colors and responsive breakpoints
- [ ] T007 Configure TypeScript with strict mode in `tsconfig.json`
- [ ] T008 Create basic directory structure: `components/`, `composables/`, `pages/`, `stores/`, `types/`, `utils/`, `tests/`
- [ ] T009 Setup ESLint and Prettier configuration files
- [ ] T010 Create initial `package.json` scripts (dev, build, test, lint, format)

---

## Phase 2: Foundational Tasks

### Goal
Create shared types, utilities, and base components required by all user stories.

### Type System

- [ ] T011 [P] Create `types/sudoku.ts` with core type definitions (Difficulty, BoardSize, Cell, GameSession, etc.)
- [ ] T012 [P] Create `types/index.ts` barrel export for all types

### Core Utilities

- [ ] T013 Implement `utils/sudoku-validator.ts` with validation functions (checkRow, checkCol, checkBox, isValidBoard)
- [ ] T014 Implement `utils/sudoku-generator.ts` with `generateCompleteSolution()` using backtracking
- [ ] T015 Implement `utils/sudoku-generator.ts` with `createPuzzle(solution, difficulty)` for cell removal
- [ ] T016 Implement `utils/sudoku-generator.ts` with `hasUniqueSolution(puzzle)` validation
- [ ] T017 [P] Implement `utils/qr-generator.ts` with `generateQRCode(gameId)` using `qrcode` library
- [ ] T018 Implement `utils/id-generator.ts` with UUID generation for game sessions

### Base UI Components

- [ ] T019 [P] Create `components/ui/BaseButton.vue` with size variants (sm, md, lg) for children's use
- [ ] T020 [P] Create `components/ui/BaseCard.vue` container component
- [ ] T021 [P] Create `components/ui/BaseModal.vue` with overlay and close button
- [ ] T022 [P] Create `layouts/default.vue` with responsive navigation and footer

### Storage Foundation

- [ ] T023 Create `composables/useStorage.ts` with IndexedDB initialization using `idb-keyval`
- [ ] T024 Implement `useStorage().saveSession()`, `loadHistory()`, `deleteSession()` methods

### CSS Foundation

- [ ] T025 [P] Create `assets/styles/main.css` with Tailwind directives and custom properties
- [ ] T026 [P] Configure touch-friendly styles (min 44px touch targets)

---

## Phase 3: User Story 1 - 开始一局新游戏

### Goal
Implement game initialization with difficulty/size selection and Sudoku board generation.

**Independent Test Criteria**: Can select difficulty and board size from home page, click start, and see a playable Sudoku board within 2 seconds.

### Implementation Tasks

- [ ] T027 [P] [US1] Create `pages/index.vue` home page with difficulty selector (easy/medium/hard)
- [ ] T028 [P] [US1] Add board size selector (4x4/6x6/9x9) to home page
- [ ] T029 [US1] Create `stores/game.ts` Pinia store with `selectedDifficulty`, `selectedSize`, `currentSession` state
- [ ] T030 [US1] Implement `stores/game.ts` actions: `setDifficulty()`, `setBoardSize()`, `startNewGame()`
- [ ] T031 [US1] Create `composables/useSudoku.ts` with `generateGame(difficulty, boardSize)` method
- [ ] T032 [US1] Implement complete game generation pipeline (generate solution → remove cells → validate unique solution)
- [ ] T033 [US1] Create `pages/play.vue` game page with basic layout
- [ ] T034 [US1] Add loading state with skeleton screen during board generation
- [ ] T035 [US1] Navigate to `/play` after game generation completes

---

## Phase 4: User Story 2 - 填写数字并接收即时反馈

### Goal
Implement cell input handling with click/drag/keyboard support and instant validation feedback.

**Independent Test Criteria**: Can input numbers via all three methods (click, drag, keyboard). Correct inputs stay, wrong inputs bounce back with animation and increment error counter.

### Implementation Tasks

- [ ] T036 [P] [US2] Create `components/game/SudokuCell.vue` with value display and state styling
- [ ] T037 [P] [US2] Create `components/game/SudokuBoard.vue` grid container with cell rendering
- [ ] T038 [US2] Implement cell selection state (highlight selected cell)
- [ ] T039 [US2] Create `components/game/NumberPad.vue` with draggable number buttons
- [ ] T040 [US2] Implement click-to-select mode: click number pad → click cell to fill
- [ ] T041 [US2] Implement HTML5 drag-and-drop: drag from number pad to target cell
- [ ] T042 [US2] Implement keyboard input: number keys fill selected cell (desktop only)
- [ ] T043 [US2] Extend `useSudoku.ts` with `validateInput(sessionId, row, col, value)` method
- [ ] T044 [US2] Implement instant validation logic against solution matrix
- [ ] T045 [US2] Add correct input feedback (green highlight, brief animation)
- [ ] T046 [US2] Implement wrong input bounce-back animation (CSS transition, 800ms)
- [ ] T047 [US2] Add error counter display component with increment animation
- [ ] T048 [US2] Implement error count tracking in game store
- [ ] T049 [US2] Add touch event fallback for mobile drag compatibility

---

## Phase 5: User Story 3 - 完成游戏并查看胜利提示

### Goal
Implement game completion detection, victory modal, and game history persistence.

**Independent Test Criteria**: Fill all cells correctly, see victory modal with stats, game appears in history list.

### Implementation Tasks

- [ ] T050 [P] [US3] Implement `useSudoku.ts` `checkCompletion(sessionId)` to verify all cells filled correctly
- [ ] T051 [US3] Extend `stores/game.ts` with `completeGame()` action
- [ ] T052 [US3] Create `composables/useTimer.ts` with start/pause/stop functionality
- [ ] T053 [US3] Integrate timer start when game begins, stop on completion
- [ ] T054 [US3] Create `components/game/Timer.vue` display component (MM:SS format)
- [ ] T055 [US3] Implement auto-pause when tab becomes hidden (`visibilitychange` event)
- [ ] T056 [US3] Create `components/game/VictoryModal.vue` with confetti animation
- [ ] T057 [US3] Display final stats in modal: elapsed time, error count, difficulty
- [ ] T058 [US3] Add "Play Again" button to reset and return to home or start new game
- [ ] T059 [US3] Implement game session save to IndexedDB via `useStorage().saveGame()`
- [ ] T060 [US3] Create `pages/history.vue` with game history list view
- [ ] T061 [US3] Create `stores/history.ts` with `loadHistory()` action from storage
- [ ] T062 [US3] Display history items with: date, difficulty, board size, time, errors
- [ ] T063 [US3] Implement history sort (newest first) and basic filtering

---

## Phase 6: User Story 4 - 打印游戏用于线下练习

### Goal
Implement print functionality with multi-game generation, QR code answers, and A4 layout.

**Independent Test Criteria**: Select 4 games, generate print preview with QR codes, print to A4, scan QR to see answers.

### Implementation Tasks

- [ ] T064 [P] [US4] Create `pages/print.vue` print configuration page
- [ ] T065 [P] [US4] Add print settings: count (1-6), difficulty, board size selectors
- [ ] T066 [US4] Create `composables/usePrint.ts` with `generatePrintJob(config)` method
- [ ] T067 [US4] Implement multi-game Sudoku generation for print batch
- [ ] T068 [US4] Generate unique game IDs and QR codes for each printable game
- [ ] T069 [US4] Create print preview component with A4 page layout simulation
- [ ] T070 [US4] Implement print-specific CSS with `@media print` rules
- [ ] T071 [US4] Design A4 layout: 2x2 grid for 4 games, 2x3 grid for 6 games
- [ ] T072 [US4] Ensure cell size >= 15mm for pencil writing
- [ ] T073 [US4] Position QR codes at bottom-right of each game in print layout
- [ ] T074 [US4] Create `pages/answer/[id].vue` answer lookup page for QR scans
- [ ] T075 [US4] Implement answer retrieval from temporary storage or URL params
- [ ] T076 [US4] Display full solution board with all correct numbers filled

---

## Phase 7: User Story 5 - 查看游戏计时和进度

### Goal
Enhance timer visibility and add game progress indicators.

**Independent Test Criteria**: Timer visible at all times during game, accurate to the second, handles pause/resume correctly.

### Implementation Tasks

- [ ] T077 [P] [US5] Integrate Timer component into play page header (always visible)
- [ ] T078 [US5] Add timer pause/resume controls (optional pause button)
- [ ] T079 [US5] Create progress indicator: X of Y cells filled
- [ ] T080 [US5] Display remaining cell count alongside timer
- [ ] T081 [US5] Add subtle progress bar or visual completion indicator

---

## Phase 8: Polish & Cross-Cutting Concerns

### Goal
Responsive design, accessibility, performance optimization, and final testing.

### Responsive Design

- [ ] T082 [P] Test and refine mobile layout (320px-480px) - ensure 44px+ touch targets
- [ ] T083 [P] Test and refine tablet layout (768px-1024px)
- [ ] T084 [P] Test and refine desktop layout (1280px+)
- [ ] T085 Adjust SudokuBoard grid sizing based on screen width
- [ ] T086 Optimize NumberPad layout for small screens (horizontal scroll or compact grid)

### Animations & Visual Feedback

- [ ] T087 [P] Add entry animations for modal dialogs
- [ ] T088 [P] Add subtle hover effects for interactive elements
- [ ] T089 Implement smooth page transitions between routes
- [ ] T090 Add sound effects toggle (optional): correct input, wrong input, victory

### Accessibility

- [ ] T091 [P] Add ARIA labels to all interactive components
- [ ] T092 Ensure keyboard navigation works throughout app
- [ ] T093 Add focus indicators for keyboard users
- [ ] T094 Test with screen reader and fix issues

### Performance Optimization

- [ ] T095 Implement Web Worker for Sudoku generation (offload from main thread)
- [ ] T096 Add lazy loading for history page
- [ ] T097 Optimize bundle size: analyze and reduce unused code
- [ ] T098 Add service worker for offline capability (core gameplay only)

### Testing & Quality Assurance

- [ ] T099 Write unit tests for `utils/sudoku-validator.ts`
- [ ] T100 Write unit tests for `utils/sudoku-generator.ts`
- [ ] T101 Write unit tests for `composables/useTimer.ts`
- [ ] T102 Write unit tests for `composables/useStorage.ts`
- [ ] T103 [P] Create Playwright E2E test: Complete game flow (start → play → finish)
- [ ] T104 [P] Create Playwright E2E test: Input validation (correct/wrong scenarios)
- [ ] T105 [P] Create Playwright E2E test: History persistence across page reloads
- [ ] T106 [P] Create Playwright E2E test: Print functionality and QR code scanning
- [ ] T107 [P] Test on target devices: iOS Safari, Android Chrome, Desktop Chrome/Firefox/Safari

### Documentation

- [ ] T108 Update `README.md` with project description and setup instructions
- [ ] T109 Add inline code comments for complex algorithms
- [ ] T110 Create component storybook/stories (optional)

---

## Dependency Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation)
    ├── types/
    ├── utils/ (validator, generator, qr)
    ├── ui components (Button, Card, Modal)
    └── useStorage
    ↓
Phase 3 (US1: Start Game) ←── Requires: types, generator, storage
    ├── stores/game.ts
    ├── useSudoku.ts (generateGame)
    ├── pages/index.vue (home)
    └── pages/play.vue
    ↓
Phase 4 (US2: Input & Feedback) ←── Requires: US1 completed
    ├── SudokuBoard, SudokuCell, NumberPad
    ├── useSudoku.ts (validateInput)
    └── Drag & drop + keyboard support
    ↓
Phase 5 (US3: Completion & History) ←── Requires: US2 completed
    ├── useTimer.ts
    ├── VictoryModal
    ├── useSudoku.ts (checkCompletion)
    └── pages/history.vue
    ↓
Phase 6 (US4: Print) ←── Can parallel with US3 after US1
    ├── usePrint.ts
    ├── pages/print.vue
    └── pages/answer/[id].vue
    ↓
Phase 7 (US5: Timer Enhancement) ←── Requires: useTimer from US3
    ↓
Phase 8 (Polish)
```

---

## Parallel Execution Opportunities

### Within Phase 2 (Foundation)
- T011-T012 (types) can be done in parallel with T013-T018 (utilities)
- T019-T022 (UI components) can be done in parallel with T023-T024 (storage)

### Within Phase 4 (US2)
- T036-T038 (SudokuBoard/Cell) can be done in parallel with T039 (NumberPad)
- T040-T042 (input methods) can be developed in parallel after base components exist

### Within Phase 8 (Polish)
- T082-T086 (responsive) can be done in parallel with T087-T090 (animations)
- T103-T106 (E2E tests) can run in parallel after app is functional

---

## Implementation Strategy

### MVP Scope (User Stories 1-3)
The first deliverable includes:
- Game selection and generation (US1)
- Input handling with feedback (US2)
- Completion detection and basic history (US3)

This provides a fully playable Sudoku game with core learning features.

### Incremental Delivery
1. **Week 1**: Phase 1-2 (Setup + Foundation) + Phase 3 (US1) → Demo: Can start a game
2. **Week 2**: Phase 4 (US2) → Demo: Can play with full input methods
3. **Week 3**: Phase 5 (US3) → Demo: Complete game and see history
4. **Week 4**: Phase 6-8 (US4, US5, Polish) → Final product with print and refinements

---

## Summary

**Total Tasks**: 110
**Tasks by User Story**:
- Setup (Phase 1): 10 tasks
- Foundation (Phase 2): 16 tasks
- US1 (Start Game): 9 tasks
- US2 (Input & Feedback): 14 tasks
- US3 (Completion & History): 14 tasks
- US4 (Print): 13 tasks
- US5 (Timer Enhancement): 5 tasks
- Polish (Phase 8): 29 tasks

**Critical Path**: T001-T010 → T011-T026 → T027-T035 (US1) → T036-T049 (US2) → T050-T063 (US3) → MVP Complete

**Parallel Max**: 5 developers could work in parallel on Foundation phase (types, utils, UI, storage, CSS)
