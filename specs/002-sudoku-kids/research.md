# Research: Sudoku for Kids

## Sudoku Generator Library

We need a library to generate Sudoku puzzles with varying difficulty.

Decision: We will use the `sudoku-gen` library (https://www.npmjs.com/package/sudoku-gen) because it is lightweight and supports generating puzzles with different difficulties.

Rationale:
- It supports easy, medium, hard, and expert levels.
- It has no dependencies.
- It is actively maintained.

Alternatives considered:
- `sudoku`: Another popular library but with more dependencies.
- Custom implementation: Would take more time and might have bugs.

## PDF Generation for Printing

We need to generate PDFs for printing multiple puzzles.

Decision: We will use `jspdf` (https://www.npmjs.com/package/jspdf) because it is widely used and supports generating PDFs from HTML.

Rationale:
- It is easy to use and has good documentation.
- It supports adding images and text.

Alternatives considered:
- `pdfmake`: Also popular but requires a different API.
- Server-side generation: Not needed since we are client-only.
