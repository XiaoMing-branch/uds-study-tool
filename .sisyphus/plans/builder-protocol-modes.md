# 计划: 消息构造器增加 CAN/LIN 协议模式

## TL;DR

> **快速摘要**: 在 UDS 学习工具的消息构造器(第5标签页)增加协议模式切换功能，支持 UDS / CAN / LIN 三种构造模式。每种模式按对应总线协议进行消息构造，展示帧格式标注，并提供复制 HEX 功能。
>
> **交付物**: 3 个文件修改，共 ~350-450 行新增代码
>
> **预估工作量**: 中等
> **并行执行**: 是 — 2 波并行
> **关键路径**: HTML/CSS 结构 → JS 逻辑

---

## Context

### 原始需求
"uds_learning_tool.html 在消息构造器中，应该要可以切换 LIN 模式和 CAN 模式还有现有的一共三种模式，切换到对应 LIN 或者 CAN 模式时要按照对应的总线协议进行消息构造，然后 id 预留接口输入，例如 LIN 的话可以设定主机和从机的 NAD。"

### 面试总结
**关键讨论**:
- **CAN 帧类型**: 支持标准帧(11-bit ID)和扩展帧(29-bit ID)
- **DLC 策略**: 根据数据字节数自动计算
- **LIN NAD 默认值**: Master=0x01, Slave=0x02，可修改
- **LIN PID 输入**: 自由 HEX 输入(0x00-0x3F)，自动计算奇偶校验位
- **复制功能**: 每个模式提供"复制 HEX"按钮
- **测试**: 无单元测试，Agent-Executed QA 为主

**Q&A 确认**:
- CAN 支持标准 + 扩展帧 ✓
- DLC 自动计算 ✓
- LIN NAD: Master=0x01, Slave=0x02 ✓
- LIN PID: 自由 HEX 输入，自动奇偶校验 ✓
- 添加复制按钮 ✓
- 无需单元测试 ✓

### 当前代码结构
- **HTML**: `uds_learning_tool.html` Lines 102-131 — 构造器 HTML 结构(SID 下拉/子功能/数据/预览)
- **CSS**: `css/learning-tool.css` Lines 159-176 — `.builder-row`, `.byte-display`, `.byte` 样式
- **JS**: `js/learning-tool.js` Lines 773-846 — `initBuilder()`, `updateBuilder()` 函数
- **现有 CAN/LIN 内容**: Lines 965-1175 — `renderCANContent()`, `renderLINContent()` 知识标签页

---

## 工作目标

### 核心目标
在消息构造器中实现三种协议模式的切换与对应消息构建

### 具体交付物
1. 协议模式选择器(分段按钮: UDS / CAN / LIN)
2. UDS 模式: 现有功能不变(SID → 子功能 → 数据 → 预览)
3. CAN 模式: CAN ID(11/29-bit) + 帧类型 + 自动 DLC + 数据 → CAN 帧完整预览
4. LIN 模式: 主/从角色 + NAD(PID) + 数据 + 校验和 → LIN 帧完整预览
5. 三种模式均支持"复制 HEX"剪贴板按钮
6. 帧预览带字段颜色标注(类似现有 CAN/LIN 标签页风格)

### 完成定义
- [ ] 模式切换时 UI 字段正确切换(对应模式字段显示，不相关字段隐藏)
- [ ] CAN 模式: 输入 11-bit/29-bit ID + 数据 → 预览显示完整 CAN 帧(SOF~EOF, 含颜色标注)
- [ ] LIN 模式: 设置 NAD/PID + 数据 → 预览显示完整 LIN 帧(SynchBreak~Checksum)
- [ ] 复制按钮: 点击后帧 HEX 字符串写入系统剪贴板

### 必须包含
- UDS/CAN/LIN 三种模式 → 分段按钮切换
- CAN 帧完整构建(11-bit 和 29-bit 两种格式)
- LIN 帧完整构建(含 PID 奇偶校验和校验和计算)
- "复制 HEX" 功能在所有模式下可用
- 深色/亮色主题支持

### 不包含(防护栏)
- 不修改模拟器(`uds_simulator.html`, `js/simulator.js`, `css/simulator.css`)
- 不修改其他学习工具标签页(CAN 总线/LIN 总线知识页不动)
- 不修改现有 UDS 消息构造逻辑(initBuilder/updateBuilder 保留 UDS 模式用)
- 不引入外部依赖
- 不修改帧日志或模拟器行为

---

## 验证策略

### 测试决策
- **测试基础设施**: 有(.) ??? 实际上学习工具没有测试基础设施
- **自动化测试**: 无单元测试
- **Agent QA**: Playwright浏览器自动化验证

### QA 政策
每个 Task 完成时通过 Playwright 进行浏览器交互验证:
- 模式切换: 点击 UDS/CAN/LIN 按钮 → 验证字段显示/隐藏正确
- CAN 构造: 输入 ID+数据 → 验证帧预览字段颜色标注和内容
- LIN 构造: 设置 NAD/PID+数据 → 验证帧预览含校验和
- 复制功能: 点击复制 → 验证剪贴板内容

---

## 执行策略

### 并行执行波次

```
Wave 1 (Start Immediately — 结构+样式, 2路并行):
├── Task 1: HTML - 模式选择器 + CAN/LIN字段结构
└── Task 2: CSS - 模式选择器 + CAN/LIN 帧预览样式

Wave 2 (After Wave 1 — JS逻辑, 2路并行):
├── Task 3: JS - 模式切换 + CAN 帧构造逻辑
└── Task 4: JS - LIN 帧构造逻辑

Wave FINAL (集成验证):
├── Task F1: 最终手动 QA 验证
└── Task F2: 代码审查 + 主题兼容性检查
```

---

## TODOs

- [ ] 1. HTML — 模式选择器 + CAN/LIN 字段结构

  **做什么**:
  - 在 `#tab-builder` 的 `.msg-builder-container` 内顶部添加模式选择器:
    - 三个分段按钮: `UDS 协议` | `CAN 总线` | `LIN 总线`
    - 按钮用 `data-mode="uds"` / `data-mode="can"` / `data-mode="lin"` 标记
    - 默认选中 UDS 模式
  - **UDS 模式**(默认可见): 保持现有字段:
    - `#builder-sid` 选择器
    - `#builder-subfunc-row` (含子功能选择)
    - `#builder-data` 输入框 (共享)
    - `#builder-request` 请求预览
    - `#builder-response` 响应预览
    - 说明文字
  - **CAN 模式**(初始隐藏, `id="can-fields"`):
    - CAN ID 输入 (`<input id="can-builder-id" type="text" placeholder="如: 7E0">`)
    - ID 格式切换: 11-bit / 29-bit 单选按钮 (`id="can-id-format"`)
    - 帧类型: 数据帧 / 远程帧 单选按钮 (`id="can-frame-type"`)
    - 数据字节输入: 复用 `#builder-data`
    - CAN 帧预览区 (`id="can-builder-preview"`) — 显示完整 CAN 帧各字段
    - 状态信息行: ID(hex+bin), DLC, 帧长度
  - **LIN 模式**(初始隐藏, `id="lin-fields"`):
    - 主/从角色切换: `Master` / `Slave` 单选按钮 (`id="lin-role"`)
    - NAD 输入框: `id="lin-nad"` (默认根据角色: Master=01, Slave=02) — `placeholder="NAD (HEX)"`
    - PID 输入框: `id="lin-pid"` — `placeholder="PID 0x00-0x3F"`
    - 校验和类型: 经典(Classic) / 增强(Enhanced) 单选 (`id="lin-checksum-type"`)
    - 数据字节输入: 复用 `#builder-data`
    - LIN 帧预览区 (`id="lin-builder-preview"`) — 显示完整 LIN 帧各字段
  - **复制按钮**: 三个模式预览区下方各加一个"📋 复制 HEX"按钮 (`class="copy-hex-btn"`)

  **禁止做**:
  - 不要修改模拟器 HTML
  - 不要修改其他标签页(services, explorer, nrc, sessions, quiz, canbus, linbus)
  - 不要引入外部库或依赖

  **推荐 Agent 画像**:
  - **分类**: `unspecified-high`
    - 原因: 3个模式的HTML结构设计，需精确的显示/隐藏逻辑配合
  - **技能**: 无特殊技能需求

  **并行化**:
  - **可以并行**: 是
  - **并行组**: Wave 1 (与 Task 2 并行)
  - **阻塞**: Task 3, Task 4
  - **被阻塞**: 无

  **引用**:
  - `uds_learning_tool.html:102-131` — 当前消息构造器 HTML 结构，作为修改基础
  - `uds_learning_tool.html:152-162` — 现有 CAN/LIN 标签页结构(html 结构参考)
  - `js/learning-tool.js:967-1017` — CAN_CONTENT 数据结构(帧字段命名参考)
  - `js/learning-tool.js:1071-1118` — LIN_CONTENT 数据结构(PID/校验和参考)

  **验收标准**:

  **QA 场景 (任务不可无此)**:
  ```
  场景: 模式切换器 UI 渲染正确
    工具: Playwright
    前置: 打开 uds_learning_tool.html
    步骤:
      1. 点击左侧导航"🧱 消息构造器"
      2. 观察构造器顶部: 应看到 [UDS 协议] [CAN 总线] [LIN 总线] 三个模式按钮
      3. [UDS 协议] 默认高亮选中
      4. 点击 [CAN 总线] → SID/子功能行隐藏, CAN ID/格式/帧类型行显示
      5. 点击 [LIN 总线] → CAN 字段隐藏, 角色/NAD/PID/校验和行显示
      6. 点击 [UDS 协议] → LIN 字段隐藏, SID/子功能行重新显示
    预期结果: 3个模式按钮存在, 点击切换时对应字段显示/隐藏正确
    证据: .sisyphus/evidence/task-1-mode-switch.png

  场景: 默认 UDS 模式功能不受影响
    工具: Playwright
    前置: 打开 uds_learning_tool.html, 进入消息构造器
    步骤:
      1. 确认模式为 UDS (默认)
      2. 选择 SID = "0x22 - ReadDataByIdentifier (RDBI)"
      3. 数据输入 "F1 90"
      4. 确认请求预览显示: 22 F1 90 (SID蓝色, 数据绿色)
    预期结果: 原有 UDS 构造功能完整保留, 字节颜色标注正常
    证据: .sisyphus/evidence/task-1-uds-preserved.png
  ```

  **需要捕获的证据**:
  - [ ] 模式切换交互截图
  - [ ] UDS 模式功能保留截图

  **提交**: 是 (与 Task 2 同组)
  - 信息: `feat(learning-tool): 添加消息构造器 CAN/LIN 模式 HTML 结构`
  - 文件: `uds_learning_tool.html`

---

- [ ] 2. CSS — 模式选择器 + CAN/LIN 帧预览样式

  **做什么**:
  在 `learning-tool.css` 中新增:
  1. **模式选择器样式** (`.protocol-switcher`):
     - 水平分段按钮容器: flex, gap: 0, border-radius: 8px, overflow: hidden
     - 每个按钮: flex:1, padding, border, cursor, transition
     - 激活态: 背景主题色 `var(--primary)`, 白色文字
     - 非激活态: 灰色边框 `var(--border)`, 默认文字
     - 深色主题兼容: 暗色版本
  2. **CAN/LIN 字段容器样式** (`#can-fields`, `#lin-fields`):
     - 初始 `display: none`, 激活时 `display: block`
     - `.builder-row` 延用现有样式
     - ID 格式单选按钮组: inline-flex 排列, 间隙 4px
  3. **CAN 帧预览样式** (`#can-builder-preview`):
     - CAN 帧各字段颜色标注: `.can-sof`(红), `.can-arb`(蓝), `.can-ctrl`(黄), `.can-data`(绿), `.can-crc`(紫), `.can-ack`(粉), `.can-eof`(灰)
     - 每个字段显示名称和值
     - 位填充可视化(可选): 每5个同极性位显示填充位
     - 深色主题覆盖
  4. **LIN 帧预览样式** (`#lin-builder-preview`):
     - LIN 帧各字段: `.lin-sync-break`(红), `.lin-sync-byte`(蓝), `.lin-pid`(橙), `.lin-data`(绿), `.lin-checksum`(紫)
     - 每个字段显示名称和值
     - PID 下方标注奇偶校验位 P0, P1
     - 深色主题覆盖
  5. **复制按钮样式** (`.copy-hex-btn`):
     - 内联按钮, hover 效果
     - 复制成功后闪烁提示"已复制!"

  **禁止做**:
  - 不要修改模拟器 CSS
  - 不要修改非构造器相关的学习工具 CSS(服务卡片、测验等)

  **推荐 Agent 画像**:
  - **分类**: `visual-engineering`
    - 原因: UI 样式设计, 深色主题, 帧颜色配色
  - **技能**: 无特殊技能需求

  **并行化**:
  - **可以并行**: 是
  - **并行组**: Wave 1 (与 Task 1 并行)
  - **阻塞**: 无
  - **被阻塞**: Task 1 (需要知道 HTML class/id 命名)

  **引用**:
  - `css/learning-tool.css:159-176` — 现有消息构造器样式
  - `css/learning-tool.css:437-517` — 现有 CAN/LIN 总线标签页的 `.frame-byte` / `.comparison-table` / `.state-machine` / `.error-tag` 样式(颜色、布局参考)
  - `css/learning-tool.css:5-15` — 深色/亮色主题变量定义

  **验收标准**:

  **QA 场景**:
  ```
  场景: 模式选择器样式正确
    工具: Playwright
    前置: 学习工具打开, 进入消息构造器
    步骤:
      1. 检查模式按钮宽度撑满容器, 等宽排列
      2. [UDS 协议] 按钮应有蓝色/主题色背景, 白色文字
      3. [CAN 总线] [LIN 总线] 按钮应有灰色边框, 默认文字
      4. 点击 [CAN 总线] → 按钮变为蓝色/主题色高亮
      5. 切换深色主题 → 按钮样式适配暗色背景
    预期结果: 按钮视觉一致, 主题切换后颜色变化正确
    证据: .sisyphus/evidence/task-2-switcher-style.png

  场景: 帧预览颜色标注
    工具: Playwright
    前置: 学习工具打开, 进入消息构造器
    步骤:
      1. 切换到 CAN 模式, 输入 ID=7E0, 数据="01 02 03"
      2. 观察帧预览: SOF(红) → 仲裁场(蓝) → 控制场(黄) → 数据(绿) → CRC(紫) → ACK(粉) → EOF(灰)
      3. 切换到 LIN 模式, 输入 NAD=01, PID=10
      4. 观察 LIN 帧预览: SynchBreak(红) → 0x55(蓝) → PID(橙) → 数据(绿) → 校验和(紫)
    预期结果: 每个字段使用对应的颜色标注, 易于区分
    证据: .sisyphus/evidence/task-2-can-preview-color.png
    ```

  **需要捕获的证据**:
  - [ ] 模式选择器亮色/深色截图
  - [ ] CAN 帧预览颜色截图
  - [ ] LIN 帧预览颜色截图

  **提交**: 是 (与 Task 1 同组)
  - 信息: `feat(learning-tool): 添加消息构造器 CAN/LIN 模式 HTML 结构`
  - 文件: `css/learning-tool.css`

---

- [ ] 3. JS — 模式切换管理 + CAN 帧构造逻辑

  **做什么**:
  在 `js/learning-tool.js` 中新增:
  1. **模式状态管理**:
     - 添加全局状态变量 `let _builderMode = 'uds';` (可选值: 'uds', 'can', 'lin')
     - 在 `initBuilder()` 中初始化模式选择器事件绑定:
       - 获取所有 `.protocol-switcher-btn`
       - 点击时: 更新 `_builderMode`, 切换字段显示(`#can-fields`, `#lin-fields`, `#builder-subfunc-row` 等), 切换预览区
       - 重新调用 `updateBuilderByMode()`
     - 新增 `updateBuilderByMode()` 函数(类似 `updateBuilder()` 的分派器)
       - 根据 `_builderMode` 调用 `updateBuilderUDS()`, `updateBuilderCAN()`, 或 `updateBuilderLIN()`
       - 监听 `#builder-data` 的 `oninput` (已有) + `#can-builder-id` 等新字段的 `oninput`
  2. **UDS 模式**(保留现有):
     - 将现有 `updateBuilder()` 逻辑重命名为 `updateBuilderUDS()`
     - 或在 `updateBuilder()` 内判断模式(推荐: 保持 `updateBuilder` 作为 `oninput` 调用, 内部 dispatch)
     - 实际上最简单: 保持现有关联 `oninput="updateBuilder()"`, 在 `updateBuilder()` 顶部检查 `_builderMode`, 非 UDS 时 return 或 dispatch
     - 保持现有 `initBuilder() / updateBuilder()` 在 UDS 模式下的完整功能
  3. **CAN 帧构造** — `updateBuilderCAN()` 函数:
     - 读取 `#can-builder-id` 的 HEX 值, 解析为数字
     - 读取 ID 格式: 11-bit 或 29-bit
     - 读取帧类型: 数据帧(RTR=0) 或 远程帧(RTR=1)
     - 从 `#builder-data` 解析数据字节(与 UDS 共享)
     - 自动计算 DLC: 数据字节数(0-8), 超过 8 时显示警告
     - **构建 CAN 帧各字段 (位编码)**:
       - **标准帧 (11-bit ID)**:
         - SOF: 1 bit (显性=0)
         - 仲裁: 11-bit ID + RTR(1 bit)
         - 控制: IDE(1=0) + r0(1=0) + DLC(4 bit)
         - 数据: N bytes
         - CRC: 15-bit CRC + 1 bit 分隔符(简化: 使用占位符, 不做真实 CRC 计算)
         - ACK: 1 bit ACK + 1 bit 分隔符(简化: ACK 显示为占位)
         - EOF: 7 bit (隐性=1)
       - **扩展帧 (29-bit ID)**:
         - SOF: 1 bit (显性=0)
         - 仲裁: 29-bit ID + SRR(1=1) + IDE(1=1) + RTR(1 bit)
         - 控制: r1(1=0) + r0(1=0) + DLC(4 bit)
         - 其余同上
     - **预览渲染**: 
       - 在 `#can-builder-preview` 中渲染带颜色标注的 CAN 帧字段:
         - 每个字段显示名称和二进制值
         - 用颜色框展示(SOF红色, 仲裁场蓝色, 控制场黄色, 数据场绿色, CRC紫色, ACK粉色, EOF灰色)
       - 下方显示:
         - `CAN ID: 0x{N} ({N} bit)`
         - `帧类型: 数据帧 / 远程帧`
         - `DLC: {N}`
         - `总长度: {N} 字节`
         - `原始 HEX: {hex string}`
  4. **复制功能** (CAN 部分):
     - 预览区下方的 `.copy-hex-btn` 点击事件
     - 从预览区提取原始 HEX 字符串
     - 使用 `navigator.clipboard.writeText()` 复制
     - 按钮文字短暂变为"✅ 已复制!"
  5. **数据联动**:
     - `#builder-data` 变化时触发 CAN/LIN 模式下的重新构造
     - `#can-builder-id`, `#can-id-format`, `#can-frame-type` 变化时触发重建

  **禁止做**:
  - 不要修改/删除现有 `initBuilder()`, `updateBuilder()` (重构 UDS 逻辑时在 dispatch 中调用)
  - 不要实现真实 CRC 计算 — 使用占位符标记(因为数据链路层 CRC 不影响教学目的)
  - 不要修改模拟器 JS

  **推荐 Agent 画像**:
  - **分类**: `unspecified-high`
    - 原因: 涉及位编码、帧结构算法和 UI 交互的复杂逻辑
  - **技能**: 无特殊技能需求

  **并行化**:
  - **可以并行**: 否 (需要 HTML/CSS 结构就绪)
  - **并行组**: Wave 2 (与 Task 4 并行)
  - **阻塞**: 无(但不能在 Task 1/2 完成前执行)
  - **被阻塞**: Task 1, Task 2

  **引用**:
  - `js/learning-tool.js:773-846` — `initBuilder()` 和 `updateBuilder()` 作为模式分派的入口
  - `js/learning-tool.js:965-1067` — CAN_CONTENT 数据结构和 renderCANContent (帧字段命名参考)
  - ISO 11898 CAN 帧格式:
    - 标准帧: SOF(1) + ID(11) + RTR(1) + IDE(1) + r0(1) + DLC(4) + Data(0-64) + CRC(16) + ACK(2) + EOF(7) = 最小47 bit
    - 扩展帧: SOF(1) + ID(29) + SRR(1) + IDE(1) + RTR(1) + r1(1) + r0(1) + DLC(4) + Data + CRC(16) + ACK(2) + EOF(7) = 最小64 bit

  **验收标准**:

  **QA 场景**:
  ```
  场景: CAN 标准帧 11-bit 构造
    工具: Playwright
    前置: 打开学习工具, 进入消息构造器, 切换到 CAN 模式
    步骤:
      1. 确认 ID 格式选择为 "11-bit"
      2. 帧类型选择 "数据帧"
      3. 输入 CAN ID = "7E0"
      4. 数据输入 "01 02 03"
      5. 观察预览区:
         - SOF: 显示 1 bit, 标注[SOF]
         - 仲裁场: 显示 11-bit ID(7E0=11111100000) + RTR(0)
         - 控制场: IDE(0) + r0(0) + DLC(3)
         - 数据场: 显示 01 02 03
         - CRC/ACK/EOF: 显示占位标注
         - 下方信息: CAN ID 0x7E0, 数据帧, DLC=3
      6. 点击"复制 HEX"
    预期结果: 预览准确展示标准 CAN 帧各字段, 颜色正确
    证据: .sisyphus/evidence/task-3-can-std-frame.png

  场景: CAN 扩展帧 29-bit 构造
    工具: Playwright
    前置: 同上一场景
    步骤:
      1. 切换 ID 格式为 "29-bit"
      2. 输入 CAN ID = "18DAF1"
      3. 数据输入 "AA"
      4. 观察预览区:
         - 仲裁场: 29-bit ID + SRR + IDE + RTR
         - 控制场: r1 + r0 + DLC
      5. 切换帧类型为"远程帧", 观察 RTR=1
    预期结果: 扩展帧仲裁场和控制场格式正确
    证据: .sisyphus/evidence/task-3-can-ext-frame.png

  场景: 复制 HEX 功能
    工具: Playwright
    前置: 同上, 已构造好 CAN 帧
    步骤:
      1. 帧预览下方应有"📋 复制 HEX"按钮
      2. 点击按钮
      3. 验证剪贴板内容包含完整的 CAN 帧表示
    预期结果: 复制成功, 按钮文字短暂变为"✅ 已复制!"
    证据: .sisyphus/evidence/task-3-copy-btn.png
  ```

  **需要捕获的证据**:
  - [ ] 标准帧预览截图
  - [ ] 扩展帧预览截图
  - [ ] 复制按钮交互截图

  **提交**: 是
  - 信息: `feat(learning-tool): 实现 CAN 帧构造器和模式切换逻辑`
  - 文件: `js/learning-tool.js`

---

- [ ] 4. JS — LIN 帧构造逻辑

  **做什么**:
  在 `js/learning-tool.js` 中新增 `updateBuilderLIN()` 函数:

  1. **读取输入**:
     - 角色: Master 或 Slave (从 `#lin-role` radio 获取)
     - NAD: 从 `#lin-nad` 读取 (hex), 默认 Master=0x01, Slave=0x02
     - PID: 从 `#lin-pid` 读取 (0x00-0x3F), 校验范围
     - 校验和类型: 经典(Classic) 或 增强(Enhanced) (从 `#lin-checksum-type` radio)
     - 数据字节: 从共享的 `#builder-data` 读取
  2. **PID 奇偶校验计算** (LIN 协议规范):
     ```
     PID[7:0] = {P1, P0, ID5, ID4, ID3, ID2, ID1, ID0}
     P0 = ID0 ⊕ ID1 ⊕ ID2 ⊕ ID4
     P1 = !(ID1 ⊕ ID3 ⊕ ID4 ⊕ ID5)
     ```
  3. **校验和计算**:
     - **经典校验和 (LIN 1.x)**: 仅数据字节求和, 取反+1 (即: 和 mod 256 后取反)
     - **增强校验和 (LIN 2.0)**: PID(不含奇偶位) + 数据字节求和, 取反+1
  4. **构建 LIN 帧各字段**:
     - **SynchBreak**: 至少 13 位显性位 + 1 位隐性(分隔符), 文字标注
     - **SynchByte**: 固定 0x55
     - **PID**: 显示 8 bit 含奇偶校验, 标注 P0/P1 值
     - **数据场**: N 字节数据
     - **校验和**: 1 字节, 显示计算值和算法说明
  5. **预览渲染** (`#lin-builder-preview`):
     - 仿 Task 2 定义的 CSS 类渲染各字段
     - 每个字段显示名称和值(HEX + binary 可选)
     - PID 下方标注: `P0={0/1}, P1={0/1}`, `原始 ID={value}`
     - 校验和显示: `计算值: 0x{N}`, 算法说明
     - 下方信息行: `角色: Master/Slave`, `NAD: 0x{N}`, `帧类型: LIN {N} byte(s)`
  6. **复制功能** (LIN 部分):
     - 预览区下方的 `.copy-hex-btn` 点击事件
     - 复制 SynchBreak + 0x55 + PID + Data + Checksum 的 HEX 字符串
     - 使用 `navigator.clipboard.writeText()` + "✅ 已复制!" 反馈
  7. **角色切换联动**:
     - 角色切换时自动更新 NAD 默认值: Master→0x01, Slave→0x02 (用户可手动覆盖)
     - NAD 输入变化时自动重新构建

  **禁止做**:
  - 不要实现校验和溢出大于 255 时的复杂处理(1-byte 求和足够)
  - 不要修改模拟器 LIN 引擎
  - 不要修改现有 LIN 知识标签页内容

  **推荐 Agent 画像**:
  - **分类**: `unspecified-high`
    - 原因: 涉及校验和算法、奇偶校验、帧构建
  - **技能**: 无特殊技能需求

  **并行化**:
  - **可以并行**: 否 (需要 HTML/CSS 结构就绪)
  - **并行组**: Wave 2 (与 Task 3 并行)
  - **阻塞**: 无
  - **被阻塞**: Task 1, Task 2

  **引用**:
  - `js/learning-tool.js:1071-1118` — LIN_CONTENT 数据结构(PID/校验和概念参考)
  - `js/simulator.js` (LIN 引擎参考) — `calculateLINParity()` / `calculateLINChecksum()` 函数实现参考:
    - `calculateLINParity`: 搜索 simulator.js 中该函数
    - `calculateLINChecksum`: 搜索 simulator.js 中该函数
  - ISO 17987 LIN 协议:
    - PID 格式: bit 0-5 = ID, bit 6 = P0, bit 7 = P1
    - 校验和: Classic(数据字节), Enhanced(PID低6位+数据字节)
    - SynchBreak: 13+ bit 显性 + 1 bit 隐性分隔符

  **验收标准**:

  **QA 场景**:
  ```
  场景: LIN Master 模式帧构造
    工具: Playwright
    前置: 打开学习工具, 进入消息构造器, 切换到 LIN 模式
    步骤:
      1. 确认角色 = "Master"
      2. NAD 自动填入 "01"
      3. 输入 PID = "10"
      4. 校验和类型 = "增强(Enhanced)"
      5. 数据输入 "01 02 03"
      6. 观察预览区:
         - SynchBreak: 13+ bit 显性标注
         - SynchByte: 0x55
         - PID: 显示 8 bit (含 P0/P1 标注)
         - 数据: 01 02 03
         - 校验和: 显示计算值 0x{N}
         - 信息: "角色: Master, NAD: 0x01, LIN 3 byte(s)"
      7. 点击"复制 HEX"
    预期结果: LIN 帧各字段完整显示, PID 奇偶校验正确, 校验和计算正确
    证据: .sisyphus/evidence/task-4-lin-master-frame.png

  场景: LIN Slave 模式 + 经典校验和
    工具: Playwright
    前置: 同上
    步骤:
      1. 角色切换到 "Slave"
      2. NAD 自动变为 "02"
      3. 输入 PID = "11"
      4. 校验和类型 = "经典(Classic)"
      5. 数据输入 "A5"
      6. 观察校验和: 仅数据字节求和取反(0xA5 → 0xFF-0xA5=0x5A)
      7. 切换回 "增强(Enhanced)" → 校验和重新计算(含 PID)
    预期结果: 角色切换时 NAD 默认值联动, 校验和算法切换正确
    证据: .sisyphus/evidence/task-4-lin-slave-frame.png

  场景: LIN PID 奇偶校验验证
    工具: Playwright
    前置: 同上
    步骤:
      1. 输入 PID = "10" (二进制 010000)
      2. 奇偶校验结果:
         P0 = 0⊕0⊕0⊕0 = 0
         P1 = !(0⊕0⊕0⊕1) = !(1) = 0
         PID with parity = 00 010000 = 0x10
      3. PID 显示应有 "P0=0, P1=0" 标注
      4. 输入 PID = "15" (二进制 010101)
         P0 = 0⊕0⊕0⊕0 = 0
         P1 = !(0⊕0⊕1⊕1) = !(0) = 1
         PID with parity = 10 010101 = 0x95
    预期结果: PID 奇偶校验位与 LIN 协议规范一致
    证据: .sisyphus/evidence/task-4-lin-parity.png
  ```

  **需要捕获的证据**:
  - [ ] Master 帧预览截图
  - [ ] Slave 帧 + 经典校验和截图
  - [ ] PID 奇偶校验标注截图

  **提交**: 是
  - 信息: `feat(learning-tool): 实现 LIN 帧构造器(含奇偶校验+校验和)`
  - 文件: `js/learning-tool.js`

---

> 所有 Task 完成后，运行最终验证

- [ ] F1. **手动 QA 验证** — `unspecified-high` (+ playwright 技能)
  在每个模式下构造消息:
  - UDS: 选择 0x22 + DID F1 90 → 预览正确 → 复制
  - CAN 11-bit: ID=0x7E0, 数据 01 02 → 预览 CAN 帧 → 复制
  - CAN 29-bit: ID=0x18DAF1, 数据 03 → 预览扩展帧 → 复制
  - LIN Master: NAD=0x01, PID=0x10, 数据 01 02 03 → 预览 LIN 帧 → 复制
  - LIN Slave: NAD=0x02, PID=0x11 → 预览 → 复制
  验证深色/亮色主题切换后样式正确
  输出: `场景 [5/N pass] | 复制 [5/N] | 主题 [PASS] | VERDICT`

- [ ] F2. **代码审查** — `unspecified-high`
  - 检查未使用的 HTML ID 或 JS 变量
  - 检查深色主题 CSS 覆盖
  - 检查现有 UDS builder 函数未被修改
  - 检查 LIN 奇偶校验算法正确性
  - 检查 CAN 帧字段编码正确性(SOF=0, EOF=7 recessive bits)
  - 输出: `代码质量 [PASS/FAIL] | 合规 [PASS/FAIL] | VERDICT`

---

## 提交策略

- **Task 1+2**: `feat(learning-tool): 添加 CAN/LIN 消息构造器 HTML/CSS 结构`
- **Task 3**: `feat(learning-tool): 实现 CAN 帧构造器和模式切换逻辑`
- **Task 4**: `feat(learning-tool): 实现 LIN 帧构造器(含奇偶校验+校验和)`
- **F1+F2 修复**: `fix(learning-tool): 修复最终验证发现的问题`

---

## 成功标准

### 验证命令
```bash
# 无构建步骤 - 直接浏览器打开 uds_learning_tool.html 验证
# 切换到 🧱 消息构造器 标签页
# 验证模式选择器可见
# 切到 CAN → 输入 ID + 数据 → 预览显示 CAN 帧
# 切到 LIN → 输入 NAD/PID + 数据 → 预览显示 LIN 帧
# 点击"复制 HEX" → 粘贴到模拟器 → 正确
```
