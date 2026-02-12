# Technical Research: Sudoku Kids Learning Game

**Feature**: Sudoku Kids Learning Game  
**Date**: 2026-02-12  
**Purpose**: Research and document technical decisions for implementation

## Sudoku Generation Algorithm

### Decision: Backtracking Algorithm with Difficulty-Based Cell Removal

**Rationale**: 
- Backtracking is the standard algorithm for generating complete Sudoku solutions
- By generating the full solution first, then removing cells based on difficulty, we ensure unique solutions
- Cell removal percentages (easy: 50%+, medium: 35-50%, hard: <35%) provide appropriate challenge levels

**Implementation Approach**:
1. Generate complete valid Sudoku board using backtracking
2. Create puzzle by removing cells according to difficulty level
3. Validate that puzzle has unique solution (important for educational value)
4. Mark remaining cells as "fixed" (pre-filled) vs "empty"

**Alternatives Considered**:
- Random cell filling without solution pre-computation: Would risk unsolvable puzzles
- Pre-built puzzle database: Limited variety, not scalable
- Constraint propagation (Sudoku-solving algorithms): More complex than needed for generation

**Performance**: 
- Generation time: < 100ms for 9×9 board
- Validation time: < 50ms for uniqueness check

## Drag-and-Drop Implementation

### Decision: HTML5 Native Drag-and-Drop API with Vue 3 Event Handling

**Rationale**:
- HTML5 Drag and Drop API is natively supported in modern browsers
- Vue 3 provides clean event handling with @dragstart, @dragover, @drop
- No additional library dependencies required
- Works seamlessly with click-based interaction

**Implementation Approach**:
1. Number pad buttons have draggable="true" attribute
2. On dragstart: store selected number in data transfer
3. On dragover: allow drop on valid cells (empty cells only)
4. On drop: validate number placement, apply same logic as click method
5. Touch devices: support both touch events and click events

**Alternatives Considered**:
- vue-draggable library: Adds dependency, overkill for simple number placement
- Custom touch event handling: More complex, harder to maintain
- Mouse-only drag: Would not support mobile users

**Performance**:
- Drag operations: < 16ms (60fps)
- Touch event handling: Native browser optimization

## QR Code Generation

### Decision: qrcode Library for Client-Side Generation

**Rationale**:
- Pure JavaScript implementation, no server required
- Lightweight (~5KB minified)
- Supports error correction levels (H for reliability)
- Easy integration with Vue composables

**Implementation Approach**:
1. Generate unique game ID for each printable puzzle
2. Store answer in sessionStorage with game ID as key
3. Generate QR code pointing to `/answer/[gameId]` route
4. Include QR code in print layout
5. Answer page reads from sessionStorage to display solution

**Alternatives Considered**:
- Server-side QR generation: Requires backend, adds complexity
- qr-code library: Larger (~15KB), more features not needed
- No QR code: Would require answer key separate from puzzles

**Performance**:
- QR code generation: < 50ms per puzzle
- Print preview with 6 puzzles: < 5s total

## IndexedDB Implementation

### Decision: idb-keyval Library for Simplified IndexedDB Access

**Rationale**:
- Promise-based API, cleaner than raw IndexedDB
- Automatic schema management
- Small footprint (~2KB)
- Type-safe with TypeScript

**Implementation Approach**:
1. Use idb-keyval for storing game sessions
2. Store each session with key: `game_session_${id}`
3. Store history metadata with key: `sudoku_game_history`
4. Implement cleanup: remove oldest session when > 50
5. Export functionality: JSON.stringify all sessions

**Data Structure**:
```typescript
interface GameSession {
  id: string;
  startTime: number;
  endTime: number | null;
  difficulty: Difficulty;
  boardSize: BoardSize;
  initialBoard: number[][];
  solution: number[][];
  userInputs: UserInput[];
  errorCount: number;
  isCompleted: boolean;
  elapsedTime: number;
}
```

**Alternatives Considered**:
- Raw IndexedDB: More verbose, harder to maintain
- LocalStorage: Limited to ~5MB, not suitable for game boards
- SessionStorage: Lost on page refresh, not suitable for history

**Performance**:
- Write operation: < 10ms per session
- Read operation: < 100ms for 50 sessions
- Export: < 500ms for 50 sessions

## Responsive Design Breakpoints

### Decision: TailwindCSS Default Breakpoints

**Rationale**:
- TailwindCSS provides responsive utilities out of the box
- Mobile-first approach aligns with child-friendly design
- Print media queries handled via TailwindCSS @layer directive

**Breakpoints**:
- Mobile: 375px+ (sm breakpoint)
- Tablet: 768px+ (md breakpoint)
- Desktop: 1024px+ (lg breakpoint)

**Implementation Approach**:
1. Use TailwindCSS responsive prefixes (sm:, md:, lg:)
2. Grid layouts: `grid-cols-4` mobile, `grid-cols-6` tablet, `grid-cols-9` desktop
3. Touch targets: min-w-12 (48px) mobile, min-w-10 (40px) desktop
4. Print layout: @media print with A4 optimization

**Alternatives Considered**:
- Custom CSS breakpoints: More complex, harder to maintain
- JavaScript-based responsiveness: Slower, less reliable
- Fixed layouts: Not responsive, violates constitution

**Performance**:
- CSS generation: < 50ms
- Layout calculation: Native browser optimization

## Touch Event Handling

### Decision: Native Touch Events with Click Fallback

**Rationale**:
- Touch events provide better mobile experience than click alone
- Click events work as fallback for non-touch devices
- No additional library dependencies
- Vue 3 provides @touchstart, @touchend, @touchmove directives

**Implementation Approach**:
1. Support both touch and click events
2. Prevent default behavior on touch to avoid double-firing
3. Use touch-action CSS property for better control
4. Ensure 44x44px minimum touch targets (constitution requirement)

**Alternatives Considered**:
- Hammer.js library: Overkill for simple touch handling
- Pointer events: Good but less widely supported than touch events
- Click-only: Poor mobile experience

## Print Layout Optimization

### Decision: CSS Grid with Print Media Queries

**Rationale**:
- CSS Grid provides flexible layout for multiple puzzles
- Print media queries allow different layout for printing
- No JavaScript required for print functionality
- Browser's native print dialog handles actual printing

**Implementation Approach**:
1. Use CSS Grid for puzzle arrangement
2. Print media query: landscape orientation, A4 paper size
3. Adjust puzzle sizes for print (larger than screen)
4. Hide UI elements (buttons, navigation) in print
5. Include QR codes in print layout

**Alternatives Considered**:
- PDF generation library: Adds complexity, larger bundle size
- Server-side PDF generation: Requires backend
- Fixed print layout: Not flexible for different puzzle counts

**Performance**:
- Print preview generation: < 5s for 6 puzzles
- CSS Grid layout: Native browser optimization

## State Management

### Decision: Pinia for Reactive State Management

**Rationale**:
- Pinia is Vue 3's recommended state management library
- Type-safe with TypeScript
- Composable and modular
- Integrates seamlessly with Nuxt 3

**Implementation Approach**:
1. Create `useGameStore` for game state (current session, selected cell, etc.)
2. Create `useHistoryStore` for game history
3. Use composables for business logic (useSudoku, useTimer, useStorage)
4. Stores handle state, composables handle logic

**Alternatives Considered**:
- Vuex 4: Older API, less TypeScript support
- Reactive refs only: Harder to manage complex state
- Context API: Not idiomatic in Vue ecosystem

## Timer Implementation

### Decision: setInterval with Reactive Refs

**Rationale**:
- Simple and reliable
- No additional dependencies
- Easy to pause/resume
- Vue 3 reactive refs make state management trivial

**Implementation Approach**:
1. Use ref for elapsed time
2. setInterval updates elapsed time every second
3. Pause by clearing interval
4. Format time as MM:SS for display

**Alternatives Considered**:
- requestAnimationFrame: Overkill for simple timer
- Date.now() delta: More complex, harder to pause
- External library: Unnecessary dependency

## Testing Strategy

### Decision: Vitest for Unit Tests, Playwright for E2E Tests

**Rationale**:
- Vitest is fast, native to Vite (used by Nuxt)
- Playwright provides reliable cross-browser E2E testing
- Both integrate well with TypeScript
- Aligns with constitution requirements

**Test Coverage**:
- Unit tests: Sudoku generation, validation, storage operations, QR generation
- E2E tests: Game flow, input methods, print functionality, history viewing

**Alternatives Considered**:
- Jest: Slower, requires more configuration
- Cypress: Heavier, less modern API
- No tests: Violates constitution requirements

## Summary

All technical decisions align with constitution requirements and feature specification. No NEEDS CLARIFICATION markers remain. The chosen stack (Nuxt 3, Vue 3, TypeScript, Pinia, TailwindCSS) provides a modern, maintainable foundation for the Sudoku Kids learning game.
