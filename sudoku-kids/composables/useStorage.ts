import { get, set, del } from 'idb-keyval';
import type { GameSession, GameHistory } from '~/types/sudoku';

const STORAGE_KEY = 'sudoku_game_history';
const MAX_HISTORY_ITEMS = 50;

export function useStorage() {
  async function saveSession(session: GameSession): Promise<void> {
    try {
      const history = await loadHistoryRaw();
      const existingIndex = history.sessions.findIndex(s => s.id === session.id);

      if (existingIndex >= 0) {
        history.sessions[existingIndex] = session;
      } else {
        history.sessions.unshift(session);
      }

      if (history.sessions.length > MAX_HISTORY_ITEMS) {
        history.sessions = history.sessions.slice(0, MAX_HISTORY_ITEMS);
      }

      history.totalCount = history.sessions.length;
      history.lastUpdated = Date.now();

      await set(STORAGE_KEY, history);
    } catch (error) {
      console.error('Failed to save session:', error);
      throw new Error('Failed to save game session');
    }
  }

  async function loadHistory(): Promise<GameSession[]> {
    try {
      const history = await loadHistoryRaw();
      return history.sessions;
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  async function deleteSession(sessionId: string): Promise<void> {
    try {
      const history = await loadHistoryRaw();
      history.sessions = history.sessions.filter(s => s.id !== sessionId);
      history.totalCount = history.sessions.length;
      history.lastUpdated = Date.now();
      await set(STORAGE_KEY, history);
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw new Error('Failed to delete game session');
    }
  }

  async function exportHistory(): Promise<string> {
    try {
      const history = await loadHistoryRaw();
      return JSON.stringify(history, null, 2);
    } catch (error) {
      console.error('Failed to export history:', error);
      throw new Error('Failed to export game history');
    }
  }

  async function clearHistory(): Promise<void> {
    try {
      await del(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw new Error('Failed to clear game history');
    }
  }

  async function loadHistoryRaw(): Promise<GameHistory> {
    const history = await get<GameHistory>(STORAGE_KEY);
    return history || { sessions: [], totalCount: 0, lastUpdated: 0 };
  }

  return {
    saveSession,
    loadHistory,
    deleteSession,
    exportHistory,
    clearHistory
  };
}
