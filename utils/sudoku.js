// Sudoku puzzle generator and validator
export function generateSudoku(size, difficulty) {
  // Create an empty board
  const board = Array(size).fill().map(() => Array(size).fill(0));
  
  // Fill the board with a valid solution
  fillSolution(board, size);
  
  // Create a puzzle by removing numbers based on difficulty
  const puzzle = removeNumbers(board, size, difficulty);
  
  return {
    solution: board,
    puzzle: puzzle
  };
}

function fillSolution(board, size) {
  // Implement recursive backtracking to fill the board
  const numbers = Array.from({length: size}, (_, i) => i + 1);
  
  function solve() {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          shuffleArray(numbers);
          
          for (const num of numbers) {
            if (isValidPlacement(board, row, col, num, size)) {
              board[row][col] = num;
              
              if (solve()) {
                return true;
              }
              
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  solve();
}

function removeNumbers(board, size, difficulty) {
  // Determine how many cells to remove based on difficulty
  const cellsToRemove = {
    easy: Math.floor(size * size * 0.4),
    medium: Math.floor(size * size * 0.55),
    hard: Math.floor(size * size * 0.65)
  }[difficulty] || Math.floor(size * size * 0.5);
  
  const puzzle = JSON.parse(JSON.stringify(board));
  let removed = 0;
  
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    
    if (puzzle[row][col] !== 0) {
      // Save the value before removing
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;
      
      // Check if the puzzle still has a unique solution
      if (hasUniqueSolution(puzzle, size)) {
        removed++;
      } else {
        // Restore the value if removal makes multiple solutions
        puzzle[row][col] = backup;
      }
    }
  }
  
  return puzzle;
}

function isValidPlacement(board, row, col, num, size) {
  // Check row
  for (let i = 0; i < size; i++) {
    if (board[row][i] === num) return false;
  }
  
  // Check column
  for (let i = 0; i < size; i++) {
    if (board[i][col] === num) return false;
  }
  
  // Check subgrid
  const subSize = Math.sqrt(size);
  const startRow = Math.floor(row / subSize) * subSize;
  const startCol = Math.floor(col / subSize) * subSize;
  
  for (let i = 0; i < subSize; i++) {
    for (let j = 0; j < subSize; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  
  return true;
}

function hasUniqueSolution(puzzle, size) {
  // Create a copy of the puzzle
  const board = JSON.parse(JSON.stringify(puzzle));
  let solutionCount = 0;
  
  function countSolutions() {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= size; num++) {
            if (isValidPlacement(board, row, col, num, size)) {
              board[row][col] = num;
              
              if (countSolutions() > 1) {
                return 2; // Short-circuit if already multiple solutions
              }
              
              board[row][col] = 0;
            }
          }
          return solutionCount;
        }
      }
    }
    solutionCount++;
    return solutionCount;
  }
  
  return countSolutions() === 1;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Validation function for user moves
export function validateMove(puzzle, solution, row, col, value) {
  return solution[row][col] === value;
}

// Check if the board is complete and correct
export function isBoardComplete(puzzle, solution) {
  for (let row = 0; row < puzzle.length; row++) {
    for (let col = 0; col < puzzle[row].length; col++) {
      if (puzzle[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}
