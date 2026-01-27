# Data Model: Sudoku for Kids

## Game

Represents a Sudoku game.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the game |
| board | number[][] | Current state of the board |
| solution | number[][] | The solution of the puzzle |
| initialBoard | number[][] | The initial state of the board (with some cells empty) |
| difficulty | string | Difficulty level (easy, medium, hard) |
| size | number | Board size (4 or 9) |
| timeStarted | Date | When the game started |
| timeEnded | Date | When the game ended |
| errors | number | Number of errors made |
| completed | boolean | Whether the game is completed |
