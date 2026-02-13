export type Difficulty = 'easy' | 'medium' | 'hard'

export type BoardSize = 4 | 6 | 9

export type InputType = 'click' | 'drag'

export type GameStatus = 'created' | 'playing' | 'completed'

export interface Cell {
  row: number
  col: number
  value: number | null
  isFixed: boolean
  isValid: boolean | null
}

export interface SudokuBoard {
  size: BoardSize
  cells: Cell[][]
}

export interface UserInput {
  id: string
  sessionId: string
  timestamp: number
  row: number
  col: number
  value: number
  inputType: InputType
  isCorrect: boolean
}

export interface GameSession {
  id: string
  startTime: number
  endTime: number | null
  elapsedTime: number
  difficulty: Difficulty
  boardSize: BoardSize
  initialBoard: number[][]
  solution: number[][]
  userInputs: UserInput[]
  errorCount: number
  isCompleted: boolean
}

export interface PrintableGame {
  id: string
  sequence: number
  board: SudokuBoard
  solution: number[][]
  qrCodeDataUrl: string
}

export interface PrintJob {
  id: string
  count: number
  difficulty: Difficulty
  boardSize: BoardSize
  pageSize: 'A4' | 'Letter'
  games: PrintableGame[]
  createdAt: number
}

export interface ValidationResult {
  isCorrect: boolean
  expectedValue: number
  errorCount: number
  isCompleted: boolean
}
