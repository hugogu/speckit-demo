import { STORAGE_KEYS, STORAGE_LIMITS } from '~/types'
import type { GameRecord, CurrentGameState, Settings } from '~/types'

/**
 * Generic localStorage wrapper with error handling
 */
function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    console.error(`Failed to get item from localStorage: ${key}`)
    return null
  }
}

function setItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    console.error(`Failed to set item in localStorage: ${key}`)
    return false
  }
}

function removeItem(key: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    console.error(`Failed to remove item from localStorage: ${key}`)
    return false
  }
}

/**
 * Game Records Storage with LRU eviction
 */
export function getGameRecords(): GameRecord[] {
  return getItem<GameRecord[]>(STORAGE_KEYS.GAME_RECORDS) || []
}

export function saveGameRecord(record: GameRecord): boolean {
  const records = getGameRecords()
  
  // Add new record at the beginning (most recent first)
  records.unshift(record)
  
  // LRU eviction: keep only the most recent MAX_RECORDS
  if (records.length > STORAGE_LIMITS.MAX_RECORDS) {
    records.splice(STORAGE_LIMITS.MAX_RECORDS)
  }
  
  return setItem(STORAGE_KEYS.GAME_RECORDS, records)
}

export function deleteGameRecord(id: string): boolean {
  const records = getGameRecords()
  const filtered = records.filter(r => r.id !== id)
  return setItem(STORAGE_KEYS.GAME_RECORDS, filtered)
}

export function clearGameRecords(): boolean {
  return removeItem(STORAGE_KEYS.GAME_RECORDS)
}

/**
 * Current Game State Storage
 */
export function getCurrentGameState(): CurrentGameState | null {
  return getItem<CurrentGameState>(STORAGE_KEYS.CURRENT_GAME)
}

export function saveCurrentGameState(state: CurrentGameState): boolean {
  return setItem(STORAGE_KEYS.CURRENT_GAME, state)
}

export function clearCurrentGameState(): boolean {
  return removeItem(STORAGE_KEYS.CURRENT_GAME)
}

/**
 * Settings Storage
 */
export function getSettings(): Settings | null {
  return getItem<Settings>(STORAGE_KEYS.SETTINGS)
}

export function saveSettings(settings: Settings): boolean {
  return setItem(STORAGE_KEYS.SETTINGS, settings)
}
