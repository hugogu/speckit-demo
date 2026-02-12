<!--
Sync Impact Report
==================
Version change: (none) → 1.0.0
Modified principles: N/A (initial version)
Added sections: Core Principles, Technology Stack, Development Workflow, Governance
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - Constitution Check section
  ✅ .specify/templates/spec-template.md - Scope/requirements alignment
  ✅ .specify/templates/tasks-template.md - Task categorization
  ✅ .specify/templates/commands/*.md - No agent-specific references
Follow-up TODOs: None
-->

# Sudoku Kids Game Constitution

## Core Principles

### I. Child-Friendly Design
The user interface MUST be optimized for elementary students. All interactive elements MUST have minimum touch targets of 44x44 pixels for mobile and 40x40 pixels for desktop. Text MUST use simple, age-appropriate language (elementary reading level). Visual feedback MUST be immediate and unambiguous. Color palette MUST be high-contrast and color-blind accessible. Animations MUST be gentle and not distracting.

**Rationale**: Children aged 6-12 require larger touch targets, simpler language, and clearer feedback than adult-oriented interfaces. Overly complex UI or subtle feedback creates frustration and disengagement.

### II. Multi-Modal Input
The application MUST support both click-based and drag-and-drop number placement. Click interaction: select cell then select number. Drag interaction: drag number from pad to target cell. Both methods MUST produce identical game state and validation behavior. Touch events MUST be properly handled for mobile devices.

**Rationale**: Younger students often struggle with precise drag operations, while older students may find clicking tedious. Supporting both ensures accessibility across skill levels and device types.

### III. Real-Time Validation
Number placement MUST be validated immediately against the solution. Incorrect numbers MUST be rejected with visual feedback (bounce animation + color indication) and NOT committed to game state. Correct numbers MUST be confirmed visually and committed to game state. A victory state MUST be displayed when the board is complete.

**Rationale**: Immediate feedback helps students learn from mistakes and maintains engagement. Delayed or batch validation creates confusion and reduces learning effectiveness.

### IV. Local Persistence
Game sessions MUST be stored locally using IndexedDB. Each session MUST record: board state, start time, end time, elapsed time, error count, difficulty level, and board size. History MUST be viewable and exportable. Maximum of 50 sessions retained. No cloud synchronization or server-side storage.

**Rationale**: Elementary students' data privacy is paramount. Local storage ensures privacy while enabling progress tracking. Export capability allows parents/teachers to review progress.

### V. Responsive Design
The application MUST work seamlessly on desktop (1024px+) and mobile (375px+). Grid layout MUST adapt to screen width. Touch targets MUST meet minimum size requirements. Print layout MUST optimize for A4 paper with multiple puzzles per page. Orientation MUST be handled (landscape for print, portrait/landscape for web).

**Rationale**: Students may access games from various devices (home computers, tablets, smartphones). Print functionality enables offline practice in classrooms or homework.

## Technology Stack

The project MUST use:
- **Framework**: Nuxt 3 (Vue 3) with TypeScript
- **State Management**: Pinia for game state and history
- **Styling**: TailwindCSS with custom theme for child-friendly colors
- **Storage**: IndexedDB via idb-keyval for local persistence
- **QR Codes**: qrcode library for printed answer verification
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Code Quality**: ESLint + Prettier with strict TypeScript mode

**Rationale**: Modern, well-supported stack with strong TypeScript support ensures maintainability and type safety. TailwindCSS enables rapid UI development with consistent design system.

## Development Workflow

### Test-First Development
Unit tests MUST be written before implementation for:
- Sudoku generation algorithms
- Validation logic
- Storage operations
- QR code generation

E2E tests MUST cover:
- Game flow from start to completion
- Input methods (click and drag)
- Print functionality
- History viewing and export

### Code Review
All changes MUST pass code review with at least one reviewer. Review checklist:
- TypeScript strict mode compliance
- No console.log or debugging code
- Accessibility standards (WCAG 2.1 AA minimum)
- Mobile responsive behavior verified
- Print layout tested

### Quality Gates
- All tests MUST pass before merge
- Eslint MUST have zero errors
- Prettier formatting MUST be applied
- E2E tests MUST pass on Chrome and Firefox

## Governance

This constitution supersedes all other development practices. Amendments require:
1. Documentation of proposed change with rationale
2. Approval from project maintainer
3. Migration plan for existing code if breaking
4. Version bump according to semantic versioning:
   - MAJOR: Backward-incompatible principle changes
   - MINOR: New principles or section additions
   - PATCH: Clarifications or wording fixes

All pull requests MUST verify compliance with this constitution. Complexity MUST be justified in PR description. Use this constitution as the single source of truth for development decisions.

**Version**: 1.0.0 | **Ratified**: 2026-02-12 | **Last Amended**: 2026-02-12
