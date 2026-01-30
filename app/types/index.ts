// Board sizes
export type BoardSize = 4 | 6 | 9

// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

// Game status
export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed'

// Cell interface
export interface Cell {
  row: number
  col: number
  value: number | null
  solution: number
  isPrefilled: boolean
  isCorrect: boolean | null
  isSelected: boolean
  isHighlighted: boolean
}

// Board interface
export interface Board {
  size: BoardSize
  cells: Cell[][]
  boxWidth: number
  boxHeight: number
}

// Game interface
export interface Game {
  id: string
  boardSize: BoardSize
  difficulty: Difficulty
  board: Board
  startTime: number
  endTime: number | null
  status: GameStatus
  errorCount: number
  moveCount: number
}

// Game record for history
export interface GameRecord {
  id: string
  boardSize: BoardSize
  difficulty: Difficulty
  initialBoard: number[][]
  finalBoard: number[][]
  solution: number[][]
  duration: number
  errorCount: number
  moveCount: number
  completedAt: number
  isCompleted: boolean
}

// Settings interface
export interface Settings {
  defaultBoardSize: BoardSize
  defaultDifficulty: Difficulty
  soundEnabled: boolean
  animationEnabled: boolean
}

// Difficulty presets - number of prefilled cells
export const PREFILLED_COUNTS: Record<BoardSize, Record<Difficulty, number>> = {
  4: {
    easy: 10,
    medium: 8,
    hard: 6,
    expert: 4,
  },
  6: {
    easy: 22,
    medium: 18,
    hard: 14,
    expert: 12,
  },
  9: {
    easy: 36,
    medium: 30,
    hard: 24,
    expert: 18,
  },
}

// Print configuration - puzzles per page
export const PRINT_COUNTS: Record<BoardSize, number> = {
  4: 8,
  6: 6,
  9: 4,
}

// Box dimensions for each board size
export const BOX_DIMENSIONS: Record<BoardSize, { width: number; height: number }> = {
  4: { width: 2, height: 2 },
  6: { width: 3, height: 2 },
  9: { width: 3, height: 3 },
}

// Storage keys
export const STORAGE_KEYS = {
  GAME_RECORDS: 'sudoku_game_records',
  CURRENT_GAME: 'sudoku_current_game',
  SETTINGS: 'sudoku_settings',
} as const

// Storage limits
export const STORAGE_LIMITS = {
  MAX_RECORDS: 100,
} as const

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  defaultBoardSize: 4,
  defaultDifficulty: 'easy',
  soundEnabled: true,
  animationEnabled: true,
}
