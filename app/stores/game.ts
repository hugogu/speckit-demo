import { defineStore } from 'pinia'
import type { Game, Board, BoardSize, Difficulty, GameStatus, Cell, GameRecord } from '~/types'
import { useSudokuGenerator } from '~/composables/useSudokuGenerator'
import { useSudokuValidator } from '~/composables/useSudokuValidator'
import { saveCurrentGameState, getCurrentGameState, clearCurrentGameState, saveGameRecord } from '~/utils/storage'

interface GameState {
  game: Game | null
  selectedCell: { row: number; col: number } | null
  highlightedCells: Set<string>
  timerInterval: ReturnType<typeof setInterval> | null
  elapsedTime: number
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    game: null,
    selectedCell: null,
    highlightedCells: new Set(),
    timerInterval: null,
    elapsedTime: 0,
  }),

  getters: {
    isPlaying: (state): boolean => state.game?.status === 'playing',
    isPaused: (state): boolean => state.game?.status === 'paused',
    isCompleted: (state): boolean => state.game?.status === 'completed',
    board: (state): Board | null => state.game?.board ?? null,
    boardSize: (state): BoardSize | null => state.game?.boardSize ?? null,
    difficulty: (state): Difficulty | null => state.game?.difficulty ?? null,
    errorCount: (state): number => state.game?.errorCount ?? 0,
    moveCount: (state): number => state.game?.moveCount ?? 0,
    
    formattedTime: (state): string => {
      const seconds = Math.floor(state.elapsedTime / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    },

    selectedCellData(state): Cell | null {
      if (!state.game || !state.selectedCell) return null
      return state.game.board.cells[state.selectedCell.row][state.selectedCell.col]
    },
  },

  actions: {
    startNewGame(boardSize: BoardSize, difficulty: Difficulty) {
      // Stop any existing timer
      this.stopTimer()
      
      const { generateBoard } = useSudokuGenerator()
      const board = generateBoard(boardSize, difficulty)
      
      this.game = {
        id: crypto.randomUUID(),
        boardSize,
        difficulty,
        board,
        startTime: Date.now(),
        endTime: null,
        status: 'playing',
        errorCount: 0,
        moveCount: 0,
      }
      
      this.selectedCell = null
      this.highlightedCells.clear()
      this.elapsedTime = 0
      
      // Start timer
      this.startTimer()
      
      // Save game state
      this.saveGame()
    },

    selectCell(row: number, col: number) {
      if (!this.game || this.game.status !== 'playing') return
      
      const cell = this.game.board.cells[row][col]
      
      // Don't select prefilled cells for editing, but allow selection for highlighting
      this.selectedCell = { row, col }
      
      // Update highlighted cells (same row, column, box)
      this.updateHighlights(row, col)
    },

    updateHighlights(row: number, col: number) {
      if (!this.game) return
      
      const { getRelatedCells } = useSudokuValidator()
      const related = getRelatedCells(this.game.board, row, col)
      
      this.highlightedCells.clear()
      related.forEach(cell => {
        this.highlightedCells.add(`${cell.row}-${cell.col}`)
      })
    },

    clearSelection() {
      this.selectedCell = null
      this.highlightedCells.clear()
    },

    placeNumber(value: number) {
      if (!this.game || !this.selectedCell || this.game.status !== 'playing') return
      
      const { row, col } = this.selectedCell
      const cell = this.game.board.cells[row][col]
      
      // Can't modify prefilled cells
      if (cell.isPrefilled) return
      
      // Check if value is correct
      const { isValueCorrect } = useSudokuValidator()
      const isCorrect = isValueCorrect(cell, value)
      
      // Update cell
      cell.value = value
      cell.isCorrect = isCorrect
      
      // Increment move count
      this.game.moveCount++
      
      if (!isCorrect) {
        // Increment error count
        this.game.errorCount++
        
        // Auto-revert after delay (for friendly feedback)
        setTimeout(() => {
          if (this.game && this.game.board.cells[row][col].value === value) {
            this.game.board.cells[row][col].value = null
            this.game.board.cells[row][col].isCorrect = null
          }
        }, 800)
      } else {
        // Check if game is complete
        this.checkCompletion()
      }
      
      // Save game state
      this.saveGame()
    },

    clearCell() {
      if (!this.game || !this.selectedCell || this.game.status !== 'playing') return
      
      const { row, col } = this.selectedCell
      const cell = this.game.board.cells[row][col]
      
      // Can't clear prefilled cells
      if (cell.isPrefilled) return
      
      cell.value = null
      cell.isCorrect = null
      
      this.saveGame()
    },

    checkCompletion() {
      if (!this.game) return
      
      const { isBoardComplete } = useSudokuValidator()
      
      if (isBoardComplete(this.game.board)) {
        this.game.status = 'completed'
        this.game.endTime = Date.now()
        this.stopTimer()
        clearCurrentGameState()
        
        // Save game record to history
        this.saveGameToHistory()
      }
    },

    saveGameToHistory() {
      if (!this.game) return
      
      const record: GameRecord = {
        id: this.game.id,
        boardSize: this.game.boardSize,
        difficulty: this.game.difficulty,
        initialBoard: this.game.board.cells.map(row => 
          row.map(cell => cell.isPrefilled ? cell.value! : 0)
        ),
        finalBoard: this.game.board.cells.map(row => 
          row.map(cell => cell.value ?? 0)
        ),
        solution: this.game.board.cells.map(row => 
          row.map(cell => cell.solution)
        ),
        duration: this.elapsedTime,
        errorCount: this.game.errorCount,
        moveCount: this.game.moveCount,
        completedAt: Date.now(),
        isCompleted: this.game.status === 'completed',
      }
      
      saveGameRecord(record)
    },

    pauseGame() {
      if (!this.game || this.game.status !== 'playing') return
      
      this.game.status = 'paused'
      this.stopTimer()
      this.saveGame()
    },

    resumeGame() {
      if (!this.game || this.game.status !== 'paused') return
      
      this.game.status = 'playing'
      this.startTimer()
      this.saveGame()
    },

    startTimer() {
      if (this.timerInterval) return
      
      this.timerInterval = setInterval(() => {
        this.elapsedTime += 1000
      }, 1000)
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    saveGame() {
      if (!this.game) return
      
      saveCurrentGameState({
        game: this.game,
        lastSavedAt: Date.now(),
      })
    },

    loadSavedGame(): boolean {
      const savedState = getCurrentGameState()
      
      if (savedState?.game && savedState.game.status !== 'completed') {
        this.game = savedState.game
        this.elapsedTime = savedState.game.endTime 
          ? savedState.game.endTime - savedState.game.startTime
          : Date.now() - savedState.game.startTime
        
        if (this.game.status === 'playing') {
          this.startTimer()
        }
        
        return true
      }
      
      return false
    },

    abandonGame() {
      this.stopTimer()
      this.game = null
      this.selectedCell = null
      this.highlightedCells.clear()
      this.elapsedTime = 0
      clearCurrentGameState()
    },
  },
})
