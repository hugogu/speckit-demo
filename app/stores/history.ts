import { defineStore } from 'pinia'
import type { GameRecord, BoardSize, Difficulty } from '~/types'
import { getGameRecords, saveGameRecord, deleteGameRecord, clearGameRecords } from '~/utils/storage'

interface HistoryState {
  records: GameRecord[]
  isLoading: boolean
}

export const useHistoryStore = defineStore('history', {
  state: (): HistoryState => ({
    records: [],
    isLoading: false,
  }),

  getters: {
    totalGames: (state): number => state.records.length,
    
    completedGames: (state): number => 
      state.records.filter(r => r.isCompleted).length,
    
    averageTime: (state): number => {
      const completed = state.records.filter(r => r.isCompleted)
      if (completed.length === 0) return 0
      const total = completed.reduce((sum, r) => sum + r.duration, 0)
      return Math.round(total / completed.length)
    },
    
    bestTime: (state): number => {
      const completed = state.records.filter(r => r.isCompleted)
      if (completed.length === 0) return 0
      return Math.min(...completed.map(r => r.duration))
    },
    
    recordsByDifficulty: (state) => (difficulty: Difficulty): GameRecord[] => 
      state.records.filter(r => r.difficulty === difficulty),
    
    recordsByBoardSize: (state) => (size: BoardSize): GameRecord[] => 
      state.records.filter(r => r.boardSize === size),
    
    recentRecords: (state) => (limit: number = 10): GameRecord[] => 
      state.records.slice(0, limit),
  },

  actions: {
    loadRecords() {
      this.isLoading = true
      try {
        this.records = getGameRecords()
      } finally {
        this.isLoading = false
      }
    },

    addRecord(record: GameRecord) {
      saveGameRecord(record)
      // Reload to ensure consistency
      this.loadRecords()
    },

    removeRecord(id: string) {
      deleteGameRecord(id)
      this.loadRecords()
    },

    clearAllRecords() {
      clearGameRecords()
      this.records = []
    },

    formatDuration(ms: number): string {
      const seconds = Math.floor(ms / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    },

    formatDate(timestamp: number): string {
      const date = new Date(timestamp)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
})
