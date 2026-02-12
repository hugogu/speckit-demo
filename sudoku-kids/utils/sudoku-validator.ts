import type { BoardSize, Cell, SudokuBoard } from '~/types/sudoku';

export function checkRow(board: SudokuBoard, row: number, value: number): boolean {
  for (let col = 0; col < board.size; col++) {
    if (board.cells[row][col].value === value) {
      return false;
    }
  }
  return true;
}

export function checkCol(board: SudokuBoard, col: number, value: number): boolean {
  for (let row = 0; row < board.size; row++) {
    if (board.cells[row][col].value === value) {
      return false;
    }
  }
  return true;
}

export function checkBox(board: SudokuBoard, row: number, col: number, value: number): boolean {
  const boxRow = Math.floor(row / board.boxRows) * board.boxRows;
  const boxCol = Math.floor(col / board.boxCols) * board.boxCols;

  for (let r = 0; r < board.boxRows; r++) {
    for (let c = 0; c < board.boxCols; c++) {
      if (board.cells[boxRow + r][boxCol + c].value === value) {
        return false;
      }
    }
  }
  return true;
}

export function isValidPlacement(board: SudokuBoard, row: number, col: number, value: number): boolean {
  return checkRow(board, row, value) && checkCol(board, col, value) && checkBox(board, row, col, value);
}

export function isValidBoard(board: SudokuBoard): boolean {
  for (let row = 0; row < board.size; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < board.size; col++) {
      const value = board.cells[row][col].value;
      if (value !== null) {
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
  }

  for (let col = 0; col < board.size; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < board.size; row++) {
      const value = board.cells[row][col].value;
      if (value !== null) {
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
  }

  for (let boxRow = 0; boxRow < board.size; boxRow += board.boxRows) {
    for (let boxCol = 0; boxCol < board.size; boxCol += board.boxCols) {
      const seen = new Set<number>();
      for (let r = 0; r < board.boxRows; r++) {
        for (let c = 0; c < board.boxCols; c++) {
          const value = board.cells[boxRow + r][boxCol + c].value;
          if (value !== null) {
            if (seen.has(value)) return false;
            seen.add(value);
          }
        }
      }
    }
  }

  return true;
}

export function createEmptyBoard(size: BoardSize): SudokuBoard {
  const boxRows = size === 9 ? 3 : 2;
  const boxCols = size === 4 ? 2 : size === 6 ? 3 : 3;

  const cells: Cell[][] = [];
  for (let row = 0; row < size; row++) {
    cells[row] = [];
    for (let col = 0; col < size; col++) {
      cells[row][col] = {
        row,
        col,
        value: null,
        isFixed: false,
        isValid: null
      };
    }
  }

  return { size, boxRows, boxCols, cells };
}
