/**
 * Game State Management
 * Reference: tasks.md T011
 * Reference: plan.md §composables/useGameState.ts
 * Reference: spec.md §FR-014 - localStorage auto-save
 */

import { ref, computed } from 'vue';
import type { GameState, BoardSize, Difficulty } from '../types/sudoku';
import { generateSudoku } from '../utils/sudoku-generator';
import { validateBoard, isBoardComplete, isBoardCorrect } from '../utils/sudoku-solver';

const STORAGE_KEY = 'sudoku-kids-game-state';

/**
 * Global reactive game state
 * Reference: spec.md §Key Entities - GameSession
 */
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

  /**
   * Start a new game with given parameters
   * Reference: spec.md §US1 - user selects difficulty and size
   */
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

  /**
   * Select a cell for editing
   * Reference: spec.md §US2-4 - pre-filled cells cannot be edited
   */
  function selectCell(row: number, col: number): void {
    if (!gameState.value.board) return;
    
    const cell = gameState.value.board.cells[row]?.[col];
    if (!cell || cell.isPreFilled) return;

    // Deselect previous cell
    if (gameState.value.selectedCell) {
      const { row: prevRow, col: prevCol } = gameState.value.selectedCell;
      const prevCell = gameState.value.board.cells[prevRow]?.[prevCol];
      if (prevCell) prevCell.isSelected = false;
    }

    cell.isSelected = true;
    gameState.value.selectedCell = { row, col };
  }

  /**
   * Fill number in selected cell
   * Reference: spec.md §US2, §FR-003
   */
  function fillNumber(value: number | null): void {
    if (!gameState.value.board || !gameState.value.selectedCell) return;
    
    const { row, col } = gameState.value.selectedCell;
    const cell = gameState.value.board.cells[row]?.[col];
    
    if (!cell || cell.isPreFilled) return;
    
    cell.value = value;
    cell.isError = false; // Clear error on edit per spec.md §US4-4
    saveToStorage();
  }

  function clearSelectedCell(): void {
    fillNumber(null);
  }

  /**
   * Check answers - only marks errors on explicit user action
   * Reference: spec.md §FR-006 Clarification - not realtime
   * Reference: spec.md §US4
   */
  function checkAnswers(): { hasErrors: boolean; isComplete: boolean } {
    if (!gameState.value.board) {
      return { hasErrors: false, isComplete: false };
    }

    const { cells, solution, size } = gameState.value.board;
    
    // Build grid from cells
    const grid: (number | null)[][] = [];
    for (let r = 0; r < size; r++) {
      const row: (number | null)[] = [];
      for (let c = 0; c < size; c++) {
        row.push(cells[r]?.[c]?.value ?? null);
      }
      grid.push(row);
    }
    
    // Clear all error markers first
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = cells[r]?.[c];
        if (cell) cell.isError = false;
      }
    }

    // Mark errors
    const errors = validateBoard(grid, solution, size);
    for (const { row, col } of errors) {
      const cell = cells[row]?.[col];
      if (cell) cell.isError = true;
    }

    const complete = isBoardComplete(grid, size);
    const correct = isBoardCorrect(grid, solution, size);

    // Trigger celebration per spec.md §FR-007
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

  /**
   * Reset current game to initial state
   */
  function resetGame(): void {
    if (!gameState.value.board) return;
    
    const { cells, size } = gameState.value.board;
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = cells[r]?.[c];
        if (cell && !cell.isPreFilled) {
          cell.value = null;
          cell.isError = false;
        }
        if (cell) cell.isSelected = false;
      }
    }
    
    gameState.value.selectedCell = null;
    gameState.value.isComplete = false;
    gameState.value.isChecking = false;
    saveToStorage();
  }

  /**
   * Save to localStorage per spec.md §FR-014
   */
  function saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState.value));
      } catch (e) {
        console.warn('Failed to save game state:', e);
      }
    }
  }

  /**
   * Load from localStorage per spec.md §FR-014
   * Reference: spec.md Edge Case - refresh page restore
   */
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
