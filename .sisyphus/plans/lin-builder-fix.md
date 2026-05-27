# 计划: LIN 消息构造器诊断模式合规修正

## TL;DR

> **快速摘要**: 修正 LIN 构造器的 3 处不符合 ISO 17987 诊断规范的问题：PID 固定为诊断码(0x3C/0x3D)、NAD 强制 7 位范围校验(00-7F)、数据场固定 8 字节自动补 0x00
>
> **交付物**: 2 个文件修改 (HTML + JS)，约 50 行变动
>
> **预估工作量**: 快速

---

## Context

### 用户发现的问题
1. **PID 应固定**: LIN 诊断中 Master→Slave 请求固定 PID=0x3C，Slave→Master 响应固定 PID=0x3D。当前允许自由输入违反诊断协议
2. **NAD 无校验**: 标准 NAD 为 7 位地址 (00-7F)，当前允许输入 80-FF 等无效地址
3. **数据场不完整**: LIN 诊断帧数据场固定 8 字节，不足应补 0x00，当前无此约束

### 规范依据
- ISO 17987 LIN 诊断通信
  - 诊断请求 PID: 0x3C (主→从)
  - 诊断响应 PID: 0x3D (从→主)
  - NAD: 7 位地址 (0x00 广播/0x01-0x7E 物理/0x7F 功能)
  - 数据场: 固定 8 字节

---

## 工作目标

### 核心目标
修正 LIN 构造器使其完全符合 ISO 17987 诊断规范

### 具体交付物
1. 根据角色(Master/Slave)自动设置诊断 PID (0x3C/0x3D)，移除用户输入
2. NAD 输入强制 00-7F 范围校验，超范围红色提示
3. 数据场自动补全至 8 字节 (不足补 0x00)

### 完成定义
- [ ] 切换 Master → PID 自动显示 0x3C，切换 Slave → PID 自动显示 0x3D
- [ ] 输入 NAD=80 时输入框变红并提示"NAD 有效范围: 00-7F"
- [ ] 输入 3 字节数据 → 构造时自动补 0x00 ×5，输出完整的 8 字节
- [ ] 复制 HEX 功能同样应用修正

### 必须包含
- PID 只读显示，根据角色自动切换
- NAD 范围校验 + 视觉反馈
- 数据场 8 字节填充

### 不包含 (防护栏)
- 不修改 CAN 构造器
- 不修改 UDS 构造器
- 不修改模拟器
- 不修改校验和算法 (当前已正确)

---

## 执行策略

### 单波执行 (小改动，无需并行)

```
Wave 1:
├── Task A: HTML — 移除 PID 输入框，改为只读显示
└── Task B: JS — PID 自动逻辑 + NAD 校验 + 数据填充
```

---

## TODOs

- [ ] A. HTML — 移除 PID 输入框，改为只读显示

  **做什么**:
  在 `uds_learning_tool.html` 的 LIN fields 区域:
  1. 找到 `#lin-pid` 输入框 (约 line 177-178):
     ```html
     <label>PID (HEX 00-3F):</label>
     <input type="text" id="lin-pid" placeholder="如: 10" oninput="updateBuilderByMode()">
     ```
  2. 替换为只读显示:
     ```html
     <label>诊断 PID:</label>
     <span id="lin-pid-display" style="font-family:monospace;font-weight:600;color:var(--primary);padding:.5rem 0">0x3C (主→从)</span>
     ```
  3. 确认 `oninput` 已移除 (PID 不再触发构造)

  **禁止做**:
  - 不要修改 CAN 字段
  - 不要修改 UDS 字段

  **验收标准**:
  - `#lin-pid` 输入框不再存在
  - `#lin-pid-display` 存在，默认显示 "0x3C (主→从)"

- [ ] B. JS — PID 自动逻辑 + NAD 校验 + 数据填充

  **做什么**:
  在 `js/learning-tool.js` 修改 `updateBuilderLIN()` 函数:

  1. **PID 自动 (替换用户输入)**:
     ```js
     // 旧:
     const pidStr = document.getElementById('lin-pid').value.trim();
     // 新:
     const role = document.querySelector('input[name="lin-role"]:checked').value;
     const pidVal = role === 'master' ? 0x3C : 0x3D;
     // 更新显示
     const pidDisplay = document.getElementById('lin-pid-display');
     if (pidDisplay) {
       pidDisplay.textContent = `0x${pidVal.toString(16).toUpperCase()} (${role === 'master' ? '主→从' : '从→主'})`;
     }
     ```
     - 移除所有 `pidStr` 相关的空值校验 (`if (!pidStr)` 块)
     - 移除 `pidVal = parseInt(pidStr, 16)` 和范围校验 (0x00-0x3F)

  2. **NAD 范围校验**:
     在读取 NAD 后添加校验:
     ```js
     const nadHex = document.getElementById('lin-nad');
     const nadVal = parseInt(nadStr, 16);
     if (nadStr && (isNaN(nadVal) || nadVal < 0 || nadVal > 0x7F)) {
       nadHex.style.borderColor = 'var(--danger)';
       nadHex.style.background = '#fee2e2';
       preview.innerHTML = '<span style="color:var(--danger)">⚠️ NAD 有效范围: 00-7F</span>';
       return;
     }
     nadHex.style.borderColor = '';  // 清除错误样式
     nadHex.style.background = '';
     ```

  3. **数据场 8 字节填充**:
     ```js
     // 现有: 直接使用 dataBytes
     // 新: 填充至 8 字节
     while (dataBytes.length < 8) {
       dataBytes.push(0x00);
     }
     if (dataBytes.length > 8) {
       dataBytes.length = 8;  // 截断超长
     }
     ```

  4. **同步修改 `copyBuilderHex()` 中 LIN 部分**:
     - PID 同样从角色推断 (0x3C/0x3D)
     - 数据字节同样 8 字节填充
     - NAD 校验（复制时也检验）

  5. **INFO 行更新**:
     数据场描述改为 `DATA(8B)` 固定

  **禁止做**:
  - 不要修改 CAN 构造函数
  - 不要修改 UDS 构造函数
  - 不要删除 `updateBuilderByMode()` dispatch

  **验收标准**:
  - Master 模式下 PID 自动为 0x3C，Slave 模式下自动为 0x3D
  - 输入 NAD=80 → 红色警告 "NAD 有效范围: 00-7F"
  - 输入 3 字节数据 → 预览显示 8 字节 (后 5 字节为 00)
  - `node --check js/learning-tool.js` 通过

---

## 提交策略

- **Task A+B**: `fix(learning-tool): LIN 构造器诊断模式合规修正`
  - 文件: `uds_learning_tool.html`, `js/learning-tool.js`

---

## 成功标准

### 验证命令
```bash
node --check js/learning-tool.js  # 无错误
```
