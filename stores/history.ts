import { defineStore } from 'pinia'
import type { GameRecord } from '~/types'
import { STORAGE_KEYS, STORAGE_LIMITS } from '~/types'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    records: [] as GameRecord[],
  }),
  
  getters: {
    sortedRecords: (state) => {
      return [...state.records].sort((a, b) => b.completedAt - a.completedAt)
    },
    recordCount: (state) => state.records.length,
  },
  
  actions: {
    loadRecords() {
      try {
        const records = loadFromStorage<GameRecord[]>(STORAGE_KEYS.GAME_RECORDS, [])
        this.records = records
      } catch (error) {
        console.error('Error loading game records:', error)
        this.records = []
      }
    },
    
    addRecord(record: GameRecord) {
      // Add to beginning of array
      this.records.unshift(record)
      
      // Limit number of records
      if (this.records.length > STORAGE_LIMITS.MAX_RECORDS) {
        this.records = this.records.slice(0, STORAGE_LIMITS.MAX_RECORDS)
      }
      
      // Save to localStorage
      this.saveRecords()
    },
    
    removeRecord(id: string) {
      this.records = this.records.filter(record => record.id !== id)
      this.saveRecords()
    },
    
    clearRecords() {
      this.records = []
      this.saveRecords()
    },
    
    saveRecords() {
      try {
        saveToStorage(STORAGE_KEYS.GAME_RECORDS, this.records)
      } catch (error) {
        console.error('Error saving game records:', error)
      }
    },
    
    getRecordById(id: string): GameRecord | undefined {
      return this.records.find(record => record.id === id)
    },
  },
})
