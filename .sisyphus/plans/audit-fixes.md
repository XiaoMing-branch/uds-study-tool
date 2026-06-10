# UDS Study Tool 审计修正工作计划

## TL;DR

> **快速总结**: 基于已完成的全量四维度审计报告（36 项问题），组织 6 个并行 Wave 系统地修复全部问题，从 P0 紧急 Bug 到 P2 代码清理，每 Wave 独立可验证。
>
> **交付物**:
> - 修复 simulator.js 中 2 个 P0 严重 Bug（F19A 温度值 / handleClearDTC 限制）
> - 修复 ISO 14229-1 合规性问题（0x29 子功能 / session 规则 / 缺少子功能）
> - 更新文档（AI-HANDOVER.md / CODE-REVIEW-*.md）
> - 清理冗余代码和样式问题（重复事件绑定 / var 混合 / CSS 重复等）
> - 全量回归验证通过
>
> **预计工作量**: Medium (~6-8 小时)
> **并行执行**: YES — 6 个 Wave，每 Wave 2-8 个并行任务
> **关键路径**: Wave 0 → Wave 1 → Wave 2 → Wave 3 → Wave 4 → Wave FINAL

---

## Context

### 原始请求

用户请求对 UDS Study Tool 项目进行全面审计并生成修正工作计划。

### 访谈总结

**关键讨论**:
- 审计报告已交付，共 36 项发现（5 严重 / 23 中等 / 8 轻微）
- 用户确认需要修正工作计划（"要"）
- 用户要求不自动提交 commit（"后续不要再每次都帮我提交了"）

**Metis 审查发现**（已纳入计划）:
- **需要 Pre-Wave 0**: 备份文件、HTML 预扫描、行号确认
- **需要每 Wave 退出条件**: 每个 Wave 完成后独立验证，防止回归累积
- **需要明确的范围护栏**: 禁止"顺手修复"超出审计范围的问题
- **需要决策门**: `"use strict"` 添加需要用户决策，因其对 3000+ 行文件的回归风险
- **需要依赖检查**: P2 清理项是否与 P0/P1 修复重叠需要确认

**研究结论**:
- 项目两个 JS 文件（simulator.js ~3496 行，learning-tool.js ~1435 行），无测试套件
- 无 ESLint 配置，无 `"use strict"`
- simulator.js 有 eval()（OBD2 部分，标记为只读不修改）
- 服务定义在 simulator.js（SID_INFO）和 learning-tool.js（SERVICES）间有重复

---

## Work Objectives

### 核心目标

系统性地修复审计发现的全部 36 项问题，按严重性分 Wave 执行，确保修复可验证、可回滚。

### 具体交付物

- simulator.js 修复：温度值 / handleClearDTC / 0x29 子功能 / DID 提示 / CAN 绑定 / var 统一 / HEX 反馈 / 死代码 / 注释 / 安全检查
- learning-tool.js 修复：0x10 子功能 0x04 / 0x29 子功能 0x00 / defaultSession 服务 / SESSION_RULES
- simulator.css 修复：重复 `.can-error-frame` 选择器
- 文档更新：AI-HANDOVER.md、CODE-REVIEW-FINDINGS.md、CODE-REVIEW-REPORT.md

### 完成定义

- [ ] 所有 P0 修复验证通过（无控制台错误，功能正确）
- [ ] 所有 P1 ISO 合规修复验证通过
- [ ] 所有文档更新正确渲染
- [ ] 所有 P2 清理项确认完成
- [ ] 全量回归测试通过（核心功能完整）

### Must Have

- P0 Bug 必须优先修复（F19A 温度值 / handleClearDTC）
- ISO 14229-1 合规性问题必须修正
- 每次修改前必须备份原始文件
- 每 Wave 完成后必须做回归验证
- 每个 Task 必须有可执行的 QA 场景

### Must NOT Have（护栏）

- **不修改现有标签页内容** — 审计范围外的 UI 不做改动
- **不修改核心 processRequest/handleService ECU 逻辑**
- **不拆分两份 HTML 的绑定关系**
- **不引入外部依赖 / 运行时**
- **不做"顺手修复"** — 超出审计 36 项范围的修改需用户批准
- **不重构文件结构** — 不拆分 simulator.js 或 learning-tool.js
- **不添加测试框架** — 测试策略是独立任务
- **不修改 OBD2 eval()** — 标记为只读观察项
- **不改动与审计无关的 CSS/HTML**

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — 所有验证由 Agent 执行。不接受需要"用户手动测试/确认"的验收标准。

### 测试决策
- **基础设施**: 无（无测试框架 / 无 ESLint）
- **自动化测试**: NO（不引入测试框架，验证通过 Agent 执行 QA 场景）
- **验证方法**: 浏览器加载 + DevTools 控制台 + DOM 检查 + 截图证据

### QA 政策
每个 Task 必须包含 Agent 可执行的 QA 场景：
- **所有 UI 功能**: 使用 `@playwright` skill — 打开 HTML，交互，断言 DOM，截图
- **控制台检查**: 加载后检查 DevTools 无错误
- **Toast 验证**: 检查指定文本是否出现在 DOM 中
- **证据保存至**: `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`

### 每 Wave 验证原则
- Wave 完成后必须执行退出验证，通过后才能进入下一 Wave
- 证据文件必须经过检查确认存在

---

## Execution Strategy

### 并行执行 Wave

```
Wave 0 (Pre-work — 顺序执行，仅 1 个任务):
└── T1: 备份文件 + HTML 扫描 + 行号确认

Wave 1 (P0 紧急 Bug 修复 — 2 个任务完全并行，无依赖):
├── T2: 修复 F19A 温度值 (simulator.js:76)
└── T3: 修复 handleClearDTC 限制 (simulator.js:902)

Wave 2 (P1 ISO 合规/服务修复 — 5 个任务完全并行):
├── T4: 修复 0x29 认证子功能值 (simulator.js:319-321)
├── T5: learning-tool.js 0x10 追加子功能 0x04
├── T6: learning-tool.js 0x29 追加 0x00 + defaultSession 追加 0x23/0x87
├── T7: 修正 learning-tool.js SESSION_RULES
└── T8: 修复 DID 保存 Toast 消息 (simulator.js:1355)

Wave 3 (P1 文档更新 — 2 个任务完全并行):
├── T9: 更新 AI-HANDOVER.md
└── T10: 清理 CODE-REVIEW-*.md 测验引用

Wave 4 (P2 代码清理 — 8+1 个任务，最大并行):
├── T11: 删除重复 CAN 初始化事件绑定
├── T12: 统一 var→let/const (CAN/LIN/DoIP)
├── T13: 修复 CSS 重复选择器
├── T14: HEX 输入静默丢弃添加反馈
├── T15: 清理 dtcStatus 死代码
├── T16: 修复 F194 注释矛盾 + 清理 F19A 注释
├── T17: 移除 handleDSC suppressResponse 冗余检查
├── T18: 修复 SecurityAccess 尝试计数逻辑
└── T19: [决策门] 添加 "use strict"（默认跳过，需用户确认）

Wave FINAL (全量回归验证 — 4 个 Review Agent 并行):
├── F1: Plan Compliance Audit (oracle)
├── F2: Code Quality Review (unspecified-high)
├── F3: Real Manual QA (unspecified-high + playwright)
└── F4: Scope Fidelity Check (deep)
→ 汇总结果 → 获取用户明确确认
```

### 依赖矩阵

- **T1**（Wave 0）: - → 阻塞 T2-19（Pre-work 是前置条件）
- **T2-T8**（Wave 1-2）: T1 → 并行执行
- **T9-T10**（Wave 3）: T1 → 并行执行
- **T11-T19**（Wave 4）: T1 → 全部并行执行
- **F1-F4**（Wave FINAL）: T1-T19 → 4 路并行

> 注：P2 清理任务（T11-T19）与 P0/P1（T2-T8）在不同 code 区域，无合并冲突风险。Wave 4 全部与 Wave 1-3 并行安全。

### Agent 调度摘要

- **Wave 0**: 1 个任务 — `quick`
- **Wave 1**: 2 个任务 — `quick`
- **Wave 2**: 5 个任务 — `quick`（T4-T8 均为简单值/字符串修改）
- **Wave 3**: 2 个任务 — `writing`
- **Wave 4**: 9 个任务 — 混合（`quick` / `unspecified-high`）
- **Wave FINAL**: 4 个任务 — `oracle` / `unspecified-high` / `deep` + `playwright` skill

---

## TODOs

- [ ] 1. **Pre-Work：备份 + HTML 扫描 + 行号确认**

  **做什么**：
  - 创建 `_backup/YYYYMMDD_HHMMSS/` 目录
  - 复制以下文件到备份目录：`simulator.js`、`learning-tool.js`、`simulator.css`、`AI-HANDOVER.md`、`CODE-REVIEW-FINDINGS.md`、`CODE-REVIEW-REPORT.md`、`index.html`（如果存在）
  - 使用 `grep` 快速扫描 HTML 文件中是否有明显问题（硬编码值、内联事件处理器、可访问性问题）
  - 确认审计报告中的行号是否仍然准确：
    - simulator.js:76, 319-321, 902, 1355, 3113-3119, 3225-3233
    - simulator.css:540, 542
  - 差异记录到 `.sisyphus/evidence/pre-work-line-check.txt`
  - 备份完成后打印备份路径

  **不能做**：
  - 不修改任何文件

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 纯文件操作和 grep 扫描，不需要特殊技能

  **并行化**：
  - **可并行**: NO（单任务，顺序执行）
  - **Wave**: Wave 0
  - **阻塞**: T2-T19
  - **被阻塞于**: None

  **引用**：
  - `simulator.js` — 行号待确认
  - `learning-tool.js` — 行号待确认
  - `simulator.css` — 行号待确认
  - `*.md` — 文档待备份

  **验收标准**：

  **QA 场景**:
  ```
  场景: 备份文件存在
    工具: Bash
    前置条件: 无
    步骤:
      1. Test-Path "_backup/2026*" → 确认备份目录存在
      2. Get-ChildItem "_backup/2026*" | Select-Object -ExpandProperty FullName → 列出备份文件
    预期结果: 备份目录存在，至少包含 simulator.js、learning-tool.js、simulator.css 三个文件
    证据: .sisyphus/evidence/task-1-backup-exists.txt

  场景: 行号检查结果
    工具: Bash
    前置条件: 备份已完成
    步骤:
      1. Read `.sisyphus/evidence/pre-work-line-check.txt`
    预期结果: 文件存在，显示所有目标行号的内容摘要，确认无偏移
    证据: .sisyphus/evidence/task-1-line-check.txt
  ```

  **提交**: NO（非代码修改）

---

- [ ] 2. **修复 F19A 温度值**

  **做什么**：
  - 在 `simulator.js` 第 76 行附近，F19A DID 的温度值从 `[0x00, 0x84]` 更改为 `[0x00, 0x15]`
  - `0x0015` = 21°C，符合常温范围，这是审计发现 P0-1（严重 Bug）
  - 修改后用 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不修改其他 DID 的值
  - 不修改 F19A 的其他属性（DID ID、描述等）
  - 不做"顺手优化"

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 单行值修改，无需特殊技能

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 1（与 T3 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js:76` — 目标行，F19A DID 定义
  - 审计发现 P0-1

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: F19A 温度值已修正
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "F19A" -Path "js/simulator.js" -Context 2,2
    预期结果: F19A 定义行的 value 为 [0x00, 0x15]，而非 [0x00, 0x84]
    证据: .sisyphus/evidence/task-2-f19a-value.txt

  场景: 语法正确
    工具: Bash
    前置条件: 修改完成
    步骤:
      1. node --check js/simulator.js
    预期结果: 退出码 0，无错误输出
    证据: .sisyphus/evidence/task-2-syntax-check.txt
  ```

  **提交**: 建议 `fix(simulator): 修复 F19A DID 温度值为 0x0015`
  - 文件: `js/simulator.js`

---

- [ ] 3. **修复 handleClearDTC 被 dtcSetting 错误阻塞**

  **做什么**：
  - 在 `simulator.js` 第 902 行附近，`handleClearDTC` 方法中移除对 `dtcSetting` 的检查
  - 当前逻辑：`if (!dtcSetting) return` 当 dtcSetting 为 false 时错误地阻止了 ClearDiagnosticInformation
  - 修正：ClearDiagnosticInformation (0x14) 应当独立于 dtcSetting 开关；dtcSetting 只控制 DTC 模拟生成，不应阻止清除操作
  - 修改后 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不修改其他 UDS 服务的处理逻辑
  - 不修改 dtcSetting 在其他地方的使用

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 小范围逻辑修正，1-3 行代码

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 1（与 T2 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js:902` — 目标行，handleClearDTC 方法
  - 审计发现 P0-2

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: dtcSetting=false 时 ClearDTC 可执行
    工具: Bash + Playwright
    前置条件: 加载 index.html，dtcSetting 关闭
    步骤:
      1. page.evaluate 检查 dtcSetting 状态（应为 false）
      2. 通过 UI 发送 ClearDiagnosticInformation 请求
      3. 检查响应页面中是否显示肯定应答
    预期结果: ClearDiagnosticInformation 成功执行，即使 dtcSetting 为 false
    证据: .sisyphus/evidence/task-3-cleardt-works.txt

  场景: 语法正确
    工具: Bash
    前置条件: 修改完成
    步骤:
      1. node --check js/simulator.js
    预期结果: 退出码 0
    证据: .sisyphus/evidence/task-3-syntax-check.txt
  ```

  **提交**: 建议 `fix(simulator): 修复 handleClearDTC 被 dtcSetting 错误阻塞`
  - 文件: `js/simulator.js`

---

- [ ] 4. **修复 0x29 认证子功能值（ISO 14229-1 合规）**

  **做什么**：
  - 在 `simulator.js` 第 319-321 行附近，修正 Authentication (0x29) 服务的子功能值
  - 当前使用自定义值，需要改为 ISO 14229-1 标准值：
    - 0x00: authenticationConfiguration（认证配置）
    - 0x01: sendCertificate（发送证书）
    - 0x02: sendSignature（发送签名）
    - 0x03: sendAuthenticationToken（发送认证令牌）
    - 0x04: verifyCertificate（验证证书）
    - 0x05: verifySignature（验证签名）
    - 0x06: verifyAuthenticationToken（验证认证令牌）
    - 0x07: authenticationComplete（认证完成）
  - 这是审计发现 P1-1
  - 修改后 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不修改 0x29 在其他文件中的相关定义
  - 不修改其他服务的子功能值
  - 不修改 0x29 的处理逻辑（handleAuthentication），若有不符 ISO 标准的行为也只标记不修改

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 数据值修改，参考 ISO 14229-1 标准值替换

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 2（与 T5-T8 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js:319-321` — 目标行，0x29 子功能定义
  - 审计发现 P1-1
  - ISO 14229-1 §7.4 — 0x29 Authentication service 子功能定义

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: 0x29 子功能值正确
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "0x29" -Path "js/simulator.js" -Context 5,5
      2. 检查 subfunctions 列表中的值
    预期结果: 0x29 子功能值为 ISO 标准值：0x00-0x07，而非自定义值
    证据: .sisyphus/evidence/task-4-0x29-subfunctions.txt
  ```

  **提交**: 建议 `fix(simulator): 修复 0x29 认证子功能值符合 ISO 14229-1`
  - 文件: `js/simulator.js`

---

- [ ] 5. **learning-tool.js 0x10 追加子功能 0x04（SafetySystemDiagnosticSession）**

  **做什么**：
  - 在 `learning-tool.js` 中，0x10（DiagnosticSessionControl）服务的子功能列表追加 `0x04: "SafetySystemDiagnosticSession"`（安全系统诊断会话）
  - 这是审计发现 P1-2
  - 修改后 `node --check js/learning-tool.js` 确认语法正确

  **不能做**：
  - 不修改其他服务的定义
  - 不修改 0x10 的处理逻辑

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 单条数据追加

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 2（与 T4/T6-T8 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `learning-tool.js` — 搜索 "0x10" 或 "DiagnosticSessionControl" 找到子功能列表
  - 审计发现 P1-2
  - ISO 14229-1 §7.2 — 0x10 服务 0x04 子功能

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: 0x10 子功能 0x04 已添加
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "0x10" -Path "js/learning-tool.js" -Context 5,10
      2. 检查子功能列表是否包含 0x04
    预期结果: 0x10 子功能列表包含 0x04: "SafetySystemDiagnosticSession"
    证据: .sisyphus/evidence/task-5-0x10-0x04.txt
  ```

  **提交**: 建议 `fix(learning-tool): 0x10 补充子功能 0x04`
  - 文件: `js/learning-tool.js`

---

- [ ] 6. **learning-tool.js 0x29 追加子功能 0x00 + defaultSession 追加服务 0x23/0x87**

  **做什么**：
  - 在 `learning-tool.js` 中，`Authentication (0x29)` 服务的子功能列表追加 `0x00: "authenticationConfiguration"`（认证配置）
  - 在 `defaultSession` 支持的服务列表中追加 `0x23`（ReadMemoryByAddress）和 `0x87`（LinkControl）（如果缺失）
  - 这是审计发现 P1-3
  - 修改后 `node --check js/learning-tool.js` 确认语法正确

  **不能做**：
  - 不修改其他服务的子功能定义
  - 不修改其他会话的服务列表

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 数据追加，简单修改

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 2（与 T4/T5/T7/T8 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `learning-tool.js` — 搜索 "0x29" 和 "defaultSession"
  - 审计发现 P1-3
  - ISO 14229-1 §7.4（0x29）和 §7.2（会话服务映射）

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: 0x29 子功能 0x00 已添加
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "0x29" -Path "js/learning-tool.js" -Context 5,10
      2. 检查是否包含 0x00
    预期结果: 0x29 子功能列表包含 0x00: "authenticationConfiguration"
    证据: .sisyphus/evidence/task-6-0x29-0x00.txt

  场景: defaultSession 包含 0x23 和 0x87
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "defaultSession" -Path "js/learning-tool.js" -Context 2,20
    预期结果: defaultSession 的服务列表中包含 0x23 和 0x87
    证据: .sisyphus/evidence/task-6-defaultSession.txt
  ```

  **提交**: 建议 `fix(learning-tool): 0x29 追加子功能 0x00 + defaultSession 追加服务`
  - 文件: `js/learning-tool.js`

---

- [ ] 7. **修正 learning-tool.js SESSION_RULES 过于严格**

  **做什么**：
  - 在 `learning-tool.js` 中，`SESSION_RULES`（或类似名称的会话规则定义）中放宽以下服务在 defaultSession 的限制：
    - `0x23`（ReadMemoryByAddress）— 如果当前限制只在 Programming/Extended 中可用，改为在 defaultSession 也允许
    - `0x2E`（WriteDataByIdentifier）— 如果当前限制只在 Programming/Extended 中可用，改为在 defaultSession 也允许
    - `0x3D`（WriteMemoryByAddress）— 如果当前限制只在 Programming/Extended 中可用，改为在 defaultSession 也允许
  - 参考 ISO 14229-1 标准：这些服务在 defaultSession 中应当可用（但需要安全访问）
  - 这是审计发现 P1-4
  - 修改后 `node --check js/learning-tool.js` 确认语法正确

  **不能做**：
  - 不修改其他服务的会话规则
  - 不修改处理逻辑（handleRequest 等）

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 规则映射数据修正

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 2（与 T4-T6/T8 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `learning-tool.js` — 搜索 "SESSION_RULES" 或 "sessionRules"
  - 审计发现 P1-4
  - ISO 14229-1 §7.2, Annex A — 会话服务映射表

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: SESSION_RULES 已放宽
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "SESSION_RULES" -Path "js/learning-tool.js" -Context 10,30
      2. 检查 0x23、0x2E、0x3D 在 defaultSession 中的值
    预期结果: 0x23、0x2E、0x3D 在 defaultSession 规则中标记为可用
    证据: .sisyphus/evidence/task-7-session-rules.txt
  ```

  **提交**: 建议 `fix(learning-tool): 修正 SESSION_RULES 在 defaultSession 的限制`
  - 文件: `js/learning-tool.js`

---

- [ ] 8. **修复 DID 保存 Toast 消息文本**

  **做什么**：
  - 在 `simulator.js` 第 1355 行附近，DID 保存成功后弹出的 Toast 消息文本从 "DID已重置为默认值" 改为 "DID已保存"
  - 这是审计发现 P1-5
  - 修改后 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不修改其他 Toast 消息文本
  - 不修改 Toast 的样式或显示逻辑

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 单字符串替换

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 2（与 T4-T7 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js:1355` — 目标行，Toast 消息文本
  - 审计发现 P1-5

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: Toast 消息文本正确
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "DID已" -Path "js/simulator.js"
    预期结果: 输出包含 "DID已保存" 而非 "DID已重置为默认值"
    证据: .sisyphus/evidence/task-8-toast-text.txt

  场景: 语法正确
    工具: Bash
    前置条件: 修改完成
    步骤:
      1. node --check js/simulator.js
    预期结果: 退出码 0
    证据: .sisyphus/evidence/task-8-syntax-check.txt
  ```

  **提交**: 建议 `fix(simulator): 修复 DID 保存 Toast 消息文本`
  - 文件: `js/simulator.js`

---

- [ ] 9. **更新 AI-HANDOVER.md 文档**

  **做什么**：
  - 读取 `docs/AI-HANDOVER.md`
  - 删除/更新所有引用已移除的"知识测验"模块的内容（学习工具第 7 个标签页）
  - 补充文档中缺失的部分：
    - DoIP（ISO 13400）相关说明（如果模拟器支持 DoIP）
    - OBD2（ISO 15031）相关说明（如果模拟器支持 OBD2）
    - ISO-TP（ISO 15765-2）相关说明
  - 保持文档格式和风格一致
  - 这是审计发现 P1-6

  **不能做**：
  - 不修改除了 AI-HANDOVER.md 之外的文件
  - 不添加虚构的功能描述（只写实际存在的功能）

  **推荐 Agent**：
  - **类别**: `writing`
  - **技能**: `[]`
  - **理由**: 文档编写，需要良好的中文技术写作能力

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 3（与 T10 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `docs/AI-HANDOVER.md` — 目标文件
  - 审计发现 P1-6

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: AI-HANDOVER.md 无 quiz 引用
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "知识测验|quiz|测验模块" -Path "docs/AI-HANDOVER.md"
      2. 也可检查更通用的 "测验" 一词
    预期结果: 无匹配行（所有测验引用已移除）
    证据: .sisyphus/evidence/task-9-no-quiz-refs.txt

  场景: 文件仍然有效
    工具: Bash
    前置条件: 修改完成
    步骤:
      1. Get-Item "docs/AI-HANDOVER.md" | Select-Object Length
    预期结果: 文件存在且非空
    证据: .sisyphus/evidence/task-9-file-exists.txt
  ```

  **提交**: 建议 `docs: 更新 AI-HANDOVER.md（移除 quiz 引用 + 补充 DoIP/OBD2/ISO-TP）`
  - 文件: `docs/AI-HANDOVER.md`

---

- [ ] 10. **清理 CODE-REVIEW-*.md 文档中的测验引用**

  **做什么**：
  - 读取 `docs/CODE-REVIEW-FINDINGS.md` 和 `docs/CODE-REVIEW-REPORT.md`
  - 删除或更新所有引用已移除的"知识测验"模块的内容
  - 保持文档其余部分不变
  - 这是审计发现 P1-7

  **不能做**：
  - 不修改文档中与测验无关的内容
  - 不重写文档结构

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 简单的文本搜索替换

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 3（与 T9 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `docs/CODE-REVIEW-FINDINGS.md` — 目标文件
  - `docs/CODE-REVIEW-REPORT.md` — 目标文件
  - 审计发现 P1-7

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: CODE-REVIEW 文档无 quiz 引用
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "知识测验|quiz|测验" -Path "docs/CODE-REVIEW-FINDINGS.md"
      2. Select-String -Pattern "知识测验|quiz|测验" -Path "docs/CODE-REVIEW-REPORT.md"
    预期结果: 两个文件均无匹配行
    证据: .sisyphus/evidence/task-10-code-review-clean.txt
  ```

  **提交**: 建议 `docs: 清理 CODE-REVIEW 文档中的 quiz 引用`
  - 文件: `docs/CODE-REVIEW-FINDINGS.md`, `docs/CODE-REVIEW-REPORT.md`

---

- [ ] 11. **删除重复的 CAN 初始化事件绑定**

  **做什么**：
  - 在 `simulator.js` 第 3113-3119 行和第 3225-3233 行附近，两组绑定中保留一组，删除另一组
  - 确认两组绑定是语义完全相同的（相同的选择器、相同的事件、相同的回调）
  - 如果是完全相同，保留第 3225-3233 行（靠后的一组，因为更可能是最后的正确版本）
  - 如果存在细微差异，保留更完整/正确的一组
  - 修改后 `node --check js/simulator.js` 确认语法正确
  - 这是审计发现 P2-1

  **不能做**：
  - 不修改删除意外范围内的代码
  - 修改前必须确认两组绑定完全相同

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 删除重复代码行

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T12-T19 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js:3113-3119` 和 `3225-3233` — 两组疑似重复的绑定
  - 审计发现 P2-1

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: 重复绑定已移除
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. 用 grep 搜索绑定语句的模式（具体选择器字符串）
      2. 确认匹配只出现一次
    预期结果: 重复的事件绑定代码已删除，功能不受影响
    证据: .sisyphus/evidence/task-11-duplicate-removed.txt

  场景: 语法正确
    工具: Bash
    前置条件: 修改完成
    步骤:
      1. node --check js/simulator.js
    预期结果: 退出码 0
    证据: .sisyphus/evidence/task-11-syntax-check.txt
  ```

  **提交**: 建议 `refactor(simulator): 移除重复 CAN 初始化事件绑定`
  - 文件: `js/simulator.js`

---

- [ ] 12. **统一 var→let/const（CAN/LIN/DoIP 部分）**

  **做什么**：
  - 在 `simulator.js` 的 CAN、LIN、DoIP 相关函数/区域中，将所有 `var` 声明替换为 `let` 或 `const`
  - 如果是不会被重新赋值的变量，使用 `const`
  - 如果是会被重新赋值的变量，使用 `let`
  - 修改范围限定在 CAN/LIN/DoIP 部分，不涉及文件全局替换
  - 修改后 `node --check js/simulator.js` 确认语法正确
  - 这是审计发现 P2-2

  **不能做**：
  - 不改动其他非 CAN/LIN/DoIP 部分的 var 声明
  - 不重构代码逻辑
  - 不重命名变量

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 批量替换声明关键字，但仍需判断 const vs let

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T11/T13-T19 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js` — CAN/LIN/DoIP 部分（搜索 "var" 在相关区域）
  - 审计发现 P2-2

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: CAN/LIN/DoIP 部分无 var
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "\bvar\b" -Path "js/simulator.js"
      2. 检查输出中是否还有 CAN/LIN/DoIP 区域的 var
    预期结果: CAN/LIN/DoIP 指定区域的 var 已全部替换为 let/const
    证据: .sisyphus/evidence/task-12-var-cleanup.txt

  场景: 语法正确
    工具: Bash
    前置条件: 修改完成
    步骤:
      1. node --check js/simulator.js
    预期结果: 退出码 0
    证据: .sisyphus/evidence/task-12-syntax-check.txt
  ```

  **提交**: 建议 `refactor(simulator): 统一 CAN/LIN/DoIP 部分 var→let/const`
  - 文件: `js/simulator.js`

---

- [ ] 13. **修复 CSS 重复 .can-error-frame 选择器**

  **做什么**：
  - 在 `css/simulator.css` 第 540 和 542 行附近，删除重复的 `.can-error-frame` 选择器定义
  - 保留一个定义（除非两个定义有不同的样式规则，则合并）
  - 这是审计发现 P2-3

  **不能做**：
  - 不修改其他 CSS 规则
  - 不重写文件结构

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 简单 CSS 重复删除

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T11/T12/T14-T19 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `css/simulator.css:540,542` — 重复选择器
  - 审计发现 P2-3

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: .can-error-frame 无重复
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "\.can-error-frame" -Path "css/simulator.css"
    预期结果: .can-error-frame 选择器只出现一次（或合并后的一个规则块）
    证据: .sisyphus/evidence/task-13-css-dedup.txt
  ```

  **提交**: 建议 `refactor(css): 移除重复 .can-error-frame 选择器`
  - 文件: `css/simulator.css`

---

- [ ] 14. **HEX 输入静默丢弃添加用户反馈**

  **做什么**：
  - 在 `simulator.js` 中，找到 HEX 输入框的处理代码，当用户输入非十六进制字符（如 GH、XYZ 等）被静默丢弃时，需要添加 UI 反馈
  - 添加方式：输入框边框闪烁变红 300ms + 状态提示文本（非侵入式）
  - 或者：在输入框下方显示临时提示消息（"无效 HEX 字符，已忽略"），1.5 秒后自动消失
  - 这是审计发现 P2-4
  - 修改后 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不修改 HEX 输入的核心解析逻辑
  - 不引入外部依赖（提示消息用已有 UI 元素或动态创建）

  **推荐 Agent**：
  - **类别**: `unspecified-high`
  - **技能**: `[]`
  - **理由**: 涉及 UI 交互反馈，需要理解现有 HEX 输入的处理流程

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T11-T13/T15-T19 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js` — 搜索 "HEX"、"hex"、"input" 找到 HEX 输入处理代码
  - 审计发现 P2-4

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: 无效 HEX 输入有反馈
    工具: Playwright
    前置条件: 加载 index.html，找到 HEX 输入框
    步骤:
      1. 在 HEX 输入框中输入 "GH"（非十六进制字符）
      2. 观察是否有视觉反馈（边框闪烁、提示文字等）
    预期结果: 无效 HEX 字符被丢弃时有可见的 UI 反馈
    证据: .sisyphus/evidence/task-14-hex-feedback.png
  ```

  **提交**: 建议 `feat(simulator): HEX 输入无效字符添加 UI 反馈`
  - 文件: `js/simulator.js`

---

- [ ] 15. **清理 dtcStatus 死代码**

  **做什么**：
  - 在 `simulator.js` 中，找到 dtcStatus 相关代码，该变量已从 Array 类型变为 Object 类型
  - 删除不再使用的 Array 处理代码（如旧的初始化、迭代、转换等）
  - 保留 Object 类型的处理代码
  - 这是审计发现 P2-5
  - 修改后 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不删除仍然在使用中的 Object 类型 dtcStatus 代码
  - 不做其他清理

  **推荐 Agent**：
  - **类别**: `unspecified-high`
  - **技能**: `[]`
  - **理由**: 需要理解 dtcStatus 的旧代码哪些是死代码

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T11-T14/T16-T19 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js` — 搜索 "dtcStatus"
  - 审计发现 P2-5

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: dtcStatus 死代码已移除
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "dtcStatus" -Path "js/simulator.js"
    预期结果: 只保留 Object 类型 dtcStatus 的处理代码，Array 处理代码已删除
    证据: .sisyphus/evidence/task-15-dtcStatus-cleanup.txt
  ```

  **提交**: 建议 `refactor(simulator): 清理 dtcStatus 死代码（Array→Object 残留）`
  - 文件: `js/simulator.js`

---

- [ ] 16. **修复 F194 温度注释矛盾 + 清理 F19A 开发者注释**

  **做什么**：
  - 在 `simulator.js` 中：
    - 找到 F194（水温）DID 定义，修正其注释中的温度范围描述与实际值不符的问题
    - 找到 F19A（环境温度）DID 定义，清理残留的开发者调试注释
  - 这是审计发现 P2-6
  - 修改后 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不修改 DID 的实际数据值
  - 不修改其他注释

  **推荐 Agent**：
  - **类别**: `quick`
  - **技能**: `[]`
  - **理由**: 注释修正，无逻辑变更

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T11-T15/T17-T19 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js` — 搜索 "F194" 和 "F19A"
  - 审计发现 P2-6

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: F194 注释合理
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "F194" -Path "js/simulator.js" -Context 3,3
    预期结果: F194 注释与实际温度值范围一致，无矛盾描述
    证据: .sisyphus/evidence/task-16-F194-comment.txt

  场景: F19A 无开发者注释
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. Select-String -Pattern "F19A" -Path "js/simulator.js" -Context 3,3
    预期结果: F19A 注释干净，无残留的调试/开发者注释
    证据: .sisyphus/evidence/task-16-F19A-comment.txt
  ```

  **提交**: 建议 `refactor(simulator): 修复 F194 注释矛盾 + 清理 F19A 注释`
  - 文件: `js/simulator.js`

---

- [ ] 17. **移除 handleDSC suppressResponse 冗余检查**

  **做什么**：
  - 在 `simulator.js` 中，`handleDSC`（DiagnosticSessionControl）方法内存在对 `suppressResponse` 的冗余检查
  - 如果 suppressResponse 已在更上层（或更底层）统一处理，则删除 handleDSC 中重复的处理逻辑
  - 这是审计发现 P2-7
  - 修改后 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不修改 suppressResponse 在其他服务中的处理
  - 不改动 handleDSC 的核心逻辑

  **推荐 Agent**：
  - **类别**: `unspecified-high`
  - **技能**: `[]`
  - **理由**: 需要理解 suppressResponse 请求的处理流程

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T11-T16/T18-T19 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js` — 搜索 "handleDSC" 和 "suppressResponse"
  - 审计发现 P2-7

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: suppressResponse 冗余检查已移除
    工具: Bash
    前置条件: 文件已修改
    步骤:
      1. 在 handleDSC 函数中检查 suppressResponse 相关的条件语句
    预期结果: handleDSC 中无重复的 suppressResponse 检查
    证据: .sisyphus/evidence/task-17-suppressResponse.txt
  ```

  **提交**: 建议 `refactor(simulator): 移除 handleDSC suppressResponse 冗余检查`
  - 文件: `js/simulator.js`

---

- [ ] 18. **修复 SecurityAccess 尝试计数逻辑不一致**

  **做什么**：
  - 在 `simulator.js` 的 SecurityAccess（0x27）处理逻辑中，检查尝试计数的递增和重置逻辑
  - 当前问题：尝试计数在某些路径下未正确递增或重置，导致安全锁定机制行为不一致
  - 修正：确保尝试计数在每次错误的密钥验证后递增，在成功解锁或 ECU 复位后重置
  - 这是审计发现 P2-8
  - 修改后 `node --check js/simulator.js` 确认语法正确

  **不能做**：
  - 不修改 SecurityAccess 的种子生成逻辑
  - 不修改密钥验证算法

  **推荐 Agent**：
  - **类别**: `unspecified-high`
  - **技能**: `[]`
  - **理由**: 需要理解 SecurityAccess 的状态机逻辑

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T11-T17/T19 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1

  **引用**：
  - `simulator.js` — 搜索 "SecurityAccess"、"0x27"、"attempt"、"seed"、"key"
  - 审计发现 P2-8

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: 尝试计数正确递增
    工具: Bash + Playwright
    前置条件: 加载 index.html，进入扩展会话
    步骤:
      1. 请求 SecurityAccess 种子（27 01）
      2. 发送错误的密钥多次
      3. 检查尝试计数是否正确递增
      4. 发送正确密钥
      5. 检查尝试计数是否重置
    预期结果: 错误尝试计数正确递增，解锁成功后重置
    证据: .sisyphus/evidence/task-18-security-attempts.txt
  ```

  **提交**: 建议 `fix(simulator): 修复 SecurityAccess 尝试计数逻辑不一致`
  - 文件: `js/simulator.js`

---

- [ ] 19. **[决策门] 添加 "use strict" 到两个 JS 文件**

  **做什么**：
  - **此任务默认跳过**，需要用户明确确认后执行
  - 在 `simulator.js` 和 `learning-tool.js` 文件开头添加 `"use strict";`
  - 风险：3000+ / 1400+ 行的文件可能因 strict mode 而产生新的运行时错误（未声明变量、八进制字面量、重复属性名等）
  - 预估工作量：每个文件约 1-2 小时调试
  - 这是审计发现 P2-9
  - 修改后：
    - `node --check js/simulator.js` 确认语法正确
    - `node --check js/learning-tool.js` 确认语法正确
    - 浏览加载 `index.html`，检查控制台无 strict mode 相关错误

  **不能做**：
  - 不修改代码逻辑来适配 strict mode（发现违规只记录，不修改）
  - 不与其他 P2 任务合并执行

  **推荐 Agent**：
  - **类别**: `unspecified-high`
  - **技能**: `[]`
  - **理由**: strict mode 添加可能触发大量潜在错误，需要仔细检查

  **并行化**：
  - **可并行**: YES
  - **Wave**: Wave 4（与 T11-T18 并行）
  - **阻塞**: 无
  - **被阻塞于**: T1，以及用户决策

  **引用**：
  - `simulator.js` 和 `learning-tool.js` — 文件开头
  - 审计发现 P2-9

  **Acceptance Criteria**：

  **QA 场景**:
  ```
  场景: "use strict" 已添加（如果用户确认）
    工具: Bash
    前置条件: 用户确认执行此任务
    步骤:
      1. Select-String -Pattern '"use strict"' -Path "js/simulator.js"
      2. Select-String -Pattern '"use strict"' -Path "js/learning-tool.js"
    预期结果: 两个文件第一行或第二行都含 "use strict"
    证据: .sisyphus/evidence/task-19-use-strict.txt
  ```

  **提交**: 建议 `chore(js): 添加 "use strict" 到两个 JS 文件`
  - 文件: `js/simulator.js`, `js/learning-tool.js`

---

## Wave FINAL 验证

> 4 个 Review Agent 并行运行。全部必须通过。汇总结果后获取用户明确确认。

- [ ] F1. **Plan Compliance Audit** — `oracle`
  逐条检查 Must Have 是否实现，Must NOT Have 是否违规。检查证据文件存在。对比交付物与计划。
  输出: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  检查修改后的文件：`var` 残留（指定区域）、`console.log` 保留、CSS 重复选择器、死代码残留。
  输出: `simulator.js [PASS/FLAG] | learning-tool.js [PASS/FLAG] | simulator.css [PASS/FLAG] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` + `playwright` skill
  从干净状态开始，执行每个 Task 的 QA 场景。测试跨 Task 集成。
  输出: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  检查每项修复是否与审计发现 1:1 对应。确认无"顺手修复"。
  输出: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

> 用户要求不自动提交。Agent 完成所有修改后，列出所有变更供用户审查。

### 提交分组建议（供用户参考执行）
- `fix(simulator): 修复 F19A DID 温度值为 0x0015` — simulator.js
- `fix(simulator): 修复 handleClearDTC 被 dtcSetting 错误阻塞` — simulator.js
- `fix(simulator): 修复 0x29 认证子功能值符合 ISO 14229-1` — simulator.js
- `fix(learning-tool): 补充 0x10 子功能 0x04 和 0x29 子功能 0x00` — learning-tool.js
- `fix(learning-tool): 修正 defaultSession 服务和 SESSION_RULES` — learning-tool.js
- `fix(simulator): 修复 DID 保存 Toast 消息文本` — simulator.js
- `docs: 更新 AI-HANDOVER.md 和 CODE-REVIEW 文档` — *.md
- `refactor(simulator): 清理重复事件绑定/var/CSS/死代码/注释` — simulator.js, simulator.css

---

## Success Criteria

### 验证命令
```bash
# 确认文件变更
git diff --stat

# 确认无语法错误（用 Node 语法检查）
node --check simulator.js 2>&1
node --check learning-tool.js 2>&1

# 确认 CSS 无重复选择器（grep 计数）
Select-String -Pattern "\.can-error-frame" -Path "css/simulator.css"

# 确认 var 清理
Select-String -Pattern "\bvar\b" -Path "js/simulator.js"
Select-String -Pattern "\bvar\b" -Path "js/learning-tool.js"
```

### 最终检查清单
- [ ] 所有 P0 修复验证通过
- [ ] 所有 P1 ISO 合规修复验证通过
- [ ] 所有文档更新正确渲染
- [ ] 所有 P2 清理项确认完成
- [ ] 无控制台错误
- [ ] 无"顺手修复"污染
- [ ] 全量回归测试通过
