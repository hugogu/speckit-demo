import { set, get, del, keys } from 'idb-keyval'
import type { GameSession } from '~/types/sudoku'

const SESSIONS_KEY = 'sudoku_game_sessions'
const MAX_SESSIONS = 50

export async function saveSession(session: GameSession): Promise<void> {
  const sessions = await get<GameSession[]>(SESSIONS_KEY) || []
  sessions.push(session)

  if (sessions.length > MAX_SESSIONS) {
    sessions.sort((a, b) => a.startTime - b.startTime)
    sessions.splice(0, sessions.length - MAX_SESSIONS)
  }

  await set(SESSIONS_KEY, sessions)
}

export async function loadHistory(): Promise<GameSession[]> {
  const sessions = await get<GameSession[]>(SESSIONS_KEY) || []
  return sessions.sort((a, b) => b.startTime - a.startTime)
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await get<GameSession[]>(SESSIONS_KEY) || []
  const filtered = sessions.filter(s => s.id !== sessionId)
  await set(SESSIONS_KEY, filtered)
}

export async function exportHistory(): Promise<string> {
  const sessions = await loadHistory()
  return JSON.stringify(sessions, null, 2)
}

export async function clearHistory(): Promise<void> {
  await del(SESSIONS_KEY)
}
