# Data Model: 数独学习游戏

**Feature**: 001-sudoku-game  
**Date**: 2026-01-27  
**Source**: spec.md Key Entities + Functional Requirements

## Entities

### 1. Game (游戏)

当前进行中的数独游戏实例。

```typescript
interface Game {
  id: string                    // UUID, 游戏唯一标识
  boardSize: BoardSize          // 棋盘大小: 4 | 6 | 9
  difficulty: Difficulty        // 难度级别
  initialBoard: Board           // 初始棋盘状态（预填数字）
  currentBoard: Board           // 当前棋盘状态（用户填入）
  solution: Board               // 完整解答
  startTime: number             // 开始时间戳 (ms)
  pausedDuration: number        // 暂停累计时长 (ms)
  errorCount: number            // 错误次数
  status: GameStatus            // 游戏状态
  createdAt: string             // ISO 8601 日期时间
}

type BoardSize = 4 | 6 | 9
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'
type GameStatus = 'playing' | 'paused' | 'completed' | 'abandoned'
```

**Validation Rules**:
- `id` MUST be a valid UUID v4
- `boardSize` MUST be one of [4, 6, 9]
- `difficulty` MUST be one of ['easy', 'medium', 'hard', 'expert']
- `errorCount` MUST be >= 0
- `startTime` MUST be a valid Unix timestamp in milliseconds

**State Transitions**:
```
[new] --> playing --> completed
              |
              +--> paused --> playing
              |
              +--> abandoned
```

---

### 2. Board (棋盘)

数独棋盘数据结构，二维数组表示。

```typescript
interface Board {
  size: BoardSize               // 棋盘大小
  cells: Cell[][]               // 二维单元格数组 [row][col]
}
```

**Validation Rules**:
- `cells.length` MUST equal `size`
- `cells[i].length` MUST equal `size` for all rows
- 4×4 棋盘分为 4 个 2×2 宫格
- 6×6 棋盘分为 6 个 2×3 宫格
- 9×9 棋盘分为 9 个 3×3 宫格

---

### 3. Cell (单元格)

棋盘中的单个格子。

```typescript
interface Cell {
  row: number                   // 行索引 (0-based)
  col: number                   // 列索引 (0-based)
  value: number | null          // 当前值 (1-9 或 null)
  isPreFilled: boolean          // 是否为预填数字
  isCorrect: boolean | null     // 是否正确 (null = 未填)
}
```

**Validation Rules**:
- `row` MUST be in range [0, boardSize - 1]
- `col` MUST be in range [0, boardSize - 1]
- `value` MUST be in range [1, boardSize] or null
- `isPreFilled` cells MUST NOT be editable

---

### 4. GameRecord (游戏记录)

已完成或放弃的游戏记录，用于历史查看。

```typescript
interface GameRecord {
  id: string                    // 与 Game.id 相同
  boardSize: BoardSize          // 棋盘大小
  difficulty: Difficulty        // 难度级别
  initialBoard: Board           // 初始棋盘
  finalBoard: Board             // 最终棋盘
  duration: number              // 用时 (ms)
  errorCount: number            // 错误次数
  status: 'completed' | 'abandoned'  // 完成状态
  completedAt: string           // ISO 8601 完成时间
}
```

**Validation Rules**:
- `duration` MUST be >= 0
- `completedAt` MUST be a valid ISO 8601 string
- 存储上限: 100 条记录 (LRU 淘汰)

---

### 5. Settings (用户设置)

用户偏好设置，持久化到 localStorage。

```typescript
interface Settings {
  defaultBoardSize: BoardSize   // 默认棋盘大小
  defaultDifficulty: Difficulty // 默认难度
  soundEnabled: boolean         // 音效开关
  language: 'zh' | 'en'         // 界面语言
}
```

**Default Values**:
```typescript
const DEFAULT_SETTINGS: Settings = {
  defaultBoardSize: 4,
  defaultDifficulty: 'easy',
  soundEnabled: true,
  language: 'zh'
}
```

---

### 6. CurrentGameState (当前游戏状态)

用于游戏中断恢复，保存到 localStorage。

```typescript
interface CurrentGameState {
  game: Game | null             // 当前游戏 (null = 无进行中游戏)
  savedAt: string               // ISO 8601 保存时间
}
```

---

## Difficulty Presets (难度预设)

根据 FR-029/030/031 定义的预填数字数量：

```typescript
const PREFILLED_COUNTS: Record<BoardSize, Record<Difficulty, number>> = {
  4: { easy: 10, medium: 8, hard: 6, expert: 4 },
  6: { easy: 22, medium: 18, hard: 14, expert: 12 },
  9: { easy: 36, medium: 30, hard: 24, expert: 18 }
}
```

---

## Print Configuration (打印配置)

根据 FR-018 定义的每页打印数量：

```typescript
const PRINT_COUNTS: Record<BoardSize, number> = {
  4: 8,   // 4×4 棋盘每页 8 个
  6: 6,   // 6×6 棋盘每页 6 个
  9: 4    // 9×9 棋盘每页 4 个
}
```

---

## Storage Keys

```typescript
const STORAGE_KEYS = {
  GAME_RECORDS: 'sudoku_records',      // GameRecord[]
  CURRENT_GAME: 'sudoku_current_game', // CurrentGameState
  SETTINGS: 'sudoku_settings'          // Settings
}
```

