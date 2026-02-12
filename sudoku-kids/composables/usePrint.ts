import type { Difficulty, BoardSize, PrintableGame, PrintJob } from '~/types/sudoku';
import { generateCompleteSolution, createPuzzle, boardToMatrix, cloneBoard } from '~/utils/sudoku-generator';
import { generateQRCode } from '~/utils/qr-generator';
import { generatePrintJobId } from '~/utils/id-generator';

export function usePrint() {
  async function generatePrintJob(
    count: number,
    difficulty: Difficulty,
    boardSize: BoardSize
  ): Promise<PrintJob> {
    const games: PrintableGame[] = [];

    for (let i = 0; i < count; i++) {
      const solution = generateCompleteSolution(boardSize);
      const puzzle = createPuzzle(solution, difficulty);
      const gameId = generatePrintJobId();

      const printableGame: PrintableGame = {
        id: gameId,
        sequence: i + 1,
        board: puzzle,
        solution: boardToMatrix(solution),
        qrCodeDataUrl: await generateQRCode(gameId)
      };

      games.push(printableGame);

      sessionStorage.setItem(
        `print_game_${gameId}`,
        JSON.stringify({
          solution: boardToMatrix(solution),
          difficulty,
          boardSize,
          createdAt: Date.now()
        })
      );
    }

    return {
      id: generatePrintJobId(),
      count,
      difficulty,
      boardSize,
      pageSize: 'A4',
      games,
      createdAt: Date.now()
    };
  }

  function getAnswerById(gameId: string): number[][] | null {
    const data = sessionStorage.getItem(`print_game_${gameId}`);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      return parsed.solution;
    } catch {
      return null;
    }
  }

  return {
    generatePrintJob,
    getAnswerById
  };
}
