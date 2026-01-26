/**
 * Sudoku Generator Tests
 * Reference: tasks.md T009
 */

import { describe, it, expect } from 'vitest';
import { generateSudoku, generateMultiplePuzzles } from '../../utils/sudoku-generator';
import { isValidPlacement } from '../../utils/sudoku-solver';
import type { BoardSize, Difficulty } from '../../types/sudoku';

describe('generateSudoku', () => {
  const sizes: BoardSize[] = [4, 6, 9];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  sizes.forEach((size) => {
    it(`should generate valid ${size}x${size} board`, () => {
      const board = generateSudoku(size, 'easy');
      
      expect(board.size).toBe(size);
      expect(board.cells).toHaveLength(size);
      expect(board.cells[0]).toHaveLength(size);
      expect(board.solution).toHaveLength(size);
      expect(board.solution[0]).toHaveLength(size);
    });

    it(`should have valid solution for ${size}x${size} board`, () => {
      const board = generateSudoku(size, 'easy');
      
      // Check solution is valid sudoku
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const value = board.solution[row]![col]!;
          // Temporarily remove value to check placement
          const testGrid: (number | null)[][] = board.solution.map(r => [...r]);
          testGrid[row]![col] = null;
          expect(isValidPlacement(testGrid, row, col, value, size)).toBe(true);
        }
      }
    });
  });

  difficulties.forEach((difficulty) => {
    it(`should generate puzzle with ${difficulty} difficulty`, () => {
      const board = generateSudoku(4, difficulty);
      
      // Count pre-filled cells
      let preFilledCount = 0;
      for (const row of board.cells) {
        for (const cell of row) {
          if (cell.isPreFilled) {
            preFilledCount++;
          }
        }
      }
      
      // Should have some pre-filled cells
      expect(preFilledCount).toBeGreaterThan(0);
      // Should have some empty cells
      expect(preFilledCount).toBeLessThan(16);
    });
  });

  it('should mark pre-filled cells correctly', () => {
    const board = generateSudoku(4, 'easy');
    
    for (const row of board.cells) {
      for (const cell of row) {
        if (cell.value !== null) {
          expect(cell.isPreFilled).toBe(true);
        } else {
          expect(cell.isPreFilled).toBe(false);
        }
      }
    }
  });

  it('should initialize cells with no errors and not selected', () => {
    const board = generateSudoku(4, 'easy');
    
    for (const row of board.cells) {
      for (const cell of row) {
        expect(cell.isError).toBe(false);
        expect(cell.isSelected).toBe(false);
      }
    }
  });

  it('should match cell positions with row/col indices', () => {
    const board = generateSudoku(4, 'easy');
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        expect(board.cells[row]![col]!.row).toBe(row);
        expect(board.cells[row]![col]!.col).toBe(col);
      }
    }
  });
});

describe('generateMultiplePuzzles', () => {
  it('should generate requested number of puzzles', () => {
    const puzzles = generateMultiplePuzzles(5, 4, 'easy');
    expect(puzzles).toHaveLength(5);
  });

  it('should limit to 10 puzzles maximum per spec clarification', () => {
    const puzzles = generateMultiplePuzzles(15, 4, 'easy');
    expect(puzzles).toHaveLength(10);
  });

  it('should generate different puzzles', () => {
    const puzzles = generateMultiplePuzzles(3, 4, 'easy');
    
    // Check that at least some puzzles are different
    const firstSolution = JSON.stringify(puzzles[0]!.solution);
    const secondSolution = JSON.stringify(puzzles[1]!.solution);
    const thirdSolution = JSON.stringify(puzzles[2]!.solution);
    
    // Very unlikely all three are the same
    const allSame = firstSolution === secondSolution && secondSolution === thirdSolution;
    expect(allSame).toBe(false);
  });
});
