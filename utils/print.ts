// Print utility functions

// Generate printable HTML for Sudoku puzzles
export function generatePrintHtml(boards: any[], boardSize: number, difficulty: string): string {
  const boardSizeLabels = {
    4: '4×4',
    6: '6×6',
    9: '9×9'
  }
  
  const difficultyLabels = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    expert: '专家'
  }
  
  const puzzlesHtml = boards.map((board, index) => {
    return `
      <div class="puzzle">
        <h3>题目 ${index + 1}</h3>
        <table class="sudoku-board">
          ${board.cells.map((row: any[], rowIndex: number) => `
            <tr>
              ${row.map((cell: any, colIndex: number) => `
                <td class="cell ${getRowBorderClass(rowIndex, boardSize)} ${getColBorderClass(colIndex, boardSize)}">
                  ${cell.isPrefilled ? cell.value : ''}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </table>
      </div>
    `
  }).join('')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>数独练习题</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .puzzle {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .puzzle h3 {
          text-align: center;
          margin-bottom: 10px;
        }
        
        .sudoku-board {
          border-collapse: collapse;
          margin: 0 auto;
          border: 2px solid #000;
        }
        
        .cell {
          width: 30px;
          height: 30px;
          text-align: center;
          vertical-align: middle;
          font-size: 16px;
          font-weight: bold;
          border: 1px solid #999;
        }
        
        @media print {
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>数独练习题</h1>
        <p>盘面大小: ${boardSizeLabels[boardSize as keyof typeof boardSizeLabels]} | 难度: ${difficultyLabels[difficulty as keyof typeof difficultyLabels]}</p>
      </div>
      
      <div class="puzzles">
        ${puzzlesHtml}
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()">打印</button>
        <button onclick="window.close()">关闭</button>
      </div>
    </body>
    </html>
  `
}

// Get row border class for thick borders
function getRowBorderClass(rowIndex: number, boardSize: number): string {
  const boxHeight = boardSize === 6 ? 2 : 3
  if ((rowIndex + 1) % boxHeight === 0 && rowIndex < boardSize - 1) {
    return 'thick-bottom'
  }
  return ''
}

// Get column border class for thick borders
function getColBorderClass(colIndex: number, boardSize: number): string {
  const boxWidth = boardSize === 6 ? 3 : 3
  if ((colIndex + 1) % boxWidth === 0 && colIndex < boardSize - 1) {
    return 'thick-right'
  }
  return ''
}

// Open print window with generated content
export function openPrintWindow(htmlContent: string): void {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    // Wait a bit for content to load before printing
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 250)
  }
}
