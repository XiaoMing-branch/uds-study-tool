# UDS Study Tool — 综合路线计划 (20项)

## TL;DR

> **Quick Summary**: 在现有 UDS 学习工具 + 模拟器基础上，分 6 个执行波次完成 20 项增强功能，覆盖 DID/DTC 编辑、ISO-TP 传输层、刷写流程、教学动画、多 ECU 拓扑、工程化重构。
>
> **Deliverables**:
> - DID 编辑器（模拟器嵌入式模态）
> - DTC 注入面板 + 编辑器 + 统计
> - ISO-TP 单帧/多帧传输层
> - 刷写完整流程演示（Bootloader + App）
> - 教学动画（交互式逐字节协议播放器）
> - 会话-服务矩阵热力图
> - N 条新学习笔记/书签系统
> - 题库扩充至 100+ 题
> - 多 ECU 拓扑仿真
> - CAN 帧级通信仿真
> - DoIP + OBD-II 兼容入口
> - 历史记录导出/导入
> - 代码模块化重构
> - 中英文 i18n
> - PWA 离线支持
>
> **Estimated Effort**: XL（20 项，估计 200-400 小时开发量）
> **Parallel Execution**: YES — 6 Waves
> **Critical Path**: Wave 1 (DID/DTC/ISO-TP/刷写) → Wave 3-4 (CAN/多ECU/动画) → Wave 5-6 (工程化)

---

## Context

### Original Request
全面审计项目后，为 uds-study-tool 生成完整的未来开发路线图，覆盖所有待实现功能。

### 当前状态 (As-Is)
- **学习工具**: 26 服务定义、74 NRC、4 会话、服务地图、消息构造器、26 题测验
- **模拟器**: ECU 状态机（4会话×3安全等级）、24 个服务处理器、16 DID、13 场景、权限矩阵

### Metis Review
[Metis 审查结果将在生成后合并到此字段]

---

## Work Objectives

### Core Objective
在 6 个执行波次中完成 20 项功能增强，将 UDS Study Tool 从基础原型提升为专业级 UDS 教学/仿真平台。

### Concrete Deliverables
见下方 TODO 列表——共 20 项 + 4 项最终验证。

### Definition of Done
- [ ] 所有 20 项 TODO 均完成并经过 QA 验证
- [ ] F1-F4 最终验证波全部通过
- [ ] 用户显式确认满意

### Must Have
- 每项任务都有可执行的 Agent QA 场景
- 模拟器向后兼容——不能破坏现有场景
- 所有 UI 新增功能支持深色/亮色主题
- 学习工具和模拟器的数据源保持一致

### Must NOT Have (Guardrails)
- 不引入外部依赖/运行时（保持纯前端 HTML）
- 不拆分两份 HTML 的绑定关系（模块化≠分离运行）
- 不改变现有 UDS 标准定义（SID、NRC、会话规则）
- 不添加登录/用户系统（本地工具）
- 不在教学动画中引入 WebGL/3D（保持轻量）

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO (纯前端 UI 工具，无测试框架)
- **Agent QA**: ALWAYS — Playwright + 浏览器截图验证

### QA Policy
- **新增 UI 组件**: Playwright 截图 + 点击/输入/断言 DOM
- **ECU 状态变更**: 发送请求 → 验证日志响应内容
- **数据持久化**: localStorage 读写验证
- **跨文件一致性**: 模拟器修改后验证学习工具对应更新

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — 4 tasks, parallel):
├── 1. DID Editor
├── 2. DTC Injection Panel
├── 3. ISO-TP Simulation
└── 4. Flash Programming Flow

Wave 2 (Matrix + History — 2 tasks, parallel):
├── 5. Session-Service Matrix Heatmap
└── 6. Request History Save/Load

Wave 3 (Teaching — 4 tasks, depends on Wave 1-2):
├── 7. Protocol Animation
├── 8. Structured UDS Decoding
├── 9. Error Injection Teaching
└── 10. Timeline Chart

Wave 4 (Advanced Sim — 3 tasks, depends on Wave 1):
├── 11. Multi-ECU Simulation
├── 12. CAN Bus Communication Simulation
├── 13. DoIP Entry
└── 14. OBD-II Compatibility

Wave 5 (QoL — 3 tasks, parallel):
├── 15. Study Notes/Bookmarks
├── 16. Quiz Expansion (100+)
└── 17. Protocol Stack Architecture Diagram

Wave 6 (Engineering — 3 tasks, depends on ALL prev):
├── 18. Code Modularization
├── 19. i18n (zh/en)
└── 20. PWA Offline

Wave FINAL (4 parallel reviews):
├── F1: Plan Compliance Audit (oracle)
├── F2: Code Quality + No Regression
├── F3: Full QA Scenario Execution
└── F4: Scope Fidelity Check
```

### Dependency Matrix
```
Task  Depends On        Blocks
1     —                 5,7,8,11
2     —                 5,9,11
3     —                 4,11,12
4     3                 11,13
5     1,2               —
6     —                 10
7     1,5,8             10
8     1                 7
9     2                 —
10    6,7               —
11    1,2,3,4           12,13,14
12    3,11              13
13    11,12             —
14    11                —
15    —                 18
16    —                 18
17    —                 18
18    15,16,17,19,20    —
19    —                 18
20    —                 18
```

---

## TODOs

> 所有 20 项按执行顺序排列。

---

## Final Verification Wave

## Commit Strategy

## Success Criteria
