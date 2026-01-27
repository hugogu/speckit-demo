# 数独学习游戏 (Sudoku Learning Game)

一个面向初学者的数独学习游戏，支持多种棋盘大小和难度级别。

## 功能特性

- 🎮 **多种棋盘大小**: 4×4、6×6、9×9
- 🎯 **四种难度级别**: 简单、中等、困难、专家
- 🖱️ **拖拽交互**: 支持点击和拖拽两种填数方式
- 📊 **游戏记录**: 自动保存游戏历史和统计
- 🖨️ **打印功能**: 生成练习题打印到纸上
- ⚙️ **个性化设置**: 自定义默认棋盘和难度
- 📱 **响应式设计**: 支持桌面和移动设备
- 🐳 **Docker 部署**: 一键容器化部署

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker 部署

### 构建镜像

```bash
# 使用构建脚本
./scripts/docker-build.sh

# 或手动构建
docker build -t sudoku-game .
```

### 运行容器

```bash
docker run -d -p 8080:80 --name sudoku sudoku-game
```

然后访问 http://localhost:8080

### 使用 Docker Compose

```yaml
version: '3.8'
services:
  sudoku:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

## 技术栈

- **框架**: Nuxt 3 + Vue 3
- **语言**: TypeScript
- **状态管理**: Pinia
- **样式**: Tailwind CSS 4
- **构建**: Vite
- **部署**: Docker + Nginx

## 项目结构

```
app/
├── components/     # Vue 组件
│   ├── game/       # 游戏相关组件
│   ├── history/    # 历史记录组件
│   ├── print/      # 打印相关组件
│   └── ui/         # 通用 UI 组件
├── composables/    # Vue 组合式函数
├── pages/          # 页面路由
├── stores/         # Pinia 状态管理
├── types/          # TypeScript 类型定义
└── utils/          # 工具函数
```

## License

MIT
