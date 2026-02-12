# Task List: Sudoku Kids Learning Game

**Feature Branch**: `005-sudoku-kids`
**Date**: 2026-02-12
**Input**: Design documents from `/specs/005-sudoku-kids/`

## Phase 1: Setup (Project Initialization)

### Goal
Initialize Nuxt 3 project with TypeScript, install dependencies, configure development tools.

### Tasks

- [ ] T001 Initialize Nuxt 3 project with `nuxi init sudoku-kids --packageManager pnpm`
- [ ] T002 Create `package.json` with dependencies: nuxt@latest, @pinia/nuxt, @nuxtjs/tailwindcss, idb-keyval, qrcode, uuid, vitest, playwright, happy-dom
- [ ] T003 Create `nuxt.config.ts` with modules (@pinia/nuxt, @nuxtjs/tailwindcss), CSS path, TypeScript strict mode
- [ ] T004 Create `tsconfig.json` extending `.nuxt/tsconfig.json` with strict mode options
- [ ] T005 Create `tailwind.config.ts` with content paths, custom theme (primary colors, spacing, min-width/height)
- [ ] T006 Create `.eslintrc.js` with Vue 3, TypeScript, Prettier rules
- [ ] T007 Create `.prettierrc` with formatting options (semi, trailingComma, singleQuote, printWidth, tabWidth)
- [ ] T008 Create `assets/styles/main.css` with Tailwind directives, base styles, custom components, animations, print media queries
- [ ] T009 Create `.gitignore` with Node.js, Nuxt, environment, IDE, OS, logs, test coverage patterns
- [ ] T010 Run `pnpm install --legacy-peer-deps` to install dependencies
- [ ] T011 Run `pnpm dev` to verify project starts successfully

## Phase 2: Foundational Tasks

### Goal
Create core types, utilities, and base UI components required by all user stories.

### Tasks

- [ ] T012 [P] Create `types/sudoku.ts` with Difficulty, BoardSize, InputType, GameStatus, Cell, SudokuBoard, UserInput, GameSession, GameHistory, PrintableGame, PrintJob, ValidationResult interfaces
- [ ] T013 [P] Create `types/index.ts` barrel export for all types
- [ ] T014 [P] Implement `utils/sudoku-validator.ts` with checkRow, checkCol, checkBox, isValidPlacement, isValidBoard, createEmptyBoard functions
- [ ] T015 [P] Implement `utils/sudoku-generator.ts` with generateCompleteSolution() using backtracking, createPuzzle() for cell removal, hasUniqueSolution() validation
- [ ] T016 [P] Implement `utils/qr-generator.ts` with generateQRCode(gameId) using qrcode library
- [ ] T017 [P] Implement `utils/id-generator.ts` with UUID generation for game sessions
- [ ] T018 [P] Create `composables/useStorage.ts` with saveSession, loadHistory, deleteSession, exportHistory, clearHistory functions
- [ ] T019 [P] Create `composables/useTimer.ts` with elapsedTime, isRunning, isPaused, formattedTime, start, pause, resume, stop, reset, formatTime
- [ ] T020 [P] Create `composables/useSudoku.ts` with generateGame, validateInput, checkCompletion functions
- [ ] T021 [P] Create `composables/usePrint.ts` with generatePrintJob, getAnswerById functions
- [ ] T022 [P] Create `components/ui/BaseButton.vue` with size (sm/md/lg), variant (primary/secondary) props
- [ ] T023 [P] Create `components/ui/BaseCard.vue` with rounded card styling
- [ ] T024 [P] Create `components/ui/BaseModal.vue` with modelValue, title, close behavior, fade/scale transitions
- [ ] T025 [P] Create `stores/game.ts` with currentSession, gameStatus, selectedDifficulty, selectedSize, isLoading, error state and actions
- [ ] T026 [P] Create `stores/history.ts` with sessions, isLoading, error state and loadHistory, deleteSession, exportHistory actions

## Phase 3: User Story 1 - Start and Play Game (Priority: P1)

### Goal
Enable students to start a new game by selecting difficulty and board size, place numbers via click or drag, receive immediate validation feedback, and see victory message on completion.

### Independent Test Criteria
Can start a game, place numbers (correct and incorrect), see validation feedback, and view victory message with completion time and error count.

### Tasks

- [ ] T027 [US1] Create `pages/index.vue` with difficulty selection (easy/medium/hard), board size selection (4×4/6×6/9×9), start game button
- [ ] T028 [US1] Implement `gameStore.startNewGame()` action to generate game session and navigate to play page
- [ ] T029 [US1] Create `components/game/SudokuBoard.vue` with cell rendering, click handling, drag-and-drop support
- [ ] T030 [US1] Create `components/game/NumberPad.vue` with number buttons, drag handling, selected number highlighting
- [ ] T031 [US1] Create `components/game/Timer.vue` with elapsed time display, auto-start/stop on mount/unmount
- [ ] T032 [US1] Create `pages/play.vue` with game board, number pad, timer, selected cell state, input handling, victory modal
- [ ] T033 [US1] Implement number placement validation in `play.vue` with bounce animation for incorrect numbers
- [ ] T034 [US1] Implement victory modal in `components/game/VictoryModal.vue` with play again and view history buttons
- [ ] T035 [US1] Add game completion detection in `play.vue` to show victory modal when all cells correct

## Phase 4: User Story 2 - View Game History (Priority: P2)

### Goal
Enable students to view their past games with date, difficulty, size, time, and error count, delete individual records, and export history as JSON.

### Independent Test Criteria
Can view list of completed games, delete a game record, and export all history as JSON file.

### Tasks

- [ ] T036 [US2] Create `pages/history.vue` with game list display, delete button, export button
- [ ] T037 [US2] Implement `historyStore.loadHistory()` action to load sessions from IndexedDB on component mount
- [ ] T038 [US2] Implement `historyStore.deleteSession(sessionId)` action to delete specific session
- [ ] T039 [US2] Implement `historyStore.exportHistory()` action to download JSON file
- [ ] T040 [US2] Add date formatting in `history.vue` (toLocaleDateString)
- [ ] T041 [US2] Add difficulty label mapping in `history.vue` (easy/medium/hard)
- [ ] T042 [US2] Add difficulty color coding in `history.vue` (green/yellow/red)
- [ ] T043 [US2] Add time formatting in `history.vue` (MM:SS format)

## Phase 5: User Story 3 - Print Games for Offline Practice (Priority: P2)

### Goal
Enable teachers to generate 1-6 printable puzzles with QR codes for answer verification in print-optimized layout.

### Independent Test Criteria
Can select puzzle count, difficulty, and size, generate print preview with QR codes, and print the page.

### Tasks

- [ ] T044 [US3] Create `pages/print.vue` with count selector (1-6), difficulty selector, size selector, generate button, print button
- [ ] T045 [US3] Implement `usePrint.generatePrintJob(count, difficulty, boardSize)` to generate puzzles with QR codes
- [ ] T046 [US3] Add print preview grid layout in `print.vue` (2 columns for 1-4 puzzles, 3 columns for 5-6 puzzles)
- [ ] T047 [US3] Add print media query in `assets/styles/main.css` to hide UI elements and optimize for A4 paper
- [ ] T048 [US3] Implement QR code storage in `usePrint.generatePrintJob()` using sessionStorage with key `print_game_{gameId}`
- [ ] T049 [US3] Create `pages/answer/[id].vue` to display solution from sessionStorage
- [ ] T050 [US3] Add `usePrint.getAnswerById(gameId)` function to retrieve solution from sessionStorage

## Phase 6: Polish & Cross-Cutting Concerns

### Goal
Add layout, navigation, error handling, accessibility, and final polish.

### Tasks

- [ ] T051 [P] Create `layouts/default.vue` with header (logo, navigation links to history and print), footer
- [ ] T052 [P] Add responsive header navigation in `default.vue` (mobile hamburger menu or simplified nav)
- [ ] T053 [P] Add footer in `default.vue` with copyright text
- [ ] T054 [P] Create app-wide error boundary in `app.vue` or error page
- [ ] T055 [P] Add loading states in pages (skeleton screens or spinners)
- [ ] T056 [P] Add 404 page in `pages/error.vue` with link to home
- [ ] T057 [P] Add ARIA labels to all interactive elements
- [ ] T058 [P] Add keyboard navigation support (tab index, enter/space for activation)
- [ ] T059 [P] Verify color contrast meets WCAG 2.1 AA (4.5:1 minimum)
- [ ] T060 [P] Add focus indicators for all interactive elements
- [ ] T061 [P] Test responsive behavior on mobile (375px+), tablet (768px+), desktop (1024px+)
- [ ] T062 [P] Test print layout on A4 paper with multiple puzzles
- [ ] T063 [P] Remove all console.log statements
- [ ] T064 [P] Run `pnpm lint` and fix all ESLint errors
- [ ] T065 [P] Run `pnpm format` to apply Prettier formatting
- [ ] T066 [P] Verify application loads in under 3 seconds
- [ ] T067 [P] Verify validation response under 100ms
- [ ] T068 [P] Verify print preview generates 6 puzzles under 5 seconds

## Dependencies

### Story Completion Order
1. **Phase 1: Setup** (no dependencies)
2. **Phase 2: Foundational** (no dependencies)
3. **Phase 3: US1 - Start and Play Game** (no dependencies on US2, US3)
4. **Phase 4: US2 - View Game History** (depends on US1 completion for game data)
5. **Phase 5: US3 - Print Games** (independent, can be done in parallel with US2)
6. **Phase 6: Polish** (depends on all user stories)

### Parallel Execution Examples

**Phase 1: Setup**
- T002-T011 can run in parallel after T001

**Phase 2: Foundational**
- T012-T026 can all run in parallel

**Phase 3: US1**
- T029-T031 can run in parallel (SudokuBoard, NumberPad, Timer components)
- T034-T035 can run in parallel (VictoryModal, completion detection)

**Phase 4: US2**
- T040-T043 can run in parallel (formatting functions)

**Phase 5: US3**
- T047-T050 can run in parallel (print layout, sessionStorage, answer page)

**Phase 6: Polish**
- T051-T053 can run in parallel (layout components)
- T057-T065 can run in parallel (accessibility, testing, linting)

## Implementation Strategy

### MVP Scope (First Deliverable)
**Phase 1 + Phase 2 + Phase 3 (US1 only)**

The MVP includes:
- Project setup and configuration
- Core types and utilities
- Base UI components
- Game store and timer composable
- Home page with difficulty/size selection
- Play page with game board, number pad, timer, validation
- Victory modal

This provides a fully playable game with click/drag input, validation, and victory feedback.

### Incremental Delivery
- **Sprint 1**: MVP (Phase 1-3) - Playable game
- **Sprint 2**: Add history viewing (Phase 4)
- **Sprint 3**: Add print functionality (Phase 5)
- **Sprint 4**: Polish and accessibility (Phase 6)

## Summary

- **Total Tasks**: 68
- **Tasks per User Story**:
  - US1 (Start and Play Game): 9 tasks
  - US2 (View Game History): 8 tasks
  - US3 (Print Games): 7 tasks
- **Parallel Opportunities**: 20+ parallelizable tasks identified
- **Independent Test Criteria**:
  - US1: Can start game, place numbers, see validation, view victory message
  - US2: Can view history, delete records, export JSON
  - US3: Can generate puzzles, display preview, print page
- **Suggested MVP**: Phase 1 + Phase 2 + Phase 3 (US1 only) - 32 tasks

### Format Validation
✅ All tasks follow the required checklist format with checkbox, Task ID, [P] marker, [Story] label, and file path.
