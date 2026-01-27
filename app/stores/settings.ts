import { defineStore } from 'pinia'
import type { BoardSize, Difficulty, Settings } from '~/types'
import { DEFAULT_SETTINGS } from '~/types'
import { getSettings, saveSettings } from '~/utils/storage'

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    ...DEFAULT_SETTINGS,
  }),

  getters: {
    defaultBoardSize: (state): BoardSize => state.defaultBoardSize,
    defaultDifficulty: (state): Difficulty => state.defaultDifficulty,
    soundEnabled: (state): boolean => state.soundEnabled,
    animationEnabled: (state): boolean => state.animationEnabled,
  },

  actions: {
    loadSettings() {
      const saved = getSettings()
      if (saved) {
        this.defaultBoardSize = saved.defaultBoardSize
        this.defaultDifficulty = saved.defaultDifficulty
        this.soundEnabled = saved.soundEnabled
        this.animationEnabled = saved.animationEnabled
      }
    },

    setDefaultBoardSize(size: BoardSize) {
      this.defaultBoardSize = size
      this.persistSettings()
    },

    setDefaultDifficulty(difficulty: Difficulty) {
      this.defaultDifficulty = difficulty
      this.persistSettings()
    },

    setSoundEnabled(enabled: boolean) {
      this.soundEnabled = enabled
      this.persistSettings()
    },

    setAnimationEnabled(enabled: boolean) {
      this.animationEnabled = enabled
      this.persistSettings()
    },

    resetToDefaults() {
      this.defaultBoardSize = DEFAULT_SETTINGS.defaultBoardSize
      this.defaultDifficulty = DEFAULT_SETTINGS.defaultDifficulty
      this.soundEnabled = DEFAULT_SETTINGS.soundEnabled
      this.animationEnabled = DEFAULT_SETTINGS.animationEnabled
      this.persistSettings()
    },

    persistSettings() {
      saveSettings({
        defaultBoardSize: this.defaultBoardSize,
        defaultDifficulty: this.defaultDifficulty,
        soundEnabled: this.soundEnabled,
        animationEnabled: this.animationEnabled,
      })
    },
  },
})
