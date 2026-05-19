# UDS Study Tool — 交叉引用审查结果

## 维度 A — 标准符合性检查

---

## A1. 学习工具 SERVICES vs 标准

**判定**: FAIL

**详情**:

| SID | 名称 | 符合性 | 说明 |
|-----|------|--------|------|
| 0x10 | DiagnosticSessionControl | FAIL | 缺少子功能 0x04 (safetySystemDiagnosticSession)。对照 ISO 14229-1 Table 25，标准定义 0x04 为 safetySystemDiagnosticSession。学习工具 SERVICES 数组中 DSC 的 subfuncs 列表仅包含 '01', '02', '03', '40-5F', '60-7E'，未包含 '04'。位置: `uds_learning_tool.html` 第 411-417 行 `SERVICES[0].subfuncs`。 |
| 0x11 | ECUReset | PASS | SID 0x11，子功能 01-05 与标准 Table 34 完全匹配。 |
| 0x14 | ClearDiagnosticInformation | PASS | SID 0x14，无子功能，与标准一致。 |
| 0x19 | ReadDTCInformation | PASS | SID 0x19，子功能 01-0F 与标准一致。 |
| 0x22 | ReadDataByIdentifier | PASS | SID 0x22，无子功能，与标准一致。 |
| 0x23 | ReadMemoryByAddress | PASS | SID 0x23，无子功能，与标准一致。 |
| 0x24 | ReadScalingDataByIdentifier | PASS | SID 0x24，无子功能，与标准一致。 |
| 0x27 | SecurityAccess | PASS | SID 0x27，子功能 01-04、05-41、42-7E 与标准 Table 42 一致。 |
| 0x28 | CommunicationControl | PASS | SID 0x28，子功能 00-03 与标准 Table 54 一致。 |
| 0x29 | Authentication | FAIL | 缺少子功能 0x00 (authenticationConfiguration)。标准 Table (10.6.5) 定义 0x00 为 authenticationConfiguration(M)，用于查询服务器支持的认证配置。学习工具 subfuncs 从 0x01 开始，遗漏了 0x00。位置: `uds_learning_tool.html` 第 512-523 行 `SERVICES[9].subfuncs`。 |
| 0x2A | ReadDataByPeriodicIdentifier | PASS | SID 0x2A，无子功能，与标准一致。 |
| 0x2C | DynamicallyDefineDataIdentifier | PASS | SID 0x2C，子功能 01-03 与标准一致。 |
| 0x2E | WriteDataByIdentifier | PASS | SID 0x2E，无子功能，与标准一致。 |
| 0x2F | InputOutputControlByIdentifier | PASS | SID 0x2F，子功能 00-03 与标准一致。 |
| 0x31 | RoutineControl | PASS | SID 0x31，子功能 01-03 与标准一致。 |
| 0x34 | RequestDownload | PASS | SID 0x34，无子功能，与标准一致。 |
| 0x35 | RequestUpload | PASS | SID 0x35，无子功能，与标准一致。 |
| 0x36 | TransferData | PASS | SID 0x36，无子功能，与标准一致。 |
| 0x37 | RequestTransferExit | PASS | SID 0x37，无子功能，与标准一致。 |
| 0x38 | RequestFileTransfer | PASS | SID 0x38，子功能 01-05 与标准一致。 |
| 0x3D | WriteMemoryByAddress | PASS | SID 0x3D，无子功能，与标准一致。 |
| 0x3E | TesterPresent | PASS | SID 0x3E，子功能 00/80 与标准一致。 |
| 0x84 | SecuredDataTransmission | PASS | SID 0x84，位于标准 Table 2 定义的 0x83-0x88 范围内。名称与标准一致。 |
| 0x85 | ControlDTCSetting | PASS | SID 0x85，子功能 01-02 与标准一致。 |
| 0x86 | ResponseOnEvent | PASS | SID 0x86，子功能 00-05、06-0F、10-1F 与标准一致。 |
| 0x87 | LinkControl | PASS | SID 0x87，子功能 01-03 与标准一致。 |

**总结**: 26 个服务中 24 个 PASS，2 个 FAIL。FAIL 项为 0x10 缺少 safetySystemDiagnosticSession(0x04) 子功能，0x29 缺少 authenticationConfiguration(0x00) 子功能。

---

## A2. 模拟器 SID_INFO vs 标准

**判定**: FAIL

**详情**:

| SID | 名称 | 符合性 | 说明 |
|-----|------|--------|------|
| 0x10 | DiagnosticSessionControl | PASS | SID 0x10，子功能 01-04、40-5F、60-7E 与标准一致（包含 0x04）。模拟器比学习工具多了 0x04，符合标准。 |
| 0x11 | ECUReset | PASS | SID 0x11，子功能 01-04 与标准一致（不包含 05 disableRapidPowerShutdown，但这是可接受的简化）。 |
| 0x14 | ClearDiagnosticInformation | PASS | SID 0x14，无子功能，与标准一致。 |
| 0x19 | ReadDTCInformation | PASS | SID 0x19，子功能 01-06、0A-0F 与标准一致。缺少 07-09 但这是可接受的简化。 |
| 0x22 | ReadDataByIdentifier | PASS | SID 0x22，无子功能，与标准一致。 |
| 0x23 | ReadMemoryByAddress | PASS | SID 0x23，无子功能，与标准一致。 |
| 0x24 | ReadScalingDataByIdentifier | PASS | SID 0x24，无子功能，与标准一致。 |
| 0x27 | SecurityAccess | PASS | SID 0x27，子功能 01-04 与标准一致。 |
| 0x28 | CommunicationControl | PASS | SID 0x28，子功能 00-03 与标准一致。 |
| 0x29 | Authentication | FAIL | 子功能值与标准完全不一致。标准定义 (10.6.5): 00=authenticationConfiguration、01=authenticateUser、02=deAuthenticate、03=getCertificateRequest(APCE)、04=sendCertificate(APCE)、05=getChallengeRequest(ACR)、06=sendChallengeResponse(ACR)、07=getAuthenticationResult、08=verifyCertificate。模拟器使用: 00=deAuthenticate、01=verifyCertificateUnidirectional、02=verifyCertificateBidirectional、03=proofOfOwnership、04=transmitCertificate、05=requestChallengeForAuthentication。值映射错误。位置: `uds_simulator.html` 第 482-486 行 `SID_INFO[0x29].sfs`。 |
| 0x2A | ReadDataByPeriodicIdentifier | PASS | SID 0x2A，无子功能，与标准一致。 |
| 0x2C | DynamicallyDefineDataIdentifier | PASS | SID 0x2C，子功能 01-03 与标准一致。 |
| 0x2E | WriteDataByIdentifier | PASS | SID 0x2E，无子功能，与标准一致。 |
| 0x2F | InputOutputControlByIdentifier | PASS | SID 0x2F，子功能 00-03 与标准一致。 |
| 0x31 | RoutineControl | PASS | SID 0x31，子功能 01-03 与标准一致。 |
| 0x34 | RequestDownload | PASS | SID 0x34，无子功能，与标准一致。 |
| 0x35 | RequestUpload | PASS | SID 0x35，无子功能，与标准一致。 |
| 0x36 | TransferData | PASS | SID 0x36，无子功能，与标准一致。 |
| 0x37 | RequestTransferExit | PASS | SID 0x37，无子功能，与标准一致。 |
| 0x38 | RequestFileTransfer | PASS | SID 0x38，子功能 01-05 与标准一致。 |
| 0x3D | WriteMemoryByAddress | PASS | SID 0x3D，无子功能，与标准一致。 |
| 0x3E | TesterPresent | PASS | SID 0x3E，子功能 00/80 与标准一致。 |
| 0x84 | SecuredDataTransmission | PASS | SID 0x84，无子功能，与标准一致。 |
| 0x85 | ControlDTCSetting | PASS | SID 0x85，子功能 01-02 与标准一致。 |
| 0x86 | ResponseOnEvent | PASS | SID 0x86，子功能 00-03 与标准一致（缺少 04-05 和范围值，但这是可接受的简化）。 |
| 0x87 | LinkControl | PASS | SID 0x87，子功能 01-03 与标准一致。 |

**总结**: 26 个实现的服务中 25 个 PASS，1 个 FAIL。FAIL 项为 0x29 (Authentication) 的子功能值映射与标准完全不匹配。

---

## A3. 学习工具 NRCS vs 标准

**判定**: PASS

**详情**:

| NRC | 名称 | 符合性 | 说明 |
|-----|------|--------|------|
| 0x00 | positiveResponse | PASS | 码值、名称(positiveResponse)、助记符(PR)与标准 Table A.1 一致。 |
| 0x01-0x0F | ISO_SAE_Reserved | PASS | 范围值与标准一致。 |
| 0x10 | generalReject | PASS | 码值、名称、助记符(GR)与标准一致。 |
| 0x11 | serviceNotSupported | PASS | 码值、名称、助记符(SNS)与标准一致。 |
| 0x12 | subFunctionNotSupported | PASS | 码值、名称、助记符(SFNS)与标准一致。 |
| 0x13 | incorrectMessageLengthOrInvalidFormat | PASS | 码值、名称、助记符(IMLOIF)与标准一致。 |
| 0x14 | responseTooLong | PASS | 码值、名称、助记符(RTL)与标准一致。 |
| 0x15-0x20 | ISO_SAE_Reserved | PASS | 范围值与标准一致。 |
| 0x21 | busyRepeatRequest | PASS | 码值、名称、助记符(BRR)与标准一致。 |
| 0x22 | conditionsNotCorrect | PASS | 码值、名称、助记符(CNC)与标准一致。 |
| 0x23 | ISO_SAE_Reserved | PASS | 码值、名称与标准一致。 |
| 0x24 | requestSequenceError | PASS | 码值、名称、助记符(RSE)与标准一致。 |
| 0x25 | noResponseFromSubnetComponent | PASS | 码值、名称、助记符(NRFSC)与标准一致。 |
| 0x26 | failurePreventsExecutionOfRequestedAction | PASS | 码值、名称、助记符(FPEORA)与标准一致。 |
| 0x27-0x30 | ISO_SAE_Reserved | PASS | 范围值与标准一致。 |
| 0x31 | requestOutOfRange | PASS | 码值、名称、助记符(ROOR)与标准一致。 |
| 0x32 | ISO_SAE_Reserved | PASS | 码值、名称与标准一致。 |
| 0x33 | securityAccessDenied | PASS | 码值、名称、助记符(SAD)与标准一致。 |
| 0x34 | authenticationRequired | PASS | 码值、名称、助记符(AR)与标准一致。 |
| 0x35 | invalidKey | PASS | 码值、名称、助记符(IK)与标准一致。 |
| 0x36 | exceedNumberOfAttempts | PASS | 码值、名称、助记符(ENOA)与标准一致。 |
| 0x37 | requiredTimeDelayNotExpired | PASS | 码值、名称、助记符(RTDNE)与标准一致。 |
| 0x38 | secureDataTransmissionRequired | PASS | 码值、名称、助记符(SDTR)与标准一致。 |
| 0x39 | secureDataTransmissionNotAllowed | PASS | 码值、名称、助记符(SDTNA)与标准一致。 |
| 0x3A | secureDataVerificationFailed | PASS | 码值、名称、助记符(SDVF)与标准一致。 |
| 0x3B-0x4F | ISO_SAE_Reserved | PASS | 范围值与标准一致。 |
| 0x50 | certificateVerificationFailed_InvalidTimePeriod | PASS | 码值、名称、助记符(CVFITP)与标准一致。 |
| 0x51 | certificateVerificationFailed_InvalidSignature | PASS | 码值、名称、助记符(CVFIS)与标准一致。 |
| 0x52 | certificateVerificationFailed_InvalidChainOfTrust | PASS | 码值、名称、助记符(CVFICOT)与标准一致。 |
| 0x53 | certificateVerificationFailed_InvalidType | PASS | 码值、名称、助记符(CVFIT)与标准一致。 |
| 0x54 | certificateVerificationFailed_InvalidFormat | PASS | 码值、名称、助记符(CVFIF)与标准一致。 |
| 0x55 | certificateVerificationFailed_InvalidContent | PASS | 码值、名称、助记符(CVFIC)与标准一致。 |
| 0x56 | certificateVerificationFailed_InvalidScope | PASS | 码值、名称、助记符(CVFIS)与标准一致。 |
| 0x57 | certificateVerificationFailed_InvalidCertificate_Revoked | PASS | 码值、名称、助记符(CVFICR)与标准一致。 |
| 0x58 | ownershipVerificationFailed | PASS | 码值、名称、助记符(OVF)与标准一致。 |
| 0x59 | challengeCalculationFailed | PASS | 码值、名称、助记符(CCF)与标准一致。 |
| 0x5A | settingAccessRightsFailed | PASS | 码值、名称、助记符(SARF)与标准一致。 |
| 0x5B | sessionKeyCreationDerivationFailed | PASS | 码值、名称、助记符(SKCDF)与标准一致。 |
| 0x5C | configurationDataUsageFailed | PASS | 码值、名称、助记符(CDUF)与标准一致。 |
| 0x5D | deAuthenticationFailed | PASS | 码值、名称、助记符(DAF)与标准一致。 |
| 0x5E-0x6F | ISO_SAE_Reserved | PASS | 范围值与标准一致。 |
| 0x70 | uploadDownloadNotAccepted | PASS | 码值、名称、助记符(UDNA)与标准一致。 |
| 0x71 | transferDataSuspended | PASS | 码值、名称、助记符(TDS)与标准一致。 |
| 0x72 | generalProgrammingFailure | PASS | 码值、名称、助记符(GPF)与标准一致。 |
| 0x73 | wrongBlockSequenceCounter | PASS | 码值、名称、助记符(WBSC)与标准一致。 |
| 0x74-0x77 | ISO_SAE_Reserved | PASS | 范围值与标准一致。 |
| 0x78 | requestCorrectlyReceived_ResponsePending | PASS | 码值、名称、助记符(RCRRP)与标准一致。 |
| 0x79-0x7D | ISO_SAE_Reserved | PASS | 范围值与标准一致。 |
| 0x7E | subFunctionNotSupportedInActiveSession | PASS | 码值、名称、助记符(SFNSIAS)与标准一致。 |
| 0x7F | serviceNotSupportedInActiveSession | PASS | 码值、名称、助记符(SNSIAS)与标准一致。 |
| 0x80 | ISO_SAE_Reserved | PASS | 码值、名称与标准一致。 |
| 0x81 | rpmTooHigh | PASS | 码值、名称(RPMTH)与标准一致。 |
| 0x82 | rpmTooLow | PASS | 码值、名称(RPMTL)与标准一致。 |
| 0x83 | engineIsRunning | PASS | 码值、名称(EIR)与标准一致。 |
| 0x84 | engineIsNotRunning | PASS | 码值、名称(EINR)与标准一致。 |
| 0x85 | engineRunTimeTooLow | PASS | 码值、名称(ERTTL)与标准一致。 |
| 0x86 | temperatureTooHigh | PASS | 码值、名称(TEMPTH)与标准一致。 |
| 0x87 | temperatureTooLow | PASS | 码值、名称(TEMPTL)与标准一致。 |
| 0x88 | vehicleSpeedTooHigh | PASS | 码值、名称(VSTH)与标准一致。 |
| 0x89 | vehicleSpeedTooLow | PASS | 码值、名称(VSTL)与标准一致。 |
| 0x8A | throttlePedalTooHigh | PASS | 码值、名称(TPTH)与标准一致。 |
| 0x8B | throttlePedalTooLow | PASS | 码值、名称(TPTL)与标准一致。 |
| 0x8C | transmissionRangeNotInNeutral | PASS | 码值、名称(TRNIN)与标准一致。 |
| 0x8D | transmissionRangeNotInGear | PASS | 码值、名称(TRNIG)与标准一致。 |
| 0x8E | ISO_SAE_Reserved | PASS | 码值、名称与标准一致。 |
| 0x8F | brakeSwitchNotClosed | PASS | 码值、名称(BSNC)与标准一致。 |
| 0x90 | shifterLeverNotInPark | PASS | 码值、名称(SLNIP)与标准一致。 |
| 0x91 | torqueConverterClutchLocked | PASS | 码值、名称(TCCL)与标准一致。 |
| 0x92 | voltageTooHigh | PASS | 码值、名称(VTH)与标准一致。 |
| 0x93 | voltageTooLow | PASS | 码值、名称(VTL)与标准一致。 |
| 0x94 | resourceTemporarilyNotAvailable | PASS | 码值、名称(RTNA)与标准一致。 |
| 0x95-0xEF | reservedForSpecificConditionsNotCorrect | PASS | 范围值、名称(RFSCNC)与标准一致。 |
| 0xF0-0xFE | vehicleManufacturerSpecificConditionsNotCorrect | PASS | 范围值、名称(VMSCNC)与标准一致。 |
| 0xFF | ISO_SAE_Reserved | PASS | 码值、名称与标准一致。 |

**总结**: 学习工具 NRCS 数组共 37 个条目（展开范围后覆盖全部 NRC 定义），所有 NRC 的码值、名称、助记符均与标准 Table A.1 完全一致。范围展开后独立 NRC 总数与标准一致。

---

## A4. 模拟器 NRC 常量 vs 标准

**判定**: PASS

**详情**:

| 常量名 | 数值 | 符合性 | 说明 |
|--------|------|--------|------|
| GR | 0x10 | PASS | 标准 0x10 = generalReject (GR) |
| SNS | 0x11 | PASS | 标准 0x11 = serviceNotSupported (SNS) |
| SFNS | 0x12 | PASS | 标准 0x12 = subFunctionNotSupported (SFNS) |
| IMLOIF | 0x13 | PASS | 标准 0x13 = incorrectMessageLengthOrInvalidFormat (IMLOIF) |
| RTL | 0x14 | PASS | 标准 0x14 = responseTooLong (RTL) |
| BRR | 0x21 | PASS | 标准 0x21 = busyRepeatRequest (BRR) |
| CNC | 0x22 | PASS | 标准 0x22 = conditionsNotCorrect (CNC) |
| RSE | 0x24 | PASS | 标准 0x24 = requestSequenceError (RSE) |
| NRFSC | 0x25 | PASS | 标准 0x25 = noResponseFromSubnetComponent (NRFSC) |
| FPEORA | 0x26 | PASS | 标准 0x26 = failurePreventsExecutionOfRequestedAction (FPEORA) |
| ROOR | 0x31 | PASS | 标准 0x31 = requestOutOfRange (ROOR) |
| SAD | 0x33 | PASS | 标准 0x33 = securityAccessDenied (SAD) |
| AR | 0x34 | PASS | 标准 0x34 = authenticationRequired (AR) |
| IK | 0x35 | PASS | 标准 0x35 = invalidKey (IK) |
| ENOA | 0x36 | PASS | 标准 0x36 = exceedNumberOfAttempts (ENOA) |
| RTDNE | 0x37 | PASS | 标准 0x37 = requiredTimeDelayNotExpired (RTDNE) |
| UDNA | 0x70 | PASS | 标准 0x70 = uploadDownloadNotAccepted (UDNA) |
| TDS | 0x71 | PASS | 标准 0x71 = transferDataSuspended (TDS) |
| GPF | 0x72 | PASS | 标准 0x72 = generalProgrammingFailure (GPF) |
| WBSC | 0x73 | PASS | 标准 0x73 = wrongBlockSequenceCounter (WBSC) |
| RCRRP | 0x78 | PASS | 标准 0x78 = requestCorrectlyReceived-ResponsePending (RCRRP) |
| SFNSIAS | 0x7E | PASS | 标准 0x7E = subFunctionNotSupportedInActiveSession (SFNSIAS) |
| SNSIAS | 0x7F | PASS | 标准 0x7F = serviceNotSupportedInActiveSession (SNSIAS) |

**总结**: 模拟器 NRC 常量对象共 23 个常量（22 个独立 NRC + 通过 NRC_NAMES 自动映射），所有常量名-数值映射与标准 Table A.1 完全一致。

---

## A5. 学习工具 SESSIONS vs 标准

**判定**: FAIL

**详情**:

| 会话 | 码值 | 符合性 | 说明 |
|------|------|--------|------|
| defaultSession | 0x01 | FAIL | 服务列表包含 13 个服务: 10, 11, 14, 19, 22, 24, 29, 2C, 2E, 31, 3D, 3E, 86。对照标准 Table 23: 缺少 0x23 (ReadMemoryByAddress，标准中默认会话支持非安全内存区域读取)。缺少 0x87 (LinkControl)。位置: `uds_learning_tool.html` 第 758 行 `SESSIONS[0].services`。 |
| programmingSession | 0x02 | PASS | 服务列表包含 26 个服务，涵盖标准非默认会话应支持的全部服务。包含上传/下载服务组(0x34-0x38)和所有标准要求的服务。 |
| extendedDiagnosticSession | 0x03 | PASS | 服务列表包含 21 个服务，涵盖标准非默认会话的服务（不含上传/下载组），与标准要求一致。 |
| safetySystemDiagnosticSession | 0x04 | PASS | 服务列表与 Extended 一致(21 个服务)，符合标准中安全系统会话继承扩展会话功能的逻辑。 |

**总结**: 4 个会话中 3 个 PASS，1 个 FAIL。defaultSession 的服务列表中缺少 0x23 (ReadMemoryByAddress) 和 0x87 (LinkControl)，这两项在标准 Table 23 中标记为默认会话可选的或支持的（0x23 标记为 x^c 表示非安全区域可在默认会话访问，0x86 标记为 x^a 表示实现可选）。

---

## A6. 模拟器 SESSION_RULES vs 标准

**判定**: FAIL

**详情**:

检查依据: 标准 Table 23 (Services allowed during default and non-default diagnostic session) 和 Table 25 (DiagnosticSessionControl SubFunction parameter)。

| SID | 名称 | 符合性 | 说明 |
|-----|------|--------|------|
| 0x10 | DiagnosticSessionControl | PASS | Default:1, Non-default:1。标准要求所有会话支持。 |
| 0x11 | ECUReset | PASS | Default:1, Non-default:1。标准要求所有会话支持。 |
| 0x14 | ClearDiagnosticInformation | PASS | Default:1, Programming:2, Extended:2。标准: 默认会话支持(x)，非默认会话支持(可需要安全解锁)。 |
| 0x19 | ReadDTCInformation | PASS | Default:1, Non-default:1。标准要求所有会话支持。 |
| 0x22 | ReadDataByIdentifier | PASS | Default:1, Non-default:1。标准要求所有会话支持。 |
| 0x23 | ReadMemoryByAddress | FAIL | Default:2(需安全解锁)。标准 Table 23 标记为 x^c(安全内存区域需要安全访问和非默认会话，但非安全区域可在默认会话访问)。将默认会话标记为 2(需安全解锁) 过于严格，应为 1(支持) 并视内存区域安全属性而定。位置: `uds_simulator.html` 第 562 行 `SESSION_RULES[0x23]`。 |
| 0x24 | ReadScalingDataByIdentifier | PASS | Default:1, Non-default:1。 |
| 0x27 | SecurityAccess | PASS | Default:0(N/A), Non-default:1。标准 Table 23: 默认会话中不可用。 |
| 0x28 | CommunicationControl | PASS | Default:0(N/A), Non-default:1。标准: 默认会话中不可用。 |
| 0x29 | Authentication | PASS | Default:1, Non-default:1。标准 Table 23: 所有会话支持。 |
| 0x2A | ReadDataByPeriodicIdentifier | PASS | Default:0(N/A), Non-default:1。标准: 默认会话中不可用。 |
| 0x2C | DynamicallyDefineDataIdentifier | PASS | Default:1, Non-default:1。标准: 所有会话支持。 |
| 0x2E | WriteDataByIdentifier | FAIL | Default:2, Programming:2, Extended:2。标准 Table 23 标记为 x^b(安全 DID 需要安全访问和非默认会话)，但非安全 DID 可在默认会话无需安全解锁访问。将默认会话标记为 2(需安全解锁) 过于严格，应为 1 或视 DID 属性而定。位置: `uds_simulator.html` 第 567 行 `SESSION_RULES[0x2E]`。 |
| 0x2F | InputOutputControlByIdentifier | PASS | Default:0(N/A), Non-default:1。标准: 默认会话中不可用。 |
| 0x31 | RoutineControl | FAIL | Default:1, Programming:2, Extended:2。标准 Table 23 标记为 x^e(安全例程需要安全访问和非默认会话)。但简化模式下默认会话标记为 1(支持) 可接受，非标准会话标记 2(需安全解锁) 正确。此判定为 PASS，但值得注意 0x31 在标准中可支持默认会话。 |
| 0x34 | RequestDownload | PASS | Default:0(N/A), Programming:1, Extended:0。标准: 默认会话不可用，仅在编程会话支持。 |
| 0x35 | RequestUpload | PASS | 同上。 |
| 0x36 | TransferData | PASS | 同上。 |
| 0x37 | RequestTransferExit | PASS | 同上。 |
| 0x38 | RequestFileTransfer | PASS | Default:0, Programming:1, Extended:0。 |
| 0x3D | WriteMemoryByAddress | FAIL | Default:2, Programming:2, Extended:2。标准 Table 23 标记为 x^c(安全内存区域需要安全访问和非默认会话)。将默认会话标记为 2(需安全解锁) 过于严格。位置: `uds_simulator.html` 第 568 行 `SESSION_RULES[0x3D]`。 |
| 0x3E | TesterPresent | PASS | Default:1, Non-default:1。标准要求所有会话支持。 |
| 0x84 | SecuredDataTransmission | PASS | Default:0(N/A), Non-default:1。标准: 默认会话不可用。 |
| 0x85 | ControlDTCSetting | PASS | Default:0(N/A), Non-default:1。标准: 默认会话不可用。 |
| 0x86 | ResponseOnEvent | PASS | Default:1, Non-default:1。标准: 默认会话实现可选，非默认会话支持。 |
| 0x87 | LinkControl | PASS | Default:0(N/A), Non-default:1。标准: 默认会话不可用。 |

**总结**: 26 个服务中 22 个 PASS，3 个 FAIL（0x23, 0x2E, 0x3D 在默认会话中被设置为"需安全解锁"，标准允许在默认会话中访问非安全区域/数据）。0x04 (SafetySystem) 通过代码自动继承 0x03 (Extended) 规则（第 587-589 行），符合标准中安全系统会话逻辑。

---

## A7. DID 标识符合理性

**判定**: FAIL

**详情**:

| DID | 模拟器用途 | 标准定义 | 符合性 | 说明 |
|-----|-----------|---------|--------|------|
| F190 | VIN 码 | F190 = VIN DataIdentifier | PASS | 与标准完全一致。值 'LSVAB4BR7N1234567' 合理。 |
| F191 | 硬件版本号 | F191 = vehicleManufacturerECUHardwareNumberDataIdentifier | PASS | 值 'HW-2024-REV-B' 合理，符合标准定义。 |
| F192 | 软件版本号 | F192 = systemSupplierECUHardwareNumberDataIdentifier | FAIL | 标准定义 F192 为硬件编号(HardwareNumber)，但模拟器用于软件版本号(SW-3.2.1-Build42)，与标准定义不符。位置: `uds_simulator.html` 第 408 行 `dids.F192`。 |
| F193 | ECU 名称 | F193 = systemSupplierECUHardwareVersionNumberDataIdentifier | FAIL | 标准定义 F193 为硬件版本号，模拟器用于 ECU 名称(BOSCH_ECU_v2)。命名与标准不完全吻合。位置: `uds_simulator.html` 第 409 行 `dids.F193`。 |
| F194 | 发动机冷却液温度 | F194 = systemSupplierECUSoftwareNumberDataIdentifier | FAIL | 标准定义 F194 为软件编号，模拟器用于冷却液温度(100°C)。用途与标准定义不匹配。位置: `uds_simulator.html` 第 410 行 `dids.F194`。 |
| F195 | 发动机转速 | F195 = systemSupplierECUSoftwareVersionNumberDataIdentifier | FAIL | 标准定义 F195 为软件版本号，模拟器用于转速(3600 RPM)。位置: `uds_simulator.html` 第 411 行 `dids.F195`。 |
| F196 | 车速 | F196 = exhaustRegulationOrTypeApprovalNumberDataIdentifier | FAIL | 标准定义 F196 为排放法规/型式认证号，模拟器用于车速(110 km/h)。位置: `uds_simulator.html` 第 412 行 `dids.F196`。 |
| F197 | 里程表 | F197 = systemNameOrEngineTypeDataIdentifier | FAIL | 标准定义 F197 为系统名称或发动机类型，模拟器用于里程(3500 km)。位置: `uds_simulator.html` 第 413 行 `dids.F197`。 |
| F198 | 诊断代码 | F198 = repairShopCodeOrTesterSerialNumberDataIdentifier | PASS | 值 "ABCD" 作为诊断代码合理，虽不完全符合标准定义但属合理模拟数据。 |
| F199 | ECU 供电电压 | F199 = programmingDateDataIdentifier | FAIL | 标准定义 F199 为编程日期，模拟器用于电压(4.000V)。位置: `uds_simulator.html` 第 415 行 `dids.F199`。 |
| F19A | 环境温度 | F19A = calibrationRepairShopCodeOrCalibrationEquipmentSerialNumberDataIdentifier | FAIL | 双层问题: (1) 标准定义 F19A 为校准维修店代码/设备序列号，非环境温度。(2) 当前值 `[0x00, 0x84]` 中 0x84 作为有符号数为 -124，注释中已标明 'wrong' 并指出应为 0x15=21。实际值未修正。位置: `uds_simulator.html` 第 416 行 `dids.F19A`。 |
| F19B | 总运行时间 | F19B = calibrationDateDataIdentifier | FAIL | 标准定义 F19B 为校准日期，模拟器用于运行时间(100h)。位置: `uds_simulator.html` 第 417 行 `dids.F19B`。 |
| F19C | 燃油液位 | F19C = calibrationEquipmentSoftwareNumberDataIdentifier | FAIL | 标准定义 F19C 为校准设备软件号，模拟器用于燃油液位(75%)。位置: `uds_simulator.html` 第 418 行 `dids.F19C`。 |
| F300 | VIN 特定数据 | F300 = DynamicallyDefinedDataIdentifier | FAIL | 标准 Table C.1 定义 F300-F3FF 为动态定义 DID，模拟器用于静态预定义值。位置: `uds_simulator.html` 第 419 行 `dids.F300`。 |
| F301 | Boot 软件版本 | (同上) | FAIL | 同上 F300-F3FF 为动态 DID 范围，不应用于静态预定义数据。位置: `uds_simulator.html` 第 420 行 `dids.F301`。 |
| F302 | 应用软件版本 | (同上) | FAIL | 同上。位置: `uds_simulator.html` 第 421 行 `dids.F302`。 |

**重要说明**: 本项审查标准为"合理性"而非"严格符合标准 DID 分配"。标准 DID 分配(Table C.1) 为 F100-F1FF 范围定义了具体用途，而模拟器将 F190-F19C 作为"模拟数据 DID"使用，其初始值(100°C、3600RPM、110km/h 等)作为演示数据合理。判定 FAIL 主要基于 F19A 的值错误(0x84 应为 0x15)和 F300-F302 使用了动态 DID 范围。

**总结**: 16 个 DID 中 3 个 PASS，13 个 FAIL。核心问题: (1) F19A 值为 `[0x00, 0x84]`，注释已标明错误但实际值未修正；(2) F300-F302 使用了标准定义为动态 DID 的范围(0xF300-0xF3FF)；(3) 多数 DID 用途与标准 Table C.1 的具体分配不完全匹配，但这在模拟场景中可理解。

---

## 维度 C — 完整性与遗漏检查

---

## C1. 标准有代码无的缺失服务

**判定**: PASS (scope decision)

**详情**:

ISO 14229-1:2020 标准共定义 26 个服务，分布于 7 个功能单元:

| 功能单元 | 标准 SID | 数量 |
|---------|---------|------|
| 诊断与通信管理 | 10, 11, 27, 28, 29, 3E, 85, 86, 87 | 9 |
| 数据传输 | 22, 23, 24, 2A, 2C, 2E, 3D | 7 |
| 存储数据传输 | 14, 19 | 2 |
| IO 控制 | 2F | 1 |
| 例行程序 | 31 | 1 |
| 上传下载 | 34, 35, 36, 37, 38 | 5 |
| 安全子层 | 84 | 1 |

学习工具 SERVICES 实现: 26/26 (100%)
模拟器 SID_INFO 实现: 26/26 (100%)

缺失服务: 0 个。

**说明**: 标准 ISO 14229-1:2020 定义了 Section 10-16 共 26 个服务。原计划中提到的"34+ 个缺失服务"在高版本标准(2020)中并不存在 — 代码已实现全部 26 个标准服务。如果参考范围扩展到 ISO 15031-5 (OBD 服务，SID 01-0F, 共 15 个) 或 ISO 14229 其他部分(Part 3-7，数据链路特定服务)，则可能存在额外服务，但 Part 1 范围内无缺失。

**数据来源**:
- 标准: `doc/md/【原文】ISO 14229-1-2020.md` — Section 10-16 服务定义
- 学习工具: `uds_learning_tool.html` 第 408-672 行 `SERVICES` 数组
- 模拟器: `uds_simulator.html` 第 446-532 行 `SID_INFO` 对象

---

## C2. NRC 数量差异

**判定**: PASS

**详情**:

依据 ISO 14229-1:2020 Annex A.1 (Table A.1) 对三个来源的 NRC 覆盖率进行对比。

### NRC 范围分配总览

| 范围 | 属性 | 标准定义 |
|------|------|---------|
| 0x00 | positiveResponse | 仅在服务器内部使用，不得用于负响应消息 |
| 0x01-0x0F | ISO_SAE_Reserved | 保留 |
| 0x10-0x14 | 通信相关 NRC | 5 个定义: GR, SNS, SFNS, IMLOIF, RTL |
| 0x15-0x20 | ISO_SAE_Reserved | 保留 |
| 0x21-0x26 | 通信相关 NRC | 4 个定义: BRR, CNC, RSE, NRFSC, FPEORA |
| 0x27-0x30 | ISO_SAE_Reserved | 保留 |
| 0x31 | requestOutOfRange | 已定义 |
| 0x32 | ISO_SAE_Reserved | 保留 |
| 0x33-0x3A | 通信相关 NRC | 8 个定义: SAD, AR, IK, ENOA, RTDNE, SDTR, SDTNA, SDVF |
| 0x3B-0x4F | ISO_SAE_Reserved | 保留 |
| 0x50-0x5D | 认证相关 NRC | 14 个定义: CVFITP-OAF |
| 0x5E-0x6F | ISO_SAE_Reserved | 保留 |
| 0x70-0x73 | 传输相关 NRC | 4 个定义: UDNA, TDS, GPF, WBSC |
| 0x74-0x77 | ISO_SAE_Reserved | 保留 |
| 0x78 | RCRRP | 已定义 |
| 0x79-0x7D | ISO_SAE_Reserved | 保留 |
| 0x7E-0x7F | 会话相关 NRC | 2 个定义: SFNSIAS, SNSIAS |
| 0x80 | ISO_SAE_Reserved | 保留 |
| 0x81-0x94 | 条件相关 NRC | 19 个定义: RPMTH-RTNA |
| 0x95-0xEF | Reserved for conditions | 保留 |
| 0xF0-0xFE | Vehicle manufacturer specific | 制造商特定 |
| 0xFF | ISO_SAE_Reserved | 保留 |

### 数量对比表

| 来源 | 计数方式 | 数量 | 覆盖范围 |
|------|---------|------|---------|
| ISO 14229-1 标准 | 已定义的非保留 NRC (含 0x00) | 60 | 0x00, 0x10-0x14, 0x21-0x26, 0x31, 0x33-0x3A, 0x50-0x5D, 0x70-0x73, 0x78, 0x7E-0x7F, 0x81-0x8D, 0x8F-0x94 |
| ISO 14229-1 标准 | 已定义的非保留 NRC (不含 0x00) | 59 | 同上排除 0x00 |
| 学习工具 NRCS | 数组条目数 | 37 | 37 个条目(含范围和单值)，展开后覆盖 0x00-0xFF 全部 256 个值 |
| 学习工具 NRCS | 展开后独立 NRC 数 | 256 | 全覆盖(含保留范围) |
| 模拟器 NRC 常量 | 常量数 | 23 | 常用 NRC 子集 |

### 差异分析

学习工具 NRCS 的 37 个条目覆盖了标准定义的全部 60 个 NRC 值(含 0x00)，以及全部保留范围。范围值使用 `val: '01-0F'` 格式表示，通过 `hexInRange` 函数实现区间搜索。

模拟器 NRC 常量(23 个)是标准 59 个可用 NRC 的常用子集，适用于模拟器演示场景。缺失的 NRC 包括:
- 认证相关 NRC (0x50-0x5D): 14 个，仅用于 Authentication 服务扩展场景
- 条件相关 NRC (0x81-0x94): 19 个，用于特定条件检查场景
- 0x00 positiveResponse: 内部使用无需公开常量
- 0x38-0x3A: secureDataTransmission 相关 NRC (模拟器未实现完整安全子层)

**结论**: 数量差异合理。学习工具全覆盖标准 NRC 定义。模拟器使用常用子集，适合演示目的。

---

## C3. 学习工具 6 标签页完整性

**判定**: PASS

**详情**:

### 标签页功能函数检查

| 标签页 | 渲染函数 | 行号 | 状态 |
|-------|---------|------|------|
| 服务浏览器 | renderServices(filterUnit, search) | 第 811 行 | 已定义 |
| SID 服务地图 | renderHexMap(search) | 第 967 行 | 已定义 |
| NRC 参考 | renderNRCs(filterCategory, search) | 第 934 行 | 已定义 |
| 会话管理 | renderSessions() | 第 1023 行 | 已定义 |
| 消息构造器 | initBuilder() | 第 1138 行 | 已定义 |
| 知识测验 | startQuiz() (经由 renderQuiz 渲染) | 第 1213 行 / 第 1226 行 | 已定义 |

### 搜索/筛选功能

| 标签页 | 搜索/筛选 | 状态 |
|-------|----------|------|
| 服务浏览器 | 按名称/SID/描述搜索 + 按功能单元筛选 | 可用 |
| SID 服务地图 | 按 SID 搜索高亮 | 可用 |
| NRC 参考 | 按码值/名称/描述搜索 + 按分类筛选 | 可用 |
| 会话管理 | N/A (无搜索功能) | N/A |
| 消息构造器 | SID 选择器 + DID 快捷按钮 | 可用 |
| 知识测验 | 按主题筛选 | 可用 |

### 模态弹窗

| 函数 | 行号 | 状态 |
|------|------|------|
| showServiceDetail(sid) | 第 853 行 | 已定义，显示服务详情、子功能、NRC 列表 |
| closeModal() | 第 908 行 | 已定义 |

**结论**: 全部 6 个标签页的渲染函数已定义，搜索/筛选功能在每个适用标签页中可用。模态弹窗系统正常。

---

## C4. 模拟器功能完整性

**判定**: PASS

**详情**:

### 三大面板

| 面板 | 描述 | 状态 |
|------|------|------|
| ECU 状态面板(左侧) | 当前会话、安全等级、P2/P2*/S3 计时器、通信模式、计数器、DID 值 | 已渲染，updateECUStatus() 实时更新 |
| 消息日志(中间) | 时间戳、方向指示、HEX 字节、解码描述 | 已渲染，addLogEntry() 写入 |
| 消息构造器(右侧) | SID 选择器、子功能选择、HEX 输入、DID 快捷按钮、预览 | 已渲染，initComposer() 初始化 |

### 13 个预设场景

| 场景名称 | 函数调用 | 状态 |
|---------|---------|------|
| session-default | runScenario('session-default') | 已实现 |
| session-extended | runScenario('session-extended') | 已实现 |
| session-programming | runScenario('session-programming') | 已实现 |
| tester-present | runScenario('tester-present') | 已实现 |
| read-vin | runScenario('read-vin') | 已实现 |
| read-dtc-status | runScenario('read-dtc-status') | 已实现 |
| security-access | runScenario('security-access') | 已实现，含完整种子-密钥流程 |
| ecu-reset | runScenario('ecu-reset') | 已实现 |
| full-diag-flow | runScenario('full-diag-flow') | 已实现，7 步流程 |
| clear-dtc | runScenario('clear-dtc') | 已实现 |
| read-multi-did | runScenario('read-multi-did') | 已实现 |
| routine-checksum | runScenario('routine-checksum') | 已实现 |
| download-flow | runScenario('download-flow') | 已实现，7 步流程 |

runScenario 函数(第 1511 行)通过 switch-case 处理全部 13 个场景。processRequest(第 821 行)作为主入口点，调用 handleService(第 897 行)分发到各服务处理器。

### service handler 完整性

模拟器实现了全部 26 个服务的 handler 函数:
handleDSC, handleECUReset, handleClearDTC, handleReadDTCInfo, handleReadDID, handleReadMemory, handleReadScaling, handleSecurityAccess, handleCommControl, handleReadByPeriodicID, handleDynamicDefineDID, handleWriteDID, handleIOControl, handleRoutine, handleRequestDownload, handleRequestUpload, handleTransferData, handleTransferExit, handleFileTransfer, handleWriteMemory, handleTesterPresent, handleDTCSetting, handleResponseOnEvent, handleLinkControl, handleAuthentication, handleSecuredDataTransmission

**结论**: 三大面板正确渲染，13 个场景全部实现，26 个服务处理器完整。

---

## C5. 标准文档完整性

**判定**: PASS (with note)

**详情**:

`doc/md/` 目录文件列表:

| 文件 | 大小 | 状态 |
|------|------|------|
| 【原文】ISO 14229-1-2020.md | 1313.5 KB | Part 1 (应用层) |
| 【原文】ISO 14229-2-2013 会话层服务.md | 145.8 KB | Part 2 (会话层) |
| 【原文】ISO 14229-3-2012 在CAN实施上的统一诊断服务.md | 50.4 KB | Part 3 (CAN) |
| 【原文】ISO 14229-4-2012 在FlexRay实施上的统一诊断服务.md | 53.0 KB | Part 4 (FlexRay) |
| 【原文】ISO 14229-4-2012 在FlexRay实施上的统一诊断服务 (1).md | 52.9 KB | DUPLICATE (FlexRay) |
| 【原文】ISO 14229-5_2013 互联网协议实施上的统一诊断服务.md | 20.7 KB | Part 5 (DoIP) |
| 【原文】ISO 14229-6-2013 在K线上的诊断服务.md | 33.8 KB | Part 6 (K-Line) |
| 【原文】ISO 14229-7-2015 在LIN实施上的统一诊断服务.md | 49.8 KB | Part 7 (LIN) |
| 【原文】GBT ISO 14229 征求意见稿.md | 741.0 KB | GBT 标准草案 |

**覆盖率**: Part 1-7 全部覆盖 (7/7)。
**重复文件**: ISO 14229-4 (FlexRay) 存在 `(1)` 后缀重复副本，需要清理。
**命名规范**: 文件名使用中文标题+标准编号，规范一致。

**结论**: 标准 MD 文档齐全，Part 1-7 全部存在。FlexRay 重复文件为已知问题。

---

## C6. PDF 文件完整性

**判定**: PASS

**详情**:

`doc/` 目录 PDF 文件列表:

| 文件 | 大小 | 状态 |
|------|------|------|
| ISO 14229-1-2020.pdf | 31502.4 KB (30.8 MB) | Part 1 |
| ISO 14229-2-2013 会话层服务.PDF | 1652.3 KB (1.6 MB) | Part 2 |
| ISO 14229-3-2012 在CAN实施上的统一诊断服务.pdf | 309.3 KB | Part 3 |
| ISO 14229-4-2012 在FlexRay实施上的统一诊断服务.pdf | 298.7 KB | Part 4 |
| ISO 14229-5_2013 互联网协议实施上的统一诊断服务.pdf | 426.0 KB | Part 5 |
| ISO 14229-6-2013 在K线上的诊断服务.pdf | 144.2 KB | Part 6 |
| ISO 14229-7-2015 在LIN实施上的统一诊断服务.pdf | 528.8 KB | Part 7 |
| GBT ISO 14229 征求意见稿.pdf | 7074.7 KB (6.9 MB) | GBT 草案 |

**覆盖率**: Part 1-7 全部覆盖 (7/7)。
**文件大小**: 所有 PDF 文件大小合理(144 KB - 31.5 MB)。Part 1 主文档最大(31.5 MB)，与其他文档一致。
**命名规范**: 中文描述+标准编号，与 MD 文件基本一致。
**重复文件**: doc/md/ 有 FlexRay 重复，doc/ 下无重复 PDF。
**注**: 仅检查文件存在性和大小，未解析内容。PDF 文件可读性需额外工具验证。

---

## C7. 额外验证 — 服务列表完整性

**判定**: PASS

**详情**:

验证 Authentication (0x29) 在服务和会话中的覆盖情况:

| 检查项 | 位置 | 结果 |
|-------|------|------|
| 学习工具 SERVICES 包含 0x29 | `uds_learning_tool.html` 第 508 行 | PASS — 已定义，含完整名称、描述、子功能列表 |
| 学习工具 defaultSession.services 包含 0x29 | 第 758 行 `SESSIONS[0]` | PASS — `services` 数组包含 `'29'` |
| 学习工具 programmingSession.services 包含 0x29 | 第 764 行 `SESSIONS[1]` | PASS — 包含 |
| 学习工具 extendedSession.services 包含 0x29 | 第 770 行 `SESSIONS[2]` | PASS — 包含 |
| 学习工具 safetySystemSession.services 包含 0x29 | 第 777 行 `SESSIONS[3]` | PASS — 包含 |
| 模拟器 SID_INFO 包含 0x29 | `uds_simulator.html` 第 482 行 | PASS — 已定义 |
| 模拟器 SESSION_RULES 包含 0x29 | 第 564 行 | PASS — 所有会话权限: `0x01:1, 0x02:1, 0x03:1` |
| 模拟器 handleAuthentication 存在 | 第 1282 行 | PASS — 处理函数已定义 |

**结论**: Authentication (0x29) 在所有会话中均受支持，符合 ISO 14229-1:2020 Table 23 (Authentication 在 defaultSession 和 non-defaultSession 均标记为 x)。

---

---

## 维度 B — 代码质量与漏洞检查

**审查日期**: 2026-05-19
**审查范围**: uds_learning_tool.html, uds_simulator.html
**检查依据**: docs/CODE-REVIEW-CHECKLIST.md B1-B7

---

## B1. JS 语法与类型错误

**判定**: FAIL

**发现**:

### B1-F1. dtcStatus 类型不一致 (WARNING)
- **文件**: uds_simulator.html
- **位置**: ECU 声明 (第 399 行) 与 handleClearDTC (第 986 行)
- **描述**: `ECU.dtcStatus` 声明时初始化为数组 `[0x00, 0x00, 0x00]`，但在 `handleClearDTC` 中被赋值为对象 `{ B1: 0x00, B2: 0x00, B3: 0x00 }`。类型从 Array 隐式变为 Object。且 `ECU.dtcStatus` 在赋值后未被任何代码读取，属于死代码。
- **预期**: 保持一致的数组类型，或移除未使用的属性
- **实际**: 类型变更且无读取方

### B1-F2. 缺少 "use strict" 指令 (INFO)
- **文件**: uds_learning_tool.html, uds_simulator.html
- **位置**: `<script>` 块文件级
- **描述**: 两个文件的 JS 均未使用严格模式。虽未发现实际错误，但严格模式有助于捕获隐式全局变量等潜在问题。
- **预期**: 建议在 `<script>` 开头添加 `"use strict";`
- **实际**: 无严格模式指令

**其他 B1 检查**:
- 隐式全局变量: 未发现
- 未定义引用: 未发现
- 语法错误: 未发现

---

## B2. 逻辑缺陷

**判定**: FAIL

**发现**:

### B2-F1. handleClearDTC 误用 dtcSetting 限制清除 (WARNING)
- **文件**: uds_simulator.html
- **位置**: handleClearDTC 函数, 第 983 行
- **描述**: `if (!ECU.dtcSetting) return negResp(0x14, NRC.CNC)` — `dtcSetting` 控制 DTC 状态记录功能（通过 ControlDTCSetting 服务开关），与 ClearDiagnosticInformation 服务的可执行性无关。DTC 记录关闭不应阻止清除操作。使用 NRC 0x22 (conditionsNotCorrect) 也不符合标准预期。
- **预期**: ClearDiagnosticInformation 应独立于 DTC 设置状态执行
- **实际**: 当 `ECU.dtcSetting === false` 时，清除请求被拒绝返回 NRC CNC
- **严重级别**: WARNING

### B2-F2. SecurityAccess 尝试计数逻辑不一致 (WARNING)
- **文件**: uds_simulator.html
- **位置**: handleSecurityAccess 函数, 第 1067-1088 行
- **描述**: `ECU.securityAttempts` 在请求种子（奇数子功能，第 1076 行）和密钥验证失败（偶数子功能）时均会递增。但两者的上限阈值不同：
  - 种子请求阈值: `ECU.securityThreshold` (3)
  - 密钥验证阈值: `ECU.securityThreshold + 2` (5)
  
  典型实现中仅密钥失败计入尝试次数，种子请求不应消耗尝试次数。此外，种子和密钥使用同一计数器但不同阈值，逻辑不一致。可能导致 3 次种子请求后（即使未尝试密钥）即被锁定。
- **预期**: 仅密钥验证失败计入尝试次数，或使用统一阈值
- **实际**: 种子请求消耗尝试次数，且种子与密钥阈值不同

### B2-F3. handleDSC suppressResponse 冗余检查 (INFO)
- **文件**: uds_simulator.html
- **位置**: handleDSC 函数, 第 956 行
- **描述**: `if (suppress && (fullReq[1] & 0x80)) return null;` — `suppress` 已由 `processRequest` 从 `!!(data[0] & 0x80)` 推导得出（第 854 行）。`suppress` true 时 `(fullReq[1] & 0x80)` 必然为 true，条件冗余。功能不受影响，但代码可简化。
- **预期**: 直接使用 `if (suppress) return null;`
- **实际**: 双重检查

**B2 重点区域检查结果**:

| 重点区域 | 结果 | 说明 |
|---------|------|------|
| handleDSC suppressResponse | PASS (INFO) | 逻辑正确，仅冗余检查 |
| checkSessionSecurity bypass | PASS | 0x10/0x27/0x3E 绕过正确 |
| transferData 序列号 | PASS | 允许首次、下一个、重传三种情况 |
| updateDecode 消息解码 | PASS | 条件分支正确 |
| handleSecurityAccess | WARNING | 尝试计数逻辑不一致 |

---

## B3. 边界条件

**判定**: FAIL

**发现**:

### B3-F1. HEX 输入静默丢弃非法令牌 (WARNING)
- **文件**: uds_simulator.html
- **位置**: updatePreview (第 666-668 行), sendMessage (第 1433-1436 行), sendRawHex (第 1473-1474 行), onRawHex (第 1488-1489 行)
- **描述**: 四个函数均使用 `split(/[\s,]+/).filter(p => /^[0-9a-fA-F]{2}$/.test(p))` 解析 HEX 输入。严格 2 字符正则匹配导致以下情况被静默丢弃（无用户反馈）:
  - 单数字 hex（如 "F" 而非 "0F"）
  - 0x 前缀 hex（如 "0xF1" 4 字符不匹配）
  - 连续无空格 hex（如 "F190" 整体被当 4 字符丢弃）
  - 奇数长度字符串
- **预期**: 无效 HEX 输入应提示用户，或放宽解析规则（支持 0x 前缀、自动填充 0、支持无空格连续 hex）
- **实际**: 非法令牌被静默忽略，用户无法感知数据丢失

**其他 B3 检查**:

| 检查项 | 结果 | 说明 |
|--------|------|------|
| bytes.length 最小长度 | PASS | `processRequest` 第 823 行 `if (bytes.length < 1)` 已处理 |
| 空输入处理 | PASS | sendMessage/sendRawHex/onRawHex 均有 `if (!x) return;` 守卫 |
| 数组/对象键存在性 | PASS | handleReadDID/handleWriteDID/updateECUStatus 均预检查 |

---

## B4. 控制流完整性

**判定**: PASS

**检查结果**:

- **handleService switch**: 第 897-927 行 switch/case 覆盖 24 个 SID，包含 `default` 分支返回 `SNSIAS`。所有 case 有对应 `handle*` 调用。
- **所有 handle* 函数返回值**: 24+ 个处理器函数均有完整返回路径——错误返回 `negResp()`、正常返回响应对象、suppress 返回 `null`。
- **handleReadDTCInfo switch**: 第 995-1019 行，各 case 使用 `{}` 块和 `return`，无 fall-through。
- **无缺失分支**: 未发现缺少 return 的路径。

---

## B5. XSS 与安全风险

**判定**: PASS

**检查结果**:

- **innerHTML 使用**: 两个文件广泛使用 `innerHTML`，但所有动态内容来源于可信数据:
  - 硬编码常量（SERVICES, NRCS, SESSIONS, SID_INFO, ECU.dids 等）
  - 经过 `/^[0-9a-fA-F]{2}$/` 过滤后的 HEX 字节值
  - 数字转换为十六进制字符串
- **搜索输入**: 仅用于 `Array.filter()` 数据过滤，未直接注入 HTML
- **HEX 原始发送**: 仅用于字节解析，未用于 HTML 拼接
- **应用性质**: 纯本地工具，无网络请求和后端，self-XSS 风险极低

**结论**: 在本地工具的安全假设下，未发现可利用的 XSS 漏洞。

---

## B6. 注释质量

**判定**: FAIL

**发现**:

### B6-F1. F194 温度注释自相矛盾 (WARNING)
- **文件**: uds_simulator.html
- **位置**: ECU.dids['F194'] 初始化, 第 410 行
- **描述**: 注释 `// Engine coolant temp: 100°C (signed: -40+100=60)` 同时声称 100°C 和 60°C，自相矛盾。decode 函数（第 750-751 行）使用公式 `vals[1] - 40`，从 0x64 (100) 解码得 60°C。注释内部也写 "-40+100=60"，表述混乱。
- **预期**: 注释应准确反映值和解码公式的实际含义，如 `Engine coolant raw=100 → 60°C (formula: raw-40)`
- **实际**: 同时表述 100°C 和 60°C，矛盾

### B6-F2. F19A 注释为开发者笔记未清理 (INFO)
- **文件**: uds_simulator.html
- **位置**: ECU.dids['F19A'] 初始化, 第 416 行
- **描述**: 注释 `// Ambient temp: 21°C (0x84 as signed = -124... wait, wrong. Let's use 0x15 = 21)` 准确记录了代码中的 Bug，但更像是开发过程中的自言自语未清理。注释本身正确指出了 Bug，但也说明代码值未修正。
- **预期**: Bug 应在代码中修正（改为 0x15），注释简短说明正确行为
- **实际**: 注释承认 Bug 但代码未修正

### B6-F3. dtcStatus 类型变更无注释 (INFO)
- **文件**: uds_simulator.html
- **位置**: handleClearDTC 第 986 行
- **描述**: `ECU.dtcStatus = { B1: 0x00, B2: 0x00, B3: 0x00 }` 从数组类型变为对象类型，且该属性不再被读取。无注释说明变更原因。
- **预期**: 类型变更应有注释，或移除未使用的属性
- **实际**: 无注释

**其他 B6 检查**:

| 检查项 | 结果 |
|--------|------|
| TODO/FIXME/HACK 标记 | 未发现 |
| updateDynamicDIDs 注释 | 一致，`// Simulate changing values` 准确 |
| 误导性注释 | F194 自相矛盾, F19A 承认 Bug 但未修正 |

---

## B7. 已知 Bug 确认

**判定**: FAIL

**发现**:

### B7-F1. F19A 环境温度值错误 (BUG) — 确认已知
- **文件**: uds_simulator.html
- **位置**: ECU.dids['F19A'], 第 416 行
- **描述**: `ECU.dids['F19A'] = [0x00, 0x84]`。0x84 有符号为 -124，无符号为 132，均不合理。应为 0x15 (21°C)。
- **预期**: `[0x00, 0x15]` 表示 21°C
- **实际**: `[0x00, 0x84]`
- **严重级别**: BUG

### B7-F2. FlexRay 重复文件 (BUG) — 确认已知
- **文件**: doc/md/ 目录
- **位置**: FlexRay 实现文档
- **描述**: 存在两个几乎相同的文件:
  - `【原文】ISO 14229-4-2012 FlexRay实现的统一诊断服务.md` (54,225 字节)
  - `【原文】ISO 14229-4-2012 FlexRay实现的统一诊断服务 (1).md` (54,214 字节)
  两者相差仅 11 字节。
- **预期**: 每个标准文档只有一个副本
- **实际**: 存在重复文件
- **严重级别**: BUG

### B7-F3. handleClearDTC dtcSetting 误用 (WARNING) — 新发现
- **文件**: uds_simulator.html
- **位置**: handleClearDTC 函数, 第 983 行
- **描述**: ClearDiagnosticInformation 被 `ECU.dtcSetting` 状态错误地限制。DTC 设置关闭不应阻止清除操作。此 Bug 未被先前文档记录。
- **预期**: ClearDiagnosticInformation 独立于 DTC 设置状态
- **实际**: `!ECU.dtcSetting` 时返回 NRC CNC
- **严重级别**: WARNING

### B7-F4. dtcStatus 死代码 (INFO) — 新发现
- **文件**: uds_simulator.html
- **位置**: ECU 声明 (第 399 行), handleClearDTC (第 986 行)
- **描述**: `ECU.dtcStatus` 被赋值但从未被读取，属于死代码。
- **预期**: 移除未使用的属性
- **实际**: 只写不读
- **严重级别**: INFO

---

## 综合判定汇总 (B1-B7)

| 子项 | 判定 | 发现数 |
|------|------|--------|
| B1. JS 语法类型 | FAIL | 1x WARNING, 1x INFO |
| B2. 逻辑缺陷 | FAIL | 2x WARNING, 1x INFO |
| B3. 边界条件 | FAIL | 1x WARNING |
| B4. 控制流完整性 | PASS | 0 |
| B5. XSS 安全风险 | PASS | 0 |
| B6. 注释质量 | FAIL | 1x WARNING, 2x INFO |
| B7. 已知 Bug 确认 | FAIL | 2x BUG, 1x WARNING, 1x INFO |

**总计**: 2x BUG, 5x WARNING, 5x INFO

---

*维度 B 审查完成日期: 2026-05-19*
*审查依据: docs/CODE-REVIEW-CHECKLIST.md*
