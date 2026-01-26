import type { SudokuBoard, BoardSize, Difficulty } from '../types/sudoku';
import { generateSudoku } from './sudoku-generator';

export interface PrintOptions {
  includeCurrentState: boolean;
  count: number;
  size: BoardSize;
  difficulty: Difficulty;
}

export function preparePrintView(): void {
  document.body.classList.add('printing');
}

export function cleanupPrintView(): void {
  document.body.classList.remove('printing');
}

export function printCurrentGame(): void {
  window.print();
}

export function generatePrintablePuzzles(
  count: number,
  size: BoardSize,
  difficulty: Difficulty
): SudokuBoard[] {
  const puzzles: SudokuBoard[] = [];
  const maxCount = Math.min(count, 10);
  
  for (let i = 0; i < maxCount; i++) {
    puzzles.push(generateSudoku(size, difficulty));
  }
  
  return puzzles;
}

export function createPrintableHTML(puzzles: SudokuBoard[]): string {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>数独练习题</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 20px; }
        .page { page-break-after: always; margin-bottom: 40px; }
        .page:last-child { page-break-after: auto; }
        .puzzle-header { text-align: center; margin-bottom: 20px; }
        .puzzle-title { font-size: 24px; font-weight: bold; }
        .puzzle-info { color: #666; margin-top: 5px; }
        .grid { 
          display: inline-grid; 
          border: 2px solid black; 
          margin: 0 auto;
        }
        .cell {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          border: 1px solid #ccc;
        }
        .cell--prefilled { color: #333; }
        .cell--empty { color: transparent; }
        .box-right { border-right: 2px solid black; }
        .box-bottom { border-bottom: 2px solid black; }
        @media print {
          body { padding: 0; }
          .page { margin-bottom: 0; }
        }
      </style>
    </head>
    <body>
  `;

  puzzles.forEach((puzzle, index) => {
    const boxRows = puzzle.size === 6 ? 2 : puzzle.size === 4 ? 2 : 3;
    const boxCols = puzzle.size === 6 ? 3 : puzzle.size === 4 ? 2 : 3;

    html += `
      <div class="page">
        <div class="puzzle-header">
          <div class="puzzle-title">数独练习 #${index + 1}</div>
          <div class="puzzle-info">${puzzle.size}×${puzzle.size} 棋盘</div>
        </div>
        <div class="grid" style="grid-template-columns: repeat(${puzzle.size}, 40px);">
    `;

    for (let row = 0; row < puzzle.size; row++) {
      for (let col = 0; col < puzzle.size; col++) {
        const cell = puzzle.cells[row][col];
        const classes = ['cell'];
        
        if (cell.isPreFilled) {
          classes.push('cell--prefilled');
        } else {
          classes.push('cell--empty');
        }
        
        if ((col + 1) % boxCols === 0 && col < puzzle.size - 1) {
          classes.push('box-right');
        }
        if ((row + 1) % boxRows === 0 && row < puzzle.size - 1) {
          classes.push('box-bottom');
        }

        html += `<div class="${classes.join(' ')}">${cell.value || '&nbsp;'}</div>`;
      }
    }

    html += `
        </div>
      </div>
    `;
  });

  html += `
    </body>
    </html>
  `;

  return html;
}

export function openPrintWindow(puzzles: SudokuBoard[]): void {
  const html = createPrintableHTML(puzzles);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
