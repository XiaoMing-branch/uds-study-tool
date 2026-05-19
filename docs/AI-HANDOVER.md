# UDS 学习工具 - AI 交接文档

## 1. 项目全景

纯前端 UDS (ISO 14229-1:2020) 诊断协议学习平台, 两个独立 HTML:

| 文件 | 大小 | 行数 | 用途 |
|------|------|------|------|
| uds_learning_tool.html | 90KB | ~1247 | 协议学习, 6 标签页 |
| uds_simulator.html | 74KB | ~1492 | ECU 模拟器 |

零外部依赖, 浏览器打开即用。

## 2. 文件夹结构

```
/ (根目录)
├── uds_learning_tool.html     学习工具
├── uds_simulator.html         ECU 模拟器
├── README.md                  用户指南
├── docs/AI-HANDOVER.md        本文件
├── doc/
│   ├── md/                    ISO 14229 Markdown (9个)
│   └── *.pdf                  ISO 14229 标准 PDF (8个)
└── .sisyphus/
    ├── plans/                 路线图
    └── notepads/              工作记录与决策
```

## 3. uds_learning_tool.html 架构

### 全局数据
- `FUNCTIONAL_UNITS` -- 7 功能单元 (diagnostic-communication, data-transmission, stored-data, io-control, routine, upload-download, security)
- `SERVICES` -- 数组, 26 个服务条, 含 sid/name/shortName/unit/subfuncs/nrcs/detail
- `NRCS` -- 数组, 37+ NRC (支持范围值如 01-0F)
- `SESSIONS` -- 4 种会话 (Default/Programming/Extended/SafetySystem)
- `QUIZ` -- 26 题, 按 topic 分 (sid/nrc/session/general)

### 6 标签页渲染函数
- `renderServices()` -- 搜索筛选 + 卡片列表, 点卡调用 showModal
- `renderHexMap()` -- 0x00-0xFF 十六进制网格, 颜色区分 SID/NRC/会话
- `renderNRCs()` -- 搜索筛选 + NRC 卡片列表
- `renderSessions()` -- 会话详情 + 服务独占性标签
- `initBuilder()`/`updateBuilder()` -- 交互式消息构造器
- `startQuiz()` -- 选题答题评分

### 支撑系统
- **Modal**: showModal/closeModal 弹窗详情 (子功能表, NRC 解释)
- **Theme**: toggleTheme 深色/浅色切换, localStorage 持久化
- **Tab 导航**: data-tab 属性驱动

## 4. uds_simulator.html 架构

### ECU 状态 (全局 `ECU`)

```
ECU = {
  session, sessionName,          // 当前会话
  securityLevel, securityAttempts, // 安全访问状态
  P2, P2star, S3,               // 计时器 ms
  communication, dtcSetting,     // 开关
  dids: { 'F190': [...], ... },  // 16 DID
  didLabels: { 'F190': 'VIN 码' }, // DID 标签
  dtcs: [{ id, status, severity }], // 3 DTC
  counters: { rx, tx, pos, neg }
}
```

### 服务定义
- `SID_INFO` -- 对象, 26 服务, key=SID, 含 name/short/hasSF/sfs
- `NRC` -- 22 命名常量 (GR:0x10, SNS:0x11, CNC:0x22, SAD:0x33 等)
- `SESSION_RULES` -- 权限矩阵: `{ SID: { session: 0/1/2 } }`, 0=不可用/1=可用/2=需解锁
- `SESSION_NAMES` -- session ID 到名称映射

### 引擎流程
`processRequest(bytes)` 核心入口: 解析 SID -> checkSessionSecurity -> 解析子功能 -> handleService switch -> 26 handler。

每个 handler 返回 `{ sid, payload[], desc, isNeg? }`。负响应由 `negResp(sid, nrcCode)` 生成。

26 handler: handleDSC, handleECUReset, handleClearDTC, handleReadDID, handleSecurityAccess, handleWriteDID, handleRoutine 等。

### 场景与解码
- `runScenario(name)`: 13 预设场景 switch-case (会话切换, VIN 读取, SecurityAccess, 下载流程等)
- `updateDecode(sid, sfVal, reqBytes)`: 解析服务名/会话权限/子功能/DID 标签/物理值 (水温/转速/车速/电压/油量)

## 5. 两 HTML 数据关联与差异

| 数据 | 学习工具 | 模拟器 |
|------|----------|--------|
| 服务 | SERVICES 数组 (含详情+NRC) | SID_INFO 对象 (简版) |
| 会话权限 | SESSIONS 对象 (含服务列表) | SESSION_RULES 矩阵 (0/1/2) |
| NRC | NRCS 数组 (含范围+描述) | NRC 常量 (仅码值) |

**风险**: 修改服务需同步两处。SESSION_RULES 独立维护, 不会自动生成。

## 6. doc/ 目录说明

doc/ 含 8 个标准 PDF (ISO 14229-1 至 14229-7 + GBT 征求意见稿)。doc/md/ 含对应 9 个 Markdown 文件 (OCR 转换, 供 AI 读取)。

主要参考: `doc/md/【原文】ISO 14229-1-2020.md` (23241 行, 完整标准正文)。

## 7. 已知问题

1. **F19A 温度值错误**: ECU.dids['F19A'] = [0x00, 0x84]。0x84 有符号为 -124, 应为 0x15 (21 度)。注释已标但未修复。
2. **FlexRay 文件重复**: doc/md/ 下有两份相同 FlexRay 文件 (含 "(1)" 后缀副本)。
3. **数据双副本风险**: 服务与会话规则在两文件各自独立, 修改须同步。
4. **0x29 会话覆盖待验证**: Authentication 服务在 SESSION_RULES 中权限配置可能不完全。

## 8. 扩展点说明

- **新服务**: 学习工具追加 SERVICES 条目, 模拟器加 SID_INFO + SESSION_RULES + switch handler
- **新 DID**: 模拟器加 ECU.dids 数据 + didLabels 标签 + updateDecode 分支
- **新场景**: runScenario switch 加 case
- **新测验题**: QUIZ 数组追加对象 (topic: general/sid/nrc/session)
- **新标准文档**: doc/md/ 加 Markdown 文件

## 9. 参考

- 路线图: `.sisyphus/plans/uds-master-roadmap.md` (6 波 20 项)
- 工作记录: `.sisyphus/notepads/uds-docs-audit-plan/`
- 标准原文: `doc/md/【原文】ISO 14229-1-2020.md`
