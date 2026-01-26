/**
 * Print Utilities
 * Reference: tasks.md T036-T040
 * Reference: spec.md §US5 - print game board
 * Reference: plan.md §打印实现
 */

import type { BoardSize, Difficulty, SudokuBoard } from '../types/sudoku';
import { generateSudoku } from './sudoku-generator';

export interface PrintOptions {
  includeAnswers: boolean;
  count: number;
}

/**
 * Generate CSS for print-optimized sudoku board
 */
function generatePrintCSS(): string {
  return `
    @media print {
      body { margin: 0; padding: 20mm; }
      .print-board { 
        page-break-inside: avoid;
        margin-bottom: 10mm;
      }
      .print-grid {
        display: grid;
        border: 2px solid #000;
        width: 180mm;
        margin: 0 auto;
      }
      .print-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #666;
        font-size: 24pt;
        font-weight: bold;
      }
      .print-cell.prefilled { color: #000; }
      .print-cell.empty { color: #999; }
      .box-right { border-right: 2px solid #000; }
      .box-bottom { border-bottom: 2px solid #000; }
      .print-header {
        text-align: center;
        margin-bottom: 5mm;
        font-size: 14pt;
      }
    }
  `;
}

/**
 * Generate HTML for a single board
 * Reference: spec.md §US5-2 - clear grid lines
 */
function generateBoardHTML(board: SudokuBoard, index: number, showAnswers: boolean): string {
  const { size, cells } = board;
  const boxRows = size === 4 ? 2 : size === 6 ? 2 : 3;
  const boxCols = size === 4 ? 2 : size === 6 ? 3 : 3;
  
  let html = `
    <div class="print-board">
      <div class="print-header">数独 #${index + 1} (${size}×${size})</div>
      <div class="print-grid" style="grid-template-columns: repeat(${size}, 1fr);">
  `;
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = cells[row]?.[col];
      const value = showAnswers || cell?.isPreFilled ? cell?.value || '' : '';
      const classes = [
        'print-cell',
        cell?.isPreFilled ? 'prefilled' : 'empty',
        (col + 1) % boxCols === 0 && col < size - 1 ? 'box-right' : '',
        (row + 1) % boxRows === 0 && row < size - 1 ? 'box-bottom' : '',
      ].filter(Boolean).join(' ');
      
      html += `<div class="${classes}">${value}</div>`;
    }
  }
  
  html += '</div></div>';
  return html;
}

/**
 * Print current game
 * Reference: spec.md §US5-1
 */
export function printCurrentGame(): void {
  window.print();
}

/**
 * Generate multiple puzzles for batch printing
 * Reference: spec.md §US5-4 - batch print up to 10
 * Reference: spec.md Clarification - max 10 puzzles
 */
export function generatePrintablePuzzles(
  count: number,
  size: BoardSize,
  difficulty: Difficulty
): SudokuBoard[] {
  const maxCount = Math.min(count, 10); // Per spec clarification
  const puzzles: SudokuBoard[] = [];
  
  for (let i = 0; i < maxCount; i++) {
    puzzles.push(generateSudoku(size, difficulty));
  }
  
  return puzzles;
}

/**
 * Open print window with multiple puzzles
 * Reference: spec.md §US5-4
 */
export function openPrintWindow(
  puzzles: SudokuBoard[],
  options: PrintOptions = { includeAnswers: false, count: 1 }
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('请允许弹窗以使用打印功能');
    return;
  }
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>数独打印</title>
      <style>${generatePrintCSS()}</style>
    </head>
    <body>
  `;
  
  puzzles.forEach((puzzle, index) => {
    html += generateBoardHTML(puzzle, index, options.includeAnswers);
  });
  
  html += `
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}
