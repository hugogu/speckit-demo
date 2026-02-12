import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameSession, GameHistory } from '../types';
import { saveGameHistory, loadGameHistory } from '../utils/storage';

const defaultHistory = (): GameHistory => ({
  sessions: [],
  totalGames: 0,
  totalCompleted: 0,
  totalErrors: 0,
});

export const useHistoryStore = defineStore('history', () => {
  const history = ref<GameHistory>(loadGameHistory(defaultHistory()));

  const totalGames = computed(() => history.value.totalGames);
  const totalCompleted = computed(() => history.value.totalCompleted);
  const averageDuration = computed(() => history.value.averageDuration);
  const totalErrors = computed(() => history.value.totalErrors);

  function addSession(session: GameSession): void {
    const newHistory = { ...history.value };
    newHistory.sessions.unshift(session);
    newHistory.totalGames++;
    if (session.completed) {
      newHistory.totalCompleted++;
      if (session.duration) {
        const totalTime = (newHistory.averageDuration || 0) * (newHistory.totalCompleted - 1) + session.duration;
        newHistory.averageDuration = Math.round(totalTime / newHistory.totalCompleted);
      }
    }
    newHistory.totalErrors += session.errorCount;
    history.value = newHistory;
    saveGameHistory(newHistory);
  }

  function clearHistory(): void {
    history.value = defaultHistory();
    saveGameHistory(history.value);
  }

  function getSessionById(id: string): GameSession | undefined {
    return history.value.sessions.find(s => s.id === id);
  }

  function getRecentSessions(limit: number = 10): GameSession[] {
    return history.value.sessions.slice(0, limit);
  }

  return {
    history,
    totalGames,
    totalCompleted,
    averageDuration,
    totalErrors,
    addSession,
    clearHistory,
    getSessionById,
    getRecentSessions,
  };
});
