# Feature Specification: Sudoku Kids Learning Game

**Feature Branch**: `005-sudoku-kids`
**Created**: 2026-02-12
**Status**: Draft
**Input**: User description: "这是一个给小学生学习和练习数独的在线游戏，需要能自定义难度级别和面板大小。能同时自适应PC Web端和手机移动端的使用。在操作上要既能点击又可以拖拽。提供打印功能在一张纸上打印多个随机生成的游戏以便线下练习使用。在选中数字后，要能自动判断对错，错的数字自动跳回，所有数字正确后显示胜利完成提示。每次游戏需要能记录下来，包括游戏排面和用时、填错次数等信息。游戏过程中也需要提供一个计数牌以便知道当前的用时情况。项目为前端项目，使用Vue和Nuxt。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start and Play Game (Priority: P1)

A student visits the website, selects difficulty level (easy/medium/hard) and board size (4×4, 6×6, 9×9), then starts a new game. The game displays a Sudoku board with pre-filled numbers according to the selected difficulty. The student can place numbers by clicking a cell then selecting a number, or by dragging a number from the number pad to a cell. When a number is placed, the system immediately validates it against the solution. If correct, the number stays and is visually confirmed. If incorrect, the number bounces back and is not committed. When all cells are correctly filled, a victory message displays showing completion time and error count.

**Why this priority**: This is the core gameplay loop and MVP. Without this, no value can be delivered to users.

**Independent Test**: Can be fully tested by starting a game, placing numbers (both correct and incorrect), and verifying validation behavior. Delivers the primary value of a playable Sudoku game.

**Acceptance Scenarios**:

1. **Given** a student on the home page, **When** they select "easy" difficulty and "4×4" size and click "Start Game", **Then** a new game board displays with approximately 50% cells pre-filled.
2. **Given** a game in progress, **When** a student clicks an empty cell and selects a number, **Then** the number is placed if correct, or bounces back if incorrect.
3. **Given** a game in progress, **When** a student drags a number from the pad to a cell, **Then** the number is placed if correct, or bounces back if incorrect.
4. **Given** a completed game board, **When** the last correct number is placed, **Then** a victory modal displays showing completion time and error count.

---

### User Story 2 - View Game History (Priority: P2)

A student wants to review their past games to track progress. They navigate to the history page which displays a list of completed games showing date, difficulty, board size, completion time, and error count. They can delete individual game records or export the entire history as a JSON file.

**Why this priority**: Enables progress tracking and motivation. Secondary to core gameplay but important for engagement.

**Independent Test**: Can be tested by completing games, then navigating to history page and verifying records appear correctly. Delivers value of progress tracking.

**Acceptance Scenarios**:

1. **Given** a student who has completed 3 games, **When** they navigate to the history page, **Then** all 3 games display with date, difficulty, size, time, and error count.
2. **Given** a student viewing their history, **When** they click the delete button on a game record, **Then** that record is removed from the list.
3. **Given** a student viewing their history, **When** they click "Export Records", **Then** a JSON file downloads containing all game data.

---

### User Story 3 - Print Games for Offline Practice (Priority: P2)

A teacher wants to print Sudoku puzzles for classroom use. They navigate to the print page, select the number of puzzles (1-6), difficulty level, and board size. The system generates the specified number of puzzles and displays them in a print-optimized layout with QR codes for answer verification. The teacher can then print the page.

**Why this priority**: Enables offline classroom use. Secondary to core gameplay but important for educational context.

**Independent Test**: Can be tested by generating print preview and verifying puzzles display correctly with QR codes. Delivers value of offline practice capability.

**Acceptance Scenarios**:

1. **Given** a teacher on the print page, **When** they select 4 puzzles, medium difficulty, and 6×6 size, then click "Generate", **Then** 4 puzzles display in a grid layout with QR codes.
2. **Given** a print preview with 4 puzzles, **When** the teacher clicks "Print", **Then** the browser's print dialog opens with the puzzles formatted for A4 paper.
3. **Given** a printed puzzle with QR code, **When** a student scans the QR code, **Then** they are directed to the answer page showing the correct solution.

---

### Edge Cases

- What happens when a student tries to place a number in a pre-filled (fixed) cell?
- How does the system handle a student refreshing the page mid-game?
- What happens when the browser's IndexedDB storage is full?
- How does the print layout handle 9×9 boards on mobile screens?
- What happens when a student tries to drag a number to an invalid cell (outside the board)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow students to select difficulty levels (easy, medium, hard) affecting the percentage of pre-filled cells.
- **FR-002**: System MUST allow students to select board sizes (4×4, 6×6, 9×9) with appropriate grid layouts.
- **FR-003**: System MUST support click-based number placement (select cell, then select number).
- **FR-004**: System MUST support drag-and-drop number placement (drag number from pad to cell).
- **FR-005**: System MUST validate number placement immediately against the solution.
- **FR-006**: System MUST reject incorrect numbers with visual feedback (bounce animation) and NOT commit to game state.
- **FR-007**: System MUST confirm correct numbers with visual feedback and commit to game state.
- **FR-008**: System MUST display a victory message when all cells are correctly filled, showing completion time and error count.
- **FR-009**: System MUST display a timer during gameplay showing elapsed time.
- **FR-010**: System MUST store game sessions locally (IndexedDB) with board state, start time, end time, elapsed time, error count, difficulty, and board size.
- **FR-011**: System MUST retain maximum 50 game sessions in history.
- **FR-012**: System MUST allow viewing game history with date, difficulty, size, time, and error count.
- **FR-013**: System MUST allow deleting individual game records.
- **FR-014**: System MUST allow exporting game history as JSON.
- **FR-015**: System MUST allow generating multiple puzzles (1-6) for printing.
- **FR-016**: System MUST display puzzles in print-optimized layout with QR codes for answer verification.
- **FR-017**: System MUST be responsive and work on desktop (1024px+) and mobile (375px+).
- **FR-018**: System MUST use minimum touch targets of 44x44px for mobile and 40x40px for desktop.

### Key Entities

- **Game Session**: Represents a single game instance with attributes: unique ID, start time, end time, elapsed time, error count, difficulty level, board size, initial board state, solution, user inputs
- **User Input**: Represents a single number placement attempt with attributes: unique ID, session ID, timestamp, row, column, value, input type (click/drag), isCorrect
- **Print Job**: Represents a print generation request with attributes: unique ID, count, difficulty, board size, page size, generated puzzles list, creation timestamp
- **Printable Game**: Represents a single puzzle for printing with attributes: unique ID, sequence number, board state, solution, QR code data URL

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can start a new game within 10 seconds from page load.
- **SC-002**: Number placement validation occurs within 100 milliseconds.
- **SC-003**: 95% of students can complete an easy 4×4 puzzle on first attempt within 5 minutes.
- **SC-004**: Game history loads within 2 seconds with up to 50 records.
- **SC-005**: Print preview generates 6 puzzles within 5 seconds.
- **SC-006**: Application loads within 3 seconds on 3G mobile connection.
- **SC-007**: Touch targets meet minimum size requirements (44x44px mobile, 40x40px desktop) for all interactive elements.
- **SC-008**: Students can successfully place numbers using both click and drag methods.
- **SC-009**: Incorrect numbers are rejected with visual feedback within 150 milliseconds.
- **SC-010**: QR codes are scannable and direct to correct answer page.

### Assumptions

- Students have basic computer/tablet skills and understand Sudoku rules.
- Browser supports IndexedDB for local storage.
- Print functionality uses browser's native print dialog.
- QR code scanning requires a separate app on mobile devices.
- Game difficulty levels map to pre-filled cell percentages: easy (50%+), medium (35-50%), hard (<35%).
