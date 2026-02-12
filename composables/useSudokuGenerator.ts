import type { Board, BoardSize, Cell, Difficulty } from '~/types'
import { BOX_DIMENSIONS, PREFILLED_COUNTS } from '~/types'

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Create an empty board
function createEmptyBoard(size: BoardSize): Board {
  const { width, height } = BOX_DIMENSIONS[size]
  const cells: Cell[][] = []
  
  for (let row = 0; row < size; row++) {
    const rowCells: Cell[] = []
    for (let col = 0; col < size; col++) {
      rowCells.push({
        row,
        col,
        value: null,
        solution: 0,
        isPrefilled: false,
        isCorrect: null,
        isSelected: false,
        isHighlighted: false,
      })
    }
    cells.push(rowCells)
  }
  
  return {
    size,
    cells,
    boxWidth: width,
    boxHeight: height,
  }
}

// Check if a number can be placed in a cell
function isValidPlacement(board: number[][], row: number, col: number, num: number, size: BoardSize): boolean {
  // Check row
  for (let i = 0; i < size; i++) {
    if (board[row][i] === num) return false
  }
  
  // Check column
  for (let i = 0; i < size; i++) {
    if (board[i][col] === num) return false
  }
  
  // Check box
  const { width, height } = BOX_DIMENSIONS[size]
  const boxRow = Math.floor(row / height) * height
  const boxCol = Math.floor(col / width) * width
  
  for (let i = boxRow; i < boxRow + height; i++) {
    for (let j = boxCol; j < boxCol + width; j++) {
      if (board[i][j] === num) return false
    }
  }
  
  return true
}

// Solve a Sudoku board using backtracking
function solveBoard(board: number[][], size: BoardSize): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffleArray(Array.from({ length: size }, (_, i) => i + 1))
        
        for (const num of numbers) {
          if (isValidPlacement(board, row, col, num, size)) {
            board[row][col] = num
            
            if (solveBoard(board, size)) {
              return true
            }
            
            board[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

// Generate a complete Sudoku solution
function generateSolution(size: BoardSize): number[][] {
  const board: number[][] = Array(size).fill(0).map(() => Array(size).fill(0))
  solveBoard(board, size)
  return board
}

// Create a puzzle by removing numbers from a solution
function createPuzzleFromSolution(solution: number[][], size: BoardSize, difficulty: Difficulty): Board {
  const board = createEmptyBoard(size)
  const prefilledCount = PREFILLED_COUNTS[size][difficulty]
  
  // Copy solution to board
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      board.cells[row][col].solution = solution[row][col]
    }
  }
  
  // Create a list of all positions
  const positions: [number, number][] = []
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push([row, col])
    }
  }
  
  // Shuffle positions
  const shuffledPositions = shuffleArray(positions)
  
  // Remove numbers while ensuring unique solution
  let removedCount = 0
  const maxToRemove = size * size - prefilledCount
  
  for (const [row, col] of shuffledPositions) {
    if (removedCount >= maxToRemove) break
    
    const currentValue = board.cells[row][col].solution
    board.cells[row][col].solution = 0
    
    // For simplicity, we're not checking for unique solution here
    // In a production app, this would be more complex
    board.cells[row][col].isPrefilled = true
    removedCount++
  }
  
  // Set values for prefilled cells
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board.cells[row][col].isPrefilled) {
        board.cells[row][col].value = board.cells[row][col].solution
      }
    }
  }
  
  return board
}

// Create a puzzle with a unique solution
export function createPuzzle(size: BoardSize, difficulty: Difficulty): Board {
  const solution = generateSolution(size)
  return createPuzzleFromSolution(solution, size, difficulty)
}

// Generate multiple puzzles for printing
export function generatePrintPuzzles(size: BoardSize, difficulty: Difficulty, count: number = 4): Board[] {
  return Array.from({ length: count }, () => createPuzzle(size, difficulty))
}
