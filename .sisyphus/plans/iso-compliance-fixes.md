# 计划: 根据 ISO 11898/17987 标准校验修正 CAN/LIN 实现

## TL;DR

> **快速摘要**: 对照 ISO 11898-1:2015 和 ISO 17987-2/3:2016 原文校验，发现 4 个问题：LIN 校验和类型错误(严重)、CAN 缺少 Bit Error 注入、LIN Schedule 校验和错误、CAN 控制场术语过时。修正 3 个文件约 20 行。
>
> **交付物**: 3 文件修改，约 20 行变动
>
> **预估工作量**: 快速修复

---

## Context

### 校验依据
| 文档 | 版本 | 关键章节 |
|------|------|---------|
| ISO 11898-1:2015 | 第二版 | §10.4.2 MAC DF 帧结构, §10.11 错误检测, §12.1.4 错误状态机 |
| ISO 17987-2:2016 | 第一版 | §6.4 N_NAD, §9.6 诊断调度表, §12.3.3.5 诊断帧 PID |
| ISO 17987-3:2016 | 第一版 | §5.2.2.5 PID 字段+奇偶校验, §5.2.2.7 校验和 |

### 关键标准证据

**ISO 17987-3:2016 §5.2.2.7 (Line 1431)**:
> Frame identifiers 60(0x3C) to 61(0x3D) shall always use classic checksum.

**ISO 17987-3:2016 §5.2.2.7 (Line 1422)**:
> Checksum calculation over the data bytes and the protected identifier byte is called enhanced checksum and it is used for non-diagnostic communication.

**ISO 17987-2:2016 §6.4 (Lines 1208, 1211)**:
> ID 3C (MasterReq) is assigned to the message transmissions sent by the master node.
> ID 3D (SlaveResp) is assigned to the message transmissions sent by any slave node.

**ISO 11898-1:2015 §10.11 (Lines 3870-3903)**:
> 5 error types: a) Bit error, b) Stuff error, c) CRC error, d) Form error, e) ACK error

---

## 工作目标

### 核心目标
修正 LIN 校验和类型违反标准 + CAN 缺少位错误注入 + CAN 控制场标签更新

### 具体交付物
1. **学习工具 LIN 构造器**: 强制经典校验和用于诊断帧(0x3C/0x3D)，移除校验和类型选择器
2. **模拟器 LIN 引擎**: `sendLINFrame()` 根据 PID 自动选校验和类型(0x3C/0x3D→classic, 其他→enhanced)
3. **模拟器 CAN 面板**: 新增 "Bit Err" 错误注入按钮(五种错误类型完整)
4. **学习工具 CAN 构造器**: 控制场标签更新("r0"→"FDF", "r1"→"FDF")

### 完成定义
- [ ] 学习工具 LIN 模式: PID 固定为 0x3C/0x3D 时校验和自动为经典(Classic)，无用户选择
- [ ] 模拟器 LIN: 发送 0x3C/0x3D 帧自动用经典校验和，非诊断帧用增强
- [ ] 模拟器 CAN: 五种错误注入按钮全部存在
- [ ] 学习工具 CAN: 控制场术语符合 ISO 11898-1:2015

### 必须包含
- ISO 17987-3:1431 校验和类型强制
- ISO 11898-1:2015 全部 5 种错误类型

### 不包含 (防护栏)
- 不实现真实 CRC 计算
- 不修改 UDS 构造器
- 不修改 CAN FD 部分
- 不修改错误计数器算法

---

## 执行策略 (单波)

```
Wave 1:
├── Fix 1: 学习工具 — LIN 校验和经典固定 + CAN 控制场标签更新
├── Fix 2: 模拟器 — LIN sendLINFrame 自动选校验和
├── Fix 3: 模拟器 — CAN 面板添加 Bit Err 按钮
```

---

## TODOs

- [ ] 1. 学习工具 — LIN 校验和经典固定 + CAN 控制场标签更新

  **做什么**:
  A) `uds_learning_tool.html` LIN fields 区域:
  - 移除校验和类型 radio 选择器 (行 181-184)
  - 替换为只读显示文本: `<span id="lin-checksum-display">校验和: 经典(Classic) — 诊断帧固定</span>`

  B) `js/learning-tool.js` updateBuilderLIN():
  - 移除 `checksumType` 变量读取(删除 `querySelector` 行)
  - 硬编码 `const checksumType = 'classic';`
  - 在校验和字段显示 `csType = 'Classic'` 固定
  - PID 显示文本更新(已有 PID-display)

  C) `js/learning-tool.js` copyBuilderHex() LIN 部分:
  - 同样移除 checksumType 读取，硬编码 `'classic'`

  D) `js/learning-tool.js` updateBuilderCAN() 控制场标签:
  - 11-bit: `ctrlHtml = \`IDE=0 FDF=0 DLC=${dlc}\`;`
  - 29-bit: `ctrlHtml = \`FDF=0 r0=0 DLC=${dlc}\`;`

  **禁止**: 不修改 CAN 错误相关代码

- [ ] 2. 模拟器 — LIN 引擎校验和自动选择

  **做什么**:
  `js/simulator.js` sendLINFrame() (行 3149-3157):
  ```js
  // 修改前:
  var checksum = calculateLINChecksum(data, pid, true);
  // 修改后:
  var isDiag = (id === 0x3C || id === 0x3D);
  var checksum = calculateLINChecksum(data, isDiag ? 0 : pid, !isDiag);
  ```
  解释: 诊断帧(0x3C/0x3D)用经典校验和(`enhanced=false`)，非诊断帧用增强(`enhanced=true`)

  **禁止**: 不修改 calculateLINChecksum 函数本身(算法已经正确)

- [ ] 3. 模拟器 — CAN 面板添加 Bit Err 按钮

  **做什么**:
  `uds_simulator.html` CAN 错误按钮区域 (行 423-428):
  在现有按钮前添加:
  ```html
  <button class="btn btn-sm" onclick="injectCANError('bit')">Bit Err</button>
  ```
  排列: `Bit Err | CRC Err | ACK Err | Stuff Err | Form Err | Bus Off`
  (Bit Err 放在最前面，因为它是总线监听的基础错误)

  `js/simulator.js` injectCANError() 已通用处理任意 type，无需修改

  **禁止**: 不修改 injectCANError 函数

---

## 提交策略

- **Fix 1+2+3**: `fix: 对照 ISO 11898/17987 标准修正 CAN/LIN 实现`
  - 文件: `uds_learning_tool.html`, `js/learning-tool.js`, `uds_simulator.html`, `js/simulator.js`

---

## 校验结果总览 (已验证正确 ✅)

| 项目 | ISO 引用 | 实现状态 |
|------|---------|---------|
| PID 0x3C(MasterReq)/0x3D(SlaveResp) | 17987-2:1208,1211 | ✅ |
| PID 奇偶校验 P0,P1 公式 | 17987-3:1267-1270 | ✅ |
| NAD 地址范围 00-7F | 17987-2:801 | ✅ |
| 校验和算法(含进位的 8 位和取反) | 17987-3:1419 | ✅ |
| CAN 帧 7 字段结构 | 11898-1:2951-2972 | ✅ |
| CAN 5 错误类型(缺 Bit Err 按钮) | 11898-1:3870-3903 | ⚠️ |
| CAN TEC/REC 状态机阈值 | 11898-1:4858-4873 | ✅ |
| CAN CSMA/CR 仲裁 | 11898-1:404-412 | ✅ |
| LIN Break 场 13+1 bit | 17987-3:1437 | ✅ |
| LIN 唤醒脉冲 250μs | 17987-2:1019 | ✅ |
