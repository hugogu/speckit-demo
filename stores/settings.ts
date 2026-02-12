import { defineStore } from 'pinia'
import type { Settings, BoardSize, Difficulty } from '~/types'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '~/types'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: { ...DEFAULT_SETTINGS } as Settings,
  }),
  
  actions: {
    loadSettings() {
      try {
        const savedSettings = loadFromStorage<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
        this.settings = savedSettings
      } catch (error) {
        console.error('Error loading settings:', error)
        this.settings = { ...DEFAULT_SETTINGS }
      }
    },
    
    updateDefaultBoardSize(size: BoardSize) {
      this.settings.defaultBoardSize = size
      this.saveSettings()
    },
    
    updateDefaultDifficulty(difficulty: Difficulty) {
      this.settings.defaultDifficulty = difficulty
      this.saveSettings()
    },
    
    updateSoundEnabled(enabled: boolean) {
      this.settings.soundEnabled = enabled
      this.saveSettings()
    },
    
    updateAnimationEnabled(enabled: boolean) {
      this.settings.animationEnabled = enabled
      this.saveSettings()
    },
    
    resetToDefaults() {
      this.settings = { ...DEFAULT_SETTINGS }
      this.saveSettings()
    },
    
    saveSettings() {
      try {
        saveToStorage(STORAGE_KEYS.SETTINGS, this.settings)
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    },
  },
})
