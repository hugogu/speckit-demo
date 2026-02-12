import { defineStore } from 'pinia'
import type { Board, BoardSize, Difficulty, GameStatus, GameRecord } from '~/types'
import { createPuzzle } from '~/composables/useSudokuGenerator'
import { isValidPlacement, isBoardComplete } from '~/composables/useSudokuValidator'
import { STORAGE_KEYS } from '~/types'
import { loadFromStorage, saveToStorage } from '~/utils/storage'
import { useHistoryStore } from '~/stores/history'

export const useGameStore = defineStore('game', {
  state: () => ({
    id: '' as string,
    boardSize: null as BoardSize | null,
    difficulty: null as Difficulty | null,
    board: null as Board | null,
    startTime: 0 as number,
    endTime: null as number | null,
    status: 'idle' as GameStatus,
    errorCount: 0 as number,
    moveCount: 0 as number,
    selectedCell: null as { row: number; col: number } | null,
    elapsedTime: 0 as number,
    timerInterval: null as NodeJS.Timeout | null,
  }),
  
  getters: {
    isPlaying: (state) => state.status === 'playing',
    isPaused: (state) => state.status === 'paused',
    isCompleted: (state) => state.status === 'completed',
    formattedTime: (state) => {
      const totalSeconds = state.status === 'completed' && state.endTime && state.startTime 
        ? Math.floor((state.endTime - state.startTime) / 1000)
        : state.elapsedTime
      
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    selectedCellData: (state) => {
      if (!state.board || !state.selectedCell) return null
      const { row, col } = state.selectedCell
      return state.board.cells[row][col]
    },
    highlightedCells: (state) => {
      const highlighted = new Set<string>()
      if (!state.board || !state.selectedCell) return highlighted
      
      const { row, col } = state.selectedCell
      const selectedCell = state.board.cells[row][col]
      if (selectedCell.value === null) return highlighted
      
      // Highlight same values
      for (let r = 0; r < state.board.size; r++) {
        for (let c = 0; c < state.board.size; c++) {
          const cell = state.board.cells[r][c]
          if (cell.value === selectedCell.value) {
            highlighted.add(`${r}-${c}`)
          }
        }
      }
      
      return highlighted
    },
  },
  
  actions: {
    startNewGame(boardSize: BoardSize, difficulty: Difficulty) {
      // Clear any existing timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      
      // Create new game
      const board = createPuzzle(boardSize, difficulty)
      const id = Date.now().toString()
      
      // Reset state
      this.$patch({
        id,
        boardSize,
        difficulty,
        board,
        startTime: Date.now(),
        endTime: null,
        status: 'playing',
        errorCount: 0,
        moveCount: 0,
        selectedCell: null,
        elapsedTime: 0,
      })
      
      // Start timer
      this.startTimer()
      
      // Save game
      this.saveGame()
    },
    
    startTimer() {
      if (this.timerInterval) return
      
      this.timerInterval = setInterval(() => {
        if (this.status === 'playing') {
          this.elapsedTime++
        }
      }, 1000)
    },
    
    pauseGame() {
      if (this.status === 'playing') {
        this.status = 'paused'
        this.saveGame()
      }
    },
    
    resumeGame() {
      if (this.status === 'paused') {
        this.status = 'playing'
        this.startTimer()
        this.saveGame()
      }
    },
    
    selectCell(row: number, col: number) {
      if (!this.board || this.status !== 'playing') return
      
      // Deselect if clicking the same cell
      if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
        this.selectedCell = null
        return
      }
      
      // Select the cell
      this.selectedCell = { row, col }
      
      // Update cell selection state
      for (let r = 0; r < this.board.size; r++) {
        for (let c = 0; c < this.board.size; c++) {
          this.board.cells[r][c].isSelected = r === row && c === col
        }
      }
    },
    
    placeNumber(value: number) {
      if (!this.board || !this.selectedCell || this.status !== 'playing') return
      
      const { row, col } = this.selectedCell
      const cell = this.board.cells[row][col]
      
      // Can't modify prefilled cells
      if (cell.isPrefilled) return
      
      // Increment move count
      this.moveCount++
      
      // Check if the value is correct
      const isCorrect = isValidPlacement(this.board, row, col, value)
      
      // Update cell
      cell.value = value
      cell.isCorrect = isCorrect
      
      // If incorrect, increment error count
      if (!isCorrect) {
        this.errorCount++
        // In a real app, we might want to show visual feedback for wrong numbers
        // For now, we'll just increment the error count
      }
      
      // Check if the board is complete
      if (isBoardComplete(this.board)) {
        this.completeGame()
      }
      
      // Save game
      this.saveGame()
    },
    
    clearCell() {
      if (!this.board || !this.selectedCell || this.status !== 'playing') return
      
      const { row, col } = this.selectedCell
      const cell = this.board.cells[row][col]
      
      // Can't modify prefilled cells
      if (cell.isPrefilled) return
      
      // Increment move count
      this.moveCount++
      
      // Clear cell
      cell.value = null
      cell.isCorrect = null
      
      // Save game
      this.saveGame()
    },
    
    completeGame() {
      if (!this.board || this.status !== 'playing') return
      
      // Stop timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      
      // Update status
      this.status = 'completed'
      this.endTime = Date.now()
      
      // Create game record
      this.createGameRecord()
      
      // Save game
      this.saveGame()
    },
    
    abandonGame() {
      // Stop timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      
      // Reset state
      this.$reset()
      
      // Remove saved game
      localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME)
    },
    
    saveGame() {
      if (this.status === 'idle') return
      
      // Save to localStorage
      saveToStorage(STORAGE_KEYS.CURRENT_GAME, {
        id: this.id,
        boardSize: this.boardSize,
        difficulty: this.difficulty,
        board: this.board,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status,
        errorCount: this.errorCount,
        moveCount: this.moveCount,
        elapsedTime: this.elapsedTime,
      })
    },
    
    loadSavedGame(): boolean {
      try {
        const savedGame = loadFromStorage(STORAGE_KEYS.CURRENT_GAME, null)
        if (!savedGame) return false
        
        // Restore state
        this.$patch(savedGame)
        
        // Restart timer if needed
        if (this.status === 'playing') {
          this.startTimer()
        }
        
        return true
      } catch (error) {
        console.error('Error loading saved game:', error)
        return false
      }
    },
    
    createGameRecord() {
      if (!this.board || !this.boardSize || !this.difficulty || !this.startTime || !this.endTime) return
      
      // Create initial board (only prefilled cells)
      const initialBoard: number[][] = []
      for (let row = 0; row < this.board.size; row++) {
        const rowValues: number[] = []
        for (let col = 0; col < this.board.size; col++) {
          const cell = this.board.cells[row][col]
          rowValues.push(cell.isPrefilled ? cell.solution : 0)
        }
        initialBoard.push(rowValues)
      }
      
      // Create final board
      const finalBoard: number[][] = []
      for (let row = 0; row < this.board.size; row++) {
        const rowValues: number[] = []
        for (let col = 0; col < this.board.size; col++) {
          rowValues.push(this.board.cells[row][col].value || 0)
        }
        finalBoard.push(rowValues)
      }
      
      // Create solution board
      const solution: number[][] = []
      for (let row = 0; row < this.board.size; row++) {
        const rowValues: number[] = []
        for (let col = 0; col < this.board.size; col++) {
          rowValues.push(this.board.cells[row][col].solution)
        }
        solution.push(rowValues)
      }
      
      // Create game record
      const record: GameRecord = {
        id: this.id,
        boardSize: this.boardSize,
        difficulty: this.difficulty,
        initialBoard,
        finalBoard,
        solution,
        duration: Math.floor((this.endTime - this.startTime) / 1000),
        errorCount: this.errorCount,
        moveCount: this.moveCount,
        completedAt: this.endTime,
        isCompleted: true,
      }
      
      // Save to history store
      const historyStore = useHistoryStore()
      historyStore.addRecord(record)
    },
  },
})
