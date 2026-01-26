/**
 * Sudoku Solver Tests
 * Reference: tasks.md T010
 */

import { describe, it, expect } from 'vitest';
import {
  isValidPlacement,
  solveSudoku,
  validateBoard,
  isBoardComplete,
  isBoardCorrect,
} from '../../utils/sudoku-solver';

describe('isValidPlacement', () => {
  it('should return true for valid placement in empty grid', () => {
    const grid: (number | null)[][] = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    expect(isValidPlacement(grid, 0, 0, 1, 4)).toBe(true);
  });

  it('should return false if number exists in same row', () => {
    const grid: (number | null)[][] = [
      [1, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    expect(isValidPlacement(grid, 0, 1, 1, 4)).toBe(false);
  });

  it('should return false if number exists in same column', () => {
    const grid: (number | null)[][] = [
      [1, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    expect(isValidPlacement(grid, 1, 0, 1, 4)).toBe(false);
  });

  it('should return false if number exists in same box (4x4)', () => {
    const grid: (number | null)[][] = [
      [1, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    // 4x4 has 2x2 boxes, so (0,0) and (1,1) are in same box
    expect(isValidPlacement(grid, 1, 1, 1, 4)).toBe(false);
  });
});

describe('solveSudoku', () => {
  it('should solve a simple 4x4 puzzle', () => {
    const grid: (number | null)[][] = [
      [1, 2, null, null],
      [3, 4, null, null],
      [null, null, 1, 2],
      [null, null, 3, 4],
    ];
    const result = solveSudoku(grid, 4);
    expect(result).toBe(true);
    expect(grid[0]![2]).toBe(3);
    expect(grid[0]![3]).toBe(4);
  });
});

describe('validateBoard', () => {
  it('should return empty array when all answers are correct', () => {
    const grid: (number | null)[][] = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    const errors = validateBoard(grid, solution, 4);
    expect(errors).toHaveLength(0);
  });

  it('should return errors for incorrect cells', () => {
    const grid: (number | null)[][] = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 2], // Last cell should be 1, not 2
    ];
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    const errors = validateBoard(grid, solution, 4);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({ row: 3, col: 3, isError: true });
  });

  it('should not mark empty cells as errors', () => {
    const grid: (number | null)[][] = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, null], // Empty cell
    ];
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    const errors = validateBoard(grid, solution, 4);
    expect(errors).toHaveLength(0);
  });
});

describe('isBoardComplete', () => {
  it('should return true when all cells are filled', () => {
    const grid: (number | null)[][] = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    expect(isBoardComplete(grid, 4)).toBe(true);
  });

  it('should return false when some cells are empty', () => {
    const grid: (number | null)[][] = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, null],
    ];
    expect(isBoardComplete(grid, 4)).toBe(false);
  });
});

describe('isBoardCorrect', () => {
  it('should return true when board matches solution', () => {
    const grid: (number | null)[][] = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    expect(isBoardCorrect(grid, solution, 4)).toBe(true);
  });

  it('should return false when board has errors', () => {
    const grid: (number | null)[][] = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 2],
    ];
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    expect(isBoardCorrect(grid, solution, 4)).toBe(false);
  });
});
