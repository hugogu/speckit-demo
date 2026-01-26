# 数独游戏 (Sudoku Kids)

专为小学生设计的可自定义数独游戏，支持多种棋盘大小和难度级别。

## 功能特点

- 🎮 **多种棋盘大小**: 4×4 (入门), 6×6 (简单), 9×9 (标准)
- 🎯 **三档难度**: 简单/中等/困难
- 👆 **点击填写**: 点击空格选择数字
- 🖱️ **拖拽填写**: 从数字面板拖拽数字到格子
- ✅ **答案验证**: 检查答案并标记错误
- 🎉 **完成庆祝**: 正确完成后显示鼓励动画
- 🖨️ **打印功能**: 打印当前棋盘或批量生成练习题
- 📱 **响应式设计**: 适配手机、平板和电脑
- 💾 **自动保存**: 刷新页面可恢复游戏进度

## 技术栈

- **框架**: Nuxt 3 + Vue 3 (Composition API)
- **样式**: TailwindCSS
- **语言**: TypeScript (strict mode)
- **测试**: Vitest (单元测试) + Playwright (E2E)

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行单元测试
npm test

# 运行 E2E 测试
npm run test:e2e

# 构建生产版本
npm run build
```

## 项目结构

```
sudoku-kids/
├── components/
│   ├── game/          # 游戏组件 (棋盘、单元格、数字面板)
│   ├── setup/         # 设置组件 (难度、大小选择)
│   └── ui/            # 通用 UI 组件
├── composables/       # 组合式函数 (状态管理、拖拽)
├── utils/             # 工具函数 (生成器、求解器、打印)
├── types/             # TypeScript 类型定义
├── tests/             # 测试文件
└── pages/             # 页面
```

## 规格文档

本项目使用 [Speckit](https://github.com/example/speckit) 进行需求管理：

- `specs/001-sudoku-game/spec.md` - 功能规格
- `specs/001-sudoku-game/plan.md` - 技术实现计划
- `specs/001-sudoku-game/tasks.md` - 任务分解
- `specs/001-sudoku-game/checklists/` - 质量检查清单

## License

MIT
