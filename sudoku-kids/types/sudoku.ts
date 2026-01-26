export type BoardSize = 4 | 6 | 9;
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  row: number;
  col: number;
  value: number | null;
  isPreFilled: boolean;
  isError: boolean;
  isSelected: boolean;
}

export interface SudokuBoard {
  size: BoardSize;
  cells: Cell[][];
  solution: number[][];
}

export interface GameState {
  board: SudokuBoard | null;
  difficulty: Difficulty;
  size: BoardSize;
  isComplete: boolean;
  isChecking: boolean;
  selectedCell: { row: number; col: number } | null;
}

export interface BoxDimensions {
  rows: number;
  cols: number;
}

export function getBoxDimensions(size: BoardSize): BoxDimensions {
  switch (size) {
    case 4:
      return { rows: 2, cols: 2 };
    case 6:
      return { rows: 2, cols: 3 };
    case 9:
      return { rows: 3, cols: 3 };
  }
}

export function getNumberRange(size: BoardSize): number[] {
  return Array.from({ length: size }, (_, i) => i + 1);
}
