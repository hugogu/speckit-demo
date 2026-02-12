import type { Puzzle, BoardSize, Difficulty } from '../types';

function getHintCount(boardSize: BoardSize, difficulty: Difficulty): number {
  const hintConfigs: Record<BoardSize, { beginner: number; easy: number; medium: number; hard: number }> = {
    4: { beginner: 10, easy: 8, medium: 6, hard: 4 },
    6: { beginner: 24, easy: 20, medium: 16, hard: 12 },
    9: { beginner: 41, easy: 36, medium: 30, hard: 24 },
  };
  return hintConfigs[boardSize][difficulty];
}

function createEmptyBoard(size: number): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function isValidPlacement(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < board.length; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const boxSize = Math.sqrt(board.length);
  const boxRow = Math.floor(row / boxSize) * boxSize;
  const boxCol = Math.floor(col / boxSize) * boxSize;

  for (let i = 0; i < boxSize; i++) {
    for (let j = 0; j < boxSize; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: number[][]): boolean {
  const size = board.length;
  let emptyRow = -1;
  let emptyCol = -1;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === 0) {
        emptyRow = i;
        emptyCol = j;
        break;
      }
    }
    if (emptyRow !== -1) break;
  }

  if (emptyRow === -1) return true;

  const numbers = shuffleArray([...Array(size).keys()].map(i => i + 1));

  for (const num of numbers) {
    if (isValidPlacement(board, emptyRow, emptyCol, num)) {
      board[emptyRow][emptyCol] = num;
      if (solveSudoku(board)) return true;
      board[emptyRow][emptyCol] = 0;
    }
  }

  return false;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateCompleteSolution(size: BoardSize): number[][] {
  const board = createEmptyBoard(size);
  solveSudoku(board);
  return board;
}

function removeNumbers(board: number[][], hintsToKeep: number[]): number[][] {
  const result = board.map(row => [...row]);
  const size = board.length;
  const positions: { row: number; col: number }[] = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.push({ row: i, col: j });
    }
  }

  const shuffledPositions = shuffleArray(positions);
  const cellsToRemove = size * size - hintsToKeep[0];

  for (let i = 0; i < cellsToRemove; i++) {
    const pos = shuffledPositions[i];
    result[pos.row][pos.col] = 0;
  }

  return result;
}

export function generatePuzzle(boardSize: BoardSize, difficulty: Difficulty): Puzzle {
  const solution = generateCompleteSolution(boardSize);
  const hintCount = getHintCount(boardSize, difficulty);
  const initialBoard = removeNumbers(solution, [hintCount]);

  return {
    id: crypto.randomUUID(),
    boardSize,
    difficulty,
    solution,
    initialBoard,
    currentBoard: initialBoard.map(row => [...row]),
    createdAt: new Date(),
  };
}

export function validateSolution(puzzle: Puzzle): boolean {
  const size = puzzle.boardSize;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (puzzle.currentBoard[i][j] !== puzzle.solution[i][j]) {
        return false;
      }
    }
  }

  return true;
}

export function checkConflict(
  board: number[][],
  row: number,
  col: number,
  value: number
): boolean {
  const size = board.length;

  for (let i = 0; i < size; i++) {
    if (i !== col && board[row][i] === value) return true;
    if (i !== row && board[i][col] === value) return true;
  }

  const boxSize = Math.sqrt(size);
  const boxRow = Math.floor(row / boxSize) * boxSize;
  const boxCol = Math.floor(col / boxSize) * boxSize;

  for (let i = 0; i < boxSize; i++) {
    for (let j = 0; j < boxSize; j++) {
      const r = boxRow + i;
      const c = boxCol + j;
      if ((r !== row || c !== col) && board[r][c] === value) return true;
    }
  }

  return false;
}
