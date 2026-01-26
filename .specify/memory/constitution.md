<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version change: N/A → 1.0.0 (Initial ratification)
Added sections:
  - Core Principles (5 principles)
  - User Experience Standards
  - Development Workflow
  - Governance
Templates requiring updates:
  - ✅ plan-template.md (no changes needed)
  - ✅ spec-template.md (no changes needed)
  - ✅ tasks-template.md (no changes needed)
Follow-up TODOs: None
================================================================================
-->

# 数独游戏 (Sudoku Kids) Constitution

## Core Principles

### I. 用户体验优先 (User Experience First)

所有设计和开发决策 MUST 以小学生用户体验为核心考量：
- 界面元素 MUST 足够大，便于触摸操作（最小触摸目标 44×44px）
- 交互反馈 MUST 即时且明显（视觉、声音或触觉）
- 错误提示 MUST 友好且具有教育意义，不产生挫败感
- 游戏难度 MUST 循序渐进，鼓励学习而非惩罚错误

**理由**：目标用户是小学生，他们的认知能力、手指精细度和耐心与成人不同，产品必须适应他们的特点。

### II. 响应式设计 (Responsive Design)

应用 MUST 在所有目标设备上提供一致的核心体验：
- 支持设备：手机（竖屏）、平板（横竖屏）、PC 浏览器
- 布局 MUST 根据屏幕尺寸自适应，不依赖水平滚动
- 触摸和鼠标交互 MUST 同等支持
- 打印样式 MUST 独立优化，确保纸质版可读性

**理由**：学生可能在不同设备上使用，必须保证所有场景下的可用性。

### III. 可访问性 (Accessibility)

应用 MUST 符合 WCAG 2.1 AA 标准：
- 所有交互元素 MUST 支持键盘导航
- 颜色对比度 MUST 达到 4.5:1 以上
- 重要信息不能仅依靠颜色传达
- 所有非装饰性图像 MUST 有替代文本

**理由**：教育产品应该对所有学生包容，包括有视觉或运动障碍的学生。

### IV. 代码质量与可维护性 (Code Quality)

代码 MUST 遵循以下标准：
- TypeScript 严格模式，禁止 `any` 类型
- 组件 MUST 小而专注，单一职责
- 业务逻辑 MUST 与 UI 分离（composables/utils）
- 所有公共 API MUST 有类型定义
- 关键逻辑 MUST 有单元测试覆盖

**理由**：作为演示项目，代码质量本身就是展示内容的一部分。

### V. 简洁性 (Simplicity)

遵循 YAGNI 和 KISS 原则：
- 不添加当前需求未明确要求的功能
- 优先使用框架内置功能，避免不必要的依赖
- 配置和代码 MUST 尽可能简单直接
- 复杂度 MUST 有明确的业务需求支撑

**理由**：过度工程会增加维护成本，降低代码可读性。

## User Experience Standards

### 视觉设计
- 使用明亮、友好的色彩方案，适合儿童
- 字体大小 MUST ≥ 16px（基准），数字显示 ≥ 24px
- 游戏棋盘格子边界 MUST 清晰可辨
- 预填数字与用户填写数字 MUST 有明显视觉区分

### 交互设计
- 拖拽操作 MUST 有明显的视觉提示（拖拽源高亮、放置目标指示）
- 点击数字选择 MUST 提供清晰的当前选中状态
- 错误输入 SHOULD 提供撤销机会而非立即否定
- 完成游戏 MUST 有庆祝动画/反馈

### 性能要求
- 首次加载时间 SHOULD < 3 秒（3G 网络）
- 交互响应 MUST < 100ms
- 动画 MUST 流畅（60fps）

## Development Workflow

### 技术栈约束
- 前端框架：Vue 3 + Nuxt.js
- 样式方案：TailwindCSS
- 构建工具：Vite（Nuxt 内置）
- 包管理器：pnpm
- 类型系统：TypeScript（strict mode）

### 开发流程
1. 功能开发前 MUST 先有规格文档（spec.md）
2. 复杂功能 SHOULD 有技术方案（plan.md）
3. 代码提交 MUST 有清晰的 commit message（Conventional Commits）
4. 每个功能 SHOULD 有对应的测试

### 代码审查要点
- 符合本 Constitution 中的原则
- 无明显的性能问题
- 无可访问性回归
- 代码风格一致

## Governance

本 Constitution 是项目的最高指导原则：
- 所有代码变更 MUST 符合上述原则
- 原则冲突时，按顺序优先级解决（I > II > III > IV > V）
- Constitution 修订 MUST 记录变更原因和影响范围
- 任何例外 MUST 在代码注释中明确说明理由

修订流程：
1. 提出修订建议并说明理由
2. 评估对现有代码的影响
3. 更新 Constitution 版本号
4. 同步更新受影响的模板和文档

**Version**: 1.0.0 | **Ratified**: 2026-01-26 | **Last Amended**: 2026-01-26
