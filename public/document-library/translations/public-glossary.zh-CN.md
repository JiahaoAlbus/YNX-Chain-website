# YNX 公开术语表

| 元数据 | 值 |
| --- | --- |
| 版本 | 1.0.0-candidate |
| 生效日期 | 2026-07-22 |
| 证据来源提交 | `719e1018267ed5a53e6fae5211c5fd8a1503c35c` |
| 产品发布状态 | YNX Testnet 文档候选版本 |
| 最近审阅 | 2026-07-22 |
| 替代版本 | 无 |

| 术语 | 定义 |
| --- | --- |
| YNX Chain | 处于测试网工程阶段的 Web4 Layer-1 生态。 |
| YNX | 在不存在歧义时，作为 YNX Chain 的简称。 |
| YNX Web4 | 由 YNX Chain 驱动的应用生态。 |
| YNXWeb4 | 紧凑形式的别名；编辑正文优先使用 YNX Web4。 |
| Web4 | YNX 的产品术语，指用户控制的账户、经授权的应用、可验证执行、与证据关联的自动化及明确的人工批准；不声称它是已被采用的互联网标准。 |
| YNXT | YNX Testnet 的原生测试网资产。不声称具有货币价值或保证流动性。 |
| YNX Testnet | 使用 EVM 链 ID 6423 和 Comet/Cosmos 链 ID `ynx_6423-1` 的测试网络。 |
| EVM 链 ID | 向 EVM 兼容接口提供的数字形式防重放及网络标识符；YNX Testnet 使用 6423（`0x1917`）。 |
| Comet/Cosmos 链 ID | 共识网络标识符；YNX Testnet 使用 `ynx_6423-1`。 |
| 已接受基线（Accepted baseline） | 中央发布授权方已接受的组件或源码；与所有者的候选版本分开。 |
| 候选版本（Candidate） | 提议或本地实现的状态，尚未通过全部集成与发布关卡。 |
| 影子候选版本（Shadow candidate） | 可以比较行为、但不投票也不改变权威状态的代码。 |
| 测试网（Testnet） | 用于测试的网络；不代表主网、生产价值或投资证据。 |
| 主网（Mainnet） | 经过单独批准的生产网络。不意味着当前已上线主网。 |
| implementedLocal | 声称的行为存在于标明提交的源码中。 |
| testedLocal | 与行为直接相关的本地测试在标明源码上通过。 |
| installedLocal | 精确的软件包已在指定目标上安装并冷启动。 |
| integratedCentral | 已接受的组件被纳入中央发布分支。 |
| deployedStaging | 精确发布版本已部署到预发布环境。 |
| deployedPublic | 精确发布版本可从独立位置通过公开端点访问。 |
| downloadHosted | 精确构建产物托管在不可变 URL，附有摘要和字节数。 |
| productionSigned | 精确构建产物带有所有者批准的生产签名。 |
| storeReleased | 精确构建产物由指定商店公开分发。 |
| 权威状态（Authoritative state） | 由规定的授权主体确立的状态，例如已提交链状态或已接受的钱包批准。 |
| 派生数据（Derived data） | 基于已注明来源的计算或索引；不会自动具有权威性。 |
| 第三方数据（Third-party data） | 按服务商的范围、条款和时效提供的数据；不能在该范围之外替代 YNX 的权威信息。 |
| AppHash | 对 YNX ABCI 应用状态的确定性承诺。 |
| StreamBFT | 默认禁用的 YNX 影子共识候选方案；不声称公开网络运行它。 |
| 局部费用市场（Local fee market） | 针对受限资源或通道容量的候选定价领域；不是已启用的公开费用政策。 |
| 销毁（Burn） | 不可逆地减少供应量；绝不是营收。 |
| 回购（Buyback） | Treasury 购买；除非之后发生单独、可验证的销毁，否则不等于销毁。 |
| 营收（Revenue） | 根据已披露政策取得的收入对价；不包括用户本金、销毁和无依据估算。 |
| 稳定币（Stablecoin） | 在发行方、储备和赎回框架下，旨在跟踪某个参考价值的资产。YNXT 不是稳定币。 |
| 原生发行资产（Canonical asset） | 在其来源链上，由明确授权主体发行的资产。 |
| 映射资产（Represented asset） | 跨链或包装形式的资产表示，具有额外的跨链桥、托管和赎回风险。 |
| 储备证明（Proof of reserves） | 关于纳入范围的储备资产的证据；缺少负债和控制权证据时，不构成完整偿付能力证明。 |
| 偿付能力证明（Proof of solvency） | 在限定范围内提供资产减负债的证据，并包含控制权、估值、例外和独立审阅。目前尚未确立 YNX 具备该证明。 |
| 策略授权（Strategy mandate） | 由用户签名、范围受限的策略权限，包含限额、到期、nonce 域、撤销和退出。 |
| Safety Module | 候选损失保障池设计；当前尚未实现 YNX 模块。 |
| 运营者控制的证据（Operator-controlled evidence） | 项目运营者采集的证据；有用，但不是独立公开观察视角。 |
| 独立公开证据（Independent public evidence） | 从独立的公开观察位置取得，并绑定精确发布身份的证据。 |
| 未知结果（Unknown outcome） | 无法权威确定的操作结果；不得显示为成功，也不得盲目重试。 |

## 变更记录

- 1.0.0-candidate（2026-07-22）：确立规范公开定义，以及发布和经济授权术语。
