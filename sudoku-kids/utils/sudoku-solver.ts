import type { BoardSize, BoxDimensions } from '../types/sudoku';
import { getBoxDimensions } from '../types/sudoku';

export function isValidPlacement(
  grid: (number | null)[][],
  row: number,
  col: number,
  num: number,
  size: BoardSize
): boolean {
  const box = getBoxDimensions(size);
  
  for (let c = 0; c < size; c++) {
    if (grid[row][c] === num) return false;
  }
  
  for (let r = 0; r < size; r++) {
    if (grid[r][col] === num) return false;
  }
  
  const boxRowStart = Math.floor(row / box.rows) * box.rows;
  const boxColStart = Math.floor(col / box.cols) * box.cols;
  
  for (let r = boxRowStart; r < boxRowStart + box.rows; r++) {
    for (let c = boxColStart; c < boxColStart + box.cols; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  
  return true;
}

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
                return true;
              }
              g[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    solutionCount++;
    return solutionCount > 1;
  }
  
  const gridCopy = grid.map(row => [...row]);
  countSolutions(gridCopy);
  return solutionCount === 1;
}

export function validateBoard(
  grid: (number | null)[][],
  solution: number[][],
  size: BoardSize
): { row: number; col: number; isError: boolean }[] {
  const errors: { row: number; col: number; isError: boolean }[] = [];
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const value = grid[row][col];
      if (value !== null && value !== solution[row][col]) {
        errors.push({ row, col, isError: true });
      }
    }
  }
  
  return errors;
}

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
