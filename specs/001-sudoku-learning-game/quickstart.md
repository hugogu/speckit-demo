# Quickstart Guide: 数独学习游戏

## 开发环境设置

### 前置条件

- Node.js 16+
- pnpm 7+
- Git

### 安装步骤

1. 克隆仓库:
   ```bash
   git clone <repository-url>
   cd speckit-demo
   ```

2. 安装依赖:
   ```bash
   pnpm install
   ```

3. 启动开发服务器:
   ```bash
   pnpm dev
   ```

4. 在浏览器中打开 http://localhost:3000

## 项目结构

```text
app/
├── components/     # Vue组件
├── composables/    # 组合式函数
├── pages/          # 页面路由
├── stores/         # 状态管理
├── types/          # 类型定义
└── utils/          # 工具函数
```

## 核心功能模块

### 1. 数独生成器

位置: `app/composables/useSudokuGenerator.ts`

功能:
- 生成完整数独解
- 根据难度挖空生成题目
- 验证数独解的唯一性

### 2. 游戏状态管理

位置: `app/stores/game.ts`

功能:
- 管理当前游戏状态
- 处理用户输入
- 计时和统计
- 保存/恢复游戏

### 3. 游戏组件

位置: `app/components/game/`

主要组件:
- `SudokuBoard.vue` - 棋盘
- `SudokuCell.vue` - 格子
- `NumberPad.vue` - 数字面板
- `Timer.vue` - 计时器
- `Controls.vue` - 控制按钮

## 开发流程

### 添加新功能

1. 在 `specs/001-sudoku-learning-game/spec.md` 中添加用户故事
2. 运行 `/speckit.tasks` 生成任务列表
3. 实现功能代码
4. 编写测试
5. 更新文档

### 测试

- 运行单元测试: `pnpm test:unit`
- 运行E2E测试: `pnpm test:e2e`
- 运行所有测试: `pnpm test`

### 构建和部署

- 构建生产版本: `pnpm build`
- 本地预览: `pnpm preview`
- Docker部署: `pnpm docker:build`

## 常见问题

### 1. 开发服务器启动失败

检查端口是否被占用，默认使用3000端口。

### 2. 类型错误

运行 `pnpm typecheck` 检查类型问题。

### 3. 样式问题

确保Tailwind CSS类名拼写正确，重启开发服务器可能有帮助。

## 贡献指南

1. 从 `main` 分支创建功能分支
2. 实现功能并通过所有测试
3. 提交前运行 `pnpm lint` 格式化代码
4. 创建Pull Request并关联相关Issue
