/**
 * Sudoku Solver
 * Reference: plan.md §算法设计 - 数独验证算法
 * Reference: tasks.md T007
 */

import type { BoardSize } from '../types/sudoku';
import { getBoxDimensions } from '../types/sudoku';

/**
 * Check if placing a number at position is valid
 * Validates row, column, and box constraints
 */
export function isValidPlacement(
  grid: (number | null)[][],
  row: number,
  col: number,
  num: number,
  size: BoardSize
): boolean {
  const box = getBoxDimensions(size);
  
  // Check row constraint
  for (let c = 0; c < size; c++) {
    if (grid[row][c] === num) return false;
  }
  
  // Check column constraint
  for (let r = 0; r < size; r++) {
    if (grid[r][col] === num) return false;
  }
  
  // Check box constraint
  // Reference: spec.md §FR-001 - box dimensions vary by board size
  const boxRowStart = Math.floor(row / box.rows) * box.rows;
  const boxColStart = Math.floor(col / box.cols) * box.cols;
  
  for (let r = boxRowStart; r < boxRowStart + box.rows; r++) {
    for (let c = boxColStart; c < boxColStart + box.cols; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  
  return true;
}

/**
 * Solve sudoku using backtracking algorithm
 * Reference: plan.md §算法设计 - 回溯算法
 */
export function solveSudoku(
  grid: (number | null)[][],
  size: BoardSize
): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= size; num++) {
          if (isValidPlacement(grid, row, col, num, size)) {
            grid[row][col] = num;
            if (solveSudoku(grid, size)) {
              return true;
            }
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if puzzle has exactly one solution
 * Used during puzzle generation to ensure valid puzzles
 */
export function hasUniqueSolution(
  grid: (number | null)[][],
  size: BoardSize
): boolean {
  let solutionCount = 0;
  
  function countSolutions(g: (number | null)[][]): boolean {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (g[row][col] === null) {
          for (let num = 1; num <= size; num++) {
            if (isValidPlacement(g, row, col, num, size)) {
              g[row][col] = num;
              if (countSolutions(g)) {
                return true; // Found more than one solution, stop early
              }
              g[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    solutionCount++;
    return solutionCount > 1; // Stop if we found more than one
  }
  
  const gridCopy = grid.map(row => [...row]);
  countSolutions(gridCopy);
  return solutionCount === 1;
}

/**
 * Validate user's answers against the solution
 * Reference: spec.md §FR-006 - mark incorrect cells
 * Reference: spec.md §US4 Clarification - only check on button click, not realtime
 */
export function validateBoard(
  grid: (number | null)[][],
  solution: number[][],
  size: BoardSize
): { row: number; col: number; isError: boolean }[] {
  const errors: { row: number; col: number; isError: boolean }[] = [];
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const value = grid[row][col];
      // Only check filled cells, per spec.md §US4-3
      if (value !== null && value !== solution[row][col]) {
        errors.push({ row, col, isError: true });
      }
    }
  }
  
  return errors;
}

/**
 * Check if all cells are filled
 */
export function isBoardComplete(grid: (number | null)[][], size: BoardSize): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if board matches solution exactly
 * Used to trigger celebration per spec.md §FR-007
 */
export function isBoardCorrect(
  grid: (number | null)[][],
  solution: number[][],
  size: BoardSize
): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}
