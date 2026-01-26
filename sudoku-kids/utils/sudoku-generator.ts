/**
 * Sudoku Generator
 * Reference: plan.md §算法设计 - 数独生成算法
 * Reference: tasks.md T008
 */

import type { BoardSize, Difficulty, SudokuBoard, Cell } from '../types/sudoku';
import { isValidPlacement } from './sudoku-solver';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

/**
 * Generate a complete filled sudoku grid
 * Uses backtracking with randomization
 */
function generateFilledGrid(size: BoardSize): number[][] {
  const grid: (number | null)[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  function fillGrid(row: number, col: number): boolean {
    if (row === size) return true;
    
    const nextRow = col === size - 1 ? row + 1 : row;
    const nextCol = col === size - 1 ? 0 : col + 1;

    const numbers = shuffleArray(Array.from({ length: size }, (_, i) => i + 1));

    for (const num of numbers) {
      if (isValidPlacement(grid, row, col, num, size)) {
        grid[row]![col] = num;
        if (fillGrid(nextRow, nextCol)) {
          return true;
        }
        grid[row]![col] = null;
      }
    }
    return false;
  }

  fillGrid(0, 0);
  return grid as number[][];
}

/**
 * Get number of cells to remove based on difficulty
 * Reference: plan.md §算法设计
 * - Easy: 30-40% removed
 * - Medium: 45-55% removed  
 * - Hard: 60-70% removed
 */
function getRemovalCount(size: BoardSize, difficulty: Difficulty): number {
  const totalCells = size * size;
  
  const removalPercentage: Record<Difficulty, Record<BoardSize, number>> = {
    easy: { 4: 0.35, 6: 0.35, 9: 0.40 },
    medium: { 4: 0.45, 6: 0.50, 9: 0.55 },
    hard: { 4: 0.55, 6: 0.60, 9: 0.65 },
  };

  return Math.floor(totalCells * removalPercentage[difficulty][size]);
}

/**
 * Create puzzle by removing cells from complete solution
 */
function createPuzzle(
  solution: number[][],
  size: BoardSize,
  difficulty: Difficulty
): (number | null)[][] {
  const puzzle: (number | null)[][] = solution.map(row => [...row]);
  const removalCount = getRemovalCount(size, difficulty);
  
  // Create list of all positions
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push({ row, col });
    }
  }
  
  // Shuffle and remove cells
  const shuffledPositions = shuffleArray(positions);
  let removed = 0;

  for (const { row, col } of shuffledPositions) {
    if (removed >= removalCount) break;
    puzzle[row]![col] = null;
    removed++;
  }

  return puzzle;
}

/**
 * Create Cell objects from puzzle grid
 * Reference: spec.md §FR-005 - distinguish pre-filled vs user-filled
 */
function createCellsFromGrid(
  puzzle: (number | null)[][],
  size: BoardSize
): Cell[][] {
  const cells: Cell[][] = [];
  
  for (let row = 0; row < size; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < size; col++) {
      const value = puzzle[row]![col] ?? null;
      rowCells.push({
        row,
        col,
        value,
        isPreFilled: value !== null, // Pre-filled cells cannot be edited
        isError: false,
        isSelected: false,
      });
    }
    cells.push(rowCells);
  }
  
  return cells;
}

/**
 * Generate a complete sudoku puzzle
 * Reference: spec.md §FR-001, §FR-002
 * 
 * @param size - Board size (4, 6, or 9)
 * @param difficulty - Difficulty level
 * @returns Complete SudokuBoard with puzzle and solution
 */
export function generateSudoku(
  size: BoardSize,
  difficulty: Difficulty
): SudokuBoard {
  const solution = generateFilledGrid(size);
  const puzzle = createPuzzle(solution, size, difficulty);
  const cells = createCellsFromGrid(puzzle, size);

  return {
    size,
    cells,
    solution,
  };
}

/**
 * Generate multiple puzzles for batch printing
 * Reference: spec.md §US5-4 - batch print up to 10
 * Reference: spec.md Clarification - max 10 to avoid performance issues
 */
export function generateMultiplePuzzles(
  count: number,
  size: BoardSize,
  difficulty: Difficulty
): SudokuBoard[] {
  const puzzles: SudokuBoard[] = [];
  const maxCount = Math.min(count, 10); // Limit per spec clarification
  
  for (let i = 0; i < maxCount; i++) {
    puzzles.push(generateSudoku(size, difficulty));
  }
  return puzzles;
}
