import type { GameSession, GameHistory, GameSettings } from '../types';

const STORAGE_KEYS = {
  CURRENT_GAME: 'sudoku-current-game',
  GAME_HISTORY: 'sudoku-game-history',
  SETTINGS: 'sudoku-settings',
} as const;

export function saveToStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Failed to load from localStorage: ${key}`, error);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from localStorage: ${key}`, error);
  }
}

export function saveCurrentGame(session: GameSession): void {
  saveToStorage(STORAGE_KEYS.CURRENT_GAME, session);
}

export function loadCurrentGame(defaultValue: GameSession | null): GameSession | null {
  return loadFromStorage(STORAGE_KEYS.CURRENT_GAME, defaultValue);
}

export function clearCurrentGame(): void {
  removeFromStorage(STORAGE_KEYS.CURRENT_GAME);
}

export function saveGameHistory(history: GameHistory): void {
  saveToStorage(STORAGE_KEYS.GAME_HISTORY, history);
}

export function loadGameHistory(defaultValue: GameHistory): GameHistory {
  return loadFromStorage(STORAGE_KEYS.GAME_HISTORY, defaultValue);
}

export function saveSettings(settings: GameSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

export function loadSettings(defaultValue: GameSettings): GameSettings {
  return loadFromStorage(STORAGE_KEYS.SETTINGS, defaultValue);
}
