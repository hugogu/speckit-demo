import type { BoardSize, Difficulty, GameSession, GameStatus } from '~/types/sudoku';

export const useGameStore = defineStore('game', () => {
  const currentSession = ref<GameSession | null>(null);
  const gameStatus = ref<GameStatus>('created');
  const selectedDifficulty = ref<Difficulty>('easy');
  const selectedSize = ref<BoardSize>(4);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function setDifficulty(difficulty: Difficulty) {
    selectedDifficulty.value = difficulty;
  }

  function setBoardSize(size: BoardSize) {
    selectedSize.value = size;
  }

  async function startNewGame() {
    isLoading.value = true;
    error.value = null;

    try {
      const { generateGame } = useSudoku();
      const session = generateGame(selectedDifficulty.value, selectedSize.value);

      currentSession.value = session;
      gameStatus.value = 'playing';

      await navigateTo('/play');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to start game';
      console.error('Failed to start new game:', err);
    } finally {
      isLoading.value = false;
    }
  }

  function updateCell(row: number, col: number, value: number | null) {
    if (!currentSession.value) return;

    currentSession.value.userInputs.push({
      id: generateInputId(),
      sessionId: currentSession.value.id,
      timestamp: Date.now(),
      row,
      col,
      value: value ?? 0,
      inputType: 'click',
      isCorrect: false
    });
  }

  function incrementError() {
    if (currentSession.value) {
      currentSession.value.errorCount++;
    }
  }

  function completeGame(elapsedTime: number) {
    if (!currentSession.value) return;

    currentSession.value.isCompleted = true;
    currentSession.value.elapsedTime = elapsedTime;
    currentSession.value.endTime = Date.now();
    gameStatus.value = 'completed';
  }

  function resetGame() {
    currentSession.value = null;
    gameStatus.value = 'created';
    error.value = null;
  }

  return {
    currentSession,
    gameStatus,
    selectedDifficulty,
    selectedSize,
    isLoading,
    error,
    setDifficulty,
    setBoardSize,
    startNewGame,
    updateCell,
    incrementError,
    completeGame,
    resetGame
  };
});
