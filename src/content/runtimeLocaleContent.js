export const RUNTIME_LOCALES = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar", "id"];

const row = (network, validators, ecosystem, developer, readiness, records, utility) => ({ network, validators, ecosystem, developer, readiness, records, utility });

const data = {
  en: row(
    ["Live network", "Current public testnet state", "Updated", "Block height", "EVM chain", "Transactions", "Validator roles", "Native asset", "Release", "Growing now", "Live RPC height", "Expected 0x1917", "Persisted testnet records", "Expected four public roles", "Gas and resource asset"],
    ["Four-region topology", "Inspectable validator roles", "Each role reports its own current height. Availability does not prove height convergence or public BFT voting.", "Location", "Role", "Height", "Status", "Current", "behind", "Pending", "Validator data is unavailable. Try again shortly.", "Connecting to validator API"],
    ["Full-stack ecosystem", "One chain, connected operational surfaces", "Runtime, economics, services, evidence and integration tools share the same YNX Testnet identity.", "L1 Runtime", "Persistent chain state, RPC, EVM RPC, transactions, receipts, logs, balances and four-role replication.", "YNXT Economy", "Native gas and resource asset; no hidden direct-freeze hook is claimed.", "Indexer + Explorer", "Live blocks, transactions, accounts, validators, search and network evidence.", "AI Gateway", "Policy-bounded proposals, approval and audit.", "Pay API", "Merchant intents, invoices, signed webhooks, refunds and event records.", "Trust + Chain Law", "Evidence tracing, advisory labels, appeals and corrections.", "Resource Market", "Policy-bound quotes, delegation, settlement and analytics.", "Developer SDKs", "JavaScript and Python clients verified against public REST and EVM endpoints.", "YNX-native Identity", "ynx1 is the first-party identity; 0x remains inside the EVM compatibility adapter.", "Exchange Integration Candidate", "Verified Testnet RPC flows. No exchange listing is claimed."],
    ["Developer surface", "Connect to real endpoints.", "Chain identity and status come from the public Testnet. SDK checks do not submit transactions.", "Open developer docs", "Copy", "Copied", "Copy failed"],
    ["Readiness without overclaiming", "Current state and target state stay separate.", "Verified now", "Still required", "No fake claims", "This project does not claim Mainnet launch, exchange listing, issuer support, wallet default support or third-party partnerships.", "Read full boundaries", ["Public YNX Testnet on chain ID 6423", "Four remotely deployed validator roles", "Live RPC, EVM, Faucet, Indexer and Explorer", "YNX-native ynx1 identity with an isolated EVM adapter", "Signed transaction and exchange-candidate RPC flows", "AI, Pay, Trust, Resource and governance surfaces", "Checksummed release, backup and rollback tools"], ["YNX wallet production release and custody handover", "Public CometBFT voting and cutover proof", "Independent public-vantage evidence", "External security audit and Mainnet legal review", "External wallet, exchange, issuer and bridge approvals"], "Start building", "Public entry points"],
    ["Latest network records", "Latest blocks", "From the current 6423 Indexer", "All blocks", "Block data is unavailable.", "Indexed transactions", "Most recently indexed records", "All transactions", "Transaction", "Indexed transactions are unavailable."],
    ["Loading the requested YNX surface…", "DApp route moved", "This software now lives under /dapp.", "Redirecting to the canonical DApp address.", "Continue to DApps", "No EIP-1193 wallet detected.", "now"]
  ),
  "zh-CN": row(
    ["实时网络", "当前公开测试网状态", "更新于", "区块高度", "EVM 链", "交易数", "验证者角色", "原生资产", "版本", "正在增长", "实时 RPC 高度", "预期 0x1917", "持久化测试网记录", "预期四个公开角色", "Gas 与资源资产"],
    ["四区域拓扑", "可检查的验证者角色", "每个角色独立报告当前高度；角色可用不代表高度收敛或公开 BFT 投票完成。", "位置", "角色", "高度", "状态", "当前", "个区块落后", "等待中", "验证者数据暂不可用，请稍后重试。", "正在连接验证者 API"],
    ["全栈生态", "一条链，连接全部运营界面", "运行时、经济系统、服务、证据与集成工具共享同一个 YNX 测试网身份。", "L1 运行时", "持久化链状态、RPC、EVM RPC、交易、收据、日志、余额与四角色复制。", "YNXT 经济系统", "原生 Gas 与资源资产；不宣称存在隐藏的直接冻结入口。", "索引器 + Explorer", "实时区块、交易、账户、验证者、搜索与网络证据。", "AI 网关", "受策略约束的提案、批准与审计。", "支付 API", "商户意图、发票、签名 Webhook、退款与事件记录。", "信任 + 链上规则", "证据追踪、提示标签、申诉与更正。", "资源市场", "受策略约束的报价、委托、结算与分析。", "开发者 SDK", "针对公开 REST 与 EVM 端点验证的 JavaScript 和 Python 客户端。", "YNX 原生身份", "ynx1 是第一方身份；0x 仅限于 EVM 兼容适配器。", "交易所集成候选", "已验证的测试网 RPC 流程不代表交易所上币。"],
    ["开发者界面", "连接真实端点。", "链身份与状态来自公开测试网；SDK 检查不会提交交易。", "打开开发者文档", "复制", "已复制", "复制失败"],
    ["不夸大的就绪度", "始终区分当前状态与目标状态。", "当前已验证", "仍然需要", "不作虚假声明", "本项目不宣称主网上线、交易所上币、发行方支持、钱包默认支持或第三方合作关系。", "查看完整边界", ["链 ID 6423 的公开 YNX 测试网", "四个远程部署的验证者角色", "实时 RPC、EVM、Faucet、Indexer 与 Explorer", "YNX 原生 ynx1 身份与隔离 EVM 适配器", "已签名交易与交易所候选 RPC 流程", "AI、Pay、Trust、资源与治理界面", "带校验和的发布、备份与回滚工具"], ["YNX 钱包生产发布与保管移交", "公开 CometBFT 投票与切换证明", "独立公网观察点证据", "外部安全审计与主网法律审查", "外部钱包、交易所、发行方与跨链桥批准"], "开始构建", "公开入口"],
    ["最新网络记录", "实时区块", "来自当前 6423 Indexer", "全部区块", "区块数据暂不可用。", "已索引交易", "最近可验证的交易记录", "全部交易", "交易", "交易索引暂不可用。"],
    ["正在加载请求的 YNX 界面…", "DApp 路由已迁移", "此软件现位于 /dapp。", "正在跳转到规范 DApp 地址。", "继续前往 DApp", "未检测到 EIP-1193 钱包。", "现在"]
  ),
  "zh-TW": row(
    ["即時網路", "目前公開測試網狀態", "更新於", "區塊高度", "EVM 鏈", "交易數", "驗證者角色", "原生資產", "版本", "持續增長", "即時 RPC 高度", "預期 0x1917", "持久化測試網記錄", "預期四個公開角色", "Gas 與資源資產"],
    ["四區域拓撲", "可檢查的驗證者角色", "每個角色獨立回報高度；可用不代表高度收斂或公開 BFT 投票完成。", "位置", "角色", "高度", "狀態", "目前", "個區塊落後", "等待中", "驗證者資料暫不可用，請稍後重試。", "正在連接驗證者 API"],
    ["全棧生態", "一條鏈，連接所有營運介面", "執行環境、經濟、服務、證據與整合工具共用 YNX 測試網身分。", "L1 執行環境", "持久化鏈狀態、RPC、EVM RPC、交易、收據、日誌、餘額與四角色複製。", "YNXT 經濟", "原生 Gas 與資源資產；不宣稱隱藏的直接凍結入口。", "Indexer + Explorer", "即時區塊、交易、帳戶、驗證者、搜尋與網路證據。", "AI 閘道", "受策略約束的提案、核准與稽核。", "支付 API", "商戶意圖、發票、簽署 Webhook、退款與事件。", "信任 + 鏈上規則", "證據追蹤、提示、申訴與更正。", "資源市場", "受策略約束的報價、委託、結算與分析。", "開發者 SDK", "對公開 REST 與 EVM 端點驗證的客戶端。", "YNX 原生身分", "ynx1 是第一方身分；0x 僅限 EVM 相容適配器。", "交易所整合候選", "已驗證測試網 RPC 不代表上架交易所。"],
    ["開發者介面", "連接真實端點。", "鏈身分與狀態來自公開測試網；SDK 檢查不提交交易。", "開啟開發者文件", "複製", "已複製", "複製失敗"],
    ["不誇大的就緒度", "目前狀態與目標狀態保持分離。", "目前已驗證", "仍然需要", "不作虛假聲明", "本專案不宣稱主網、交易所上架、發行方支援、錢包預設支援或第三方合作。", "查看完整邊界", ["鏈 ID 6423 的公開 YNX 測試網", "四個遠端驗證者角色", "即時 RPC、EVM、Faucet、Indexer 與 Explorer", "YNX 原生 ynx1 與隔離 EVM 適配器", "已簽署交易與交易所候選 RPC 流程", "AI、Pay、Trust、資源與治理介面", "具校驗碼的發布、備份與回滾工具"], ["YNX 錢包正式發布與保管移交", "公開 CometBFT 投票與切換證明", "獨立公開觀測證據", "外部安全稽核與主網法律審查", "外部錢包、交易所、發行方與跨鏈橋核准"], "開始建置", "公開入口"],
    ["最新網路記錄", "即時區塊", "來自目前 6423 Indexer", "全部區塊", "區塊資料暫不可用。", "已索引交易", "最近可驗證的交易", "全部交易", "交易", "交易索引暫不可用。"],
    ["正在載入要求的 YNX 介面…", "DApp 路由已遷移", "此軟體現位於 /dapp。", "正在前往規範 DApp 位址。", "繼續前往 DApp", "未偵測到 EIP-1193 錢包。", "現在"]
  ),
};

const fixed = {
  metrics: ["Block height", "EVM chain", "Transactions", "Validator roles", "Native asset", "Release"],
  labels: ["Live RPC height", "Expected 0x1917", "Persisted Testnet records", "Expected four public roles", "Gas and resource asset"],
  productTitles: ["L1 Runtime", "YNXT Economy", "Indexer + Explorer", "AI Gateway", "Pay API", "Trust + Chain Law", "Resource Market", "Developer SDKs", "YNX-native Identity", "Exchange Integration Candidate"],
};

export function buildCompactRuntimeCopy(v) {
  const unavailable = v[16];
  return row(
    [v[0], v[1], v[2], ...fixed.metrics, "Growing", ...fixed.labels],
    ["Topology", v[3], v[4], "Location", "Role", "Height", "Status", "Current", "behind", "Pending", `${unavailable}.`, "Connecting to validator API"],
    [v[5], v[6], "YNX Testnet services share one verified chain identity.", ...fixed.productTitles.flatMap((title) => [title, `${title}: YNX Testnet capability whose status follows direct evidence.`])],
    [v[7], v[8], "Network identity and status come from the public Testnet; checks never submit transactions.", "Open developer docs", "Copy", "Copied", "Copy failed"],
    [v[9], v[9], v[10], v[11], v[12], "No Mainnet, listing, issuer, default-wallet or partnership claim is made.", "Read full boundaries", ["Public YNX Testnet 6423", "Four validator roles", "Live public services", "ynx1 identity and isolated EVM adapter", "Verified Testnet RPC flows", "First-party service surfaces", "Checksummed operational tools"], ["Wallet production release", "Public BFT proof", "Independent public evidence", "External audit and legal review", "External ecosystem approvals"], "Start building", "Public entry points"],
    [v[13], v[14], "Current 6423 Indexer", "All blocks", `${v[16]}.`, v[15], "Most recent verifiable records", "All transactions", "Transaction", `${v[16]}.`],
    ["Loading YNX…", "DApp route moved", "This software is under /dapp.", "Redirecting to the canonical address.", "Continue", "No EIP-1193 wallet detected.", v[17]]
  );
}

export const RUNTIME_COPY = Object.fromEntries(Object.entries(data).map(([locale, value]) => [locale, {
  network: { eyebrow: value.network[0], title: value.network[1], updated: value.network[2], metrics: value.network.slice(3, 9), growing: value.network[9], labels: value.network.slice(10, 15) },
  validators: { eyebrow: value.validators[0], title: value.validators[1], lead: value.validators[2], headers: value.validators.slice(3, 7), current: value.validators[7], behind: value.validators[8], pending: value.validators[9], unavailable: value.validators[10], connecting: value.validators[11] },
  ecosystem: { eyebrow: value.ecosystem[0], title: value.ecosystem[1], lead: value.ecosystem[2], products: Array.from({ length: 10 }, (_, index) => ({ title: value.ecosystem[3 + index * 2], text: value.ecosystem[4 + index * 2] })) },
  developer: { eyebrow: value.developer[0], title: value.developer[1], lead: value.developer[2], action: value.developer[3], copy: value.developer.slice(4, 7) },
  readiness: { eyebrow: value.readiness[0], title: value.readiness[1], verifiedTitle: value.readiness[2], requiredTitle: value.readiness[3], boundaryTitle: value.readiness[4], boundary: value.readiness[5], action: value.readiness[6], verified: value.readiness[7], required: value.readiness[8], resourcesEyebrow: value.readiness[9], resourcesTitle: value.readiness[10] },
  records: { aria: value.records[0], blocks: value.records.slice(1, 5), transactions: value.records.slice(5, 10) },
  utility: { loading: value.utility[0], moved: value.utility.slice(1, 5), noWallet: value.utility[5], now: value.utility[6] },
}]));

export function getRuntimeCopy(locale) { return RUNTIME_COPY[locale] || null; }

export async function loadRuntimeCopy(locale) {
  if (RUNTIME_COPY[locale]) return RUNTIME_COPY[locale];
  const { EXTENDED_RUNTIME_COPY } = await import("./runtimeLocaleContentExtended.js");
  return EXTENDED_RUNTIME_COPY[locale] || null;
}
