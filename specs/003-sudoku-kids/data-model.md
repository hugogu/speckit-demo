# 数据模型：儿童数独游戏

## 实体定义

### Puzzle (谜题)

表示一个数独谜题实例。

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 唯一标识符 (UUID) |
| boardSize | number | 是 | 棋盘尺寸 (4, 6, 9) |
| difficulty | string | 是 | 难度级别 (beginner, easy, medium, hard) |
| solution | number[][] | 是 | 完整解决方案矩阵 |
| initialBoard | number[][] | 是 | 初始谜题状态 (含预填数字) |
| currentBoard | number[][] | 是 | 当前游戏状态 |
| createdAt | Date | 是 | 创建时间 |

### GameSession (游戏会话)

记录单个游戏实例。

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 唯一标识符 (UUID) |
| puzzleId | string | 是 | 关联的谜题ID |
| difficulty | string | 是 | 难度级别 |
| boardSize | number | 是 | 棋盘尺寸 |
| startTime | Date | 是 | 游戏开始时间 |
| endTime | Date | 否 | 游戏结束时间 |
| duration | number | 否 | 完成耗时 (秒) |
| errorCount | number | 是 | 错误次数 |
| completed | boolean | 是 | 是否完成 |
| boardState | number[][] | 是 | 最终棋盘状态 |

### GameHistory (游戏历史)

用户游戏记录的集合。

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| sessions | GameSession[] | 是 | 游戏会话列表 |
| totalGames | number | 是 | 总游戏数 |
| totalCompleted | number | 是 | 完成游戏数 |
| averageDuration | number | 否 | 平均完成时间 |
| totalErrors | number | 是 | 总错误次数 |

### TimerState (计时器状态)

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| elapsedSeconds | number | 是 | 经过秒数 |
| isRunning | boolean | 是 | 是否运行中 |
| lastTick | Date | 否 | 最后更新时间 |

### PrintConfig (打印配置)

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| puzzleCount | number | 是 | 每页谜题数量 |
| paperSize | string | 是 | 纸张尺寸 (A4, Letter) |
| includeAnswerKey | boolean | 否 | 是否包含答案页 |
| difficulty | string | 是 | 谜题难度 |
| boardSize | number | 是 | 棋盘尺寸 |

## 状态机

### 游戏状态

```
┌─────────────┐
│   IDLE      │ ← 新游戏请求
└──────┬──────┘
       │
       ▼
┌─────────────┐     暂停      ┌─────────────┐
│   PLAYING   │ ───────────→ │   PAUSED    │
└──────┬──────┘              └──────┬──────┘
       │ 填写完成                  │
       ▼                          │
┌─────────────┐                   │
│  VICTORY    │ ←─────────────────┘
└─────────────┘
```

### 格子状态

- **预填格**: 不可编辑,显示为深色
- **已填写**: 用户填入数字
- **空**: 待填写
- **错误**: 临时标记,自动回退

## 验证规则

### 数独生成规则

1. 解决方案必须有效 (每行/列/框包含1-N的唯一数字)
2. 初始提示数量根据难度调整:
   - Beginner: 约50%格子预填
   - Easy: 约40%格子预填
   - Medium: 约30%格子预填
   - Hard: 约20%格子预填

### 输入验证

1. 数字必须在1-N范围内 (N=boardSize)
2. 不能修改预填格
3. 相同行/列/框中不能重复数字 (仅提示,不阻止)

## 关系图

```
GameSession ──belongs to──> Puzzle
GameHistory ──contains──> GameSession[]
GameStore ──manages──> Puzzle, GameSession, TimerState
```

## LocalStorage 键

| 键名 | 类型 | 描述 |
|------|------|------|
| sudoku-current-game | GameSession | 当前游戏状态 |
| sudoku-game-history | GameHistory | 游戏历史记录 |
| sudoku-settings | object | 用户设置 |
