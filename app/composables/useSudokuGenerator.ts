import type { BoardSize, Difficulty, Board, Cell } from '~/types'
import { PREFILLED_COUNTS, BOX_DIMENSIONS } from '~/types'

/**
 * Sudoku Generator using backtracking algorithm
 */
export function useSudokuGenerator() {
  /**
   * Generate a complete valid sudoku solution
   */
  function generateSolution(size: BoardSize): number[][] {
    const grid: number[][] = Array(size).fill(null).map(() => Array(size).fill(0))
    const { width: boxWidth, height: boxHeight } = BOX_DIMENSIONS[size]
    
    function isValid(grid: number[][], row: number, col: number, num: number): boolean {
      // Check row
      for (let x = 0; x < size; x++) {
        if (grid[row][x] === num) return false
      }
      
      // Check column
      for (let x = 0; x < size; x++) {
        if (grid[x][col] === num) return false
      }
      
      // Check box
      const boxRowStart = Math.floor(row / boxHeight) * boxHeight
      const boxColStart = Math.floor(col / boxWidth) * boxWidth
      
      for (let i = 0; i < boxHeight; i++) {
        for (let j = 0; j < boxWidth; j++) {
          if (grid[boxRowStart + i][boxColStart + j] === num) return false
        }
      }
      
      return true
    }
    
    function solve(grid: number[][]): boolean {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (grid[row][col] === 0) {
            // Shuffle numbers for randomness
            const numbers = shuffleArray([...Array(size)].map((_, i) => i + 1))
            
            for (const num of numbers) {
              if (isValid(grid, row, col, num)) {
                grid[row][col] = num
                
                if (solve(grid)) {
                  return true
                }
                
                grid[row][col] = 0
              }
            }
            
            return false
          }
        }
      }
      return true
    }
    
    solve(grid)
    return grid
  }
  
  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  function shuffleArray<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
  
  /**
   * Create puzzle by removing numbers from solution
   */
  function createPuzzle(solution: number[][], size: BoardSize, difficulty: Difficulty): number[][] {
    const puzzle = solution.map(row => [...row])
    const totalCells = size * size
    const prefilledCount = PREFILLED_COUNTS[size][difficulty]
    const cellsToRemove = totalCells - prefilledCount
    
    // Get all cell positions and shuffle them
    const positions: [number, number][] = []
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        positions.push([row, col])
      }
    }
    
    const shuffledPositions = shuffleArray(positions)
    
    // Remove cells
    for (let i = 0; i < cellsToRemove && i < shuffledPositions.length; i++) {
      const [row, col] = shuffledPositions[i]
      puzzle[row][col] = 0
    }
    
    return puzzle
  }
  
  /**
   * Create a Board object from puzzle and solution
   */
  function createBoard(puzzle: number[][], solution: number[][], size: BoardSize): Board {
    const { width: boxWidth, height: boxHeight } = BOX_DIMENSIONS[size]
    
    const cells: Cell[][] = puzzle.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        value: value === 0 ? null : value,
        solution: solution[rowIndex][colIndex],
        isPrefilled: value !== 0,
        isCorrect: value !== 0 ? true : null,
        isSelected: false,
        isHighlighted: false,
      }))
    )
    
    return {
      size,
      cells,
      boxWidth,
      boxHeight,
    }
  }
  
  /**
   * Generate a new sudoku game board
   */
  function generateBoard(size: BoardSize, difficulty: Difficulty): Board {
    const solution = generateSolution(size)
    const puzzle = createPuzzle(solution, size, difficulty)
    return createBoard(puzzle, solution, size)
  }
  
  return {
    generateBoard,
    generateSolution,
    createPuzzle,
  }
}
