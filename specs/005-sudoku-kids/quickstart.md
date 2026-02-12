# Quick Start: Sudoku Kids Learning Game

**Feature**: Sudoku Kids Learning Game  
**Date**: 2026-02-12  
**Purpose**: Developer onboarding guide for the Sudoku Kids game project

## Prerequisites

### Required Software

- **Node.js**: v18.x or higher (LTS recommended)
- **pnpm**: v8.x or higher (package manager)
- **Git**: Latest version

### Optional Tools

- **VS Code** or **WebStorm**: Recommended IDE
- **Chrome DevTools**: For debugging
- **Playwright Browser**: For E2E testing

## Getting Started

### 1. Clone and Setup

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd speckit-demo

# Navigate to the feature branch
git checkout 005-sudoku-kids

# Install dependencies
cd sudoku-kids
pnpm install
```

### 2. Development Server

```bash
# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

The development server will:
- Compile TypeScript
- Generate TailwindCSS
- Hot-reload on file changes
- Provide error feedback in browser console

### 3. Project Structure

```
sudoku-kids/
├── assets/styles/main.css    # Global styles
├── components/
│   ├── game/                 # Game-specific components
│   └── ui/                   # Reusable UI components
├── composables/              # Business logic
├── layouts/default.vue       # App layout
├── pages/                    # Route pages
├── stores/                   # Pinia state management
├── types/                    # TypeScript definitions
├── utils/                    # Utility functions
└── [config files]            # Nuxt, TypeScript, TailwindCSS configs
```

## Development Workflow

### Adding a New Feature

1. **Create component** in `components/` directory
2. **Add business logic** in `composables/` if needed
3. **Create page** in `pages/` directory
4. **Add types** in `types/` if needed
5. **Test functionality** manually in browser

### Running Tests

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch
```

### Code Quality

```bash
# Run ESLint
pnpm lint

# Auto-fix ESLint issues
pnpm lint:fix

# Format code with Prettier
pnpm format
```

## Key Development Tasks

### 1. Sudoku Generation

**File**: `utils/sudoku-generator.ts`

The `generateCompleteSolution()` function uses backtracking to create valid Sudoku boards. Key points:
- Generate complete solution first
- Remove cells based on difficulty level
- Validate unique solution

**Testing**:
- Generate 10 puzzles for each difficulty
- Verify each has unique solution
- Check pre-filled cell counts match difficulty

### 2. Number Validation

**File**: `utils/sudoku-validator.ts`

The `isValidPlacement()` function checks if a number can be placed in a cell. Key points:
- Check row duplicates
- Check column duplicates
- Check box (subgrid) duplicates

**Testing**:
- Test valid placements
- Test invalid placements (row, column, box conflicts)
- Test edge cases (first/last cells)

### 3. Drag and Drop

**File**: `components/game/SudokuBoard.vue`, `components/game/NumberPad.vue`

Implementation uses HTML5 Drag and Drop API:
- `draggable="true"` on number buttons
- `@dragstart` stores selected number
- `@dragover` allows drop on empty cells
- `@drop` validates and places number

**Testing**:
- Test drag from number pad to cell
- Test drag to invalid cells (outside board)
- Test drag to pre-filled cells (should be blocked)

### 4. IndexedDB Storage

**File**: `composables/useStorage.ts`

Uses `idb-keyval` for simplified IndexedDB access:
- `saveSession()`: Saves or updates game session
- `loadHistory()`: Loads all sessions
- `deleteSession()`: Removes specific session
- `exportHistory()`: Exports as JSON

**Testing**:
- Save and load sessions
- Verify 50 session limit
- Test export functionality

### 5. QR Code Generation

**File**: `utils/qr-generator.ts`, `composables/usePrint.ts`

Uses `qrcode` library for client-side generation:
- Generate QR code pointing to `/answer/[gameId]`
- Store solution in sessionStorage
- Scan QR code to view answer

**Testing**:
- Generate QR codes for multiple puzzles
- Verify QR codes are scannable
- Test answer page loads correctly

## Common Issues

### Issue: "Cannot find module '@volar/typescript'"

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules .nuxt
pnpm install
```

### Issue: TailwindCSS classes not working

**Solution**:
```bash
# Restart dev server
pnpm dev
```

The TailwindCSS PostCSS plugin needs to process the CSS file first.

### Issue: Drag and drop not working

**Solution**:
- Ensure `draggable="true"` is set on number buttons
- Check `@dragstart` emits with number value
- Verify `@dragover` has `event.preventDefault()`
- Check `@drop` validates number placement

### Issue: IndexedDB quota exceeded

**Solution**:
- The app automatically removes oldest sessions when > 50
- Check browser storage settings
- Clear old data if needed

## Code Style

### TypeScript

- Use strict mode (configured in `tsconfig.json`)
- Use type annotations for all function parameters
- Use interfaces for object shapes
- Use enums for fixed value sets

### Vue Components

- Use `<script setup>` syntax
- Use Composition API with `<script setup lang="ts">`
- Define props and emits with TypeScript interfaces
- Use `ref()` and `computed()` for reactive state

### Naming Conventions

- **Components**: PascalCase (e.g., `SudokuBoard.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useSudoku.ts`)
- **Stores**: camelCase with `use` prefix (e.g., `useGameStore.ts`)
- **Utils**: camelCase (e.g., `sudoku-generator.ts`)
- **Types**: PascalCase (e.g., `GameSession`)

### File Organization

- Group related files in directories
- Use barrel exports (`index.ts`) for types
- Keep components focused and small (< 300 lines)

## Testing Checklist

Before committing code:

- [ ] All ESLint errors resolved
- [ ] Code formatted with Prettier
- [ ] TypeScript compilation succeeds
- [ ] Manual testing completed
- [ ] No console.log statements
- [ ] Touch targets meet minimum size (44x44px mobile, 40x40px desktop)
- [ ] Color contrast meets WCAG 2.1 AA standard

## Deployment

### Build for Production

```bash
# Build static site
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables

No environment variables required. All configuration is in `nuxt.config.ts`.

### Deploy to Netlify (Example)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## Getting Help

### Documentation

- **Nuxt 3 Docs**: https://nuxt.com
- **Vue 3 Docs**: https://vuejs.org
- **Pinia Docs**: https://pinia.vuejs.org
- **TailwindCSS Docs**: https://tailwindcss.com

### Internal Resources

- **Feature Specification**: `specs/005-sudoku-kids/spec.md`
- **Implementation Plan**: `specs/005-sudoku-kids/plan.md`
- **Data Model**: `specs/005-sudoku-kids/data-model.md`
- **API Contracts**: `specs/005-sudoku-kids/contracts/api.md`
- **Constitution**: `.specify/memory/constitution.md`

### Common Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## Next Steps

After completing this quick start:

1. Review the feature specification to understand requirements
2. Explore the implementation plan for technical decisions
3. Check the data model to understand entities
4. Review API contracts for component/store interfaces
5. Start implementing features following the task list (when generated)

Happy coding! 🎮
