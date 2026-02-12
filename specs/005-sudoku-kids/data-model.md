# Data Model: Sudoku Kids Learning Game

**Feature**: Sudoku Kids Learning Game  
**Date**: 2026-02-12  
**Purpose**: Define data entities and their relationships for the game

## Entities

### GameSession

Represents a single game instance from start to completion.

| Attribute | Type | Description | Validation |
|------------|------|-------------|------------|
| id | string | Unique identifier (UUID) | Required, format: UUID v4 |
| startTime | number | Unix timestamp (ms) when game started | Required, > 0 |
| endTime | number \| null | Unix timestamp (ms) when game completed | Optional, null if in progress |
| elapsedTime | number | Total time elapsed in seconds | Required, >= 0 |
| difficulty | Difficulty | Difficulty level (easy/medium/hard) | Required, enum |
| boardSize | BoardSize | Board dimensions (4×4, 6×6, 9×9) | Required, enum |
| initialBoard | number[][] | Initial board state with pre-filled cells | Required, square matrix |
| solution | number[][] | Complete solution for validation | Required, square matrix |
| userInputs | UserInput[] | All number placement attempts | Required, array |
| errorCount | number | Total incorrect placement attempts | Required, >= 0 |
| isCompleted | boolean | Whether game is completed | Required |

**State Transitions**:
- created → playing → completed
- Cannot transition back from completed

**Relationships**:
- Has many UserInput records

### UserInput

Represents a single number placement attempt by the student.

| Attribute | Type | Description | Validation |
|------------|------|-------------|------------|
| id | string | Unique identifier (UUID) | Required, format: UUID v4 |
| sessionId | string | Reference to parent GameSession | Required, foreign key |
| timestamp | number | Unix timestamp (ms) of placement | Required, > 0 |
| row | number | Board row index (0-based) | Required, 0 to boardSize-1 |
| col | number | Board column index (0-based) | Required, 0 to boardSize-1 |
| value | number | Number placed (1 to boardSize) | Required, 1 to boardSize |
| inputType | InputType | How number was placed (click/drag) | Required, enum |
| isCorrect | boolean | Whether placement was correct | Required |

**Relationships**:
- Belongs to one GameSession

### PrintJob

Represents a request to generate printable puzzles.

| Attribute | Type | Description | Validation |
|------------|------|-------------|------------|
| id | string | Unique identifier (UUID) | Required, format: UUID v4 |
| count | number | Number of puzzles to generate (1-6) | Required, 1 to 6 |
| difficulty | Difficulty | Difficulty level for puzzles | Required, enum |
| boardSize | BoardSize | Board dimensions for puzzles | Required, enum |
| pageSize | string | Paper size (A4, Letter) | Required, enum |
| games | PrintableGame[] | Generated puzzles | Required, array |
| createdAt | number | Unix timestamp (ms) when created | Required, > 0 |

**Relationships**:
- Has many PrintableGame records

### PrintableGame

Represents a single puzzle prepared for printing.

| Attribute | Type | Description | Validation |
|------------|------|-------------|------------|
| id | string | Unique identifier (UUID) | Required, format: UUID v4 |
| sequence | number | Position in print job (1-based) | Required, >= 1 |
| board | SudokuBoard | The puzzle board state | Required |
| solution | number[][] | Complete solution for QR verification | Required, square matrix |
| qrCodeDataUrl | string | Base64-encoded QR code image | Required, data URL format |

**Relationships**:
- Belongs to one PrintJob

### SudokuBoard

Represents the visual board state.

| Attribute | Type | Description | Validation |
|------------|------|-------------|------------|
| size | number | Board dimensions (4, 6, or 9) | Required, enum |
| cells | Cell[][] | 2D array of cell objects | Required, square matrix |

### Cell

Represents a single cell on the Sudoku board.

| Attribute | Type | Description | Validation |
|------------|------|-------------|------------|
| row | number | Row index (0-based) | Required, 0 to size-1 |
| col | number | Column index (0-based) | Required, 0 to size-1 |
| value | number \| null | Number in cell (1 to size) or null | Optional, 1 to size if not null |
| isFixed | boolean | Whether cell is pre-filled | Required |
| isValid | boolean \| null | Whether current value is correct | Optional, null if value is null |

## Enums

### Difficulty

```typescript
enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}
```

### BoardSize

```typescript
enum BoardSize {
  FOUR = 4,
  SIX = 6,
  NINE = 9
}
```

### InputType

```typescript
enum InputType {
  CLICK = 'click',
  DRAG = 'drag'
}
```

## Validation Rules

### GameSession

- `id` must be unique UUID v4
- `startTime` must be before `endTime` if `endTime` is not null
- `elapsedTime` must equal `endTime - startTime` if `endTime` is not null
- `initialBoard` and `solution` must be square matrices matching `boardSize`
- `solution` must be a valid complete Sudoku board
- `initialBoard` must be a valid partial board derived from `solution`

### UserInput

- `sessionId` must reference an existing GameSession
- `row` and `col` must be within board bounds
- `value` must be between 1 and boardSize
- `isCorrect` must match whether `value` equals `solution[row][col]`

### PrintJob

- `count` must be between 1 and 6
- `games` array length must equal `count`
- All `games` must have matching `difficulty` and `boardSize`

### PrintableGame

- `sequence` must be between 1 and parent PrintJob's `count`
- `sequence` values must be unique within parent PrintJob
- `qrCodeDataUrl` must be valid data URL (data:image/png;base64,...)

## Storage Schema (IndexedDB)

### Object Stores

1. **game_sessions** (keyPath: 'id')
   - Stores GameSession objects
   - Indexes: startTime, difficulty, boardSize

2. **print_jobs** (keyPath: 'id')
   - Stores PrintJob objects
   - Indexes: createdAt

### Cleanup Policy

- Maximum 50 GameSession objects retained
- Oldest sessions removed when limit exceeded
- PrintJob objects not retained (sessionStorage only)

## TypeScript Type Definitions

```typescript
// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Board sizes
export type BoardSize = 4 | 6 | 9;

// Input methods
export type InputType = 'click' | 'drag';

// Cell interface
export interface Cell {
  row: number;
  col: number;
  value: number | null;
  isFixed: boolean;
  isValid: boolean | null;
}

// Sudoku board interface
export interface SudokuBoard {
  size: BoardSize;
  cells: Cell[][];
}

// User input interface
export interface UserInput {
  id: string;
  sessionId: string;
  timestamp: number;
  row: number;
  col: number;
  value: number;
  inputType: InputType;
  isCorrect: boolean;
}

// Game session interface
export interface GameSession {
  id: string;
  startTime: number;
  endTime: number | null;
  elapsedTime: number;
  difficulty: Difficulty;
  boardSize: BoardSize;
  initialBoard: number[][];
  solution: number[][];
  userInputs: UserInput[];
  errorCount: number;
  isCompleted: boolean;
}

// Printable game interface
export interface PrintableGame {
  id: string;
  sequence: number;
  board: SudokuBoard;
  solution: number[][];
  qrCodeDataUrl: string;
}

// Print job interface
export interface PrintJob {
  id: string;
  count: number;
  difficulty: Difficulty;
  boardSize: BoardSize;
  pageSize: 'A4' | 'Letter';
  games: PrintableGame[];
  createdAt: number;
}
```

## Data Flow

### Game Creation Flow

1. User selects difficulty and board size
2. System generates complete solution using backtracking
3. System creates puzzle by removing cells based on difficulty
4. System creates GameSession with initialBoard and solution
5. System stores GameSession in IndexedDB

### Gameplay Flow

1. User places number (click or drag)
2. System creates UserInput record
3. System validates against solution
4. If correct: commit to game state, update cell value
5. If incorrect: increment errorCount, bounce animation
6. If all cells correct: mark GameSession as completed

### Print Generation Flow

1. User selects puzzle count, difficulty, and board size
2. System generates N puzzles with solutions
3. System creates N PrintableGame objects with QR codes
4. System creates PrintJob object
5. System stores solution in sessionStorage for QR verification
6. System displays print preview

### History Viewing Flow

1. User navigates to history page
2. System reads all GameSession objects from IndexedDB
3. System displays sorted list (newest first)
4. User can delete or export sessions

## Relationships Diagram

```
GameSession (1) ──< (N) UserInput
PrintJob (1) ──< (N) PrintableGame
PrintableGame (1) ──> (1) SudokuBoard
SudokuBoard (1) ──< (N×N) Cell
```
