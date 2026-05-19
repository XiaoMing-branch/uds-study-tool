# UDS Study Tool 代码审查报告

## 1. 执行摘要

本报告基于维度 A（标准符合性）、维度 B（代码质量与漏洞）、维度 C（完整性与遗漏）三个审查维度的原始发现，对 UDS Study Tool 项目中的 `uds_learning_tool.html` 和 `uds_simulator.html` 两个核心文件进行综合汇总。

审查范围覆盖 21 个检查项（A1-A7、B1-B7、C1-C7），共发现 11 个 PASS 项、10 个 FAIL 项。FAIL 项主要集中在维度 A（5 个 FAIL）和维度 B（5 个 FAIL），维度 C 全部通过。核心问题包括：学习工具和模拟器中均存在的 Authentication 服务子功能定义错误、模拟器 DID 值错误（F19A 环境温度值）、默认会话权限规则过于严格、以及多处代码质量缺陷（类型不一致、注释冲突、输入验证不足）。共识别出 2 个 BUG（严重缺陷）、5 个 WARNING（一般问题）、4 个 INFO（建议改进）。

## 2. 服务定义符合性（A1-A4 汇总表）

| 子项 | 判定 | 关键 FAIL 项说明 |
|------|------|-----------------|
| A1. 学习工具 SERVICES vs 标准 | FAIL | 两个服务存在子功能遗漏：0x10 (DiagnosticSessionControl) 缺少子功能 0x04 (safetySystemDiagnosticSession)；0x29 (Authentication) 缺少子功能 0x00 (authenticationConfiguration)。其余 24 个服务 PASS。 |
| A2. 模拟器 SID_INFO vs 标准 | FAIL | 0x29 (Authentication) 子功能值映射与标准完全不匹配。模拟器使用自定义值（00=deAuthenticate, 01=verifyCertificateUnidirectional 等），标准定义 00=authenticationConfiguration, 01=authenticateUser 等。其余 25 个服务 PASS。 |
| A3. 学习工具 NRCS vs 标准 | PASS | 37 个 NRC 条目（范围展开后覆盖全部 256 个码值），所有码值、名称、助记符与标准 Table A.1 完全一致。 |
| A4. 模拟器 NRC 常量 vs 标准 | PASS | 23 个 NRC 常量的名称-数值映射与标准完全一致。 |

## 3. 会话规则符合性（A5-A6）

### A5. 学习工具 SESSIONS vs 标准

**判定**: FAIL

defaultSession（0x01）的服务列表缺少两个标准中应支持的服务：
- **0x23 (ReadMemoryByAddress)**: 标准 Table 23 标记为 x^c（非安全内存区域可在默认会话访问），学习工具 defaultSession.services 中未包含。
- **0x87 (LinkControl)**: 标准 Table 23 标记为 x^a（实现可选），学习工具 defaultSession.services 中未包含。

其余三个会话（programmingSession 0x02、extendedDiagnosticSession 0x03、safetySystemDiagnosticSession 0x04）的服务列表与标准一致，判定 PASS。

### A6. 模拟器 SESSION_RULES vs 标准

**判定**: FAIL

三个服务在默认会话中的权限设置过于严格：

| SID | 服务名 | 当前权限 | 问题 |
|-----|--------|---------|------|
| 0x23 | ReadMemoryByAddress | Default: 2（需安全解锁） | 标准允许非安全内存区域在默认会话直接访问，不应统一标记为需解锁。 |
| 0x2E | WriteDataByIdentifier | Default: 2（需安全解锁） | 标准允许非安全 DID 在默认会话无需安全解锁访问，不应统一标记为需解锁。 |
| 0x3D | WriteMemoryByAddress | Default: 2（需安全解锁） | 标准允许非安全内存区域在默认会话直接访问，不应统一标记为需解锁。 |

其余 23 个服务的会话权限分配与标准一致。0x04 (SafetySystem) 通过代码自动继承 0x03 (Extended) 规则，符合标准中安全系统会话逻辑。

## 4. DID 标识符合理性（A7）

**判定**: FAIL

16 个 DID 中 3 个 PASS、13 个 FAIL。核心问题分类如下：

### 值错误（BUG 级别）

| DID | 文件 | 位置 | 描述 |
|-----|------|------|------|
| F19A | uds_simulator.html | ECU.dids['F19A'], 第 416 行 | 环境温度值 `[0x00, 0x84]` 中 0x84 有符号值为 -124，无符号值为 132，均不合理。应为 0x15 (21°C)。代码注释已承认错误但实际值未修正。 |

### 动态 DID 范围误用

| DID | 文件 | 位置 | 描述 |
|-----|------|------|------|
| F300 | uds_simulator.html | ECU.dids['F300'], 第 419 行 | 标准 Table C.1 定义 F300-F3FF 为动态定义 DID（DynamicallyDefinedDataIdentifier），但模拟器将其用于静态预定义的 VIN 特定数据。 |
| F301 | uds_simulator.html | ECU.dids['F301'], 第 420 行 | 同上，标准定义 F300-F3FF 为动态 DID 范围，不应用于静态预定义数据（Boot 软件版本）。 |
| F302 | uds_simulator.html | ECU.dids['F302'], 第 421 行 | 同上，标准定义 F300-F3FF 为动态 DID 范围，不应用于静态预定义数据（应用软件版本）。 |

### DID 用途与标准分配不匹配

以下 DID 的模拟用途与标准 Table C.1 的具体分配不一致（在模拟演示场景中可理解）：

| DID | 标准定义 | 模拟器用途 | 文件/位置 |
|-----|---------|-----------|-----------|
| F192 | systemSupplierECUHardwareNumberDataIdentifier（硬件编号） | 软件版本号 SW-3.2.1 | uds_simulator.html, dids.F192, 第 408 行 |
| F193 | systemSupplierECUHardwareVersionNumberDataIdentifier（硬件版本号） | ECU 名称 BOSCH_ECU_v2 | uds_simulator.html, dids.F193, 第 409 行 |
| F194 | systemSupplierECUSoftwareNumberDataIdentifier（软件编号） | 发动机冷却液温度 100°C | uds_simulator.html, dids.F194, 第 410 行 |
| F195 | systemSupplierECUSoftwareVersionNumberDataIdentifier（软件版本号） | 发动机转速 3600 RPM | uds_simulator.html, dids.F195, 第 411 行 |
| F196 | exhaustRegulationOrTypeApprovalNumberDataIdentifier（排放法规/型式认证号） | 车速 110 km/h | uds_simulator.html, dids.F196, 第 412 行 |
| F197 | systemNameOrEngineTypeDataIdentifier（系统名称/发动机类型） | 里程表 3500 km | uds_simulator.html, dids.F197, 第 413 行 |
| F199 | programmingDateDataIdentifier（编程日期） | ECU 供电电压 4.000V | uds_simulator.html, dids.F199, 第 415 行 |
| F19B | calibrationDateDataIdentifier（校准日期） | 总运行时间 100h | uds_simulator.html, dids.F19B, 第 417 行 |
| F19C | calibrationEquipmentSoftwareNumberDataIdentifier（校准设备软件号） | 燃油液位 75% | uds_simulator.html, dids.F19C, 第 418 行 |

## 5. 代码缺陷清单（B1-B7）

### BUG（严重缺陷）

| 编号 | 文件 | 位置 | 描述 |
|------|------|------|------|
| BUG-1 | uds_simulator.html | ECU.dids['F19A'], 第 416 行 | 环境温度值错误：`[0x00, 0x84]` 中 0x84 有符号值为 -124，不合理。应为 0x15 (21°C)。注释已承认错误但代码未修正。 |
| BUG-2 | doc/md/ | FlexRay 实现文档 | ISO 14229-4 (FlexRay) 存在两个几乎相同的文件（原文件和带 `(1)` 后缀的重复副本），字节差异仅 11 字节。 |

### WARNING（一般问题）

| 编号 | 文件 | 位置 | 描述 |
|------|------|------|------|
| WARN-1 | uds_simulator.html | ECU 声明（第 399 行）、handleClearDTC（第 986 行） | dtcStatus 类型不一致：声明时初始化为数组 `[0x00, 0x00, 0x00]`，在 handleClearDTC 中被赋值为对象 `{ B1: 0x00, B2: 0x00, B3: 0x00 }`，类型从 Array 隐式变为 Object。 |
| WARN-2 | uds_simulator.html | handleClearDTC 函数, 第 983 行 | handleClearDTC 误用 dtcSetting 限制清除：当 `ECU.dtcSetting === false` 时，清除请求被拒绝并返回 NRC 0x22 (conditionsNotCorrect)。DTC 记录关闭与 ClearDiagnosticInformation 服务的可执行性无关。 |
| WARN-3 | uds_simulator.html | handleSecurityAccess 函数, 第 1067-1088 行 | SecurityAccess 尝试计数逻辑不一致：种子请求和密钥验证失败使用同一计数器但阈值不同（种子阈值=3，密钥阈值=5）。种子请求不应消耗尝试次数，可能导致 3 次种子请求后即被锁定。 |
| WARN-4 | uds_simulator.html | updatePreview（第 666-668 行）、sendMessage（第 1433-1436 行）、sendRawHex（第 1473-1474 行）、onRawHex（第 1488-1489 行） | HEX 输入静默丢弃非法令牌：使用严格 2 字符正则 `/^[0-9a-fA-F]{2}$/` 过滤，导致单数字 hex（如 "F"）、0x 前缀 hex（如 "0xF1"）、连续无空格 hex（如 "F190"）、奇数长度字符串被静默忽略，无用户反馈。 |
| WARN-5 | uds_simulator.html | ECU.dids['F194'], 第 410 行 | 温度注释自相矛盾：注释 `// Engine coolant temp: 100°C (signed: -40+100=60)` 同时声称 100°C 和 60°C。实际解码公式 `vals[1] - 40` 从 0x64 (100) 解码得 60°C，与 100°C 的表述矛盾。 |

### INFO（建议）

| 编号 | 文件 | 位置 | 描述 |
|------|------|------|------|
| INFO-1 | uds_learning_tool.html, uds_simulator.html | `<script>` 块文件级 | 两个文件的 JS 均未使用 `"use strict"` 指令。虽未发现实际错误，但严格模式有助于捕获隐式全局变量等潜在问题。 |
| INFO-2 | uds_simulator.html | handleDSC 函数, 第 956 行 | suppressResponse 冗余检查：`if (suppress && (fullReq[1] & 0x80)) return null;` 中 `suppress` 已由 processRequest 推导得出，`suppress` true 时 `(fullReq[1] & 0x80)` 必然为 true，条件冗余。 |
| INFO-3 | uds_simulator.html | ECU.dids['F19A'], 第 416 行 | F19A 注释为开发者笔记未清理：`// Ambient temp: 21°C (0x84 as signed = -124... wait, wrong. Let's use 0x15 = 21)` 准确记录了代码中的 Bug，但属于开发过程中的自言自语未清理，且代码值未随之修正。 |
| INFO-4 | uds_simulator.html | handleClearDTC, 第 986 行 | dtcStatus 类型变更无注释：`ECU.dtcStatus = { B1: 0x00, B2: 0x00, B3: 0x00 }` 从数组类型变为对象类型且不再被读取（死代码），无注释说明变更原因。 |

## 6. 完整性与遗漏（C1-C7）

| 子项 | 判定 | 说明 |
|------|------|------|
| C1. 标准有代码无的缺失服务 | PASS | ISO 14229-1:2020 标准共定义 26 个服务，学习工具和模拟器均实现 26/26（100%），无缺失服务。原计划中提到的 34+ 个缺失服务在 2020 版标准中不存在。 |
| C2. NRC 数量差异 | PASS | 学习工具全覆盖标准 NRC 定义（37 个条目展开后覆盖 256 个码值）。模拟器使用 23 个常量的常用子集，适合演示目的。差异可解释。 |
| C3. 学习工具 6 标签页完整性 | PASS | 全部 6 个标签页（服务浏览器、SID 服务地图、NRC 参考、会话管理、消息构造器、知识测验）的渲染函数已定义，搜索/筛选功能可用，模态弹窗系统正常。 |
| C4. 模拟器功能完整性 | PASS | 三大面板正确渲染，13 个预设场景全部实现，26 个服务处理器完整。 |
| C5. 标准文档完整性 | PASS | Part 1-7 全部覆盖（7/7）。存在 FlexRay 文档重复文件（`(1)` 后缀副本），需清理。 |
| C6. PDF 文件完整性 | PASS | Part 1-7 PDF 文件全部存在且大小合理。doc/ 下无重复 PDF。 |
| C7. 额外验证 — 服务列表完整性 | PASS | Authentication (0x29) 在所有会话中均受支持，符合标准 Table 23。学习工具和模拟器的服务列表中均包含 0x29。 |

## 7. 已知问题汇总

| 编号 | 问题描述 | 来源维度 | 严重级别 | 涉及文件 | 位置 |
|------|---------|---------|---------|---------|------|
| 1 | 0x10 (DSC) 缺少子功能 0x04 (safetySystemDiagnosticSession) | A1 | FAIL | uds_learning_tool.html | SERVICES[0].subfuncs, 第 411-417 行 |
| 2 | 0x29 (Authentication) 缺少子功能 0x00 (authenticationConfiguration) | A1 | FAIL | uds_learning_tool.html | SERVICES[9].subfuncs, 第 512-523 行 |
| 3 | 0x29 (Authentication) 子功能值映射与标准完全不匹配 | A2 | FAIL | uds_simulator.html | SID_INFO[0x29].sfs, 第 482-486 行 |
| 4 | defaultSession 服务列表缺少 0x23 和 0x87 | A5 | FAIL | uds_learning_tool.html | SESSIONS[0].services, 第 758 行 |
| 5 | 0x23 (ReadMemoryByAddress) 默认会话权限过于严格 | A6 | FAIL | uds_simulator.html | SESSION_RULES[0x23], 第 562 行 |
| 6 | 0x2E (WriteDataByIdentifier) 默认会话权限过于严格 | A6 | FAIL | uds_simulator.html | SESSION_RULES[0x2E], 第 567 行 |
| 7 | 0x3D (WriteMemoryByAddress) 默认会话权限过于严格 | A6 | FAIL | uds_simulator.html | SESSION_RULES[0x3D], 第 568 行 |
| 8 | F19A 环境温度值错误（0x84 应为 0x15） | A7, B7 | BUG | uds_simulator.html | ECU.dids['F19A'], 第 416 行 |
| 9 | F300-F302 使用动态 DID 范围 | A7 | FAIL | uds_simulator.html | ECU.dids['F300'-'F302'], 第 419-421 行 |
| 10 | F192-F19C DID 用途与标准分配不匹配（共 9 个 DID） | A7 | FAIL | uds_simulator.html | ECU.dids['F192'-'F19C'], 第 408-418 行 |
| 11 | dtcStatus 类型不一致（Array 变 Object） | B1 | WARNING | uds_simulator.html | ECU 声明（第 399 行）、handleClearDTC（第 986 行） |
| 12 | handleClearDTC 误用 dtcSetting 限制清除 | B2, B7 | WARNING | uds_simulator.html | handleClearDTC, 第 983 行 |
| 13 | SecurityAccess 尝试计数逻辑不一致 | B2 | WARNING | uds_simulator.html | handleSecurityAccess, 第 1067-1088 行 |
| 14 | HEX 输入静默丢弃非法令牌 | B3 | WARNING | uds_simulator.html | updatePreview/sendMessage/sendRawHex/onRawHex, 多处 |
| 15 | F194 温度注释自相矛盾 | B6 | WARNING | uds_simulator.html | ECU.dids['F194'], 第 410 行 |
| 16 | FlexRay 文档重复文件 | B7, C5 | BUG | doc/md/ | FlexRay 实现文档目录 |
| 17 | 缺少 "use strict" 指令 | B1 | INFO | uds_learning_tool.html, uds_simulator.html | `<script>` 块文件级 |
| 18 | handleDSC suppressResponse 冗余检查 | B2 | INFO | uds_simulator.html | handleDSC, 第 956 行 |
| 19 | F19A 注释未清理（开发者笔记） | B6 | INFO | uds_simulator.html | ECU.dids['F19A'], 第 416 行 |
| 20 | dtcStatus 死代码且类型变更无注释 | B6, B7 | INFO | uds_simulator.html | ECU 声明（第 399 行）、handleClearDTC（第 986 行） |

## 8. 审查统计

### 维度统计

| 维度 | 子项数 | PASS | FAIL | NA |
|------|--------|------|------|----|
| A | 7 | 2 | 5 | 0 |
| B | 7 | 2 | 5 | 0 |
| C | 7 | 7 | 0 | 0 |
| **总计** | **21** | **11** | **10** | **0** |

### 严重级别分布

| 严重级别 | 数量 |
|---------|------|
| BUG | 2 |
| WARNING | 5 |
| INFO | 4 |

### 按文件分布

| 文件 | BUG | WARNING | INFO |
|------|-----|---------|------|
| uds_simulator.html | 1 | 5 | 4 |
| uds_learning_tool.html | 0 | 0 | 1 |
| doc/md/（FlexRay 重复） | 1 | 0 | 0 |

### 按维度分布

| 维度 | BUG | WARNING | INFO |
|------|-----|---------|------|
| A（标准符合性） | 0 | 0 | 0 |
| B（代码质量） | 2 | 5 | 4 |
| C（完整性） | 0 | 0 | 0 |
