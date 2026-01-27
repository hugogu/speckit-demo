# Research: 数独学习游戏

**Feature**: 001-sudoku-game  
**Date**: 2026-01-27  
**Status**: Complete

## Research Tasks

### 1. 数独生成算法

**Task**: 研究如何生成有唯一解的数独题目

**Decision**: 采用回溯算法 + 随机填充生成完整解，再按难度移除数字

**Rationale**:
- 回溯算法是生成数独的经典方法，实现简单且可靠
- 先生成完整解再移除数字可确保唯一解
- 移除数字时使用对称移除可保证棋盘美观

**Alternatives Considered**:
- Dancing Links (DLX): 更高效但实现复杂，对于客户端小规模生成无必要
- 预生成题库: 需要存储空间，且无法满足"随机生成"需求

**Implementation Notes**:
```typescript
// 生成步骤
1. 创建空棋盘
2. 使用回溯算法填充完整解
3. 随机打乱数字顺序增加随机性
4. 按难度级别移除数字（保留预填数量见 FR-029/030/031）
5. 验证移除后仍有唯一解
```

---

### 2. 拖拽交互实现

**Task**: 研究 Vue 3 中实现流畅拖拽的最佳实践

**Decision**: 使用原生 HTML5 Drag and Drop API + Touch Events 封装 composable

**Rationale**:
- 原生 API 无额外依赖，包体积小
- 可同时支持鼠标和触摸设备
- 通过 composable 封装可复用逻辑

**Alternatives Considered**:
- VueDraggable: 功能强大但主要用于列表排序，不适合数独场景
- @vueuse/gesture: 增加依赖，且数独拖拽需求简单

**Implementation Notes**:
```typescript
// useDragAndDrop.ts
- dragstart: 记录拖拽的数字
- dragover: 高亮可放置的格子
- drop: 填入数字并触发验证
- 触摸设备: 使用 touchstart/touchmove/touchend 模拟
```

---

### 3. 离线支持 (PWA)

**Task**: 研究 Nuxt 3 PWA 配置最佳实践

**Decision**: 使用 @vite-pwa/nuxt 插件配置 Service Worker

**Rationale**:
- 官方推荐的 Nuxt 3 PWA 解决方案
- 支持 Workbox 配置，可精细控制缓存策略
- 自动生成 manifest.json 和 service worker

**Alternatives Considered**:
- 手动配置 Service Worker: 工作量大，易出错
- @nuxtjs/pwa (Nuxt 2): 不兼容 Nuxt 3

**Implementation Notes**:
```typescript
// nuxt.config.ts
modules: ['@vite-pwa/nuxt'],
pwa: {
  registerType: 'autoUpdate',
  manifest: {
    name: '数独学习游戏',
    short_name: '数独',
    theme_color: '#4f46e5'
  },
  workbox: {
    navigateFallback: '/',
    globPatterns: ['**/*.{js,css,html,png,svg,ico}']
  }
}
```

---

### 4. localStorage 封装

**Task**: 研究 localStorage 存储游戏记录的最佳实践

**Decision**: 封装 storage utility，支持 JSON 序列化、容量检查、LRU 淘汰

**Rationale**:
- 直接使用 localStorage 需要手动 JSON 处理
- 需要实现 100 条记录上限的 LRU 淘汰策略
- 封装后可统一处理存储异常

**Alternatives Considered**:
- IndexedDB: 功能更强但 API 复杂，100 条记录无需
- @vueuse/core useStorage: 不支持 LRU 淘汰

**Implementation Notes**:
```typescript
// utils/storage.ts
const STORAGE_KEY = 'sudoku_records'
const MAX_RECORDS = 100

export function saveRecord(record: GameRecord) {
  const records = getRecords()
  records.unshift(record)
  if (records.length > MAX_RECORDS) {
    records.pop() // LRU: 移除最旧记录
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}
```

---

### 5. 打印布局优化

**Task**: 研究浏览器打印 CSS 最佳实践

**Decision**: 使用 @media print 样式 + CSS Grid 布局

**Rationale**:
- 纯 CSS 方案，无需额外库
- CSS Grid 可精确控制多题目布局
- @page 规则可设置纸张方向和边距

**Alternatives Considered**:
- jsPDF: 生成 PDF 但增加包体积，浏览器原生打印已足够
- html2canvas: 用于截图，打印场景不需要

**Implementation Notes**:
```css
@media print {
  @page {
    size: A4 portrait;
    margin: 1cm;
  }
  
  .print-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 9x9: 2列 */
    gap: 1cm;
  }
  
  .sudoku-cell {
    min-width: 1cm;
    min-height: 1cm;
  }
}
```

---

### 6. 响应式触摸目标

**Task**: 研究移动端触摸目标尺寸最佳实践

**Decision**: 所有可交互元素最小 44×44px，使用 TailwindCSS 响应式类

**Rationale**:
- 44×44px 是 Apple HIG 和 WCAG 推荐的最小触摸目标
- TailwindCSS 的 min-w-11 min-h-11 (44px) 可直接使用
- 响应式设计确保桌面端不会过大

**Implementation Notes**:
```html
<!-- 数字按钮 -->
<button class="min-w-11 min-h-11 md:min-w-10 md:min-h-10 ...">
  {{ number }}
</button>
```

---

## Summary

所有技术决策已确定，无 NEEDS CLARIFICATION 项。关键技术选型：

| 领域 | 决策 |
|------|------|
| 数独生成 | 回溯算法 + 对称移除 |
| 拖拽交互 | 原生 Drag & Drop + Touch Events |
| 离线支持 | @vite-pwa/nuxt |
| 数据存储 | localStorage + LRU 淘汰 |
| 打印布局 | @media print + CSS Grid |
| 触摸目标 | 最小 44×44px |

