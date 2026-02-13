import type { BoardSize } from '~/types/sudoku'

export function createEmptyBoard(size: BoardSize): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

export function checkRow(board: number[][], row: number, value: number): boolean {
  for (let col = 0; col < board[row].length; col++) {
    if (board[row][col] === value) return false
  }
  return true
}

export function checkCol(board: number[][], col: number, value: number): boolean {
  for (let row = 0; row < board.length; row++) {
    if (board[row][col] === value) return false
  }
  return true
}

export function checkBox(board: number[][], row: number, col: number, value: number): boolean {
  const size = board.length
  const boxSize = Math.sqrt(size)
  const boxRowStart = Math.floor(row / boxSize) * boxSize
  const boxColStart = Math.floor(col / boxSize) * boxSize

  for (let r = boxRowStart; r < boxRowStart + boxSize; r++) {
    for (let c = boxColStart; c < boxColStart + boxSize; c++) {
      if (board[r][c] === value) return false
    }
  }
  return true
}

export function isValidPlacement(board: number[][], row: number, col: number, value: number): boolean {
  return checkRow(board, row, value) && checkCol(board, col, value) && checkBox(board, row, col, value)
}

export function isValidBoard(board: number[][]): boolean {
  const size = board.length
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const value = board[row][col]
      if (value !== 0) {
        board[row][col] = 0
        if (!isValidPlacement(board, row, col, value)) {
          board[row][col] = value
          return false
        }
        board[row][col] = value
      }
    }
  }
  return true
}
