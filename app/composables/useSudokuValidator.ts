import type { Board, Cell, BoardSize } from '~/types'
import { BOX_DIMENSIONS } from '~/types'

/**
 * Sudoku Validator for checking moves and board state
 */
export function useSudokuValidator() {
  /**
   * Check if a value is correct for a specific cell
   */
  function isValueCorrect(cell: Cell, value: number): boolean {
    return cell.solution === value
  }
  
  /**
   * Check if placing a value at position would violate sudoku rules
   * (regardless of solution - for hint/conflict highlighting)
   */
  function hasConflict(board: Board, row: number, col: number, value: number): boolean {
    const { size, cells, boxWidth, boxHeight } = board
    
    // Check row
    for (let c = 0; c < size; c++) {
      if (c !== col && cells[row][c].value === value) {
        return true
      }
    }
    
    // Check column
    for (let r = 0; r < size; r++) {
      if (r !== row && cells[r][col].value === value) {
        return true
      }
    }
    
    // Check box
    const boxRowStart = Math.floor(row / boxHeight) * boxHeight
    const boxColStart = Math.floor(col / boxWidth) * boxWidth
    
    for (let r = boxRowStart; r < boxRowStart + boxHeight; r++) {
      for (let c = boxColStart; c < boxColStart + boxWidth; c++) {
        if ((r !== row || c !== col) && cells[r][c].value === value) {
          return true
        }
      }
    }
    
    return false
  }
  
  /**
   * Get all cells that conflict with a given cell's value
   */
  function getConflictingCells(board: Board, row: number, col: number): Cell[] {
    const { size, cells, boxWidth, boxHeight } = board
    const value = cells[row][col].value
    
    if (value === null) return []
    
    const conflicts: Cell[] = []
    
    // Check row
    for (let c = 0; c < size; c++) {
      if (c !== col && cells[row][c].value === value) {
        conflicts.push(cells[row][c])
      }
    }
    
    // Check column
    for (let r = 0; r < size; r++) {
      if (r !== row && cells[r][col].value === value) {
        conflicts.push(cells[r][col])
      }
    }
    
    // Check box
    const boxRowStart = Math.floor(row / boxHeight) * boxHeight
    const boxColStart = Math.floor(col / boxWidth) * boxWidth
    
    for (let r = boxRowStart; r < boxRowStart + boxHeight; r++) {
      for (let c = boxColStart; c < boxColStart + boxWidth; c++) {
        if ((r !== row || c !== col) && cells[r][c].value === value) {
          // Avoid duplicates
          if (!conflicts.some(cell => cell.row === r && cell.col === c)) {
            conflicts.push(cells[r][c])
          }
        }
      }
    }
    
    return conflicts
  }
  
  /**
   * Check if the board is completely and correctly filled
   */
  function isBoardComplete(board: Board): boolean {
    const { size, cells } = board
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = cells[row][col]
        if (cell.value === null || cell.value !== cell.solution) {
          return false
        }
      }
    }
    
    return true
  }
  
  /**
   * Count remaining empty cells
   */
  function countEmptyCells(board: Board): number {
    const { size, cells } = board
    let count = 0
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (cells[row][col].value === null) {
          count++
        }
      }
    }
    
    return count
  }
  
  /**
   * Count incorrect cells (filled but wrong)
   */
  function countIncorrectCells(board: Board): number {
    const { size, cells } = board
    let count = 0
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = cells[row][col]
        if (cell.value !== null && cell.value !== cell.solution) {
          count++
        }
      }
    }
    
    return count
  }
  
  /**
   * Get cells in the same row, column, or box as the given cell
   */
  function getRelatedCells(board: Board, row: number, col: number): Cell[] {
    const { size, cells, boxWidth, boxHeight } = board
    const related: Cell[] = []
    const seen = new Set<string>()
    
    const addCell = (r: number, c: number) => {
      const key = `${r}-${c}`
      if (!seen.has(key) && (r !== row || c !== col)) {
        seen.add(key)
        related.push(cells[r][c])
      }
    }
    
    // Same row
    for (let c = 0; c < size; c++) {
      addCell(row, c)
    }
    
    // Same column
    for (let r = 0; r < size; r++) {
      addCell(r, col)
    }
    
    // Same box
    const boxRowStart = Math.floor(row / boxHeight) * boxHeight
    const boxColStart = Math.floor(col / boxWidth) * boxWidth
    
    for (let r = boxRowStart; r < boxRowStart + boxHeight; r++) {
      for (let c = boxColStart; c < boxColStart + boxWidth; c++) {
        addCell(r, c)
      }
    }
    
    return related
  }
  
  return {
    isValueCorrect,
    hasConflict,
    getConflictingCells,
    isBoardComplete,
    countEmptyCells,
    countIncorrectCells,
    getRelatedCells,
  }
}
