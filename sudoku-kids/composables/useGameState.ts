import { ref, computed } from 'vue';
import type { GameState, BoardSize, Difficulty, Cell } from '../types/sudoku';
import { generateSudoku } from '../utils/sudoku-generator';
import { validateBoard, isBoardComplete, isBoardCorrect } from '../utils/sudoku-solver';

const STORAGE_KEY = 'sudoku-kids-game-state';

const gameState = ref<GameState>({
  board: null,
  difficulty: 'easy',
  size: 9,
  isComplete: false,
  isChecking: false,
  selectedCell: null,
});

export function useGameState() {
  const hasActiveGame = computed(() => gameState.value.board !== null);
  
  const currentBoard = computed(() => gameState.value.board);
  
  const selectedCell = computed(() => gameState.value.selectedCell);

  function startNewGame(size: BoardSize, difficulty: Difficulty): void {
    const board = generateSudoku(size, difficulty);
    gameState.value = {
      board,
      difficulty,
      size,
      isComplete: false,
      isChecking: false,
      selectedCell: null,
    };
    saveToStorage();
  }

  function selectCell(row: number, col: number): void {
    if (!gameState.value.board) return;
    
    const cell = gameState.value.board.cells[row][col];
    if (cell.isPreFilled) return;

    if (gameState.value.selectedCell) {
      const { row: prevRow, col: prevCol } = gameState.value.selectedCell;
      gameState.value.board.cells[prevRow][prevCol].isSelected = false;
    }

    cell.isSelected = true;
    gameState.value.selectedCell = { row, col };
  }

  function fillNumber(value: number | null): void {
    if (!gameState.value.board || !gameState.value.selectedCell) return;
    
    const { row, col } = gameState.value.selectedCell;
    const cell = gameState.value.board.cells[row][col];
    
    if (cell.isPreFilled) return;
    
    cell.value = value;
    cell.isError = false;
    saveToStorage();
  }

  function clearSelectedCell(): void {
    fillNumber(null);
  }

  function checkAnswers(): { hasErrors: boolean; isComplete: boolean } {
    if (!gameState.value.board) {
      return { hasErrors: false, isComplete: false };
    }

    const { cells, solution, size } = gameState.value.board;
    
    const grid = cells.map((row: Cell[]) => row.map((cell: Cell) => cell.value));
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        cells[row][col].isError = false;
      }
    }

    const errors = validateBoard(grid, solution, size);
    
    for (const { row, col } of errors) {
      cells[row][col].isError = true;
    }

    const complete = isBoardComplete(grid, size);
    const correct = isBoardCorrect(grid, solution, size);

    if (complete && correct) {
      gameState.value.isComplete = true;
    }

    gameState.value.isChecking = true;
    saveToStorage();

    return {
      hasErrors: errors.length > 0,
      isComplete: complete && correct,
    };
  }

  function resetGame(): void {
    if (!gameState.value.board) return;
    
    const { cells, size } = gameState.value.board;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!cells[row][col].isPreFilled) {
          cells[row][col].value = null;
          cells[row][col].isError = false;
        }
        cells[row][col].isSelected = false;
      }
    }
    
    gameState.value.selectedCell = null;
    gameState.value.isComplete = false;
    gameState.value.isChecking = false;
    saveToStorage();
  }

  function saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState.value));
      } catch (e) {
        console.warn('Failed to save game state:', e);
      }
    }
  }

  function loadFromStorage(): boolean {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as GameState;
          if (parsed.board) {
            gameState.value = parsed;
            return true;
          }
        }
      } catch (e) {
        console.warn('Failed to load game state:', e);
      }
    }
    return false;
  }

  function clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    gameState,
    hasActiveGame,
    currentBoard,
    selectedCell,
    startNewGame,
    selectCell,
    fillNumber,
    clearSelectedCell,
    checkAnswers,
    resetGame,
    loadFromStorage,
    clearStorage,
  };
}
