## Initial State

### Project Base
- uds_learning_tool.html: ~1328 lines, 6 tabs, 26 SERVICES, 37 NRCS, 4 SESSIONS, 26 QUIZ
- uds_simulator.html: ~1643 lines, ECU state machine, 24+ service handlers, 16 DID, 13 scenarios

### Previous Plan (uds-docs-audit-plan) Completed
- README.md updated with feature guide (~229 lines)
- docs/AI-HANDOVER.md created (121 lines, 9 chapters)
- Code review completed: 2 BUG, 5 WARNING, 4 INFO findings
- No HTML source files were modified during audit

### Roadmap Structure
- 20 tasks across 6 Waves + Final Wave
- Estimated 200-400 hours total
- Wave 1 is Foundation (4 parallel tasks)
## Wave 1 Task 1 �� DID �༭��

- Added DEFAULT_DIDS constant (deep-cloned from ECU.dids) right after the ECU object for reset functionality
- Implemented openDIDEditor(), closeDIDEditor(), enderDIDEditor(), saveDIDChanges(), esetDIDs() functions
- Modal overlay supports close via ESC key (keydown listener) and click-outside (overlay click handler with event.stopPropagation() on the modal itself)
- HEX input validation: accepts space-separated bytes (/^[0-9a-fA-F]{2}$/), shows toast error on invalid format
- Modal CSS uses existing CSS variables (--card, --border, --card2, --text, --text2, --text3, --primary, --font-mono, --primary-glow) matching the dark theme
- did-edit-row layout: key (mono) | label | input �� with bottom border separator
- The DID editor button appears after the DID status grid, full-width, matching existing .btn-sm style
- All 16 DIDs (F190-F19C, F300-F302) from ECU.didLabels are rendered in the editor
- ECU.dids keys in the didLabels object are the canonical source �� editor iterates over Object.keys(ECU.didLabels)
- esetECU() does NOT touch DIDs (pre-existing behavior preserved); only esetDIDs() in the editor resets them


## Wave 1, Task 2 �� DTC Injector Panel

### Implementation Summary
- Added DTC injector button in ECU panel between scenarios section and DID section
- Added toggle-switch CSS (styled checkbox), DTC table grid, severity/status badges
- Added DTC injector modal following same pattern as DID editor modal
- Implemented: openDTCInjector(), closeDTCInjector(), renderDTCInjector(), toggleDTC(), injectRandomDTC(), clearAllDTCs()

### Key Details
- DTC display: 3-byte hex (high middle low) + P-code string ID
- Status: 0x80 = active (confirmed+active), 0x00 = inactive (no fault)
- Toggle: switches between 0x80 and 0x00
- injectRandomDTC: random DTC index, random status from [0x20, 0x40, 0x80]
- clearAllDTCs: sets all status to 0x00, calls updateECUStatus()
- Existing DTC structure: { id, high, middle, low, status, severity } �� high/middle/low = 3-byte DTC identifier
- Severity mapping: 0x00=none, 0x10=pass, 0x20=minor, 0x30=moderate, 0x40=severe, 0x50=major
- Follows existing modal pattern (Escape key, overlay click to close)
- Severity/status badges color-coded (red for active, gray for inactive, etc.)
- Preserved all existing 13 scenarios (#6 ReadDTCStatus, #10 ClearDTC still work)

## Wave 1, Task 3 - ISO-TP Transport Layer Simulation

### Implementation Summary
- Added ISO-TP transport layer simulation panel to uds_simulator.html
- Panel is collapsible, located in the composer (right panel) below the RAW HEX send
- Implements ISO 15765-2 single-frame and multi-frame segmentation

### Key Design Decisions
- Used `addLogEntry` with pre-formatted string `[ISO-TP] SF/FF/CF/FC [...]` as bytes parameter (passing string instead of array triggers raw string display mode)
- SF/FF/CF frames logged as 'req' type (tester->ECU), FC logged as 'res' type (ECU->tester)
- Multi-frame flow: FF -> 150ms delay -> FC -> 60ms delay -> CF#1 -> 10ms -> CF#2 -> ... -> completion -> doSend(fullData)
- Frame list in panel uses CSS classes `isotp-active` (current sending frame highlighted in blue) and `isotp-sent` (dimmed after sent)
- Frame list auto-scrolls to keep active frame in view during transmission
- The "clear" button resets ISO_TP state via `clearISOTP()` function

### ISO-TP Segmentation Rules Implemented
- SF: 1-byte PCI (length 0x00-0x07) + up to 7 data bytes per CAN frame
- FF: 2-byte PCI (0x10|lenHi + lenLo) + 6 data bytes
- CF: 1-byte PCI (0x20|SN, 4-bit, 1-based) + 7 data bytes (last frame may be shorter)
- FC: 3-byte PCI (0x30 + FS=0 + BS=0 + STmin=0)
- FF total length: 12-bit, max 4095 bytes

### Scenario #14 Added
- 30-byte UDS request (RequestDownload payload + filler)
- Segments into 1 FF + 4 CFs (6+7+7+7+3 bytes)
- After transmission, reassembled data passed to processRequest via doSend

### Gotchas
- Inline onclick handlers in HTML need careful escaping when setting innerHTML with class names - better to extract into a separate function
- `doSend` is a function declaration (hoisted) so can be called from code that appears before it in source order
- `segmentISOTPData()` accepts space-separated hex string and returns array of frame objects with type/sn/dataHex/payloadLen

## Wave 1, Task 4 - Flash Programming Flow

### Implementation Summary
- Added collapsible "📥 刷写流程演示" panel below ISO-TP section in the composer panel
- Implemented 7-step flash programming flow: 10→27→31→34→36×8→37→11 01
- Added `ECU.flashState` object with running/step/appValid/bootActive tracking
- Flash panel shows step progress (○ pending / ▶ active / ✓ done), progress bar
- Auto-execution via async/await with 800-1000ms delays between steps
- Step 6 (TransferData) sends 8 blocks × 4 bytes with 400ms intervals

### Key Design Decisions
- Used `async/await` with `sleep(ms)` and `waitSend(bytes, delay)` for the sequential flow
- `runFlashAuto()` checks `ECU.flashState.running` between every step to support cancellation
- `updateFlashUI()` updates both the flash panel (7 steps + progress bar) and ECU status panel (appValid/bootActive)
- Step 6 has an additional detail span (`flash-step-6-detail`) showing "传输数据块 X/8"
- Scenario #15 opens the flash panel and starts programming after 300ms
- Flash state display added to ECU status panel (应用有效 / Bootloader 状态)

### Flash Flow Steps
```
Step 1: 10 02 → Programming Session (200ms delay)
Step 2: 27 01 → Request Seed (800ms delay)
Step 3: 27 02 12 34 56 78 → Send Key (800ms delay)
Step 4: 31 01 FF 00 → Erase Memory (1000ms delay)
Step 5: 34 00 44 00 00 20 00 00 → RequestDownload (800ms delay)
Step 6: 36 01-08 → TransferData × 8 blocks (400ms each = 2400ms total)
Step 7: 37 → RequestTransferExit (800ms delay)
Final: 11 01 → ECU auto-reset to switch to new application
```

### CSS Classes
- `.flash-section`, `.flash-header`, `.flash-body` — collapsible panel (same pattern as ISO-TP)
- `.flash-step-item`, `.flash-done`, `.flash-active`, `.flash-pending` — step states
- `.flash-progress-bar`, `.flash-progress-fill` — animated progress bar
- `.flash-btn-start`, `.flash-btn-stop` — start/stop buttons with disabled state

### Gotchas
- The `edit` tool's oldString matching is whitespace-sensitive; multi-line replacements with indentation need exact match of the surrounding context including blank lines and indentation
- `waitSend()` is a function declaration in the SCENARIOS section but is called from `runFlashAuto()` which appears before it in source — this works because `function` declarations are hoisted to the top of the scope
- Emojis in console output show as garbage (terminal encoding), but render correctly in the browser

## 2026-05-19: History Save/Load Feature (Wave 2, Task 6)

### Implementation Summary
Added diagnostic request history save/load functionality to uds_simulator.html:

1. **Data Layer**: `logEntries[]` array to track all log entries for persistence; `HISTORY_KEY` for localStorage; 30-second throttle on auto-saves

2. **Key Functions Added**:
   - `saveHistory()` — saves current log to localStorage (max 20 entries, throttled)
   - `loadHistory(id)` — loads a specific history back into the log display
   - `renderLogEntries()` — re-renders log from array (used when loading history)
   - `renderHistoryList()` — renders history list in the panel
   - `exportHistory()` — downloads all history as .txt file
   - `clearAllHistory()` — clears all stored history
   - `openHistoryPanel()` / `closeHistoryPanel()` — modal panel control

3. **UI**: "📋 历史记录" button in log header; modal panel listing records with timestamp/summary; per-record "加载"/"🗑️" buttons; "导出全部为文本"/"清除全部" action buttons

4. **Integration Points**:
   - Modified `addLogEntry()` to push to `logEntries[]`
   - Modified `clearLog()` to reset `logEntries[]`
   - Added `saveHistory()` call in `doSend()` after response processing

### Patterns Used
- Modal overlay pattern consistent with existing DID Editor / DTC Injector
- localStorage for persistence (same as theme toggle)
- CSS variables for dark/light theme compatibility (no additional theme work needed)

### Potential Issues
- `exportHistory()` uses `Blob` + `URL.createObjectURL` — works in all modern browsers
- Max 20 history entries, each ~5-20KB — well within 5MB localStorage limit
- Auto-save throttles to once every 30 seconds to avoid excessive writes

## 2026-05-19: Wave 2 Task 5 — Session-Service Matrix Heatmap
- Added 7th tab "矩阵图" (matrix heatmap) using `data-tab="matrix"` pattern
- Columns: 服务(SID) | 名称 | Default | Programming | Extended | SafetySystem | 说明
- Color mapping: green(#4CAF50)=supported, yellow(#FFC107)=needs security unlock, red(#F44336)=not supported, gray(#9E9E9E)=N/A
- Security-locked services defined in SECURITY_LOCKED_SERVICES Set: 27,2E,2F,34,35,36,37,38,3D,84,85
- Dark theme support via `.dark .cell-*` overrides
- Search by service name/SID, filter by functional unit
- Hover tooltips show session+status via CSS `attr(data-tip)` with `white-space: pre-wrap`
- Click opens detail modal with per-session availability table and NRC hints
- Data derived from existing SESSIONS array (avail lists) + SECURITY_LOCKED_SERVICES set
- Matrix uses the same detail modal (`#detail-modal`) as service cards
- Added `matrix-wrapper` for horizontal scroll on narrow screens
- Sticky table headers with `position: sticky; top: 0`
- Count badge tracks visible/filtered services

## 2026-05-19: Wave 3 Task 9 — 错误注入教学 (Error Injection Teaching)

### Implementation Summary
Added "🎯 错误注入教学" collapsible panel below the Flash刷写 panel in the composer:

1. **ERROR_SCENARIOS Data** (10 scenarios):
   - err-1: 10 02 → NRC 0x22 (conditionsNotCorrect) — Programming session from locked state
   - err-2: 2E → NRC 0x33 (securityAccessDenied) — Write DID without unlock
   - err-3: 19 04 → NRC 0x12 (subFunctionNotSupported) — Invalid subfunction
   - err-4: 22 00 00 → NRC 0x31 (requestOutOfRange) — Non-existent DID
   - err-5: 36 01 → NRC 0x24 (requestSequenceError) — TransferData without RequestDownload
   - err-6: 11 03 → NRC 0x12 (subFunctionNotSupported) — Invalid ECUReset type
   - err-7: 27 05 → NRC 0x12 (subFunctionNotSupported) — Invalid SecurityAccess level
   - err-8: 36 → NRC 0x13 (IMLOIF) — Empty TransferData
   - err-9: 85 01 → NRC 0x22 (conditionsNotCorrect) — DTCSetting in Default session
   - err-10: 31 01 FF FF → NRC 0x31 (requestOutOfRange) — Non-existent routine

2. **Key Functions Added**:
   - `toggleErrorPanel()` — collapse/expand (same pattern as ISO-TP and Flash)
   - `renderErrorScenarios()` — creates error-item cards with red left border, sid/desc/NRC/button
   - `runErrorScenario(id)` — single scenario: optional setup → wait → send error → log explanation
   - `runErrorScenarioSequential(scenario)` — async version for auto-demo
   - `runAllErrors()` — async iteration through all 10 scenarios with stop support
   - `stopErrorDemo()` — sets ECU.errorDemoRunning = false
   - `updateErrorUI()` — disables buttons while demo runs

3. **Panel HTML**: Inserted after flash-section div, before composer-body close
   - Header: "🎯 错误注入教学" with subtitle "10 种典型 NRC 场景"
   - Auto-demo and Stop buttons row
   - error-list div populated by renderErrorScenarios()

4. **CSS**: `.error-section/header/body/toggle` (same pattern as flash), `.error-item` with red left border (#F44336), error-specific styling for sid/desc/nrc elements

### Key Design Decisions
- Uses `ECU.errorDemoRunning` flag (added to ECU object) for demo state management
- `doSend()` handles all actual UDS sending (with P2 delay); no direct processRequest calls
- Explanation logged as `addLogEntry([], '💡 ...', 'res')` after 300ms to appear after NRC response
- Auto-demo uses async/await with sleep() between steps for sequential execution
- Individual scenario execution uses callback-based setTimeout for non-blocking UI
- CSS variables auto-support dark/light theme — no additional theme work needed

### Integration Points
- Panel follows same collapsible pattern as isotp-section and flash-section
- Uses existing `doSend()`, `addLogEntry()`, `sleep()` functions
- No modifications to processRequest, negResp, SESSION_RULES, or ECU defaults
- Existing scenarios (1-15) preserved and unaffected

### Gotchas
- The `edit` tool's oldString matching is very whitespace-sensitive in HTML; used larger unique context anchors to avoid match failures
- `async function` declarations work with existing browser-API-based `sleep()` promise
- `runAllErrors()` iterates with `.length` check on `ECU.errorDemoRunning` between each step for clean cancellation support

## 2026-05-19: Wave 3 Task 7 — 协议动画 (Protocol Animation Tab)

### Implementation Summary
Added 9th tab "协议动画" to uds_learning_tool.html with interactive byte-by-byte protocol player:

1. **5 Animation Scenes** (`ANIM_SCENES` array):
   - scene-1: 📖 读取 VIN 码 (3 steps: req→process→res)
   - scene-2: 🔐 SecurityAccess 解锁 (9 steps: full seed-key flow)
   - scene-3: 📥 刷写流程简化 (12 steps: session→download→transfer→exit)
   - scene-4: 🚫 错误场景 NRC 0x33 (6 steps: session→write→NRC)
   - scene-5: 🔗 ISO-TP 多帧示意 (8 steps: FF→FC→CF×2→response)

2. **Animation Controls**:
   - ▶ 播放 / ⏸ 暂停 / ⏭ 步进 / ⟳ 重置 buttons
   - Speed selector (0.25x, 0.5x, 1x, 2x, 4x)
   - Scene dropdown menu
   - Progress bar with step counter

3. **Visual Design**:
   - Vertical flow with ⬇ arrows between steps
   - Completed steps: green border, dimmed opacity
   - Current step: blue border, pulsing glow animation
   - Future steps: very dim
   - Step type badges: blue=请求, green=响应, red=负响应, yellow=处理中
   - Byte coloring matching decoder: sid-b (blue), subfunc-b (yellow), did-b (orange), data-b (green), neg-b (red), nrc-b (purple), pci-b (indigo for ISO-TP)
   - Completion state shows ✅ message and disables play button

4. **Key Functions**:
   - `renderAnimScene()`: renders all steps as vertical flow with status
   - `advanceAnim()`: chain via setTimeout with per-step delay
   - `playAnim()` / `pauseAnim()` / `stepAnim()` / `resetAnim()`
   - `selectAnimScene()`: change scene, reset state
   - `updateAnimSpeed()`: update speed multiplier
   - `getAnimByteClass()`: color mapping for each byte based on type/position
   - `getAnimByteLabel()`: byte label (SID, 子功能, DID-H, etc.)
   - `initAnimation()`: populate scene dropdown, select first scene

5. **CSS Classes Added**:
   - `.pci-b` / `.dark .pci-b` — ISO-TP PCI byte color
   - `.anim-container`, `.anim-control-row`, `.anim-btn`, `.anim-btn.primary`
   - `.anim-flow`, `.anim-step`, `.anim-step.completed`, `.anim-step.current`
   - `.anim-step .step-type` variants (req/res/neg/proc) with dark support
   - `.anim-byte-row`, `.anim-byte`, `.anim-arrow`, `.anim-status`
   - `.anim-progress-bar`, `.anim-progress-fill`, `.anim-speed-select`
   - `@keyframes animPulse` — 2s pulse glow animation for current step

### Key Patterns Used
- Tab pattern: nav button `data-tab="animation"` → `#tab-animation` content div
- Byte classes reuse existing `.sid-b`, `.subfunc-b`, `.did-b`, `.data-b`, `.neg-b`, `.nrc-b`
- New `.pci-b` class for ISO-TP PCI bytes (light indigo)
- State management via `animState` object (same pattern as quizState)
- All functions are global scope (called from onclick HTML attributes)
- Same timing architecture as existing async wait patterns

### Gotchas
- `setTimeout` chain is used instead of `setInterval` because each step has a different delay
- The `stepAnim()` function must render scene twice — once before advancing state, once after — to correctly show the step transition
- Scene 5 (ISO-TP) has response SID 0x74 (0x34+0x40) which is the response to RequestDownload — even though the step shows ISO-TP frames, the final response is a UDS response
- `getAnimByteClass()` for PCI bytes uses `idx === 0` check to avoid false color matching on data bytes that happen to have the same values

## 2026-05-19: Wave 3 Task 10 — 时间线图表 (Timeline Chart)

### Implementation Summary
Added timeline chart feature to uds_simulator.html that visualizes request-response timing as horizontal bars.

### Key Design Decisions
1. **Reuses `#log-container`**: Timeline content replaces log entries in the same container. Toggle switches between `renderLogEntries()` and `renderTimeline()` calls.
2. **Pair matching**: `matchReqResPairs()` filters to byte-bearing req/res/neg entries only, avoiding false pairing with informational messages (ISO-TP, flash steps, etc.).
3. **Proportional bar widths**: Bar width = (pair duration / max duration) × 85%, minimum 15% for visibility.
4. **Session tracking**: `addLogEntry()` now stores `session: ECU.sessionName` in the logEntries array. Used to display session tags (DEF/EXT/PROG/SAFE) on request bars.
5. **Timeline auto-refresh**: Uses microtask debounce (`Promise.resolve().then()`) to batch-render timeline after rapid req+res pairs without flickering.
6. **Stats bar**: Shows total requests, positive/negative count, avg RTT, pending count.

### CSS Architecture
- `.timeline-container` — scrollable wrapper inside `#log-container`
- `.timeline-pair` — card per req-res pair (8px radius, border)
- `.timeline-bar-row` — single bar row (24px height, relative positioning)
- `.timeline-bar-fill` — colored bar (absolute, left:160px, width as %)
- `.timeline-bar-label` — hex label (absolute, left:0, 155px wide)
- `.session-tag` — small colored tag showing session/status
- `.timeline-stats` — stats footer with flex layout
- `.btn-timeline.active` — highlighted button when timeline active

### Functions Added
- `toggleTimeline()` — switch between log/timeline views, toggle button active state
- `matchReqResPairs(entries)` — sequential req→res/neg pairing, only byte-bearing entries
- `getSessionTag(type, entry)` — extract session tag (DEF/EXT/PROG/SAFE/OK/NRC)
- `getSessionClass(tag)` — map tag to CSS class
- `renderTimeline()` — build full timeline chart from logEntries

### Modified Functions
- `addLogEntry()` — added `session` field to logEntries push; debounced timeline auto-refresh
- `clearLog()` — resets `_showTimeline = false` and removes button active state

### Edge Cases Handled
- Empty log: shows "暂无数据" placeholder
- No pairs (only system messages): shows "暂无完整的请求-响应对"
- Pending requests (no response yet): shows ⏳ waiting indicator with 15% yellow bar
- History loaded: `clearLog()` switches back to log view, session data may be undefined (falls back to DEF tag)
- Long hex strings: truncated to 14 chars + "…"
- Zero-duration entries: shows "—" instead of "0ms"
- ISO-TP/Flash/Error demo entries: filtered out by `matchReqResPairs` (empty hexStr) or not a main req/res type

### Integration Points
- Button placed in log-header next to "📋 历史记录" button
- Uses existing CSS variables for theming (--req-color, --res-color, --neg-color, --card, --border, etc.)
- Session colors match the spec: Extended=blue(--primary), Programming=orange(--warning), SafetySystem=purple(#a78bfa), Default=gray(--text2)

### Gotchas
- Biome lint complains about `useSimpleNumberKeys` (hex obj keys) everywhere — pre-existing, not from this change
- Biome lint `useButtonType` is also pre-existing (all buttons lack type=button)
- The bar-fill CSS uses `position: absolute` with `left: 160px` to leave room for the label — works because the timeline-container has implicit relative positioning
- `.bar-label` CSS selector was initially wrong (missing `.timeline-` prefix) — fixed during implementation

## 2026-05-19: Multi-ECU Implementation (Wave 4, Task 11)

### Approach
- Used wrapper pattern (NOT refactoring) to keep backward compatibility
- Added ECU_CONFIGS const with 3 ECU definitions, deep-copied on save/switch
- saveECUState() copies live ECU state �� ECU_CONFIGS[activeECU]
- switchECU(id) saves current �� restores selected from config
- All handlers continue to operate on ECU.* �� zero handler changes needed

### Key Decisions
- Reset runtime-only properties (securityTimers) on switch �� each ECU gets fresh attempt tracking
- Cancel pending S3 session timer on switch to avoid stale timeouts
- DEFAULT_DIDS captures ECU_A's original DIDs at init; per-ECU reset would need separate defaults

### ECU Configs
- ECU_A (ECM): 3 powertrain DTCs (P0101, P0113, P0300), full DID set matching original defaults
- ECU_B (TCM): 1 transmission DTC (P0700), TCM-specific DIDs (oil temp, input/output speed)
- ECU_C (ABM): 1 airbag DTC (B0010), ABM-specific DIDs (internal temp)
- All ECUs start in Default session, Locked security

### File
- uds_simulator.html: ~3300 lines, embedded HTML/CSS/JS
- Changes: +150 lines for ECU_CONFIGS + save/switch logic, ~15 lines HTML dropdown

## 2026-05-19: CAN ����ͨ����� (Wave 4, Task 12)

### Implementation Summary
Added "?? CAN ����ͨ��" collapsible panel below the error injection teaching panel in uds_simulator.html:

1. **CSS** (lines 385-418): .can-section/header/body/toggle follows the exact same collapsible pattern as .error-section, .isotp-section, .flash-section
   - .can-status �� flex row with bus state LED, frame count, CAN IDs
   - .can-bus-led �� LED indicator: active (green glow), idle (gray), error (red glow)
   - .can-frame �� monospace row with timestamp, direction arrow, CAN ID, DLC, data bytes
   - Color-coded left border: req=blue(--req-color), res=green(--res-color), neg=red(--neg-color)
   - Max 320px scrollable frame list with thin scrollbar
   - All CSS uses design token variables for dark/light theme support

2. **HTML**: Inserted after error-section closing div (lines 807-826)
   - Header with "?? CAN ����ͨ��" and "ISO 15765-2" subtitle
   - Status bar: bus state LED + frame count + CAN ID legend
   - Frame list with empty state "�ȴ� CAN ֡..."
   - Clear button

3. **JavaScript Functions** (lines 3542-3643):
   - canFrameEntries[] �� up to CAN_MAX_FRAMES=50 frames
   - makeCANFrame(bytes, direction) �� creates CAN frame object with:
     - CAN ID: 0x7E0 (request), 0x7E8 (response)
     - DLC: min(8, max(64, len)) with special handling for >8 byte payloads
     - dataHex: first 8 bytes formatted
     - isExtended: false (standard 11-bit frames)
   - logCANFrame(bytes, direction) �� pushes to array, renders, updates status
   - enderCANFrame(frame) �� creates DOM element with timestamp/arrow/ID/DLC/data
   - updateCANStatus() �� updates LED (active/idle) and frame count
   - 	oggleCANPanel() �� collapse/expand (same pattern as ISO-TP/Flash/Error)
   - clearCANLog() �� clears frame array and resets UI

4. **Integration Points**:
   - doSend() modified at 3 points:
     - After request ddLogEntry: logCANFrame(reqBytes, 'req')
     - After negative response ddLogEntry: logCANFrame(resBytes, 'neg')
     - After positive response ddLogEntry: logCANFrame(resBytes, 'res')
   - Suppressed responses (null result from handler) do NOT log CAN frames

### Key Design Decisions
- CAN ID mapping: 0x7E0 (tester��ECU request), 0x7E8 (ECU��tester response) �� standard 11-bit diagnostic addresses
- DLC calculation: 8 for most UDS messages (standard CAN frame), actual length for longer payloads
- Only first 8 bytes displayed in CAN data field (standard CAN frame payload limit)
- Separate clear button from main "�����־" �� CAN panel independent
- Panel starts collapsed by default (consistent with ISO-TP/Flash/Error panels)
- frame.timestamp uses Date object for millisecond precision in display
- All CSS var references match existing design tokens �� fully compatible with dark/light themes

### File Changes
- uds_simulator.html: 3489 �� 3651 lines (+162 lines)
  - CSS: +34 lines
  - HTML: +20 lines
  - JavaScript: +102 lines (CAN functions + 3 hook lines in doSend)

## 2026-05-19: Wave 4, Task 14 — OBD-II 兼容模式

### Implementation Summary
Added OBD-II compatible mode panel to uds_simulator.html supporting SAE J1979 Mode 01 PID requests:

1. **OBD2_PIDS Data** (13 PIDs):
   - 04: 发动机负载 (%), 05: 冷却液温度 (°C), 0A: 燃油压力 (kPa)
   - 0B: 进气歧管压力 (kPa), 0C: 发动机转速 (RPM), 0D: 车速 (km/h)
   - 0F: 进气温度 (°C), 10: MAF 空气流量 (g/s), 11: 节气门位置 (%)
   - 21: 故障灯行驶里程 (km), 2F: 燃油液位 (%), 46: 环境温度 (°C), 51: 燃油类型

2. **Key Design Decisions**:
   - `obd2Mode` flag controls routing: when true, first byte 0x01 intercepts to `handleOBD2Request()` instead of UDS `processRequest()`
   - Interception happens at `doSend()` level — clean separation from UDS state machine
   - OBD-II mode does NOT affect UDS ECU state (session, security, counters preserved)
   - `eval()` in `formatOBD2Value()` is safe — formulas are hardcoded constants in `OBD2_PIDS`
   - Simulated values use realistic ranges: RPM 1500-2800, Speed 35-90 km/h, temps 35-100°C

3. **OBD-II Panel** (collapsible, below CAN panel):
   - Mode toggle switch: UDS ↔ OBD-II with indicator LED
   - PID query grid (3x5): 13 buttons auto-generated by `renderOBD2Panel()`
   - Demo button: "读取转速+车速+水温" sequential PID requests
   - Status bar shows current mode

4. **Composer Adaptation**:
   - UDS composer wrapped in `<div id="uds-composer">`, OBD-II composer in `<div id="obd2-composer">`
   - `toggleOBD2Mode()` shows/hides the appropriate composer
   - OBD-II composer: PID hex input (2 chars), 9 quick PID buttons, preview + decode
   - PID input validated via regex `/^[0-9a-fA-F]{2}$/`

5. **Handler Functions**:
   - `handleOBD2Request(pid)` — generates simulated PID data with realistic values per PID
   - `formatOBD2Value(pid, data, info)` — applies formula like A/2.55, (A*256+B)/4, A-40
   - `sendOBD2Request(pid)` — dispatches `[0x01, pid]` via doSend()
   - `setOBD2PID(pid)` — sets input + auto-sends
   - `updateOBD2Preview()` — live preview of request/response/decode
   - `runOBD2Demo()` — 3-step sequential: RPM → Speed → Coolant Temp

### CSS Classes Added
- `.obd2-section`, `.obd2-header`, `.obd2-body`, `.obd2-toggle` — collapsible panel (same pattern as CAN/Flash/Error)
- `.obd2-mode-bar`, `.obd2-mode-indicator` (uds/obd2) — mode status bar
- `.obd2-pid-grid`, `.obd2-pid-btn` — 3-column PID button grid
- `.obd2-status` — status bar
- `.obd2-demo-btn` — green demo button
- `.obd2-pid-input` — centered monospace PID input

### File Changes
- uds_simulator.html: 3651 → 3977 lines (+326 lines)
  - CSS: +50 lines (OBD-II section styles)
  - HTML: +95 lines (OBD-II composer + OBD-II panel + UDS composer wrapper)
  - JavaScript: +180 lines (OBD2_PIDS, state, 11 handler functions, doSend modification, init calls)

### Integration Points
- `doSend()` modified with OBD-II check at top — exits early for 0x01 in OBD-II mode
- UDS composer wrapped in `<div id="uds-composer">` for show/hide toggling
- init section adds `renderOBD2Panel()` and `updateOBD2UI()` calls
- Existing 13 UDS scenarios, error injection, flash, ISO-TP all preserved
- CAN frame logging works for OBD-II requests/responses

## 2026-05-19: Wave 4, Task 13 — DoIP 入口仿真面板

### Implementation Summary
Added "🌐 DoIP 入口" collapsible panel below the OBD-II panel in uds_simulator.html:

1. **CSS** (lines 502-523): `.doip-section/header/body/toggle` follows the exact same collapsible pattern as `.can-section`, `.obd2-section`, `.error-section`
   - `.doip-status-bar` — flex row with connection status, routing status, logical addresses, power mode selector
   - `.doip-log` — scrollable packet log (max 220px, 4px scrollbar)
   - `.doip-msg` — monospace row with timestamp, direction, type, data
   - `.doip-power-select` — power mode dropdown styled to match theme
   - All CSS uses design token variables for dark/light theme support

2. **HTML** (lines 943-977): Inserted after OBD-II panel closing div, before composer-body close
   - Status bar: connection LED text, routing status, logical address display (0x0E00 → 0x0E80), power mode dropdown
   - Action buttons: 激活 DoIP, VIN 请求, 路由激活, Alive Check
   - Diagnostic message input with HEX text field + send button
   - DoIP packet log with empty state "等待 DoIP 报文..."

3. **JavaScript Functions** (lines 4028-4283):
   - `DOIP_TYPES` — 9 message types (0x0001-0x0005, 0x8001-0x8004)
   - `doipState` — state object with active/connected/routingActivated/sourceAddr/targetAddr/vin/gid/packetLog
   - `toggleDoIPPanel()` — collapse/expand (same pattern as CAN/OBD-II/Error)
   - `toggleDoIP()` — enable/disable DoIP mode, manage alive check interval
   - `logDoIPPacket(typeId, direction, dataBytes, desc)` — push to packetLog, render
   - `renderDoIPLog()` — render last 50 entries to the log element
   - `sendDoIPVINRequest()` — send 0x0002, simulate 0x0003 VIN response with VIN+GID+logical addresses
   - `sendDoIPRoutingActivation()` — send 0x0004, simulate 0x0005 with routing success + logical addresses
   - `sendDoIPDiagnostic()` — parse HEX input, wrap in DoIP 0x8001 payload (source+target addr + UDS), forward to doSend(), log 0x8002 ACK after P2 delay
   - `sendDoIPAliveCheck()` — send 0x8004 request+response
   - `setDoipPowerMode(mode)` — 3 modes: 点火关闭/点火开启/熄火-休眠, deactivate on sleep
   - `updateDoipUI()` — update connection/routing/address display in status bar

### Key Design Decisions
- DoIP functions are fully independent from existing UDS/CAN/ISO-TP flows
- `sendDoIPDiagnostic()` bridges to existing `doSend(udsBytes)` for UDS processing
- DoIP panel has its own separate log (`doipState.packetLog`), separate from main message log
- VIN request and routing activation use simulated responses with setTimeout
- Diagnostic messages require DoIP active + routing activated before sending
- Power mode set to sleep (2) disconnects and deactivates routing
- No modifications to `doSend()`, `processRequest()`, `ECU_CONFIGS`, or any existing handlers
- Panel starts collapsed by default (consistent with ISO-TP/Flash/Error/CAN/OBD-II panels)

### File Changes
- uds_simulator.html: 3977 → 4293 lines (+316 lines)
  - CSS: +22 lines (DoIP section styles)
  - HTML: +35 lines (DoIP panel)
  - JavaScript: +259 lines (DOIP_TYPES, doipState, 10 handler functions)

## 2026-05-19: Wave 5, Task 15 — 学习笔记/书签功能 (Bookmarks & Notes)

### Implementation Summary
Added 7th tab "📑 学习笔记" to uds_learning_tool.html with full bookmark management:

1. **Data Layer** (localStorage key: `uds_bookmarks`):
   - Bookmark object: `{ id, type, ref, name, note, createdAt, updatedAt }`
   - type: `'service'` | `'nrc'`
   - ref: HEX string (SID like "10", or NRC value like "13", "01-0F")

2. **UI Components**:
   - ★/☆ bookmark star button on every service card and NRC card (position: absolute, bottom-right)
   - "📑 学习笔记" nav button with badge count (after 知识测验)
   - Notes tab panel with search (by name/ref/note), type filter (all/service/nrc), export/import buttons
   - Bookmark list items showing type badge, name, HEX ref, note preview, edit/delete buttons
   - Note editing modal with title, type badge, HEX ref, textarea, auto-save (debounced 500ms)
   - Bookmark count badge on sidebar button (shows/hides based on count)

3. **Key Functions**:
   - `getBookmarks()` / `saveBookmarks(bms)` — localStorage CRUD
   - `toggleBookmark(type, ref, name)` — toggle bookmark on/off, updates stars + list
   - `isBookmarked(type, ref)` / `getBookmark(type, ref)` — check/get state
   - `updateBookmarkNote(id, note)` / `deleteBookmark(id)` — update/remove
   - `renderBookmarks()` — full render of bookmark list tab with search+filter
   - `updateAllStars()` — sync ALL star buttons with bookmark state
   - `updateBookmarkBadge()` — update sidebar badge count
   - `openBmNoteModal(id)` / `closeBmNoteModal()` / `saveBmNote()` — note editor
   - `exportBookmarks()` / `importBookmarks(event)` — JSON export/import with duplicate detection
   - `escapeHtml(str)` — XSS-safe note preview rendering

4. **Integration Points**:
   - Service card rendering (`renderServices()`): added star button after nrc-list
   - NRC card rendering (`renderNRCs()`): added star button after description div
   - Tab navigation: `renderBookmarks()` called when switching to notes tab
   - Init: `updateBookmarkBadge()` called in the init sequence
   - ESC key: `closeBmNoteModal()` added to existing keydown handler
   - Overlay click handler for note modal close

5. **CSS Additions**:
   - `.bookmark-star` (absolute positioned, z-index:2, active/inactive states with gold color)
   - `.service-card { position: relative }` / `.nrc-card { position: relative }` for star positioning
   - `.bookmark-item` (flex card with type badge, name, note preview, action buttons)
   - `.bm-modal-overlay` / `.bm-modal` (note editing modal following existing modal pattern)
   - `#bookmark-count` (primary-colored badge, zero class for hidden state)
   - `.btn-sm` (small button style for export/import)
   - All styles support dark theme via CSS variable references

### Key Design Decisions
- Star button uses `event.stopPropagation()` to prevent card click when toggling bookmark
- `escapeHtml()` used for note preview to prevent XSS when displaying user-entered text
- Debounced auto-save (500ms) on note textarea avoids excessive localStorage writes
- Import deduplication: skips bookmarks with matching type+ref from existing data
- Export handles empty state with alert message
- NRC range values (e.g., "01-0F") use the full range string as ref for uniqueness
- Star buttons use `data-bm-type` and `data-bm-ref` attributes for `updateAllStars()` sync

### File Changes
- uds_learning_tool.html: 2162 → 2414 lines (+252 lines)
  - CSS: +38 lines (bookmark styles)
  - HTML: +40 lines (notes tab + bookmark note modal)
  - JavaScript: +174 lines (bookmark functions + integration hooks)
  - No changes to uds_simulator.html

## 2026-05-19: Task 16 - Quiz Expansion (26��111 questions)

### Summary
Expanded the UDS knowledge quiz from 26 to 111 questions covering all major UDS topics.

### Changes Made
1. **85 new questions added** to QUIZ array in uds_learning_tool.html:
   - Service (20): Covers every UDS service from 0x10-0x3E, 0x84-0x87
   - NRC (15): Common NRCs 0x10-0x93, including condition errors
   - Session (10): Session switching rules, timers (S3/P2/P2*)
   - Security (8): Seed-key mechanism, levels, related NRCs
   - DID/DTC (8): Data identifiers, DTC structure and reporting
   - ISO-TP (8): Single/multi-frame, flow control, CAN addressing
   - Programming (8): Flash sequence, RequestDownload/TransferData
   - Comprehensive (8): Cross-topic and advanced application questions

2. **Category filter dropdown updated** with 8 new topic categories + backward compatibility mapping for old topics ('sid'��'service', 'general'��'comprehensive')

3. **New JS utilities**:
   - shuffleArray() - Fisher-Yates shuffle
   - ilterQuestionsByTopic() - topic-aware filtering with old-to-new mapping
   - andomQuiz() - picks 10 random questions from selected category

4. **UI additions**:
   - "?? ��� 10 ��" button for random quiz mode
   - Updated filter labels to match new categories

### Key Decisions
- Kept existing 26 questions EXACTLY as-is (topic values 'sid', 'nrc', 'session', 'general')
- Used topic mapping in filter logic rather than modifying old questions
- Question format kept consistent with existing: { q, a, opts, topic, explain }
- Easy (~40%), medium (~35%), hard (~25%) difficulty distribution

### Files Modified
- uds_learning_tool.html: QUIZ array (26��111 entries), filter dropdown, quiz JS functions

## 2026-05-19: Task 17 — 协议栈架构标签页 (Protocol Stack Tab)

### Implementation Summary
Added 11th tab "📚 协议栈" to uds_learning_tool.html showing UDS protocol stack architecture:

1. **Tab Button**: Added `data-tab="protocol"` nav button after the notes button (line 468-470)

2. **Tab Content** (`#tab-protocol`):
   - 6-layer vertical stack: Application (L7) → Presentation/Session (L6-L5) → Transport (L4) → Network (L3) → Data Link (L2) → Physical (L1)
   - Each layer shows: layer number, name, ISO standard, ▼ arrow
   - Click-to-expand details with toggleLayer() function
   - Application layer: 8 SID service tag badges
   - Transport layer: inline frame visualization (SF/FF/CF/FC with PCI tags)
   - Flow diagram at bottom: UDS→ISO-TP→CAN Frame→CAN Bus

3. **CSS Classes Added**:
   - `.stack-container`, `.stack-layer`, `.layer-bar`, `.layer-num`, `.layer-name`, `.layer-std`, `.layer-arrow`/`.open`
   - `.layer-app/session/transport/network/datalink/physical` — 6 distinct gradient colors (blue/purple/green/amber/red/gray)
   - `.layer-detail`/`.open` — collapsible detail section
   - `.layer-service-list` — flex-wrap service tag container
   - `.flow-container`, `.flow-step`, `.flow-example`, `.flow-arrow` — encapsulation flow diagram
   - `.dark .layer-*` — dark mode overrides with muted gradient tones

4. **JS Function**:
   - `toggleLayer(id)` — toggles `.open` on detail div and rotates arrow by adding `.open` to `.layer-arrow`

### Key Design Decisions
- Reused existing `.svc-tag` class (already defined for matrix/session tabs) for service badges — avoids conflicting CSS
- Used existing CSS variables: `--card`, `--code-bg`, `--text`, `--text2`, `--border`, `--primary`, `--success`
- Avoided `--card2` and `--text3` which don't exist in this file's design tokens — substituted `--code-bg` and `--text2`
- Each layer has a distinct color identity matching common network visualization conventions (blue=app, purple=session, green=transport, amber=network, red=datalink, gray=physical)
- Layer colors have dark mode overrides with muted/saturated variants for legibility
- Flow diagram uses ↓ arrows with descriptive hex examples at each encapsulation stage
- Frame visualization in transport layer shows PCI structure with colored inline badges

### Integration
- Tab switching handled by existing navigation event listener (line 2427-2436) — no changes needed
- No modifications to uds_simulator.html
- All existing tabs (services, explorer, nrc, sessions, builder, quiz, notes, matrix, decoder, animation) preserved

### Gotchas
- `--font-mono` CSS variable does not exist in this file — used `font-family: monospace` directly
- `--card2` does not exist — used `var(--code-bg)` for background fills
- `--text3` does not exist — used `var(--text2)` for secondary text
- `.svc-tag` already defined with `display: inline-flex` in existing CSS — my generated HTML uses these tags without redefining the class

## 2026-05-19: Wave 6, Task 20 — PWA Offline Support

### Implementation Summary
Added Progressive Web App (PWA) offline support to enable offline usage and "Add to Home Screen" functionality:

1. **`manifest.json`** (project root):
   - App name: "UDS Study Tool", short name: "UDS Tool"
   - `display: standalone` for full-screen experience when added to home screen
   - Theme color: `#2563eb` (matching the app's primary blue)
   - Background color: `#0a0e17` (dark theme compatible)
   - 2 SVG icon sizes (192×192 and 512×512) using inline data URIs — no external icon files needed
   - `purpose: "any maskable"` for adaptive icon support on Android

2. **`sw.js`** (project root):
   - Cache-First strategy: serves cached assets first for speed, fetches from network if uncached
   - Pre-caches: `/uds-study-tool/`, `uds_learning_tool.html`, `uds_simulator.html`, `manifest.json`
   - Install: opens cache, adds all assets, calls `skipWaiting()` for immediate activation
   - Activate: clears old caches (versioning support), calls `clients.claim()`
   - Fetch: cache-first → network → offline HTML fallback for text/html requests
   - Only intercepts GET requests (no POST/PUT etc.)

3. **Both HTML files** modified:

   **`<head>` additions** (after `</style>`):
   - `<link rel="manifest" href="manifest.json">`
   - Apple-specific meta tags
   - `<meta name="theme-color" content="#2563eb">`

   **Before `</body>` additions**:
   - Offline banner: fixed red bar at top (`#dc2626`), shows when offline, hides when online
   - SW registration: `navigator.serviceWorker.register('sw.js')` with console logs
   - `online`/`offline` event listeners for banner toggle

4. **Offline Banner**:
   - Hidden by default (`display:none`)
   - Fixed top, full width, z-index: 99999
   - Shows "⚠ 离线模式 — 部分功能可能受限" when offline

### Key Design Decisions
- SVG data URIs for icons — no external images or build tools
- Cache-First strategy ideal for static study tool content
- SW paths use `/uds-study-tool/` prefix for subpath deployment
- Offline banner uses inline styles to avoid CSS changes
- SW registration fires on `window.load` to avoid resource racing

### Files Created
- `manifest.json` (41 lines)
- `sw.js` (54 lines)

### Files Modified
- `uds_learning_tool.html`: +16 lines
- `uds_simulator.html`: +16 lines

### Verification
- `lsp_diagnostics` clean on all 4 files — no new errors
