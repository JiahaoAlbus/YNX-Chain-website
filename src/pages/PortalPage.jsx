import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clipboard, Database, ExternalLink, FileWarning, Network, Search, ShieldCheck, WalletCards } from "lucide-react";
import { apiConfig, loadNetworkSnapshot, YNX_6423 } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";

const external = (label, href) => ({ label, href, external: /^https?:/.test(href) });

const pages = {
  "/blockchain": {
    eyebrow: "Network overview", title: "Explore YNX 6423 without leaving the official path.",
    lead: "The official website summarizes the verified YNX Testnet. Detailed blocks, transactions, addresses, contracts, validators and search live in the independent Explorer.",
    facts: ["Latest height is checked against RPC and Explorer Indexer together.", "A lower height is expected for a newly started Testnet; it is not migrated from retired networks.", "When RPC and Indexer differ, this site shows degraded rather than presenting a normal state."],
    actions: [external("Open YNX Explorer", apiConfig.explorerUrl), external("Open Network Monitor", apiConfig.monitorUrl)]
  },
  "/tokens": {
    eyebrow: "Native asset", title: "YNXT is visible, testnet-only, and verifiable.",
    lead: "YNXT is the native asset of YNX Testnet. It is used for gas, fees and network resources. No market price, market cap or supply is shown without an authoritative public source.",
    facts: ["Native asset: YNXT", "Network: YNX Testnet", "Supply and market data: currently unavailable through a public authority"],
    actions: [external("Open YNXT evidence", "/ynxt"), external("View YNXT in Explorer", `${apiConfig.explorerUrl}/token/YNXT`), external("Get Testnet YNXT", apiConfig.faucetUrl)]
  },
  "/data": {
    eyebrow: "Data center", title: "Verified data comes with a boundary.",
    lead: "Current network information is live only after chain identity and Indexer alignment succeed. Historical charts remain unavailable until a timestamped authoritative history service is published.",
    facts: ["Range controls do not manufacture a chart from a short live window.", "Every current value includes a source and refresh timestamp.", "Network health is read from RPC, Explorer, Faucet and Monitor separately."],
    actions: [external("Open Network Monitor", apiConfig.monitorUrl), external("Open Explorer data", apiConfig.explorerUrl)]
  },
  "/governance": {
    eyebrow: "Governance", title: "Governance data is not inferred.",
    lead: "The official site does not currently have a verified public governance index for YNX 6423. Proposal lists, votes and parameters are intentionally unavailable instead of being filled with sample records.",
    facts: ["No verified proposal endpoint is configured.", "No vote or parameter value is displayed as current.", "Use the documentation and source repository for implementation material."],
    actions: [external("Open governance source", "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs"), external("Read Docs", "/docs")]
  },
  "/developers": {
    eyebrow: "Developer portal", title: "Build against one canonical Testnet identity.",
    lead: "RPC, EVM, Explorer and Faucet are presented as separate verified services. Connecting a wallet, adding a network, signing or sending never happens automatically.",
    facts: ["Cosmos chain ID: ynx_6423-1", "EVM chain ID: 6423 / 0x1917", "Native asset: YNXT"],
    actions: [external("Read Developer Docs", "/docs"), external("Open Chain GitHub", "https://github.com/JiahaoAlbus/YNX-Chain")]
  },
  "/downloads": {
    eyebrow: "Download center", title: "Only verified releases should be installed.",
    lead: "The download directory labels platform, version, checksum and signing state. A candidate, unsigned build, simulator or unavailable platform is never presented as a production release.",
    facts: ["Wallet and tools are separate products.", "Every enabled download must lead to a real release artifact.", "Use installation notes before replacing or importing a wallet."],
    actions: [external("Open verified downloads", "/dapp/download"), external("Read installation manual", "/manual")]
  },
  "/ecosystem": {
    eyebrow: "YNX Ecosystem", title: "Choose a product by what you need to do.",
    lead: "The ecosystem directory separates Wallet, DeFi, Payments, Developer, AI, Social, Data, Media, Commerce and Infrastructure. Each product remains independently status-labelled.",
    facts: ["A source repository alone does not mean a product is publicly deployed.", "A Testnet, Preview or Unavailable label stays visible at every entry.", "Wallet availability is kept distinct from MetaMask compatibility."],
    actions: [external("Open ecosystem directory", "/dapp"), external("Check product status", "/status")]
  },
  "/more": {
    eyebrow: "Project resources", title: "Everything else has a clear destination.",
    lead: "Find the whitepaper, documentation, source code, network monitor and official community channels here. External destinations are always marked before you leave the official website.",
    facts: ["YNX Website: ynxweb4.com", "Testnet only: Mainnet is not claimed", "Never share a recovery phrase, private key or password with support."],
    actions: [external("Read evidence-linked whitepaper", "/whitepaper"), external("Open GitHub", "https://github.com/JiahaoAlbus/YNX-Chain"), external("Join Discord", "https://discord.gg/t8KpAF2KE")]
  }
};

const portalLocales = {
  "zh-CN": {
    "/blockchain": { eyebrow: "网络概览", title: "沿着官方入口了解 YNX 6423。", lead: "官网汇总已经核验的 YNX Testnet 信息；区块、交易、地址、合约、验证者与搜索均在独立 Explorer 中查询。", facts: ["最新高度同时对照 RPC 与 Explorer Indexer。", "新启动的 Testnet 高度较低属正常现象，不会迁入旧网络。", "RPC 与 Indexer 不一致时，网站会降级显示而不会假装正常。"], actions: ["打开 YNX 区块浏览器", "打开网络监控"] },
    "/tokens": { eyebrow: "原生资产", title: "YNXT 清晰可见，仅用于测试网，也能核验。", lead: "YNXT 是 YNX Testnet 原生资产，用于 Gas、手续费和网络资源。没有权威公开来源时，本站不会显示价格、市值或供应量。", facts: ["原生资产：YNXT", "网络：YNX Testnet", "供应量和市场数据：当前没有权威公开接口"], actions: ["打开 YNXT 证据页", "在 Explorer 查看 YNXT", "领取 Testnet YNXT"] },
    "/data": { eyebrow: "数据中心", title: "可验证的数据必须说明边界。", lead: "只有链身份和 Indexer 对齐后才显示实时网络信息；时间戳权威历史接口尚未公开，因此不生成伪造趋势图。", facts: ["范围控制不会用短暂实时窗口伪造历史图表。", "每个当前数值都附有来源与刷新时间。", "RPC、Explorer、Faucet 与 Monitor 分别读取网络健康。"], actions: ["打开网络监控", "打开 Explorer 数据"] },
    "/governance": { eyebrow: "治理", title: "治理数据不会凭空推断。", lead: "YNX 6423 暂无经过验证的公开治理索引；提案、投票和参数会明确显示暂不可用，而不会用示例记录填充。", facts: ["尚未配置经过验证的提案接口。", "不会把投票或参数当作当前事实展示。", "可在文档与源码仓库查看实现资料。"], actions: ["打开治理源码", "阅读文档"] },
    "/developers": { eyebrow: "开发者中心", title: "围绕唯一的 Testnet 身份构建。", lead: "RPC、EVM、Explorer 和 Faucet 都是独立核验的服务；连接钱包、添加网络、签名和发送交易绝不会自动触发。", facts: ["Cosmos Chain ID：ynx_6423-1", "EVM Chain ID：6423 / 0x1917", "原生资产：YNXT"], actions: ["阅读开发者文档", "打开 Chain GitHub"] },
    "/downloads": { eyebrow: "下载中心", title: "只安装能核验的发布。", lead: "下载目录会显示平台、版本、校验和和签名状态；候选、未签名构建、模拟器版本或不可用平台不会伪装成正式发布。", facts: ["钱包与开发工具是独立产品。", "每一个启用的下载都必须指向真实发布文件。", "替换或导入钱包前请先阅读安装说明。"], actions: ["打开已核验下载", "阅读安装手册"] },
    "/ecosystem": { eyebrow: "YNX 生态", title: "按你要完成的事情选择产品。", lead: "生态目录覆盖 Wallet、DeFi、Payments、Developer、AI、Social、Data、Media、Commerce 与 Infrastructure；每个产品都会独立标明状态。", facts: ["有源码不代表产品已经公网部署。", "每个入口都会保留 Testnet、Preview 或 Unavailable 标签。", "YNX Wallet 的可用性与 MetaMask 兼容性会明确区分。"], actions: ["打开生态目录", "检查产品状态"] },
    "/more": { eyebrow: "项目资源", title: "每一项资源都有明确去向。", lead: "这里汇集白皮书、文档、源码、网络监控和官方社区；离开官网前会明确标识外部目的地。", facts: ["YNX Website：ynxweb4.com", "仅为 Testnet，不宣称 Mainnet。", "请勿向支持人员提供助记词、私钥或密码。"], actions: ["阅读证据关联白皮书", "打开 GitHub", "加入 Discord"] }
  }
};

export const portalRoutes = new Set(Object.keys(pages));

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return <button type="button" className="copyMini" onClick={async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }} aria-label={`Copy ${value}`}>{copied ? <CheckCircle2 /> : <Clipboard />}</button>;
}

export function PortalPage({ path }) {
  const { locale, t } = useLocale();
  const originalPage = pages[path];
  const localizedPage = portalLocales[locale]?.[path];
  const page = localizedPage ? { ...originalPage, ...localizedPage } : originalPage;
  const [network, setNetwork] = useState({});
  useEffect(() => { loadNetworkSnapshot().then(setNetwork); }, []);
  const health = useMemo(() => network.ok === true ? t("verified") : network.degraded ? t("degraded") : network.error ? t("unavailable") : t("checking"), [network, t]);
  if (!page) return null;
  const config = [
    ["Cosmos", YNX_6423.cosmosChainId], ["EVM", YNX_6423.evmChainId], ["RPC", apiConfig.apiBase], ["Explorer", apiConfig.explorerUrl]
  ];
  return <main className="portalPage" id="main-content">
    <section className="portalHero"><p className="sectionEyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.lead}</p><div className="portalActions">{page.actions.map((action, index) => <a className="button primary" key={action.label} href={action.href}>{localizedPage?.actions?.[index] || action.label}{action.external && <ExternalLink size={16} />}{!action.external && <ArrowUpRight size={16} />}</a>)}</div></section>
    <section className="portalStatus" aria-label={t("currentNetworkVerification")}><div><span className={`statusPill ${network.ok === true ? "verified" : network.degraded ? "degraded" : "unavailable"}`}>{network.ok === true ? <ShieldCheck /> : <FileWarning />}{health}</span><h2>{t("current6423Verification")}</h2><p>{network.checkedAt ? `${t("checked")} ${new Date(network.checkedAt).toLocaleString(locale)}` : t("fetchingPublicServices")}</p></div><div className="portalLiveValues"><span><small>{t("rpcHeight")}</small><strong>{network.status?.height ?? t("unavailable")}</strong></span><span><small>{t("indexerHeight")}</small><strong>{network.explorer?.indexedHeight ?? t("unavailable")}</strong></span><span><small>{t("indexerState")}</small><strong>{network.explorer?.indexerOk === true ? t("aligned") : t("unavailable")}</strong></span></div></section>
    <section className="portalLayout"><article className="portalFacts"><h2>{t("whatThisMeans")}</h2><ul>{page.facts.map((fact) => <li key={fact}><CheckCircle2 />{fact}</li>)}</ul></article><aside className="portalConfig"><div className="portalConfigHead"><Network /><div><h2>{t("ynx6423Configuration")}</h2><p>{t("oneSharedConfig")}</p></div></div>{config.map(([label, value]) => <div className="portalConfigRow" key={label}><span>{label}</span><code>{value}</code><CopyButton value={value} /></div>)}</aside></section>
    {path === "/data" && <section className="unavailableChart"><div><Database /><h2>{t("historicalChartsUnavailable")}</h2><p>{t("historicalChartsBoundary")}</p></div><button type="button" disabled><Search />{t("rangeUnavailable")}</button></section>}
    {path === "/tokens" && <section className="ynxtCard"><WalletCards /><div><p className="sectionEyebrow">YNXT</p><h2>{t("ynxtUses")}</h2><p>{t("ynxtFaucetBoundary")}</p></div><a href={apiConfig.faucetUrl} className="button primary">{t("getTestnetYNXT")} <ExternalLink size={16} /></a></section>}
  </main>;
}
