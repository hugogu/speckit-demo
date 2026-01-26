import type { BoardSize, Difficulty, SudokuBoard, Cell } from '../types/sudoku';
import { getBoxDimensions } from '../types/sudoku';
import { isValidPlacement, solveSudoku } from './sudoku-solver';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
        grid[row][col] = num;
        if (fillGrid(nextRow, nextCol)) {
          return true;
        }
        grid[row][col] = null;
      }
    }
    return false;
  }

  fillGrid(0, 0);
  return grid as number[][];
}

function getRemovalCount(size: BoardSize, difficulty: Difficulty): number {
  const totalCells = size * size;
  
  const removalPercentage = {
    easy: { 4: 0.35, 6: 0.35, 9: 0.40 },
    medium: { 4: 0.45, 6: 0.50, 9: 0.55 },
    hard: { 4: 0.55, 6: 0.60, 9: 0.65 },
  };

  return Math.floor(totalCells * removalPercentage[difficulty][size]);
}

function createPuzzle(
  solution: number[][],
  size: BoardSize,
  difficulty: Difficulty
): (number | null)[][] {
  const puzzle: (number | null)[][] = solution.map(row => [...row]);
  const removalCount = getRemovalCount(size, difficulty);
  
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push({ row, col });
    }
  }
  
  const shuffledPositions = shuffleArray(positions);
  let removed = 0;

  for (const { row, col } of shuffledPositions) {
    if (removed >= removalCount) break;
    
    const backup = puzzle[row][col];
    puzzle[row][col] = null;
    removed++;
  }

  return puzzle;
}

function createCellsFromGrid(
  puzzle: (number | null)[][],
  size: BoardSize
): Cell[][] {
  const cells: Cell[][] = [];
  
  for (let row = 0; row < size; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < size; col++) {
      const value = puzzle[row][col];
      rowCells.push({
        row,
        col,
        value,
        isPreFilled: value !== null,
        isError: false,
        isSelected: false,
      });
    }
    cells.push(rowCells);
  }
  
  return cells;
}

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

export function generateMultiplePuzzles(
  count: number,
  size: BoardSize,
  difficulty: Difficulty
): SudokuBoard[] {
  const puzzles: SudokuBoard[] = [];
  for (let i = 0; i < Math.min(count, 10); i++) {
    puzzles.push(generateSudoku(size, difficulty));
  }
  return puzzles;
}
