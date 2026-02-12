import type { BoardSize, Difficulty, GameSession, SudokuBoard, ValidationResult } from '~/types/sudoku';
import { generateCompleteSolution, createPuzzle, boardToMatrix } from '~/utils/sudoku-generator';
import { generateGameId } from '~/utils/id-generator';

export function useSudoku() {
  function generateGame(difficulty: Difficulty, boardSize: BoardSize): GameSession {
    const solution = generateCompleteSolution(boardSize);
    const puzzle = createPuzzle(solution, difficulty);

    const session: GameSession = {
      id: generateGameId(),
      startTime: Date.now(),
      endTime: null,
      difficulty,
      boardSize,
      initialBoard: boardToMatrix(puzzle),
      solution: boardToMatrix(solution),
      userInputs: [],
      errorCount: 0,
      isCompleted: false,
      elapsedTime: 0
    };

    return session;
  }

  function validateInput(session: GameSession, row: number, col: number, value: number): ValidationResult {
    const expectedValue = session.solution[row][col];
    const isCorrect = value === expectedValue;

    if (!isCorrect) {
      session.errorCount++;
    }

    const updatedBoard = [...session.initialBoard];
    for (const input of session.userInputs) {
      if (input.isCorrect) {
        updatedBoard[input.row][input.col] = input.value;
      }
    }
    updatedBoard[row][col] = value;

    const isCompleted = isCorrect && checkBoardComplete(updatedBoard, session.solution);

    return {
      isCorrect,
      expectedValue,
      errorCount: session.errorCount,
      isCompleted
    };
  }

  function checkCompletion(session: GameSession): boolean {
    const currentBoard = [...session.initialBoard];
    for (const input of session.userInputs) {
      if (input.isCorrect) {
        currentBoard[input.row][input.col] = input.value;
      }
    }
    return checkBoardComplete(currentBoard, session.solution);
  }

  return {
    generateGame,
    validateInput,
    checkCompletion
  };
}

function checkBoardComplete(current: number[][], solution: number[][]): boolean {
  for (let row = 0; row < current.length; row++) {
    for (let col = 0; col < current[row].length; col++) {
      if (current[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}
