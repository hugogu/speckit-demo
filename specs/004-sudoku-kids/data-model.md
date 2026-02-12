# Data Model: 数独学习游戏

**Feature**: 小学生数独学习游戏  
**Date**: 2025-02-12  
**Phase**: 1 - 数据模型设计

---

## Entity Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GameSession    │────<│  SudokuBoard    │────<│   UserInput     │
│   (游戏会话)     │     │   (数独盘面)     │     │   (用户输入)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         │ contains
         ▼
┌─────────────────┐
│  GameHistory    │
│  (游戏历史列表)  │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   PrintJob      │────<│  PrintableGame  │
│   (打印任务)     │     │  (可打印游戏)    │
└─────────────────┘     └─────────────────┘
```

---

## GameSession (游戏会话)

代表一次完整的数独游戏过程。

### Attributes

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | `string` | 唯一标识符（UUID） | Primary Key |
| `startTime` | `number` | 游戏开始时间戳（ms） | Required |
| `endTime` | `number` | 游戏结束时间戳（ms） | Nullable |
| `difficulty` | `'easy' \| 'medium' \| 'hard'` | 难度级别 | Required |
| `boardSize` | `4 \| 6 \| 9` | 面板大小 | Required |
| `initialBoard` | `number[][]` | 初始盘面（0表示空格） | Required, 二维数组 |
| `solution` | `number[][]` | 完整答案 | Required, 二维数组 |
| `userInputs` | `UserInput[]` | 用户的所有填入操作 | Required, 默认为[] |
| `errorCount` | `number` | 错误次数统计 | Required, default: 0 |
| `isCompleted` | `boolean` | 是否已完成 | Required, default: false |
| `elapsedTime` | `number` | 已用时间（秒） | Required, default: 0 |

### State Transitions

```
CREATED (创建) 
  → PLAYING (游玩中) [用户开始填入]
  → PAUSED (暂停) [用户离开页面]
  → COMPLETED (完成) [所有格子正确填满]
```

---

## SudokuBoard (数独盘面)

代表数独游戏的盘面数据结构。

### Attributes

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `size` | `4 \| 6 \| 9` | 盘面尺寸 | Required |
| `boxRows` | `number` | 每个宫格的行数 | 4x4→2, 6x6→2, 9x9→3 |
| `boxCols` | `number` | 每个宫格的列数 | 4x4→2, 6x6→3, 9x9→3 |
| `cells` | `Cell[][]` | 二维格子数组 | Required |

### Cell (格子)

| Field | Type | Description |
|-------|------|-------------|
| `row` | `number` | 行索引（0-based） |
| `col` | `number` | 列索引（0-based） |
| `value` | `number \| null` | 当前值（null为空格） |
| `isFixed` | `boolean` | 是否为预填数字（不可修改） |
| `isValid` | `boolean \| null` | 验证状态（null=未验证） |
| `candidates` | `number[]` | 候选数字（可选功能） |

### Validation Rules

- **行约束**: 每行数字 1-size 不重复
- **列约束**: 每列数字 1-size 不重复
- **宫格约束**: 每个宫格数字 1-size 不重复
- **可解性**: 盘面必须有且仅有唯一解

---

## UserInput (用户输入)

代表一次具体的填入操作记录。

### Attributes

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | `string` | 输入操作ID | Primary Key |
| `sessionId` | `string` | 所属游戏会话ID | Foreign Key |
| `timestamp` | `number` | 操作时间戳 | Required |
| `row` | `number` | 目标行索引 | Required, 0 ≤ row < size |
| `col` | `number` | 目标列索引 | Required, 0 ≤ col < size |
| `value` | `number` | 填入的数字 | Required, 1 ≤ value ≤ size |
| `inputType` | `'click' \| 'drag' \| 'keyboard'` | 输入方式 | Required |
| `isCorrect` | `boolean` | 是否正确 | Required |

---

## GameHistory (游戏历史)

游戏历史记录的聚合结构。

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| `sessions` | `GameSession[]` | 游戏会话列表，按时间倒序 |
| `totalCount` | `number` | 总游戏次数 |
| `lastUpdated` | `number` | 最后更新时间戳 |

### Storage Schema (IndexedDB)

```typescript
// Key: 'game_history'
// Value: GameHistory
interface GameHistoryRecord {
  key: 'game_history';
  value: {
    sessions: GameSession[];
    totalCount: number;
    lastUpdated: number;
  };
}
```

### Query Patterns

- 获取最近N局: `sessions.slice(0, N)`
- 按难度筛选: `sessions.filter(s => s.difficulty === 'easy')`
- 按日期范围: `sessions.filter(s => s.startTime >= from && s.startTime <= to)`

---

## PrintJob (打印任务)

代表一次打印请求的配置。

### Attributes

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | `string` | 任务ID | Primary Key |
| `count` | `number` | 生成数量 | Required, 1 ≤ count ≤ 6 |
| `difficulty` | `'easy' \| 'medium' \| 'hard'` | 难度级别 | Required |
| `boardSize` | `4 \| 6 \| 9` | 面板大小 | Required |
| `pageSize` | `'A4' \| 'Letter'` | 页面尺寸 | Required, default: 'A4' |
| `games` | `PrintableGame[]` | 生成的可打印游戏 | Required |
| `createdAt` | `number` | 创建时间戳 | Required |

---

## PrintableGame (可打印游戏)

用于打印的单个数独游戏。

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | 游戏唯一ID（用于二维码） |
| `sequence` | `number` | 序号（1-6） |
| `board` | `SudokuBoard` | 数独盘面 |
| `solution` | `number[][]` | 完整答案 |
| `qrCodeDataUrl` | `string` | 二维码 Data URL |

---

## TypeScript Type Definitions

```typescript
// types/sudoku.ts

export type Difficulty = 'easy' | 'medium' | 'hard';
export type BoardSize = 4 | 6 | 9;
export type InputType = 'click' | 'drag' | 'keyboard';

export interface GameSession {
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

export interface Cell {
  row: number;
  col: number;
  value: number | null;
  isFixed: boolean;
  isValid: boolean | null;
}

export interface SudokuBoard {
  size: BoardSize;
  boxRows: number;
  boxCols: number;
  cells: Cell[][];
}

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

export interface GameHistory {
  sessions: GameSession[];
  totalCount: number;
  lastUpdated: number;
}

export interface PrintJob {
  id: string;
  count: number;
  difficulty: Difficulty;
  boardSize: BoardSize;
  pageSize: 'A4' | 'Letter';
  games: PrintableGame[];
  createdAt: number;
}

export interface PrintableGame {
  id: string;
  sequence: number;
  board: SudokuBoard;
  solution: number[][];
  qrCodeDataUrl: string;
}
```

---

## Data Flow

### Game Creation Flow
```
User selects difficulty & size
        ↓
Generate complete solution (backtracking)
        ↓
Remove cells based on difficulty
        ↓
Validate unique solution
        ↓
Create GameSession with initialBoard
        ↓
Start timer → PLAYING state
```

### Input Validation Flow
```
User inputs number (click/drag/keyboard)
        ↓
Check against solution[row][col]
        ↓
IF correct: Update cell, check completion
IF wrong: Increment errorCount, animate bounce back
        ↓
Save UserInput to session
        ↓
Update UI state
```

### Completion Flow
```
Last cell filled correctly
        ↓
Stop timer
        ↓
Set isCompleted = true
        ↓
Show victory modal with stats
        ↓
Save to GameHistory (IndexedDB)
```

### Print Flow
```
User configures print settings
        ↓
Generate N random SudokuBoards
        ↓
Generate QR codes for each game
        ↓
Render print preview (dedicated print page)
        ↓
Call window.print() with @media print styles
```
