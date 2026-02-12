import { v4 as uuidv4 } from 'uuid';

export function generateGameId(): string {
  return uuidv4();
}

export function generateInputId(): string {
  return `input_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generatePrintJobId(): string {
  return `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
