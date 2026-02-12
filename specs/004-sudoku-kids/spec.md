# Feature Specification: 小学生数独学习游戏

**Feature Branch**: `004-sudoku-kids`  
**Created**: 2025-02-12  
**Status**: Draft  
**Input**: User description: "这是一个给小学生学习和练习数独的在线游戏，需要能自定义难度级别和面板大小。能同时自适应PC Web端和手机移动端的使用。在操作上要既能点击又可以拖拽。提供打印功能在一张纸上打印多个随机生成的游戏以便线下练习使用。在选中数字后，要能自动判断对错，错的数字自动跳回，所有数字正确后显示胜利完成提示。每次游戏需要能记录下来，包括游戏排面和用时、填错次数等信息。游戏过程中也需要提供一个计数牌以便知道当前的用时情况。"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - 开始一局新游戏 (Priority: P1)

小学生打开游戏后，选择喜欢的难度和面板大小，然后开始一局新的数独游戏。游戏界面清晰易懂，数字够大，操作简单。

**Why this priority**: 这是游戏的核心入口功能，没有它用户无法进行任何游戏。必须提供直观的难度选择和清晰的界面，适合儿童操作。

**Independent Test**: 可以从游戏主页选择难度（简单/中等/困难）和面板大小（4x4/6x6/9x9），点击开始后成功加载可玩的数独盘面。

**Acceptance Scenarios**:

1. **Given** 用户在主页面，**When** 选择难度为"简单"和面板"4x4"后点击开始，**Then** 显示一个4x4的数独游戏，已预填部分数字，游戏计时器开始计时

2. **Given** 用户在不同设备上访问，**When** 在手机或平板上打开游戏，**Then** 界面元素自动调整大小，按钮易于点击，无需缩放即可操作

3. **Given** 用户已选择设置，**When** 点击开始游戏，**Then** 数独盘面在2秒内加载完成，且保证有且仅有唯一解

---

### User Story 2 - 填写数字并接收即时反馈 (Priority: P1)

小学生在游戏中通过点击或拖拽方式填入数字，系统立即判断对错。填对了数字保留在格子里，填错了数字自动跳回原位，并记录错误次数。

**Why this priority**: 即时反馈是教育游戏的核心价值，帮助儿童立即纠正错误，加深学习印象。自动跳回机制避免挫败感。

**Independent Test**: 可以在任意空格填入数字，正确则保留，错误则动画跳回，同时错误计数器+1，无需刷新页面即可连续操作。

**Acceptance Scenarios**:

1. **Given** 游戏进行中，某个空格正确答案是"3"，**When** 用户填入数字"3"，**Then** 数字保留在格子中，格子显示绿色确认效果，无任何跳动动画

2. **Given** 游戏进行中，某个空格正确答案是"3"，**When** 用户填入数字"5"，**Then** 数字"5"短暂显示后平滑动画跳回原位，错误计数器从0变为1

3. **Given** 用户想使用拖拽操作，**When** 从数字栏拖拽"4"到目标空格，**Then** "4"被填入该格，如果正确则保留，错误则跳回并计数

4. **Given** 用户在电脑端游玩，**When** 使用键盘直接输入数字，**Then** 当前选中格子填入对应数字，触发相同的正误判断逻辑

---

### User Story 3 - 完成游戏并查看胜利提示 (Priority: P1)

当所有空格都填入正确数字后，游戏立即显示胜利完成提示，展示本次游戏的成绩（用时、错误次数），并保存游戏记录。

**Why this priority**: 完成反馈对儿童学习动力至关重要，及时的成绩展示和记录保存帮助建立成就感和进步追踪。

**Independent Test**: 可以完整填入一个数独游戏的所有空格，全部正确后立即看到胜利动画和成绩统计，游戏记录出现在历史列表中。

**Acceptance Scenarios**:

1. **Given** 只剩最后一个空格未填，**When** 填入正确数字完成整个盘面，**Then** 1秒内显示胜利弹窗/页面，包含用时"05:32"和错误次数"3次"

2. **Given** 胜利提示显示中，**When** 用户点击"再玩一局"，**Then** 返回主页面或直接进入新游戏（根据设计），计时器和错误计数器重置

3. **Given** 游戏刚完成，**When** 用户查看游戏历史，**Then** 最新一局游戏记录显示在最上方，包含日期时间、难度、面板大小、用时、错误次数

---

### User Story 4 - 打印游戏用于线下练习 (Priority: P2)

家长或老师可以打印多个随机生成的数独游戏在一张纸上，方便孩子在没有电子设备时练习。

**Why this priority**: 线下练习是线上学习的重要补充，打印功能扩展了游戏的使用场景，也减少了屏幕使用时间。

**Independent Test**: 可以从打印页面选择生成4个中等难度的9x9数独，点击打印后单页A4纸上整齐排列4个游戏盘面，包含编号和空白填空格。

**Acceptance Scenarios**:

1. **Given** 用户在打印页面，**When** 选择生成数量"4个"、难度"中等"、面板"9x9"后点击生成，**Then** 预览区域显示4个排版整齐的数独盘面

2. **Given** 打印预览已生成，**When** 用户点击打印按钮，**Then** 调用系统打印对话框，输出结果中每个数独有足够大的填空格，整体排版适配A4纸

3. **Given** 打印的纸质游戏，**When** 孩子完成后用手机扫描纸上的二维码，**Then** 网页显示该数独的完整答案，包含每个空格的正确数字

### User Story 5 - 查看游戏计时和进度 (Priority: P2)

游戏过程中始终显示计时牌，让孩子知道已用时多久。家长可以设置时间挑战，增加趣味性。

**Why this priority**: 计时功能增加游戏趣味性，培养时间意识，但相比核心游戏功能优先级略低。

**Independent Test**: 游戏进行中屏幕某处始终显示格式为"MM:SS"的计时器，每秒更新，游戏暂停/完成时停止计时。

**Acceptance Scenarios**:

1. **Given** 游戏刚开始，**When** 计时器显示"00:00"，**Then** 1秒后变为"00:01"，持续递增

2. **Given** 游戏进行中已用时5分钟，**When** 用户暂时切换应用或标签页，**Then** 计时器可选择暂停或继续（根据设计决策），返回游戏时状态正确

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: 系统 MUST 支持三种难度级别：简单（预填50%以上）、中等（预填35-50%）、困难（预填35%以下）
- **FR-002**: 系统 MUST 支持三种面板大小：4x4（2x2宫格）、6x6（2x3宫格）、9x9（3x3宫格）
- **FR-003**: 系统 MUST 使用有效算法生成有唯一解的数独谜题
- **FR-004**: 系统 MUST 提供点击选择数字后点击格子填入的操作方式
- **FR-005**: 系统 MUST 提供从数字栏拖拽数字到目标格子的操作方式
- **FR-006**: 系统 MUST 在PC端支持键盘数字键直接填入当前选中格子
- **FR-007**: 系统 MUST 在用户填入数字后500毫秒内判断正误
- **FR-008**: 系统 MUST 在填入错误数字时播放平滑动画将数字跳回原位
- **FR-009**: 系统 MUST 实时统计并显示错误次数，错误+1时给予视觉反馈
- **FR-010**: 系统 MUST 在所有格子正确填满后立即显示胜利提示界面
- **FR-011**: 系统 MUST 提供实时计时器，格式为MM:SS，从游戏开始持续递增
- **FR-012**: 系统 MUST 每次游戏结束后保存：游戏日期时间、难度、面板大小、用时、错误次数、完整排面数据
- **FR-013**: 系统 MUST 提供游戏历史记录列表，按时间倒序排列
- **FR-014**: 系统 MUST 支持打印功能，允许选择生成1-6个随机数独游戏在单页纸上
- **FR-015**: 系统 MUST 打印排版适配A4纸，每个游戏盘面包含足够大的填空格
- **FR-016**: 系统 MUST 在每个打印的数独盘面右下角生成唯一二维码，扫码可查看答案
- **FR-017**: 界面 MUST 在320px-1920px宽度范围内自适应显示，所有交互元素最小44x44px
- **FR-018**: 系统 MUST 在无网络连接时支持已加载游戏的基本离线游玩（除打印和扫码外）

### Key Entities *(include if feature involves data)*

- **GameSession（游戏会话）**: 代表一次完整的数独游戏，包含唯一ID、开始时间、结束时间、难度级别、面板大小、完整初始盘面、用户填入记录、错误次数、最终完成状态
- **SudokuBoard（数独盘面）**: 代表数独游戏的数据结构，包含尺寸（4/6/9）、宫格划分规则、初始预填数字矩阵、完整答案矩阵、当前用户填入状态矩阵
- **GameHistory（游戏历史）**: 存储在本地设备的过往游戏记录集合，支持按日期范围、难度、面板大小筛选查询，支持导出为JSON/CSV
- **PrintJob（打印任务）**: 代表一次打印请求的配置，包含生成数量、难度、面板大小、页面尺寸（A4/Letter）、每个游戏的唯一ID用于生成答案二维码
- **UserInput（用户输入）**: 代表一次具体的填入操作，包含操作类型（点击/拖拽/键盘）、目标格子坐标、填入数字、填入时间戳、判断结果（正确/错误）

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 小学二年级学生（7-8岁）在没有成人指导的情况下，能在3分钟内独立开始一局新游戏
- **SC-002**: 游戏界面在手机和桌面端的可用性评分均达到90%以上（通过用户测试）
- **SC-003**: 填入数字后反馈延迟不超过500毫秒（技术测量）
- **SC-004**: 错误数字跳回动画在800毫秒内完成，视觉上流畅自然
- **SC-005**: 生成的数独谜题100%保证有唯一解（算法验证）
- **SC-006**: 打印功能生成的单页游戏，所有填空格尺寸不小于15x15mm，适合铅笔填写
- **SC-007**: 游戏历史记录本地存储至少保存最近50局游戏完整数据
- **SC-008**: 在无网络环境下，已加载游戏的核心功能（填入、判断、计时）100%可用
- **SC-009**: 完成一局9x9中等难度数独的平均用时在10-20分钟范围内（适合儿童注意力跨度）
- **SC-010**: 首次使用的儿童用户在填入操作上的成功率达到95%以上（不因误操作导致困惑）

---

**Assumptions & Dependencies**:

- 假设目标用户为6-12岁小学生，具备基本数字认知和触屏设备操作能力
- 依赖浏览器 localStorage API 进行游戏历史本地存储
- 打印功能依赖浏览器原生打印支持和用户设备连接打印机

## Clarifications

### Session 2025-02-12

- **Q**: 是否需要用户账户系统来支持多设备同步游戏历史？还是仅本地存储？ → **A**: 仅本地存储（使用 localStorage/IndexedDB），无需账户系统，简化隐私合规
- **Q**: 打印功能是否需要附带答案页？还是以其他方式提供答案查询？ → **A**: 每张打印纸右下角印二维码，扫码后在网页显示对应答案
