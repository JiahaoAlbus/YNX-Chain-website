# YNX Fable5 生态上线对照审计（2026-08-08）

## 验收基准与结论

唯一验收基准：`/Users/huangjiahao/Downloads/YNX_Chain_Fable5_Coordinated_Ultimate_Goal_Prompts.md`。

本审计区分四类证据：源码实现、可重复测试、中央集成、公开运行/安装。一个网页返回 HTTP 200 只证明入口存在，不证明产品功能完成。一个安装包能冷启动一次，也不证明二次启动后仍能恢复会话、连接共享 Testnet 并继续使用。

截至 2026-08-08，官网发布登记表含 26 个生态产品，其中 23 个登记了公开网页、11 个登记为中央接受、8 个登记了官网托管安装包。Search 与 Calendar 已在本次审计中补入真实公共入口。**目前没有一个产品具有足以证明其完整满足 Fable5 通用宪章和各自专属功能表的全套证据。** 因此所有产品继续处于测试网预览、候选或未完成状态，不得把“页面上线”表述为“产品完成”。

## 逐产品对照

| Fable5 | 产品 | 当前公开/交付证据 | 对照结论 | 首要差距 |
|---|---|---|---|---|
| 02 | Wallet/Auth | 官网 Android 测试签名包；中央登记为接受；当前官网制品首次/二次冷启动通过，账户与 `ynx_6423-1` 绑定保持 | 部分符合 | 生产签名/商店、iOS/桌面当前版本、生产托管与外部审计未闭环 |
| 03 | Social | 公开 API、Android 测试签名包；当前官网制品首次/二次冷启动通过，Wallet 登录入口可用 | 部分符合 | iOS 安装、生产签名、协同删除/保留策略与授权后完整会话恢复未闭环 |
| 04 | Pay | 公开网页和鉴权 API | 部分符合 | Android/iOS 当前版本、真实稳定结算/提供方、生产签名与全支付闭环未完成 |
| 05 | Merchant Console | 公开多人 Web 控制台 | 部分符合 | 生产收单/合规、耐久遥测、完整租户压力与恢复证据未完成 |
| 06 | Card | 公开沙盒 UI | 不足 | 未发卡、无卡组织/银行关系、无真实生产交易；只能作为沙盒 |
| 07 | Exchange | 公开只读交易终端、Android 测试包；当前官网制品首次/二次冷启动均读取真实公共撮合记录，第二次启动后 Wallet 精确绑定成功 | 部分符合 | 受保护下单/撤单/提现仍 fail-closed；保证金、永续、偿付证明等未实现 |
| 08 | Quant | 公开研究工作区 | 部分符合 | 仅研究/模拟；自动实盘、资金执行、策略完整生命周期和生产签名未完成 |
| 09 | Shop | 公开 Web/PWA、Android 测试包；当前官网制品首次/二次冷启动均从公共 Testnet 服务读取 3 个明确标注的演示商品 | 部分符合 | 中央 Wallet 源码合并、税务/物流提供方、生产签名/商店与授权后会话恢复未闭环 |
| 10 | Seller Console | 公开 Web | 部分符合 | 真实履约/承运商、生产商户权限与全订单售后闭环未完成 |
| 11 | Developer/AI Build | 公开 Web、macOS/Windows 预览包 | 当前不可验收 | 用户已复现不能连链、不能编译、AI Build Unavailable；按指令最后修复 |
| 12 | Explorer | 公开 Web；链与索引同步、实时区块/交易、转账 From→To、交易快速检索、EN/ZH、已索引参与账户榜 | 部分符合 | 账户榜仅是“已索引参与账户”而非全账本富豪榜；长期外部容量、更多语言、成熟可视密度仍需闭环 |
| 13 | Monitor | 公开状态页 | 部分符合 | 多租户告警、长期指标、外部观察点和恢复演练未完整证明 |
| 14 | AI | 公开 Assistant 网页 | 部分符合 | 模型/提供方不可用路径仍存在；受控执行、配额、审计和降级需端到端验证 |
| 15 | Trust Center | 官网 Linux amd64 测试包；精确制品两次独立冷启动、健康/透明度接口通过；无公开产品 UI | 部分符合 | 未中央接受，独立包未配置中央 Wallet/AI，无生产签名、公开产品 UI 与托管服务闭环 |
| 16 | Resource Market | 公开 Web；中央登记接受 | 部分符合 | 真实供需/结算、跨租户隔离、计费账本和持续容量证据仍需闭环 |
| 20 | Cloud | 公开 Web；中央登记接受 | 部分符合 | 对象/文件完整操作、配额计费、恢复、分享权限与多端客户端未全部证明 |
| 22 | Browser | 官网 macOS 预览包；官网精确制品首次/二次启动均保持进程并完成 WebKit 主页面加载 | 部分符合 | 无独立公开服务、正式签名/公证；当前制品 Wallet 正向回调和 Windows/Linux/移动端仍未闭环 |
| 23 | Search | 公开授权来源检索、来源链接/新鲜度/索引收据；7 个项目自有来源已于 2026-08-08 重建 | 部分符合 | 只覆盖登记授权来源；外部搜索、中央 Wallet/Trust/AI 集成和定时刷新仍未闭环 |
| 24 | Finance | 公开 Web、Android 测试包、中央接受；当前官网制品首次/二次冷启动通过，第二次启动后 Wallet 精确绑定成功 | 部分符合 | Exchange/DEX/Quant/Economics 只读源合同未接受；完整历史、iOS、授权后恢复演练未完成 |
| 25 | Mail | 无公开产品 | 不足 | 真实收发、线程、附件、搜索、Calendar 邀请/通知、多人和公开部署未完成 |
| 27 | DEX | 公开只读 Web | 部分符合 | 交换/流动性受保护操作、真实资金与路由、风控、Wallet/Indexer 集成未闭环 |
| 32 | Music | 公开 Web；中央登记接受 | 部分符合 | 上传/播放/版权/创作者结算、离线与多端完整产品证据不足 |
| 33 | Video | 公开 Web；中央登记接受 | 部分符合 | 上传转码/播放/频道/版权/结算和容量恢复证据不足 |
| 34 | Creator Studio | 公开 Web；中央登记接受 | 部分符合 | 内容全生命周期、分析/收益、Music/Video 联动与权限边界未完整证明 |
| 35 | Docs | 公开 Web；中央登记接受 | 部分符合 | 协作编辑、版本/权限、搜索、导入导出和多端产品体验未完整证明 |
| 36 | Calendar | 当前源码公共 Testnet Web；Canonical Wallet 两用户邀请/接受/修改/取消、DST 重复事件、服务重启恢复、100/100 认证并发读取 | 部分符合 | Mail/AI/Data Fabric、独立 staging、自定义域名、当前源码原生安装包与生产签名仍未完成 |

## 公共运行与多人并发复查

- 23 个已公开运行入口均通过真实 Caddy HTTPS 域名、证书和反向代理完成 100 次读取、并发 20 的服务器侧复验，结果全部为 `100/100 HTTP 200`。范围包含 Wallet、Social、Pay、Pay App、Merchant、Card、Exchange、Quant、Shop、Seller、Explorer、Monitor、AI、Resource、Music、Video、Cloud、Docs、Search、Finance、Calendar、DEX 与 Bridge。
- 从当前 Codex 主机直接创建大量独立 TLS 连接时，多个域名出现 1%–14% 建连超时；失败请求未取得远端 IP，测试通道显示中间代理 `198.18.0.73`，TLS 时间由约 2 秒升至 8 秒以上。同期服务器 443 监听队列为 0，Caddy 未重启，CPU/内存充足。本轮将其分类为测试端代理/连接建立限制，而不是已证明的服务过载；仍需独立外部压测点才能作公网容量承诺。
- Quant 公共研究运行已使用实际 Exchange 匹配数据完成一次透明移动平均线样本外回测，返回数据/策略/特征哈希、费用/滑点、走步窗口、敏感性、状态与审计摘要；公共能力仍明确为 `research=true`、`paper=false`、`testnetExecution=false`、`liveFunds=false`。
- DEX 的 `latestBlock=0` 表示尚无已确认 DEX 合约事件，并非链停止。公共 UI 与接口明确保持只读；Chain 6423 尚不能执行通用 EVM 合约，因此交换与流动性动作不可用。
- Bridge 的公共监视窗口与协调器可用，但健康状态诚实为 `degraded`：无已验证目标合约、无可执行路由、外部提交关闭。它不能计作真实跨链桥交易完成。

## 不在当前 26 产品登记表但仍必须完成的 Fable5 工作流

- 01 Chain Core / StreamBFT
- 17 YNXT Economics / Treasury / Stablecoin
- 18 Whitepaper / Compliance / Brand
- 19 Oracle & Market Data
- 21 Bridge & Interoperability
- 26 Data Fabric & Billing Ledger
- 28 Website / SEO / Product Micro-sites
- 29 Integration / Founder Control
- 30 Security / SRE / Release Platform
- 31 Governance & Protocol Control

这些是生态产品能否被判定完成的依赖，不可因已有产品网页而跳过。

## 二次启动专项结论

- 当前公开登记的 8 个托管安装包为 Wallet、Social、Exchange、Shop、Developer、Trust、Browser、Finance。
- 2026-08-08 使用官网发布登记中的精确 SHA-256 制品在 Android 16 `arm64-v8a` 模拟器完成实装复验：Wallet `68d7cec9…b746`、Social `ea596daf…dcba`、Exchange `9ac502ce…ae3`、Shop `a7466e02…2c72d`、Finance `c795f8b5…60dc1` 均通过首次冷启动、强制停止和第二次冷启动，未记录对应 App 的 FATAL/ANR/React Native 网络失败。
- Wallet 第二次启动保持同一 Testnet 账户并显示 `ynx_6423-1`；Social 第二次启动保持中央 Wallet 登录入口；Shop 两次均读取公共 Testnet 的 3 个明确演示商品；Exchange 两次均读取公共撮合记录。Finance 与 Exchange 在第二次启动后发起 Wallet 登录，中央 Wallet 正确显示 App/bundle 身份、链 `ynx_6423-1`、同一账户、精确权限和用途，证明深链与共享 Wallet Gateway 仍可到达。
- 上述结果证明这 5 个 Android 制品不存在“一律第二次打不开/不能到达 Wallet”的共性缺陷，但没有证明用户授权后的长期会话恢复、全部写操作、iOS/桌面或生产签名。
- Browser 官网精确 ZIP `939c5045…4448`（138,203 bytes）已在 arm64 macOS 解包并完成两次独立冷启动；两次均保持原生进程，第二次日志记录 WebKit 主文档/页面加载完成。制品 ad-hoc 签名磁盘校验有效，但 Gatekeeper 按公开声明拒绝，尚未证明共享 Testnet Wallet 正向回调、正式公证或跨平台当前制品。
- Trust 官网精确 Linux amd64 包 `48c1ee8e…a6eb85`（4,526,591 bytes）已通过 Docker amd64 模拟完成两次独立冷启动；两次均返回相同构建 `4d40557229b4`、状态格式 2、tamper-evident persistence 边界和公开透明度统计。独立包未嵌入中央 Wallet/AI 配置，且无生产签名或公开产品 UI。
- Developer 按用户指令最后处理。
- 因而用户报告仍作为需要逐制品排查的发布问题保留，但不再笼统归因于已通过本轮复验的 5 个 Android APK。所有可下载产品仍必须通过同一套二次启动门禁后才能升级发布等级。

## 统一修复门禁

每个产品必须逐项记录：源提交、制品哈希/字节数/签名类型、安装平台、首次冷启动、退出并杀死进程、第二次冷启动、端点解析、Wallet 会话恢复或明确重新授权、链 ID 6423 与实时高度、核心读写操作、两用户隔离、并发容量、服务重启后的持久化、备份恢复、公开 URL。任一项缺证据即保持未完成状态。
