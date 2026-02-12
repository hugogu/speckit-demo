import type { Board, BoardSize } from '~/types'
import { BOX_DIMENSIONS } from '~/types'

// Check if a number can be placed in a cell according to Sudoku rules
export function isValidPlacement(board: Board, row: number, col: number, num: number): boolean {
  const size = board.size
  
  // Check row
  for (let i = 0; i < size; i++) {
    if (board.cells[row][i].value === num) return false
  }
  
  // Check column
  for (let i = 0; i < size; i++) {
    if (board.cells[i][col].value === num) return false
  }
  
  // Check box
  const { width, height } = BOX_DIMENSIONS[size]
  const boxRow = Math.floor(row / height) * height
  const boxCol = Math.floor(col / width) * width
  
  for (let i = boxRow; i < boxRow + height; i++) {
    for (let j = boxCol; j < boxCol + width; j++) {
      if (board.cells[i][j].value === num) return false
    }
  }
  
  return true
}

// Check if the entire board is valid (no conflicts)
export function isBoardValid(board: Board): boolean {
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const cell = board.cells[row][col]
      if (cell.value !== null && !isValidPlacement(board, row, col, cell.value)) {
        return false
      }
    }
  }
  return true
}

// Check if the board is completely filled and valid
export function isBoardComplete(board: Board): boolean {
  // Check if all cells are filled
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      if (board.cells[row][col].value === null) return false
    }
  }
  
  // Check if the board is valid
  return isBoardValid(board)
}
