import type { GameSession } from '~/types/sudoku';

export const useHistoryStore = defineStore('history', () => {
  const sessions = ref<GameSession[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadHistory() {
    isLoading.value = true;
    error.value = null;

    try {
      const storage = useStorage();
      sessions.value = await storage.loadHistory();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load history';
      console.error('Failed to load history:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteSession(sessionId: string) {
    try {
      const storage = useStorage();
      await storage.deleteSession(sessionId);
      sessions.value = sessions.value.filter(s => s.id !== sessionId);
    } catch (err) {
      console.error('Failed to delete session:', err);
      throw err;
    }
  }

  async function exportHistory() {
    try {
      const storage = useStorage();
      const data = await storage.exportHistory();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sudoku-history-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export history:', err);
      throw err;
    }
  }

  const sortedSessions = computed(() => {
    return [...sessions.value].sort((a, b) => b.startTime - a.startTime);
  });

  return {
    sessions,
    isLoading,
    error,
    sortedSessions,
    loadHistory,
    deleteSession,
    exportHistory
  };
});
