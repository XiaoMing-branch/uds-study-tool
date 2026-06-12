/* UDS Learning Tool — Main JavaScript */
// ======================== DATA ========================
const FUNCTIONAL_UNITS = {
  'diagnostic-communication': { name: '诊断与通信管理', range: '0x10-0x3E, 0x84-0x87', desc: '负责诊断会话控制、ECU 复位、安全访问、通信控制等' },
  'data-transmission': { name: '数据传输', range: '0x22-0x2E, 0x3D', desc: '读写数据标识符、内存数据等' },
  'stored-data': { name: '存储数据传输', range: '0x14, 0x19', desc: '清除和读取诊断故障码 (DTC) 信息' },
  'io-control': { name: '输入输出控制', range: '0x2F', desc: '远程控制 ECU 输入输出信号' },
  'routine': { name: '例行程序', range: '0x31', desc: '启停 ECU 内部例行程序（如擦除、编程）' },
  'upload-download': { name: '上传下载', range: '0x34-0x38', desc: '在客户端和服务器之间传输数据' },
  'security': { name: '安全子层', range: '0x84', desc: '安全数据传输' }
};

// Colors for functional unit indicators
const UNIT_COLORS = {
  'diagnostic-communication': '#6366f1',
  'data-transmission': '#06b6d4',
  'stored-data': '#f59e0b',
  'io-control': '#ec4899',
  'routine': '#a855f7',
  'upload-download': '#ef4444',
  'security': '#10b981',
};

const SERVICES = [
  { sid: 0x10, name: 'DiagnosticSessionControl', cn: '诊断会话控制', shortName: 'DSC', unit: 'diagnostic-communication', reqSID: '10', resSID: '50',
    desc: '用于在服务器中启用不同的诊断会话。每个会话定义了一组支持的诊断服务和/或访问权限。',
    subfuncs: [
      { val: '01', name: 'defaultSession', desc: '默认会话 — 基本诊断功能' },
      { val: '02', name: 'programmingSession', desc: '编程会话 — 允许 ECU 编程/刷新' },
      { val: '03', name: 'extendedDiagnosticSession', desc: '扩展诊断会话 — 扩展的诊断功能' },
      { val: '04', name: 'safetySystemDiagnosticSession', desc: '安全系统诊断会话' },
      { val: '40-5F', name: 'vehicleManufacturerSpecific', desc: '制造商特定会话' },
      { val: '60-7E', name: 'ecuManufacturerSpecific', desc: 'ECU 制造商特定会话' }
    ],
    reqFmt: '10 + sessionType (1 byte)',
    resFmt: '50 + sessionType + P2* (2 bytes) + P2*_ext (2 bytes)',
    nrcs: ['12', '13', '22', '31', '33', '7E', '7F'],
    detail: '服务用于在服务器中切换不同的诊断会话。会话类型决定了服务器支持哪些服务。进入非默认会话通常需要安全访问。P2* 和 P2*_ext 分别表示服务器在非默认会话下的响应时间和扩展响应时间。' },
  { sid: 0x11, name: 'ECUReset', cn: 'ECU复位', shortName: 'ER', unit: 'diagnostic-communication', reqSID: '11', resSID: '51',
    desc: '强制服务器执行复位操作。复位后服务器返回到 defaultSession。',
    subfuncs: [
      { val: '01', name: 'hardReset', desc: '硬复位 — 模拟电源重启' },
      { val: '02', name: 'keyOffOnReset', desc: '钥匙关闭/开启复位 — 模拟 ignition 循环' },
      { val: '03', name: 'softReset', desc: '软复位 — 软件复位' },
      { val: '04', name: 'enableRapidPowerShutdown', desc: '启用快速断电' },
      { val: '05', name: 'disableRapidPowerShutdown', desc: '禁用快速断电' }
    ],
    reqFmt: '11 + resetType (1 byte)',
    resFmt: '51 + resetType + [powerDownTime]',
    nrcs: ['12', '13', '22', '33', '37', '7E', '7F'],
    detail: '复位服务可用于多种场景。hardReset 和 keyOffOnReset 后服务器通常需要重新初始化。softReset 保持电源但重启软件。enableRapidPowerShutdown 允许服务器在特定条件下进入低功耗模式。' },
  { sid: 0x14, name: 'ClearDiagnosticInformation', cn: '清除诊断信息', shortName: 'CDI', unit: 'stored-data', reqSID: '14', resSID: '54',
    desc: '清除服务器中存储的诊断信息（DTC 状态位、快照数据、扩展数据等）。',
    reqFmt: '14 + groupOfDTC (3 bytes)',
    resFmt: '54',
    nrcs: ['13', '22', '31', '33', '72', '7F'],
    detail: 'groupOfDTC 参数为 3 字节，高字节是 DTC 掩码，低 2 字节是 DTC 编号。值为 0xFFFFFF 表示清除所有 DTC。' },
  { sid: 0x19, name: 'ReadDTCInformation', cn: '读取DTC信息', shortName: 'RDTCI', unit: 'stored-data', reqSID: '19', resSID: '59',
    desc: '读取 DTC 信息。报告类型决定返回的具体 DTC 数据（状态、快照、扩展数据等）。',
    subfuncs: [
      { val: '01', name: 'reportNumberOfDTCByStatusMask', desc: '按状态掩码报告 DTC 数量' },
      { val: '02', name: 'reportDTCByStatusMask', desc: '按状态掩码报告 DTC' },
      { val: '03', name: 'reportDTCSnapshotIdentification', desc: '报告 DTC 快照标识' },
      { val: '04', name: 'reportDTCSnapshotRecordByDTCNumber', desc: '按 DTC 号报告快照记录' },
      { val: '05', name: 'reportDTCStoredDataByRecordNumber', desc: '按记录号报告 DTC 存储数据' },
      { val: '06', name: 'reportDTCExtDataRecordByDTCNumber', desc: '按 DTC 号报告扩展数据' },
      { val: '07', name: 'reportNumberOfDTCBySeverityMaskRecord', desc: '按严重性掩码报告 DTC 数量' },
      { val: '08', name: 'reportDTCBySeverityMaskRecord', desc: '按严重性掩码报告 DTC' },
      { val: '09', name: 'reportSeverityInformationOfDTC', desc: '报告 DTC 严重性信息' },
      { val: '0A', name: 'reportSupportedDTC', desc: '报告支持的 DTC' },
      { val: '0B', name: 'reportFirstTestFailedDTC', desc: '报告首次测试失败的 DTC' },
      { val: '0C', name: 'reportFirstConfirmedDTC', desc: '报告首次确认的 DTC' },
      { val: '0D', name: 'reportMostRecentTestFailedDTC', desc: '报告最近测试失败的 DTC' },
      { val: '0E', name: 'reportMostRecentConfirmedDTC', desc: '报告最近确认的 DTC' },
      { val: '0F', name: 'reportMostRecentAllDTC', desc: '报告最近的所有 DTC' }
    ],
    reqFmt: '19 + reportType (1 byte) + [data]',
    resFmt: '59 + [data]',
    nrcs: ['12', '13', '22', '31', '33', '7E', '7F'],
    detail: 'ReadDTCInformation 是最复杂的 UDS 服务之一，支持 20+ 种子功能（reportType）。用于读取 DTC 状态、快照、扩展数据、严重性信息等。reportType 取值范围 0x00-0xFF，其中 0x01-0x0F 为标准化报告类型。' },
  { sid: 0x22, name: 'ReadDataByIdentifier', cn: '通过标识符读取数据', shortName: 'RDBI', unit: 'data-transmission', reqSID: '22', resSID: '62',
    desc: '通过数据标识符 (DID) 读取 ECU 中当前的数据值。DID 为 2 字节。',
    reqFmt: '22 + DID (2 bytes) [可以多 DID 请求]',
    resFmt: '62 + DID + data',
    nrcs: ['13', '22', '31', '33', '7F'],
    detail: '最常用的诊断服务之一。DID (Data Identifier) 为 2 字节值，范围 0x0000-0xFFFF。标准定义了一些 DID 范围，如 0xF000-0xF0FF 用于网络/通信数据等。可在一条消息中请求多个 DID。' },
  { sid: 0x23, name: 'ReadMemoryByAddress', cn: '通过地址读取内存', shortName: 'RMBA', unit: 'data-transmission', reqSID: '23', resSID: '63',
    desc: '按内存地址读取服务器内存中的数据。需要指定地址和长度格式。',
    reqFmt: '23 + addressAndLengthFormat (1 byte) + memoryAddress (N bytes) + memorySize (N bytes)',
    resFmt: '63 + dataRecord',
    nrcs: ['13', '22', '31', '33', '7F'],
    detail: 'addressAndLengthFormat 的低 4 位表示地址字节数，高 4 位表示长度字节数。典型的 32 位地址格式：addressAndLengthFormat=0x44。' },
  { sid: 0x24, name: 'ReadScalingDataByIdentifier', cn: '通过标识符读取缩放数据', shortName: 'RSDBI', unit: 'data-transmission', reqSID: '24', resSID: '64',
    desc: '读取 DID 的缩放数据（单位、换算公式、范围等）。',
    reqFmt: '24 + DID (2 bytes)',
    resFmt: '64 + DID + scalingData',
    nrcs: ['13', '22', '31', '33', '7F'],
    detail: '缩放数据包括：1 byte 单位长度 + 单位 + 公式类型 + 公式数据（分子、分母、偏移量等）。用于获取传感器数据的换算信息。' },
  { sid: 0x27, name: 'SecurityAccess', cn: '安全访问', shortName: 'SA', unit: 'diagnostic-communication', reqSID: '27', resSID: '67',
    desc: '提供访问服务器安全相关功能的方法。使用种子-密钥机制解锁受保护的功能。',
    subfuncs: [
      { val: '01', name: 'requestSeed (level 1)', desc: '请求种子 — 安全级别 1' },
      { val: '02', name: 'sendKey (level 1)', desc: '发送密钥 — 安全级别 1' },
      { val: '03', name: 'requestSeed (level 2)', desc: '请求种子 — 安全级别 2' },
      { val: '04', name: 'sendKey (level 2)', desc: '发送密钥 — 安全级别 2' },
      { val: '05-41', name: 'reserved', desc: '保留子功能' },
      { val: '42-7E', name: 'vehicleManufacturerSpecific', desc: '制造商特定' }
    ],
    reqFmt: '27 + subFunction (requestSeed/sendKey) + [data]',
    resFmt: '67 + subFunction + [seed/key data]',
    nrcs: ['12', '13', '22', '24', '31', '35', '36', '37', '7E', '7F'],
    detail: '典型的种子-密钥流程：客户端请求种子 → 服务器返回种子 → 客户端计算密钥并发送 → 服务器验证。连续失败的解锁尝试次数超过限制时返回 NRC 0x36。' },
  { sid: 0x28, name: 'CommunicationControl', cn: '通信控制', shortName: 'CC', unit: 'diagnostic-communication', reqSID: '28', resSID: '68',
    desc: '控制服务器的通信行为（启用/禁用消息发送和接收）。',
    subfuncs: [
      { val: '00', name: 'enableRxAndTx', desc: '启用接收和发送' },
      { val: '01', name: 'enableRxAndDisableTx', desc: '启用接收，禁用发送' },
      { val: '02', name: 'disableRxAndEnableTx', desc: '禁用接收，启用发送' },
      { val: '03', name: 'disableRxAndTx', desc: '禁用接收和发送' }
    ],
    reqFmt: '28 + subFunction + communicationType (1 byte)',
    resFmt: '68 + subFunction',
    nrcs: ['12', '13', '22', '31', '33', '7E', '7F'],
    detail: 'communicationType 是位编码字节，bit0=normalCommunication, bit1=networkManagement, bit2-7 定义子网。适用于网关/多网络环境。' },
  { sid: 0x29, name: 'Authentication', cn: '认证', shortName: 'Auth', unit: 'diagnostic-communication', reqSID: '29', resSID: '69',
    desc: '基于 PKI 证书或挑战-应答机制的身份认证服务。ISO 14229-1:2020 新增。',
    reqFmt: '29 + subFunction + [authenticationData]',
    resFmt: '69 + subFunction + [data]',
    subfuncs: [
      { val: '01', name: 'authenticateUser', desc: '发起身份认证请求（作为 deAuthenticate 时不含数据）' },
      { val: '02', name: 'deAuthenticate', desc: '取消当前身份认证状态' },
      { val: '03', name: 'getCertificateRequest', desc: '请求 ECU 发送其证书（APCE 模式第一步）' },
      { val: '04', name: 'sendCertificate', desc: '向 ECU 发送证书（APCE 模式第二步）' },
      { val: '05', name: 'getChallengeRequest', desc: '请求挑战值（ACR 模式第一步）' },
      { val: '06', name: 'sendChallengeResponse', desc: '发送挑战响应（ACR 模式第二步）' },
      { val: '07', name: 'getAuthenticationResult', desc: '获取认证结果（两模式均使用）' },
      { val: '08', name: 'verifyCertificate', desc: '验证远程证书的有效性' },
      { val: '09-7E', name: 'ISOSAEReserved / vehicleManufacturerSpecific', desc: '保留或制造商特定子功能' },
      { val: '7F', name: 'ISOSAEReserved', desc: '保留' },
    ],
    nrcs: ['12', '13', '22', '24', '31', '33', '34', '37', '38', '39', '3A', '50-5D', '7E', '7F'],
    detail: '2020 版新增的安全认证服务。支持 PKI 证书交换模式(APCE) 和挑战-应答(ACR) 两种认证流程。' +
      'APCE 四步流程: deAuthenticate→getCertificateRequest→sendCertificate→getAuthenticationResult。' +
      'ACR 三步流程: deAuthenticate→getChallengeRequest→sendChallengeResponse→getAuthenticationResult。' +
      '增加 NRC 0x37(authenticationRequired)，认证未完成时返回。' +
      '使用 authenticatedUserCertificates 参数可指定证书身份。' },
  { sid: 0x2A, name: 'ReadDataByPeriodicIdentifier', cn: '通过周期标识符读取数据', shortName: 'RDBPI', unit: 'data-transmission', reqSID: '2A', resSID: '6A',
    desc: '按周期标识符读取数据。服务器按预定义的周期性数据标识符持续发送数据。',
    reqFmt: '2A + periodicDataIdentifier (1 byte)',
    resFmt: '6A + periodicDataIdentifier + data',
    nrcs: ['13', '22', '31', '33', '7F'],
    detail: '不同于 ReadDataByIdentifier 的一次性读取，此服务让服务器周期性发送指定数据，减少总线负载。periodicDataIdentifier 为 1 字节。' },
  { sid: 0x2C, name: 'DynamicallyDefineDataIdentifier', cn: '动态定义数据标识符', shortName: 'DDDI', unit: 'data-transmission', reqSID: '2C', resSID: '6C',
    desc: '动态定义数据标识符，将多个现有 DID 或内存地址组合成一个新的虚拟 DID。',
    subfuncs: [
      { val: '01', name: 'defineByIdentifier', desc: '通过标识符定义数据' },
      { val: '02', name: 'defineByMemoryAddress', desc: '通过内存地址定义数据' },
      { val: '03', name: 'clearDynamicallyDefinedDataIdentifier', desc: '清除动态定义的数据标识符' }
    ],
    reqFmt: '2C + definitionMode (1 byte) + [definitionData]',
    resFmt: '6C + [dynamicallyDefinedDID]',
    nrcs: ['12', '13', '22', '31', '33', '7E', '7F'],
    detail: '允许客户端灵活组合多个数据源为一个 DID。使用 0x2C 读/写此动态 DID 时相当于同时访问多个数据。动态 DID 在非默认会话中可用。' },
  { sid: 0x2E, name: 'WriteDataByIdentifier', cn: '通过标识符写入数据', shortName: 'WDBI', unit: 'data-transmission', reqSID: '2E', resSID: '6E',
    desc: '按 DID 向 ECU 写入数据。用于修改配置参数、标定数据等。',
    reqFmt: '2E + DID (2 bytes) + dataRecord',
    resFmt: '6E + DID',
    nrcs: ['13', '22', '31', '33', '72', '7F'],
    detail: '写入的数据长度需与 DID 定义长度一致。通常需要在非默认会话中且有安全访问权限才能写入。' },
  { sid: 0x2F, name: 'InputOutputControlByIdentifier', cn: '通过标识符输入输出控制', shortName: 'IOCBI', unit: 'io-control', reqSID: '2F', resSID: '6F',
    desc: '通过 DID 控制 ECU 的输入输出信号（如驱动执行器、覆盖传感器值）。',
    subfuncs: [
      { val: '00', name: 'returnControlToECU', desc: '将控制权交还 ECU' },
      { val: '01', name: 'resetToDefault', desc: '重置为默认值' },
      { val: '02', name: 'freezeCurrentState', desc: '冻结当前状态' },
      { val: '03', name: 'shortTermAdjustment', desc: '短期调整' }
    ],
    reqFmt: '2F + DID (2 bytes) + controlOption + [controlState]',
    resFmt: '6F + DID + controlOption + [controlState]',
    nrcs: ['12', '13', '22', '31', '33', '7E', '7F'],
    detail: '用于执行器测试和诊断。可对指定 IO 执行不同操作：shortTermAdjustment 允许临时改变输出值；freezeCurrentState 固定当前输出。' },
  { sid: 0x31, name: 'RoutineControl', cn: '例行程序控制', shortName: 'RC', unit: 'routine', reqSID: '31', resSID: '71',
    desc: '启动、停止 ECU 内部的例行程序或获取程序运行结果。用于擦除/编程内存、校验等。',
    subfuncs: [
      { val: '01', name: 'startRoutine', desc: '启动例行程序' },
      { val: '02', name: 'stopRoutine', desc: '停止例行程序' },
      { val: '03', name: 'requestRoutineResults', desc: '请求例行程序结果' }
    ],
    reqFmt: '31 + routineControlType + routineIdentifier (2 bytes) + [data]',
    resFmt: '71 + routineControlType + routineIdentifier + [data]',
    nrcs: ['12', '13', '22', '24', '31', '33', '72', '7E', '7F'],
    detail: 'routineIdentifier 为 2 字节值。标准定义了 FF00 擦除内存、FF01 编程内存、FF02 校验等常用例程。startRoutine 触发程序执行，stopRoutine 中止执行。' },
  { sid: 0x34, name: 'RequestDownload', cn: '请求下载', shortName: 'RD', unit: 'upload-download', reqSID: '34', resSID: '74',
    desc: '请求服务器准备接收下载数据。初始化内存写入操作。',
    reqFmt: '34 + dataFormatIdentifier + addressAndLengthFormat + memoryAddress + memorySize',
    resFmt: '74 + [maxNumberOfBlockLength] + [data]',
    nrcs: ['13', '22', '31', '33', '70', '72', '7F'],
    detail: '配合 TransferData (0x36) 和 RequestTransferExit (0x37) 完成数据下载。dataFormatIdentifier 低 4 位为压缩方法，高 4 位为加密方法。' },
  { sid: 0x35, name: 'RequestUpload', cn: '请求上传', shortName: 'RU', unit: 'upload-download', reqSID: '35', resSID: '75',
    desc: '请求服务器准备传输数据。初始化内存读取操作。',
    reqFmt: '35 + dataFormatIdentifier + addressAndLengthFormat + memoryAddress + memorySize',
    resFmt: '75 + [maxNumberOfBlockLength]',
    nrcs: ['13', '22', '31', '33', '70', '72', '7F'],
    detail: '与 RequestDownload 对称，用于从 ECU 读取数据。配合 TransferData 和 RequestTransferExit 完成上传。' },
  { sid: 0x36, name: 'TransferData', cn: '传输数据', shortName: 'TD', unit: 'upload-download', reqSID: '36', resSID: '76',
    desc: '在上传/下载操作中传输数据块。包含块序列计数器以确保数据顺序。',
    reqFmt: '36 + blockSequenceCounter (1 byte) + [data]',
    resFmt: '76 + blockSequenceCounter + [data]',
    nrcs: ['13', '22', '31', '33', '70', '71', '72', '73', '7F'],
    detail: 'blockSequenceCounter 从 0x01 开始递增（不是 0x00）。重传相同序列号的数据包应被接受（防止 ACK 丢失）。NRC 0x73 表示序列号错误。' },
  { sid: 0x37, name: 'RequestTransferExit', cn: '请求传输退出', shortName: 'RTE', unit: 'upload-download', reqSID: '37', resSID: '77',
    desc: '请求结束上传/下载传输序列。',
    reqFmt: '37 + [data]',
    resFmt: '77 + [data]',
    nrcs: ['13', '22', '24', '31', '33', '71', '72', '7F'],
    detail: '传输结束时的清理操作。可携带额外数据（如校验和）。需要在 TransferData 序列之后调用。' },
  { sid: 0x38, name: 'RequestFileTransfer', cn: '请求文件传输', shortName: 'RFT', unit: 'upload-download', reqSID: '38', resSID: '78',
    desc: '请求在客户端和服务器之间传输文件。支持文件目录列表。',
    subfuncs: [
      { val: '01', name: 'addFile', desc: '添加文件到服务器' },
      { val: '02', name: 'deleteFile', desc: '从服务器删除文件' },
      { val: '03', name: 'replaceFile', desc: '替换服务器上的文件' },
      { val: '04', name: 'readFile', desc: '从服务器读取文件' },
      { val: '05', name: 'readDirectory', desc: '读取服务器文件目录' }
    ],
    reqFmt: '38 + subFunction + filePathAndName + [data]',
    resFmt: '78 + subFunction + [data]',
    nrcs: ['12', '13', '22', '24', '31', '33', '70', '71', '7E', '7F'],
    detail: 'ISO 14229-1:2020 新增的文件传输服务。支持文件系统级别的操作，如添加、删除、替换、读取文件和目录列表。' },
  { sid: 0x3D, name: 'WriteMemoryByAddress', cn: '通过地址写入内存', shortName: 'WMBA', unit: 'data-transmission', reqSID: '3D', resSID: '7D',
    desc: '按内存地址直接写入服务器内存。需要指定地址和长度格式。',
    reqFmt: '3D + addressAndLengthFormat + memoryAddress + dataRecord',
    resFmt: '7D + memoryAddress + dataRecord',
    nrcs: ['13', '22', '31', '33', '72', '7F'],
    detail: '与 0x34 RequestDownload + 0x36 TransferData 不同，WriteMemoryByAddress 是单次写入操作，不涉及多块传输。适合小量数据写入。' },
  { sid: 0x3E, name: 'TesterPresent', cn: '测试仪保持在线', shortName: 'TP', unit: 'diagnostic-communication', reqSID: '3E', resSID: '7E',
    desc: '向服务器（或多个服务器）指示客户端仍在连接中。延长非默认会话的超时时间。',
    subfuncs: [
      { val: '00', name: 'zeroSubFunction', desc: '零子功能（标准用法）' },
      { val: '80', name: 'zeroSubFunction (suppressResponse)', desc: '零子功能 — 抑制正响应' }
    ],
    reqFmt: '3E + zeroSubFunction (0x00 or 0x80)',
    resFmt: '7E + zeroSubFunction',
    nrcs: ['13', '7F'],
    detail: '在非默认会话中必须周期性地发送 TesterPresent 消息以保持会话活跃。默认建议发送间隔不超过 2-3 秒。suppressResponse 位 (bit7) 设置为 1 时服务器不发送正响应。' },
  { sid: 0x84, name: 'SecuredDataTransmission', cn: '安全数据传输', shortName: 'SDT', unit: 'security', reqSID: '84', resSID: 'C4',
    desc: '安全数据传输服务。通过加密和/或签名机制传输诊断消息。',
    reqFmt: '84 + securitySubLayer + [ciphertext/MAC]',
    resFmt: 'C4 + securitySubLayer + [ciphertext/MAC]',
    nrcs: ['13', '22', '33', '34', '38', '39', '3A', '7F'],
    detail: '在诊断消息上添加安全层保护，支持加密和消息认证码。内部包含完整的诊断请求/响应消息。' },
  { sid: 0x85, name: 'ControlDTCSetting', cn: '控制DTC设置', shortName: 'CDTCS', unit: 'diagnostic-communication', reqSID: '85', resSID: 'C5',
    desc: '控制服务器 DTC 状态位的更新。可禁用 DTC 设置以防止误报。',
    subfuncs: [
      { val: '01', name: 'on', desc: '开启 DTC 设置' },
      { val: '02', name: 'off', desc: '关闭 DTC 设置' }
    ],
    reqFmt: '85 + DTCSettingControlOption (1 byte) + [data]',
    resFmt: 'C5 + DTCSettingControlOption',
    nrcs: ['12', '13', '22', '31', '33', '7E', '7F'],
    detail: '常用于编程会话前关闭 DTC 设置，防止编程过程中产生虚假 DTC。编程完成后重新开启。' },
  { sid: 0x86, name: 'ResponseOnEvent', cn: '事件响应', shortName: 'ROE', unit: 'diagnostic-communication', reqSID: '86', resSID: 'C6',
    desc: '配置服务器在特定事件发生时自动发送响应消息。无需客户端轮询。',
    subfuncs: [
      { val: '00', name: 'stopResponseOnEvent', desc: '停止响应事件' },
      { val: '01', name: 'onDTCStatusChange', desc: 'DTC 状态改变时响应' },
      { val: '02', name: 'onTimerInterrupt', desc: '定时器中断时响应' },
      { val: '03', name: 'onChangeOfDataIdentifier', desc: 'DID 数据改变时响应' },
      { val: '04', name: 'onComparisonOfValues', desc: '数值比较时响应' },
      { val: '05', name: 'onChangeOfMaskedDataIdentifier', desc: '掩码 DID 数据改变时响应' },
      { val: '06-0F', name: 'reserved', desc: 'ISO 保留' },
      { val: '10-1F', name: 'vehicleManufacturerSpecific', desc: '制造商特定事件类型' }
    ],
    reqFmt: '86 + eventType + [eventData]',
    resFmt: 'C6 + eventType + [eventData]',
    nrcs: ['12', '13', '22', '24', '31', '33', '7E', '7F'],
    detail: '减少总线负载的机制。配置服务器在特定条件（如 DTC 变化、定时器）下主动发送响应，避免客户端重复轮询。' },
  { sid: 0x87, name: 'LinkControl', cn: '链路控制', shortName: 'LC', unit: 'diagnostic-communication', reqSID: '87', resSID: 'C7',
    desc: '控制通信链路的参数，如波特率切换。',
    subfuncs: [
      { val: '01', name: 'verifyBaudrateTransitionWithFixedBaudrate', desc: '验证固定波特率切换' },
      { val: '02', name: 'verifyBaudrateTransitionWithSpecificBaudrate', desc: '验证指定波特率切换' },
      { val: '03', name: 'transitionBaudrate', desc: '切换波特率' }
    ],
    reqFmt: '87 + linkControlType + [baudrateParams]',
    resFmt: 'C7 + linkControlType + [data]',
    nrcs: ['12', '13', '22', '31', '33', '7E', '7F'],
    detail: '常用于 CAN 诊断中的波特率切换。典型的应用场景是在编程会话中切换到更高的波特率以加快数据传输。' }
];

const NRCS = [
  { val: '00', name: 'positiveResponse', mne: 'PR', category: 'reserved', desc: '正响应参数值，仅用于服务器内部实现，不得用于负响应消息。' },
  { val: '01-0F', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留范围。' },
  { val: '10', name: 'generalReject', mne: 'GR', category: 'communication', desc: '一般拒绝。请求的操作已被服务器拒绝。仅在没有其他适用的 NRC 时使用。' },
  { val: '11', name: 'serviceNotSupported', mne: 'SNS', category: 'communication', desc: '服务不支持。服务器不支持请求的服务标识符（未知、不支持或为响应 SID）。' },
  { val: '12', name: 'subFunctionNotSupported', mne: 'SFNS', category: 'communication', desc: '子功能不支持。服务器支持该服务但不支持请求的子功能参数。' },
  { val: '13', name: 'incorrectMessageLengthOrInvalidFormat', mne: 'IMLOIF', category: 'communication', desc: '消息长度不正确或格式无效。请求消息长度与要求不符或参数格式错误。' },
  { val: '14', name: 'responseTooLong', mne: 'RTL', category: 'communication', desc: '响应太长。生成的响应超过底层网络层允许的最大字节数。' },
  { val: '15-20', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留范围。' },
  { val: '21', name: 'busyRepeatRequest', mne: 'BRR', category: 'communication', desc: '忙—重复请求。服务器暂时太忙无法执行请求的操作。客户端应延迟重试。' },
  { val: '22', name: 'conditionsNotCorrect', mne: 'CNC', category: 'communication', desc: '条件不正确。服务器的前提条件未满足，无法执行请求的操作。' },
  { val: '23', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留。' },
  { val: '24', name: 'requestSequenceError', mne: 'RSE', category: 'communication', desc: '请求序列错误。服务器期望不同的请求消息序列（例如 SecurityAccess 顺序错误）。' },
  { val: '25', name: 'noResponseFromSubnetComponent', mne: 'NRFSC', category: 'communication', desc: '子网组件无响应。服务器已收到请求，但必要的子网组件未在指定时间内响应。' },
  { val: '26', name: 'failurePreventsExecutionOfRequestedAction', mne: 'FPEORA', category: 'communication', desc: '故障阻止执行请求的操作。存在故障条件（DTC 状态位为 1）阻止执行。' },
  { val: '27-30', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留范围。' },
  { val: '31', name: 'requestOutOfRange', mne: 'ROOR', category: 'communication', desc: '请求超出范围。请求消息包含超出服务器权限范围的参数值，或访问的 DID/例程在当前会话中不受支持。' },
  { val: '32', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留。' },
  { val: '33', name: 'securityAccessDenied', mne: 'SAD', category: 'communication', desc: '安全访问被拒绝。服务器的安全策略未被满足（需要解锁）。' },
  { val: '34', name: 'authenticationRequired', mne: 'AR', category: 'communication', desc: '需要认证。客户端基于其认证状态的权限不足。' },
  { val: '35', name: 'invalidKey', mne: 'IK', category: 'communication', desc: '密钥无效。客户端发送的密钥与服务器内存中的密钥不匹配，安全访问计数器递增。' },
  { val: '36', name: 'exceedNumberOfAttempts', mne: 'ENOA', category: 'communication', desc: '超过尝试次数。客户端尝试安全访问的次数超过服务器安全策略允许的上限。' },
  { val: '37', name: 'requiredTimeDelayNotExpired', mne: 'RTDNE', category: 'communication', desc: '所需时间延迟未到期。客户端在上次安全访问尝试后未等待足够的时间。' },
  { val: '38', name: 'secureDataTransmissionRequired', mne: 'SDTR', category: 'communication', desc: '需要安全数据传输。请求的操作需要使用安全通信通道。' },
  { val: '39', name: 'secureDataTransmissionNotAllowed', mne: 'SDTNA', category: 'communication', desc: '不允许安全数据传输。消息使用 SecuredDataTransmission 接收，但请求的操作不允许通过该方式发送。' },
  { val: '3A', name: 'secureDataVerificationFailed', mne: 'SDVF', category: 'communication', desc: '安全数据验证失败。消息在安全子层验证失败（签名/加密错误、防重放计数器无效等）。' },
  { val: '3B-4F', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留范围。' },
  { val: '50', name: 'certificateVerificationFailed_InvalidTimePeriod', mne: 'CVFITP', category: 'communication', desc: '证书验证失败—无效的时间段。服务器日期时间与证书有效期不匹配。' },
  { val: '51', name: 'certificateVerificationFailed_InvalidSignature', mne: 'CVFIS', category: 'communication', desc: '证书验证失败—无效签名。无法验证证书签名。' },
  { val: '52', name: 'certificateVerificationFailed_InvalidChainOfTrust', mne: 'CVFICOT', category: 'communication', desc: '证书验证失败—无效信任链。证书无法与存储的 CA 信息关联。' },
  { val: '53', name: 'certificateVerificationFailed_InvalidType', mne: 'CVFIT', category: 'communication', desc: '证书验证失败—无效类型。证书与当前请求用例不匹配。' },
  { val: '54', name: 'certificateVerificationFailed_InvalidFormat', mne: 'CVFIF', category: 'communication', desc: '证书验证失败—无效格式。证书格式不符合要求。' },
  { val: '55', name: 'certificateVerificationFailed_InvalidContent', mne: 'CVFIC', category: 'communication', desc: '证书验证失败—无效内容。证书内容验证不通过。' },
  { val: '56', name: 'certificateVerificationFailed_InvalidScope', mne: 'CVFIS', category: 'communication', desc: '证书验证失败—无效范围。证书范围与服务器内容不匹配。' },
  { val: '57', name: 'certificateVerificationFailed_InvalidCertificate_Revoked', mne: 'CVFICR', category: 'communication', desc: '证书验证失败—证书已吊销。服务器已吊销该证书的访问权限。' },
  { val: '58', name: 'ownershipVerificationFailed', mne: 'OVF', category: 'communication', desc: '所有权验证失败。提供的所有权信息与挑战不匹配或无法用私钥验证。' },
  { val: '59', name: 'challengeCalculationFailed', mne: 'CCF', category: 'communication', desc: '挑战计算失败。服务器端无法计算挑战值。' },
  { val: '5A', name: 'settingAccessRightsFailed', mne: 'SARF', category: 'communication', desc: '设置访问权限失败。服务器无法设置访问权限。' },
  { val: '5B', name: 'sessionKeyCreationDerivationFailed', mne: 'SKCDF', category: 'communication', desc: '会话密钥创建/派生失败。服务器无法创建或派生会话密钥。' },
  { val: '5C', name: 'configurationDataUsageFailed', mne: 'CDUF', category: 'communication', desc: '配置数据使用失败。服务器无法处理提供的配置数据。' },
  { val: '5D', name: 'deAuthenticationFailed', mne: 'DAF', category: 'communication', desc: '解除认证失败。解除认证不成功，服务器可能仍处于未保护状态。' },
  { val: '5E-6F', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留范围。' },
  { val: '70', name: 'uploadDownloadNotAccepted', mne: 'UDNA', category: 'communication', desc: '上传/下载不接受。由于某种故障条件无法完成上传/下载操作。' },
  { val: '71', name: 'transferDataSuspended', mne: 'TDS', category: 'communication', desc: '数据传输暂停。数据传输因故障而暂停，活跃的传输序列应中止。' },
  { val: '72', name: 'generalProgrammingFailure', mne: 'GPF', category: 'communication', desc: '一般编程失败。擦除或编程永久存储器时检测到错误。' },
  { val: '73', name: 'wrongBlockSequenceCounter', mne: 'WBSC', category: 'communication', desc: '错误的块序列计数器。TransferData 的 blockSequenceCounter 值序列错误。' },
  { val: '74-77', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留范围。' },
  { val: '78', name: 'requestCorrectlyReceived_ResponsePending', mne: 'RCRRP', category: 'communication', desc: '请求已正确接收—响应待发。请求有效但操作尚未完成，服务器稍后会发送最终响应。用于延长操作。' },
  { val: '79-7D', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留范围。' },
  { val: '7E', name: 'subFunctionNotSupportedInActiveSession', mne: 'SFNSIAS', category: 'communication', desc: '当前会话中不支持该子功能。子功能已知在其他会话中支持，但当前会话不支持。' },
  { val: '7F', name: 'serviceNotSupportedInActiveSession', mne: 'SNSIAS', category: 'communication', desc: '当前会话中不支持该服务。服务已知在其他会话中支持，但当前会话不支持。' },
  { val: '80', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留。' },
  { val: '81', name: 'rpmTooHigh', mne: 'RPMTH', category: 'condition', desc: '转速过高。当前发动机转速超过预设的最大阈值。' },
  { val: '82', name: 'rpmTooLow', mne: 'RPMTL', category: 'condition', desc: '转速过低。当前发动机转速低于预设的最小阈值。' },
  { val: '83', name: 'engineIsRunning', mne: 'EIR', category: 'condition', desc: '发动机正在运行。请求的执行器测试不能在发动机运行时进行。' },
  { val: '84', name: 'engineIsNotRunning', mne: 'EINR', category: 'condition', desc: '发动机未运行。执行器测试需要发动机运行。' },
  { val: '85', name: 'engineRunTimeTooLow', mne: 'ERTTL', category: 'condition', desc: '发动机运行时间过短。发动机运行时间低于预设限制。' },
  { val: '86', name: 'temperatureTooHigh', mne: 'TEMPTH', category: 'condition', desc: '温度过高。当前温度超过预设的最大阈值。' },
  { val: '87', name: 'temperatureTooLow', mne: 'TEMPTL', category: 'condition', desc: '温度过低。当前温度低于预设的最小阈值。' },
  { val: '88', name: 'vehicleSpeedTooHigh', mne: 'VSTH', category: 'condition', desc: '车速过高。当前车速超过预设的最大阈值。' },
  { val: '89', name: 'vehicleSpeedTooLow', mne: 'VSTL', category: 'condition', desc: '车速过低。当前车速低于预设的最小阈值。' },
  { val: '8A', name: 'throttlePedalTooHigh', mne: 'TPTH', category: 'condition', desc: '油门/踏板过高。当前油门/踏板位置超过预设的最大阈值。' },
  { val: '8B', name: 'throttlePedalTooLow', mne: 'TPTL', category: 'condition', desc: '油门/踏板过低。当前油门/踏板位置低于预设的最小阈值。' },
  { val: '8C', name: 'transmissionRangeNotInNeutral', mne: 'TRNIN', category: 'condition', desc: '变速箱不在空挡。变速箱档位不在空挡位置。' },
  { val: '8D', name: 'transmissionRangeNotInGear', mne: 'TRNIG', category: 'condition', desc: '变速箱不在档位。变速箱档位不在指定档位。' },
  { val: '8E', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留。' },
  { val: '8F', name: 'brakeSwitchNotClosed', mne: 'BSNC', category: 'condition', desc: '制动开关未闭合（制动踏板未踩下/未应用）。' },
  { val: '90', name: 'shifterLeverNotInPark', mne: 'SLNIP', category: 'condition', desc: '换挡杆不在驻车档。换挡杆必须在驻车位置。' },
  { val: '91', name: 'torqueConverterClutchLocked', mne: 'TCCL', category: 'condition', desc: '变矩器离合器锁定。变矩器离合器状态超出预设限制或已锁定。' },
  { val: '92', name: 'voltageTooHigh', mne: 'VTH', category: 'condition', desc: '电压过高。ECU 主引脚电压超过预设的最大阈值。' },
  { val: '93', name: 'voltageTooLow', mne: 'VTL', category: 'condition', desc: '电压过低。ECU 主引脚电压低于预设的最小阈值。' },
  { val: '94', name: 'resourceTemporarilyNotAvailable', mne: 'RTNA', category: 'condition', desc: '资源暂时不可用。必要的应用程序暂时无法提供服务。' },
  { val: '95-EF', name: 'reservedForSpecificConditionsNotCorrect', mne: 'RFSCNC', category: 'reserved', desc: '为特定条件不正确场景保留。' },
  { val: 'F0-FE', name: 'vehicleManufacturerSpecificConditionsNotCorrect', mne: 'VMSCNC', category: 'condition', desc: '制造商特定条件不正确场景。' },
  { val: 'FF', name: 'ISO_SAE_Reserved', mne: 'ISOSAERESRVD', category: 'reserved', desc: 'ISO/SAE 保留。' }
];

const SESSIONS = [
  { val: '01', name: 'defaultSession', desc: '默认诊断会话。服务器上电后的初始会话。所有服务器必须支持。\n支持基本诊断、读/写 DID、清除 DTC、例程等。访问受保护的数据/内存/例程需要非默认会话+安全解锁。',
    transitions: [
      { to: '01', desc: '通过 DiagnosticSessionControl(01) 保持会话' },
      { to: '02', desc: '通过 DiagnosticSessionControl(02) 进入编程会话' },
      { to: '03', desc: '通过 DiagnosticSessionControl(03) 进入扩展诊断会话' }
    ],
    services: ['10', '11', '14', '19', '22', '24', '29', '2C', '2E', '31', '3D', '3E', '86'] },
  { val: '02', name: 'programmingSession', desc: '编程诊断会话。用于 ECU 软件刷写/编程。\n特点: 支持上传下载相关服务。通常需要安全访问。离开时需 ECUReset 或切换到其他会话。',
    transitions: [
      { to: '01', desc: '通过 DiagnosticSessionControl(01) 或 ECUReset + hardReset 返回' },
      { to: '03', desc: '通过 DiagnosticSessionControl(03) 进入扩展诊断会话' }
    ],
    services: ['10', '11', '14', '19', '22', '23', '24', '27', '28', '29', '2A', '2C', '2E', '2F', '31', '34', '35', '36', '37', '38', '3D', '3E', '85', '86', '87'] },
  { val: '03', name: 'extendedDiagnosticSession', desc: '扩展诊断会话。提供更多诊断功能，通常用于标定、测试和复杂诊断。\n特点: 支持内存访问、IO 控制、例程等高级功能。',
    transitions: [
      { to: '01', desc: '通过 DiagnosticSessionControl(01) 或 ECUReset 返回默认会话' },
      { to: '02', desc: '通过 DiagnosticSessionControl(02) 进入编程会话' }
    ],
    services: ['10', '11', '14', '19', '22', '23', '24', '27', '28', '29', '2A', '2C', '2E', '2F', '31', '3D', '3E', '85', '86', '87'] },
  { val: '04', name: 'safetySystemDiagnosticSession', desc: '安全系统诊断会话(ISO 14229-1:2020 新增)。用于安全系统相关的功能(如气囊展开)。\n特点: 类似扩展诊断会话，支持安全系统标定和测试。通常需要安全访问。',
    transitions: [
      { to: '01', desc: '通过 DiagnosticSessionControl(01) 返回默认会话' },
      { to: '02', desc: '通过 DiagnosticSessionControl(02) 进入编程会话' },
      { to: '03', desc: '通过 DiagnosticSessionControl(03) 进入扩展诊断会话' }
    ],
    services: ['10', '11', '14', '19', '22', '23', '24', '27', '28', '29', '2A', '2C', '2E', '2F', '31', '3D', '3E', '85', '86', '87'] }
];


// ======================== RENDER ========================
function renderServices(filterUnit = 'all', search = '') {
  const list = document.getElementById('service-list');
  const searchLower = search.toLowerCase();
  let html = '';
  let count = 0;
  for (const s of SERVICES) {
    if (filterUnit !== 'all' && s.unit !== filterUnit) continue;
    if (searchLower) {
      const sidHex = '0x' + s.sid.toString(16).toUpperCase().padStart(2,'0');
      const match = sidHex.includes(searchLower) || s.name.toLowerCase().includes(searchLower) ||
                    s.shortName.toLowerCase().includes(searchLower) || s.desc.toLowerCase().includes(searchLower);
      if (!match) continue;
    }
    count++;
    const funcUnitName = FUNCTIONAL_UNITS[s.unit]?.name || s.unit;
    const unitColor = UNIT_COLORS[s.unit] || '#94a3b8';
    html += `<div class="service-card fade-in" onclick="showServiceDetail(${s.sid})">
      <div class="header">
        <span class="sid">0x${s.sid.toString(16).toUpperCase().padStart(2,'0')}</span>
        <span class="name">${s.cn || s.name} (${s.name}, ${s.shortName})</span>
        <span class="func-unit" style="border-left:3px solid ${unitColor}"><span class="unit-dot" style="background:${unitColor};display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:4px;vertical-align:middle"></span>${funcUnitName}</span>
      </div>
      <div class="desc">${s.desc}</div>
      <div class="nrc-list">请求 SID: <strong>0x${s.reqSID}</strong> | 响应 SID: <strong>0x${s.resSID}</strong>`;
    if (s.nrcs && s.nrcs.length) {
      html += `<br>NRCs: ${s.nrcs.map(n => `<span class="nrc-tag">0x${n}</span>`).join(' ')}`;
    }
    html += `</div></div>`;
  }
  list.innerHTML = html || '<p style="color:var(--text2);text-align:center;padding:2rem">没有匹配的服务。</p>';
  document.getElementById('stat-total').textContent = count;
  document.getElementById('stat-funcunits').textContent = new Set(SERVICES.filter(s => !search || s.name.toLowerCase().includes(searchLower)).map(s => s.unit)).size;
  const sids = SERVICES.filter(s => !search || s.name.toLowerCase().includes(searchLower));
  document.getElementById('stat-sids').textContent = sids.length;
}

function filterServices() {
  const unit = document.getElementById('service-filter').value;
  const search = document.getElementById('service-search').value;
  renderServices(unit, search);
}

function showServiceDetail(sid) {
  const s = SERVICES.find(x => x.sid === sid);
  if (!s) return;
  const funcUnitName = FUNCTIONAL_UNITS[s.unit]?.name || s.unit;

  // Session availability from simulator's SESSION_RULES (inline mapping)
  const sesAvail = { '01': { name: 'Default', icon: '🟢' }, '02': { name: 'Programming', icon: '🔴' }, '03': { name: 'Extended', icon: '🟡' } };
  const svcSid = parseInt(s.reqSID, 16);
  let availHtml = '<div class="section"><h3>会话可用性</h3><div style="display:flex;gap:12px;flex-wrap:wrap">';
  // Use SESSION_RULES if available (injected via learning tool data), else derive from SESSIONS
  for (const [sesKey, sesInfo] of Object.entries(sesAvail)) {
    const sesObj = SESSIONS.find(x => x.val === sesKey);
    const isAvail = sesObj && sesObj.services.includes(s.reqSID);
    availHtml += `<span style="padding:4px 10px;border-radius:6px;background:var(--code-bg);font-size:.8rem">
      ${isAvail ? '✅' : '❌'} ${sesInfo.name}</span>`;
  }
  availHtml += '</div></div>';

  let subfuncHtml = '';
  if (s.subfuncs && s.subfuncs.length) {
    subfuncHtml = '<div class="section"><h3>子功能参数</h3><table><tr><th>值</th><th>名称</th><th>描述</th></tr>';
    for (const sf of s.subfuncs) {
      const displayVal = sf.val.includes('-') ? sf.val.split('-')[0] + '..' + sf.val.split('-')[1] : sf.val;
      subfuncHtml += `<tr><td><code>0x${displayVal}</code></td><td>${sf.name}</td><td>${sf.desc}</td></tr>`;
    }
    subfuncHtml += '</table></div>';
  }

  document.getElementById('modal-content').innerHTML = `
    <h2><span class="sid-badge">0x${s.sid.toString(16).toUpperCase().padStart(2,'0')}</span> ${s.cn || s.name} (${s.name}, ${s.shortName})</h2>
    <p style="color:var(--text2);margin-bottom:1rem">${funcUnitName} | 请求 <strong>0x${s.reqSID}</strong> → 正响应 <strong>0x${s.resSID}</strong> | 负响应 <strong>0x7F + 0x${s.reqSID} + NRC</strong></p>
    ${availHtml}
    <div class="section"><h3>描述</h3><div class="content">${s.detail || s.desc}</div></div>
    ${subfuncHtml}
    <div class="section"><h3>消息格式</h3>
      <table>
        <tr><th>方向</th><th>格式</th></tr>
        <tr><td>请求</td><td><code>${s.reqFmt}</code></td></tr>
        <tr><td>正响应</td><td><code>${s.resFmt}</code></td></tr>
        <tr><td>负响应</td><td><code>0x7F + 0x${s.reqSID} + NRC</code></td></tr>
      </table>
    </div>
    <div class="section"><h3>支持的 NRC</h3>
      <table><tr><th>NRC</th><th>名称</th><th>描述</th></tr>
      ${s.nrcs.map(n => {
        const nrc = NRCS.find(x => x.val === n);
        if (nrc) return `<tr><td><code>0x${n}</code></td><td>${nrc.name}</td><td>${nrc.desc}</td></tr>`;
        return `<tr><td><code>0x${n}</code></td><td>未知</td><td>-</td></tr>`;
      }).join('')}
      </table>
    </div>`;

  document.getElementById('detail-modal').classList.add('show');
}

function closeModal() {
  document.getElementById('detail-modal').classList.remove('show');
}
document.getElementById('detail-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// NRC
function nrcSearchMatch(n, searchLower) {
  if (n.val.toLowerCase().includes(searchLower) ||
      n.name.toLowerCase().includes(searchLower) ||
      n.mne.toLowerCase().includes(searchLower) ||
      n.desc.toLowerCase().includes(searchLower)) return true;
  // Range matching: if searching "11", match range "01-0F"? No, too broad.
  // But if searching "0F", check if it falls within a range like "01-0F"
  if (/^[0-9a-f]{1,2}$/i.test(searchLower)) {
    const searchVal = parseInt(searchLower, 16);
    if (n.val.includes('-')) {
      const [lo, hi] = n.val.split('-').map(s => parseInt(s, 16));
      if (searchVal >= lo && searchVal <= hi) return true;
    }
  }
  return false;
}

function renderNRCs(filterCategory = 'all', search = '') {
  const list = document.getElementById('nrc-list');
  const searchLower = search.toLowerCase().replace('0x','');
  let html = '';
  for (const n of NRCS) {
    if (filterCategory !== 'all' && n.category !== filterCategory) continue;
    if (searchLower && !nrcSearchMatch(n, searchLower)) continue;
    const catMap = { 'communication': '通信相关', 'condition': '条件错误', 'reserved': '保留' };
    const displayVal = n.val.includes('-') ? n.val.split('-')[0] + '…' + n.val.split('-')[1] : n.val;
    html += `<div class="nrc-card fade-in">
      <div class="nrc-code">0x${displayVal}</div>
      <div style="flex:1">
        <div><span class="nrc-name">${n.name}</span> <span class="nrc-mnemonic">${n.mne}</span>
          <span class="nrc-cat">${catMap[n.category] || n.category}</span></div>
        <div class="nrc-desc">${n.desc}</div>
      </div>
    </div>`;
  }
  list.innerHTML = html || '<p style="color:var(--text2);text-align:center;padding:2rem">没有匹配的 NRC。</p>';
}

function filterNRCs() {
  renderNRCs(document.getElementById('nrc-filter').value, document.getElementById('nrc-search').value);
}

// Hex Map - helper to check if a hex value falls within an NRC range like "01-0F"
function hexInRange(hex, rangeStr) {
  if (!rangeStr.includes('-')) return rangeStr === hex;
  const [lo, hi] = rangeStr.split('-').map(s => parseInt(s, 16));
  const val = parseInt(hex, 16);
  return val >= lo && val <= hi;
}

function renderHexMap(search = '') {
  const container = document.getElementById('hex-map');
  const searchLower = search.replace('0x','').toLowerCase().trim();
  let html = '<div class="hex-grid">';
  for (let i = 0; i <= 0xFF; i++) {
    const hex = i.toString(16).toUpperCase().padStart(2, '0');
    const sid = SERVICES.find(s => s.sid === i);
    const nrc = NRCS.find(n => hexInRange(hex, n.val));
    const session = SESSIONS.find(s => s.val === hex);
    let cls = 'reserved', label = hex;
    if (sid) { cls = 'sid'; label = sid.shortName; }
    else if (nrc && nrc.category !== 'reserved') { cls = 'nrc'; label = nrc.mne; }
    else if (session) { cls = 'session'; label = session.name.substring(0,8); }

    let match = true;
    if (searchLower) {
      match = hex.toLowerCase().includes(searchLower) ||
              (sid && (sid.name.toLowerCase().includes(searchLower) || sid.shortName.toLowerCase().includes(searchLower))) ||
              (nrc && (nrc.name.toLowerCase().includes(searchLower) || nrc.mne.toLowerCase().includes(searchLower)));
    }
    if (!match) { html += `<div class="hex-cell" style="opacity:.15">`; }
    else if (sid) {
      html += `<div class="hex-cell ${cls}" onclick="showServiceDetail(${i})" title="0x${hex}: ${sid.name}">`;
    } else {
      html += `<div class="hex-cell ${cls}" title="0x${hex}">`;
    }
    html += `<span class="val">${hex}</span><span class="label">${label}</span></div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

function filterHexMap() {
  renderHexMap(document.getElementById('hex-search').value);
}

// Sessions - with exclusive service highlighting
function getServiceExclusivity(sid, sessionVal) {
  // Returns: 'common' (all 3), 'shared-ext' (this + extended), 'shared-prog' (this + programming),
  //          'excl-prog', 'excl-ext', 'excl-default'
  const allSessions = SESSIONS.map(s => s.val);
  const otherSessions = allSessions.filter(v => v !== sessionVal);
  const inOthers = otherSessions.filter(v => SESSIONS.find(s => s.val === v).services.includes(sid));
  if (inOthers.length === 2) return 'common';
  if (inOthers.length === 0) {
    // Exclusive to this session
    const map = { '01': 'excl-default', '02': 'excl-prog', '03': 'excl-ext', '04': 'excl-safety' };
    return map[sessionVal] || 'common';
  }
  const otherVal = inOthers[0];
  if (otherVal === '03') return 'shared-ext';
  if (otherVal === '02') return 'shared-prog';
  if (otherVal === '04') return 'shared-safety';
  return 'common';
}

function renderSessions() {
  const container = document.getElementById('session-content');

  // Session color scheme
  const sesColors = {
    '01': { name: 'Default', border: '#6366f1', bg: '#f5f3ff', darkBg: '#2e1065' },
    '02': { name: 'Programming', border: '#dc2626', bg: '#fef2f2', darkBg: '#7f1d1d' },
    '03': { name: 'Extended', border: '#2563eb', bg: '#f0f9ff', darkBg: '#1e3a5f' },
    '04': { name: 'SafetySystem', border: '#059669', bg: '#f0fdf4', darkBg: '#14532d' },
  };

  // Service count stats
  let html = '<div class="stats-row">';
  for (const s of SESSIONS) {
    const exclCount = s.services.filter(sid => getServiceExclusivity(sid, s.val) === ('excl-' + { '01':'default','02':'prog','03':'ext','04':'safety' }[s.val])).length;
    html += `<div class="stat-card">
      <div class="num" style="font-size:1rem">${s.services.length}</div>
      <div class="label">${s.name} <span style="color:var(--accent);font-size:.7rem">(${exclCount} 专属)</span></div>
    </div>`;
  }
  html += '</div>';

  // Exclusivity legend
  html += `<div class="legend-row">
    <span><span class="dot" style="background:#94a3b8"></span> 通用</span>
    <span><span class="dot" style="background:#f59e0b"></span> 共享</span>
    <span><span class="dot" style="background:#dc2626"></span> 🔒 编程专属</span>
    <span><span class="dot" style="background:#2563eb"></span> 🔒 扩展专属</span>
    <span><span class="dot" style="background:#059669"></span> 🔒 安全系统专属</span>
  </div>`;

  // Functional unit legend
  html += `<div class="legend-row" style="font-size:.7rem;color:var(--text2);margin-top:-.5rem;margin-bottom:1.2rem">
    <span style="font-weight:500;color:var(--text)">功能单元:</span>
    ${Object.entries(UNIT_COLORS).map(([key, color]) =>
      `<span><span class="unit-dot" style="background:${color}"></span>${FUNCTIONAL_UNITS[key].name}</span>`
    ).join('')}
  </div>`;

  for (const s of SESSIONS) {
    const col = sesColors[s.val];
    const exclMap = { '01': 'excl-default', '02': 'excl-prog', '03': 'excl-ext', '04': 'excl-safety' };

    html += `<div class="service-card fade-in" style="cursor:default;border-left:4px solid ${col.border}">
      <div class="header">
        <span class="sid" style="background:${col.border}">0x${s.val}</span>
        <span class="name">${s.name}</span>
      </div>
      <div class="desc">${s.desc}</div>
      <div style="margin-top:8px">
        <strong>会话转换:</strong>
        <ul style="margin:4px 0 0 1.2rem;font-size:.85rem">
          ${s.transitions.map(t => {
            const target = SESSIONS.find(x => x.val === t.to);
            const tc = sesColors[t.to];
            return `<li>到 <strong style="color:${tc.border}">${target?.name || '0x'+t.to}</strong>: ${t.desc}</li>`;
          }).join('')}
        </ul>
      </div>
      <div style="margin-top:10px">
        <strong>支持的主要服务 <span style="font-weight:400;color:var(--text2);font-size:.8rem">(共 ${s.services.length} 个)</span>:</strong>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">
          ${s.services.map(sid => {
            const svc = SERVICES.find(x => x.reqSID === sid);
            const exclusivity = getServiceExclusivity(sid, s.val);
            // Build tooltip text
            let tip = '';
            if (exclusivity === 'common') tip = '所有会话通用';
            else if (exclusivity.startsWith('excl')) tip = '⚠️ 仅此会话可用';
            else if (exclusivity === 'shared-prog') tip = '与 Programming 会话共享';
            else if (exclusivity === 'shared-ext') tip = '与 Extended 会话共享';
            else if (exclusivity === 'shared-safety') tip = '与 SafetySystem 会话共享';
            // Exclusive icon
            const isExcl = exclusivity.startsWith('excl');
            const unitColor = UNIT_COLORS[svc?.unit] || '#94a3b8';
            return svc
              ? `<span class="svc-tag ${exclusivity}" onclick="showServiceDetail(${svc.sid})" title="${tip}">${isExcl ? '🔒 ' : ''}<span class="unit-dot" style="background:${unitColor};display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:3px;vertical-align:middle"></span>0x${sid} ${svc.shortName}</span>`
              : `<span class="svc-tag common">0x${sid}</span>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  }

  // Enhanced session transition diagram
  html += `<div class="service-card fade-in" style="cursor:default;margin-top:1.5rem">
    <div class="header"><span class="name">🔄 会话转换关系图</span></div>
    <div style="display:flex;gap:1rem;justify-content:center;align-items:center;padding:1.5rem 1rem;flex-wrap:wrap">
      ${['01','02','03','04'].map((val, i) => {
        const col = sesColors[val];
        const s = SESSIONS.find(x => x.val === val);
        const arrow = i < 3 ? `<div style="display:flex;flex-direction:column;align-items:center;font-size:1.2rem;color:${sesColors['01'].border};padding:0 8px">
          <span>⇄</span><span style="font-size:.6rem;color:var(--text3)">DSC</span></div>` : '';
        return `<div style="text-align:center;padding:.8rem 1.2rem;border:2px solid ${col.border};border-radius:12px;min-width:110px;background:var(--card)">
          <div style="font-size:.75rem;color:${col.border};font-weight:700">0x${val}</div>
          <div style="font-weight:600;margin-top:4px;font-size:.9rem">${s.name}</div>
          <div style="font-size:.65rem;color:var(--text3);margin-top:4px">${s.services.length} 个服务</div>
        </div>${arrow}`;
      }).join('')}
    </div>
    <div style="text-align:center;font-size:.82rem;color:var(--text2);line-height:1.6">
      <strong>🔵 默认会话</strong> → ECUReset、会话超时后自动返回<br>
      <strong>🔴 编程会话</strong> → 专用于 ECU 刷写，包含上传/下载服务<br>
      <strong>🔷 扩展会话</strong> → 高级诊断功能，内存访问、IO 控制等<br>
      <strong>🟢 安全系统会话</strong> → 安全系统相关诊断（ISO 14229-1:2020 新增）<br>
       使用 <strong>DiagnosticSessionControl(0x10)</strong> 在会话间切换
    </div>
  </div>`;

  container.innerHTML = html;
}

// Message Builder
let _lastBuilderSid = null;
let _builderMode = 'uds'; // 'uds' | 'can' | 'lin'

function initBuilder() {
  const select = document.getElementById('builder-sid');
  for (const s of SERVICES) {
    const opt = document.createElement('option');
    opt.value = s.sid;
    opt.textContent = `0x${s.reqSID} - ${s.cn || s.name} (${s.name}, ${s.shortName})`;
    select.appendChild(opt);
  }
  // Protocol mode switching
  document.querySelectorAll('.protocol-switcher-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.protocol-switcher-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      _builderMode = this.dataset.mode;
      // Toggle field visibility
      document.getElementById('uds-fields').style.display = _builderMode === 'uds' ? 'block' : 'none';
      const canFields = document.getElementById('can-fields');
      const linFields = document.getElementById('lin-fields');
      canFields.style.display = _builderMode === 'can' ? 'block' : 'none';
      canFields.classList.toggle('active', _builderMode === 'can');
      linFields.style.display = _builderMode === 'lin' ? 'block' : 'none';
      linFields.classList.toggle('active', _builderMode === 'lin');
      updateBuilderByMode();
    });
  });
  // LIN role change → update NAD default
  document.querySelectorAll('input[name="lin-role"]').forEach(rb => {
    rb.addEventListener('change', function() {
      if (this.value === 'master') {
        if (!document.getElementById('lin-nad').value || document.getElementById('lin-nad').value === '02') {
          document.getElementById('lin-nad').value = '01';
        }
      } else {
        if (!document.getElementById('lin-nad').value || document.getElementById('lin-nad').value === '01') {
          document.getElementById('lin-nad').value = '02';
        }
      }
      updateBuilderByMode();
    });
  });
  updateBuilder();
}

function updateBuilder() {
  if (_builderMode !== 'uds') return;
  const s = SERVICES.find(x => x.sid === parseInt(document.getElementById('builder-sid').value));
  if (!s) return;

  // Build request bytes using shared helper
  const reqBytes = getUDSRequestBytes('uds-data');
  const sfVal = document.getElementById('builder-subfunc').value;

  // Request display
  const reqDisplay = document.getElementById('builder-request');
  reqDisplay.innerHTML = reqBytes.map((b, i) => {
    let cls = 'byte';
    if (i === 0) cls += ' sid-byte';
    else if (i === 1 && sfVal && sfVal !== 'none') cls += ' sf-byte';
    else cls += ' data-byte';
    return `<span class="${cls}">${b.toString(16).toUpperCase().padStart(2,'0')}</span>`;
  }).join(' ');

  // Response display
  const resSID = parseInt(s.reqSID, 16) + 0x40;
  let resBytes = [resSID];
  if (sfVal && sfVal !== 'none') resBytes.push(parseInt(sfVal, 16));

  document.querySelector('.msg-builder-container .byte-display:last-of-type').innerHTML =
    `正响应: ${resBytes.map(b => `<span class="byte sid-byte">${b.toString(16).toUpperCase().padStart(2,'0')}</span>`).join(' ')}<br>` +
    `负响应: <span class="byte" style="border-color:var(--danger);background:#fee2e2">7F</span> <span class="byte" style="border-color:var(--danger);background:#fee2e2">${s.reqSID}</span> <span class="byte" style="border-color:var(--danger);background:#fee2e2">NRC</span>`;
}

function syncSubfunctionRow() {
  const sid = parseInt(document.getElementById('builder-sid').value);
  const s = SERVICES.find(x => x.sid === sid);
  if (!s) return;
  const sfRow = document.getElementById('builder-subfunc-row');
  const sfSelect = document.getElementById('builder-subfunc');
  const hasSubfunc = s.subfuncs && s.subfuncs.length;
  sfRow.style.display = hasSubfunc ? 'flex' : 'none';
  if (hasSubfunc && sid !== _lastBuilderSid) {
    const prevVal = sfSelect.value;
    sfSelect.innerHTML = '<option value="none">无子功能</option>';
    for (const sf of s.subfuncs) {
      if (!sf.val.includes('-')) {
        const opt = document.createElement('option');
        opt.value = sf.val;
        opt.textContent = `0x${sf.val} - ${sf.name}`;
        sfSelect.appendChild(opt);
      }
    }
    if ([...sfSelect.options].some(o => o.value === prevVal && prevVal !== 'none')) {
      sfSelect.value = prevVal;
    }
  }
  _lastBuilderSid = hasSubfunc ? sid : null;
}

function getUDSRequestBytes(extraDataId) {
  const sid = parseInt(document.getElementById('builder-sid').value);
  const s = SERVICES.find(x => x.sid === sid);
  if (!s) return [];
  const bytes = [parseInt(s.reqSID, 16)];
  const sfVal = document.getElementById('builder-subfunc').value;
  if (sfVal && sfVal !== 'none') bytes.push(parseInt(sfVal, 16));
  const extraEl = document.getElementById(extraDataId);
  if (extraEl) {
    const dataStr = extraEl.value.trim();
    if (dataStr) {
      for (const p of dataStr.split(/[\s,]+/)) {
        if (/^[0-9a-fA-F]{2}$/.test(p)) bytes.push(parseInt(p, 16));
      }
    }
  }
  return bytes;
}

function updateBuilderByMode() {
  syncSubfunctionRow();
  switch (_builderMode) {
    case 'uds': updateBuilder(); break;
    case 'can': updateBuilderCAN(); break;
    case 'lin': updateBuilderLIN(); break;
  }
}

function updateBuilderCAN() {
  const preview = document.getElementById('can-builder-preview');
  const idStr = document.getElementById('can-builder-id').value.trim();
  const idFormat = document.querySelector('input[name="can-id-format"]:checked').value;
  const frameType = document.querySelector('input[name="can-frame-type"]:checked').value;

  // Build UDS request bytes from shared SID + extra CAN data
  const reqBytes = getUDSRequestBytes('can-data');
  const dataBytes = reqBytes.length > 8 ? reqBytes.slice(0, 8) : reqBytes;

  const dlc = dataBytes.length;
  const rtr = frameType === 'remote' ? 1 : 0;

  if (!idStr) {
    preview.innerHTML = '<span style="color:var(--text2)">请输入 CAN ID</span>';
    return;
  }

  const idVal = parseInt(idStr, 16);
  if (isNaN(idVal) || idVal < 0) {
    preview.innerHTML = '<span style="color:var(--danger)">无效的 CAN ID</span>';
    return;
  }

  if (idFormat === '11' && idVal > 0x7FF) {
    preview.innerHTML = '<span style="color:var(--danger)">11-bit ID 范围: 0x000-0x7FF</span>';
    return;
  }
  if (idFormat === '29' && idVal > 0x1FFFFFFF) {
    preview.innerHTML = '<span style="color:var(--danger)">29-bit ID 范围: 0x00000000-0x1FFFFFFF</span>';
    return;
  }

  let html = '<div class="can-frame-preview">';

  // SOF
  html += `<div class="can-field sof"><span class="field-label">SOF</span><span class="field-value">0</span></div>`;

  // Arbitration field
  if (idFormat === '11') {
    const idBin = idVal.toString(2).padStart(11, '0');
    html += `<div class="can-field arb"><span class="field-label">ARB(11+RTR)</span><span class="field-value">${idBin} ${rtr}</span></div>`;
  } else {
    const idBin = idVal.toString(2).padStart(29, '0');
    html += `<div class="can-field arb"><span class="field-label">ARB(29+SRR+IDE+RTR)</span><span class="field-value">${idBin.slice(0,8)}...${rtr}</span></div>`;
  }

  // Control field (per ISO 11898-1:2015 §10.4.2.4)
  let ctrlHtml = '';
  if (idFormat === '11') {
    ctrlHtml = `IDE=0 FDF=0 DLC=${dlc}`;
  } else {
    ctrlHtml = `FDF=0 r0=0 DLC=${dlc}`;
  }
  html += `<div class="can-field ctrl"><span class="field-label">CTRL</span><span class="field-value">${ctrlHtml}</span></div>`;

  // Data field
  if (dataBytes.length > 0) {
    const dataHex = dataBytes.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
    html += `<div class="can-field data-field"><span class="field-label">DATA(${dlc}B)</span><span class="field-value">${dataHex}</span></div>`;
  } else if (frameType === 'remote') {
    html += `<div class="can-field data-field" style="opacity:.6"><span class="field-label">DATA</span><span class="field-value">(RTR)</span></div>`;
  } else {
    html += `<div class="can-field data-field" style="opacity:.6"><span class="field-label">DATA</span><span class="field-value">(空)</span></div>`;
  }

  // CRC placeholder
  html += `<div class="can-field crc-field"><span class="field-label">CRC</span><span class="field-value">15-bit</span></div>`;

  // ACK
  html += `<div class="can-field ack-field"><span class="field-label">ACK</span><span class="field-value">1+1</span></div>`;

  // EOF
  html += `<div class="can-field eof"><span class="field-label">EOF</span><span class="field-value">7bit</span></div>`;

  html += '</div>';

  // Info line
  const idStrHex = '0x' + idVal.toString(16).toUpperCase();
  const totalBits = idFormat === '11' ? (1 + 12 + 6 + dlc*8 + 16 + 2 + 7) : (1 + 32 + 6 + dlc*8 + 16 + 2 + 7);
  html += `<div class="can-frame-info">`;
  html += `CAN ID: ${idStrHex} (${idFormat}-bit) | `;
  html += `帧类型: ${frameType === 'data' ? '数据帧' : '远程帧'} | `;
  html += `DLC: ${dlc} | 总长度: ${totalBits} bit`;
  html += `</div>`;

  preview.innerHTML = html;
}

function updateBuilderLIN() {
  const preview = document.getElementById('lin-builder-preview');
  const role = document.querySelector('input[name="lin-role"]:checked').value;
  const nadStr = document.getElementById('lin-nad').value.trim();

  // PID fixed per ISO 17987
  const pidVal = role === 'master' ? 0x3C : 0x3D;
  const pidDisplay = document.getElementById('lin-pid-display');
  if (pidDisplay) {
    pidDisplay.textContent = `0x${pidVal.toString(16).toUpperCase()} (${role === 'master' ? '主→从诊断请求' : '从→主诊断响应'})`;
  }

  // NAD validation
  const nadInput = document.getElementById('lin-nad');
  if (nadStr) {
    const nadVal = parseInt(nadStr, 16);
    if (isNaN(nadVal) || nadVal < 0 || nadVal > 0x7F) {
      nadInput.style.borderColor = 'var(--danger)';
      nadInput.style.background = '#fee2e2';
      preview.innerHTML = '<span style="color:var(--danger)">⚠️ NAD 有效范围: 00-7F</span>';
      return;
    }
  }
  nadInput.style.borderColor = '';
  nadInput.style.background = '';

  // Parse payload from shared SID + extra LIN data
  const payload = getUDSRequestBytes('lin-data');

  const payloadLen = payload.length;
  const nadVal = parseInt(nadStr || '00', 16);
  const isFF = payloadLen > 6;

  // PID parity calculation
  const id0 = (pidVal >> 0) & 1, id1 = (pidVal >> 1) & 1;
  const id2 = (pidVal >> 2) & 1, id3 = (pidVal >> 3) & 1;
  const id4 = (pidVal >> 4) & 1, id5 = (pidVal >> 5) & 1;
  const p0 = id0 ^ id1 ^ id2 ^ id4;
  const p1 = (id1 ^ id3 ^ id4 ^ id5) ^ 1;
  const pidWithParity = (p1 << 7) | (p0 << 6) | pidVal;
  const pidHex = pidWithParity.toString(16).toUpperCase().padStart(2, '0');

  // Classic checksum helper
  function calcChecksum(bytes) {
    let s = 0;
    for (const b of bytes) s += b;
    return (0xFF - (s & 0xFF)) & 0xFF;
  }

  // Build frame header (Break + Sync + PID)
  function renderHeader() {
    return `<div class="lin-field sync-break"><span class="field-label">BREAK</span><span class="field-value">13+ bit</span></div>`
      + `<div class="lin-field sync-byte"><span class="field-label">SYNC</span><span class="field-value">0x55</span></div>`
      + `<div class="lin-field pid-field"><span class="field-label">PID=0x${pidHex}</span><span class="field-value">P1=${p1} P0=${p0}</span></div>`
      + `<div class="lin-field" style="background:#6366f1;color:#fff"><span class="field-label">NAD</span><span class="field-value">0x${nadVal.toString(16).toUpperCase().padStart(2,'0')}</span></div>`;
  }

  // Render a frame entry with PCI + data + checksum
  function renderFrame(frame, label, pciLabel) {
    const pciContent = Array.isArray(frame.pci)
      ? frame.pci.map(b => '0x' + b.toString(16).toUpperCase().padStart(2,'0')).join(' ')
      : '0x' + frame.pci.toString(16).toUpperCase().padStart(2,'0');
    const dataHex = frame.data.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
    const csHex = calcChecksum(frame.bytes).toString(16).toUpperCase().padStart(2, '0');

    let h = '<div style="margin-bottom:8px;padding:6px 8px;border:1px solid var(--border);border-radius:8px">';
    h += `<div style="font-size:.7rem;font-weight:700;color:var(--text2);margin-bottom:4px">${label}</div>`;
    h += '<div class="lin-frame-preview">';
    h += renderHeader();
    h += `<div class="lin-field" style="background:#f59e0b;color:#1a1a2e"><span class="field-label">${pciLabel}</span><span class="field-value">${pciContent}</span></div>`;
    if (frame.data.length > 0) {
      h += `<div class="lin-field data-field"><span class="field-label">DATA(${frame.data.length}B)</span><span class="field-value">${dataHex}</span></div>`;
    }
    const padCount = frame.padBytes;
    if (padCount > 0) {
      const padHex = Array(padCount).fill('00').join(' ');
      h += `<div class="lin-field" style="background:#6b7280;color:#fff;opacity:.7"><span class="field-label">PAD(${padCount}B)</span><span class="field-value">${padHex}</span></div>`;
    }
    h += `<div class="lin-field checksum-field"><span class="field-label">CHK</span><span class="field-value">0x${csHex}</span></div>`;
    h += '</div></div>';
    return h;
  }

  let html = '';
  const nadHexDisplay = '0x' + nadStr.toUpperCase();

  if (!isFF) {
    // SingleFrame: 1 frame, 8 bytes
    const frameBytes = [nadVal, payloadLen, ...payload];
    while (frameBytes.length < 8) frameBytes.push(0x00);
    if (frameBytes.length > 8) frameBytes.length = 8;

    const frame = {
      pci: payloadLen,
      data: payloadLen > 0 ? frameBytes.slice(2, 2 + payloadLen) : [],
      padBytes: 6 - payloadLen,
      bytes: frameBytes
    };
    html = renderFrame(frame, `单帧 SF (${payloadLen} 字节 UDS 数据)`, 'PCI(SF)');
  } else {
    // Multi-frame: FF + CFs
    // FF: 2-byte PCI (length), carries 5 data bytes
    const ffPci1 = 0x10 | ((payloadLen >> 8) & 0x0F);
    const ffPci2 = payloadLen & 0xFF;
    const ffData = payload.slice(0, 5);
    const ffBytes = [nadVal, ffPci1, ffPci2, ...ffData];
    while (ffBytes.length < 8) ffBytes.push(0x00);
    ffBytes.length = 8;

    html = renderFrame({
      pci: [ffPci1, ffPci2],
      data: ffData,
      padBytes: 5 - ffData.length,
      bytes: ffBytes
    }, `帧 1 — 首帧 FF (总长 ${payloadLen} 字节, 第 1-5 字节)`, 'PCI(FF)');

    // CFs: each carries 6 data bytes, PCI = 0x20 | SN
    let offset = 5;
    let sn = 1;
    while (offset < payloadLen) {
      const chunk = payload.slice(offset, offset + 6);
      const cfPci = 0x20 | sn;
      const cfBytes = [nadVal, cfPci, ...chunk];
      while (cfBytes.length < 8) cfBytes.push(0x00);
      cfBytes.length = 8;
      const remaining = payloadLen - offset;

      html += renderFrame({
        pci: cfPci,
        data: chunk,
        padBytes: 6 - chunk.length,
        bytes: cfBytes
      }, `帧 ${sn + 1} — 连续帧 CF-${sn} (第 ${offset + 1}-${Math.min(offset + 6, payloadLen)} 字节)`, 'PCI(CF)');

      offset += 6;
      sn++;
    }
  }

  // Summary info line
  html += `<div class="lin-frame-info">`;
  html += `角色: ${role === 'master' ? 'Master' : 'Slave'} | `;
  html += `NAD: ${nadHexDisplay} | 有效载荷: ${payloadLen} 字节`;
  if (isFF) {
    const cfCount = Math.ceil((payloadLen - 5) / 6);
    html += ` | 传输序列: 1 FF + ${cfCount} CF = ${cfCount + 1} 帧`;
  } else {
    html += ` | 传输: 1 SF 帧`;
  }
  html += `</div>`;

  preview.innerHTML = html;
}

function copyBuilderHex(mode) {
  let hexStr = '';

  if (mode === 'can') {
    const idStr = document.getElementById('can-builder-id').value.trim();
    const idFormat = document.querySelector('input[name="can-id-format"]:checked').value;
    const frameType = document.querySelector('input[name="can-frame-type"]:checked').value;
    const reqBytes = getUDSRequestBytes('can-data').slice(0, 8);

    if (!idStr) return;
    const idVal = parseInt(idStr, 16);
    if (isNaN(idVal)) return;

    const idHex = idVal.toString(16).toUpperCase().padStart(idFormat === '11' ? 3 : 8, '0');
    const dataHex = reqBytes.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
    hexStr = `[CAN ${idFormat==='11'?'标准':'扩展'}] ID=0x${idHex} ${frameType==='remote'?'RTR':''} DLC=${reqBytes.length} ${dataHex}`;
  } else if (mode === 'lin') {
    const role = document.querySelector('input[name="lin-role"]:checked').value;
    const nadStr = document.getElementById('lin-nad').value.trim();
    if (nadStr) {
      const nv = parseInt(nadStr, 16);
      if (isNaN(nv) || nv < 0 || nv > 0x7F) return;
    }
    const pidVal = role === 'master' ? 0x3C : 0x3D;
    const nadByte = parseInt(nadStr || '00', 16);
    const payload = getUDSRequestBytes('lin-data');
    const len = payload.length;

    const id0 = (pidVal >> 0) & 1, id1 = (pidVal >> 1) & 1, id2 = (pidVal >> 2) & 1;
    const id3 = (pidVal >> 3) & 1, id4 = (pidVal >> 4) & 1, id5 = (pidVal >> 5) & 1;
    const p0 = id0 ^ id1 ^ id2 ^ id4;
    const p1 = (id1 ^ id3 ^ id4 ^ id5) ^ 1;
    const pidWithParity = (p1 << 7) | (p0 << 6) | pidVal;
    const pidHex = pidWithParity.toString(16).toUpperCase().padStart(2, '0');

    function frameToHex(fb) {
      let s = 0;
      for (const b of fb) s += b;
      const cs = (0xFF - (s & 0xFF)) & 0xFF;
      return `55 ${pidHex} ${fb.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ')} ${cs.toString(16).toUpperCase().padStart(2,'0')}`;
    }

    const lines = [];
    if (len <= 6) {
      const fb = [nadByte, len, ...payload];
      while (fb.length < 8) fb.push(0x00);
      fb.length = 8;
      lines.push(frameToHex(fb));
    } else {
      // FF
      const ff = [nadByte, 0x10 | ((len >> 8) & 0x0F), len & 0xFF, ...payload.slice(0, 5)];
      while (ff.length < 8) ff.push(0x00);
      ff.length = 8;
      lines.push(frameToHex(ff));
      // CFs
      let offset = 5, sn = 1;
      while (offset < len) {
        const chunk = payload.slice(offset, offset + 6);
        const cf = [nadByte, 0x20 | sn, ...chunk];
        while (cf.length < 8) cf.push(0x00);
        cf.length = 8;
        lines.push(frameToHex(cf));
        offset += 6; sn++;
      }
    }
    hexStr = lines.join('\n').trim();
  }

  navigator.clipboard.writeText(hexStr).then(() => {
    const btns = document.querySelectorAll('.copy-hex-btn');
    btns.forEach(btn => {
      btn.textContent = '✅ 已复制!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 复制 HEX';
        btn.classList.remove('copied');
      }, 1500);
    });
  }).catch(() => {
    const btns = document.querySelectorAll('.copy-hex-btn');
    btns.forEach(btn => {
      btn.textContent = '❌ 复制失败';
      setTimeout(() => { btn.textContent = '📋 复制 HEX'; }, 1500);
    });
  });
}

function getDataBytes(input) {
  const bytes = [];
  if (input) {
    for (const p of input.split(/[\s,]+/)) {
      if (/^[0-9a-fA-F]{2}$/.test(p)) bytes.push(parseInt(p, 16));
    }
  }
  return bytes;
}



// Theme with localStorage persistence
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('uds-theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-btn').textContent = isDark ? '☀️' : '🌙';
}

function loadTheme() {
  const saved = localStorage.getItem('uds-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('theme-btn').textContent = '☀️';
  }
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// Init
loadTheme();
renderServices();
renderNRCs();
renderHexMap();
renderSessions();
initBuilder();

// ======================== CAN BUS CONTENT ========================

const CAN_CONTENT = {
  overview: {
    title: 'CAN 总线概述',
    desc: 'CAN (Controller Area Network) 是一种多主串行通信总线，由 Bosch 于 1986 年开发，ISO 11898 标准定义。广泛应用于汽车动力总成、底盘控制、车身电子等领域。',
    specs: ['标准: ISO 11898', '速率: ≤1Mbps (CAN 2.0) / ≤8Mbps (CAN FD)', '帧: 标准 11-bit ID / 扩展 29-bit ID', '拓扑: 线性总线 + 120Ω 终端电阻', '仲裁: CSMA/CR', '错误检测: 5种机制']
  },
  frame: {
    title: 'CAN 帧结构 (标准数据帧)',
    fields: [
      { name: 'SOF', bits: '1', desc: '帧起始 — 1个显性位同步所有节点', cls: 'sof', color: '#ef4444' },
      { name: '仲裁场', bits: '12/32', desc: '11-bit ID+RTR / 29-bit ID+SRR+IDE+RTR', cls: 'arb', color: '#3b82f6' },
      { name: '控制场', bits: '6', desc: 'IDE+r0+4-bit DLC(0-8)', cls: 'ctrl', color: '#f59e0b' },
      { name: '数据场', bits: '0-64', desc: '0-8字节(CAN 2.0) / 0-64字节(CAN FD)', cls: 'data', color: '#10b981' },
      { name: 'CRC场', bits: '16', desc: '15-bit CRC+分隔符, 错误检测', cls: 'crc', color: '#a855f7' },
      { name: 'ACK场', bits: '2', desc: '1-bit ACK+分隔符, 接收节点确认', cls: 'ack', color: '#ec4899' },
      { name: 'EOF', bits: '7', desc: '帧结束 — 7个隐性位', cls: 'eof', color: '#6b7280' }
    ]
  },
  arbitration: {
    title: 'CAN 总线仲裁 (CSMA/CR)',
    desc: 'CAN使用无损仲裁机制。多个节点同时发送时, 显性位(0)覆盖隐性位(1)。ID最小的帧获得总线访问权。',
    example: '节点A(0x7E0) vs 节点B(0x7E8) vs 节点C(0x7F0) → 节点A获胜'
  },
  errors: {
    title: 'CAN 错误处理',
    items: [
      { name: '位错误 (Bit Error)', desc: '发送位与总线电平不一致 (仲裁/ACK时隙除外)', cls: 'bit-err' },
      { name: '填充错误 (Stuff Error)', desc: '连续6个同极性位 (位填充: 5同+1反)', cls: 'stuff-err' },
      { name: 'CRC 错误', desc: '接收方计算的CRC与发送方不一致', cls: 'crc-err' },
      { name: '格式错误 (Form Error)', desc: '固定位字段出现非法值 (CRC分隔符/ACK分隔符/EOF)', cls: 'form-err' },
      { name: 'ACK 错误', desc: '发送方在ACK时隙未检测到显性位', cls: 'ack-err' }
    ]
  },
  state: {
    title: 'CAN 错误状态机',
    states: [
      { name: 'Error Active', cond: 'TEC≤127, REC≤127', desc: '正常通信, 主动错误标志', cls: 'active' },
      { name: 'Error Passive', cond: 'TEC>127 或 REC>127', desc: '仍可通信, 被动错误标志', cls: 'passive' },
      { name: 'Bus Off', cond: 'TEC>255', desc: '与总线断开, 128次11位隐性后恢复', cls: 'busoff' }
    ]
  },
  canfd: {
    title: 'CAN FD 对比',
    rows: [
      ['数据速率', '≤1 Mbps', '≤8 Mbps'],
      ['数据场', '0-8 bytes', '0-64 bytes'],
      ['CRC', '15 bit', '17/21 bit'],
      ['兼容性', '—', '向下兼容 CAN 2.0']
    ]
  }
};

function renderCANContent() {
  const tab = document.getElementById('tab-canbus');
  if (!tab || tab.dataset.rendered) return;
  const c = CAN_CONTENT;
  let html = '';

  // Overview
  html += `<div class="bus-section"><div class="sec-title">${c.overview.title}</div><div class="sec-desc">${c.overview.desc}</div><div class="bus-card"><ul style="list-style:none;padding:0">`;
  c.overview.specs.forEach(s => { html += `<li style="padding:4px 0;font-size:.85rem;color:var(--text2)">• ${s}</li>`; });
  html += `</ul></div></div>`;

  // Frame Structure
  html += `<div class="bus-section"><div class="sec-title">${c.frame.title}</div>`;
  html += `<div class="frame-diagram">`;
  c.frame.fields.forEach(f => {
    html += `<div class="frame-byte ${f.cls}" style="background:${f.color}" title="${f.desc}"><span class="label">${f.name}</span><span class="value">${f.bits}bit</span></div>`;
  });
  html += `</div>`;
  c.frame.fields.forEach(f => {
    html += `<div style="font-size:.75rem;color:var(--text2);margin:2px 0"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${f.color};margin-right:6px"></span><b>${f.name} (${f.bits} bit)</b> — ${f.desc}</div>`;
  });
  html += `</div>`;

  // Arbitration
  html += `<div class="bus-section"><div class="sec-title">${c.arbitration.title}</div><div class="bus-card"><p class="sec-desc">${c.arbitration.desc}</p><p style="font-family:var(--font-mono);font-size:.8rem;padding:.5rem;background:var(--card2);border-radius:6px">${c.arbitration.example}</p></div></div>`;

  // Error Handling
  html += `<div class="bus-section"><div class="sec-title">${c.errors.title}</div><div class="bus-card">`;
  c.errors.items.forEach(e => { html += `<span class="error-tag ${e.cls}" title="${e.desc}">${e.name}</span>`; });
  html += `<div style="margin-top:1rem">`;
  c.errors.items.forEach(e => { html += `<p style="font-size:.82rem;margin:6px 0"><b>${e.name}:</b> ${e.desc}</p>`; });
  html += `</div></div></div>`;

  // State Machine
  html += `<div class="bus-section"><div class="sec-title">${c.state.title}</div><div class="state-machine">`;
  c.state.states.forEach((s, i) => {
    html += `<div class="state-node ${s.cls}"><span class="sn-name">${s.name}</span><span class="sn-cond">${s.cond}</span><span style="font-size:.65rem;color:var(--text3);margin-top:4px">${s.desc}</span></div>`;
    if (i < c.state.states.length - 1) { html += `<span class="state-arrow">→</span>`; }
  });
  html += `</div></div>`;

  // CAN FD
  html += `<div class="bus-section"><div class="sec-title">${c.canfd.title}</div><table class="comparison-table"><tr><th>特性</th><th class="col-can">CAN 2.0</th><th class="col-lin">CAN FD</th></tr>`;
  c.canfd.rows.forEach(r => { html += `<tr><td>${r[0]}</td><td class="col-can">${r[1]}</td><td class="col-lin">${r[2]}</td></tr>`; });
  html += `</table></div>`;

  tab.innerHTML = html;
  tab.dataset.rendered = '1';
}

// ======================== LIN BUS CONTENT ========================

const LIN_CONTENT = {
  overview: {
    title: 'LIN 总线概述',
    desc: 'LIN (Local Interconnect Network) 是一种低成本、低速的单主多从串行通信总线, ISO 17987 标准定义。作为 CAN 的子总线, 广泛应用于车窗、座椅、空调、雨刮等车身舒适系统。',
    specs: ['标准: ISO 17987', '速率: ≤20 kbps (常用 9.6/10.4/19.2 kbps)', '架构: 单主多从', '线数: 1线+地 (单线制)', '成本: 极低 (UART/SCI 基础)', '电压: 隐性 12V / 显性 0V']
  },
  frame: {
    title: 'LIN 帧结构',
    fields: [
      { name: '同步间隔', desc: '13+ bits 显性 (Master 发送)', cls: 'sof', color: '#ef4444' },
      { name: '同步字节', desc: '0x55 (01010101) 用于位时钟同步', cls: 'arb', color: '#3b82f6' },
      { name: 'PID', desc: '6-bit ID + 2-bit 奇偶校验', cls: 'ctrl', color: '#f59e0b' },
      { name: '数据', desc: '1-8 字节数据', cls: 'data', color: '#10b981' },
      { name: '校验和', desc: '经典/增强校验和', cls: 'crc', color: '#a855f7' }
    ]
  },
  masterslave: {
    title: 'LIN 主从架构',
    master: { role: 'Master (主节点)', tasks: ['发送报头 (Header)', '维护调度表', '管理总线唤醒/休眠'] },
    slave: { role: 'Slave (从节点)', tasks: ['响应 Master 报头', '发送数据帧', '接收命令'] }
  },
  schedule: {
    title: 'LIN 调度表',
    desc: '调度表由 Master 维护, 定义报文的发送顺序和时间间隙。每个条目指定帧 ID 和最坏情况发送时间。',
    entries: [
      { id: '0x10', name: '车速', period: '10ms' },
      { id: '0x11', name: '转速', period: '10ms' },
      { id: '0x12', name: '水温', period: '100ms' },
      { id: '0x30', name: '灯光', period: '100ms' },
      { id: '0x3C', name: '主节点状态', period: '50ms' }
    ]
  },
  timing: {
    title: 'LIN 总线电平与唤醒',
    desc: '隐性 (Recessive): 12V (逻辑1)。显性 (Dominant): 0V (逻辑0)。唤醒: Master 发送 250μs 显性脉冲。休眠: Master 发送 0x00 的 Go-To-Sleep 命令。'
  },
  comparison: {
    title: 'CAN vs LIN 对比',
    rows: [
      ['速率', '≤1 Mbps (CAN FD: ≤8Mbps)', '≤20 kbps'],
      ['架构', '多主 (CSMA/CR)', '单主多从'],
      ['线数', '2线 (CAN_H + CAN_L)', '1线 + 地'],
      ['成本', '中等', '低'],
      ['容错', '5种错误检测, 完善', '基本 (校验和)'],
      ['应用', '动力总成, 底盘, 安全', '车身, 舒适系统']
    ]
  }
};

function renderLINContent() {
  const tab = document.getElementById('tab-linbus');
  if (!tab || tab.dataset.rendered) return;
  const c = LIN_CONTENT;
  let html = '';

  // Overview
  html += `<div class="bus-section"><div class="sec-title">${c.overview.title}</div><div class="sec-desc">${c.overview.desc}</div><div class="bus-card"><ul style="list-style:none;padding:0">`;
  c.overview.specs.forEach(s => { html += `<li style="padding:4px 0;font-size:.85rem;color:var(--text2)">• ${s}</li>`; });
  html += `</ul></div></div>`;

  // Frame Structure
  html += `<div class="bus-section"><div class="sec-title">${c.frame.title}</div><div class="frame-diagram">`;
  const colors$1 = ['#ef4444','#3b82f6','#f59e0b','#10b981','#a855f7'];
  c.frame.fields.forEach((f, i) => {
    html += `<div class="frame-byte" style="background:${colors$1[i]}" title="${f.desc}"><span class="label">${f.name}</span></div>`;
  });
  html += `</div>`;
  c.frame.fields.forEach((f, i) => {
    html += `<div style="font-size:.75rem;color:var(--text2);margin:2px 0"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${colors$1[i]};margin-right:6px"></span><b>${f.name}</b> — ${f.desc}</div>`;
  });
  html += `</div>`;

  // Master/Slave
  html += `<div class="bus-section"><div class="sec-title">${c.masterslave.title}</div><div style="display:flex;gap:1rem;flex-wrap:wrap">`;
  [{ side: c.masterslave.master, color: '#3b82f6' }, { side: c.masterslave.slave, color: '#10b981' }].forEach(({ side, color }) => {
    html += `<div class="bus-card" style="flex:1;min-width:200px;border-left:3px solid ${color}"><h3>${side.role}</h3><ul style="font-size:.82rem;color:var(--text2);padding-left:1.2rem">`;
    side.tasks.forEach(t => { html += `<li>${t}</li>`; });
    html += `</ul></div>`;
  });
  html += `</div></div>`;

  // Schedule
  html += `<div class="bus-section"><div class="sec-title">${c.schedule.title}</div><div class="sec-desc">${c.schedule.desc}</div><table class="comparison-table"><tr><th>帧 ID</th><th>信号</th><th>周期</th></tr>`;
  c.schedule.entries.forEach(e => { html += `<tr><td style="font-family:var(--font-mono)">${e.id}</td><td>${e.name}</td><td>${e.period}</td></tr>`; });
  html += `</table></div>`;

  // Timing
  html += `<div class="bus-section"><div class="sec-title">${c.timing.title}</div><div class="bus-card"><p style="font-size:.85rem;color:var(--text2)">${c.timing.desc}</p></div></div>`;

  // Comparison
  html += `<div class="bus-section"><div class="sec-title">${c.comparison.title}</div><table class="comparison-table"><tr><th>特性</th><th class="col-can">CAN</th><th class="col-lin">LIN</th></tr>`;
  c.comparison.rows.forEach(r => { html += `<tr><td>${r[0]}</td><td class="col-can">${r[1]}</td><td class="col-lin">${r[2]}</td></tr>`; });
  html += `</table></div>`;

  tab.innerHTML = html;
  tab.dataset.rendered = '1';
}

// Initialize CAN/LIN content on page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    renderCANContent();
    renderLINContent();
  }, 100);
});
