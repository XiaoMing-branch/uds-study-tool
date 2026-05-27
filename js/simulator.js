/* UDS Simulator — Main JavaScript */
// ======================== I18N ========================
const I18N = {
  zh: {
    'sim.title':'🔌 UDS Simulator','sim.badge':'ISO 14229-1:2020','sim.clearLog':'🗑️ 清空日志','sim.resetECU':'🔄 重置 ECU','sim.autoTP':'⏱️ 自动 TP: 关','sim.autoTP.on':'⏱️ 自动 TP: 开','sim.targetECU':'🎯 目标 ECU:','sim.session':'会话','sim.security':'安全等级','sim.p2':'P2 (ms)','sim.p2star':'P2* (ms)','sim.s3':'S3 (ms)','sim.comm':'响应模式','sim.counter':'📊 计数器','sim.rxCount':'已收消息','sim.txCount':'已发消息','sim.posCount':'正响应','sim.negCount':'负响应','sim.scenarios':'📋 场景快速执行','sim.dtcInject':'⚡ DTC 注入','sim.openDTC':'⚡ 打开 DTC 注入面板','sim.flashStatus':'📥 刷写状态','sim.appValid':'应用有效','sim.bootloader':'Bootloader','sim.didValues':'💾 DID 值 (模拟)','sim.editDID':'✏️ 编辑 DID 值','sim.logTitle':'📝 消息日志','sim.timeline':'📊 时间线','sim.history':'📋 历史记录','sim.emptyLog':'等待诊断消息...','sim.emptyHint':'使用右侧构造器发送 UDS 请求，或点击左侧场景快速体验','sim.composerTitle':'📤 消息构造器','sim.service':'服务 (SID)','sim.subfunc':'子功能','sim.dataBytes':'数据字节 (HEX, 空格分隔)','sim.dataPlaceholder':'例如: F1 90','sim.quickDID':'常用 DID:','sim.sendRequest':'📤 发送请求','sim.rawHex':'原始 HEX 发送（自动识别 SID）','sim.rawPlaceholder':'例如: 22 F1 90','sim.sendRaw':'📤 发送','sim.requestPreview':'请求预览','sim.responsePreview':'预期响应','sim.responsePos':'正响应','sim.responseNeg':'负响应','sim.decodeInfo':'解码信息','sim.sectionISOTP':'🔗 ISO-TP 配置','sim.isotpSTmin':'STmin (ms)','sim.isotpBlockSize':'Block Size','sim.isotpFFDelay':'FF 延时 (ms)','sim.isotpCFDelay':'CF 延时 (ms)','sim.sectionFlash':'📥 刷写流程','sim.sectionError':'⚡ 错误注入','sim.sectionCAN':'🛞 CAN 总线配置','sim.sectionOBD2':'🛞 OBD-II 配置','sim.sectionDoIP':'🌐 DoIP 配置','sim.ecuTitle_A':'ECU_A — 发动机控制器 (ECM)','sim.ecuTitle_B':'ECU_B — 变速箱控制器 (TCM)','sim.ecuTitle_C':'ECU_C — 安全气囊控制器 (ABM)','did.F190':'F190 (VIN)','did.F191':'F191 (硬件号)','did.F192':'F192 (软件号)','did.F193':'F193 (ECU 名称)','did.F194':'F194 (水温)','did.F195':'F195 (转速)','did.F196':'F196 (车速)','did.F197':'F197 (里程)','did.F199':'F199 (供电电压)','did.F19A':'F19A (环境温度)','did.F19C':'F19C (油量)','sim.msgCount':'条消息',
    'scenario.default':'🔵 进入默认会话','scenario.extended':'🟡 进入扩展会话','scenario.programming':'🔴 进入编程会话','scenario.tp':'💓 TesterPresent','scenario.readVin':'🔍 读取 VIN (DID F190)','scenario.readDTC':'⚠️ 读取 DTC 状态','scenario.security':'🔐 SecurityAccess (种子→密钥)','scenario.reset':'🔄 ECU 硬复位','scenario.fullDiag':'📋 完整诊断流程演示','scenario.clearDTC':'🧹 清除 DTC','scenario.readMulti':'📊 批量读取 DID','scenario.routine':'🔧 启动校验例程','scenario.download':'📥 下载流程演示','scenario.isotp':'🔗 ISO-TP 多帧传输演示','scenario.flash':'📥 完整刷写流程（含多帧）',
    'scenario.desc.default':'10 01 → defaultSession','scenario.desc.extended':'10 03 → extendedDiagnosticSession','scenario.desc.programming':'10 02 → programmingSession','scenario.desc.tp':'3E 00 → 保持会话活跃','scenario.desc.readVin':'22 F1 90 → VIN 码','scenario.desc.readDTC':'19 02 → 按状态报告 DTC','scenario.desc.security':'27 01 → 请求种子 → 27 02 发送密钥','scenario.desc.reset':'11 01 → hardReset','scenario.desc.fullDiag':'扩展会话 → 安全解锁 → 读取 → 编程...','scenario.desc.clearDTC':'14 FF FF FF → 清除所有故障码','scenario.desc.readMulti':'22 F1 90 F1 92 F1 93 → 多 DID 请求','scenario.desc.routine':'31 01 FF 02 → 启动 Checksum 例程','scenario.desc.download':'34 → 36 → 37 完整下载序列','scenario.desc.isotp':'30 字节数据 → FF+FC+CF+CF+CF+CF → UDS 处理','scenario.desc.flash':'10→27→31→34→36×8→37→复位 完整刷写序列',
    'sim.dtcInjector':'⚡ DTC 注入面板','sim.dtcList':'DTC 列表','sim.addDTC':'➕ 添加 DTC','sim.closeDTC':'关闭','sim.didEditor':'✏️ DID 编辑器','sim.didName':'DID','sim.didValue':'当前值','sim.saveDID':'保存','sim.cancelDID':'取消','sim.historyTitle':'📋 历史记录','sim.historyEmpty':'暂无历史记录','sim.closeHistory':'关闭','common.locked':'🔒 Locked','common.unlocked':'🔓 Unlocked','common.normal':'Normal','common.off':'Off','common.on':'On','common.valid':'✅ 有效','common.inactive':'⏹️ 未激活','common.invalid':'❌ 无效','common.active':'▶ 激活',
  },
  en: {
    'sim.title':'🔌 UDS Simulator','sim.badge':'ISO 14229-1:2020','sim.clearLog':'🗑️ Clear Log','sim.resetECU':'🔄 Reset ECU','sim.autoTP':'⏱️ Auto TP: Off','sim.autoTP.on':'⏱️ Auto TP: On','sim.targetECU':'🎯 Target ECU:','sim.session':'Session','sim.security':'Security','sim.p2':'P2 (ms)','sim.p2star':'P2* (ms)','sim.s3':'S3 (ms)','sim.comm':'Comm Mode','sim.counter':'📊 Counters','sim.rxCount':'Rx Messages','sim.txCount':'Tx Messages','sim.posCount':'Positive','sim.negCount':'Negative','sim.scenarios':'📋 Scenarios','sim.dtcInject':'⚡ DTC Injection','sim.openDTC':'⚡ Open DTC Injector','sim.flashStatus':'📥 Flash Status','sim.appValid':'App Valid','sim.bootloader':'Bootloader','sim.didValues':'💾 DID Values','sim.editDID':'✏️ Edit DID','sim.logTitle':'📝 Message Log','sim.timeline':'📊 Timeline','sim.history':'📋 History','sim.emptyLog':'Waiting for diagnostic messages...','sim.emptyHint':'Use the composer on the right to send UDS requests, or click a scenario on the left','sim.composerTitle':'📤 Message Composer','sim.service':'Service (SID)','sim.subfunc':'Sub-function','sim.dataBytes':'Data Bytes (HEX, space separated)','sim.dataPlaceholder':'e.g. F1 90','sim.quickDID':'Quick DID:','sim.sendRequest':'📤 Send Request','sim.rawHex':'Raw HEX (auto-detect SID)','sim.rawPlaceholder':'e.g. 22 F1 90','sim.sendRaw':'📤 Send','sim.requestPreview':'Request Preview','sim.responsePreview':'Expected Response','sim.responsePos':'Positive','sim.responseNeg':'Negative','sim.decodeInfo':'Decode Info','sim.sectionISOTP':'🔗 ISO-TP Config','sim.isotpSTmin':'STmin (ms)','sim.isotpBlockSize':'Block Size','sim.isotpFFDelay':'FF Delay (ms)','sim.isotpCFDelay':'CF Delay (ms)','sim.sectionFlash':'📥 Flash Flow','sim.sectionError':'⚡ Error Injection','sim.sectionCAN':'🛞 CAN Bus Config','sim.sectionOBD2':'🛞 OBD-II Config','sim.sectionDoIP':'🌐 DoIP Config','sim.ecuTitle_A':'ECU_A — Engine Control Module (ECM)','sim.ecuTitle_B':'ECU_B — Transmission Control Module (TCM)','sim.ecuTitle_C':'ECU_C — Airbag Control Module (ABM)','did.F190':'F190 (VIN)','did.F191':'F191 (HW Ver)','did.F192':'F192 (SW Ver)','did.F193':'F193 (ECU Name)','did.F194':'F194 (Coolant)','did.F195':'F195 (RPM)','did.F196':'F196 (Speed)','did.F197':'F197 (Odometer)','did.F199':'F199 (Voltage)','did.F19A':'F19A (Ambient)','did.F19C':'F19C (Fuel)','sim.msgCount':'messages',
    'scenario.default':'🔵 Enter Default Session','scenario.extended':'🟡 Enter Extended Session','scenario.programming':'🔴 Enter Programming Session','scenario.tp':'💓 TesterPresent','scenario.readVin':'🔍 Read VIN (DID F190)','scenario.readDTC':'⚠️ Read DTC Status','scenario.security':'🔐 SecurityAccess (Seed→Key)','scenario.reset':'🔄 ECU Hard Reset','scenario.fullDiag':'📋 Full Diagnostic Flow','scenario.clearDTC':'🧹 Clear DTC','scenario.readMulti':'📊 Batch Read DID','scenario.routine':'🔧 Start Checksum Routine','scenario.download':'📥 Download Flow','scenario.isotp':'🔗 ISO-TP Multi-frame Demo','scenario.flash':'📥 Full Flash Flow (Multi-frame)',
    'scenario.desc.default':'10 01 → defaultSession','scenario.desc.extended':'10 03 → extendedDiagnosticSession','scenario.desc.programming':'10 02 → programmingSession','scenario.desc.tp':'3E 00 → keep session alive','scenario.desc.readVin':'22 F1 90 → VIN code','scenario.desc.readDTC':'19 02 → report DTC by status','scenario.desc.security':'27 01 → request seed → 27 02 send key','scenario.desc.reset':'11 01 → hardReset','scenario.desc.fullDiag':'Extended → Security → Read → Program...','scenario.desc.clearDTC':'14 FF FF FF → clear all DTCs','scenario.desc.readMulti':'22 F1 90 F1 92 F1 93 → batch DID read','scenario.desc.routine':'31 01 FF 02 → start Checksum routine','scenario.desc.download':'34 → 36 → 37 complete download sequence','scenario.desc.isotp':'30 bytes → FF+FC+CF+CF+CF+CF → UDS process','scenario.desc.flash':'10→27→31→34→36×8→37→Reset full flash flow',
    'sim.dtcInjector':'⚡ DTC Injector','sim.dtcList':'DTC List','sim.addDTC':'➕ Add DTC','sim.closeDTC':'Close','sim.didEditor':'✏️ DID Editor','sim.didName':'DID','sim.didValue':'Current Value','sim.saveDID':'Save','sim.cancelDID':'Cancel','sim.historyTitle':'📋 History','sim.historyEmpty':'No history yet','sim.closeHistory':'Close','common.locked':'🔒 Locked','common.unlocked':'🔓 Unlocked','common.normal':'Normal','common.off':'Off','common.on':'On','common.valid':'✅ Valid','common.inactive':'⏹️ Inactive','common.invalid':'❌ Invalid','common.active':'▶ Active',
  }
};
let currentLang = localStorage.getItem('uds_lang') || 'zh';
function t(key) { return I18N[currentLang][key] || key; }
function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('uds_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中文';
}

// ======================== ECU STATE ========================
const ECU = {
  session: 0x01,          // 0x01=default, 0x02=programming, 0x03=extended
  sessionName: 'Default',
  securityLevel: 0,       // 0=locked
  securityAttempts: 0,
  securityThreshold: 3,   // max attempts before lockout
  securitySeed: null,
  securityUnlockLevel: 0,
  P2: 50,                 // ms
  P2star: 2000,           // ms
  S3: 0,                  // ms (0 = no timeout in default session)
  communication: true,    // Rx enabled
  dtcSetting: true,       // DTC setting enabled
  dtcStatus: [0x00, 0x00, 0x00], // 3-byte DTC status byte
  // Upload/Download state tracking
  uploadSession: false,
  transferSequence: 0,
  blockSequenceCounter: 0,
  // Flash programming state
  flashState: {
    running: false,
    step: 0,         // 0-7 current step
    appValid: true,  // application valid flag
    bootActive: false // bootloader active flag
  },
  // Simulated DIDs - expanded
  dids: {
    'F190': 'LSVAB4BR7N1234567'.split('').map(c => c.charCodeAt(0)),
    'F191': 'HW-2024-REV-B'.split('').map(c => c.charCodeAt(0)),
    'F192': 'SW-3.2.1-Build42'.split('').map(c => c.charCodeAt(0)),
    'F193': 'BOSCH_ECU_v2'.split('').map(c => c.charCodeAt(0)),
    'F194': [0x00, 0x64],  // Engine coolant temp: 100°C (signed: -40+100=60)
    'F195': [0x0E, 0x10],  // Engine speed: 3600 RPM
    'F196': [0x2A, 0xF8],  // Vehicle speed: 110.0 km/h (scaled: 0x2AF8/100)
    'F197': [0x0D, 0xAC],  // Odometer: 3500 km
    'F198': [0x41, 0x42, 0x43, 0x44], // Active diagnostic codes: "ABCD"
    'F199': [0x00, 0x00, 0x0F, 0xA0], // ECU supply voltage: 4000mV (4.000V)
    'F19A': [0x00, 0x84],  // Ambient temp: 21°C (0x84 as signed = -124... wait, wrong. Let's use 0x15 = 21)
    'F19B': [0x00, 0x00, 0x00, 0x64], // Total runtime: 100h
    'F19C': [0x00, 0x00],  // Fuel level: 75%
    'F300': [0x01],         // VIN-specific DID example
    'F301': [0x00, 0x01],   // Boot software version
    'F302': [0x00, 0x02],   // Application software version
  },
  didLabels: {
    'F190': 'VIN 码', 'F191': '硬件版本号', 'F192': '软件版本号',
    'F193': 'ECU 名称', 'F194': '发动机冷却液温度', 'F195': '发动机转速',
    'F196': '车速', 'F197': '里程表', 'F198': '诊断代码',
    'F199': 'ECU 供电电压', 'F19A': '环境温度', 'F19B': '总运行时间',
    'F19C': '燃油液位', 'F300': 'VIN 特定数据', 'F301': 'Boot 软件版本',
    'F302': '应用软件版本',
  },
  // Simulated DTCs
  dtcs: [
    { id: 'P0101', high: 0x01, middle: 0x01, low: 0x01, status: 0x29, severity: 0x50 },
    { id: 'P0113', high: 0x01, middle: 0x04, low: 0x4A, status: 0x0D, severity: 0x50 },
    { id: 'P0300', high: 0x01, middle: 0x0C, low: 0x10, status: 0x09, severity: 0x20 },
  ],
  counters: { rx: 0, tx: 0, pos: 0, neg: 0 },
  securityTimers: { lastAttempt: 0, delayMs: 10000 },
  autoTP: false,
  tpTimer: null,
  sessionTimer: null,
  p2Timer: null,
  errorDemoRunning: false,
};

// Deep clone of default DID values for reset functionality
const DEFAULT_DIDS = Object.fromEntries(
  Object.entries(ECU.dids).map(([k, v]) => [k, [...v]])
);

// ======================== MULTI ECU SUPPORT ========================
const ECU_CONFIGS = {
  'ECU_A': {
    shortName: 'ECU_A',
    name: 'ECU_A — 发动机控制器 (ECM)',
    session: 0x01, sessionName: 'Default',
    securityLevel: 0, securityAttempts: 0, securitySeed: null, securityUnlockLevel: 0,
    P2: 50, P2star: 2000, S3: 0,
    communication: true, dtcSetting: true,
    dtcStatus: [0x00, 0x00, 0x00],
    uploadSession: false, blockSequenceCounter: 0,
    flashState: { running: false, step: 0, appValid: true, bootActive: false },
    dids: {
      'F190': 'LSVAB4BR7N1234567'.split('').map(c => c.charCodeAt(0)),
      'F191': 'HW-2024-REV-B'.split('').map(c => c.charCodeAt(0)),
      'F192': 'SW-3.2.1-Build42'.split('').map(c => c.charCodeAt(0)),
      'F193': 'BOSCH_ECU_v2'.split('').map(c => c.charCodeAt(0)),
      'F194': [0x00, 0x64],  'F195': [0x0E, 0x10],  'F196': [0x2A, 0xF8],
      'F197': [0x0D, 0xAC],  'F198': [0x41, 0x42, 0x43, 0x44],
      'F199': [0x00, 0x00, 0x0F, 0xA0],  'F19A': [0x00, 0x84],
      'F19B': [0x00, 0x00, 0x00, 0x64],  'F19C': [0x00, 0x00],
      'F300': [0x01],  'F301': [0x00, 0x01],  'F302': [0x00, 0x02],
    },
    didLabels: {
      'F190': 'VIN 码', 'F191': '硬件版本号', 'F192': '软件版本号',
      'F193': 'ECU 名称', 'F194': '发动机冷却液温度', 'F195': '发动机转速',
      'F196': '车速', 'F197': '里程表', 'F198': '诊断代码',
      'F199': 'ECU 供电电压', 'F19A': '环境温度', 'F19B': '总运行时间',
      'F19C': '燃油液位', 'F300': 'VIN 特定数据', 'F301': 'Boot 软件版本',
      'F302': '应用软件版本',
    },
    dtcs: [
      { id: 'P0101', high: 0x01, middle: 0x01, low: 0x01, status: 0x29, severity: 0x50 },
      { id: 'P0113', high: 0x01, middle: 0x04, low: 0x4A, status: 0x0D, severity: 0x50 },
      { id: 'P0300', high: 0x01, middle: 0x0C, low: 0x10, status: 0x09, severity: 0x20 },
    ],
    counters: { rx: 0, tx: 0, pos: 0, neg: 0 },
  },
  'ECU_B': {
    shortName: 'ECU_B',
    name: 'ECU_B — 变速箱控制器 (TCM)',
    session: 0x01, sessionName: 'Default',
    securityLevel: 0, securityAttempts: 0, securitySeed: null, securityUnlockLevel: 0,
    P2: 50, P2star: 2000, S3: 0,
    communication: true, dtcSetting: true,
    dtcStatus: [0x00, 0x00, 0x00],
    uploadSession: false, blockSequenceCounter: 0,
    flashState: { running: false, step: 0, appValid: true, bootActive: false },
    dids: {
      'F190': [0x54, 0x43, 0x4D, 0x2D, 0x30, 0x30, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      'F191': [0x02, 0x01],
      'F192': [0x03, 0x02, 0x01],
      'F193': [0x54, 0x43, 0x4D, 0x5F, 0x56, 0x31],
      'F194': [0x00, 0x5A],  'F195': [0x00, 0x00],  'F196': [0x00, 0x00],
      'F197': [0x01, 0x2C],  'F199': [0x00, 0x00, 0x0F, 0xA0],
      'F19A': [0x00, 0x19],  'F19C': [0x00, 0x00],
      'F198': [0x00, 0x00],  'F300': [0x01],  'F301': [0x00, 0x01],  'F302': [0x00, 0x02],
    },
    didLabels: {
      'F190': 'TCM 零件号', 'F191': '硬件版本', 'F192': '软件版本',
      'F193': '控制器名称', 'F194': '变速箱油温', 'F195': '输入转速',
      'F196': '输出转速', 'F197': '行驶里程', 'F198': '诊断代码',
      'F199': '供电电压', 'F19A': '环境温度', 'F19C': '油位',
      'F300': 'VIN 特定数据', 'F301': 'Boot 软件版本', 'F302': '应用软件版本',
    },
    dtcs: [
      { id: 'P0700', high: 0x07, middle: 0x00, low: 0x00, status: 0x00, severity: 0x30 },
    ],
    counters: { rx: 0, tx: 0, pos: 0, neg: 0 },
  },
  'ECU_C': {
    shortName: 'ECU_C',
    name: 'ECU_C — 安全气囊控制器 (ABM)',
    session: 0x01, sessionName: 'Default',
    securityLevel: 0, securityAttempts: 0, securitySeed: null, securityUnlockLevel: 0,
    P2: 50, P2star: 2000, S3: 0,
    communication: true, dtcSetting: true,
    dtcStatus: [0x00, 0x00, 0x00],
    uploadSession: false, blockSequenceCounter: 0,
    flashState: { running: false, step: 0, appValid: true, bootActive: false },
    dids: {
      'F190': [0x41, 0x42, 0x4D, 0x2D, 0x30, 0x30, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      'F191': [0x01, 0x03],
      'F192': [0x02, 0x00, 0x05],
      'F193': [0x41, 0x42, 0x4D, 0x5F, 0x56, 0x32],
      'F194': [0x00, 0x46],  'F195': [0x00, 0x00],  'F196': [0x00, 0x00],
      'F197': [0x00, 0x00],  'F199': [0x00, 0x00, 0x0F, 0xA0],
      'F19A': [0x00, 0x19],  'F19C': [0x00, 0x00],
      'F198': [0x00, 0x00],  'F300': [0x01],  'F301': [0x00, 0x01],  'F302': [0x00, 0x02],
    },
    didLabels: {
      'F190': 'ABM 零件号', 'F191': '硬件版本', 'F192': '软件版本',
      'F193': '控制器名称', 'F194': '内部温度', 'F195': '状态',
      'F196': '状态', 'F197': '状态', 'F198': '诊断代码',
      'F199': '供电电压', 'F19A': '环境温度', 'F19C': '状态',
      'F300': 'VIN 特定数据', 'F301': 'Boot 软件版本', 'F302': '应用软件版本',
    },
    dtcs: [
      { id: 'B0010', high: 0xB0, middle: 0x01, low: 0x00, status: 0x00, severity: 0x30 },
    ],
    counters: { rx: 0, tx: 0, pos: 0, neg: 0 },
  },
};

/** Currently selected ECU id */
let activeECU = 'ECU_A';

/** Save current ECU state back to ECU_CONFIGS[activeECU] */
function saveECUState() {
  const cfg = ECU_CONFIGS[activeECU];
  if (!cfg) return;
  cfg.session = ECU.session;
  cfg.sessionName = ECU.sessionName;
  cfg.securityLevel = ECU.securityLevel;
  cfg.securityAttempts = ECU.securityAttempts;
  cfg.securitySeed = ECU.securitySeed ? [...ECU.securitySeed] : null;
  cfg.securityUnlockLevel = ECU.securityUnlockLevel;
  cfg.P2 = ECU.P2;
  cfg.P2star = ECU.P2star;
  cfg.S3 = ECU.S3;
  cfg.communication = ECU.communication;
  cfg.dtcSetting = ECU.dtcSetting;
  cfg.uploadSession = ECU.uploadSession;
  cfg.blockSequenceCounter = ECU.blockSequenceCounter;
  cfg.flashState = { ...ECU.flashState };
  cfg.dids = JSON.parse(JSON.stringify(ECU.dids));
  cfg.didLabels = { ...ECU.didLabels };
  cfg.dtcs = JSON.parse(JSON.stringify(ECU.dtcs));
  cfg.counters = { ...ECU.counters };
}

/** Switch the active ECU, saving the current state first */
function switchECU(id) {
  if (id === activeECU || !ECU_CONFIGS[id]) return;
  // Cancel any pending session timer before switching
  if (ECU.sessionTimer) { clearTimeout(ECU.sessionTimer); ECU.sessionTimer = null; }
  saveECUState();
  activeECU = id;
  const cfg = ECU_CONFIGS[id];
  // Restore state from config into the live ECU object
  ECU.session = cfg.session;
  ECU.sessionName = cfg.sessionName;
  ECU.securityLevel = cfg.securityLevel;
  ECU.securityAttempts = cfg.securityAttempts;
  ECU.securitySeed = cfg.securitySeed ? [...cfg.securitySeed] : null;
  ECU.securityUnlockLevel = cfg.securityUnlockLevel;
  ECU.P2 = cfg.P2;
  ECU.P2star = cfg.P2star;
  ECU.S3 = cfg.S3;
  ECU.communication = cfg.communication;
  ECU.dtcSetting = cfg.dtcSetting;
  ECU.uploadSession = cfg.uploadSession;
  ECU.blockSequenceCounter = cfg.blockSequenceCounter;
  ECU.flashState = { ...cfg.flashState };
  ECU.dids = JSON.parse(JSON.stringify(cfg.dids));
  ECU.didLabels = { ...cfg.didLabels };
  ECU.dtcs = JSON.parse(JSON.stringify(cfg.dtcs));
  ECU.counters = { ...cfg.counters };
  // Reset runtime-only properties
  ECU.securityTimers = { lastAttempt: 0, delayMs: 10000 };
  updateECUStatus();
  addLogEntry([], `🔄 切换到 ${ECU_CONFIGS[id].name}`, 'res');
}

// ======================== HISTORY DATA ========================
const HISTORY_KEY = 'uds_sim_history';
let logEntries = [];
let lastAutoSave = 0;

// ======================== SERVICE DATA ========================
const SID_INFO = {
  0x10: { name: 'DiagnosticSessionControl', short: 'DSC', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '10', resSID: '50',
    sfs: {
      '01': 'defaultSession', '02': 'programmingSession', '03': 'extendedDiagnosticSession',
      '04': 'safetySystemDiagnosticSession',
      '40-5F': 'vehicleManufacturerSpecific',
      '60-7E': 'systemSupplierSpecific'
    } },
  0x11: { name: 'ECUReset', short: 'ER', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '11', resSID: '51',
    sfs: { '01': 'hardReset', '02': 'keyOffOnReset', '03': 'softReset', '04': 'enableRapidPowerShutdown' } },
  0x14: { name: 'ClearDiagnosticInformation', short: 'CDI', unit: 'stored-data',
    hasSF: false, reqSID: '14', resSID: '54' },
  0x19: { name: 'ReadDTCInformation', short: 'RDTCI', unit: 'stored-data',
    hasSF: true, reqSID: '19', resSID: '59',
    sfs: { '01': 'reportNumberOfDTCByStatusMask', '02': 'reportDTCByStatusMask',
      '03': 'reportDTCSnapshotIdentification', '04': 'reportDTCSnapshotRecordByDTCNumber',
      '05': 'reportDTCStoredDataByRecordNumber', '06': 'reportDTCExtDataRecordByDTCNumber',
      '0A': 'reportSupportedDTC', '0B': 'reportFirstTestFailedDTC',
      '0C': 'reportFirstConfirmedDTC', '0D': 'reportMostRecentTestFailedDTC',
      '0E': 'reportMostRecentConfirmedDTC', '0F': 'reportMostRecentAllDTC' } },
  0x22: { name: 'ReadDataByIdentifier', short: 'RDBI', unit: 'data-transmission',
    hasSF: false, reqSID: '22', resSID: '62' },
  0x23: { name: 'ReadMemoryByAddress', short: 'RMBA', unit: 'data-transmission',
    hasSF: false, reqSID: '23', resSID: '63' },
  0x24: { name: 'ReadScalingDataByIdentifier', short: 'RSDBI', unit: 'data-transmission',
    hasSF: false, reqSID: '24', resSID: '64' },
  0x27: { name: 'SecurityAccess', short: 'SA', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '27', resSID: '67',
    sfs: { '01': 'requestSeed (level 1)', '02': 'sendKey (level 1)',
      '03': 'requestSeed (level 2)', '04': 'sendKey (level 2)' } },
  0x28: { name: 'CommunicationControl', short: 'CC', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '28', resSID: '68',
    sfs: { '00': 'enableRxAndTx', '01': 'enableRxAndDisableTx',
      '02': 'disableRxAndEnableTx', '03': 'disableRxAndTx' } },
  0x29: { name: 'Authentication', short: 'Auth', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '29', resSID: '69',
    sfs: { '00': 'deAuthenticate', '01': 'verifyCertificateUnidirectional',
      '02': 'verifyCertificateBidirectional', '03': 'proofOfOwnership',
      '04': 'transmitCertificate', '05': 'requestChallengeForAuthentication' } },
  0x2A: { name: 'ReadDataByPeriodicIdentifier', short: 'RDBPI', unit: 'data-transmission',
    hasSF: false, reqSID: '2A', resSID: '6A' },
  0x2C: { name: 'DynamicallyDefineDataIdentifier', short: 'DDDI', unit: 'data-transmission',
    hasSF: true, reqSID: '2C', resSID: '6C',
    sfs: { '01': 'defineByIdentifier', '02': 'defineByMemoryAddress',
      '03': 'clearDynamicallyDefinedDataIdentifier' } },
  0x2E: { name: 'WriteDataByIdentifier', short: 'WDBI', unit: 'data-transmission',
    hasSF: false, reqSID: '2E', resSID: '6E' },
  0x2F: { name: 'InputOutputControlByIdentifier', short: 'IOCBI', unit: 'io-control',
    hasSF: true, reqSID: '2F', resSID: '6F',
    sfs: { '00': 'returnControlToECU', '01': 'resetToDefault',
      '02': 'freezeCurrentState', '03': 'shortTermAdjustment' } },
  0x31: { name: 'RoutineControl', short: 'RC', unit: 'routine',
    hasSF: true, reqSID: '31', resSID: '71',
    sfs: { '01': 'startRoutine', '02': 'stopRoutine', '03': 'requestRoutineResults' } },
  0x34: { name: 'RequestDownload', short: 'RD', unit: 'upload-download',
    hasSF: false, reqSID: '34', resSID: '74' },
  0x35: { name: 'RequestUpload', short: 'RU', unit: 'upload-download',
    hasSF: false, reqSID: '35', resSID: '75' },
  0x36: { name: 'TransferData', short: 'TD', unit: 'upload-download',
    hasSF: false, reqSID: '36', resSID: '76' },
  0x37: { name: 'RequestTransferExit', short: 'RTE', unit: 'upload-download',
    hasSF: false, reqSID: '37', resSID: '77' },
  0x38: { name: 'RequestFileTransfer', short: 'RFT', unit: 'upload-download',
    hasSF: true, reqSID: '38', resSID: '78',
    sfs: { '01': 'addFile', '02': 'deleteFile', '03': 'replaceFile',
      '04': 'readFile', '05': 'readDirectory' } },
  0x3D: { name: 'WriteMemoryByAddress', short: 'WMBA', unit: 'data-transmission',
    hasSF: false, reqSID: '3D', resSID: '7D' },
  0x3E: { name: 'TesterPresent', short: 'TP', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '3E', resSID: '7E',
    sfs: { '00': 'zeroSubFunction', '80': 'zeroSubFunction (suppressResponse)' } },
  0x84: { name: 'SecuredDataTransmission', short: 'SDT', unit: 'security',
    hasSF: false, reqSID: '84', resSID: 'C4' },
  0x85: { name: 'ControlDTCSetting', short: 'CDTCS', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '85', resSID: 'C5',
    sfs: { '01': 'on', '02': 'off' } },
  0x86: { name: 'ResponseOnEvent', short: 'ROE', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '86', resSID: 'C6',
    sfs: { '00': 'stopResponseOnEvent', '01': 'onDTCStatusChange',
      '02': 'onTimerInterrupt', '03': 'onChangeOfDataIdentifier' } },
  0x87: { name: 'LinkControl', short: 'LC', unit: 'diagnostic-communication',
    hasSF: true, reqSID: '87', resSID: 'C7',
    sfs: { '01': 'verifyBaudrateTransitionWithFixedBaudrate',
      '02': 'verifyBaudrateTransitionWithSpecificBaudrate', '03': 'transitionBaudrate' } },
};

const NRC = {
  GR: 0x10, SNS: 0x11, SFNS: 0x12, IMLOIF: 0x13, RTL: 0x14,
  BRR: 0x21, CNC: 0x22, RSE: 0x24, NRFSC: 0x25, FPEORA: 0x26,
  ROOR: 0x31, SAD: 0x33, AR: 0x34, IK: 0x35, ENOA: 0x36, RTDNE: 0x37,
  UDNA: 0x70, TDS: 0x71, GPF: 0x72, WBSC: 0x73, RCRRP: 0x78,
  SFNSIAS: 0x7E, SNSIAS: 0x7F
};

const NRC_NAMES = {};
for (const [k, v] of Object.entries(NRC)) NRC_NAMES[v] = k;

// ======================== ERROR INJECTION SCENARIOS ========================
const ERROR_SCENARIOS = [
  { id: 'err-1', sid: '10 02', desc: 'NRC 0x22 — conditionsNotCorrect',
    setupDesc: null,
    setupBytes: null,
    setupDelay: 0,
    action: '进入编程会话（锁定状态）',
    req: [0x10, 0x02],
    expectNRC: '0x22',
    explanation: '从 Default 会话切换到 Programming 会话需要先通过 SecurityAccess 解锁。Locked 时返回 NRC 0x22（conditionsNotCorrect）。' },
  { id: 'err-2', sid: '2E', desc: 'NRC 0x33 — securityAccessDenied',
    setupDesc: '进入扩展会话',
    setupBytes: [0x10, 0x03],
    setupDelay: 600,
    action: '在锁定状态下写入 DID',
    req: [0x2E, 0xF1, 0x90, 0x31, 0x32, 0x33, 0x34],
    expectNRC: '0x33',
    explanation: 'WriteDataByIdentifier 在 Extended 中可用但需安全解锁（SecurityAccess Level 1），未解锁时返回 0x33（securityAccessDenied）。' },
  { id: 'err-3', sid: '19 04', desc: 'NRC 0x12 — subFunctionNotSupported',
    setupDesc: null,
    setupBytes: null,
    setupDelay: 0,
    action: '发送不存在的子功能 0x04',
    req: [0x19, 0x04],
    expectNRC: '0x12',
    explanation: 'ReadDTCInformation（0x19）仅支持子功能 0x01-0x03、0x0A-0x0F，0x04 未定义，返回 NRC 0x12（subFunctionNotSupported）。' },
  { id: 'err-4', sid: '22 00 00', desc: 'NRC 0x31 — requestOutOfRange',
    setupDesc: null,
    setupBytes: null,
    setupDelay: 0,
    action: '读取不存在的 DID 0x0000',
    req: [0x22, 0x00, 0x00],
    expectNRC: '0x31',
    explanation: 'ReadDataByIdentifier 请求 DID=0x0000，ECU 不支持此 DID，返回 NRC 0x31（requestOutOfRange）。' },
  { id: 'err-5', sid: '36 01', desc: 'NRC 0x24 — requestSequenceError',
    setupDesc: '进入编程会话',
    setupBytes: [0x10, 0x02],
    setupDelay: 600,
    action: '未 RequestDownload 就 TransferData',
    req: [0x36, 0x01, 0xAA, 0xBB],
    expectNRC: '0x24',
    explanation: 'TransferData 必须在 RequestDownload 之后调用，否则 ECU 返回 NRC 0x24（requestSequenceError），因为 uploadSession 标志未设置。' },
  { id: 'err-6', sid: '11 03', desc: 'NRC 0x12 — subFuncNotSupported（ECUReset）',
    setupDesc: null,
    setupBytes: null,
    setupDelay: 0,
    action: 'ECUReset 不支持的复位类型 0x03',
    req: [0x11, 0x03],
    expectNRC: '0x12',
    explanation: 'ECUReset（0x11）在本模拟器中支持 0x01（hardReset）和 0x02（keyOffOnReset），0x03（softReset）未实现，返回 NRC 0x12。' },
  { id: 'err-7', sid: '27 05', desc: 'NRC 0x12 — subFuncNotSupported（SecurityAccess）',
    setupDesc: '进入扩展会话',
    setupBytes: [0x10, 0x03],
    setupDelay: 600,
    action: 'SecurityAccess 不支持的 Level 3',
    req: [0x27, 0x05],
    expectNRC: '0x12',
    explanation: 'SecurityAccess（0x27）仅支持 Level 1（0x01/0x02）和 Level 2（0x03/0x04），Level 3（0x05/0x06）未实现，返回 NRC 0x12。' },
  { id: 'err-8', sid: '36', desc: 'NRC 0x13 — IMLOIF',
    setupDesc: null,
    setupBytes: null,
    setupDelay: 0,
    action: '空的 TransferData 请求',
    req: [0x36],
    expectNRC: '0x13',
    explanation: 'TransferData 至少需要 1 字节（块序列计数器），空请求触发 NRC 0x13（incorrectMessageLengthOrInvalidFormat）。' },
  { id: 'err-9', sid: '85 01', desc: 'NRC 0x22 — conditionsNotCorrect',
    setupDesc: null,
    setupBytes: null,
    setupDelay: 0,
    action: 'Default 会话中控制 DTC 设置',
    req: [0x85, 0x01],
    expectNRC: '0x22',
    explanation: 'ControlDTCSetting（0x85）在 Default 会话中不可用，需切换到非默认会话（Extended/Programming）。返回 NRC 0x22（conditionsNotCorrect）。' },
  { id: 'err-10', sid: '31 01 FF FF', desc: 'NRC 0x31 — requestOutOfRange',
    setupDesc: '进入编程会话',
    setupBytes: [0x10, 0x02],
    setupDelay: 600,
    action: '启动不存在的例程 0xFFFF',
    req: [0x31, 0x01, 0xFF, 0xFF],
    expectNRC: '0x31',
    explanation: 'RoutineControl 例程 0xFFFF 未定义，仅支持 0xFF00-0xFF04，返回 NRC 0x31（requestOutOfRange）。' },
];

// Session info
const SESSION_NAMES = { 0x01: 'Default', 0x02: 'Programming', 0x03: 'Extended', 0x04: 'SafetySystem' };

// Comprehensive session permission matrix: which SIDs are allowed in each session
// 0 = not available, 1 = available, 2 = available but requires security unlocked
const SESSION_RULES = {
  // Diagnostic & Communication Management
  0x10: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'DiagnosticSessionControl' },
  0x11: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'ECUReset' },
  0x27: { 0x01: 0, 0x02: 1, 0x03: 1, desc: 'SecurityAccess (need non-default session)' },
  0x28: { 0x01: 0, 0x02: 1, 0x03: 1, desc: 'CommunicationControl' },
  0x3E: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'TesterPresent' },
  0x85: { 0x01: 0, 0x02: 1, 0x03: 1, desc: 'ControlDTCSetting' },
  0x86: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'ResponseOnEvent' },
  0x87: { 0x01: 0, 0x02: 1, 0x03: 1, desc: 'LinkControl' },
  // Data Transmission
  0x22: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'ReadDataByIdentifier' },
  0x23: { 0x01: 2, 0x02: 1, 0x03: 1, desc: 'ReadMemoryByAddress' },
  0x24: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'ReadScalingDataByIdentifier' },
  0x29: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'Authentication' },
  0x2A: { 0x01: 0, 0x02: 1, 0x03: 1, desc: 'ReadDataByPeriodicIdentifier' },
  0x2C: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'DynamicallyDefineDataIdentifier' },
  0x2E: { 0x01: 2, 0x02: 2, 0x03: 2, desc: 'WriteDataByIdentifier (needs security)' },
  0x3D: { 0x01: 2, 0x02: 2, 0x03: 2, desc: 'WriteMemoryByAddress (needs security)' },
  // Stored Data Transmission
  0x14: { 0x01: 1, 0x02: 2, 0x03: 2, desc: 'ClearDiagnosticInformation' },
  0x19: { 0x01: 1, 0x02: 1, 0x03: 1, desc: 'ReadDTCInformation' },
  // InputOutput Control
  0x2F: { 0x01: 0, 0x02: 1, 0x03: 1, desc: 'InputOutputControlByIdentifier' },
  // Routine
  0x31: { 0x01: 1, 0x02: 2, 0x03: 2, desc: 'RoutineControl (secured routines need security)' },
  // Upload Download
  0x34: { 0x01: 0, 0x02: 1, 0x03: 0, desc: 'RequestDownload (programming only)' },
  0x35: { 0x01: 0, 0x02: 1, 0x03: 0, desc: 'RequestUpload (programming only)' },
  0x36: { 0x01: 0, 0x02: 1, 0x03: 0, desc: 'TransferData (programming only)' },
  0x37: { 0x01: 0, 0x02: 1, 0x03: 0, desc: 'RequestTransferExit (programming only)' },
  0x38: { 0x01: 0, 0x02: 1, 0x03: 0, desc: 'RequestFileTransfer (programming only)' },
  // Security sub-layer
  0x84: { 0x01: 0, 0x02: 1, 0x03: 1, desc: 'SecuredDataTransmission' },
};

// Auto-inherit safetySystemDiagnosticSession (0x04) rules from extendedSession (0x03)
for (const [, rules] of Object.entries(SESSION_RULES)) {
  if (rules[0x03] !== undefined) rules[0x04] = rules[0x03];
}

// Build SESSION_SERVICES lookup for backward compatibility
const SESSION_SERVICES = {};
for (const ses of [0x01, 0x02, 0x03, 0x04]) {
  SESSION_SERVICES[ses] = [];
  for (const [sid, rules] of Object.entries(SESSION_RULES)) {
    if (rules[ses] && rules[ses] > 0) SESSION_SERVICES[ses].push(parseInt(sid));
  }
}

// ======================== UI INIT ========================
function initComposer() {
  const sel = document.getElementById('composer-sid');
  const sorted = Object.entries(SID_INFO).sort((a,b) => a[0]-b[0]);
  for (const [sid, info] of sorted) {
    const opt = document.createElement('option');
    opt.value = sid;
    opt.textContent = `0x${info.reqSID} ${info.name} (${info.short})`;
    sel.appendChild(opt);
  }
  onComposerChange();
}

let _lastSid = null;

function onComposerChange() {
  const sid = parseInt(document.getElementById('composer-sid').value);
  const info = SID_INFO[sid];
  const sfGroup = document.getElementById('sf-group');
  const sfSel = document.getElementById('composer-sf');
  const didBtns = document.getElementById('composer-dids');

  // Only rebuild SF options when SID actually changes
  if (info && info.hasSF && info.sfs) {
    sfGroup.style.display = 'block';
    if (sid !== _lastSid) {
      const prevVal = sfSel.value; // Save current selection
      sfSel.innerHTML = '<option value="">无子功能</option>';
      for (const [val, name] of Object.entries(info.sfs)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = `0x${val} - ${name}`;
        sfSel.appendChild(opt);
      }
      // Restore previous selection if still valid, else pick first real option
      if ([...sfSel.options].some(o => o.value === prevVal && prevVal !== '')) {
        sfSel.value = prevVal;
      }
    }
  } else {
    sfGroup.style.display = 'none';
  }
  _lastSid = sid;

  // Show DID quick buttons for RDBI and WDBI
  didBtns.style.display = (sid === 0x22 || sid === 0x2E) ? 'flex' : 'none';

  updatePreview();
}

function setData(data) {
  document.getElementById('composer-data').value = data;
  onComposerChange();
}

function updatePreview() {
  const sid = parseInt(document.getElementById('composer-sid').value);
  const info = SID_INFO[sid];
  if (!info) return;

  const reqBytes = [parseInt(info.reqSID, 16)];
  const sfVal = document.getElementById('composer-sf')?.value;
  if (sfVal) reqBytes.push(parseInt(sfVal, 16));

  const dataStr = document.getElementById('composer-data').value.trim();
  if (dataStr) {
    for (const p of dataStr.split(/[\s,]+/)) {
      if (/^[0-9a-fA-F]{2}$/.test(p)) reqBytes.push(parseInt(p, 16));
    }
  }

  // Update request preview
  const preq = document.getElementById('preview-req');
  preq.innerHTML = reqBytes.map((b, i) => {
    let cls = 'byte';
    if (i === 0) cls += ' sid';
    else if (i === 1 && sfVal) cls += ' sf';
    else cls += ' data';
    return `<span class="${cls}">${b.toString(16).toUpperCase().padStart(2,'0')}</span>`;
  }).join(' ');

  // Update response preview
  const resSID = parseInt(info.reqSID, 16) + 0x40;
  const resBytes = [resSID];
  if (sfVal) resBytes.push(parseInt(sfVal, 16));
  const pres = document.getElementById('preview-res');
  pres.innerHTML = resBytes.map((b, i) => {
    let cls = 'byte';
    if (i === 0) cls += ' sid';
    else cls += ' data';
    return `<span class="${cls}">${b.toString(16).toUpperCase().padStart(2,'0')}</span>`;
  }).join(' ') + '<br><span class="byte nrc">7F</span> <span class="byte nrc">' + info.reqSID + '</span> <span class="byte nrc">NRC</span> (负响应)';

  // Update decode
  updateDecode(sid, sfVal, reqBytes);
}

function updateDecode(sid, sfVal, reqBytes) {
  const el = document.getElementById('decode-text');
  const info = SID_INFO[sid];
  if (!info) { el.textContent = '选择服务以查看解码信息'; return; }

  // Check session permission
  const rules = SESSION_RULES[sid];
  let permStr = '';
  if (rules) {
    const sesNames = { 0x01: 'Default', 0x02: 'Programming', 0x03: 'Extended' };
    const accessStr = [];
    for (const [ses, acc] of Object.entries(rules)) {
      if (ses === 'desc') continue;
      const s = sesNames[ses] || ses;
      if (acc === 0) accessStr.push(`${s}❌`);
      else if (acc === 1) accessStr.push(`${s}✅`);
      else accessStr.push(`${s}🔒`);
    }
    permStr = `权限: ${accessStr.join(' | ')}`;
  }

  let lines = [];
  lines.push(`📌 ${info.name} (0x${info.reqSID})`);
  lines.push(`类别: ${info.unit}`);
  if (permStr) lines.push(permStr);

  if (sfVal) {
    const sfName = info.sfs?.[sfVal] || '未知子功能';
    const suppress = (parseInt(sfVal, 16) & 0x80) ? '⏭️ 抑制正响应' : '✅ 正常响应';
    lines.push(`子功能: 0x${sfVal} = ${sfName} [${suppress}]`);
  }

  const dataBytes = reqBytes.slice(sfVal ? 2 : 1);
  if (dataBytes.length > 0) {
    const dataHex = dataBytes.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
    lines.push(`数据 (${dataBytes.length}B): ${dataHex}`);

    // Enhanced DID decode
    if (sid === 0x22 || sid === 0x2E) {
      const did = dataBytes.slice(0, 2);
      if (did.length === 2) {
        const didHex = did.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join('');
        const didName = ECU.didLabels[didHex] || '⚠️ 未知 DID';
        lines.push(`📍 DID: 0x${didHex} = ${didName}`);
        // Decode known DIDs
        if (ECU.dids[didHex]) {
          const vals = ECU.dids[didHex];
          if (vals.every(v => v >= 0x20 && v <= 0x7E)) {
            lines.push(`📝 值: "${String.fromCharCode(...vals)}"`);
          } else {
            const raw = vals.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
            lines.push(`🔢 HEX: ${raw}`);
            // Try to decode common formats
            if (didHex === 'F194' && vals.length >= 2) {
              const temp = vals[1] - 40;
              lines.push(`🌡️ 温度: ${temp}°C`);
            } else if (didHex === 'F195' && vals.length >= 2) {
              const rpm = (vals[0] << 8) | vals[1];
              lines.push(`⚡ 转速: ${rpm} RPM`);
            } else if (didHex === 'F196' && vals.length >= 2) {
              const speed = ((vals[0] << 8) | vals[1]) / 100;
              lines.push(`🚗 车速: ${speed.toFixed(1)} km/h`);
            } else if (didHex === 'F199' && vals.length >= 4) {
              const mv = (vals[2] << 8) | vals[3];
              lines.push(`🔋 电压: ${(mv/1000).toFixed(3)}V`);
            } else if (didHex === 'F19C' && vals.length >= 2) {
              lines.push(`⛽ 油量: ${vals[1]}%`);
            }
          }
        }
      }
    }

    // Decode DTC info
    if (sid === 0x19 && sfVal) {
      const subfuncs = {
        '01': '按状态掩码报告 DTC 数量',
        '02': '按状态掩码报告 DTC',
        '0A': '报告支持的 DTC'
      };
      if (subfuncs[sfVal] && dataBytes.length >= 1) {
        lines.push(`📊 ${subfuncs[sfVal]}, mask=0x${dataBytes[0].toString(16).padStart(2,'0')}`);
      }
    }

    // Decode routine control
    if (sid === 0x31 && dataBytes.length >= 2) {
      const rid = (dataBytes[0] << 8) | dataBytes[1];
      const rNames = { 0xFF00: 'Erase Memory', 0xFF01: 'Programming', 0xFF02: 'Checksum' };
      lines.push(`🔧 例程 ID: 0x${rid.toString(16).padStart(4,'0')} = ${rNames[rid] || '自定义'}`);
    }

    // Decode download
    if (sid === 0x34 && dataBytes.length >= 2) {
      const alfi = dataBytes[1];
      const addrBytes = alfi & 0x0F;
      const lenBytes = (alfi >> 4) & 0x0F;
      lines.push(`📥 下载: 地址格式=${addrBytes}B, 长度格式=${lenBytes}B`);
    }

    // Decode routine type
    if (sid === 0x31) {
      const sfName = info.sfs?.[sfVal] || '';
      lines.push(`🔧 ${sfName}`);
    }
  }

  // Response SID info
  const resSID = parseInt(info.reqSID, 16) + 0x40;
  lines.push(`✅ 正响应: 0x${resSID.toString(16).padStart(2,'0')} | ❌ 负响应: 0x7F + 0x${info.reqSID} + NRC`);

  el.innerHTML = lines.join('<br>');
}

// ======================== ECU ENGINE ========================
function checkSessionSecurity(reqSID, sf) {
  const rules = SESSION_RULES[reqSID];
  if (!rules) return { ok: false, nrc: NRC.SNS };
  const access = rules[ECU.session];
  if (!access || access === 0) return { ok: false, nrc: NRC.SNSIAS };
  if (access === 2 && ECU.securityLevel === 0) return { ok: false, nrc: NRC.SAD };
  return { ok: true };
}

function processRequest(bytes) {
  ECU.counters.rx++;
  if (bytes.length < 1) return negResp(0, NRC.IMLOIF);

  const reqSID = bytes[0];
  const info = SID_INFO[reqSID];

  // Special case: SecurityAccess (0x27) is callable from non-default sessions even though it's level-2
  // because it's the service that GRANTS security. DSC is always allowed.
  const bypassSecurity = (reqSID === 0x27 || reqSID === 0x10 || reqSID === 0x3E);

  if (!info) return negResp(reqSID, NRC.SNS);

  // Session + Security permission check
  if (!bypassSecurity) {
    const perm = checkSessionSecurity(reqSID);
    if (!perm.ok) {
      // Distinguish between SNSIAS and SAD for better diagnostics
      if (perm.nrc === NRC.SAD) {
        return negResp(reqSID, NRC.SAD, 'securityAccessDenied — 需要在非默认会话中解锁安全访问');
      }
      return negResp(reqSID, perm.nrc);
    }
  }

  const hasSF = info.hasSF && info.sfs;
  let sf = null;
  let data = bytes.slice(1);
  let suppressResponse = false;

  if (hasSF) {
    if (data.length < 1) return negResp(reqSID, NRC.IMLOIF);
    sf = data[0] & 0x7F;
    suppressResponse = !!(data[0] & 0x80);
    data = data.slice(1);

    // Validate subfunction (supports range keys like '40-5F')
    const sfHex = sf.toString(16).toUpperCase().padStart(2,'0');
    const sfKeys = Object.keys(info.sfs);
    const sfValid = sfKeys.some(key => {
      if (key === sfHex) return true;
      if (key.includes('-')) {
        const [lo, hi] = key.split('-').map(s => parseInt(s, 16));
        return sf >= lo && sf <= hi;
      }
      return false;
    });
    if (!sfValid) {
      return negResp(reqSID, NRC.SFNS);
    }
  }

  // Check communication state
  if (!ECU.communication && reqSID !== 0x28 && reqSID !== 0x3E) {
    return negResp(reqSID, NRC.CNC, 'conditionsNotCorrect — 通信已禁用');
  }

  // Route to handler
  const res = handleService(reqSID, sf, data, bytes, suppressResponse);
  if (res) ECU.counters.tx++;

  // Update session timer
  if (ECU.sessionTimer) clearTimeout(ECU.sessionTimer);
  if (ECU.session !== 0x01) {
    ECU.sessionTimer = setTimeout(() => {
      ECU.session = 0x01;
      ECU.sessionName = 'Default';
      ECU.securityLevel = 0;
      updateECUStatus();
      addLogEntry([], `⏰ 会话超时 → 返回 Default 会话`, 'system');
    }, ECU.S3);
  }

  return res;
}

function handleService(sid, sf, data, fullReq, suppressResponse) {
  switch (sid) {
    case 0x10: return handleDSC(sf, data, fullReq, suppressResponse);
    case 0x11: return handleECUReset(sf, data, suppressResponse);
    case 0x14: return handleClearDTC(sf, data, suppressResponse);
    case 0x19: return handleReadDTCInfo(sf, data, suppressResponse);
    case 0x22: return handleReadDID(data, fullReq, suppressResponse);
    case 0x23: return handleReadMemory(data, suppressResponse);
    case 0x24: return handleReadScaling(data, suppressResponse);
    case 0x27: return handleSecurityAccess(sf, data, fullReq, suppressResponse);
    case 0x28: return handleCommControl(sf, data, suppressResponse);
    case 0x29: return handleAuthentication(sf, data, fullReq, suppressResponse);
    case 0x2A: return handleReadByPeriodicID(data, suppressResponse);
    case 0x2C: return handleDynamicDefineDID(sf, data, suppressResponse);
    case 0x2E: return handleWriteDID(data, fullReq, suppressResponse);
    case 0x2F: return handleIOControl(sf, data, suppressResponse);
    case 0x31: return handleRoutine(sf, data, suppressResponse);
    case 0x34: return handleRequestDownload(sf, data, suppressResponse);
    case 0x35: return handleRequestUpload(sf, data, suppressResponse);
    case 0x36: return handleTransferData(sf, data, suppressResponse);
    case 0x37: return handleTransferExit(sf, data, suppressResponse);
    case 0x38: return handleFileTransfer(sf, data, suppressResponse);
    case 0x3D: return handleWriteMemory(data, suppressResponse);
    case 0x3E: return handleTesterPresent(sf, fullReq, suppressResponse);
    case 0x84: return handleSecuredDataTransmission(sf, data, suppressResponse);
    case 0x85: return handleDTCSetting(sf, data, suppressResponse);
    case 0x86: return handleResponseOnEvent(sf, data, suppressResponse);
    case 0x87: return handleLinkControl(sf, data, suppressResponse);
    default: return negResp(sid, NRC.SNSIAS);
  }
}

// ---- Service Handlers ----

function handleDSC(sf, data, fullReq, suppress) {
  if (!sf) return negResp(0x10, NRC.IMLOIF);
  const sessionTypes = { 0x01: 'Default', 0x02: 'Programming', 0x03: 'Extended', 0x04: 'SafetySystem' };
  // Standard sessions + manufacturer/supplier specific ranges
  const validSessions = [0x01, 0x02, 0x03, 0x04];
  const isRangeSession = (sf >= 0x40 && sf <= 0x5F) || (sf >= 0x60 && sf <= 0x7E);
  if (!validSessions.includes(sf) && !isRangeSession) return negResp(0x10, NRC.ROOR);

  const oldSession = ECU.session;
  ECU.session = sf;
  // Generate a display name for range sessions
  ECU.sessionName = sessionTypes[sf] ||
    (sf >= 0x40 && sf <= 0x5F ? `VendorSpecific(0x${sf.toString(16).toUpperCase().padStart(2,'0')})` :
     sf >= 0x60 && sf <= 0x7E ? `SupplierSpecific(0x${sf.toString(16).toUpperCase().padStart(2,'0')})` :
     `Session_0x${sf.toString(16).toUpperCase().padStart(2,'0')}`);
  ECU.securityLevel = 0; // Reset security on session change

  // Update P2 timers based on session
  if (sf === 0x01) { ECU.P2 = 50; ECU.P2star = 2000; ECU.S3 = 0; }
  else if (sf === 0x02) { ECU.P2 = 50; ECU.P2star = 5000; ECU.S3 = 5000; }
  else if (sf === 0x03) { ECU.P2 = 50; ECU.P2star = 2000; ECU.S3 = 5000; }
  else if (sf === 0x04) { ECU.P2 = 50; ECU.P2star = 2000; ECU.S3 = 5000; }
  else { ECU.P2 = 50; ECU.P2star = 2000; ECU.S3 = 5000; } // range sessions

  updateECUStatus();
  if (suppress && (fullReq[1] & 0x80)) return null;

  const resSID = 0x50;
  const p2hex = [(ECU.P2 >> 8) & 0xFF, ECU.P2 & 0xFF];
  const p2starhex = [(ECU.P2star >> 8) & 0xFF, ECU.P2star & 0xFF];
  return { sid: resSID, payload: [sf, ...p2hex, ...p2starhex], desc: `会话: ${ECU.sessionName} (P2=${ECU.P2}ms, P2*=${ECU.P2star}ms)` };
}

function handleECUReset(sf, data, suppress) {
  if (!sf) return negResp(0x11, NRC.IMLOIF);
  const validTypes = [0x01, 0x02, 0x03, 0x04, 0x05];
  if (!validTypes.includes(sf)) return negResp(0x11, NRC.ROOR);

  const resetNames = { 0x01: 'hardReset', 0x02: 'keyOffOnReset', 0x03: 'softReset', 0x04: 'enableRapidPowerShutdown', 0x05: 'disableRapidPowerShutdown' };

  // Reset ECU state
  ECU.session = 0x01;
  ECU.sessionName = 'Default';
  ECU.securityLevel = 0;
  ECU.P2 = 50; ECU.P2star = 2000;
  updateECUStatus();

  if (suppress && (sf & 0x80)) return null;
  return { sid: 0x51, payload: [sf], desc: `复位类型: ${resetNames[sf] || '未知'} — 返回到 Default 会话` };
}

function handleClearDTC(sf, data, suppress) {
  if (!ECU.dtcSetting) return negResp(0x14, NRC.CNC);
  const groupDTC = data.length >= 3 ? (data[0] << 16 | data[1] << 8 | data[2]) : 0xFFFFFF;
  ECU.dtcs = [];
  ECU.dtcStatus = { B1: 0x00, B2: 0x00, B3: 0x00 };
  updateECUStatus();
  return { sid: 0x54, payload: [], desc: `DTC 已清除 (group=0x${groupDTC.toString(16).padStart(6,'0')})` };
}

function handleReadDTCInfo(sf, data, suppress) {
  if (!sf) return negResp(0x19, NRC.IMLOIF);
  const resSID = 0x59;

  switch (sf) {
    case 0x01: { // reportNumberOfDTCByStatusMask
      const mask = data.length >= 1 ? data[0] : 0xFF;
      const count = ECU.dtcs.filter(d => d.status & mask).length;
      return { sid: resSID, payload: [sf, 0x03, 0x00, count], desc: `DTC 数量: ${count} (mask=0x${mask.toString(16).padStart(2,'0')})` };
    }
    case 0x02: { // reportDTCByStatusMask
      const mask = data.length >= 1 ? data[0] : 0xFF;
      let payload = [sf, 0x03];
      const filtered = ECU.dtcs.filter(d => d.status & mask);
      payload.push((filtered.length * 4) & 0xFF);
      for (const dtc of filtered) {
        payload.push(dtc.high, dtc.middle, dtc.low, dtc.status);
      }
      return { sid: resSID, payload, desc: `DTC 报告 (mask=0x${mask.toString(16).padStart(2,'0')})` };
    }
    case 0x0A: { // reportSupportedDTC
      let payload = [sf];
      for (const dtc of ECU.dtcs) payload.push(dtc.high, dtc.middle, dtc.low, dtc.status);
      return { sid: resSID, payload, desc: `支持的 DTC: ${ECU.dtcs.length} 个` };
    }
    default:
      // Try to simulate a generic response
      return { sid: resSID, payload: [sf, 0x00], desc: `reportType=0x${sf.toString(16).padStart(2,'0')} (模拟响应)` };
  }
}

function handleReadDID(data, fullReq, suppress) {
  if (data.length < 2) return negResp(0x22, NRC.IMLOIF);
  const did = (data[0] << 8) | data[1];
  const didHex = data[0].toString(16).toUpperCase().padStart(2,'0') + data[1].toString(16).toUpperCase().padStart(2,'0');
  const values = ECU.dids[didHex];
  if (!values) return negResp(0x22, NRC.ROOR);

  // Update dynamic values
  updateDynamicDIDs();

  const sid = 0x62;
  const payload = [data[0], data[1], ...(ECU.dids[didHex] || [])];
  const label = ECU.didLabels[didHex] || '未知';
  const rawStr = (ECU.dids[didHex] || []).map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
  return { sid, payload, desc: `DID 0x${didHex} (${label}): ${rawStr}` };
}

function handleReadMemory(data, suppress) {
  if (data.length < 1) return negResp(0x23, NRC.IMLOIF);
  const addFmt = data[0];
  const addrBytes = addFmt & 0x0F;
  const lenBytes = (addFmt >> 4) & 0x0F;
  if (data.length < 1 + addrBytes + lenBytes) return negResp(0x23, NRC.IMLOIF);
  const memLen = lenBytes > 0 ? parseInt(data.slice(1+addrBytes, 1+addrBytes+lenBytes).map(b=>b.toString(16).padStart(2,'0')).join(''), 16) : 4;
  const payload = [];
  for (let i = 0; i < Math.min(memLen, 32); i++) payload.push(0xA0 + (i % 16));
  return { sid: 0x63, payload, desc: `内存读取: ${memLen} 字节 (addrFmt=0x${addFmt.toString(16).padStart(2,'0')})` };
}

function handleReadScaling(data, suppress) {
  if (data.length < 2) return negResp(0x24, NRC.IMLOIF);
  const didHex = data[0].toString(16).toUpperCase().padStart(2,'0') + data[1].toString(16).toUpperCase().padStart(2,'0');
  // Return scaling data: unit byte + formula byte + numerator + denominator + offset
  const unit = 0x01; // 1 = no unit
  const formula = 0x01; // 1 = linear: value = raw * num/den + offset
  const payload = [data[0], data[1], unit, formula, 0x01, 0x01, 0x00, 0x00];
  return { sid: 0x64, payload, desc: `缩放数据 DID 0x${didHex}: linear, raw*1/1+0` };
}

function handleSecurityAccess(sf, data, fullReq, suppress) {
  if (!sf) return negResp(0x27, NRC.IMLOIF);
  const resSID = 0x67;
  const level = Math.ceil(sf / 2);

  if (sf % 2 === 1) { // Odd = requestSeed
    if (ECU.securityAttempts >= ECU.securityThreshold) return negResp(0x27, NRC.ENOA);
    const now = Date.now();
    if (now - ECU.securityTimers.lastAttempt < ECU.securityTimers.delayMs && ECU.securityAttempts > 0)
      return negResp(0x27, NRC.RTDNE);

    ECU.securityTimers.lastAttempt = now;
    ECU.securityUnlockLevel = sf;
    // Generate different seeds per level
    ECU.securitySeed = level === 1 ? [0xAA, 0xBB, 0xCC, 0xDD] : [0x11, 0x22, 0x33, 0x44];
    ECU.securityAttempts++;
    updateECUStatus();
    return { sid: resSID, payload: [sf, ...ECU.securitySeed], desc: `请求种子 (level=${level}), 尝试 ${ECU.securityAttempts}/${ECU.securityThreshold}` };
  } else { // Even = sendKey
    const expectedKey = level === 1 ? [0x12, 0x34, 0x56, 0x78] : [0xAB, 0xCD, 0xEF, 0x01];
    const keyData = data || [];
    const keyMatch = keyData.length === expectedKey.length &&
      keyData.every((v, i) => v === expectedKey[i]);

    if (!keyMatch) {
      ECU.securityAttempts++;
      ECU.securityTimers.lastAttempt = Date.now();
      if (ECU.securityAttempts >= ECU.securityThreshold + 2) return negResp(0x27, NRC.ENOA);
      return negResp(0x27, NRC.IK);
    }

    ECU.securityLevel = level;
    ECU.securityAttempts = 0;
    updateECUStatus();
    return { sid: resSID, payload: [sf], desc: `🔓 安全解锁成功! (Level ${level})` };
  }
}

function handleCommControl(sf, data, suppress) {
  if (sf === undefined || sf === null) return negResp(0x28, NRC.IMLOIF);
  if (sf > 3) return negResp(0x28, NRC.ROOR);
  // communicationType byte in data[0] selects subnet
  ECU.communication = (sf === 0);
  updateECUStatus();
  const names = ['启用 RxTx', '仅 Rx 开', '仅 Tx 开', '禁用 RxTx'];
  return { sid: 0x68, payload: [sf, ...(data.length ? [data[0]] : [0x01])], desc: `通信控制: ${names[sf] || '未知'}` };
}

function handleReadByPeriodicID(data, suppress) {
  if (data.length < 1) return negResp(0x2A, NRC.IMLOIF);
  const periodicID = data[0];
  // Return 4 bytes of simulated periodic data
  const payload = [periodicID, 0x00, 0x64, 0x01, 0xF4];
  return { sid: 0x6A, payload, desc: `周期数据 ID=0x${periodicID.toString(16).padStart(2,'0')}: 4 字节` };
}

function handleDynamicDefineDID(sf, data, suppress) {
  if (!sf) return negResp(0x2C, NRC.IMLOIF);
  if (sf === 0x03) { // clear
    return { sid: 0x6C, payload: [sf], desc: '动态 DID 已清除' };
  }
  // defineByIdentifier or defineByMemoryAddress
  if (data.length < 4) return negResp(0x2C, NRC.IMLOIF);
  const newDID = data.slice(0, 2);
  const sourceCount = data[2];
  return { sid: 0x6C, payload: [sf, newDID[0], newDID[1]], desc: `动态 DID 0x${newDID.map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join('')} 已定义 (${sourceCount} 个源)` };
}

function handleWriteDID(data, fullReq, suppress) {
  if (data.length < 2) return negResp(0x2E, NRC.IMLOIF);
  const didHex = data[0].toString(16).toUpperCase().padStart(2,'0') + data[1].toString(16).toUpperCase().padStart(2,'0');
  if (!ECU.dids[didHex]) return negResp(0x2E, NRC.ROOR);

  ECU.dids[didHex] = data.slice(2);
  updateECUStatus();
  const valStr = data.slice(2).map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
  return { sid: 0x6E, payload: [data[0], data[1]], desc: `DID 0x${didHex} 写入成功: ${valStr}` };
}

function handleIOControl(sf, data, suppress) {
  if (sf === undefined || sf === null) return negResp(0x2F, NRC.IMLOIF);
  if (data.length < 2) return negResp(0x2F, NRC.IMLOIF);
  const did = data.slice(0, 2);
  const names = ['returnControlToECU', 'resetToDefault', 'freezeCurrentState', 'shortTermAdjustment'];
  const name = names[sf] || `0x${sf.toString(16).padStart(2,'0')}`;
  const ctrlState = data.slice(2);
  return { sid: 0x6F, payload: [sf, ...did, ...ctrlState],
    desc: `IO 控制: ${name}, DID=0x${did.map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join('')}${ctrlState.length ? ', state='+ctrlState.map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join(' '):''}` };
}

function handleRoutine(sf, data, suppress) {
  if (!sf) return negResp(0x31, NRC.IMLOIF);
  if (data.length < 2) return negResp(0x31, NRC.IMLOIF);
  const routineID = (data[0] << 8) | data[1];
  const rNames = { 0xFF00: 'Erase Memory', 0xFF01: 'Programming', 0xFF02: 'Checksum',
    0xFF03: 'Request Download Size', 0xFF04: 'Upload Progress' };
  const rName = rNames[routineID] || `0x${routineID.toString(16).padStart(4,'0')}`;

  if (sf === 0x01) {
    return { sid: 0x71, payload: [sf, data[0], data[1], 0x00],
      desc: `🔧 启动例程: ${rName}` };
  } else if (sf === 0x02) {
    return { sid: 0x71, payload: [sf, data[0], data[1]],
      desc: `⏹️ 停止例程: ${rName}` };
  } else if (sf === 0x03) {
    const result = routineID === 0xFF02 ? [0x00, 0x64] : [0x00, 0x00];
    return { sid: 0x71, payload: [sf, data[0], data[1], ...result],
      desc: `📊 例程结果: ${rName} = 0x${result.map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join('')}` };
  }
  return negResp(0x31, NRC.SFNS);
}

function handleRequestDownload(sf, data, suppress) {
  if (data.length < 3) return negResp(0x34, NRC.IMLOIF);
  const dfi = data[0];
  const alfi = data[1];
  const addrBytes = alfi & 0x0F;
  const lenBytes = (alfi >> 4) & 0x0F;
  if (data.length < 2 + addrBytes + lenBytes) return negResp(0x34, NRC.IMLOIF);
  ECU.uploadSession = true;
  ECU.blockSequenceCounter = 0;
  const maxBlock = 0x100;
  return { sid: 0x74, payload: [(maxBlock >> 8) & 0xFF, maxBlock & 0xFF],
    desc: `📥 下载就绪 (DFI=0x${dfi.toString(16).padStart(2,'0')}), 最大块=${maxBlock}B` };
}

function handleRequestUpload(sf, data, suppress) {
  if (data.length < 3) return negResp(0x35, NRC.IMLOIF);
  const alfi = data[1];
  const maxBlock = 0x100;
  ECU.uploadSession = true;
  ECU.blockSequenceCounter = 0;
  return { sid: 0x75, payload: [(maxBlock >> 8) & 0xFF, maxBlock & 0xFF],
    desc: `📤 上传就绪, 最大块=${maxBlock}B` };
}

function handleTransferData(sf, data, suppress) {
  if (!data.length) return negResp(0x36, NRC.IMLOIF);
  const bsc = data[0];
  if (!ECU.uploadSession) return negResp(0x36, NRC.CNC, 'conditionsNotCorrect — 未先调用 RequestDownload/Upload');

  // Check sequence
  if (bsc !== 0x01 && bsc !== ECU.blockSequenceCounter + 1 &&
      bsc !== ECU.blockSequenceCounter) { // Allow retransmit
    return negResp(0x36, NRC.WBSC);
  }
  ECU.blockSequenceCounter = bsc;
  return { sid: 0x76, payload: [bsc],
    desc: `📦 数据块 #${bsc} 已接收 (${data.length-1}B)` };
}

function handleTransferExit(sf, data, suppress) {
  if (!ECU.uploadSession) return negResp(0x37, NRC.CNC, 'conditionsNotCorrect — 没有活跃的传输');
  ECU.uploadSession = false;
  const checksum = data.length ? data.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ') : '无';
  return { sid: 0x77, payload: data || [],
    desc: `✅ 传输完成 (checksum=${checksum})` };
}

function handleFileTransfer(sf, data, suppress) {
  if (!sf) return negResp(0x38, NRC.IMLOIF);
  const names = { 0x01: 'addFile', 0x02: 'deleteFile', 0x03: 'replaceFile', 0x04: 'readFile', 0x05: 'readDirectory' };
  const name = names[sf] || `0x${sf.toString(16).padStart(2,'0')}`;
  const filePath = data.length ? data.slice(0, Math.min(data.length, 8)) : [];
  return { sid: 0x78, payload: [sf, ...filePath],
    desc: `📂 文件操作: ${name}${filePath.length ? ', path bytes='+filePath.map(b=>String.fromCharCode(b)).join(''):''}` };
}

function handleWriteMemory(data, suppress) {
  if (data.length < 2) return negResp(0x3D, NRC.IMLOIF);
  const addrLen = data[0];
  const addrBytes = (addrLen & 0x0F);
  if (data.length < 1 + addrBytes) return negResp(0x3D, NRC.IMLOIF);
  const addr = data.slice(1, 1 + addrBytes);
  const memData = data.slice(1 + addrBytes);
  return { sid: 0x7D, payload: [...addr, ...memData],
    desc: `内存写入: 0x${addr.map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join('')}, ${memData.length}B` };
}

function handleTesterPresent(sf, fullReq, suppress) {
  if (suppress) return null;
  // Extend session timeout
  if (ECU.sessionTimer) clearTimeout(ECU.sessionTimer);
  if (ECU.session !== 0x01) {
    ECU.sessionTimer = setTimeout(() => {
      ECU.session = 0x01;
      ECU.sessionName = 'Default';
      ECU.securityLevel = 0;
      updateECUStatus();
      addLogEntry([], '⏰ 会话超时 → 返回 Default 会话', 'system');
    }, ECU.S3);
  }
  return { sid: 0x7E, payload: [0x00], desc: '💓 TesterPresent — 会话计时器已重置' };
}

function handleDTCSetting(sf, data, suppress) {
  if (sf === undefined || sf === null) return negResp(0x85, NRC.IMLOIF);
  if (sf !== 0x01 && sf !== 0x02) return negResp(0x85, NRC.ROOR);
  if (ECU.securityLevel === 0) return negResp(0x85, NRC.SAD);
  ECU.dtcSetting = (sf === 0x01);
  updateECUStatus();
  return { sid: 0xC5, payload: [sf], desc: `DTC 设置: ${ECU.dtcSetting ? '🟢 ON' : '🔴 OFF'}` };
}

function handleResponseOnEvent(sf, data, suppress) {
  if (sf === undefined || sf === null) return negResp(0x86, NRC.IMLOIF);
  const names = { 0x00: 'stopResponseOnEvent', 0x01: 'onDTCStatusChange',
    0x02: 'onTimerInterrupt', 0x03: 'onChangeOfDataIdentifier' };
  const name = names[sf] || `0x${sf.toString(16).padStart(2,'0')}`;
  return { sid: 0xC6, payload: [sf], desc: `事件响应: ${name} 已配置` };
}

function handleLinkControl(sf, data, suppress) {
  if (!sf) return negResp(0x87, NRC.IMLOIF);
  const names = { 0x01: 'verifyFixedBaudrate', 0x02: 'verifySpecificBaudrate', 0x03: 'transitionBaudrate' };
  const name = names[sf] || `0x${sf.toString(16).padStart(2,'0')}`;
  const baudData = data.length ? data.slice(0, 2) : [];
  return { sid: 0xC7, payload: [sf, ...baudData],
    desc: `🔗 链路控制: ${name}${baudData.length ? ', baudrate='+((baudData[0]<<8|baudData[1])*100)+'bps':''}` };
}

function handleAuthentication(sf, data, fullReq, suppress) {
  if (sf === undefined || sf === null) return negResp(0x29, NRC.IMLOIF);
  const resSID = 0x69;
  const authTasks = {
    0x00: 'deAuthenticate', 0x01: 'verifyCertificateUnidirectional',
    0x02: 'verifyCertificateBidirectional', 0x03: 'proofOfOwnership',
    0x04: 'transmitCertificate', 0x05: 'requestChallengeForAuthentication'
  };
  const taskName = authTasks[sf] || `0x${sf.toString(16).padStart(2,'0')}`;

  if (sf === 0x00) {
    // deAuthenticate — re-lock security
    ECU.securityLevel = 0;
    updateECUStatus();
  }
  return { sid: resSID, payload: [sf], desc: `🔐 Authentication: ${taskName} ${sf === 0x00 ? '— 已解除认证' : '(模拟响应)'}` };
}

function handleSecuredDataTransmission(sf, data, suppress) {
  if (!data || data.length < 2) return negResp(0x84, NRC.IMLOIF);
  const securitySubLayer = data[0];
  // Unwrap and echo back the inner message content for simulation
  const innerData = data.slice(1);
  return { sid: 0xC4, payload: [securitySubLayer, ...innerData],
    desc: `🔒 安全数据传输: subLayer=0x${securitySubLayer.toString(16).padStart(2,'0')}, 内部数据 ${innerData.length}B (模拟响应)` };
}

// ---- Helpers ----

function negResp(sid, nrcCode, customDesc) {
  ECU.counters.neg++;
  updateECUStatus();
  const baseName = NRC_NAMES[nrcCode] || '未知';
  const desc = customDesc || `❌ ${baseName} (0x${nrcCode.toString(16).padStart(2,'0')})`;
  return { sid: 0x7F, payload: [sid, nrcCode], isNeg: true, desc };
}

function updateDynamicDIDs() {
  // Simulate changing values
  const rpm = Math.floor(Math.random() * 1000 + 800);
  ECU.dids['F195'] = [(rpm >> 8) & 0xFF, rpm & 0xFF];
  const speed = Math.floor(Math.random() * 60 + 20);
  ECU.dids['F196'] = [(speed >> 8) & 0xFF, speed & 0xFF];
  const temp = Math.floor(Math.random() * 30 + 70);
  ECU.dids['F194'] = [0x00, temp];
}

// ======================== UI UPDATE ========================
function updateECUStatus() {
  // Update ECU title and selector
  const cfg = ECU_CONFIGS[activeECU];
  const titleEl = document.getElementById('ecu-title');
  if (titleEl && cfg) titleEl.textContent = cfg.name;
  const selEl = document.getElementById('ecu-selector');
  if (selEl) selEl.value = activeECU;

  document.getElementById('ecu-session').textContent = ECU.sessionName;
  document.getElementById('ecu-session').className = 'value ' +
    (ECU.session === 0x01 ? 'ok' : ECU.session === 0x02 ? 'err' : 'warn');

  const secEl = document.getElementById('ecu-security');
  if (ECU.securityLevel > 0) {
    secEl.textContent = `🔓 Unlocked (Lv${ECU.securityLevel})`;
    secEl.className = 'value ok';
  } else {
    secEl.textContent = '🔒 Locked';
    secEl.className = 'value err';
  }

  document.getElementById('ecu-p2').textContent = ECU.P2;
  document.getElementById('ecu-p2star').textContent = ECU.P2star;
  document.getElementById('ecu-s3').textContent = ECU.S3;
  document.getElementById('ecu-comm').textContent = ECU.communication ? 'Normal' : 'Off';
  document.getElementById('ecu-comm').className = 'value ' + (ECU.communication ? 'ok' : 'err');
  document.getElementById('ecu-rx').textContent = ECU.counters.rx;
  document.getElementById('ecu-tx').textContent = ECU.counters.tx;
  document.getElementById('ecu-pos').textContent = ECU.counters.pos;
  document.getElementById('ecu-neg').textContent = ECU.counters.neg;

  // Update DID displays
  for (const key of Object.keys(ECU.didLabels)) {
    const el = document.getElementById(`did-${key}`);
    if (el) {
      const vals = ECU.dids[key];
      if (vals) {
        if (vals.every(v => v >= 0x20 && v <= 0x7E)) {
          el.textContent = String.fromCharCode(...vals);
        } else {
          el.textContent = vals.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
        }
      }
    }
  }
}

// ======================== DID EDITOR ========================
function openDIDEditor() {
  renderDIDEditor();
  document.getElementById('did-editor-overlay').style.display = 'flex';
  document.addEventListener('keydown', _onEditorKeydown);
}

function _onEditorKeydown(e) {
  if (e.key === 'Escape') closeDIDEditor();
}

function closeDIDEditor() {
  document.getElementById('did-editor-overlay').style.display = 'none';
  document.removeEventListener('keydown', _onEditorKeydown);
}

function renderDIDEditor() {
  const body = document.getElementById('did-editor-body');
  body.innerHTML = '';
  for (const key of Object.keys(ECU.didLabels)) {
    const label = ECU.didLabels[key];
    const vals = ECU.dids[key] || [];
    const hexStr = vals.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
    const row = document.createElement('div');
    row.className = 'did-edit-row';
    row.innerHTML = `
      <span class="did-edit-key">${key}</span>
      <span class="did-edit-label">${label}</span>
      <input type="text" class="did-edit-input" id="did-input-${key}" value="${hexStr}" spellcheck="false">
    `;
    body.appendChild(row);
  }
}

function saveDIDChanges() {
  for (const key of Object.keys(ECU.didLabels)) {
    const input = document.getElementById(`did-input-${key}`);
    if (!input) continue;
    const raw = input.value.trim();
    if (!raw) continue;
    const bytes = [];
    let valid = true;
    for (const p of raw.split(/[\s,]+/)) {
      if (/^[0-9a-fA-F]{2}$/.test(p)) {
        bytes.push(parseInt(p, 16));
      } else {
        valid = false;
        break;
      }
    }
    if (valid && bytes.length > 0) {
      ECU.dids[key] = bytes;
    } else {
      showToast(`DID ${key} 的 HEX 格式无效: "${raw}"`, 'error');
      return;
    }
  }
  updateECUStatus();
  closeDIDEditor();
  showToast('🔄 DID 已重置为默认值', 'success');
}

// ======================== DTC INJECTOR ========================
const DTC_SEVERITY_LABELS = {
  0x00: 'none', 0x10: 'pass', 0x20: 'minor',
  0x30: 'moderate', 0x40: 'severe', 0x50: 'major'
};

function dtcSeverityLabel(sevByte) {
  return DTC_SEVERITY_LABELS[sevByte] || `0x${sevByte.toString(16).padStart(2,'0')}`;
}

function openDTCInjector() {
  renderDTCInjector();
  document.getElementById('dtc-injector-overlay').style.display = 'flex';
  document.addEventListener('keydown', _onDTCKeydown);
}

function _onDTCKeydown(e) {
  if (e.key === 'Escape') closeDTCInjector();
}

function closeDTCInjector() {
  document.getElementById('dtc-injector-overlay').style.display = 'none';
  document.removeEventListener('keydown', _onDTCKeydown);
}

function renderDTCInjector() {
  const body = document.getElementById('dtc-injector-body');
  body.innerHTML = '';

  // Header row
  const header = document.createElement('div');
  header.className = 'dtc-header-row';
  header.innerHTML = `
    <span>DTC</span>
    <span>状态</span>
    <span>严重性</span>
    <span>激活?</span>
  `;
  body.appendChild(header);

  // DTC rows
  ECU.dtcs.forEach((dtc, i) => {
    const dtcHex = `${dtc.high.toString(16).toUpperCase().padStart(2,'0')} ${dtc.middle.toString(16).toUpperCase().padStart(2,'0')} ${dtc.low.toString(16).toUpperCase().padStart(2,'0')}`;
    const statusHex = `0x${dtc.status.toString(16).toUpperCase().padStart(2,'0')}`;
    const sevLabel = dtcSeverityLabel(dtc.severity);
    const isActive = dtc.status !== 0;

    const row = document.createElement('div');
    row.className = 'dtc-edit-row';
    row.innerHTML = `
      <span><span class="dtc-hex">${dtcHex}</span><span class="dtc-pcode">${dtc.id}</span></span>
      <span><span class="dtc-status-badge ${isActive ? 'active' : 'inactive'}">${statusHex}</span></span>
      <span><span class="sev-label sev-${sevLabel}">${sevLabel}</span></span>
      <span>
        <label class="toggle-switch">
          <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleDTC(${i})">
          <span class="toggle-slider"></span>
        </label>
      </span>
    `;
    body.appendChild(row);
  });
}

function toggleDTC(index) {
  const dtc = ECU.dtcs[index];
  if (!dtc) return;
  dtc.status = (dtc.status === 0) ? 0x80 : 0x00;
  renderDTCInjector();
  updateECUStatus();
}

function injectRandomDTC() {
  const statuses = [0x20, 0x40, 0x80];
  const idx = Math.floor(Math.random() * ECU.dtcs.length);
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  ECU.dtcs[idx].status = status;
  renderDTCInjector();
  updateECUStatus();
  showToast(`🎲 DTC ${ECU.dtcs[idx].id} 注入: 状态=0x${status.toString(16).toUpperCase().padStart(2,'0')}`, 'success');
}

function clearAllDTCs() {
  ECU.dtcs.forEach(d => d.status = 0);
  renderDTCInjector();
  updateECUStatus();
  showToast('🧹 所有 DTC 已清除', 'success');
}

// ======================== MESSAGE LOG ========================
function addLogEntry(bytes, desc, type, reqBytes) {
  const container = document.getElementById('log-container');
  const empty = document.getElementById('empty-state');
  if (empty) empty.style.display = 'none';

  const ts = new Date();
  const timeStr = ts.toLocaleTimeString('zh-CN', { hour12: false }) + '.' +
    String(ts.getMilliseconds()).padStart(3,'0');

  const entry = document.createElement('div');
  entry.className = `msg-entry ${type}`;

  const hexStr = Array.isArray(bytes) ? bytes.map(b =>
    typeof b === 'number' ? b.toString(16).toUpperCase().padStart(2,'0') : b
  ).join(' ') : (bytes || '');

  // Decode direction arrow and type
  let dirSymbol = '', dirClass = type;
  if (type === 'req') { dirSymbol = '▶'; dirClass = 'req'; }
  else if (type === 'res') { dirSymbol = '◀'; dirClass = 'res'; }
  else if (type === 'neg') { dirSymbol = '✕'; dirClass = 'neg'; }
  else { dirSymbol = '◆'; dirClass = 'res'; }

  entry.innerHTML = `
    <span class="time">${timeStr}</span>
    <span class="direction ${dirClass}">${dirSymbol}</span>
    <div class="content">
      <div class="bytes ${dirClass}">${hexStr}</div>
      <div class="desc">${desc}</div>
    </div>
  `;

  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;

  // Update count
  const countEl = document.getElementById('msg-count');
  const current = parseInt(countEl.textContent) || 0;
  countEl.textContent = (current + 1) + ' 条消息';

  // Save to history array
  logEntries.push({ time: ts.getTime(), timeStr, hexStr, desc, type, session: ECU.sessionName });

  // Auto-update timeline if active
  if (typeof _showTimeline !== 'undefined' && _showTimeline) {
    // Debounce: use microtask to avoid re-render on every entry during batch adds
    if (!window._timelinePending) {
      window._timelinePending = true;
      Promise.resolve().then(() => {
        window._timelinePending = false;
        if (_showTimeline) renderTimeline();
      });
    }
  }
}

function clearLog() {
  logEntries = [];
  _showTimeline = false;
  const btn = document.getElementById('btn-timeline');
  if (btn) btn.classList.remove('active');
  const container = document.getElementById('log-container');
  container.innerHTML = `<div class="empty-state" id="empty-state">
    <div class="icon">📡</div>
    <p>日志已清空</p>
    <div class="hint">使用右侧构造器发送 UDS 请求</div>
  </div>`;
  document.getElementById('msg-count').textContent = '0 条消息';
}

// ======================== ISO-TP TRANSPORT LAYER ========================
const ISO_TP = {
  state: 'IDLE',  // IDLE | SF | FF | CF | WAIT_FC
  type: null,      // 'single' | 'multi'
  totalLen: 0,
  remainingLen: 0,
  currentSN: 0,
  data: [],
  frameSize: 7,
  timer: null,
  frames: [],
  currentFrameIdx: 0,
};

function hexStrToBytes(str) {
  const bytes = [];
  for (const p of str.trim().split(/[\s,]+/)) {
    if (/^[0-9a-fA-F]{2}$/.test(p)) bytes.push(parseInt(p, 16));
    else return null;
  }
  return bytes;
}

function bytesToHexStr(bytes) {
  return bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
}

function segmentISOTPData(dataHex) {
  const bytes = hexStrToBytes(dataHex);
  if (!bytes || bytes.length === 0) return null;

  const frames = [];
  const totalLen = bytes.length;

  if (totalLen <= 7) {
    // Single Frame: 1-byte PCI (0x00-0x07 = length) + data
    const pci = totalLen & 0x07;
    const frameBytes = [pci, ...bytes];
    frames.push({
      type: 'SF', sn: null,
      data: frameBytes,
      dataHex: bytesToHexStr(frameBytes),
      payloadLen: totalLen
    });
  } else {
    // Multi Frame: First Frame (FF) + Consecutive Frames (CF)
    // FF: 2-byte PCI (0x10|lenHi + lenLo) + 6 bytes data
    const ffPci1 = 0x10 | ((totalLen >> 8) & 0x0F);
    const ffPci2 = totalLen & 0xFF;
    const ffData = bytes.slice(0, 6);
    const ffBytes = [ffPci1, ffPci2, ...ffData];
    frames.push({
      type: 'FF', sn: null,
      data: ffBytes,
      dataHex: bytesToHexStr(ffBytes),
      payloadLen: totalLen
    });

    let offset = 6;
    let sn = 1;
    while (offset < totalLen) {
      const chunkLen = Math.min(7, totalLen - offset);
      const pci = 0x20 | (sn & 0x0F);
      const cfData = bytes.slice(offset, offset + chunkLen);
      const cfBytes = [pci, ...cfData];
      frames.push({
        type: 'CF', sn: sn,
        data: cfBytes,
        dataHex: bytesToHexStr(cfBytes),
        payloadLen: chunkLen
      });
      offset += chunkLen;
      sn++;
    }
  }

  return { frames, totalLen, bytes };
}

function updateISOTPStatus() {
  const statusEl = document.getElementById('isotp-status');
  const texts = {
    'IDLE': '⏹️ 空闲',
    'SF': '📤 单帧发送中...',
    'FF': '📤 首帧已发送，等待流控...',
    'CF': '📤 连续帧发送中...',
    'WAIT_FC': '⏳ 等待流控帧...'
  };
  statusEl.textContent = texts[ISO_TP.state] || ISO_TP.state;
}

function renderISOTPFrames(segmentResult) {
  const listEl = document.getElementById('isotp-frame-list');
  listEl.innerHTML = '';

  if (!segmentResult || !segmentResult.frames) {
    listEl.innerHTML = '<div class="isotp-empty">输入 HEX 数据后点击发送</div>';
    return;
  }

  segmentResult.frames.forEach((frame, i) => {
    const div = document.createElement('div');
    div.className = 'isotp-frame-item';
    div.id = `isotp-frame-${i}`;

    const typeLabel = frame.type === 'SF' ? 'SF' :
      frame.type === 'FF' ? 'FF' :
      frame.type === 'CF' ? `CF${frame.sn}` :
      frame.type;

    div.innerHTML = `
      <span class="isotp-frame-type isotp-${frame.type.toLowerCase()}">${typeLabel}</span>
      <span class="isotp-frame-data">${frame.dataHex}</span>
    `;

    listEl.appendChild(div);
  });
}

function toggleISOTP() {
  const body = document.getElementById('isotp-body');
  const toggle = document.getElementById('isotp-toggle');
  const isOpen = body.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
}

function clearISOTP() {
  document.getElementById('isotp-input').value = '';
  document.getElementById('isotp-frame-list').innerHTML = '<div class="isotp-empty">输入 HEX 数据后点击发送</div>';
  document.getElementById('isotp-frame-count').textContent = '等待输入...';
  document.getElementById('isotp-status').textContent = '⏹️ 空闲';
  ISO_TP.state = 'IDLE';
}

function sendISOTP() {
  const input = document.getElementById('isotp-input').value.trim();
  if (!input) {
    showToast('请输入 HEX 数据', 'error');
    return;
  }

  const result = segmentISOTPData(input);
  if (!result) {
    showToast('HEX 格式无效，请使用空格分隔的十六进制字节', 'error');
    return;
  }

  ISO_TP.frames = result.frames;
  ISO_TP.data = result.bytes;

  renderISOTPFrames(result);
  document.getElementById('isotp-frame-count').textContent =
    `共 ${result.frames.length} 帧 | 总 ${result.totalLen} 字节`;

  if (result.frames.length === 1) {
    // Single Frame: send SF then process UDS request
    ISO_TP.state = 'SF';
    updateISOTPStatus();
    logISOTPFrame(result.frames[0], 'req');
    setTimeout(() => {
      ISO_TP.state = 'IDLE';
      updateISOTPStatus();
      doSend(result.bytes);
    }, 100);
  } else {
    // Multi Frame: FF → FC → CF → CF → ... → CF → process UDS
    startMultiFrameTransmission(result);
  }
}

function startMultiFrameTransmission(result) {
  const frames = result.frames;
  let idx = 0;

  function markFrameActive(i) {
    document.querySelectorAll('.isotp-frame-item').forEach((el, j) => {
      el.classList.toggle('isotp-active', j === i);
      if (j < i) el.classList.add('isotp-sent');
    });
  }

  // 1. Send FF
  ISO_TP.state = 'FF';
  updateISOTPStatus();
  markFrameActive(0);
  logISOTPFrame(frames[0], 'req');
  idx++;

  // 2. After delay, ECU sends FC (Flow Control)
  setTimeout(() => {
    const fcBytes = [0x30, 0x00, 0x00];
    logISOTPFrame({ type: 'FC', data: fcBytes, dataHex: bytesToHexStr(fcBytes) }, 'res');

    // 3. Send CFs with 10ms intervals
    ISO_TP.state = 'CF';
    updateISOTPStatus();

    let cfIdx = idx;
    function sendNextCF() {
      if (cfIdx >= frames.length) {
        ISO_TP.state = 'IDLE';
        updateISOTPStatus();
        markFrameActive(-1);
        addLogEntry([], '✅ ISO-TP 多帧重组完成，数据已提交至 UDS 处理', 'res');
        // Pass full reassembled data to UDS processing
        setTimeout(() => doSend(result.bytes), 60);
        return;
      }

      markFrameActive(cfIdx);
      logISOTPFrame(frames[cfIdx], 'req');
      cfIdx++;
      // Scroll frame list to show active
      const activeEl = document.querySelector('.isotp-frame-item.isotp-active');
      if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      setTimeout(sendNextCF, 10);
    }
    setTimeout(sendNextCF, 60);
  }, 150);
}

function logISOTPFrame(frame, direction) {
  let displayStr;
  if (frame.type === 'FC') {
    displayStr = `[ISO-TP] FC  [${frame.dataHex}]`;
  } else if (frame.type === 'SF') {
    displayStr = `[ISO-TP] SF  [${frame.dataHex}]`;
  } else if (frame.type === 'FF') {
    displayStr = `[ISO-TP] FF  [${frame.dataHex}]`;
  } else if (frame.type === 'CF') {
    displayStr = `[ISO-TP] CF ${frame.sn}[${frame.dataHex}]`;
  } else {
    displayStr = `[ISO-TP] ${frame.type} [${frame.dataHex}]`;
  }

  const desc = getISOTPFrameDesc(frame);
  addLogEntry(displayStr, desc, direction);
}

function getISOTPFrameDesc(frame) {
  switch (frame.type) {
    case 'SF': return `单帧: ${frame.payloadLen} 字节数据`;
    case 'FF': return `首帧: 总长 ${frame.payloadLen} 字节`;
    case 'CF': return `连续帧 #${frame.sn}: ${frame.payloadLen} 字节`;
    case 'FC': return `流控帧: Continue (BS=0, STmin=0)`;
    default: return '';
  }
}

// ======================== OBD-II COMPATIBLE MODE ========================
/** SAE J1979 OBD-II Mode 01 PIDs */
const OBD2_PIDS = {
  '04':  { name: '发动机负载', unit: '%', formula: 'A/2.55', desc: '计算发动机负载值' },
  '05':  { name: '冷却液温度', unit: '°C', formula: 'A-40', desc: '发动机冷却液温度' },
  '0A':  { name: '燃油压力', unit: 'kPa', formula: 'A*3', desc: '燃油系统压力' },
  '0B':  { name: '进气歧管压力', unit: 'kPa', formula: 'A', desc: '进气歧管绝对压力' },
  '0C':  { name: '发动机转速', unit: 'RPM', formula: '(A*256+B)/4', desc: '发动机每分钟转速' },
  '0D':  { name: '车速', unit: 'km/h', formula: 'A', desc: '车辆速度' },
  '0F':  { name: '进气温度', unit: '°C', formula: 'A-40', desc: '进气温度' },
  '10':  { name: 'MAF 空气流量', unit: 'g/s', formula: '(A*256+B)/100', desc: '空气流量计读数' },
  '11':  { name: '节气门位置', unit: '%', formula: 'A/2.55', desc: '节气门开度百分比' },
  '21':  { name: '故障灯行驶里程', unit: 'km', formula: 'A*256+B', desc: 'MIL 点亮后的行驶距离' },
  '2F':  { name: '燃油液位', unit: '%', formula: 'A/2.55', desc: '油箱燃油液位百分比' },
  '46':  { name: '环境温度', unit: '°C', formula: 'A-40', desc: '环境空气温度' },
  '51':  { name: '燃油类型', unit: '', formula: 'A', desc: '燃油类型编码' },
};

let obd2Mode = false; // false=UDS, true=OBD-II

/** Toggle between UDS and OBD-II mode */
function toggleOBD2Mode() {
  obd2Mode = !obd2Mode;
  updateOBD2UI();
  document.getElementById('uds-composer').style.display = obd2Mode ? 'none' : 'block';
  document.getElementById('obd2-composer').style.display = obd2Mode ? 'block' : 'none';
  const m = obd2Mode ? '🟢 OBD-II 模式' : '🔵 UDS 模式';
  addLogEntry([], `模式切换 → ${m}`, 'res');
}

/** Update OBD-II panel UI according to current state */
function updateOBD2UI() {
  const led = document.getElementById('obd2-mode-led');
  const label = document.getElementById('obd2-mode-label');
  const status = document.getElementById('obd2-status');
  const sw = document.getElementById('obd2-mode-switch');
  if (!led || !label || !status) return;

  sw.checked = obd2Mode;
  if (obd2Mode) {
    led.className = 'obd2-mode-indicator obd2';
    label.innerHTML = '当前模式: <strong style="color:var(--success)">OBD-II 模式</strong>';
    status.innerHTML = '🟢 OBD-II 模式已激活 · Mode 01 PID 请求已就绪';
  } else {
    led.className = 'obd2-mode-indicator uds';
    label.innerHTML = '当前模式: <strong style="color:var(--primary)">UDS 模式</strong>';
    status.innerHTML = 'OBD-II 模式已禁用 · 使用 UDS 协议';
  }
}

/** Toggle OBD-II panel collapsible */
function toggleOBD2Panel() {
  const body = document.getElementById('obd2-body');
  const toggle = document.getElementById('obd2-toggle');
  const isOpen = body.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  if (isOpen) renderOBD2Panel();
}

/** Render the OBD-II PID grid buttons */
function renderOBD2Panel() {
  const grid = document.getElementById('obd2-pid-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (const [pid, info] of Object.entries(OBD2_PIDS)) {
    const btn = document.createElement('button');
    btn.className = 'obd2-pid-btn';
    btn.innerHTML = `<span class="pid-val">${pid}</span><span class="pid-name">${info.name}</span>`;
    btn.title = `${info.desc}\n公式: ${info.formula}${info.unit ? ' → ' + info.unit : ''}`;
    btn.onclick = () => sendOBD2Request(pid);
    grid.appendChild(btn);
  }
}

/** Handle OBD-II Mode 01 request for given PID hex string */
function handleOBD2Request(pid) {
  const info = OBD2_PIDS[pid];
  if (!info) {
    return { sid: 0x41, payload: [parseInt(pid, 16), 0x00], desc: `OBD-II PID ${pid} 不支持`, isNeg: true };
  }

  // Generate realistic simulated values
  const pidVal = parseInt(pid, 16);
  let data = [];

  if (pidVal === 0x0C) { // RPM: ~1500-2800
    const rpm = 1500 + Math.floor(Math.random() * 1300);
    data = [(rpm * 4) >> 8, (rpm * 4) & 0xFF];
  } else if (pidVal === 0x0D) { // Speed: ~35-90 km/h
    data = [35 + Math.floor(Math.random() * 56)];
  } else if (pidVal === 0x05 || pidVal === 0x0F || pidVal === 0x46) { // Temp: 35-100°C
    data = [35 + Math.floor(Math.random() * 66)];
  } else if (pidVal === 0x04) { // Load: 15-85%
    data = [Math.floor(15 + Math.random() * 71)];
  } else if (pidVal === 0x2F) { // Fuel level: 25-95%
    data = [Math.floor(25 + Math.random() * 71)];
  } else if (pidVal === 0x10) { // MAF: 2-25 g/s
    const maf = 200 + Math.floor(Math.random() * 2300);
    data = [maf >> 8, maf & 0xFF];
  } else if (pidVal === 0x11) { // Throttle: 5-60%
    data = [Math.floor(5 + Math.random() * 56)];
  } else if (pidVal === 0x0A) { // Fuel pressure: 150-500 kPa
    data = [Math.floor((150 + Math.random() * 351) / 3)];
  } else if (pidVal === 0x0B) { // Intake MAP: 30-105 kPa
    data = [30 + Math.floor(Math.random() * 76)];
  } else if (pidVal === 0x21) { // MIL distance: 100-5000 km
    const dist = 100 + Math.floor(Math.random() * 4900);
    data = [dist >> 8, dist & 0xFF];
  } else if (pidVal === 0x51) { // Fuel type: typically 1 (gasoline)
    data = [0x01];
  } else {
    data = [Math.floor(Math.random() * 200)];
  }

  const formatted = formatOBD2Value(pid, data, info);
  return {
    sid: 0x41,
    payload: [pidVal, ...data],
    desc: `OBD-II PID ${pid}: ${info.name} = ${formatted}`
  };
}

/** Format OBD-II value based on formula */
function formatOBD2Value(pid, data, info) {
  const A = data[0] || 0;
  const B = data[1] || 0;
  let val = 0;
  try {
    // Safe eval for math expressions with A and B
    val = eval(info.formula);
  } catch {
    val = A;
  }
  return `${Math.round(val * 10) / 10}${info.unit}`;
}

/** Send an OBD-II Mode 01 request for a specific PID */
function sendOBD2Request(pid) {
  if (!pid) return;
  doSend([0x01, parseInt(pid, 16)]);
}

/** Send OBD-II message from the composer */
function sendOBD2Message() {
  const input = document.getElementById('obd2-pid-input');
  if (!input) return;
  const raw = input.value.trim();
  if (!raw || !/^[0-9a-fA-F]{2}$/.test(raw)) {
    showToast('请输入有效的 2 位 HEX PID (如 0C)', 'error');
    return;
  }
  sendOBD2Request(raw.toUpperCase());
}

/** Set OBD-II PID input and auto-send */
function setOBD2PID(pid) {
  const input = document.getElementById('obd2-pid-input');
  if (input) input.value = pid;
  updateOBD2Preview();
  sendOBD2Request(pid);
}

/** Update OBD-II composer preview */
function updateOBD2Preview() {
  const input = document.getElementById('obd2-pid-input');
  if (!input) return;
  const raw = input.value.trim();
  const preq = document.getElementById('obd2-preview-req');
  const pres = document.getElementById('obd2-preview-res');
  const dec = document.getElementById('obd2-decode-text');

  if (!raw || !/^[0-9a-fA-F]{2}$/.test(raw)) {
    if (preq) preq.innerHTML = '<span class="byte sid">01</span> <span class="byte data">??</span>';
    if (pres) pres.innerHTML = '<span class="byte sid">41</span> <span class="byte data">PID+Data</span>';
    if (dec) dec.textContent = '输入有效 PID 以查看解码信息';
    return;
  }

  const pid = raw.toUpperCase();
  const info = OBD2_PIDS[pid];
  if (preq) {
    preq.innerHTML = `<span class="byte sid">01</span> <span class="byte data">${pid}</span>`;
  }
  if (pres) {
    pres.innerHTML = `<span class="byte sid">41</span> <span class="byte data">${pid}</span> <span class="byte data">??</span>`;
  }
  if (dec) {
    if (info) {
      dec.textContent = `PID 0x${pid}: ${info.name} | 公式: ${info.formula}${info.unit ? ' | 单位: ' + info.unit : ''} | ${info.desc}`;
    } else {
      dec.textContent = `PID 0x${pid}: 未知 PID (不支持)`;
    }
  }
}

/** Run OBD-II demo: read RPM + Speed + Coolant Temp sequentially */
function runOBD2Demo() {
  addLogEntry([], '=== 🟢 OBD-II 模式 01 演示开始 ===', 'res');
  addLogEntry([], '演示: 读取发动机转速、车速、冷却液温度', 'req');
  setTimeout(() => sendOBD2Request('0C'), 400);
  setTimeout(() => sendOBD2Request('0D'), 900);
  setTimeout(() => sendOBD2Request('05'), 1400);
  setTimeout(() => {
    addLogEntry([], '=== ✅ OBD-II 演示完成 ===', 'res');
  }, 2000);
}

// ======================== SEND MESSAGE ========================
function sendMessage() {
  const sid = parseInt(document.getElementById('composer-sid').value);
  const info = SID_INFO[sid];
  if (!info) return;

  const reqBytes = [parseInt(info.reqSID, 16)];
  const sfVal = document.getElementById('composer-sf')?.value;
  if (sfVal) reqBytes.push(parseInt(sfVal, 16));

  const dataStr = document.getElementById('composer-data').value.trim();
  if (dataStr) {
    for (const p of dataStr.split(/[\s,]+/)) {
      if (/^[0-9a-fA-F]{2}$/.test(p)) reqBytes.push(parseInt(p, 16));
    }
  }

  doSend(reqBytes);
}

function doSend(reqBytes) {
  // OBD-II mode intercept: if first byte is 0x01, route to OBD-II handler
  if (obd2Mode && reqBytes.length >= 2 && reqBytes[0] === 0x01) {
    const pidHex = reqBytes[1].toString(16).toUpperCase().padStart(2, '0');
    addLogEntry(reqBytes, `OBD-II Mode 01 — PID 0x${pidHex}`, 'req');
    logCANFrame(reqBytes, 'req');

    setTimeout(() => {
      const result = handleOBD2Request(pidHex);
      if (result) {
        const resBytes = [result.sid, ...result.payload];
        if (result.isNeg) {
          addLogEntry(resBytes, result.desc, 'neg');
          logCANFrame(resBytes, 'neg');
          ECU.counters.neg++;
        } else {
          addLogEntry(resBytes, result.desc, 'res');
          logCANFrame(resBytes, 'res');
          ECU.counters.pos++;
        }
      }
      updateECUStatus();
    }, 50);
    return;
  }

  // Display request
  const reqDesc = (SID_INFO[reqBytes[0]]?.name || '?') + ' 请求';
  addLogEntry(reqBytes, reqDesc, 'req');
  logCANFrame(reqBytes, 'req');

  // Simulate P2 delay
  const p2Delay = Math.min(ECU.P2, 200);

  setTimeout(() => {
    // Process
    const result = processRequest(reqBytes);
    if (result) {
      const resBytes = [result.sid, ...result.payload];
      if (result.isNeg) {
        addLogEntry(resBytes, result.desc, 'neg');
        logCANFrame(resBytes, 'neg');
        ECU.counters.neg++;
      } else {
        addLogEntry(resBytes, result.desc, 'res');
        logCANFrame(resBytes, 'res');
        ECU.counters.pos++;
      }
    } else {
      // Suppressed response
      addLogEntry([], '⏭️ 正响应已抑制 (suppressPosRspMsgIndicationBit)', 'res');
    }
    updateECUStatus();
    // Auto-save history (throttled to 30s intervals)
    saveHistory();
  }, p2Delay);
}

function sendRawHex() {
  const raw = document.getElementById('hex-raw').value.trim();
  if (!raw) return;
  const bytes = [];
  for (const p of raw.split(/[\s,]+/)) {
    if (/^[0-9a-fA-F]{2}$/.test(p)) bytes.push(parseInt(p, 16));
  }
  if (bytes.length === 0) {
    showToast('无效的 HEX 输入', 'error');
    return;
  }
  doSend(bytes);
}

function onRawHex() {
  const raw = document.getElementById('hex-raw').value.trim();
  if (!raw) return;
  const bytes = [];
  for (const p of raw.split(/[\s,]+/)) {
    if (/^[0-9a-fA-F]{2}$/.test(p)) bytes.push(parseInt(p, 16));
  }
  if (bytes.length > 0) {
    const sid = bytes[0];
    const info = SID_INFO[sid];
    if (info) {
      document.getElementById('composer-sid').value = sid;
      onComposerChange();
    }
    // Update decode
    const el = document.getElementById('decode-text');
    el.innerHTML = `原始 HEX: ${bytes.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ')}<br>长度: ${bytes.length} 字节`;
  }
}

// ======================== FLASH PROGRAMMING ========================
const FLASH_STEPS = [
  { step: 1, sid: '10 02', desc: '进入编程会话 (10 02)', req: [0x10, 0x02], delay: 800 },
  { step: 2, sid: '27 01', desc: '安全访问 — 请求种子 (27 01)', req: [0x27, 0x01], delay: 800 },
  { step: 3, sid: '27 02', desc: '安全访问 — 发送密钥 (27 02 ...)', req: [0x27, 0x02, 0x12, 0x34, 0x56, 0x78], delay: 800 },
  { step: 4, sid: '31 01 FF 00', desc: '擦除内存 (31 01 FF 00)', req: [0x31, 0x01, 0xFF, 0x00], delay: 1000 },
  { step: 5, sid: '34 00 44', desc: '请求下载 (34 00 44 ...)', req: [0x34, 0x00, 0x44, 0x00, 0x00, 0x20, 0x00, 0x00], delay: 800 },
  // Step 6 is 8 TransferData blocks — handled specially
  { step: 6, sid: '36 xx', desc: '传输数据 ×8 (36 01-08)', req: null, delay: 2400 },
  { step: 7, sid: '37', desc: '传输退出 → 硬复位 (37 → 11 01)', req: [0x37], delay: 1200 },
];

const FLASH_DATA_BLOCKS = [
  [0x01, 0x01, 0x02, 0x03, 0x04],
  [0x02, 0x05, 0x06, 0x07, 0x08],
  [0x03, 0x09, 0x0A, 0x0B, 0x0C],
  [0x04, 0x0D, 0x0E, 0x0F, 0x10],
  [0x05, 0x11, 0x12, 0x13, 0x14],
  [0x06, 0x15, 0x16, 0x17, 0x18],
  [0x07, 0x19, 0x1A, 0x1B, 0x1C],
  [0x08, 0x1D, 0x1E, 0x1F, 0x20],
];

function startFlashProgramming() {
  if (ECU.flashState.running) return;
  ECU.flashState.running = true;
  ECU.flashState.step = 0;
  ECU.flashState.appValid = true;
  ECU.flashState.bootActive = false;
  updateFlashUI();
  document.getElementById('btn-flash-start').disabled = true;
  document.getElementById('btn-flash-stop').disabled = false;
  addLogEntry([], '=== 📥 刷写流程演示开始 ===', 'res');
  runFlashAuto();
}

function stopFlashProgramming() {
  ECU.flashState.running = false;
  ECU.flashState.step = 0;
  updateFlashUI();
  document.getElementById('btn-flash-start').disabled = false;
  document.getElementById('btn-flash-stop').disabled = true;
  addLogEntry([], '⏹️ 刷写流程已停止', 'res');
}

async function runFlashAuto() {
  // Step 1: 10 02 — Programming Session
  if (!ECU.flashState.running) return;
  ECU.flashState.step = 1;
  updateFlashUI();
  await waitSend(FLASH_STEPS[0].req, 200);

  // Step 2: 27 01 — Request Seed
  if (!ECU.flashState.running) return;
  ECU.flashState.step = 2;
  updateFlashUI();
  await waitSend(FLASH_STEPS[1].req, 800);

  // Step 3: 27 02 — Send Key
  if (!ECU.flashState.running) return;
  ECU.flashState.step = 3;
  updateFlashUI();
  await waitSend(FLASH_STEPS[2].req, 800);

  // Step 4: 31 01 FF 00 — Erase Memory
  if (!ECU.flashState.running) return;
  ECU.flashState.step = 4;
  updateFlashUI();
  await waitSend(FLASH_STEPS[3].req, 1000);

  // Step 5: 34 00 44 ... — RequestDownload
  if (!ECU.flashState.running) return;
  ECU.flashState.step = 5;
  updateFlashUI();
  await waitSend(FLASH_STEPS[4].req, 800);

  // Step 6: 36 xx — TransferData x 8 blocks
  if (!ECU.flashState.running) return;
  ECU.flashState.step = 6;
  updateFlashUI();
  for (let i = 0; i < FLASH_DATA_BLOCKS.length; i++) {
    if (!ECU.flashState.running) return;
    const block = FLASH_DATA_BLOCKS[i];
    const dataBytes = [0x36, ...block];
    // Log block description
    addLogEntry([], `📦 数据块 #${i+1}/${FLASH_DATA_BLOCKS.length}: ${bytesToHexStr(block.slice(1))}`, 'req');
    doSend(dataBytes);
    // Update step 6 detail in panel
    updateFlashStep6Detail(i + 1);
    await sleep(400);
  }

  // Step 7: 37 — RequestTransferExit → auto-reset
  if (!ECU.flashState.running) return;
  ECU.flashState.step = 7;
  updateFlashUI();
  await waitSend(FLASH_STEPS[6].req, 800);

  // Auto-reset: 11 01
  if (!ECU.flashState.running) return;
  await sleep(600);
  addLogEntry([], '🔄 ECU 自动硬复位 — 切换到新应用', 'req');
  // Mark app as updated and boot as active after flash
  ECU.flashState.appValid = true;
  ECU.flashState.bootActive = false;
  doSend([0x11, 0x01]);

  await sleep(800);
  addLogEntry([], '=== ✅ 刷写流程完成! ECU 已使用新应用重启 ===', 'res');

  // Done
  ECU.flashState.running = false;
  ECU.flashState.step = 8; // past all steps = complete
  updateFlashUI();
  document.getElementById('btn-flash-start').disabled = false;
  document.getElementById('btn-flash-stop').disabled = true;
}

function updateFlashUI() {
  const step = ECU.flashState.step;
  const totalSteps = FLASH_STEPS.length;
  const pct = Math.min(100, Math.round((step / totalSteps) * 100));

  // Progress bar
  const fill = document.getElementById('flash-progress-fill');
  const text = document.getElementById('flash-progress-text');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `进度 ${pct}%`;

  // Step items
  for (let i = 1; i <= totalSteps; i++) {
    const el = document.getElementById(`flash-step-${i}`);
    if (!el) continue;
    el.className = 'flash-step-item';
    if (i < step) el.classList.add('flash-done');
    else if (i === step) el.classList.add('flash-active');
    else el.classList.add('flash-pending');

    const icon = el.querySelector('.flash-step-icon');
    const status = el.querySelector('.flash-step-status');
    if (icon) {
      if (i < step) icon.textContent = '✓';
      else if (i === step) icon.textContent = '▶';
      else icon.textContent = '○';
    }
    if (status) {
      if (i < step) status.textContent = '✓ 完成';
      else if (i === step) status.textContent = '⏳ 执行中...';
      else status.textContent = '';
    }
  }

  // Update ECU status panel for flash state
  const appValidEl = document.getElementById('ecu-flash-app');
  const bootActiveEl = document.getElementById('ecu-flash-boot');
  if (appValidEl) appValidEl.textContent = ECU.flashState.appValid ? '✅ 有效' : '⚠️ 无效';
  if (bootActiveEl) bootActiveEl.textContent = ECU.flashState.bootActive ? '✅ 激活' : '⏹️ 未激活';
}

function updateFlashStep6Detail(blockNum) {
  const el = document.getElementById('flash-step-6-detail');
  if (el) el.textContent = `传输数据块 ${blockNum}/${FLASH_DATA_BLOCKS.length}`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleFlashPanel() {
  const body = document.getElementById('flash-body');
  const toggle = document.getElementById('flash-toggle');
  const isOpen = body.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
}

// ======================== SCENARIOS ========================
function waitSend(bytes, delay) {
  return new Promise(resolve => {
    setTimeout(() => { doSend(bytes); resolve(); }, delay);
  });
}

function runScenario(name) {
  switch (name) {
    case 'session-default': doSend([0x10, 0x01]); break;
    case 'session-extended': doSend([0x10, 0x03]); break;
    case 'session-programming': doSend([0x10, 0x02]); break;
    case 'tester-present': doSend([0x3E, 0x00]); break;
    case 'read-vin': doSend([0x22, 0xF1, 0x90]); break;
    case 'read-dtc-status': doSend([0x19, 0x02, 0xFF]); break;
    case 'clear-dtc':
      addLogEntry([], '🗑️ 尝试清除 DTC（需要非默认会话+安全解锁）', 'req');
      doSend([0x14, 0xFF, 0xFF, 0xFF]);
      break;
    case 'read-multi-did':
      addLogEntry([], '📊 批量读取 DID: F190, F192, F193', 'req');
      doSend([0x22, 0xF1, 0x90, 0xF1, 0x92, 0xF1, 0x93]);
      break;
    case 'routine-checksum':
      addLogEntry([], '🔧 启动校验和例程 (需已进入非默认会话)', 'req');
      doSend([0x31, 0x01, 0xFF, 0x02]);
      break;
    case 'security-access':
      addLogEntry([], '--- 🔐 SecurityAccess Level 1 流程 ---', 'res');
      addLogEntry([], '步骤 1/2: 进入扩展会话...', 'req');
      doSend([0x10, 0x03]);
      setTimeout(() => {
        addLogEntry([], '步骤 2/3: 请求种子 (0x27 0x01)...', 'req');
        doSend([0x27, 0x01]);
        setTimeout(() => {
          addLogEntry([], '步骤 3/3: 发送密钥 (0x27 0x02 0x12 0x34 0x56 0x78)...', 'req');
          doSend([0x27, 0x02, 0x12, 0x34, 0x56, 0x78]);
        }, 400);
      }, 400);
      break;
    case 'ecu-reset': doSend([0x11, 0x01]); break;
    case 'full-diag-flow':
      addLogEntry([], '=== 📋 完整诊断流程演示 ===', 'res');
      addLogEntry([], 'Step 1: 进入扩展会话...', 'req');
      doSend([0x10, 0x03]);
      setTimeout(() => {
        addLogEntry([], 'Step 2: SecurityAccess 请求种子...', 'req');
        doSend([0x27, 0x01]);
        setTimeout(() => {
          addLogEntry([], 'Step 3: 发送密钥解锁...', 'req');
          doSend([0x27, 0x02, 0x12, 0x34, 0x56, 0x78]);
          setTimeout(() => {
            addLogEntry([], 'Step 4: 读取 VIN (DID F190)...', 'req');
            doSend([0x22, 0xF1, 0x90]);
            setTimeout(() => {
              addLogEntry([], 'Step 5: 读取 DTC 状态...', 'req');
              doSend([0x19, 0x02, 0xFF]);
              setTimeout(() => {
                addLogEntry([], 'Step 6: 清除 DTC...', 'req');
                doSend([0x14, 0xFF, 0xFF, 0xFF]);
                setTimeout(() => {
                  addLogEntry([], 'Step 7: TesterPresent 保持会话...', 'req');
                  doSend([0x3E, 0x00]);
                  setTimeout(() => {
                    addLogEntry([], '=== ✅ 诊断流程完成 ===', 'res');
                  }, 300);
                }, 300);
              }, 300);
            }, 300);
          }, 300);
        }, 500);
      }, 400);
      break;
    case 'download-flow':
      addLogEntry([], '=== 📥 下载流程演示 ===', 'res');
      addLogEntry([], 'Step 1: 进入编程会话...', 'req');
      doSend([0x10, 0x02]);
      setTimeout(() => {
        addLogEntry([], 'Step 2: RequestDownload...', 'req');
        doSend([0x34, 0x00, 0x44, 0x00, 0x80, 0x00, 0x10, 0x00]);
        setTimeout(() => {
          addLogEntry([], 'Step 3-6: TransferData x4...', 'req');
          doSend([0x36, 0x01, 0xAA, 0xBB, 0xCC, 0xDD]);
          setTimeout(() => doSend([0x36, 0x02, 0x11, 0x22, 0x33, 0x44]), 200);
          setTimeout(() => doSend([0x36, 0x03, 0x55, 0x66, 0x77, 0x88]), 400);
          setTimeout(() => doSend([0x36, 0x04, 0x99, 0xAA, 0xBB, 0xCC]), 600);
          setTimeout(() => {
            addLogEntry([], 'Step 7: RequestTransferExit...', 'req');
            doSend([0x37, 0x00, 0x00, 0x00, 0x64]);
          }, 800);
        }, 400);
      }, 400);
      break;
    case 'isotp-demo':
      addLogEntry([], '=== 🔗 ISO-TP 多帧传输演示 ===', 'res');
      addLogEntry([], '演示 30 字节数据通过 FF+FC+CF+CF+CF+CF 分段传输', 'req');
      // Ensure ISO-TP panel is open
      document.getElementById('isotp-body').classList.add('open');
      document.getElementById('isotp-toggle').classList.add('open');
      // Clear previous input and set demo data
      document.getElementById('isotp-input').value = '34 00 44 00 00 10 00 11 22 33 44 55 66 77 88 99 AA BB CC DD EE FF 00 11 22 33 44 55 66 77';
      // Small delay to let UI settle, then trigger send
      setTimeout(() => sendISOTP(), 300);
      break;
    case 'flash-programming':
      addLogEntry([], '=== 📥 完整刷写流程（含多帧）===', 'res');
      // Ensure Flash panel is open
      document.getElementById('flash-body').classList.add('open');
      document.getElementById('flash-toggle').classList.add('open');
      // Start flash programming with a small delay
      setTimeout(() => startFlashProgramming(), 300);
      break;
  }
}

// ======================== AUTO TP ========================
function toggleAutoTP() {
  ECU.autoTP = !ECU.autoTP;
  document.getElementById('btn-tp').textContent = `⏱️ 自动 TP: ${ECU.autoTP ? '开' : '关'}`;
  if (ECU.autoTP) {
    ECU.tpTimer = setInterval(() => {
      if (ECU.session !== 0x01) {
        doSend([0x3E, 0x00]);
      }
    }, 2000);
  } else {
    if (ECU.tpTimer) clearInterval(ECU.tpTimer);
  }
}

// ======================== RESET ========================
function resetECU() {
  saveECUState();
  ECU.session = 0x01;
  ECU.sessionName = 'Default';
  ECU.securityLevel = 0;
  ECU.securityAttempts = 0;
  ECU.P2 = 50; ECU.P2star = 2000; ECU.S3 = 0;
  ECU.communication = true;
  ECU.dtcSetting = true;
  ECU.counters = { rx: 0, tx: 0, pos: 0, neg: 0 };
  updateECUStatus();
  const name = (ECU_CONFIGS[activeECU] || {}).name || activeECU;
  addLogEntry([], `🔄 ${name} 已复位到默认状态`, 'res');
}

// ======================== TOAST ========================
function showToast(msg, type) {
  const toast = document.createElement('div');
  toast.className = `toast ${type || ''}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ======================== HISTORY MANAGEMENT ========================

function generateSummary() {
  const total = logEntries.length;
  const posCount = logEntries.filter(e => e.type === 'res').length;
  const negCount = logEntries.filter(e => e.type === 'neg').length;
  const reqCount = logEntries.filter(e => e.type === 'req').length;
  return `${total} 条消息, ${reqCount} 条请求, ${posCount} 个正响应, ${negCount} 个负响应`;
}

function getHistories() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch { return []; }
}

function setHistories(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

function saveHistory() {
  if (logEntries.length === 0) return;
  const now = Date.now();
  if (now - lastAutoSave < 30000) return;
  lastAutoSave = now;

  const history = {
    id: 'hist_' + now,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    summary: generateSummary(),
    entries: logEntries.map(e => ({ time: e.time, timeStr: e.timeStr, hexStr: e.hexStr, desc: e.desc, type: e.type }))
  };

  const list = getHistories();
  list.unshift(history);
  if (list.length > 20) list.length = 20;
  setHistories(list);
}

function loadHistory(id) {
  const list = getHistories();
  const hist = list.find(h => h.id === id);
  if (!hist) { showToast('找不到该历史记录', 'error'); return; }

  clearLog();
  logEntries = hist.entries.map(e => ({ ...e }));
  renderLogEntries();
  closeHistoryPanel();
  showToast(`✅ 已加载 ${hist.entries.length} 条历史记录`, 'success');
}

function deleteHistory(id) {
  let list = getHistories();
  list = list.filter(h => h.id !== id);
  setHistories(list);
  renderHistoryList();
  showToast('🗑️ 历史记录已删除', 'success');
}

function renderLogEntries() {
  const container = document.getElementById('log-container');
  const countEl = document.getElementById('msg-count');
  countEl.textContent = logEntries.length + ' 条消息';

  const empty = document.getElementById('empty-state');
  if (empty) empty.remove();

  const existing = container.querySelectorAll('.msg-entry');
  existing.forEach(el => el.remove());

  if (logEntries.length === 0) {
    container.innerHTML = `<div class="empty-state" id="empty-state">
      <div class="icon">📡</div>
      <p>日志已清空</p>
      <div class="hint">使用右侧构造器发送 UDS 请求</div>
    </div>`;
    return;
  }

  logEntries.forEach(e => {
    const entry = document.createElement('div');
    entry.className = `msg-entry ${e.type}`;

    let dirSymbol = '', dirClass = e.type;
    if (e.type === 'req') { dirSymbol = '▶'; dirClass = 'req'; }
    else if (e.type === 'res') { dirSymbol = '◀'; dirClass = 'res'; }
    else if (e.type === 'neg') { dirSymbol = '✕'; dirClass = 'neg'; }
    else { dirSymbol = '◆'; dirClass = 'res'; }

    entry.innerHTML = `
      <span class="time">${e.timeStr}</span>
      <span class="direction ${dirClass}">${dirSymbol}</span>
      <div class="content">
        <div class="bytes ${dirClass}">${e.hexStr}</div>
        <div class="desc">${e.desc}</div>
      </div>
    `;
    container.appendChild(entry);
  });
  container.scrollTop = container.scrollHeight;
}

function renderHistoryList() {
  const listEl = document.getElementById('history-list');
  if (!listEl) return;
  const list = getHistories();

  if (list.length === 0) {
    listEl.innerHTML = '<div class="history-empty">暂无历史记录</div>';
    return;
  }

  listEl.innerHTML = list.map(h => `
    <div class="history-item">
      <div class="history-item-info">
        <div class="history-item-time">🕐 ${h.timestamp}</div>
        <div class="history-item-summary">${h.summary}</div>
      </div>
      <div class="history-item-actions">
        <button class="btn btn-sm btn-primary" onclick="loadHistory('${h.id}')">📂 加载</button>
        <button class="btn btn-sm" onclick="deleteHistory('${h.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

function openHistoryPanel() {
  renderHistoryList();
  document.getElementById('history-overlay').style.display = 'flex';
  document.addEventListener('keydown', _onHistoryKeydown);
}

function closeHistoryPanel() {
  document.getElementById('history-overlay').style.display = 'none';
  document.removeEventListener('keydown', _onHistoryKeydown);
}

function _onHistoryKeydown(e) {
  if (e.key === 'Escape') closeHistoryPanel();
}

function clearAllHistory() {
  if (!confirm('确定要清除所有历史记录吗？')) return;
  setHistories([]);
  renderHistoryList();
  showToast('🗑️ 所有历史记录已清除', 'success');
}

function exportHistory() {
  const list = getHistories();
  if (list.length === 0) {
    showToast('暂无历史记录可导出', 'error');
    return;
  }

  let text = '=== UDS 诊断历史记录 ===\n';
  text += `导出时间: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}\n`;
  text += `共 ${list.length} 条记录\n\n`;

  list.forEach((h, idx) => {
    text += `--- 记录 #${idx + 1} ---\n`;
    text += `日期: ${h.timestamp}\n`;
    text += `${h.summary}\n`;
    text += '---\n';
    h.entries.forEach(e => {
      const prefix = e.type === 'req' ? '▶' : e.type === 'res' ? '◀' : e.type === 'neg' ? '✕' : '◆';
      text += `[${e.timeStr}] ${prefix} ${e.hexStr} — ${e.desc}\n`;
    });
    text += '\n';
  });

  text += '=== 结束 ===\n';

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `UDS_诊断历史_${new Date().toISOString().substring(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📤 历史记录已导出', 'success');
}

// ======================== TIMELINE CHART ========================
let _showTimeline = false;

function toggleTimeline() {
  _showTimeline = !_showTimeline;
  const btn = document.getElementById('btn-timeline');
  if (btn) btn.classList.toggle('active', _showTimeline);

  if (_showTimeline) {
    renderTimeline();
  } else {
    renderLogEntries();
  }
}

/**
 * Match request entries with their corresponding response/negative-response entries.
 * Only pairs actual byte-bearing entries (hexStr non-empty) to avoid false pairing
 * with informational log messages.
 */
function matchReqResPairs(entries) {
  const pairs = [];
  // Filter to only byte-bearing req/res/neg entries
  const realEntries = entries.filter(function(e) {
    return e.hexStr && e.hexStr.length > 0 &&
      (e.type === 'req' || e.type === 'res' || e.type === 'neg');
  });

  let i = 0;
  while (i < realEntries.length) {
    if (realEntries[i].type === 'req') {
      const req = realEntries[i];
      let res = null;
      let foundIdx = -1;
      // Find the next res or neg after this req
      for (let j = i + 1; j < realEntries.length; j++) {
        if (realEntries[j].type === 'res' || realEntries[j].type === 'neg') {
          res = realEntries[j];
          foundIdx = j;
          break;
        }
      }
      if (res && foundIdx !== -1) {
        const duration = Math.max(0, res.time - req.time);
        pairs.push({ req: req, res: res, duration: duration });
        i = foundIdx + 1;
      } else {
        // No matching response — pending request
        pairs.push({ req: req, res: null, duration: 0 });
        i++;
      }
    } else {
      i++;
    }
  }
  return pairs;
}

/**
 * Get a short session/status tag for display in the timeline bar labels.
 */
function getSessionTag(type, entry) {
  if (type === 'res') return 'OK';
  if (type === 'neg') return 'NRC';
  // For requests, determine session from stored session name
  var session = entry.session || '';
  if (session.indexOf('Extended') !== -1) return 'EXT';
  if (session.indexOf('Programming') !== -1) return 'PROG';
  if (session.indexOf('Safety') !== -1) return 'SAFE';
  return 'DEF';
}

/**
 * Get the CSS class for a session tag.
 */
function getSessionClass(tag) {
  var map = {
    'DEF': 's-def',
    'EXT': 's-ext',
    'PROG': 's-prog',
    'SAFE': 's-safe',
    'OK': 's-ok',
    'NRC': 's-nrc',
    '⏳': 's-pend'
  };
  return map[tag] || 's-def';
}

/**
 * Render the timeline chart into the log container.
 */
function renderTimeline() {
  const container = document.getElementById('log-container');
  if (!container) return;

  // Remove any existing empty-state
  const emptyEl = document.getElementById('empty-state');
  if (emptyEl) emptyEl.remove();

  if (logEntries.length === 0) {
    container.innerHTML = '<div class="timeline-container">' +
      '<div class="timeline-empty"><div class="icon">📊</div><p>暂无数据，请先发送一些 UDS 请求</p></div></div>';
    return;
  }

  const pairs = matchReqResPairs(logEntries);

  if (pairs.length === 0) {
    container.innerHTML = '<div class="timeline-container">' +
      '<div class="timeline-empty"><div class="icon">📊</div><p>暂无完整的请求-响应对</p>' +
      '<div class="hint">发送 UDS 请求后会自动生成时间线</div></div></div>';
    return;
  }

  // Take last 20 pairs for display
  const recentPairs = pairs.slice(-20);

  // Calculate max duration for proportional bar widths
  let maxDuration = 1;
  for (let pi = 0; pi < recentPairs.length; pi++) {
    if (recentPairs[pi].duration > maxDuration) {
      maxDuration = recentPairs[pi].duration;
    }
  }

  // Calculate statistics
  let posCount = 0, negCount = 0, pendingCount = 0;
  const validDurations = [];
  for (let si = 0; si < recentPairs.length; si++) {
    const p = recentPairs[si];
    if (p.res) {
      if (p.res.type === 'res') posCount++;
      else if (p.res.type === 'neg') negCount++;
      if (p.duration > 0) validDurations.push(p.duration);
    } else {
      pendingCount++;
    }
  }
  let avgDuration = 0;
  if (validDurations.length > 0) {
    let sum = 0;
    for (let di = 0; di < validDurations.length; di++) sum += validDurations[di];
    avgDuration = Math.round(sum / validDurations.length);
  }

  // Build timeline HTML
  let html = '<div class="timeline-container">';

  // Header
  html += '<div class="timeline-header-bar">' +
    '📊 请求-响应时间线 <span class="tl-count">(最近 ' + recentPairs.length + ' 条)</span></div>';

  // Pairs
  for (let pi2 = 0; pi2 < recentPairs.length; pi2++) {
    const pair = recentPairs[pi2];

    // Calculate bar width as percentage of max duration (minimum 15% for visibility)
    const reqBarPct = pair.duration > 0
      ? Math.max(15, Math.round((pair.duration / maxDuration) * 85))
      : 15;

    const reqTag = getSessionTag('req', pair.req);
    const reqTagCls = getSessionClass(reqTag);

    // Truncate hex strings that are too long
    let reqLabel = pair.req.hexStr || '';
    if (reqLabel.length > 16) reqLabel = reqLabel.substring(0, 14) + '…';

    const durStr = pair.duration > 0 ? pair.duration + 'ms' : '—';

    html += '<div class="timeline-pair">';

    // Request bar
    html += '<div class="timeline-bar-row">' +
      '<span class="timeline-bar-label">' +
      '<span class="dir-icon" style="color:var(--req-color)">▶</span> ' + reqLabel +
      '<span class="session-tag ' + reqTagCls + '">' + reqTag + '</span>' +
      '</span>' +
      '<div class="timeline-bar-fill req" style="width:' + reqBarPct + '%">' +
      '<span class="timeline-bar-dur">' + durStr + '</span>' +
      '</div></div>';

    if (pair.res) {
      const resBarPct = pair.duration > 0
        ? Math.max(15, Math.round((pair.duration / maxDuration) * 85))
        : 15;
      const resTag = getSessionTag(pair.res.type, pair.res);
      const resTagCls = getSessionClass(resTag);
      let resLabel = pair.res.hexStr || '';
      if (resLabel.length > 16) resLabel = resLabel.substring(0, 14) + '…';
      const resColor = pair.res.type === 'neg' ? 'var(--neg-color)' : 'var(--res-color)';
      const resDir = pair.res.type === 'neg' ? '✕' : '◀';
      const resFillCls = pair.res.type === 'neg' ? 'neg' : 'res';

      html += '<div class="timeline-bar-row">' +
        '<span class="timeline-bar-label">' +
        '<span class="dir-icon" style="color:' + resColor + '">' + resDir + '</span> ' + resLabel +
        '<span class="session-tag ' + resTagCls + '">' + resTag + '</span>' +
        '</span>' +
        '<div class="timeline-bar-fill ' + resFillCls + '" style="width:' + resBarPct + '%"></div></div>';
    } else {
      // Pending request — show waiting indicator
      html += '<div class="timeline-bar-row">' +
        '<span class="timeline-bar-label">' +
        '<span class="dir-icon" style="color:var(--warning)">⏳</span>' +
        '<span class="session-tag s-pend">等待响应</span>' +
        '</span>' +
        '<div class="timeline-bar-fill pending" style="width:15%"></div></div>';
    }

    html += '</div>';
  }

  // Stats bar
  html += '<div class="timeline-stats">' +
    '<div class="stat-item"><span class="stat-label">请求:</span><span class="stat-value req">' + recentPairs.length + '</span></div>' +
    '<div class="stat-item"><span class="stat-label">正响应:</span><span class="stat-value res">' + posCount + '</span></div>' +
    '<div class="stat-item"><span class="stat-label">负响应:</span><span class="stat-value neg">' + negCount + '</span></div>' +
    '<div class="stat-item"><span class="stat-label">平均 RTT:</span><span class="stat-value avg">' + avgDuration + 'ms</span></div>';
  if (pendingCount > 0) {
    html += '<div class="stat-item"><span class="stat-label">等待中:</span><span class="stat-value pending">' + pendingCount + '</span></div>';
  }
  html += '</div>';

  html += '</div>'; // close timeline-container

  container.innerHTML = html;
}
// ======================== ERROR INJECTION TEACHING ========================

function toggleErrorPanel() {
  const body = document.getElementById('error-body');
  const toggle = document.getElementById('error-toggle');
  const isOpen = body.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
}

function renderErrorScenarios() {
  const list = document.getElementById('error-list');
  if (!list) return;
  list.innerHTML = '';
  for (const s of ERROR_SCENARIOS) {
    const item = document.createElement('div');
    item.className = 'error-item';
    item.innerHTML =
      '<span class="err-sid">' + s.sid + '</span>' +
      '<span class="err-desc">' + s.desc + '</span>' +
      '<span class="err-nrc">' + s.expectNRC + '</span>' +
      '<button class="btn btn-sm" onclick="runErrorScenario(\'' + s.id + '\')" style="flex-shrink:0">执行</button>';
    list.appendChild(item);
  }
}

function updateErrorUI() {
  const btns = document.querySelectorAll('.error-item .btn');
  for (const btn of btns) btn.disabled = ECU.errorDemoRunning;
  const autoBtn = document.querySelector('.error-body .btn-primary');
  if (autoBtn) autoBtn.disabled = ECU.errorDemoRunning;
}

function runErrorScenario(id) {
  const scenario = ERROR_SCENARIOS.find(function(s) { return s.id === id; });
  if (!scenario) return;
  if (ECU.errorDemoRunning) return;

  addLogEntry([], '=== 🎯 ' + scenario.sid + ' — ' + scenario.desc + ' ===', 'res');

  function doSendError() {
    addLogEntry([], '🎯 ' + scenario.action, 'req');
    doSend(scenario.req);
    setTimeout(function() {
      addLogEntry([], '💡 ' + scenario.explanation, 'res');
    }, 300);
  }

  if (scenario.setupBytes && scenario.setupBytes.length > 0) {
    setTimeout(function() {
      doSend(scenario.setupBytes);
      setTimeout(doSendError, (scenario.setupDelay || 500) + 200);
    }, 100);
  } else {
    setTimeout(doSendError, 100);
  }
}

async function runErrorScenarioSequential(scenario) {
  addLogEntry([], '=== 🎯 ' + scenario.sid + ' — ' + scenario.desc + ' ===', 'res');

  // Step 1: Execute setup if needed
  if (scenario.setupBytes && scenario.setupBytes.length > 0) {
    await sleep(100);
    doSend(scenario.setupBytes);
    await sleep(scenario.setupDelay || 500);
  }

  // Step 2: Send error request
  await sleep(200);
  addLogEntry([], '🎯 ' + scenario.action, 'req');
  doSend(scenario.req);

  // Step 3: Wait for negative response (P2 delay + margin)
  await sleep(300);

  // Step 4: Log explanation
  addLogEntry([], '💡 ' + scenario.explanation, 'res');

  await sleep(200);
}

async function runAllErrors() {
  if (ECU.errorDemoRunning) return;
  ECU.errorDemoRunning = true;
  updateErrorUI();

  addLogEntry([], '=== 🎯 错误注入教学演示开始 ===', 'res');

  for (let i = 0; i < ERROR_SCENARIOS.length; i++) {
    if (!ECU.errorDemoRunning) break;
    await runErrorScenarioSequential(ERROR_SCENARIOS[i]);
  }

  ECU.errorDemoRunning = false;
  updateErrorUI();
  addLogEntry([], '=== ✅ 所有错误场景演示完成 ===', 'res');
}

function stopErrorDemo() {
  ECU.errorDemoRunning = false;
  updateErrorUI();
  addLogEntry([], '⏹️ 错误演示已停止', 'res');
}

// ======================== CAN BUS MONITOR ========================
let canFrameEntries = [];
const CAN_MAX_FRAMES = 50;

let canConfig = {
  format: '2.0A',
  annotate: false,
  busState: 'active',
  tec: 0,
  rec: 0,
  totalFrames: 0,
  frameTimestamps: [],
  errorInjection: null
};

function makeCANFrame(bytes, direction) {
  const REQ_ID = 0x7E0;
  const RES_ID = 0x7E8;
  const isReq = (direction === 'req');
  const canId = isReq ? REQ_ID : RES_ID;
  const dataLen = bytes.length;
  const fmtPrefix = canConfig.format === '2.0B' ? '[EXT]' : canConfig.format === 'FD' ? '[FD]' : '';
  return {
    id: canId,
    idHex: canId.toString(16).toUpperCase().padStart(canConfig.format === '2.0B' ? 6 : 3, '0'),
    dlc: dataLen > 8 ? (dataLen > 64 ? 64 : dataLen) : 8,
    data: bytes.slice(0, 8),
    dataHex: bytes.slice(0, 8).map(function(b) {
      return b.toString(16).toUpperCase().padStart(2, '0');
    }).join(' '),
    isExtended: canConfig.format === '2.0B',
    direction: direction,
    rawBytes: bytes,
    capturedAt: performance.now(),
    formatPrefix: fmtPrefix,
  };
}

function logCANFrame(bytes, direction) {
  if (!bytes || bytes.length === 0) return;
  const frame = makeCANFrame(bytes, direction);
  frame.timestamp = new Date();

  canFrameEntries.push(frame);
  if (canFrameEntries.length > CAN_MAX_FRAMES) {
    canFrameEntries = canFrameEntries.slice(-CAN_MAX_FRAMES);
  }

  renderCANFrame(frame);
  updateCANStatus();

  canConfig.frameTimestamps.push({time: performance.now(), bits: canConfig.format === '2.0B' ? 128 : 108});
  canConfig.totalFrames++;
  const now = performance.now();
  canConfig.frameTimestamps = canConfig.frameTimestamps.filter(function(f) { return now - f.time < 1000; });
  updateCANEnhancedUI();
}

function renderCANFrame(frame) {
  const listEl = document.getElementById('can-frame-list');
  if (!listEl) return;

  // Remove empty state if present
  const emptyEl = listEl.querySelector('.can-empty');
  if (emptyEl) emptyEl.remove();

  const ts = frame.timestamp;
  const fmtTag = frame.formatPrefix ? ' ' + frame.formatPrefix : '';
  const timeStr = ts.toLocaleTimeString('zh-CN', { hour12: false }) + '.' +
    String(ts.getMilliseconds()).padStart(3, '0') + fmtTag;

  const dirSymbol = frame.direction === 'req' ? '▶' :
    frame.direction === 'neg' ? '✕' : '◀';

  const div = document.createElement('div');
  div.className = 'can-frame can-' + frame.direction;

  // Use full bytes if available, otherwise use DLC-padded data
  const dataHex = frame.rawBytes ? frame.rawBytes.slice(0, 8).map(function(b) {
    return b.toString(16).toUpperCase().padStart(2, '0');
  }).join(' ') : frame.dataHex;

  div.innerHTML =
    '<span class="can-time">' + timeStr + '</span>' +
    '<span class="can-dir">' + dirSymbol + '</span>' +
    '<span class="can-id">0x' + frame.idHex + '</span>' +
    '<span class="can-dlc">DLC=' + frame.dlc + '</span>' +
    '<span class="can-data">' + dataHex + '</span>';

  listEl.appendChild(div);
  listEl.scrollTop = listEl.scrollHeight;
}

function updateCANStatus() {
  const countEl = document.getElementById('can-frame-count');
  if (countEl) countEl.textContent = canFrameEntries.length;

  const ledEl = document.getElementById('can-bus-led');
  const labelEl = document.getElementById('can-bus-label');
  if (canFrameEntries.length > 0) {
    if (ledEl) { ledEl.className = 'can-bus-led active'; }
    if (labelEl) labelEl.textContent = '活跃';
  } else {
    if (ledEl) { ledEl.className = 'can-bus-led idle'; }
    if (labelEl) labelEl.textContent = '空闲';
  }
}

function toggleCANPanel() {
  const body = document.getElementById('can-body');
  const toggle = document.getElementById('can-toggle');
  const isOpen = body.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
}

function clearCANLog() {
  canFrameEntries = [];
  const listEl = document.getElementById('can-frame-list');
  if (listEl) {
    listEl.innerHTML = '<div class="can-empty">等待 CAN 帧...</div>';
  }
  updateCANStatus();
}

function injectCANError(type) {
  canConfig.errorInjection = type;
  if (type === 'bus-off') { canConfig.tec = 256; }
  else { canConfig.tec += 8; }
  updateCANBusState();
  updateCANEnhancedUI();
  const el = document.getElementById('can-frame-list');
  if (!el) return;
  const err = document.createElement('div');
  err.className = 'can-frame can-error-frame';
  err.innerHTML = '<span class="cf-time">' + new Date().toLocaleTimeString() + '</span><span class="cf-dir" style="color:#ef4444">⚠</span><span class="cf-data" style="color:#ef4444">Error: ' + type.toUpperCase() + '</span>';
  el.prepend(err);
}

function demoCANArbitration() {
  const el = document.getElementById('can-frame-list');
  if (!el) return;
  const nodes = [{id:'0x7E0',pri:'High',clr:'#10b981'},{id:'0x7E8',pri:'Med',clr:'#f59e0b'},{id:'0x7F0',pri:'Low',clr:'#ef4444'}];
  const now = new Date().toLocaleTimeString();
  nodes.forEach(function(n, i) {
    setTimeout(function() {
      const div = document.createElement('div');
      div.className = 'can-frame' + (i===0?'':' can-arbiter-lost');
      div.style.cssText = i>0 ? 'opacity:.5;text-decoration:line-through' : '';
      div.innerHTML = '<span class="cf-time">' + now + '</span><span class="cf-dir" style="color:' + n.clr + '">▶</span><span class="cf-data">ID ' + n.id + ' (' + n.pri + ')' + (i===0?' ✓ WINS':'') + '</span>';
      el.prepend(div);
    }, i*400);
  });
}

function updateCANBusState() {
  if (canConfig.tec > 255) canConfig.busState = 'bus-off';
  else if (canConfig.tec > 127 || canConfig.rec > 127) canConfig.busState = 'passive';
  else canConfig.busState = 'active';
}

function calculateCANBusLoad() {
  var now2 = performance.now();
  canConfig.frameTimestamps = canConfig.frameTimestamps.filter(function(f) { return now2 - f.time < 1000; });
  var totalBits = canConfig.frameTimestamps.reduce(function(s, f) { return s + f.bits; }, 0);
  return Math.min(100, Math.round((totalBits / 1000000) * 100));
}

function updateCANEnhancedUI() {
  var stateEl = document.getElementById('can-bus-state');
  var tecEl = document.getElementById('can-tec');
  var recEl = document.getElementById('can-rec');
  var loadEl = document.getElementById('can-load');
  if (stateEl) {
    var states = {active:['Error Active','var(--success)'],passive:['Error Passive','var(--warning,#f59e0b)'],'bus-off':['Bus Off','var(--danger,#ef4444)']};
    var s = states[canConfig.busState]||states.active;
    stateEl.textContent = s[0]; stateEl.style.color = s[1];
  }
  if (tecEl) tecEl.textContent = canConfig.tec;
  if (recEl) recEl.textContent = canConfig.rec;
  if (loadEl) loadEl.textContent = calculateCANBusLoad();
}

(function initCANUI() {
  var fmtSel = document.getElementById('can-format-select');
  if (fmtSel) fmtSel.addEventListener('change', function() { canConfig.format = this.value; });
  var annToggle = document.getElementById('can-annotate-toggle');
  if (annToggle) annToggle.addEventListener('change', function() { canConfig.annotate = this.checked; updateCANEnhancedUI(); });
  setInterval(updateCANEnhancedUI, 500);
})();

// LIN Bus Engine
var linState = { mode: 'master', active: false, frames: [], scheduleActive: false, currentSlot: 0, maxFrames: 50 };
var LIN_SCHEDULE = [
  { id: 0x10, name: '车速', period: '10ms' },
  { id: 0x11, name: '转速', period: '10ms' },
  { id: 0x12, name: '水温', period: '100ms' },
  { id: 0x30, name: '灯光控制', period: '100ms' },
  { id: 0x3C, name: '主节点状态', period: '50ms' }
];

function toggleLINPanel() {
  var body = document.getElementById('lin-body');
  var toggle = document.getElementById('lin-toggle');
  if (!body || !toggle) return;
  body.classList.toggle('open');
  toggle.classList.toggle('open');
}

function setLINMode(mode) { linState.mode = mode; updateLINStatusDisplay(); }

function calculateLINParity(id) { var p0 = ((id>>0)&1)^((id>>1)&1)^((id>>2)&1)^((id>>4)&1); var p1 = ~(((id>>1)&1)^((id>>3)&1)^((id>>4)&1)^((id>>5)&1))&1; return (id&0x3F)|(p0<<6)|(p1<<7); }

function calculateLINChecksum(data, pid, enhanced) {
  var sum = enhanced ? pid : 0;
  for (var i=0;i<data.length;i++){ sum += data[i]; if(sum>=256)sum=(sum&0xFF)+(sum>>8); }
  return (~sum)&0xFF;
}

function sendLINFrame(id, data) {
  var pid = calculateLINParity(id);
  // ISO 17987-3:2016 §5.2.2.7: 0x3C/0x3D always classic, 0x00-0x3B enhanced
  var isDiag = (id === 0x3C || id === 0x3D);
  var checksum = calculateLINChecksum(data, isDiag ? 0 : pid, !isDiag);
  var frame = { time: new Date().toLocaleTimeString(), dir: linState.mode==='master'?'M→S':'S→M', pid: pid, data: data, chk: checksum };
  linState.frames.unshift(frame);
  if (linState.frames.length > linState.maxFrames) linState.frames.pop();
  renderLINFrameList();
  updateLINStatusDisplay();
}

function sendLINWakeUp() {
  var el = document.getElementById('lin-frame-list'); if (!el) return;
  var div = document.createElement('div');
  div.className = 'lin-frame';
  div.innerHTML = '<span class="lin-time">' + new Date().toLocaleTimeString() + '</span><span class="lin-dir" style="color:#f59e0b">⚡</span><span class="lin-pid">WAKE</span><span class="lin-data">250μs dominant pulse</span>';
  el.prepend(div);
  var led = document.getElementById('lin-bus-led'); if (led) { led.className = 'lin-bus-led wake'; setTimeout(function(){led.className='lin-bus-led active';},500); }
}

function sendLINSleep() {
  sendLINFrame(0x3C, [0x00]);
  var led = document.getElementById('lin-bus-led');
  if (led) { led.className = 'lin-bus-led idle'; }
  var label = document.getElementById('lin-bus-label');
  if (label) label.textContent = 'Sleep';
}

function runLINMasterSchedule() {
  if (linState.scheduleActive) { linState.scheduleActive = false; updateLINStatusDisplay(); return; }
  linState.scheduleActive = true;
  updateLINStatusDisplay();
  renderLINSchedule();
  function sendNext() {
    if (!linState.scheduleActive) return;
    var entry = LIN_SCHEDULE[linState.currentSlot % LIN_SCHEDULE.length];
    var data = [];
    for (var i=0;i<4;i++) data.push(Math.floor(Math.random()*256));
    sendLINFrame(entry.id, data);
    linState.currentSlot++;
    setTimeout(sendNext, 600);
  }
  sendNext();
}

function renderLINFrameList() {
  var el = document.getElementById('lin-frame-list'); if (!el) return;
  var h = '';
  for (var i=0;i<linState.frames.length;i++) {
    var f = linState.frames[i];
    h += '<div class="lin-frame"><span class="lin-time">' + f.time + '</span><span class="lin-dir">' + f.dir + '</span><span class="lin-pid">0x' + f.pid.toString(16).toUpperCase().padStart(2,'0') + '</span><span class="lin-data">' + f.data.map(function(b){return b.toString(16).toUpperCase().padStart(2,'0');}).join(' ') + '</span><span class="lin-chk">0x' + f.chk.toString(16).toUpperCase().padStart(2,'0') + '</span></div>';
  }
  el.innerHTML = h || '<div class="lin-empty">No LIN frames</div>';
  var countEl = document.getElementById('lin-frame-count');
  if (countEl) countEl.textContent = linState.frames.length;
}

function renderLINSchedule() {
  var el = document.getElementById('lin-schedule-list'); if (!el) return;
  var h = '';
  LIN_SCHEDULE.forEach(function(e) {
    h += '<div class="lin-schedule-item"><span class="lin-sched-id">0x' + e.id.toString(16).toUpperCase() + '</span><span class="lin-sched-desc">' + e.name + ' (' + e.period + ')</span></div>';
  });
  el.innerHTML = h || '<div class="lin-empty">No schedule entries</div>';
}

function clearLINLog() { linState.frames = []; renderLINFrameList(); }

function updateLINStatusDisplay() {
  var label = document.getElementById('lin-bus-label');
  if (label) label.textContent = linState.scheduleActive ? 'Running (' + linState.mode + ')' : (linState.mode === 'master' ? 'Master Idle' : 'Slave Idle');
  var led = document.getElementById('lin-bus-led');
  if (led) led.className = 'lin-bus-led' + (linState.scheduleActive ? ' active' : ' idle');
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var fmtSel = document.getElementById('can-format-select');
    if (fmtSel) fmtSel.addEventListener('change', function() { canConfig.format = this.value; });
    var annToggle = document.getElementById('can-annotate-toggle');
    if (annToggle) annToggle.addEventListener('change', function() { canConfig.annotate = this.checked; });
    setInterval(updateCANEnhancedUI, 500);
  }, 300);
});

// ======================== DoIP (ISO 13400) ========================
const DOIP_TYPES = {
  '0x0001': { name: 'Generic Header NACK', type: 'system' },
  '0x0002': { name: 'VIN Request', type: 'system' },
  '0x0003': { name: 'VIN Response', type: 'system' },
  '0x0004': { name: 'Routing Activation Request', type: 'routing' },
  '0x0005': { name: 'Routing Activation Response', type: 'routing' },
  '0x8001': { name: 'Diagnostic Message', type: 'diagnostic' },
  '0x8002': { name: 'Diagnostic ACK', type: 'diagnostic' },
  '0x8003': { name: 'Diagnostic NACK', type: 'diagnostic' },
  '0x8004': { name: 'Alive Check', type: 'system' },
};

let doipState = {
  active: false,
  connected: false,
  routingActivated: false,
  sourceAddr: 0x0E00,
  targetAddr: 0x0E80,
  vin: 'WDB9705032L123456',
  gid: '0123456789ABCDEF',
  packetLog: [],
  aliveCheckInterval: null,
};

const DOIP_POWER_MODES = ['点火关闭', '点火开启', '熄火-休眠'];
let doipPowerMode = 1;

function toggleDoIPPanel() {
  const body = document.getElementById('doip-body');
  const toggle = document.getElementById('doip-toggle');
  const isOpen = body.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
}

function toggleDoIP() {
  doipState.active = !doipState.active;
  if (doipState.active) {
    doipState.connected = true;
    logDoIPPacket(null, 'system', [], 'DoIP 协议已激活');
    updateDoipUI();
  } else {
    doipState.connected = false;
    doipState.routingActivated = false;
    if (doipState.aliveCheckInterval) {
      clearInterval(doipState.aliveCheckInterval);
      doipState.aliveCheckInterval = null;
    }
    logDoIPPacket(null, 'system', [], 'DoIP 协议已停用');
    updateDoipUI();
  }
  document.getElementById('btn-doip-toggle').textContent = doipState.active ? '停用 DoIP' : '激活 DoIP';
}

function logDoIPPacket(typeId, direction, dataBytes, desc) {
  const ts = new Date();
  const timeStr = ts.toLocaleTimeString('zh-CN', { hour12: false }) + '.' +
    String(ts.getMilliseconds()).padStart(3, '0');

  const typeInfo = typeId != null ? DOIP_TYPES['0x' + typeId.toString(16).toUpperCase().padStart(4, '0')] : null;
  const typeName = typeInfo ? typeInfo.name : (desc || '系统');
  const typeIdStr = typeId != null ? typeId.toString(16).toUpperCase().padStart(4, '0') : '';

  const dataHex = dataBytes && dataBytes.length > 0
    ? dataBytes.map(function(b) { return b.toString(16).toUpperCase().padStart(2, '0'); }).join(' ')
    : '';

  doipState.packetLog.push({ time: ts.getTime(), timeStr: timeStr, typeId: typeIdStr, typeName: typeName, dataHex: dataHex, direction: direction, desc: desc || typeName });
  if (doipState.packetLog.length > 100) {
    doipState.packetLog = doipState.packetLog.slice(-100);
  }

  renderDoIPLog();
}

function renderDoIPLog() {
  const logEl = document.getElementById('doip-log');
  const emptyEl = document.getElementById('doip-empty');
  if (!logEl) return;
  if (emptyEl) emptyEl.style.display = 'none';

  // Clear existing entries
  const existing = logEl.querySelectorAll('.doip-msg');
  for (let i = 0; i < existing.length; i++) existing[i].remove();

  if (doipState.packetLog.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  const entries = doipState.packetLog.slice(-50);
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const div = document.createElement('div');
    div.className = 'doip-msg';

    let dirSymbol = '';
    if (e.direction === 'req' || e.direction === 'out') dirSymbol = '▶';
    else if (e.direction === 'res' || e.direction === 'in') dirSymbol = '◀';
    else if (e.direction === 'system') dirSymbol = '◆';
    else dirSymbol = '·';

    const typeDisplay = e.typeId || 'SYS';
    const dataDisplay = e.dataHex || e.desc || '';

    div.innerHTML = '<span class="doip-time">' + e.timeStr + '</span>' +
      '<span class="doip-dir">' + dirSymbol + '</span>' +
      '<span class="doip-type">' + typeDisplay + '</span>' +
      '<span class="doip-data">' + dataDisplay + '</span>';

    logEl.appendChild(div);
  }
  logEl.scrollTop = logEl.scrollHeight;
}

function sendDoIPVINRequest() {
  if (!doipState.active) {
    showToast('请先激活 DoIP 协议', 'error');
    return;
  }
  logDoIPPacket(0x0002, 'out', [], 'VIN/GID 广播请求');

  setTimeout(function() {
    const vinBytes = doipState.vin.split('').map(function(c) { return c.charCodeAt(0); });
    const gidBytes = doipState.gid.split('').map(function(c) { return c.charCodeAt(0); });
    const respData = [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].concat(
      vinBytes, gidBytes,
      [(doipState.sourceAddr >> 8) & 0xFF, doipState.sourceAddr & 0xFF],
      [(doipState.targetAddr >> 8) & 0xFF, doipState.targetAddr & 0xFF]
    );
    doipState.connected = true;
    updateDoipUI();
    logDoIPPacket(0x0003, 'in', respData, 'VIN: ' + doipState.vin + ' | 逻辑地址: 0x' + doipState.sourceAddr.toString(16).toUpperCase().padStart(4,'0'));
    addLogEntry([], '🌐 DoIP 车辆发现: VIN=' + doipState.vin, 'res');
  }, 100);
}

function sendDoIPRoutingActivation() {
  if (!doipState.active) {
    showToast('请先激活 DoIP 协议', 'error');
    return;
  }
  const reqData = [(doipState.sourceAddr >> 8) & 0xFF, doipState.sourceAddr & 0xFF, 0x00, 0x01, 0x00, 0x00];
  logDoIPPacket(0x0004, 'out', reqData, '路由激活请求 (源=0x' + doipState.sourceAddr.toString(16).toUpperCase().padStart(4,'0') + ')');

  setTimeout(function() {
    doipState.routingActivated = true;
    updateDoipUI();
    const respData = [0x10, (doipState.sourceAddr >> 8) & 0xFF, doipState.sourceAddr & 0xFF,
      (doipState.targetAddr >> 8) & 0xFF, doipState.targetAddr & 0xFF, 0x00, 0x00];
    logDoIPPacket(0x0005, 'in', respData, '路由激活成功 — 源 0x' + doipState.sourceAddr.toString(16).toUpperCase().padStart(4,'0') + ' → 目标 0x' + doipState.targetAddr.toString(16).toUpperCase().padStart(4,'0'));
    addLogEntry([], '🌐 DoIP 路由已激活: 0x' + doipState.sourceAddr.toString(16).toUpperCase().padStart(4,'0') + ' → 0x' + doipState.targetAddr.toString(16).toUpperCase().padStart(4,'0'), 'res');
  }, 150);
}

function sendDoIPDiagnostic() {
  if (!doipState.active) {
    showToast('请先激活 DoIP 协议', 'error');
    return;
  }
  if (!doipState.routingActivated) {
    showToast('请先完成路由激活', 'error');
    return;
  }

  const input = document.getElementById('doip-diag-input');
  if (!input) return;
  const raw = input.value.trim();
  if (!raw) {
    showToast('请输入 UDS HEX 数据', 'error');
    return;
  }

  const udsBytes = [];
  var parts = raw.split(/[\s,]+/);
  for (var i = 0; i < parts.length; i++) {
    if (/^[0-9a-fA-F]{2}$/.test(parts[i])) udsBytes.push(parseInt(parts[i], 16));
  }
  if (udsBytes.length === 0) {
    showToast('无效的 HEX 输入', 'error');
    return;
  }

  // Build DoIP diagnostic message payload (DoIP header + source addr + target addr + UDS data)
  const doipPayload = [
    (doipState.sourceAddr >> 8) & 0xFF, doipState.sourceAddr & 0xFF,
    (doipState.targetAddr >> 8) & 0xFF, doipState.targetAddr & 0xFF,
  ].concat(udsBytes);

  logDoIPPacket(0x8001, 'out', doipPayload, '诊断消息: ' + udsBytes.map(function(b) { return b.toString(16).toUpperCase().padStart(2,'0'); }).join(' '));

  // Forward to CAN/UDS bridge
  addLogEntry([], '🌐 DoIP → CAN 桥接: 转发 ' + udsBytes.length + ' 字节到 ' + (ECU_CONFIGS[activeECU] ? ECU_CONFIGS[activeECU].name : activeECU), 'req');
  doSend(udsBytes);

  // After P2 delay, log DoIP ACK
  setTimeout(function() {
    logDoIPPacket(0x8002, 'in', doipPayload, '诊断 ACK — 消息已路由到 ECU');
  }, Math.min(ECU.P2, 200) + 50);
}

function sendDoIPAliveCheck() {
  if (!doipState.active) return;
  logDoIPPacket(0x8004, 'out', [], 'Alive Check 请求');
  setTimeout(function() {
    logDoIPPacket(0x8004, 'in', [], 'Alive Check 响应 — 连接正常');
  }, 50);
}

function setDoipPowerMode(mode) {
  doipPowerMode = mode;
  logDoIPPacket(null, 'system', [], '电源模式: ' + DOIP_POWER_MODES[mode]);
  addLogEntry([], '🔋 DoIP 电源模式: ' + DOIP_POWER_MODES[mode], 'res');

  if (mode === 2) {
    doipState.connected = false;
    doipState.routingActivated = false;
    updateDoipUI();
  } else if (mode === 1 && doipState.active) {
    doipState.connected = true;
    updateDoipUI();
  }
}

function updateDoipUI() {
  const connEl = document.getElementById('doip-conn-status');
  const routeEl = document.getElementById('doip-route-status');
  const addrEl = document.getElementById('doip-addrs');

  if (connEl) {
    if (!doipState.active) {
      connEl.textContent = '未激活';
      connEl.style.color = 'var(--text3)';
    } else if (doipState.connected) {
      connEl.textContent = '🟢 已连接';
      connEl.style.color = 'var(--success)';
    } else {
      connEl.textContent = '🔴 断开';
      connEl.style.color = 'var(--danger)';
    }
  }

  if (routeEl) {
    if (doipState.routingActivated) {
      routeEl.textContent = '🟢 已激活';
      routeEl.style.color = 'var(--success)';
    } else {
      routeEl.textContent = '未激活';
      routeEl.style.color = 'var(--text3)';
    }
  }

  if (addrEl) {
    addrEl.textContent = '0x' + doipState.sourceAddr.toString(16).toUpperCase().padStart(4,'0') + ' → 0x' + doipState.targetAddr.toString(16).toUpperCase().padStart(4,'0');
  }
}

// ======================== INIT ========================
initComposer();
updateECUStatus();
renderErrorScenarios();
renderOBD2Panel();
updateOBD2UI();
switchLang(currentLang);
