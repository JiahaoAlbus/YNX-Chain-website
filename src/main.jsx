import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, Bot, Box, Braces, CheckCircle2, CircleDollarSign, Clock3, Code2, Coins,
  Database, Gauge, Landmark, Layers3, Network, Scale, Search, ShieldCheck, WalletCards
} from "lucide-react";
import { apiConfig, loadNetworkSnapshot, loadServiceHealth, networkParams } from "./lib/api/ynxApi.js";
import { Hero } from "./sections/Hero.jsx";
import { StatusCard } from "./components/StatusCard.jsx";
import { ProductPanel } from "./components/ProductPanel.jsx";
import { LinkGrid } from "./components/LinkGrid.jsx";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";
import { RoutePage } from "./components/RoutePage.jsx";
import { AddressConverter } from "./components/AddressConverter.jsx";
import { AppsPage } from "./pages/AppsPage.jsx";
import { DownloadPage } from "./pages/DownloadPage.jsx";
import { DocsPage } from "./pages/DocsPage.jsx";
import { AuthorityArticlePage } from "./pages/AuthorityArticlePage.jsx";
import { ProductStatusPage } from "./pages/ProductStatusPage.jsx";
import { SquarePage } from "./pages/SquarePage.jsx";
import { ManualPage } from "./pages/ManualPage.jsx";
import { ApiPage } from "./pages/ApiPage.jsx";
import { getLegacyDAppRedirect, getProductByRoute } from "./lib/ecosystemCatalog.js";
import docsAuthority from "virtual:ynx-docs-authority";
import { LocaleProvider, useLocale } from "./lib/i18n.jsx";
import "./styles.css";

const route = window.location.pathname.replace(/\/$/, "") || "/";

function App() {
  const { locale } = useLocale();
  const zh = locale === "zh-CN";
  const [snapshot, setSnapshot] = useState({ status: {}, summary: {}, validators: {}, evm: {} });
  const [services, setServices] = useState({});
  const [connectionState, setConnectionState] = useState("loading");
  const [heightMoved, setHeightMoved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let active = true;
    let previousHeight = 0;
    let networkTimer = 0;
    let lastServiceCheck = 0;
    const refresh = async () => {
      const next = await loadNetworkSnapshot();
      if (!active) return;
      const nextHeight = Number(next.status?.height || 0);
      setHeightMoved(previousHeight > 0 && nextHeight > previousHeight);
      previousHeight = Math.max(previousHeight, nextHeight);
      setSnapshot(next);
      setConnectionState(next.error || next.status?.error ? "error" : "live");
    };
    const refreshServices = async () => {
      const next = await loadServiceHealth();
      if (!active) return;
      setServices(next.services || {});
      lastServiceCheck = Date.now();
    };
    const cycle = async () => {
      await refresh();
      if (active && Date.now() - lastServiceCheck >= 120000) await refreshServices();
      if (active) networkTimer = window.setTimeout(cycle, 5000);
    };
    cycle();
    return () => {
      active = false;
      window.clearTimeout(networkTimer);
    };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? Math.min(window.scrollY / available, 1) : 0);
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("isVisible");
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -36px" });
    const reveal = () => document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    const frame = window.requestAnimationFrame(reveal);
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  if (route !== "/") {
    const legacyTarget = getLegacyRouteTarget(route);
    if (legacyTarget) {
      return <LegacyRouteRedirect target={legacyTarget} />;
    }
    let page = <RoutePage path={route} />;
    const product = getProductByRoute(route);
    const authorityArticle = docsAuthority.articles.find((article) => article.route === route);
    if (product) page = <ProductStatusPage product={product} article={authorityArticle} artifact={docsAuthority.artifact} />;
    else if (authorityArticle) page = <AuthorityArticlePage article={authorityArticle} artifact={docsAuthority.artifact} />;
    if (route === "/dapp/download") page = <DownloadPage />;
    if (route === "/dapp") page = <AppsPage />;
    if (route === "/docs") page = <DocsPage />;
    if (route === "/manual") page = <ManualPage />;
    if (route === "/api") page = <ApiPage />;
    if (route === "/dapp/square" || route.startsWith("/dapp/square/")) page = <SquarePage path={route} />;
    return <><SiteHeader scrollProgress={scrollProgress} /><div id="main-content">{page}</div><SiteFooter /></>;
  }

  const { status = {}, summary = {}, validators = {}, evm = {} } = snapshot;
  const validatorRows = Array.isArray(validators.validators) ? validators.validators : [];
  const buildRelease = status.build?.release || "Awaiting live identity";
  const serviceState = (name) => services[name]?.ok === true ? "live" : services[name]?.error ? "status unavailable" : "checking";

  return (
    <main id="main-content">
      <SiteHeader scrollProgress={scrollProgress} />
      <Hero snapshot={snapshot} connectionState={connectionState} onAddNetwork={addNetwork} />

      <section className="networkBand" id="network" aria-labelledby="network-title" data-reveal>
        <div className="sectionHeader compact">
          <div><p className="sectionEyebrow">{zh ? "实时网络" : "Live network"}</p><h2 id="network-title">{zh ? "当前公开测试网状态" : "Current public testnet state"}</h2></div>
          <div className={`connection ${connectionState}`}><span />{connectionState === "live" ? `${zh ? "更新于" : "Updated"} ${formatTime(snapshot.checkedAt, locale)}` : connectionState}</div>
        </div>
        <div className="metricsGrid">
          <StatusCard icon={<Activity />} title={zh ? "区块高度" : "Block height"} value={formatNumber(status.height, locale)} label={heightMoved ? (zh ? "正在增长" : "Growing now") : (zh ? "实时 RPC 高度" : "Live RPC height")} error={status.error} emphasis />
          <StatusCard icon={<Gauge />} title={zh ? "EVM 链" : "EVM chain"} value={evm.result} label={zh ? "预期 0x1917" : "Expected 0x1917"} error={evm.error} />
          <StatusCard icon={<Database />} title={zh ? "交易数" : "Transactions"} value={formatNumber(summary.totalTransactions, locale)} label={zh ? "持久化测试网记录" : "Persisted testnet records"} error={summary.error} />
          <StatusCard icon={<Network />} title={zh ? "验证者角色" : "Validator roles"} value={validators.validators?.length} label={zh ? "预期四个公开角色" : "Expected four public roles"} error={validators.error} />
          <StatusCard icon={<Coins />} title={zh ? "原生资产" : "Native asset"} value={status.nativeCurrencySymbol} label={zh ? "Gas 与资源资产" : "Gas and resource asset"} error={status.error} />
          <StatusCard icon={<Box />} title={zh ? "版本" : "Release"} value={shortRelease(buildRelease)} label={buildRelease} error={status.error} />
        </div>
      </section>

      <section className="validatorSection" aria-labelledby="validators-title" data-reveal>
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">{zh ? "四区域拓扑" : "Four-region topology"}</p><h2 id="validators-title">{zh ? "可检查的验证者角色" : "Inspectable validator roles"}</h2></div>
          <p>{zh ? "每个角色独立报告当前高度。角色可用并不代表高度已经收敛，也不能证明公开 BFT 投票已经完成。" : "Each role reports its own current height. Height convergence and public BFT voting remain pending and are not inferred from role availability."}</p>
        </div>
        <div className="validatorTable" role="table" aria-label="Live validator roles">
          <div className="validatorRow validatorHead" role="row"><span>{zh ? "位置" : "Location"}</span><span>{zh ? "角色" : "Role"}</span><span>{zh ? "高度" : "Height"}</span><span>{zh ? "状态" : "Status"}</span></div>
          {validatorRows.length ? validatorRows.map((validator) => {
            const lag = Math.max(0, Number(status.height || 0) - Number(validator.latestHeight || 0));
            const current = validator.peerReady && lag <= 5;
            return (
              <div className="validatorRow" role="row" key={validator.address}>
                <span><strong>{validator.moniker?.replace("ynx-", "") || validator.address}</strong><small>{validator.address}</small></span>
                <span>{validator.role}</span><span>{formatNumber(validator.latestHeight, locale)}</span>
                <span className={current ? "ready" : "pending"}><i />{current ? (zh ? "当前" : "Current") : lag > 0 ? `${formatNumber(lag, locale)} ${zh ? "个区块落后" : "behind"}` : (zh ? "等待中" : "Pending")}</span>
              </div>
            );
          }) : <div className="tableEmpty">{validators.error || (zh ? "正在连接验证者 API" : "Connecting to validator API")}</div>}
        </div>
      </section>

      <section className="ecosystemSection" id="ecosystem" aria-labelledby="ecosystem-title" data-reveal>
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">{zh ? "全栈生态" : "Full-stack ecosystem"}</p><h2 id="ecosystem-title">{zh ? "一条链，连接全部运营界面" : "One chain, connected operational surfaces"}</h2></div>
          <p>{zh ? "运行时、经济系统、服务、证据与集成工具共享同一个 YNX 测试网身份。" : "Runtime, economics, services, evidence, and integration tooling share the same YNX Testnet identity."}</p>
        </div>
        <div className="productGrid">
          <ProductPanel icon={<Layers3 />} title={zh ? "L1 运行时" : "L1 Runtime"} text={zh ? "持久化链状态、RPC、EVM RPC、交易、收据、日志、余额与四角色复制。" : "Persistent chain state, RPC, EVM RPC, transactions, receipts, logs, balances, and four-role replication."} status="live" href={`${apiConfig.apiBase}/status`} />
          <ProductPanel icon={<Coins />} title={zh ? "YNXT 经济系统" : "YNXT Economy"} text={zh ? "当前运行时中的原生 Gas 与资源资产，没有隐藏的直接冻结入口。" : "Native gas and resource asset with no hidden direct-freeze hook in the current runtime."} status="live" href="/testnet" />
          <ProductPanel icon={<Search />} title={zh ? "索引器 + 浏览器" : "Indexer + Explorer"} text={zh ? "实时区块、交易、账户、验证者、搜索、SSE 更新与网络证据。" : "Live blocks, transactions, accounts, validators, search, SSE updates, and network evidence."} status="live" href={apiConfig.explorerUrl} />
          <ProductPanel icon={<Bot />} title="AI Gateway" text="Session and permission architecture with policy-bounded action proposal, approval, and audit." status={serviceState("ai")} href="/dapp/ai" />
          <ProductPanel icon={<CircleDollarSign />} title="Pay API" text="Merchant-bound intents, invoices, idempotency, webhook signing, refunds, and event records." status={serviceState("pay")} href="/dapp/pay" />
          <ProductPanel icon={<ShieldCheck />} title="Trust + Chain Law" text="Evidence-bound tracing, advisory labels, request validity, appeals, corrections, and transparency." status={serviceState("trust")} href="/dapp/trust" />
          <ProductPanel icon={<Gauge />} title="Resource Market" text="Policy-bound quotes, delegation, rental settlement, provider income, and analytics." status={serviceState("resource")} href="/dapp/resource" />
          <ProductPanel icon={<Braces />} title="Developer SDKs" text="Dependency-free JavaScript and Python clients verified against the live REST and EVM endpoints." status="live" href="/docs" />
          <ProductPanel icon={<WalletCards />} title="YNX-native Identity" text="ynx1 is the default account identity across first-party YNX surfaces. The equivalent 0x value is confined to the EVM compatibility adapter." status="live" href="/#address" />
          <ProductPanel icon={<Landmark />} title="Exchange Integration Candidate" text="Public-testnet signed transaction broadcast, nonce, block, history, receipt, and log flows are verified. No exchange listing is claimed." status="live" href={apiConfig.exchangeUrl} />
        </div>
      </section>

      <section className="developerSection" id="developers" aria-labelledby="developers-title" data-reveal>
        <div className="developerCopy">
          <p className="sectionEyebrow">{zh ? "开发者界面" : "Developer surface"}</p><h2 id="developers-title">{zh ? "连接真实端点。" : "Connect to real endpoints."}</h2>
          <p>{zh ? "链身份与网络状态来自实时公开测试网；SDK 检查只核对 REST 与 EVM 高度，不提交交易。" : "Chain identity and network state come from the live public testnet. SDK checks verify REST and EVM heights without submitting transactions."}</p>
          <a className="textLink" href="/docs">{zh ? "打开开发者文档" : "Open developer docs"} <Code2 size={17} /></a>
        </div>
        <div className="endpointList">
          <Endpoint label="REST RPC" value={apiConfig.apiBase} />
          <Endpoint label="EVM JSON-RPC" value={apiConfig.evmRpc} />
          <Endpoint label="Explorer" value={apiConfig.explorerUrl} />
          <Endpoint label="Chain ID" value="6423 / 0x1917" />
        </div>
      </section>

      <AddressConverter />

      <section className="readinessSection" id="readiness" aria-labelledby="readiness-title" data-reveal>
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">{zh ? "不夸大的就绪度" : "Readiness without overclaiming"}</p><h2 id="readiness-title">{zh ? "始终区分当前状态与目标状态。" : "Current state and target state stay separate."}</h2></div>
        </div>
        <div className="readinessColumns">
          <div><h3><CheckCircle2 /> {zh ? "当前已验证" : "Verified now"}</h3><ul>{(zh ? ["链 ID 6423 的公开 YNX 测试网", "四个远程部署的验证者角色", "实时 RPC、EVM、水龙头、索引器与浏览器", "YNX 原生 ynx1 身份与隔离 EVM 适配器", "已签名交易与交易所候选 RPC 流程", "AI 操作、Pay、Trust、资源与治理界面", "带校验和的发布、备份与回滚工具"] : ["Public YNX Testnet on chain ID 6423", "Four remotely deployed validator roles", "Live RPC, EVM, Faucet, Indexer and Explorer", "YNX-native ynx1 identity with an isolated EVM adapter", "Signed transaction and exchange-candidate RPC flows", "AI action, Pay, Trust, Resource and governance surfaces", "Checksummed releases, backup and rollback tooling"]).map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3><Clock3 /> {zh ? "仍然需要" : "Still required"}</h3><ul>{(zh ? ["YNX 原生钱包生产发布与保管移交", "公开 CometBFT 投票与切换证明", "独立公网观察点证据", "外部安全审计与主网法律审查", "外部钱包、交易所、发行方与跨链桥批准"] : ["YNX native wallet production release and custody handover", "Public CometBFT voting and cutover proof", "Independent public-vantage evidence", "External security audit and mainnet legal review", "External wallet, exchange, issuer and bridge approvals"]).map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="claimBoundary"><Scale size={28} /><h3>{zh ? "不作虚假声明" : "No fake claims"}</h3><p>{zh ? "本项目不宣称主网上线、交易所上币、稳定币发行方支持、钱包默认支持或第三方合作关系。" : "This project does not claim mainnet launch, exchange listing, stablecoin issuer support, wallet default support, or third-party partnerships."}</p><a href="/readiness">{zh ? "查看完整边界" : "Read full boundaries"}</a></div>
        </div>
      </section>

      <section className="resourceSection" aria-labelledby="resources-title" data-reveal>
        <div className="sectionHeader"><div><p className="sectionEyebrow">{zh ? "开始构建" : "Start building"}</p><h2 id="resources-title">{zh ? "公开入口" : "Public entry points"}</h2></div></div>
        <LinkGrid />
      </section>
      <SiteFooter />
    </main>
  );
}

function Endpoint({ label, value }) {
  const [copyState, setCopyState] = useState("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1400);
  };
  const copyLabel = copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : `Copy ${label}`;
  return <div className="endpoint"><span>{label}</span><code>{value}</code><button onClick={copy} aria-label={copyLabel} title={copyLabel}>{copyState === "copied" ? <CheckCircle2 size={17} /> : <Code2 size={17} />}</button></div>;
}

function getLegacyRouteTarget(path) {
  if (path === "/apps") return "/dapp";
  if (path === "/download") return "/dapp/download";
  if (path === "/square") return "/dapp/square";
  if (path.startsWith("/square/")) return `/dapp/square/${path.slice("/square/".length)}`;
  if (path === "/quant") return "/dapp/quant";
  return getLegacyDAppRedirect(path);
}

function LegacyRouteRedirect({ target }) {
  const destination = `${target}${window.location.search}${window.location.hash}`;
  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);
  return (
    <main id="main-content" className="routePage">
      <div className="routeInner">
        <p className="sectionEyebrow">DApp route moved</p>
        <h1>This software now lives under /dapp.</h1>
        <p className="routeLead">Redirecting to the canonical DApp address.</p>
        <a className="button primary" href={destination}>Continue to DApps</a>
      </div>
    </main>
  );
}

async function addNetwork() {
  if (!window.ethereum) return window.alert("No EIP-1193 wallet detected.");
  await window.ethereum.request({ method: "wallet_addEthereumChain", params: [networkParams()] });
}

function formatNumber(value, locale = "en") { return Number.isFinite(Number(value)) ? new Intl.NumberFormat(locale).format(Number(value)) : undefined; }
function formatTime(value, locale = "en") { return value ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)) : (locale === "zh-CN" ? "现在" : "now"); }
function shortRelease(value) { return value.startsWith("ynx-chain-") ? value.replace("ynx-chain-", "") : value; }

createRoot(document.getElementById("root")).render(<LocaleProvider><App /></LocaleProvider>);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
