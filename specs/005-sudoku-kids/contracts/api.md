# API Contracts: Sudoku Kids Learning Game

**Feature**: Sudoku Kids Learning Game  
**Date**: 2026-02-12  
**Purpose**: Define Vue Composables and Pinia Store contracts

## Vue Composables Contracts

### useSudoku

**Purpose**: Core game logic for Sudoku generation, validation, and completion checking.

```typescript
interface UseSudokuReturn {
  generateGame(difficulty: Difficulty, boardSize: BoardSize): GameSession;
  validateInput(session: GameSession, row: number, col: number, value: number): ValidationResult;
  checkCompletion(session: GameSession): boolean;
}

interface ValidationResult {
  isCorrect: boolean;
  expectedValue: number;
  errorCount: number;
  isCompleted: boolean;
}
```

**Methods**:
- `generateGame(difficulty, boardSize)`: Creates new game session with solution and puzzle
- `validateInput(session, row, col, value)`: Validates number placement against solution
- `checkCompletion(session)`: Checks if all cells are correctly filled

**Error Handling**:
- Invalid difficulty or boardSize: throws Error
- Invalid row/col indices: throws Error
- Invalid value (out of range): throws Error

### useTimer

**Purpose**: Timer functionality for game sessions.

```typescript
interface UseTimerReturn {
  elapsedTime: Ref<number>;
  isRunning: Ref<boolean>;
  isPaused: Ref<boolean>;
  formattedTime: ComputedRef<string>;
  start(): void;
  pause(): void;
  resume(): void;
  stop(): number;
  reset(): void;
  formatTime(seconds: number): string;
}
```

**Methods**:
- `start()`: Starts timer, increments every second
- `pause()`: Pauses timer without resetting
- `resume()`: Resumes from paused state
- `stop()`: Stops timer and returns final elapsed time
- `reset()`: Resets timer to zero
- `formatTime(seconds)`: Formats seconds as MM:SS

**Behavior**:
- Timer auto-stops on component unmount
- Paused state tracked separately from running state

### useStorage

**Purpose**: IndexedDB operations for game history persistence.

```typescript
interface UseStorageReturn {
  saveSession(session: GameSession): Promise<void>;
  loadHistory(): Promise<GameSession[]>;
  deleteSession(sessionId: string): Promise<void>;
  exportHistory(): Promise<string>;
  clearHistory(): Promise<void>;
}
```

**Methods**:
- `saveSession(session)`: Saves or updates game session in IndexedDB
- `loadHistory()`: Loads all game sessions from IndexedDB
- `deleteSession(sessionId)`: Deletes specific game session
- `exportHistory()`: Exports all sessions as JSON string
- `clearHistory()`: Clears all game sessions from IndexedDB

**Error Handling**:
- IndexedDB quota exceeded: throws Error with message
- Invalid session object: throws Error
- Session not found (delete): throws Error

**Storage Limits**:
- Maximum 50 sessions retained
- Oldest session removed when limit exceeded

### usePrint

**Purpose**: Print job generation and QR code creation.

```typescript
interface UsePrintReturn {
  generatePrintJob(count: number, difficulty: Difficulty, boardSize: BoardSize): Promise<PrintJob>;
  getAnswerById(gameId: string): number[][] | null;
}
```

**Methods**:
- `generatePrintJob(count, difficulty, boardSize)`: Generates N puzzles with QR codes
- `getAnswerById(gameId)`: Retrieves solution from sessionStorage by game ID

**Error Handling**:
- Invalid count (not 1-6): throws Error
- QR code generation failure: throws Error
- Game ID not found: returns null

**SessionStorage Keys**:
- Format: `print_game_{gameId}`
- Contains: `{ solution: number[][], difficulty: Difficulty, boardSize: BoardSize, createdAt: number }`

## Pinia Store Contracts

### useGameStore

**Purpose**: Manages active game session state.

```typescript
interface GameStoreState {
  currentSession: GameSession | null;
  gameStatus: GameStatus;
  selectedDifficulty: Difficulty;
  selectedSize: BoardSize;
  isLoading: boolean;
  error: string | null;
}

interface GameStoreActions {
  setDifficulty(difficulty: Difficulty): void;
  setBoardSize(size: BoardSize): void;
  startNewGame(): Promise<void>;
  updateCell(row: number, col: number, value: number | null): void;
  incrementError(): void;
  completeGame(elapsedTime: number): void;
  resetGame(): void;
}

type GameStatus = 'created' | 'playing' | 'completed';
```

**State**:
- `currentSession`: Active game session or null
- `gameStatus`: Current game status
- `selectedDifficulty`: Default difficulty for new games
- `selectedSize`: Default board size for new games
- `isLoading`: Loading state for async operations
- `error`: Error message or null

**Actions**:
- `setDifficulty(difficulty)`: Sets default difficulty for new games
- `setBoardSize(size)`: Sets default board size for new games
- `startNewGame()`: Generates new game session and navigates to play page
- `updateCell(row, col, value)`: Records user input attempt
- `incrementError()`: Increments error count
- `completeGame(elapsedTime)`: Marks game as completed
- `resetGame()`: Clears current session and resets state

**Behavior**:
- `startNewGame()` generates new session using `useSudoku.generateGame()`
- `updateCell()` creates UserInput record but doesn't modify board state
- `completeGame()` saves session to IndexedDB via `useStorage.saveSession()`

### useHistoryStore

**Purpose**: Manages game history state.

```typescript
interface HistoryStoreState {
  sessions: GameSession[];
  isLoading: boolean;
  error: string | null;
}

interface HistoryStoreActions {
  loadHistory(): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  exportHistory(): Promise<void>;
}

interface HistoryStoreGetters {
  sortedSessions: ComputedRef<GameSession[]>;
}
```

**State**:
- `sessions`: Array of all game sessions
- `isLoading`: Loading state for async operations
- `error`: Error message or null

**Actions**:
- `loadHistory()`: Loads all sessions from IndexedDB
- `deleteSession(sessionId)`: Deletes specific session
- `exportHistory()`: Exports all sessions as JSON file download

**Getters**:
- `sortedSessions`: Sessions sorted by startTime descending (newest first)

**Behavior**:
- `loadHistory()` called on component mount
- `deleteSession()` removes from both IndexedDB and local state

## Component Props Contracts

### SudokuBoard

```typescript
interface SudokuBoardProps {
  board: Cell[][];
  selectedCell: { row: number; col: number } | null;
}

interface SudokuBoardEmits {
  'select-cell': [row: number, col: number];
  'input': [row: number, col: number, value: number];
}
```

### NumberPad

```typescript
interface NumberPadProps {
  selectedNumber: number | null;
  boardSize: BoardSize;
}

interface NumberPadEmits {
  'select': [num: number];
  'drag-start': [num: number];
}
```

### Timer

```typescript
interface TimerProps {
  isRunning: boolean;
}

// No emits - purely presentational
```

### VictoryModal

```typescript
interface VictoryModalProps {
  show: boolean;
  elapsedTime: number;
  errorCount: number;
}

interface VictoryModalEmits {
  'play-again': [];
  'close': [];
}
```

## Page Route Contracts

### / (Home Page)

**Query Parameters**: None

**State**:
- Default difficulty and board size from gameStore

**Actions**:
- User selects difficulty and board size
- User clicks "Start Game" → `gameStore.startNewGame()`

### /play (Game Page)

**Query Parameters**: None

**State**:
- `gameStore.currentSession` must not be null

**Actions**:
- User places numbers (click or drag)
- Timer auto-starts on mount
- Navigation to history page on completion

**Guard**:
- Redirect to home if `currentSession` is null

### /history (History Page)

**Query Parameters**: None

**State**:
- `historyStore.sessions` array

**Actions**:
- User clicks delete → `historyStore.deleteSession()`
- User clicks export → `historyStore.exportHistory()`

**Behavior**:
- Loads history on component mount
- Displays sessions sorted by date descending

### /print (Print Page)

**Query Parameters**: None

**State**:
- Form state: count (1-6), difficulty, boardSize

**Actions**:
- User selects options and clicks "Generate" → `usePrint.generatePrintJob()`
- User clicks "Print" → `window.print()`

### /answer/[id] (Answer Page)

**Query Parameters**: None

**State**:
- `route.params.id` as gameId

**Actions**:
- `usePrint.getAnswerById(gameId)` on mount

**Behavior**:
- Displays solution or "not found" message
- No persistence required (sessionStorage only)

## Event Flow Contracts

### Game Start Flow

1. User selects difficulty/size → `gameStore.setDifficulty()`, `gameStore.setBoardSize()`
2. User clicks "Start Game" → `gameStore.startNewGame()`
3. `startNewGame()` calls `useSudoku.generateGame()` → creates GameSession
4. Navigate to `/play`

### Number Placement Flow (Click)

1. User clicks cell → emit `select-cell(row, col)`
2. User clicks number → emit `select(num)`
3. Parent component calls `useSudoku.validateInput()`
4. If correct: update cell value, create UserInput record
5. If incorrect: increment errorCount, show bounce animation

### Number Placement Flow (Drag)

1. User drags number → emit `drag-start(num)`
2. User drops on cell → emit `input(row, col, num)`
3. Parent component calls `useSudoku.validateInput()`
4. Same validation logic as click flow

### Game Completion Flow

1. Last correct number placed → `useSudoku.checkCompletion()` returns true
2. `gameStore.completeGame(elapsedTime)` called
3. `gameStore.saveSession()` called
4. Victory modal displays
5. User clicks "Play Again" → navigate to home
6. User clicks "View History" → navigate to history

### Print Generation Flow

1. User selects options → form state updates
2. User clicks "Generate" → `usePrint.generatePrintJob()`
3. Generate N puzzles with solutions
4. Generate N QR codes
5. Store solutions in sessionStorage
6. Display print preview
7. User clicks "Print" → `window.print()`

## Error Handling Contracts

### Common Error Types

```typescript
enum ErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  STORAGE_ERROR = 'STORAGE_ERROR',
  GENERATION_ERROR = 'GENERATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
}
```

### Error Recovery

- **INVALID_INPUT**: Show user-friendly message, highlight invalid field
- **STORAGE_ERROR**: Show message "Unable to save game", retry option
- **GENERATION_ERROR**: Show message "Unable to generate puzzle", retry option
- **VALIDATION_ERROR**: Show bounce animation, increment errorCount
- **NETWORK_ERROR**: Show message "Connection error", retry option

## Performance Contracts

### Response Time Requirements

- Game generation: < 100ms
- Validation: < 100ms
- History load (50 sessions): < 2s
- Print preview (6 puzzles): < 5s
- QR code generation: < 50ms per puzzle

### Storage Limits

- Maximum 50 game sessions
- IndexedDB quota: ~50MB (sufficient for 50 sessions)
- SessionStorage: ~1MB (sufficient for print jobs)

## Accessibility Contracts

### WCAG 2.1 AA Requirements

- Touch targets: 44x44px minimum
- Color contrast: 4.5:1 minimum
- Keyboard navigation: All interactive elements
- Screen reader: ARIA labels for all icons
- Focus indicators: Visible and clear

### Child-Friendly Requirements

- Simple language (elementary reading level)
- Large, clear fonts (minimum 16px)
- High-contrast colors
- Gentle animations (no flashing)
- Clear visual feedback
