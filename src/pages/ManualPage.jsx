import React from "react";
import {
  ArrowUpRight, Blocks, CheckCircle2, CircleAlert, ExternalLink, KeyRound, LifeBuoy,
  Network, Pickaxe, RefreshCw, Search, Server, ShieldCheck, WalletCards
} from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";

const steps = [
  { number: "01", title: "Verify the network", text: "Confirm YNX Testnet, native chain ID 6423, EVM chain ID 0x1917, and a current block before connecting a wallet.", href: "/status", label: "Check status", icon: Network },
  { number: "02", title: "Protect an account", text: "Use ynx1 as the first-party address. Keep the matching 0x form inside EVM-compatible tools, and never paste a mnemonic or private key into a website.", href: "/#address", label: "Convert an address", icon: WalletCards },
  { number: "03", title: "Get test YNXT", text: "Use the Faucet for Testnet only. YNXT on this network has no represented monetary value or guaranteed liquidity.", href: apiConfig.faucetUrl, label: "Open Faucet", icon: CheckCircle2 },
  { number: "04", title: "Verify every result", text: "After a write, preserve the transaction hash and confirm the receipt in Explorer. A timeout is not proof that a transaction failed.", href: apiConfig.explorerUrl, label: "Open Explorer", icon: Search },
];

const chapters = [
  {
    id: "network-facts", eyebrow: "Network facts / 网络事实", title: "Know what the Testnet actually guarantees", icon: Network,
    intro: "Use these values as the pre-flight checklist. Stop if a wallet, RPC, guide, or support message gives different network identity.",
    facts: [["Network", "YNX Testnet"], ["Native chain ID", "6423"], ["EVM chain ID", "0x1917"], ["Native asset", "YNXT"], ["Native transfer fee", "Current Testnet rule: 1 integer YNXT per transaction"], ["Finality", "A finalized block is immutable; block 1 or any historical block cannot receive a new transaction"]],
    checklist: ["Open Status and confirm the RPC and indexer are current.", "Check the destination character by character and confirm ynx1/0x equivalence when needed.", "Treat Mainnet, listing, liquidity, custody, and third-party support as unavailable unless separately evidenced."],
    code: `curl -fsS https://rpc.ynxweb4.com/status\n\ncurl -fsS -X POST https://evm.ynxweb4.com \\\n  -H 'content-type: application/json' \\\n  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'`,
  },
  {
    id: "wallet-security", eyebrow: "Wallet manual / 钱包手册", title: "Create, back up, and use an account safely", icon: KeyRound,
    intro: "The address is public; signing material is not. A screenshot, chat message, support ticket, web form, or log is never an acceptable place for a mnemonic or private key.",
    checklist: ["Create or import the account only in the intended wallet or local signer.", "Record the recovery phrase offline, verify the backup, and keep it separate from the device.", "Unlock only for the intended action; inspect network, recipient, amount, fee, and nonce before signing.", "For shared operations, give each person a separate account and permission boundary; never circulate one private key.", "After use, lock the wallet and verify the resulting hash independently in Explorer."],
    warning: "YNX support never needs your mnemonic, private key, wallet password, one-time code, or signer-vault contents.",
  },
  {
    id: "transfer", eyebrow: "Transfer manual / 转账手册", title: "Send YNXT and prove the receipt", icon: WalletCards,
    intro: "A transfer is accepted into a future block, never inserted into an old block. One block can contain zero, one, or multiple transactions, and one transfer may send any valid balance amount—not one YNXT per block.",
    checklist: ["Confirm the sender balance covers amount plus the current 1 YNXT native fee.", "Read the account nonce immediately before signing; repeated nonces are rejected.", "Sign once and preserve the returned transaction hash.", "If the client times out, search the hash and sender before resubmitting.", "Verify From, To, amount, fee, status, block height, and confirmations in Explorer."],
    facts: [["Block", "An immutable ordered container of transactions"], ["YNXT", "The native Testnet asset used for value and current native fees"], ["Empty block", "Contains no transaction and creates no 1 YNXT reward"], ["Multiple payments", "Supported when valid transactions enter the same future block"]],
  },
  {
    id: "explorer", eyebrow: "Explorer manual / 浏览器手册", title: "Find a transaction, address, or block quickly", icon: Search,
    intro: "Use the global search for an exact transaction hash, ynx1 address, compatible 0x address, or block height. Use Quick find to narrow the live transaction list by hash, address, type, amount, or block.",
    checklist: ["Transaction view: confirm From → To, amount, fee, status, and containing block.", "Address view: review balance, nonce, and inbound/outbound history; Rich list is a balance ranking, not ownership identity.", "Block view: prioritize transaction-bearing blocks; compact empty blocks carry no transfer content.", "If Explorer is catching up, compare indexed height with chain height and wait for alignment before concluding data is absent.", "Switch English/中文 in the Explorer header; the preference is retained locally."],
  },
  {
    id: "node", eyebrow: "Node join manual / 节点加入手册", title: "Prepare a node without exposing validator keys", icon: Server,
    intro: "Public source and an operator-reviewed configuration are prerequisites. A node should run as a dedicated unprivileged service account with persistent storage, bounded ports, monitoring, and backups.",
    checklist: ["Provision a supported 64-bit Linux host with stable time synchronization, SSD persistence, memory headroom, and a fixed public endpoint if peer connectivity is required.", "Verify the source/build identity and configuration before starting; never copy another operator's data directory or signing key.", "Bind administrative and metrics interfaces to localhost or an authenticated private network. Publish only explicitly required peer/RPC routes.", "Start as a non-validator observer, allow initial synchronization, then compare local height/hash with the public RPC.", "Back up configuration and key metadata separately from chain data; rehearse restore on an isolated host.", "Add health, disk, memory, peer, block-lag, and restart-loop alerts before requesting candidate admission."],
    code: `# Public read-only checks; these do not enroll a validator\ncurl -fsS https://rpc.ynxweb4.com/status\ncurl -fsS https://explorer.ynxweb4.com/api/health\n\n# Expected before candidate review\n# - dedicated service identity\n# - persistent data volume\n# - time synchronization\n# - least-privilege firewall\n# - monitored backup and restore rehearsal`,
    warning: "There is currently no one-command permissionless public validator enrollment. Do not send a validator private key to a website or operator.",
  },
  {
    id: "validator", eyebrow: "Validator manual / 验证者手册", title: "Apply, stage, and operate a validator candidate", icon: ShieldCheck,
    intro: "Current public Testnet validators are operator-controlled. Candidate admission requires capacity, identity/contact, key-custody, monitoring, recovery, and governance review; documentation is not automatic approval.",
    checklist: ["Run a healthy observer node first and provide a stable candidate endpoint plus operator contact and incident path.", "Generate the validator key on the target secure host or approved signing boundary; retain offline recovery material and document who can authorize rotation.", "Demonstrate sustained synchronization, peer health, clock accuracy, disk headroom, restart recovery, and alert delivery.", "Stage admission in a maintenance window. Verify the expected validator identity before enabling signing.", "Monitor missed blocks, double-sign risk, lag, peer loss, disk, memory, and service restarts. Fail closed when signer state is uncertain.", "For exit or rotation, coordinate the validator-set change first, stop signing, preserve audit evidence, then archive or destroy old key material under policy."],
    facts: [["Admission", "Reviewed Testnet candidate process; not permissionless today"], ["Key custody", "Operator responsibility; never submitted through the website"], ["Availability", "Multiple users may read public services concurrently; validator signing remains single-authority and serialized"], ["Recovery", "Restore configuration/data first and verify signer state before resuming"]],
  },
  {
    id: "mining", eyebrow: "Mining manual / 挖矿手册", title: "Do not use GPU or ASIC mining on YNX Testnet", icon: Pickaxe,
    intro: "YNX Testnet uses rotating validators/block producers, not proof-of-work mining. There is no supported GPU/ASIC miner and no active automatic one-YNXT-per-block issuance.",
    checklist: ["To participate in block production, follow the validator candidate process—not mining-pool software.", "A block is not one YNXT. It is a container that can be empty or contain multiple transfers.", "An empty block earns no current issuance reward. Under the present rule, a native transaction pays a 1 YNXT fee credited to the validator.", "Do not buy hardware, pay a pool, or install binaries that claim guaranteed YNX mining income."],
    warning: "Any future issuance or incentive change needs an explicit network upgrade and public documentation; this manual does not promise rewards.",
  },
  {
    id: "bridge", eyebrow: "Bridge manual / 跨链桥手册", title: "Separate source-chain proof from external execution", icon: Blocks,
    intro: "The current bridge path can record and co-sign a local coordinator lifecycle from YNX Testnet, but external mint/submission is disabled. Finalized-local is not the same as bridged on an external chain.",
    checklist: ["Verify the YNX source transaction and required confirmations.", "Record the route, asset, source hash, destination, amount, and coordinator transfer ID.", "Verify independent relayer signatures and the local finalization audit trail.", "Check provider and contract capability before claiming external completion.", "When external submission is disabled, report finalized locally / no external submission and do not represent wrapped assets as minted."],
    facts: [["Live route", "YNX Testnet YNXT → external-testnet-unavailable wrapped-YNXT"], ["Confirmations", "Current coordinator route requires 12 source confirmations"], ["External submission", "Disabled"], ["Truthful result", "Local coordinator finality only"]],
  },
];

const recovery = [
  ["Loading takes too long", "Wait once, then refresh Status. Do not submit a state-changing request repeatedly."],
  ["The API is unavailable", "Preserve the request or hash, check Status and Explorer, then retry only when the outcome is known."],
  ["A transaction is not visible", "Search the hash plus both ynx1 and equivalent 0x forms. Confirm chain ID 6423 / 0x1917."],
  ["Nonce conflict", "Refresh account state, confirm whether the earlier hash finalized, then rebuild and sign once with the current nonce."],
  ["Node falls behind", "Keep RPC read-only, inspect peer/time/disk health, and do not enable validator signing until height and hash align."],
  ["A support message asks for secrets", "Stop. Preserve the message as evidence and report it without sharing custody material."],
];

const stepsZh = [
  { title: "核对网络", text: "连接钱包前，确认网络为 YNX Testnet、原生链 ID 为 6423、EVM 链 ID 为 0x1917，并确认当前区块仍在增长。", label: "检查状态" },
  { title: "保护账户", text: "第一方地址使用 ynx1；匹配的 0x 地址仅用于 EVM 兼容工具。绝不要向网站粘贴助记词或私钥。", label: "转换地址" },
  { title: "领取测试 YNXT", text: "水龙头仅供测试网使用；本网络中的 YNXT 不代表货币价值，也不保证流动性。", label: "打开水龙头" },
  { title: "验证每项结果", text: "写入操作后保存交易哈希，并在浏览器核对收据。客户端超时不能证明交易失败。", label: "打开浏览器" },
];

const chaptersZh = {
  "network-facts": {
    title: "了解测试网真正保证的内容",
    intro: "把以下参数作为操作前检查表。如果钱包、RPC、指南或支持消息显示了不同的网络身份，请立即停止。",
    facts: [["网络", "YNX 测试网"], ["原生链 ID", "6423"], ["EVM 链 ID", "0x1917"], ["原生资产", "YNXT"], ["原生转账费用", "当前测试网规则：每笔交易收取 1 个整数 YNXT"], ["最终性", "已最终确认的区块不可更改；区块 1 或任何历史区块都不能接收新交易"]],
    checklist: ["打开状态页，确认 RPC 与索引器均为最新高度。", "逐字符核对目标地址，必要时确认 ynx1 与 0x 地址的等价关系。", "除非另有直接证据，否则主网、上币、流动性、托管和第三方支持均视为不可用。"],
  },
  "wallet-security": {
    title: "安全创建、备份和使用账户",
    intro: "地址可以公开，签名材料不能公开。截图、聊天、支持工单、网页表单和日志都不应包含助记词或私钥。",
    checklist: ["只在目标钱包或本地签名器中创建或导入账户。", "离线记录恢复短语，验证备份，并与设备分开保存。", "只为预期操作解锁；签名前检查网络、收款人、金额、费用与 nonce。", "多人协作时给每个人独立账户和权限边界，绝不共用同一私钥。", "使用后锁定钱包，并在浏览器中独立验证结果哈希。"],
    warning: "YNX 支持人员永远不需要你的助记词、私钥、钱包密码、一次性验证码或签名保管库内容。",
  },
  transfer: {
    title: "发送 YNXT 并证明收据",
    intro: "转账只能进入未来区块，不能插入历史区块。一个区块可以包含零笔、一笔或多笔交易；一笔转账也可以发送余额允许的任意有效数量，并非每个区块只能转 1 YNXT。",
    facts: [["区块", "按顺序保存交易且不可更改的容器"], ["YNXT", "用于价值转移和当前原生手续费的测试网资产"], ["空区块", "不含交易，也不会自动产生 1 YNXT 奖励"], ["多笔支付", "多笔有效交易可以进入同一个未来区块"]],
    checklist: ["确认发送方余额足以覆盖金额和当前 1 YNXT 原生手续费。", "签名前立即读取账户 nonce；重复 nonce 会被拒绝。", "只签名一次并保存返回的交易哈希。", "客户端超时时，先搜索哈希和发送方，再决定是否重试。", "在浏览器核对 From、To、金额、费用、状态、区块高度与确认数。"],
  },
  explorer: {
    title: "快速找到交易、地址或区块",
    intro: "全局搜索支持精确交易哈希、ynx1 地址、兼容 0x 地址和区块高度；快速筛选可按哈希、地址、类型、金额或区块缩小实时交易列表。",
    checklist: ["交易页：核对 From → To、金额、费用、状态与所在区块。", "地址页：查看余额、nonce、转入与转出历史；富豪榜仅按余额排名，并不代表地址所有者身份。", "区块页：优先展示含交易区块；空区块应紧凑显示，因为没有转账内容。", "浏览器追赶高度时，对比已索引高度与链高度；两者对齐前不要断言数据缺失。", "可在浏览器顶部切换 English/中文，选择会保存在本机。"],
  },
  node: {
    title: "在不暴露验证者密钥的前提下准备节点",
    intro: "公开源码和经运营方审核的配置是前提。节点应使用专用的非特权系统账户、持久存储、有限端口、监控与备份。",
    checklist: ["准备受支持的 64 位 Linux 主机，确保时间同步、SSD 持久化、内存余量；需要 P2P 时提供固定公网端点。", "启动前核对源码/构建身份与配置；绝不要复制其他运营方的数据目录或签名密钥。", "管理与指标接口仅绑定 localhost 或经认证的私网，只公开确实需要的 P2P/RPC 路由。", "先作为非验证观察节点启动，完成同步后与公共 RPC 比较高度和哈希。", "配置和密钥元数据应与链数据分开备份，并在隔离主机演练恢复。", "申请候选资格前配置健康、磁盘、内存、对等节点、区块滞后和重启循环告警。"],
    warning: "目前没有一条命令即可无许可加入验证者集合的公开流程。不要把验证者私钥发送给网站或运营人员。",
  },
  validator: {
    title: "申请、暂存并运行验证者候选节点",
    intro: "当前公开测试网验证者由运营方控制。候选准入需要容量、身份/联系信息、密钥保管、监控、恢复与治理审核；阅读文档并不等于自动获批。",
    facts: [["准入", "经审核的测试网候选流程；当前不是无许可加入"], ["密钥保管", "由运营方负责；绝不通过网站提交"], ["可用性", "公共服务可供多人并发读取；验证者签名仍由单一授权边界串行执行"], ["恢复", "先恢复配置/数据，核对签名器状态后再继续"]],
    checklist: ["先运行健康的观察节点，并提供稳定候选端点、运营联系人和事件处理路径。", "在安全目标主机或批准的签名边界生成验证者密钥；保留离线恢复材料并记录轮换授权人。", "证明持续同步、对等节点健康、时钟准确、磁盘余量、重启恢复与告警送达。", "在维护窗口安排准入，启用签名前核对预期验证者身份。", "监控漏块、双签风险、滞后、失联、磁盘、内存与服务重启；签名器状态不确定时必须失败关闭。", "退出或轮换时先协调验证者集合变更，再停止签名、保存审计证据，并按政策归档或销毁旧密钥。"],
  },
  mining: {
    title: "不要在 YNX 测试网使用 GPU 或 ASIC 挖矿",
    intro: "YNX 测试网由轮换验证者/出块者运行，不是工作量证明挖矿。没有受支持的 GPU/ASIC 矿工，也没有自动每区块发行 1 YNXT 的机制。",
    checklist: ["参与出块应遵循验证者候选流程，而不是使用矿池软件。", "一个区块不等于 1 YNXT；区块可以为空，也可以包含多笔转账。", "空区块没有当前发行奖励；现行规则下，原生交易支付 1 YNXT 手续费并记给验证者。", "不要购买宣称保证获得 YNX 挖矿收益的硬件、矿池服务或软件。"],
    warning: "未来任何发行或激励调整都必须经过明确网络升级并公开文档；本手册不承诺奖励。",
  },
  bridge: {
    title: "区分源链证明与外部执行",
    intro: "当前跨链桥路径可以记录并共同签署 YNX 测试网的本地协调器生命周期，但外部铸造/提交已禁用。本地最终完成不等于已在外部链跨链完成。",
    facts: [["当前路由", "YNX 测试网 YNXT → 外部测试网不可用的 wrapped-YNXT"], ["确认数", "当前协调器路由要求 12 个源链确认"], ["外部提交", "已禁用"], ["真实结果", "仅本地协调器最终完成"]],
    checklist: ["核对 YNX 源交易和所需确认数。", "记录路由、资产、源哈希、目标、金额与协调器 transfer ID。", "核对独立中继签名与本地最终完成审计轨迹。", "宣称外部完成前检查 Provider 与合约能力。", "外部提交禁用时必须报告“本地完成 / 未外部提交”，不得表示 wrapped 资产已经铸造。"],
  },
};

const recoveryZh = [
  ["加载时间过长", "等待一次后刷新状态页，不要反复提交会改变状态的请求。"],
  ["API 不可用", "保存请求或哈希，检查状态页和浏览器；只有在结果明确后才重试。"],
  ["看不到交易", "搜索哈希，并分别搜索 ynx1 与等价 0x 地址；确认链 ID 为 6423 / 0x1917。"],
  ["Nonce 冲突", "刷新账户状态，确认上一笔哈希是否已最终完成，再使用当前 nonce 重新构建并只签名一次。"],
  ["节点落后", "保持 RPC 只读，检查对等节点、时间和磁盘；高度与哈希对齐前不要启用验证者签名。"],
  ["支持消息索要秘密", "立即停止，保存消息作为证据并报告，绝不分享保管材料。"],
];

export function ManualPage() {
  const { locale } = useLocale();
  const zh = locale === "zh-CN";
  const localizedSteps = zh ? steps.map((step, index) => ({ ...step, ...stepsZh[index] })) : steps;
  const localizedChapters = zh ? chapters.map((chapter) => ({ ...chapter, ...chaptersZh[chapter.id] })) : chapters;
  const localizedRecovery = zh ? recoveryZh : recovery;
  return <main className="guidePage">
    <header className="guideHero">
      <p className="sectionEyebrow">User & operator manual / 用户与运维手册</p>
      <h1>{zh ? "每一步都用证据运行 YNX 测试网。" : "Operate YNX Testnet with evidence at every step."}</h1>
      <p>{zh ? "面向用户、节点运营者和验证者候选人的详细路径，覆盖浏览器、转账、跨链证据、恢复，以及“挖矿”的准确边界。" : "A detailed path for users, node operators, validator candidates, Explorer, transfers, bridge evidence, recovery, and the exact boundary of “mining.”"}</p>
      <div className="guideActions"><a className="button primary" href="/status">{zh ? "检查网络状态" : "Check network status"} <ArrowUpRight /></a><a className="button secondary" href="/docs">{zh ? "开发者文档" : "Developer docs"}</a></div>
      <nav className="manualToc" aria-label={zh ? "手册章节" : "Manual chapters"}>{localizedChapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.title}</a>)}</nav>
    </header>

    <section className="guideSteps" aria-labelledby="manual-start">
      <div className="guideSectionHeader"><p className="sectionEyebrow">{zh ? "安全开始" : "Safe start"}</p><h2 id="manual-start">{zh ? "从零开始完成一项可验证的测试网操作" : "From zero to a verified testnet action"}</h2></div>
      <ol>{localizedSteps.map((step) => { const Icon = step.icon; return <li key={step.number}><span className="guideNumber">{step.number}</span><Icon aria-hidden="true" /><div><h3>{step.title}</h3><p>{step.text}</p></div><a href={step.href}>{step.label} {step.href.startsWith("http") ? <ExternalLink /> : <ArrowUpRight />}</a></li>; })}</ol>
    </section>

    <div className="manualChapters">{localizedChapters.map((chapter) => { const Icon = chapter.icon; return <section className="manualChapter" id={chapter.id} key={chapter.id}>
      <header><span className="manualChapterIcon"><Icon aria-hidden="true" /></span><div><p className="sectionEyebrow">{chapter.eyebrow}</p><h2>{chapter.title}</h2><p>{chapter.intro}</p></div></header>
      {chapter.facts ? <dl className="manualFacts">{chapter.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : null}
      <ol className="manualChecklist">{chapter.checklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
      {chapter.code ? <pre className="manualCode"><code>{chapter.code}</code></pre> : null}
      {chapter.warning ? <aside className="manualWarning"><CircleAlert /><p>{chapter.warning}</p></aside> : null}
    </section>; })}</div>

    <section className="recoverySection" aria-labelledby="recovery-title"><div className="recoveryIntro"><RefreshCw aria-hidden="true" /><p className="sectionEyebrow">{zh ? "恢复" : "Recovery"}</p><h2 id="recovery-title">{zh ? "不确定本身就是一种状态，不应靠猜测处理。" : "Uncertainty is a state, not a reason to guess."}</h2><p>{zh ? "重试前先保存证据，并确定最后一个已确认状态。" : "Preserve evidence and establish the last confirmed state before retrying."}</p></div><div className="recoveryList">{localizedRecovery.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="supportCallout" aria-labelledby="manual-support"><ShieldCheck aria-hidden="true" /><div><p className="sectionEyebrow">{zh ? "安全边界" : "Security boundary"}</p><h2 id="manual-support">{zh ? "请求任何人介入前，先核对公开证据。" : "Use public evidence before asking anyone to intervene."}</h2><p>{zh ? "绝不分享助记词、私钥、密码、一次性验证码或保管材料。报告安全问题时，不要公开可被利用的细节。" : "Never share a mnemonic, private key, password, one-time code, or custody material. Report security issues without posting exploitable details publicly."}</p></div><div><a href="/security"><CircleAlert /> {zh ? "安全指南" : "Security guidance"}</a><a href="/support"><LifeBuoy /> {zh ? "支持与恢复" : "Support and recovery"}</a></div></section>
  </main>;
}
