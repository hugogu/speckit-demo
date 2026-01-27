import { describe, it, expect } from 'vitest'
import { useSudokuGenerator } from '~/composables/useSudokuGenerator'
import type { BoardSize, Difficulty } from '~/types'
import { BOX_DIMENSIONS, PREFILLED_COUNTS } from '~/types'

describe('useSudokuGenerator', () => {
  const { generateBoard, generateSolution, createPuzzle } = useSudokuGenerator()

  describe('generateSolution', () => {
    it.each([4, 6, 9] as BoardSize[])('generates a valid %dx%d solution', (size) => {
      const solution = generateSolution(size)
      
      // Check dimensions
      expect(solution.length).toBe(size)
      solution.forEach(row => {
        expect(row.length).toBe(size)
      })
      
      // Check all values are in valid range
      solution.forEach(row => {
        row.forEach(value => {
          expect(value).toBeGreaterThanOrEqual(1)
          expect(value).toBeLessThanOrEqual(size)
        })
      })
      
      // Check rows have unique values
      solution.forEach(row => {
        const unique = new Set(row)
        expect(unique.size).toBe(size)
      })
      
      // Check columns have unique values
      for (let col = 0; col < size; col++) {
        const column = solution.map(row => row[col])
        const unique = new Set(column)
        expect(unique.size).toBe(size)
      }
      
      // Check boxes have unique values
      const { width: boxWidth, height: boxHeight } = BOX_DIMENSIONS[size]
      for (let boxRow = 0; boxRow < size / boxHeight; boxRow++) {
        for (let boxCol = 0; boxCol < size / boxWidth; boxCol++) {
          const boxValues: number[] = []
          for (let r = 0; r < boxHeight; r++) {
            for (let c = 0; c < boxWidth; c++) {
              boxValues.push(solution[boxRow * boxHeight + r][boxCol * boxWidth + c])
            }
          }
          const unique = new Set(boxValues)
          expect(unique.size).toBe(size)
        }
      }
    })
  })

  describe('createPuzzle', () => {
    const sizes: BoardSize[] = [4, 6, 9]
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

    sizes.forEach(size => {
      difficulties.forEach(difficulty => {
        it(`creates puzzle with correct prefilled count for ${size}x${size} ${difficulty}`, () => {
          const solution = generateSolution(size)
          const puzzle = createPuzzle(solution, size, difficulty)
          
          const expectedPrefilled = PREFILLED_COUNTS[size][difficulty]
          let prefilledCount = 0
          
          puzzle.forEach(row => {
            row.forEach(value => {
              if (value !== 0) prefilledCount++
            })
          })
          
          expect(prefilledCount).toBe(expectedPrefilled)
        })
      })
    })
  })

  describe('generateBoard', () => {
    it('generates a complete board object', () => {
      const board = generateBoard(9, 'medium')
      
      expect(board.size).toBe(9)
      expect(board.boxWidth).toBe(3)
      expect(board.boxHeight).toBe(3)
      expect(board.cells.length).toBe(9)
      
      board.cells.forEach(row => {
        expect(row.length).toBe(9)
        row.forEach(cell => {
          expect(cell).toHaveProperty('row')
          expect(cell).toHaveProperty('col')
          expect(cell).toHaveProperty('value')
          expect(cell).toHaveProperty('solution')
          expect(cell).toHaveProperty('isPrefilled')
          expect(cell).toHaveProperty('isCorrect')
        })
      })
    })

    it('marks prefilled cells correctly', () => {
      const board = generateBoard(4, 'easy')
      
      let prefilledCount = 0
      board.cells.forEach(row => {
        row.forEach(cell => {
          if (cell.isPrefilled) {
            prefilledCount++
            expect(cell.value).not.toBeNull()
            expect(cell.value).toBe(cell.solution)
            expect(cell.isCorrect).toBe(true)
          } else {
            expect(cell.value).toBeNull()
            expect(cell.isCorrect).toBeNull()
          }
        })
      })
      
      expect(prefilledCount).toBe(PREFILLED_COUNTS[4]['easy'])
    })
  })
})
