# Quick Start Guide: 数独学习游戏

**Feature**: 小学生数独学习游戏  
**Branch**: `004-sudoku-kids`  
**Last Updated**: 2025-02-12

---

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or pnpm/yarn)
- **Browser**: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+

---

## Setup Instructions

### 1. Clone and Checkout

```bash
git clone <repo-url>
cd speckit-demo
git checkout 004-sudoku-kids
```

### 2. Install Dependencies

```bash
cd sudoku-kids
npm install
```

### 3. Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## Project Structure Overview

```
sudoku-kids/
├── components/          # Vue 组件
│   ├── ui/             # 基础UI组件
│   ├── game/           # 游戏相关组件
│   └── layout/         # 布局组件
├── composables/        # 组合式函数（核心业务逻辑）
│   ├── useSudoku.ts    # 数独生成与验证
│   ├── useTimer.ts     # 计时器
│   ├── useStorage.ts   # 本地存储
│   └── usePrint.ts     # 打印功能
├── pages/              # Nuxt 页面路由
│   ├── index.vue       # 主页（难度选择）
│   ├── play.vue        # 游戏页面
│   ├── history.vue     # 历史记录
│   ├── print.vue       # 打印页面
│   └── answer/[id].vue # 答案查询（扫码用）
├── stores/             # Pinia 状态管理
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
└── tests/              # 测试文件
```

---

## Key Development Workflows

### Adding a New Component

1. Create `.vue` file in appropriate `components/` subdirectory
2. Import and use in pages or parent components
3. Add unit tests in `tests/unit/`

Example:
```vue
<!-- components/game/MyNewComponent.vue -->
<template>
  <div class="my-component">
    <!-- Your template -->
  </div>
</template>

<script setup lang="ts">
// Your logic
</script>
```

### Adding a New Composable

1. Create `useXxx.ts` in `composables/`
2. Nuxt auto-imports it - just use in components

Example:
```typescript
// composables/useNewFeature.ts
export function useNewFeature() {
  const doSomething = () => {
    // Implementation
  }
  
  return { doSomething }
}
```

### Adding a New Page

1. Create `.vue` file in `pages/`
2. Nuxt auto-generates route based on file path

Example:
```vue
<!-- pages/my-page.vue -->
<template>
  <div>
    <h1>My Page</h1>
  </div>
</template>
```

Auto-generated route: `/my-page`

---

## Testing

### Unit Tests

```bash
npm run test:unit
```

Uses Vitest for fast unit testing of composables and utilities.

### E2E Tests

```bash
npm run test:e2e
```

Uses Playwright for end-to-end browser testing.

Key test scenarios:
- Complete game flow (start → play → finish)
- Difficulty and size selection
- Input validation (correct/wrong)
- Timer accuracy
- History persistence
- Print functionality

---

## Code Style & Quality

### Linting

```bash
npm run lint          # Check for issues
npm run lint:fix      # Fix auto-fixable issues
```

### Formatting

```bash
npm run format        # Format all files with Prettier
```

### Type Checking

```bash
npm run typecheck     # Run TypeScript compiler check
```

---

## Common Issues & Solutions

### Issue: IndexedDB not working in private browsing

**Solution:** Private/Incognito mode may block IndexedDB. Implement fallback to localStorage or show user notification.

### Issue: QR code not scanning

**Solution:** 
- Ensure QR code size >= 2cm x 2cm when printed
- Use high print quality (avoid draft mode)
- Verify QR code uses high error correction level (H)

### Issue: Drag & drop not working on mobile

**Solution:** 
- HTML5 DnD doesn't work on all mobile browsers
- Implemented touch event fallback in `useSudoku.ts`
- Both drag and click modes always available

### Issue: Sudoku generation taking too long

**Solution:**
- Hard difficulty with large boards (9x9) may take longer
- Implement timeout with retry logic
- Consider web worker for generation to avoid blocking UI

---

## Environment Variables

Create `.env` file in `sudoku-kids/`:

```bash
# Development
NUXT_PORT=3000
NUXT_HOST=0.0.0.0

# Production (set during build/deploy)
# NUXT_APP_BASE_URL=/sudoku-kids/  # If deploying to subpath
```

---

## Deployment Checklist

- [ ] `npm run build` succeeds without errors
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` shows no critical issues
- [ ] `npm run test:unit` passes
- [ ] `npm run test:e2e` passes (key scenarios)
- [ ] Tested on target devices (mobile + desktop)
- [ ] Print functionality tested with actual printer
- [ ] QR code scanning tested with multiple devices

---

## Resources

- **Design Mockups**: [Figma/Design link if available]
- **API Documentation**: [../contracts/api.md](contracts/api.md)
- **Data Model**: [../data-model.md](data-model.md)
- **Tech Research**: [../research.md](research.md)
- **Feature Spec**: [../spec.md](spec.md)

---

## Getting Help

If you encounter issues:

1. Check this Quick Start guide
2. Review [contracts/api.md](contracts/api.md) for API usage
3. Check [data-model.md](data-model.md) for data structures
4. Review test files in `tests/` for usage examples
