// Storage utility functions

// Save data to localStorage
export function saveToStorage<T>(key: string, data: T): void {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error)
  }
}

// Load data from localStorage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const serializedData = localStorage.getItem(key)
    if (serializedData === null) return defaultValue
    return JSON.parse(serializedData)
  } catch (error) {
    console.error(`Error loading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

// Remove data from localStorage
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error)
  }
}

// Clear all data from localStorage
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}
