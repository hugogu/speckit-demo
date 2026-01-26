/**
 * Sudoku Types
 * Reference: plan.md §核心数据模型
 * Reference: spec.md §FR-001 (board sizes), §Key Entities
 */

/** Supported board sizes: 4×4, 6×6, 9×9 */
export type BoardSize = 4 | 6 | 9;

/** Difficulty levels per spec.md §FR-002 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Single cell in the sudoku board
 * Reference: spec.md §Key Entities - Cell
 */
export interface Cell {
  row: number;
  col: number;
  value: number | null;      // 1-9 (or 1-4/1-6) or null (empty)
  isPreFilled: boolean;      // True if generated, cannot be edited (spec.md §FR-005)
  isError: boolean;          // Marked as incorrect (spec.md §FR-006)
  isSelected: boolean;       // Currently selected by user
}

/**
 * Complete sudoku board with solution
 * Reference: spec.md §Key Entities - SudokuBoard
 */
export interface SudokuBoard {
  size: BoardSize;
  cells: Cell[][];           // 2D array of cells
  solution: number[][];      // Correct answer for validation (spec.md §FR-006)
}

/**
 * Current game state
 * Reference: spec.md §Key Entities - GameSession
 * Note: No timing per spec.md §FR-013 (Clarification: no timer to avoid pressure)
 */
export interface GameState {
  board: SudokuBoard | null;
  difficulty: Difficulty;
  size: BoardSize;
  isComplete: boolean;
  isChecking: boolean;
  selectedCell: { row: number; col: number } | null;
}

/**
 * Box dimensions for different board sizes
 * Reference: spec.md §FR-001 Clarification
 * - 4×4: 2×2 boxes, numbers 1-4
 * - 6×6: 2×3 boxes, numbers 1-6
 * - 9×9: 3×3 boxes, numbers 1-9
 */
export interface BoxDimensions {
  rows: number;
  cols: number;
}

/**
 * Get box dimensions for a given board size
 */
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

/**
 * Get valid number range for a given board size
 */
export function getNumberRange(size: BoardSize): number[] {
  return Array.from({ length: size }, (_, i) => i + 1);
}
