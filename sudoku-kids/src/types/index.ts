export type BoardSize = 4 | 6 | 9;
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'victory';

export interface Puzzle {
  id: string;
  boardSize: BoardSize;
  difficulty: Difficulty;
  solution: number[][];
  initialBoard: number[][];
  currentBoard: number[][];
  createdAt: Date;
}

export interface GameSession {
  id: string;
  puzzleId: string;
  difficulty: Difficulty;
  boardSize: BoardSize;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  errorCount: number;
  completed: boolean;
  boardState: number[][];
}

export interface GameHistory {
  sessions: GameSession[];
  totalGames: number;
  totalCompleted: number;
  averageDuration?: number;
  totalErrors: number;
}

export interface TimerState {
  elapsedSeconds: number;
  isRunning: boolean;
  lastTick?: Date;
}

export interface PrintConfig {
  puzzleCount: number;
  paperSize: 'A4' | 'Letter';
  includeAnswerKey: boolean;
  difficulty: Difficulty;
  boardSize: BoardSize;
}

export interface GameSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  hapticFeedback: boolean;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface DragState {
  isDragging: boolean;
  number: number | null;
  sourceCell: CellPosition | null;
}
