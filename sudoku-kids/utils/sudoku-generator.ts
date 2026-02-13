import type { Difficulty, BoardSize, GameSession } from '~/types/sudoku'
import { createEmptyBoard, isValidPlacement } from './sudoku-validator'

export function generateCompleteSolution(size: BoardSize): number[][] {
  const board = createEmptyBoard(size)
  solveSudoku(board, 0, 0)
  return board
}

function solveSudoku(board: number[][], row: number, col: number): boolean {
  const size = board.length

  if (row === size) return true
  if (col === size) return solveSudoku(board, row + 1, 0)

  if (board[row][col] !== 0) return solveSudoku(board, row, col + 1)

  for (let num = 1; num <= size; num++) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num
      if (solveSudoku(board, row, col + 1)) return true
      board[row][col] = 0
    }
  }

  return false
}

export function createPuzzle(solution: number[][], difficulty: Difficulty): number[][] {
  const size = solution.length
  const puzzle = solution.map(row => [...row])

  const difficultyPercentages: Record<Difficulty, number> = {
    easy: 0.5,
    medium: 0.4,
    hard: 0.3
  }

  const cellsToRemove = Math.floor(size * size * (1 - difficultyPercentages[difficulty]))
  const positions: [number, number][] = []

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push([row, col])
    }
  }

  for (let i = 0; i < cellsToRemove; i++) {
    const randomIndex = Math.floor(Math.random() * positions.length)
    const [row, col] = positions[randomIndex]
    puzzle[row][col] = 0
    positions.splice(randomIndex, 1)
  }

  return puzzle
}

export function hasUniqueSolution(board: number[][]): boolean {
  const size = board.length
  let solutionCount = 0

  function countSolutions(b: number[][], row: number, col: number): boolean {
    if (solutionCount > 1) return false

    const size = b.length
    if (row === size) {
      solutionCount++
      return solutionCount <= 1
    }
    if (col === size) return countSolutions(b, row + 1, 0)

    if (b[row][col] !== 0) return countSolutions(b, row, col + 1)

    for (let num = 1; num <= size; num++) {
      if (isValidPlacement(b, row, col, num)) {
        b[row][col] = num
        if (!countSolutions(b, row, col + 1)) {
          b[row][col] = 0
          return false
        }
        b[row][col] = 0
      }
    }

    return true
  }

  return countSolutions(board.map(row => [...row]), 0, 0)
}

export function generateGame(difficulty: Difficulty, boardSize: BoardSize): GameSession {
  const solution = generateCompleteSolution(boardSize)
  const initialBoard = createPuzzle(solution, difficulty)

  return {
    id: crypto.randomUUID(),
    startTime: Date.now(),
    endTime: null,
    elapsedTime: 0,
    difficulty,
    boardSize,
    initialBoard,
    solution,
    userInputs: [],
    errorCount: 0,
    isCompleted: false
  }
}
