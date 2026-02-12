import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Puzzle, GameSession, GameStatus } from '../types';
import { saveCurrentGame, clearCurrentGame } from '../utils/storage';

export const useGameStore = defineStore('game', () => {
  const currentPuzzle = ref<Puzzle | null>(null);
  const gameSession = ref<GameSession | null>(null);
  const gameStatus = ref<GameStatus>('idle');
  const errorCount = ref(0);

  const boardSize = computed(() => currentPuzzle.value?.boardSize ?? 9);
  const difficulty = computed(() => currentPuzzle.value?.difficulty ?? 'easy');

  function startNewGame(puzzle: Puzzle): void {
    currentPuzzle.value = puzzle;
    gameSession.value = {
      id: crypto.randomUUID(),
      puzzleId: puzzle.id,
      difficulty: puzzle.difficulty,
      boardSize: puzzle.boardSize,
      startTime: new Date(),
      errorCount: 0,
      completed: false,
      boardState: puzzle.initialBoard.map(row => [...row]),
    };
    gameStatus.value = 'playing';
    saveCurrentGame(gameSession.value);
  }

  function updateCell(row: number, col: number, value: number): boolean {
    if (!currentPuzzle.value || !gameSession.value) return false;
    if (gameStatus.value !== 'playing') return false;

    const puzzle = currentPuzzle.value;
    if (puzzle.initialBoard[row][col] !== 0) return false;

    const isCorrect = value === puzzle.solution[row][col];
    if (isCorrect) {
      gameSession.value.boardState[row][col] = value;
      currentPuzzle.value.currentBoard[row][col] = value;
      saveCurrentGame(gameSession.value);
      checkVictory();
    } else {
      errorCount.value++;
      gameSession.value.errorCount = errorCount.value;
      saveCurrentGame(gameSession.value);
    }
    return isCorrect;
  }

  function checkVictory(): void {
    if (!currentPuzzle.value || !gameSession.value) return;

    const board = gameSession.value.boardState;
    const solution = currentPuzzle.value.solution;

    const isComplete = board.every((row, rowIndex) =>
      row.every((cell, colIndex) => cell === solution[rowIndex][colIndex])
    );

    if (isComplete) {
      gameStatus.value = 'victory';
      gameSession.value.completed = true;
      gameSession.value.endTime = new Date();
      gameSession.value.duration = Math.floor(
        (gameSession.value.endTime.getTime() - gameSession.value.startTime.getTime()) / 1000
      );
      clearCurrentGame();
    }
  }

  function pauseGame(): void {
    if (gameStatus.value === 'playing') {
      gameStatus.value = 'paused';
    }
  }

  function resumeGame(): void {
    if (gameStatus.value === 'paused') {
      gameStatus.value = 'playing';
    }
  }

  function resetGame(): void {
    currentPuzzle.value = null;
    gameSession.value = null;
    gameStatus.value = 'idle';
    errorCount.value = 0;
    clearCurrentGame();
  }

  function loadSavedGame(session: GameSession, puzzle: Puzzle): void {
    currentPuzzle.value = puzzle;
    gameSession.value = session;
    gameStatus.value = session.completed ? 'victory' : 'playing';
    errorCount.value = session.errorCount;
  }

  return {
    currentPuzzle,
    gameSession,
    gameStatus,
    errorCount,
    boardSize,
    difficulty,
    startNewGame,
    updateCell,
    pauseGame,
    resumeGame,
    resetGame,
    loadSavedGame,
  };
});
