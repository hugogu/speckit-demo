<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0 (Initial creation)
Modified principles: N/A (Initial creation)
Added sections:
  - Core Principles (6 principles)
  - User Experience Standards
  - Technical Standards
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ No changes needed (Constitution Check section is generic)
  - .specify/templates/spec-template.md: ✅ No changes needed (template is generic)
  - .specify/templates/tasks-template.md: ✅ No changes needed (template is generic)
Follow-up TODOs: None
-->

# 数独学习游戏 Constitution

## Core Principles

### I. 儿童友好优先 (Child-Friendly First)

所有设计决策 MUST 优先考虑小学生用户的认知能力和使用习惯：

- 界面元素 MUST 足够大，便于儿童点击和拖拽操作
- 颜色对比度 MUST 符合 WCAG AA 标准，确保视觉清晰
- 文字说明 MUST 使用简单易懂的语言，避免专业术语
- 错误提示 MUST 友好且具有教育意义，不产生挫败感
- 游戏节奏 MUST 适合儿童注意力特点，提供适当的休息提示

**理由**：目标用户是小学生，所有功能设计必须以他们的能力和体验为中心。

### II. 响应式设计 (Responsive Design)

应用 MUST 同时适配 PC Web 端和移动端：

- 布局 MUST 使用响应式设计，自动适应不同屏幕尺寸
- 触摸操作 MUST 与鼠标操作同等流畅
- 关键交互区域 MUST 满足移动端最小触摸目标尺寸（44x44px）
- 游戏棋盘 MUST 在任何设备上保持可玩性和可读性

**理由**：用户可能在学校电脑或家中平板/手机上使用，必须保证一致的体验。

### III. 双模式交互 (Dual-Mode Interaction)

游戏操作 MUST 同时支持点击和拖拽两种方式：

- 点击模式：选中数字后点击目标格子填入
- 拖拽模式：从数字面板拖拽数字到目标格子
- 两种模式 MUST 可以无缝切换，不需要额外设置
- 操作反馈 MUST 即时且明确（视觉高亮、动画效果）

**理由**：不同用户有不同的操作偏好，双模式提供最大的灵活性。

### IV. 即时反馈与教育性 (Instant Feedback & Educational)

游戏 MUST 提供即时的正误判断和教育性反馈：

- 填入数字后 MUST 立即判断对错
- 错误数字 MUST 自动跳回，并提供温和的视觉提示
- 正确填入 MUST 有积极的视觉反馈
- 完成游戏 MUST 显示胜利提示，包含用时和错误次数统计
- 游戏过程中 MUST 显示实时计时器

**理由**：即时反馈帮助儿童快速学习，避免错误习惯的形成。

### V. 游戏记录与进度追踪 (Game Recording & Progress Tracking)

每次游戏 MUST 记录完整信息：

- 游戏棋盘初始状态和最终状态
- 游戏用时（精确到秒）
- 填错次数
- 游戏难度和棋盘大小
- 完成状态（完成/放弃）
- 游戏日期时间

**理由**：记录帮助追踪学习进度，也便于家长和老师了解学生的学习情况。

### VI. 可定制性与打印支持 (Customization & Print Support)

游戏 MUST 支持灵活的定制和线下练习：

- 棋盘大小 MUST 可选（4×4、6×6、9×9）
- 难度级别 MUST 可调（简单、中等、困难）
- 打印功能 MUST 支持在一张纸上打印多个随机生成的游戏
- 打印布局 MUST 优化纸张利用率，便于线下练习

**理由**：不同年龄和水平的学生需要不同难度，打印功能支持无屏幕练习。

## User Experience Standards

用户体验标准确保产品质量和一致性：

- **加载性能**：首屏加载时间 MUST < 3 秒（3G 网络）
- **交互响应**：用户操作响应时间 MUST < 100ms
- **动画流畅**：所有动画 MUST 达到 60fps
- **离线支持**：核心游戏功能 SHOULD 支持离线使用
- **无障碍**：MUST 支持键盘导航和屏幕阅读器
- **国际化**：界面文字 MUST 支持中英文切换

## Technical Standards

技术标准确保代码质量和可维护性：

- **技术栈**：Vue 3 + Nuxt.js + TailwindCSS + TypeScript
- **代码规范**：MUST 遵循 ESLint + Prettier 配置
- **组件化**：UI 组件 MUST 独立、可复用、有明确的 Props/Events 接口
- **状态管理**：游戏状态 MUST 使用 Pinia 集中管理
- **测试覆盖**：核心游戏逻辑 MUST 有单元测试
- **类型安全**：MUST 使用 TypeScript 严格模式

## Governance

本 Constitution 是项目开发的最高指导原则：

- 所有功能设计和代码实现 MUST 符合上述原则
- 原则冲突时，按编号顺序优先（儿童友好 > 响应式 > 交互 > 反馈 > 记录 > 定制）
- 修改本 Constitution 需要明确的理由和文档记录
- 复杂度增加 MUST 有明确的用户价值证明

**Version**: 1.0.0 | **Ratified**: 2026-01-27 | **Last Amended**: 2026-01-27
