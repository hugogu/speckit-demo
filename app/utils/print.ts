import type { BoardSize, Difficulty } from '~/types'
import { PRINT_COUNTS } from '~/types'
import { useSudokuGenerator } from '~/composables/useSudokuGenerator'

export interface PrintPuzzle {
  id: string
  puzzle: number[][]
  solution: number[][]
  boardSize: BoardSize
  difficulty: Difficulty
}

/**
 * Generate multiple puzzles for printing
 */
export function generatePrintPuzzles(
  boardSize: BoardSize,
  difficulty: Difficulty,
  count?: number
): PrintPuzzle[] {
  const { generateSolution, createPuzzle } = useSudokuGenerator()
  const puzzleCount = count ?? PRINT_COUNTS[boardSize]
  const puzzles: PrintPuzzle[] = []

  for (let i = 0; i < puzzleCount; i++) {
    const solution = generateSolution(boardSize)
    const puzzle = createPuzzle(solution, boardSize, difficulty)
    
    puzzles.push({
      id: `puzzle-${Date.now()}-${i}`,
      puzzle,
      solution,
      boardSize,
      difficulty,
    })
  }

  return puzzles
}

/**
 * Get the number of puzzles per page for a board size
 */
export function getPuzzlesPerPage(boardSize: BoardSize): number {
  return PRINT_COUNTS[boardSize]
}

/**
 * Calculate grid layout for print page
 */
export function getPrintGridLayout(boardSize: BoardSize): { cols: number; rows: number } {
  switch (boardSize) {
    case 4:
      return { cols: 4, rows: 2 } // 8 puzzles: 4x2
    case 6:
      return { cols: 3, rows: 2 } // 6 puzzles: 3x2
    case 9:
      return { cols: 2, rows: 2 } // 4 puzzles: 2x2
    default:
      return { cols: 2, rows: 2 }
  }
}

/**
 * Trigger browser print dialog
 */
export function triggerPrint(): void {
  window.print()
}

/**
 * Get difficulty label in Chinese
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    expert: '专家',
  }
  return labels[difficulty]
}
