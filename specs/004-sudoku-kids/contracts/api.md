# API Contracts: 数独学习游戏

**Feature**: 小学生数独学习游戏  
**Date**: 2025-02-12  
**Protocol**: Composables API (Vue 3 Composition API functions)

> Note: This is a pure frontend application. These "APIs" are actually Vue Composables and Store methods that components call. They follow a structured contract pattern for consistency.

---

## Composables API

### `useSudoku()` - 数独游戏核心逻辑

负责数独生成、验证、状态管理。

#### Methods

##### `generateGame(difficulty, boardSize): GameSession`

生成新的数独游戏会话。

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `difficulty` | `'easy' \| 'medium' \| 'hard'` | 难度级别 |
| `boardSize` | `4 \| 6 \| 9` | 面板大小 |

**Returns:** `GameSession` - 新创建的游戏会话

**Algorithm:**
1. 使用回溯算法生成完整解答
2. 根据难度挖空指定数量格子
3. 验证唯一解
4. 创建 GameSession 对象

**Example:**
```typescript
const { generateGame } = useSudoku();
const session = generateGame('medium', 9);
```

---

##### `validateInput(sessionId, row, col, value): ValidationResult`

验证用户填入的数字是否正确。

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `sessionId` | `string` | 游戏会话ID |
| `row` | `number` | 行索引 (0-based) |
| `col` | `number` | 列索引 (0-based) |
| `value` | `number` | 填入的数字 |

**Returns:** `ValidationResult`
```typescript
interface ValidationResult {
  isCorrect: boolean;      // 是否正确
  expectedValue: number;   // 正确答案
  errorCount: number;      // 当前错误次数（如果是错的）
  isCompleted: boolean;    // 是否完成整个游戏
}
```

**Performance:** Must respond within 500ms (SC-003)

---

##### `checkCompletion(sessionId): boolean`

检查游戏是否已完成（所有格子正确填满）。

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `sessionId` | `string` | 游戏会话ID |

**Returns:** `boolean` - 是否完成

---

### `useTimer()` - 计时器逻辑

管理游戏计时器状态。

#### State

| State | Type | Description |
|-------|------|-------------|
| `elapsedTime` | `Ref<number>` | 已用时间（秒） |
| `isRunning` | `Ref<boolean>` | 是否正在计时 |
| `isPaused` | `Ref<boolean>` | 是否暂停 |

#### Methods

##### `start(): void`

开始计时。

##### `pause(): void`

暂停计时（用户离开页面时）。

##### `resume(): void`

恢复计时。

##### `stop(): number`

停止计时并返回最终时间。

---

### `useStorage()` - 本地存储封装

封装 IndexedDB 操作。

#### Methods

##### `saveGame(session: GameSession): Promise<void>`

保存游戏会话到本地存储。

**Storage Schema:**
- Key: `game_history`
- Store: `game_sessions` (IndexedDB object store)

##### `loadHistory(): Promise<GameSession[]>`

加载所有游戏历史。

**Returns:** 按时间倒序排列的 GameSession 数组

##### `deleteGame(sessionId: string): Promise<void>`

删除指定游戏记录。

##### `exportHistory(): Promise<string>`

导出历史为 JSON 字符串（用于文件下载）。

**Returns:** JSON 字符串

---

### `usePrint()` - 打印功能逻辑

管理打印任务生成和预览。

#### Methods

##### `generatePrintJob(config: PrintConfig): PrintJob`

生成打印任务。

**Parameters:**
```typescript
interface PrintConfig {
  count: number;           // 1-6
  difficulty: Difficulty;
  boardSize: BoardSize;
  pageSize: 'A4' | 'Letter';
}
```

**Returns:** `PrintJob`

**Side Effects:**
- 生成 N 个 SudokuBoard
- 为每个游戏生成二维码 Data URL

---

##### `getAnswerById(gameId: string): number[][] | null`

通过游戏ID获取答案（用于扫码答案页面）。

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `gameId` | `string` | 游戏唯一ID |

**Returns:** 答案矩阵或 null（如果找不到）

**Storage:** 打印时临时存储在 `sessionStorage` 中，或编码在 URL hash 中

---

## Store API (Pinia)

### `useGameStore()` - 游戏状态管理

#### State

| State | Type | Description |
|-------|------|-------------|
| `currentSession` | `GameSession \| null` | 当前进行中的游戏 |
| `selectedDifficulty` | `Difficulty` | 选中的难度 |
| `selectedSize` | `BoardSize` | 选中的面板大小 |

#### Actions

##### `startNewGame(): void`

根据 `selectedDifficulty` 和 `selectedSize` 开始新游戏。

**Flow:**
1. 调用 `useSudoku().generateGame()`
2. 设置 `currentSession`
3. 调用 `useTimer().start()`
4. 导航到 `/play` 页面

##### `inputNumber(row, col, value, type): ValidationResult`

处理用户填入数字。

**Parameters:**
- `type`: `'click' | 'drag' | 'keyboard'`

**Flow:**
1. 调用 `useSudoku().validateInput()`
2. 如果是错误的，增加错误计数并播放动画
3. 如果是正确的，更新盘面状态
4. 调用 `useSudoku().checkCompletion()`，如果完成则触发胜利流程

##### `completeGame(): void`

完成游戏流程。

**Flow:**
1. 调用 `useTimer().stop()` 获取最终时间
2. 更新 `currentSession.isCompleted = true`
3. 调用 `useStorage().saveGame()` 保存记录
4. 显示胜利弹窗

---

### `useHistoryStore()` - 历史记录管理

#### State

| State | Type | Description |
|-------|------|-------------|
| `sessions` | `GameSession[]` | 所有游戏历史 |
| `isLoading` | `boolean` | 是否正在加载 |

#### Actions

##### `loadHistory(): Promise<void>`

从 IndexedDB 加载历史记录。

##### `deleteSession(sessionId: string): Promise<void>`

删除指定会话。

##### `exportToFile(): void`

导出历史为 JSON 文件下载。

---

## Component Events

### SudokuBoard.vue

| Event | Payload | Description |
|-------|---------|-------------|
| `cell-click` | `{ row: number, col: number }` | 格子被点击 |
| `cell-input` | `{ row: number, col: number, value: number, type: InputType }` | 数字被填入 |

### NumberPad.vue

| Event | Payload | Description |
|-------|---------|-------------|
| `number-select` | `number` | 数字被选中（点击模式） |
| `drag-start` | `number` | 开始拖拽数字 |

---

## Error Handling

### Error Types

| Error | Description | Handling |
|-------|-------------|----------|
| `GenerationError` | 数独生成失败（无法创建唯一解） | 重试最多3次，然后降级难度 |
| `StorageError` | IndexedDB 操作失败 | 降级到 localStorage，或提示用户 |
| `ValidationError` | 无效输入（如超出范围的行列） | 静默忽略，记录到 console |

---

## Performance Contracts

| Operation | Target | Measurement |
|-----------|--------|-------------|
| Game Generation | < 2s | 从点击开始到盘面显示 |
| Input Validation | < 500ms | 从输入到反馈显示 |
| History Load | < 1s | 从打开历史页面到列表显示 |
| Save Game | < 500ms | 游戏完成到保存完成 |

