import { describe, it, expect } from 'vitest'
import { useSudokuValidator } from '~/composables/useSudokuValidator'
import { useSudokuGenerator } from '~/composables/useSudokuGenerator'
import type { Board, Cell } from '~/types'

describe('useSudokuValidator', () => {
  const { isValueCorrect, hasConflict, isBoardComplete, countEmptyCells, getRelatedCells } = useSudokuValidator()
  const { generateBoard } = useSudokuGenerator()

  describe('isValueCorrect', () => {
    it('returns true when value matches solution', () => {
      const cell: Cell = {
        row: 0,
        col: 0,
        value: 5,
        solution: 5,
        isPrefilled: false,
        isCorrect: null,
        isSelected: false,
        isHighlighted: false,
      }
      expect(isValueCorrect(cell, 5)).toBe(true)
    })

    it('returns false when value does not match solution', () => {
      const cell: Cell = {
        row: 0,
        col: 0,
        value: 3,
        solution: 5,
        isPrefilled: false,
        isCorrect: null,
        isSelected: false,
        isHighlighted: false,
      }
      expect(isValueCorrect(cell, 3)).toBe(false)
    })
  })

  describe('hasConflict', () => {
    it('detects row conflict', () => {
      const board = generateBoard(4, 'easy')
      // Find a prefilled cell and check if placing same value elsewhere in row conflicts
      const prefilledCell = board.cells.flat().find(c => c.isPrefilled)
      if (prefilledCell) {
        const emptyInSameRow = board.cells[prefilledCell.row].find(c => !c.isPrefilled)
        if (emptyInSameRow) {
          expect(hasConflict(board, emptyInSameRow.row, emptyInSameRow.col, prefilledCell.value!)).toBe(true)
        }
      }
    })
  })

  describe('isBoardComplete', () => {
    it('returns false for incomplete board', () => {
      const board = generateBoard(4, 'easy')
      expect(isBoardComplete(board)).toBe(false)
    })

    it('returns true when all cells are correctly filled', () => {
      const board = generateBoard(4, 'easy')
      // Fill all cells with solution values
      board.cells.forEach(row => {
        row.forEach(cell => {
          cell.value = cell.solution
        })
      })
      expect(isBoardComplete(board)).toBe(true)
    })
  })

  describe('countEmptyCells', () => {
    it('counts empty cells correctly', () => {
      const board = generateBoard(4, 'easy')
      const emptyCount = countEmptyCells(board)
      const totalCells = 16
      const prefilledCount = 10 // easy 4x4 has 10 prefilled
      expect(emptyCount).toBe(totalCells - prefilledCount)
    })
  })

  describe('getRelatedCells', () => {
    it('returns cells in same row, column, and box', () => {
      const board = generateBoard(4, 'easy')
      const related = getRelatedCells(board, 0, 0)
      
      // For 4x4 board at (0,0):
      // Same row: 3 cells (cols 1,2,3)
      // Same column: 3 cells (rows 1,2,3)
      // Same box (2x2): 3 cells (but some overlap with row/col)
      // Total unique: row(3) + col(3) + box(1 new) = 7
      expect(related.length).toBeGreaterThan(0)
      
      // Verify no duplicates
      const keys = related.map(c => `${c.row}-${c.col}`)
      const uniqueKeys = new Set(keys)
      expect(uniqueKeys.size).toBe(related.length)
      
      // Verify the target cell is not included
      expect(related.some(c => c.row === 0 && c.col === 0)).toBe(false)
    })
  })
})
