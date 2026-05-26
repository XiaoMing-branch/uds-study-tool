# CAN/LIN 总线通信模式增强计划

## TL;DR

> **Quick Summary**: 在 UDS 学习工具和模拟器中新增 CAN 总线(ISO 11898)和 LIN 总线(ISO 17987)通信模式的教学内容和交互式模拟，涵盖帧结构、仲裁、错误处理、主从架构等核心概念。
>
> **Deliverables**:
> - 学习工具: 新增 2 个总线知识标签页(CAN + LIN)
> - 模拟器: 增强 CAN 面板(帧类型、仲裁、错误注入、状态机) + 新增 LIN 面板
> - 新增 CAN/LIN 测验题 10 道
> - 更新 README 文档
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Wave 1(结构+样式) → Wave 2(逻辑+内容) → Wave 3(集成) → Wave 4(文档+验证)

---

## Context

### Original Request
为 uds_learning_tool 和 uds_simulator 增加 CAN 总线和 LIN 总线通信模式，展示这两种总线下的通信原理，并更新文档。

### Interview Summary
**Key Discussions**:
- 功能深度: 两者都要(教学展示 + 交互模拟)
- 知识组织: 学习工具新增 2 个独立标签页(CAN 总线 / LIN 总线)
- 模拟器增强: 深度增强(帧结构标注、错误注入、总线状态机、仲裁可视化)
- 范围: 不涉及现有标签页修改、不引入外部依赖

**Research Findings**:
- 学习工具: 6 标签页(941 行 JS), 导航用 data-tab 机制, QUIZ 数组 26 题在 JS 397 行
- 模拟器: 已有 CAN 帧日志面板(HTML 376-394, JS 2931-3032), 硬编码 CAN ID 0x7E0/0x7E8
- 模拟器现有面板模式: collapsible section(header+body+open class toggle)
- 模拟器消息流: sendMessage() → doSend() → logCANFrame()
- 无 LIN 内容, 无 CAN 总线可视化

### Metis Review
**Identified Gaps** (addressed):
- 需明确学习工具的 i18n 策略(目前 learning-tool.js 没有 i18n 系统——只有中文硬编码)
- 需注意 CAN/LIN 内容的知识准确性(引用 ISO 标准)
- 模拟器 LIN 面板不能与现有 ISO-TP/DoIP 面板冲突

---

## Work Objectives

### Core Objective
为 UDS 学习工具和模拟器新增 CAN 总线和 LIN 总线的教学内容和交互模拟，帮助学生理解诊断消息在物理总线上如何传输。

### Concrete Deliverables
- **学习工具**: CAN 总线标签页 + LIN 总线标签页(各含帧结构、协议原理、对比)
- **学习工具**: 新增 10 道 CAN/LIN 相关测验题
- **学习工具 CSS**: 总线内容样式(帧结构图、对比表格)
- **模拟器**: CAN 面板深度增强(帧类型切换、仲裁演示、错误注入、状态机、负载计算)
- **模拟器**: LIN 面板新增(主从模式、帧结构、调度表)
- **模拟器 CSS**: LIN 面板样式
- **文档**: README.md 更新

### Definition of Done
- [ ] 打开学习工具可看到"🚌 CAN 总线"和"📡 LIN 总线"两个新标签页
- [ ] CAN 标签页展示完整 CAN 2.0A/B 帧结构、仲裁原理、错误类型、状态机
- [ ] LIN 标签页展示完整 LIN 帧结构、主从架构、调度表
- [ ] 模拟器 CAN 面板可选择帧类型(标准/扩展/CAN FD)、触发错误注入、显示总线状态
- [ ] 模拟器 LIN 面板可演示主从通信、显示帧结构
- [ ] 测验包含 CAN/LIN 相关题目
- [ ] README 已更新

### Must Have
- 学习工具新标签页遵循现有 data-tab 导航模式
- 模拟器新/增强面板遵循现有 collapsible section 模式
- CAN 总线知识基于 ISO 11898 标准
- LIN 总线知识基于 ISO 17987 标准
- 所有新增 UI 支持深色/浅色主题
- 不引入外部依赖

### Must NOT Have (Guardrails)
- 不修改现有 6 个标签页的内容
- 不修改模拟器核心 ECU 处理逻辑(processRequest/handleService)
- 不使用 canvas/WebGL/3D(保持轻量纯 CSS)
- 不拆分 HTML/JS 的绑定关系
- 不引入运行时依赖或后端

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO (纯前端 HTML 项目, 无测试框架)
- **Automated tests**: None (UI 功能通过 Playwright QA 场景验证)
- **Agent QA**: Playwright 浏览器自动化验证

### QA Policy
- **Frontend/UI**: Playwright — 打开页面, 点击导航, 检查标签页内容, 截图验证
- **API/Backend**: 不适用(纯前端)
- **Evidence**: 截图保存到 `.sisyphus/evidence/`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 结构 + 样式, MAX PARALLEL):
├── Task 1: 学习工具 HTML — 新增 CAN 标签页结构
├── Task 2: 学习工具 HTML — 新增 LIN 标签页结构
├── Task 3: 学习工具 CSS — 总线内容样式
├── Task 4: 模拟器 HTML — CAN 面板增强(帧类型/错误/状态控件)
├── Task 5: 模拟器 HTML — LIN 面板新增
├── Task 6: 模拟器 CSS — LIN 面板样式
└── Task 7: 模拟器 CSS — CAN 面板增强样式

Wave 2 (After Wave 1 — 内容 + 逻辑, MAX PARALLEL):
├── Task 8: 学习工具 JS — CAN 总线内容渲染(帧结构/仲裁/错误/状态机)
├── Task 9: 学习工具 JS — LIN 总线内容渲染(帧结构/主从/调度表)
├── Task 10: 学习工具 JS — CAN/LIN 测验题追加
├── Task 11: 模拟器 JS — CAN 引擎增强(帧类型/仲裁逻辑/错误注入/状态机)
└── Task 12: 模拟器 JS — LIN 引擎(主从模式/帧处理/调度表)

Wave 3 (After Wave 2 — 集成):
├── Task 13: 学习工具 — 完成 i18n 中文字符串
├── Task 14: 模拟器 — i18n 新增字符串(中英文)
├── Task 15: 模拟器 — CAN 总线场景 + LIN 总线场景
└── Task 16: 模拟器 — 总线负载计算 + CAN/LIN 模式切换 UI

Wave FINAL (After ALL tasks):
├── Task F1: Plan Compliance Audit (oracle)
├── Task F2: Code Quality Review (unspecified-high)
├── Task F3: Real Manual QA via Playwright (unspecified-high)
└── Task F4: Scope Fidelity Check (deep)
-> Present results -> Get explicit user okay
```

### Dependency Matrix

- **1-7**: - → 8-12 (blocked by: none)
- **8-10**: 1-3 → 13 (blocked by: 1, 2, 3)
- **11**: 4, 7 → 14, 15, 16 (blocked by: 4, 7)
- **12**: 5, 6 → 14, 15, 16 (blocked by: 5, 6)
- **13**: 8, 9, 10 → F1-F4 (blocked by: 8, 9, 10)
- **14, 15, 16**: 11, 12 → F1-F4 (blocked by: 11, 12)
- **F1-F4**: 13, 14, 15, 16 → done

### Agent Dispatch Summary

- **Wave 1**: 7 tasks → `visual-engineering`
- **Wave 2**: 5 tasks → T8-10 `visual-engineering`, T11-12 `deep`
- **Wave 3**: 4 tasks → `unspecified-high`
- **FINAL**: 4 tasks → F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

- [x] 1. 学习工具 HTML — 新增 CAN 总线标签页结构

  **What to do**:
  - 在 `<nav>` 区域(现有 6 个 nav-btn 之后)添加第 7 个导航按钮:
    `<button class="nav-btn" data-tab="canbus">🚌 CAN 总线</button>`
  - 在 `<main class="main-content">` 中添加对应的 tab-content 容器:
    `<div class="tab-content" id="tab-canbus">...</div>`, 初始为空容器
  - 容器内放置标题、副标题、内容 ID 占位

  **Must NOT do**:
  - 不修改现有 6 个 nav-btn 或 tab-content 的结构
  - 不改变现有导航机制

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [无需特殊 skill]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (Tasks 1, 2, 3, 4, 5, 6, 7)
  - **Blocks**: Task 8, Task 13
  - **Blocked By**: None

  **References** (CRITICAL):
  - `uds_learning_tool.html:14-32` — 现有 nav-btn 模式(data-tab 属性)
  - `uds_learning_tool.html:36-146` — 现有 tab-content 模式(#tab-{id})

  **Acceptance Criteria**:
  - [ ] 在浏览器中打开学习工具, 侧栏可见 "🚌 CAN 总线" 导航按钮
  - [ ] 点击按钮, 页面切换到空白 CAN 总线内容区(标题可见)

  **QA Scenarios**:
  ```
  Scenario: CAN 标签页导航
    Tool: Playwright
    Preconditions: 打开 uds_learning_tool.html
    Steps:
      1. 截图侧栏导航区域(确认 CAN 按钮存在)
      2. 点击 "🚌 CAN 总线" 按钮
      3. 检查 #tab-canbus 是否有 active class
      4. 确认其他 tab 没有 active class
    Expected Result: CAN 标签页激活显示, 原有标签页隐藏
    Evidence: .sisyphus/evidence/task-1-can-tab-nav.png
  ```

  **Evidence to Capture**:
  - [ ] 侧栏导航完整截图
  - [ ] CAN 标签页激活状态截图


- [x] 2. 学习工具 HTML — 新增 LIN 总线标签页结构

  **What to do**:
  - 在 `<nav>` 区域添加第 8 个导航按钮:
    `<button class="nav-btn" data-tab="linbus">📡 LIN 总线</button>`
  - 在 `<main class="main-content">` 中添加对应的 tab-content 容器:
    `<div class="tab-content" id="tab-linbus">...</div>`, 初始为空容器

  **Must NOT do**:
  - 同 Task 1

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` (同上)

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1)
  - **Blocks**: Task 9, Task 13
  - **Blocked By**: None

  **References**: 同 Task 1

  **Acceptance Criteria**:
  - [ ] 侧栏可见 "📡 LIN 总线" 导航按钮
  - [ ] 点击切换到空白 LIN 内容区

  **QA Scenarios**:
  ```
  Scenario: LIN 标签页导航
    Tool: Playwright
    Preconditions: 打开 uds_learning_tool.html
    Steps:
      1. 截图侧栏确认 LIN 按钮存在
      2. 点击 "📡 LIN 总线" 按钮
      3. 检查 #tab-linbus 有 active class
    Expected Result: LIN 标签页激活
    Evidence: .sisyphus/evidence/task-2-lin-tab-nav.png
  ```

  **Evidence to Capture**:
  - [ ] 侧栏导航完整截图


- [x] 3. 学习工具 CSS — 总线内容样式

  **What to do**:
  在 `css/learning-tool.css` 末尾添加以下样式:
  - `.bus-section` — 总线内容分区容器(间距、边距)
  - `.bus-card` — 信息卡片(圆角、阴影、背景)
  - `.bus-card h3` — 卡片标题
  - `.bus-card .bus-desc` — 描述文本
  - `.frame-diagram` — 帧结构图容器(flex 布局, 字节标注)
  - `.frame-byte` — 帧结构中的单个字节块(不同颜色标识不同字段)
  - `.frame-byte .label` — 字节字段名称
  - `.frame-byte .value` — 字节字段值
  - `.comparison-table` — CAN vs LIN 对比表格
  - `.comparison-table th/td` — 表头与单元格
  - `.state-machine` — 状态机可视化容器
  - `.state-node` — 状态节点(圆框+箭头)
  - `.error-tag` — 错误类型标签
  - `.bus-timeline` — 总线时序图容器
  - 所有样式同时支持 `:root`(浅色)和 `.dark`(深色)主题

  **Design guidelines**:
  - 深色主题使用 `.dark .bus-card { background: var(--card); }` 模式
  - 帧结构字节块颜色: SOF=#ef4444, ID=#3b82f6, CTRL=#f59e0b, DATA=#10b981, CRC=#a855f7, ACK=#ec4899, EOF=#6b7280
  - 对比表格: 左侧 CAN 蓝色调, 右侧 LIN 绿色调

  **Must NOT do**:
  - 不修改现有样式(只追加)
  - 不引入动画库

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [无需特殊 skill]

  **Parallelization**: YES (Wave 1)

  **References**:
  - `css/learning-tool.css` — 现有样式模式和设计语言
  - `css/simulator.css:382-415` — 现有 CAN 面板样式可作为参考

  **Acceptance Criteria**:
  - [ ] CAN 标签页内容使用新样式渲染后外观统一
  - [ ] LIN 标签页使用相同样式体系
  - [ ] 深色/浅色主题均正常

  **QA Scenarios**:
  ```
  Scenario: 总线样式正确应用
    Tool: Playwright
    Preconditions: 学习工具已打开, 内容已渲染(需 Task 8/9 配合)
    Steps:
      1. 切换到 CAN 标签页
      2. 检查帧结构图元素可见、颜色正确
      3. 切换到深色主题
      4. 检查帧结构图颜色对比度
    Expected Result: 所有元素正确显示, 深浅主题均可用
    Evidence: .sisyphus/evidence/task-3-bus-styles.png
  ```

  **Evidence to Capture**: 深浅主题对比截图


- [x] 4. 模拟器 HTML — CAN 面板增强

  **What to do**:
  增强现有 CAN 面板(uds_simulator.html 第 375-394 行), 在 `can-body` 内添加:
  - CAN 帧类型选择器: `<select id="can-format-select">` 选项 `CAN 2.0A (标准)` / `CAN 2.0B (扩展)` / `CAN FD`
  - CAN 总线状态显示行: `can-status-line` 显示 `状态: Error Active` / `TEC:0 / REC:0` / `负载率: 0%`
  - CAN 错误注入按钮组: CRC 错误 / ACK 错误 / 填充错误 / 格式错误 / 总线关闭
  - CAN 仲裁演示按钮: `演示仲裁(低 ID 优先)`
  - CAN 帧结构标注切换: toggle 显示/隐藏 CAN 帧结构注解
  - 保持现有 can-frame-list 和 can-status 不变, 在它们之上添加新控件

  **HTML 结构示意**:
  ```html
  <div class="can-body" id="can-body">
    <!-- 帧类型选择 -->
    <div class="can-format-row">
      <label>帧格式:</label>
      <select id="can-format-select">
        <option value="2.0A">CAN 2.0A (标准)</option>
        <option value="2.0B">CAN 2.0B (扩展)</option>
        <option value="FD">CAN FD</option>
      </select>
      <label class="toggle-label">
        <input type="checkbox" id="can-annotate-toggle"> 帧结构标注
      </label>
    </div>
    <!-- 状态信息 -->
    <div class="can-status-line" id="can-status-line">
      <span>状态: <span id="can-bus-state" style="color:var(--success)">Error Active</span></span>
      <span>TEC: <span id="can-tec">0</span> / REC: <span id="can-rec">0</span></span>
      <span>负载率: <span id="can-load">0</span>%</span>
    </div>
    <!-- 错误注入 -->
    <div class="can-error-actions">
      <button class="btn btn-sm" onclick="injectCANError('crc')">CRC 错误</button>
      <button class="btn btn-sm" onclick="injectCANError('ack')">ACK 错误</button>
      <button class="btn btn-sm" onclick="injectCANError('stuff')">填充错误</button>
      <button class="btn btn-sm" onclick="injectCANError('form')">格式错误</button>
      <button class="btn btn-sm btn-danger" onclick="injectCANError('bus-off')">总线关闭</button>
    </div>
    <!-- 仲裁演示 -->
    <div class="can-arbitration-row">
      <button class="btn btn-sm" onclick="demoCANArbitration()">演示仲裁</button>
    </div>
    <!-- 现有帧列表(保持不变) -->
    ...
  </div>
  ```

  **Must NOT do**:
  - 不修改现有 can-frame-list, can-status, can-empty 元素(追加控件而非重写)
  - 不删除现有功能

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**: YES (Wave 1, with Tasks 5, 6, 7)

  **References**:
  - `uds_simulator.html:375-394` — 现有 CAN 面板结构
  - `uds_simulator.html:427-460` — DoIP 面板可作为增强样式参考
  - `css/simulator.css:382-415` — 现有 CAN 面板 CSS

  **Acceptance Criteria**:
  - [ ] CAN 面板展开后可见帧类型选择器
  - [ ] 可见错误注入按钮组
  - [ ] 可见总线状态信息行
  - [ ] 可见仲裁演示按钮
  - [ ] 现有帧列表功能不受影响

  **QA Scenarios**:
  ```
  Scenario: CAN 面板增强控件可见
    Tool: Playwright
    Preconditions: 打开 uds_simulator.html, 无 CAN 帧
    Steps:
      1. 点击 CAN 面板头部展开
      2. 截图 CAN 面板完整内容
      3. 检查 can-format-select 元素存在
      4. 检查 5 个错误注入按钮存在
      5. 检查总线状态行存在
    Expected Result: 所有新控件可见
    Evidence: .sisyphus/evidence/task-4-can-enhanced-panel.png
  ```

  **Evidence to Capture**:
  - [ ] CAN 面板展开后完整截图


- [x] 5. 模拟器 HTML — LIN 总线面板新增

  **What to do**:
  在模拟器右侧面板新增 LIN 总线可折叠面板, 遵循现有 section 模式(如 DoIP 面板 `doip-section`):
  - 新增 `<div class="lin-section">` 在 `composer-body` 内现有 section 之后
  - 头部: `<div class="lin-header" onclick="toggleLINPanel()">` 含 "📡 LIN 总线通信" + ISO 17987 标注
  - 主体 `<div class="lin-body" id="lin-body">` 含:
    - LIN 模式选择: Master/Slave 单选
    - LIN 帧结构显示区: 同步间隔 + 同步字节(0x55) + PID + 数据 + 校验和
    - LIN 调度表显示区: 预设调度条目列表
    - LIN 帧日志列表: `lin-frame-list`
    - LIN 操作按钮: 发送 LIN 帧 / 唤醒 / 休眠
    - 总线状态指示: `lin-status`
  - 折叠/展开 JS: `toggleLINPanel()` 函数(与 toggleCANPanel 模式相同)

  **Must NOT do**:
  - 不修改现有 section(toggleLINPanel 独立命名避免冲突)
  - LIN 帧日志不写入现有 UDS 消息日志(log-container), 独立显示

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**: YES (Wave 1)

  **References**:
  - `uds_simulator.html:427-460` — DoIP 面板结构(section/header/body/toggle 模式)
  - `uds_simulator.html:376-394` — CAN 面板结构(可作为类似参考)
  - `css/simulator.css:499-520` — DoIP CSS 模式

  **Acceptance Criteria**:
  - [ ] 模拟器右侧面板可见 "📡 LIN 总线通信" 可折叠标题
  - [ ] 点击展开显示 LIN 模式选择、帧结构、调度表
  - [ ] LIN 面板可折叠/展开

  **QA Scenarios**:
  ```
  Scenario: LIN 面板可见且可展开
    Tool: Playwright
    Preconditions: 打开 uds_simulator.html
    Steps:
      1. 截图右侧面板找 LIN 标题
      2. 点击 LIN 标题展开面板
      3. 检查 lin-body 有 open class
      4. 截图 LIN 面板完整内容
    Expected Result: LIN 面板展开显示所有控件
    Evidence: .sisyphus/evidence/task-5-lin-panel.png
  ```

  **Evidence to Capture**:
  - [ ] LIN 面板展开截图


- [x] 6. 模拟器 CSS — LIN 面板样式

  **What to do**:
  在 `css/simulator.css` 末尾追加 LIN 面板样式:
  - `.lin-section` — 与 doip-section/can-section 一致的间距和边框
  - `.lin-header` — 与 doip-header 一致的交互式标题
  - `.lin-toggle` — 折叠箭头
  - `.lin-body` — 内容区域(display:none / display:block 切换)
  - `.lin-body.open` — 展开状态
  - `.lin-mode-bar` — 主从模式选择栏(类似 obd2-mode-bar)
  - `.lin-frame-structure` — LIN 帧结构可视化(水平字节布局)
  - `.lin-frame-byte` — 单个字节块(颜色区分 sync/PID/data/checksum)
  - `.lin-frame-list` — LIN 帧日志列表
  - `.lin-frame-item` — 单条 LIN 帧
  - `.lin-schedule-table` — 调度表
  - `.lin-schedule-item` — 调度条目
  - `.lin-status` — 总线状态
  - `.lin-actions` — 按钮容器

  **Colors**:
  - LIN 帧: Sync=#6366f1(indigo), PID=#ec4899(pink), Data=#10b981(green), Checksum=#f59e0b(amber)
  - 深色主题前缀 `.dark .lin-xxx { ... }`

  **Must NOT do**:
  - 不修改现有 CAN/DoIP/OBD2 CSS

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**: YES (Wave 1)

  **References**:
  - `css/simulator.css:382-415` — CAN CSS 模式(can-section, can-header 等)
  - `css/simulator.css:499-520` — DoIP CSS 模式(doip-section, doip-body)

  **Acceptance Criteria**:
  - [ ] LIN 面板样式与模拟器现有设计语言一致
  - [ ] LIN 帧结构可视化颜色区分正确
  - [ ] 深色/浅色主题均正常

  **QA Scenarios**:
  ```
  Scenario: LIN 面板样式检查
    Tool: Playwright
    Preconditions: 打开模拟器, LIN 面板展开
    Steps:
      1. 截图带 LIN 面板的完整页面
      2. 切换到深色主题(调用 toggleTheme 类似功能)
      3. 再次截图
    Expected Result: LIN 面板在两种主题下均正常显示
    Evidence: .sisyphus/evidence/task-6-lin-styles.png
  ```

  **Evidence to Capture**: 深浅主题 LIN 面板截图


- [x] 7. 模拟器 CSS — CAN 面板增强样式

  **What to do**:
  在 `css/simulator.css` 现有 CAN 样式之后追加增强样式:
  - `.can-format-row` — 帧格式选择行(flex 布局)
  - `.can-format-row select` — 下拉选择器样式
  - `.toggle-label` — toggle 开关标签
  - `.can-status-line` — 总线状态信息行
  - `.can-status-line span` — 状态项
  - `.can-error-actions` — 错误注入按钮组
  - `.can-arbitration-row` — 仲裁演示行
  - `.can-annotated-frame` — 带标注的 CAN 帧显示
  - `.can-annotated-frame .af-byte` — 带字段名的字节块
  - `.can-frame.can-annotated` — 标注模式下帧条目样式

  **Colors** (帧结构标注):
  - SOF=#ef4444(red), Arbitration ID=#3b82f6(blue), Control=#f59e0b(amber), Data=#10b981(green), CRC=#a855f7(purple), ACK=#ec4899(pink), EOF=#6b7280(gray)
  - Error frame: 红色闪烁动画

  **Must NOT do**:
  - 不删除或修改现有 can-* 样式
  - 不添加动画库(使用纯 CSS animation)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**: YES (Wave 1)

  **References**:
  - `css/simulator.css:382-415` — 现有 CAN CSS(追加而非修改)

  **Acceptance Criteria**:
  - [ ] 增强控件样式正确
  - [ ] 错误注入按钮有 danger 色样式
  - [ ] 帧结构标注颜色区分清晰

  **QA Scenarios**:
  ```
  Scenario: CAN 增强样式
    Tool: Playwright
    Preconditions: 模拟器打开, CAN 面板展开
    Steps:
      1. 截图 CAN 面板完整区域
      2. 点击帧结构标注 toggle
      3. 发送一条消息观察标注帧
      4. 截图标注模式下的帧
    Expected Result: 新控件样式正确, 标注帧颜色区分清晰
    Evidence: .sisyphus/evidence/task-7-can-enhanced-styles.png
  ```

  **Evidence to Capture**: CAN 面板截图(含标注帧)


- [ ] 8. 学习工具 JS — CAN 总线内容渲染

  **What to do**:
  在 `js/learning-tool.js` 末尾添加 CAN 总线内容数据和渲染函数:

  **数据**: 定义 `CAN_CONTENT` 对象包含以下章节:
  1. **CAN 总线概述**: CAN 2.0A(标准帧 11-bit ID), CAN 2.0B(扩展帧 29-bit ID), CAN FD(灵活数据率)
  2. **CAN 帧结构**(核心内容):
     - SOF(1 bit, 显性) → 仲裁场(11/29 bit ID + RTR/IDE) → 控制场(IDE/r0/DLC) → 数据场(0-8 bytes) → CRC场(15 bit + 分隔符) → ACK场(2 bit) → EOF(7 bit)
     - 用 frame-diagram 样式渲染每个字段的可视化字节块
     - 每个字段带悬浮提示说明
  3. **CAN 总线仲裁**: CSMA/CR 原理, 显性位覆盖隐性位, ID 越小优先级越高
  4. **CAN 错误处理**: 5 种错误类型(位错误/填充错误/CRC 错误/格式错误/ACK 错误), 错误帧结构
  5. **CAN 总线状态机**: Error Active → Error Passive → Bus Off, TEC/REC 计数器机制
  6. **CAN vs CAN FD 对比**: 速率、数据长度、兼容性

  **渲染函数**: `renderCANContent()` — 将 CAN_CONTENT 渲染到 #tab-canbus:
  - 使用 `section-title` / `section-subtitle` 类(与现有标签页一致)
  - 各章节使用 `bus-section` + `bus-card` 容器
  - 帧结构图使用 `frame-diagram` + `frame-byte` 布局
  - 调用时机: 页面加载时渲染(类似 init)

  **Must NOT do**:
  - 不修改现有 SERVICES/QUIZ/SESSIONS/NRCS 数据
  - 不修改现有 renderServices/renderNRCs/renderHexMap 等函数

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [无需特殊 skill]
  - **Reason**: 该任务涉及数据定义和 DOM 渲染, 属于前端 UI 内容

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 2, with Tasks 9, 10, 11, 12)
  - **Blocks**: Task 13
  - **Blocked By**: Task 1, Task 3

  **References**:
  - `js/learning-tool.js:396-424` — QUIZ 数组(作为数据定义参考)
  - `js/learning-tool.js:426-461` — renderServices 函数(作为 DOM 渲染参考)
  - `js/learning-tool.js:924-932` — 导航初始化

  **Acceptance Criteria**:
  - [ ] 切换到 CAN 标签页可见完整的 6 个章节内容
  - [ ] CAN 帧结构图每个字节字段颜色正确且有标注
  - [ ] 仲裁原理有图示说明
  - [ ] 错误类型列表完整
  - [ ] 状态机图示正确
  - [ ] 深色/浅色主题下文字可读

  **QA Scenarios**:
  ```
  Scenario: CAN 标签页内容完整
    Tool: Playwright
    Preconditions: 学习工具已打开
    Steps:
      1. 点击 "🚌 CAN 总线" 标签
      2. 截图完整页面
      3. 滚动到底部确保所有章节可见
      4. 检查帧结构图中所有字段(SOF/仲裁/控制/数据/CRC/ACK/EOF)都在
      5. 点击深色模式, 再次截图对比
    Expected Result: 所有 CAN 知识章节完整渲染
    Evidence: .sisyphus/evidence/task-8-can-content.png, task-8-can-dark.png
  ```

  **Evidence to Capture**:
  - [ ] CAN 标签页完整内容截图(浅色+深色)
  - [ ] 帧结构图特写截图


- [ ] 9. 学习工具 JS — LIN 总线内容渲染

  **What to do**:
  在 `js/learning-tool.js` 末尾添加 LIN 总线内容数据和渲染函数:

  **数据**: 定义 `LIN_CONTENT` 对象包含以下章节:
  1. **LIN 总线概述**: LIN(Local Interconnect Network)简介, ISO 17987 标准, 低成本低速(≤20kbps)子总线
  2. **LIN 帧结构**: 同步间隔(13+ bits 显性) + 同步字节(0x55) + PID(Protected ID, 6-bit ID+2-bit 奇偶校验) + 数据(1-8 bytes) + 校验和(经典/增强)
  3. **LIN 主从架构**: Master 任务(调度表、报头) vs Slave 任务(响应), 单主多从
  4. **LIN 调度表**: 调度表定义了总线上的报文顺序和时间, 每个调度条目含帧 ID 和时隙
  5. **LIN 总线电平**: 隐性 12V / 显性 0V, 收发器原理
  6. **CAN vs LIN 对比表格**

  **渲染函数**: `renderLINContent()` — 渲染到 #tab-linbus

  **Must NOT do**: 不修改现有数据或函数

  **Recommended Agent Profile**: `visual-engineering`
  **Parallelization**: YES (Wave 2, with Tasks 8, 10, 11, 12)
  - **Blocks**: Task 13
  - **Blocked By**: Task 2, Task 3

  **Acceptance Criteria**:
  - [ ] LIN 标签页可见完整的 6 个章节
  - [ ] LIN 帧结构图每个字段颜色正确
  - [ ] CAN vs LIN 对比表格正确渲染

  **QA Scenarios**:
  ```
  Scenario: LIN 标签页内容完整
    Tool: Playwright
    Preconditions: 学习工具已打开
    Steps:
      1. 点击 "📡 LIN 总线" 标签
      2. 截图完整页面, 滚动确保所有章节可见
      3. 检查对比表格有 CAN/LIN 两列
      4. 检查帧结构图中同步间隔、同步字节、PID、数据、校验和都在
    Expected Result: 所有 LIN 知识章节完整渲染
    Evidence: .sisyphus/evidence/task-9-lin-content.png
  ```


- [ ] 10. 学习工具 JS — CAN/LIN 测验题追加

  **What to do**:
  在 `js/learning-tool.js` 的 `QUIZ` 数组末尾追加 10 道题目(topic='can' / 'lin'):

  CAN 题目 (6 道): CAN 帧 ID 位数(11/29)、仲裁机制(CSMA/CR)、CRC 位数(15)、ACK 错误检测、Error Passive 行为、CAN FD 改进

  LIN 题目 (4 道): 架构(单主多从)、同步字节(0x55)、最高速率(20kbps)、调度表作用

  **Must NOT do**:
  - 不修改现有 26 道题目
  - 不修改 startQuiz/renderQuiz/answerQuiz 函数

  **Recommended Agent Profile**: `quick`
  **Parallelization**: YES (Wave 2)
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] 测验页面筛选器新增 "CAN 总线" 和 "LIN 总线" 选项
  - [ ] 选择 "CAN 总线" 显示 6 道题
  - [ ] 选择 "LIN 总线" 显示 4 道题

  **QA Scenarios**:
  ```
  Scenario: CAN/LIN 测验题
    Tool: Playwright
    Preconditions: 学习工具打开, 测验标签页
    Steps:
      1. 检查筛选下拉有 CAN/LIN 选项
      2. 选 CAN 总线, 答题一题, 确认解释正确
      3. 选 LIN 总线, 同样测试
    Expected Result: 新题目可筛选、可答题
    Evidence: .sisyphus/evidence/task-10-quiz.png
  ```


- [ ] 11. 模拟器 JS — CAN 引擎增强

  **What to do**:
  在 `js/simulator.js` 的 CAN BUS MONITOR 区域增强:

  **CAN 配置状态**: `canConfig = { format, annotate, busState, tec, rec, totalFrames, busLoad, errorInjection }`

  **函数**:
  - 修改 `makeCANFrame()` — 根据 canConfig.format 生成不同帧格式(2.0A/2.0B/FD)
  - 修改 `logCANFrame()` — 增强帧记录(精确时间戳、格式信息)
  - 新增 `injectCANError(type)` — CRC/ACK/填充/格式/总线关闭错误注入
  - 新增 `demoCANArbitration()` — 多 ID 仲裁可视化演示
  - 新增 `updateCANBusState()` — TEC/REC 状态机(Active→Passive→Bus Off)
  - 新增 `calculateCANBusLoad()` — 近 1 秒总线负载率
  - 新增 `renderAnnotatedFrame(frame)` — 带字段标注的帧渲染
  - 修改 `renderCANFrame()` — 当 annotate=true 时显示字段标注

  **Must NOT do**:
  - 不修改核心 ECU 处理逻辑(processRequest/handleService)
  - 不修改 doSend 基本流程

  **Recommended Agent Profile**: `deep`
  **Parallelization**: YES (Wave 2, with Tasks 8, 9, 10, 12)
  - **Blocks**: Tasks 14, 15, 16
  - **Blocked By**: Tasks 4, 7

  **References**:
  - `js/simulator.js:2931-3032` — 现有 CAN 代码
  - `js/simulator.js:1994-2050` — doSend(调用 logCANFrame)

  **Acceptance Criteria**:
  - [ ] 切换帧类型后消息使用对应格式显示
  - [ ] 触发 CRC 错误显示错误帧
  - [ ] 连续错误后总线状态 Active→Passive→Bus Off
  - [ ] 仲裁演示显示多 ID 竞争
  - [ ] 帧结构标注模式显示颜色标注
  - [ ] 总线负载率显示

  **QA Scenarios**:
  ```
  Scenario: CAN 帧类型切换
    Tool: Playwright
    Steps:
      1. 选择 "CAN 2.0B (扩展)" 帧格式
      2. 发送 10 03
      3. 检查帧列表中 ID 为 29-bit 格式
    Expected Result: 扩展帧正确显示
    Evidence: .sisyphus/evidence/task-11-can-format.png
  ```
  ```
  Scenario: CAN 错误注入 + 仲裁演示
    Tool: Playwright
    Steps: 触发 CRC 错误 → 观察 TEC 增加; 点击仲裁演示 → 观察多帧竞争
    Evidence: .sisyphus/evidence/task-11-can-error.png
  ```


- [ ] 12. 模拟器 JS — LIN 引擎

  **What to do**:
  在 `js/simulator.js` 末尾追加 LIN 总线引擎:

  **LIN 状态**: `linState = { mode, active, frames, schedule, currentSlot, maxFrames }`
  **LIN 调度表数据**: 8 个 LIN 调度条目(车速/转速/水温/灯光/雨刮/诊断/主节点状态)

  **函数**:
  - `toggleLINPanel()` / `setLINMode(mode)` — 面板控制
  - `sendLINFrame(id, data)` — 构建 LIN 帧(同步间隔+0x55+PID+data+checksum)
  - `sendLINWakeUp()` / `sendLINSleep()` — 唤醒/休眠
  - `runLINMasterSchedule()` — Master 按调度循环发送
  - `calculateLINChecksum(data, pid, enhanced)` — 校验和
  - `calculateLINParity(id)` — PID 奇偶校验
  - `logLINFrame(frame)` / `renderLINFrame(frame)` — 帧日志
  - `renderLINSchedule()` / `clearLINLog()` / `updateLINUI()`

  **Must NOT do**:
  - 不将 LIN 帧写入 UDS 消息日志(独立显示)
  - 不修改 ECU 核心状态

  **Recommended Agent Profile**: `deep`
  **Parallelization**: YES (Wave 2)
  - **Blocks**: Tasks 14, 15, 16
  - **Blocked By**: Tasks 5, 6

  **Acceptance Criteria**:
  - [ ] Master 模式按调度表发送 LIN 帧
  - [ ] LIN 帧列表显示同步间隔+0x55+PID+数据+校验和
  - [ ] PID 奇偶校验正确
  - [ ] 唤醒/休眠功能可用

  **QA Scenarios**:
  ```
  Scenario: LIN Master 调度
    Tool: Playwright
    Steps:
      1. 选择 Master 模式, 点击"启动调度"
      2. 观察 LIN 帧列表出现多帧
      3. 检查每帧有 0x55 同步字节和 PID
    Expected Result: Master 按调度表发送 LIN 帧
    Evidence: .sisyphus/evidence/task-12-lin-schedule.png
  ```


- [ ] 13. 学习工具 — i18n 中文字符串

  **What to do**:
  **注意**: 学习工具目前没有完整的 i18n 系统(只有中文硬编码)。本次任务只需将新标签页的标题/描述等文本定义为常量, 方便后续国际化:
  - 在 `js/learning-tool.js` 中定义 `LEARNING_I18N` 对象(可选, 或直接使用中文)
  - 确保 nav-btn 的文本使用中文(如 "🚌 CAN 总线")
  - 确保所有 CAN/LIN 内容章节标题使用中文
  - 确保 quiz-topic 下拉选项包含 "CAN 总线" 和 "LIN 总线"

  **Must NOT do**:
  - 不改造现有英语支持(学习工具目前只有中文, 保持现状)
  - 不修改现有 6 个标签页的文本

  **Recommended Agent Profile**: `quick`
  **Parallelization**: YES (Wave 3)
  - **Blocks**: F1
  - **Blocked By**: Tasks 8, 9, 10

  **Acceptance Criteria**:
  - [ ] 侧栏 CAN/LIN 按钮显示中文
  - [ ] 标签页内容标题均为中文
  - [ ] 测验筛选包含中文选项

  **QA Scenarios**:
  ```
  Scenario: 中文 i18n 检查
    Tool: Playwright
    Steps:
      1. 打开学习工具
      2. 检查所有新标签页文本为中文
    Expected Result: 所有文本正确显示中文
    Evidence: .sisyphus/evidence/task-13-i18n.png
  ```


- [ ] 14. 模拟器 — i18n 新增字符串

  **What to do**:
  在 `js/simulator.js` 的 `I18N.zh` 和 `I18N.en` 中添加新面板的 i18n 字符串:

  **中文新增**:
  ```javascript
  'sim.sectionLIN':'📡 LIN 总线通信',
  'sim.linMode':'LIN 模式',
  'sim.linMaster':'主节点(Master)',
  'sim.linSlave':'从节点(Slave)',
  'sim.linStartSchedule':'▶ 启动调度',
  'sim.linStopSchedule':'⏹ 停止调度',
  'sim.linSendFrame':'📤 发送 LIN 帧',
  'sim.linWakeUp':'🔌 唤醒总线',
  'sim.linSleep':'💤 休眠',
  'sim.linFrameList':'LIN 帧日志',
  'sim.linSchedule':'调度表',
  'sim.linPID':'PID',
  'sim.linChecksum':'校验和',
  'sim.linSync':'同步',
  'sim.linStatus':'LIN 状态',
  'sim.linEmpty':'等待 LIN 帧...',
  'sim.canFormat':'帧格式',
  'sim.canFormat20A':'CAN 2.0A (标准)',
  'sim.canFormat20B':'CAN 2.0B (扩展)',
  'sim.canFormatFD':'CAN FD',
  'sim.canAnnotate':'帧结构标注',
  'sim.canState':'总线状态',
  'sim.canTEC':'TEC',
  'sim.canREC':'REC',
  'sim.canLoad':'负载率',
  'sim.canErrorCRC':'CRC 错误',
  'sim.canErrorACK':'ACK 错误',
  'sim.canErrorStuff':'填充错误',
  'sim.canErrorForm':'格式错误',
  'sim.canErrorBusOff':'总线关闭',
  'sim.canArbitration':'演示仲裁',
  'sim.canActive':'Error Active',
  'sim.canPassive':'Error Passive',
  'sim.canBusOff':'Bus Off',
  'sim.canFrameStandard':'标准帧',
  'sim.canFrameExtended':'扩展帧',
  'sim.canFrameFD':'CAN FD',
  }
  ```
  **英文新增**: 对应的英文翻译

  **使用 data-i18n**: 在 HTML 中新添加的元素上使用 `data-i18n` 属性

  **Must NOT do**:
  - 不修改现有 i18n 字符串
  - 不修改 switchLang 函数

  **Recommended Agent Profile**: `quick`
  **Parallelization**: YES (Wave 3, with Tasks 13, 15, 16)
  - **Blocks**: F1
  - **Blocked By**: Tasks 11, 12

  **References**:
  - `js/simulator.js:3-16` — 现有 I18N 对象的结构
  - `js/simulator.js:19-36` — switchLang 函数

  **Acceptance Criteria**:
  - [ ] 模拟器切换到英文模式后 CAN/LIN 面板文本为英文
  - [ ] 切换到中文后恢复中文

  **QA Scenarios**:
  ```
  Scenario: 模拟器 i18n 切换
    Tool: Playwright
    Steps:
      1. 打开模拟器
      2. 点击 EN/中文切换按钮
      3. 检查 CAN/LIN 面板文本语言变化
    Expected Result: 语言正确切换
    Evidence: .sisyphus/evidence/task-14-i18n-en.png, task-14-i18n-zh.png
  ```


- [ ] 15. 模拟器 — CAN 总线场景 + LIN 总线场景

  **What to do**:
  在模拟器中新增 CAN/LIN 相关场景:

  **CAN 场景** (追加到 `runScenario` 函数支持):
  - `can-arbitration-demo`: 演示 CAN 仲裁过程(3 个节点同时发送, 低 ID 获胜)
  - `can-error-chain`: 错误链演示(连续错误 → Error Passive → Bus Off)
  - `can-extended-frame`: 对比标准帧和扩展帧的发送
  - `can-bus-load`: 高负载场景(快速发送多帧, 观察负载率上升)

  **LIN 场景** (追加到 `runScenario` 函数支持):
  - `lin-master-schedule`: 演示 LIN Master 调度表运行
  - `lin-slave-response`: 演示 LIN Slave 响应过程
  - `lin-sleep-wake`: 演示 LIN 休眠和唤醒过程

  **在左侧场景列表添加 LIN 场景按钮**:
  ```html
  <div class="scenario-item" onclick="runScenario('lin-master-schedule')">
    <div class="sc-name" data-i18n="scenario.linMaster">📡 LIN Master 调度演示</div>
    <div class="sc-desc" data-i18n="scenario.desc.linMaster">按调度表发送车速/转速/水温等 LIN 帧</div>
  </div>
  ```

  **Must NOT do**:
  - 不删除现有 13 个场景

  **Recommended Agent Profile**: `unspecified-high`
  **Parallelization**: YES (Wave 3)
  - **Blocks**: F3
  - **Blocked By**: Tasks 11, 12

  **References**:
  - `uds_simulator.html:62-122` — 现有场景列表
  - `js/simulator.js` — runScenario 函数

  **Acceptance Criteria**:
  - [ ] 场景列表新增 LIN Master 调度演示
  - [ ] 点击后 LIN 面板自动展开并启动调度
  - [ ] CAN 仲裁演示可用

  **QA Scenarios**:
  ```
  Scenario: LIN Master 调度场景
    Tool: Playwright
    Steps:
      1. 点击左侧 "📡 LIN Master 调度演示"
      2. 观察 LIN 面板展开
      3. 观察 LIN 帧列表出现按调度表发送的帧
    Expected Result: 场景正确触发 LIN 调度
    Evidence: .sisyphus/evidence/task-15-lin-scenario.png
  ```


- [ ] 16. 模拟器 — 总线负载计算 + CAN/LIN 模式切换 UI

  **What to do**:
  - 实现 `calculateCANBusLoad()`: 基于近 1 秒内 CAN 帧占用时间计算总线负载率:
    - CAN 2.0 标准帧: 约 108 bit/帧(1Mbps 下约 108μs)
    - CAN 2.0 扩展帧: 约 128 bit/帧(约 128μs)
    - CAN FD: 根据速率和数据长度计算
    - 负载率 = 近 1 秒内所有帧占用时间之和 / 1000ms
  - 调用轮询: 每 500ms 调用一次 `updateCANEnhancedUI()` 更新负载显示
  - 总线负载显示在 `can-status-line` 中(已由 Task 4 添加)

  **Must NOT do**:
  - 不使用 setInterval 之外的轮询机制

  **Recommended Agent Profile**: `unspecified-high`
  **Parallelization**: YES (Wave 3)
  - **Blocked By**: Tasks 11, 12

  **Acceptance Criteria**:
  - [ ] 发送 CAN 帧后负载率从 0% 增加
  - [ ] 连续快速发送多帧后负载率显著上升
  - [ ] 负载率不超过 100%

  **QA Scenarios**:
  ```
  Scenario: 总线负载计算
    Tool: Playwright
    Steps:
      1. 打开模拟器, CAN 面板展开
      2. 检查初始负载率为 0%
      3. 快速连续发送 20 条消息
      4. 等待 1 秒后检查负载率 > 0%
    Expected Result: 负载率正确计算和显示
    Evidence: .sisyphus/evidence/task-16-bus-load.png
  ```





> 4 review agents run in PARALLEL. ALL must APPROVE.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Check all changed files for: commented-out code, unused imports, AI slop patterns, theme support.
  Output: `Build [PASS] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Execute EVERY QA scenario from EVERY task. Capture evidence to `.sisyphus/evidence/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

- **Commit 1**: `feat(learning-tool): 新增 CAN 总线与 LIN 总线教学内容` — 学习工具 HTML/CSS/JS
- **Commit 2**: `feat(simulator): 深度增强 CAN 总线面板并新增 LIN 总线面板` — 模拟器 HTML/CSS/JS
- **Commit 3**: `docs: 更新 README 添加 CAN/LIN 总线功能介绍`
- (可合并为 1-2 个提交, 取决于修改规模)

---

## Success Criteria

### Verification Commands
```bash
# 打开学习工具检查新标签页
start D:\Users\18065\Desktop\ming\uds-study-tool\uds_learning_tool.html
# 打开模拟器检查 CAN/LIN 面板
start D:\Users\18065\Desktop\ming\uds-study-tool\uds_simulator.html
```

### Final Checklist
- [ ] 学习工具侧栏新增 2 个导航按钮(CAN 总线 / LIN 总线)
- [ ] 点击 CAN 总线标签页显示完整 CAN 知识内容
- [ ] 点击 LIN 总线标签页显示完整 LIN 知识内容
- [ ] 模拟器 CAN 面板可切换帧类型(标准/扩展/CAN FD)
- [ ] 模拟器 CAN 面板可触发错误注入
- [ ] 模拟器 CAN 面板显示总线状态(活跃/被动/bus-off)
- [ ] 模拟器 CAN 面板显示总线负载率
- [ ] 模拟器 LIN 面板可演示主从通信
- [ ] 模拟器 LIN 面板显示帧结构
- [ ] 测验包含 CAN/LIN 题目
- [ ] 所有新增 UI 在深色/浅色主题下均正常
- [ ] README.md 已更新
