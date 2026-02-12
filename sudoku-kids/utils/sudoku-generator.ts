import type { BoardSize, Difficulty, SudokuBoard } from '~/types/sudoku';
import { createEmptyBoard, isValidPlacement } from './sudoku-validator';

export function generateCompleteSolution(size: BoardSize): SudokuBoard {
  const board = createEmptyBoard(size);

  function backtrack(row: number, col: number): boolean {
    if (row === size) return true;

    const nextRow = col === size - 1 ? row + 1 : row;
    const nextCol = col === size - 1 ? 0 : col + 1;

    const numbers = Array.from({ length: size }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

    for (const num of numbers) {
      if (isValidPlacement(board, row, col, num)) {
        board.cells[row][col].value = num;

        if (backtrack(nextRow, nextCol)) {
          return true;
        }

        board.cells[row][col].value = null;
      }
    }

    return false;
  }

  backtrack(0, 0);
  return board;
}

export function createPuzzle(solution: SudokuBoard, difficulty: Difficulty): SudokuBoard {
  const puzzle = createEmptyBoard(solution.size);

  for (let row = 0; row < solution.size; row++) {
    for (let col = 0; col < solution.size; col++) {
      puzzle.cells[row][col].value = solution.cells[row][col].value;
    }
  }

  const totalCells = solution.size * solution.size;
  const removalRates = {
    easy: 0.5,
    medium: 0.4,
    hard: 0.3
  };
  const cellsToRemove = Math.floor(totalCells * removalRates[difficulty]);

  const positions: [number, number][] = [];
  for (let row = 0; row < solution.size; row++) {
    for (let col = 0; col < solution.size; col++) {
      positions.push([row, col]);
    }
  }
  positions.sort(() => Math.random() - 0.5);

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) break;

    const originalValue = puzzle.cells[row][col].value;
    puzzle.cells[row][col].value = null;

    if (hasUniqueSolution(puzzle)) {
      removed++;
    } else {
      puzzle.cells[row][col].value = originalValue;
    }
  }

  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size; col++) {
      if (puzzle.cells[row][col].value !== null) {
        puzzle.cells[row][col].isFixed = true;
      }
    }
  }

  return puzzle;
}

export function hasUniqueSolution(board: SudokuBoard): boolean {
  let solutionCount = 0;

  function countSolutions(row: number, col: number): void {
    if (solutionCount > 1) return;

    if (row === board.size) {
      solutionCount++;
      return;
    }

    const nextRow = col === board.size - 1 ? row + 1 : row;
    const nextCol = col === board.size - 1 ? 0 : col + 1;

    if (board.cells[row][col].value !== null) {
      countSolutions(nextRow, nextCol);
      return;
    }

    for (let num = 1; num <= board.size; num++) {
      if (isValidPlacement(board, row, col, num)) {
        board.cells[row][col].value = num;
        countSolutions(nextRow, nextCol);
        board.cells[row][col].value = null;

        if (solutionCount > 1) return;
      }
    }
  }

  countSolutions(0, 0);
  return solutionCount === 1;
}

export function boardToMatrix(board: SudokuBoard): number[][] {
  return board.cells.map(row => row.map(cell => cell.value ?? 0));
}

export function cloneBoard(board: SudokuBoard): SudokuBoard {
  const newBoard = createEmptyBoard(board.size);
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      newBoard.cells[row][col].value = board.cells[row][col].value;
      newBoard.cells[row][col].isFixed = board.cells[row][col].isFixed;
    }
  }
  return newBoard;
}
