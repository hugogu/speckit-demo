# Research: 技术调研与决策

**Feature**: 小学生数独学习游戏  
**Date**: 2025-02-12  
**Phase**: 0 - 技术调研

---

## 1. 数独生成算法

### Decision
使用 **带挖空策略的回溯生成算法**

### Rationale
数独生成需要保证两点：
1. 生成的完整盘面是有效数独（满足行列宫约束）
2. 挖空后的谜题有且仅有唯一解

回溯算法流程：
1. 使用回溯法生成一个完整的有效数独解
2. 随机挖空指定数量的格子（根据难度：简单50%+、中等35-50%、困难35%-）
3. 使用解数独算法验证剩余谜题是否只有唯一解
4. 如果不是唯一解，重新挖空或调整挖空位置

### Alternatives Considered
- **模板库随机选择**: 需要大量预存模板，无法灵活调整难度和尺寸
- **基于舞蹈链（DLX）的精确覆盖**: 过于复杂，性能优势不明显
- **拉丁方阵转换**: 生成模式有限，容易产生相似盘面

### Implementation Notes
- 使用递归回溯 + 随机候选数字顺序，确保生成结果多样性
- 对于4x4和6x6小尺寸，生成算法更快速
- 挖空验证时使用改进的回溯法计数解的数量（>1则非唯一解）

---

## 2. 拖拽交互实现

### Decision
使用 **原生 HTML5 Drag and Drop API + Vue 事件封装**

### Rationale
项目需求要求同时支持点击和拖拽操作。HTML5 DnD API 是浏览器原生支持，无需引入额外库。

交互流程设计：
1. **点击模式**: 先点击数字栏选中数字（高亮），再点击目标格子填入
2. **拖拽模式**: 从数字栏拖拽数字到目标格子
3. **键盘模式**（桌面端）: 选中格子后直接按数字键填入

Vue 中通过 `draggable` 属性和事件处理（`@dragstart`, `@dragover`, `@drop`）实现。

### Alternatives Considered
- **第三方拖拽库（vue-draggable/next）**: 增加依赖，且主要面向列表排序场景
- **纯 Touch 事件模拟**: 需要自行处理触摸和鼠标事件差异，代码复杂
- **Pointer Events 统一处理**: 兼容性好但实现复杂，HTML5 DnD 已足够

### Implementation Notes
- 移动端需要额外处理 `touchstart/touchmove/touchend` 作为拖拽备选
- 拖拽过程中添加视觉反馈（半透明显示、光标变化）
- 错误动画使用 CSS transition + Vue transition 组件实现平滑跳回

---

## 3. 二维码生成方案

### Decision
使用 **qrcode 库（npm: qrcode）+ Canvas 渲染**

### Rationale
打印功能需要在每个数独盘面右下角生成二维码，扫码后跳转到答案页面。

方案设计：
1. 每个生成的数独分配唯一 ID（如 UUID 或时间戳+随机数）
2. 二维码内容：`${baseUrl}/answer/${gameId}`
3. 打印页面使用 Canvas 将二维码绘制到指定位置
4. 答案页面根据 ID 从 localStorage 或 URL 参数恢复答案显示

### Alternatives Considered
- **后端生成二维码 API**: 需要服务器，与纯前端架构不符
- **纯 CSS/ASCII 二维码**: 过于复杂，扫码识别率低
- **QRCode.js（无依赖库）**: 功能有限，不支持 Canvas 精细控制

### Implementation Notes
- qrcode 库支持 Node.js 和浏览器环境，支持 Canvas/SVG/图片输出
- 打印时使用高容错级别（H级别），确保打印模糊也能识别
- 二维码尺寸：至少 2cm x 2cm，确保手机容易扫描

---

## 4. 本地存储方案

### Decision
使用 **IndexedDB（via idb-keyval 库）**

### Rationale
需要存储游戏历史记录（最多50局），每局包含完整盘面数据，数据量较大。localStorage 有 5MB 限制且只支持字符串，IndexedDB 更适合结构化数据。

存储结构：
- Key: `game_history`
- Value: Array<GameSession>

### Alternatives Considered
- **localStorage + JSON**: 简单但容量受限，大数独盘面可能超限
- **localForage**: 不错的封装，但 idb-keyval 更轻量
- **纯 IndexedDB API**: API 过于底层，回调复杂

### Implementation Notes
- 使用 idb-keyval（1KB）轻量封装，支持 Promise
- 游戏历史超过50条时，自动删除最旧记录（FIFO）
- 导出功能直接读取 IndexedDB 生成 JSON 文件下载

---

## 5. 响应式设计断点

### Decision
使用 **TailwindCSS 默认断点 + 自定义移动端优先策略**

### Breakpoints
- `sm`: 640px+ (大屏手机/小平板)
- `md`: 768px+ (平板/小桌面)
- `lg`: 1024px+ (标准桌面)
- `xl`: 1280px+ (大屏桌面)

### Mobile-First Approach
基础样式针对 320px+ 小屏手机：
- 数独格子：最小 40px，确保触摸目标 >= 44px
- 数字栏：横向滚动或网格布局
- 计时器：顶部固定，字体放大

大屏适配：
- 桌面端：数字栏侧边固定，格子放大到 60px+
- 键盘快捷键提示显示

---

## Summary

| 技术领域 | 决策 | 依赖 |
|----------|------|------|
| 数独生成 | 回溯算法（自建） | 无 |
| 拖拽交互 | HTML5 DnD + Vue | 无 |
| 二维码 | qrcode 库 | qrcode |
| 本地存储 | IndexedDB | idb-keyval |
| 响应式 | TailwindCSS | tailwindcss |

所有技术决策均符合项目章程要求：跨设备自适应、即时反馈、多模态交互。
