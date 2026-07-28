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
import { getProductByRoute } from "./lib/ecosystemCatalog.js";
import docsAuthority from "virtual:ynx-docs-authority";
import "./styles.css";

const route = window.location.pathname.replace(/\/$/, "") || "/";

function App() {
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
    let page = <RoutePage path={route} />;
    const product = getProductByRoute(route);
    const authorityArticle = docsAuthority.articles.find((article) => article.route === route);
    if (product) page = <ProductStatusPage product={product} article={authorityArticle} artifact={docsAuthority.artifact} />;
    else if (authorityArticle) page = <AuthorityArticlePage article={authorityArticle} artifact={docsAuthority.artifact} />;
    if (route === "/download") page = <DownloadPage />;
    if (route === "/apps") page = <AppsPage />;
    if (route === "/docs") page = <DocsPage />;
    if (route === "/manual") page = <ManualPage />;
    if (route === "/api") page = <ApiPage />;
    if (route === "/square" || route.startsWith("/square/")) page = <SquarePage path={route} />;
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
          <div><p className="sectionEyebrow">Live network</p><h2 id="network-title">Current public testnet state</h2></div>
          <div className={`connection ${connectionState}`}><span />{connectionState === "live" ? `Updated ${formatTime(snapshot.checkedAt)}` : connectionState}</div>
        </div>
        <div className="metricsGrid">
          <StatusCard icon={<Activity />} title="Block height" value={formatNumber(status.height)} label={heightMoved ? "Growing now" : "Live RPC height"} error={status.error} emphasis />
          <StatusCard icon={<Gauge />} title="EVM chain" value={evm.result} label="Expected 0x1917" error={evm.error} />
          <StatusCard icon={<Database />} title="Transactions" value={formatNumber(summary.totalTransactions)} label="Persisted testnet records" error={summary.error} />
          <StatusCard icon={<Network />} title="Validator roles" value={validators.validators?.length} label="Expected four public roles" error={validators.error} />
          <StatusCard icon={<Coins />} title="Native asset" value={status.nativeCurrencySymbol} label="Gas and resource asset" error={status.error} />
          <StatusCard icon={<Box />} title="Release" value={shortRelease(buildRelease)} label={buildRelease} error={status.error} />
        </div>
      </section>

      <section className="validatorSection" aria-labelledby="validators-title" data-reveal>
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">Four-region topology</p><h2 id="validators-title">Inspectable validator roles</h2></div>
          <p>Each role reports its own current height. Height convergence and public BFT voting remain pending and are not inferred from role availability.</p>
        </div>
        <div className="validatorTable" role="table" aria-label="Live validator roles">
          <div className="validatorRow validatorHead" role="row"><span>Location</span><span>Role</span><span>Height</span><span>Status</span></div>
          {validatorRows.length ? validatorRows.map((validator) => {
            const lag = Math.max(0, Number(status.height || 0) - Number(validator.latestHeight || 0));
            const current = validator.peerReady && lag <= 5;
            return (
              <div className="validatorRow" role="row" key={validator.address}>
                <span><strong>{validator.moniker?.replace("ynx-", "") || validator.address}</strong><small>{validator.address}</small></span>
                <span>{validator.role}</span><span>{formatNumber(validator.latestHeight)}</span>
                <span className={current ? "ready" : "pending"}><i />{current ? "Current" : lag > 0 ? `${formatNumber(lag)} behind` : "Pending"}</span>
              </div>
            );
          }) : <div className="tableEmpty">{validators.error || "Connecting to validator API"}</div>}
        </div>
      </section>

      <section className="ecosystemSection" id="ecosystem" aria-labelledby="ecosystem-title" data-reveal>
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">Full-stack ecosystem</p><h2 id="ecosystem-title">One chain, connected operational surfaces</h2></div>
          <p>Runtime, economics, services, evidence, and integration tooling share the same YNX Testnet identity.</p>
        </div>
        <div className="productGrid">
          <ProductPanel icon={<Layers3 />} title="L1 Runtime" text="Persistent chain state, RPC, EVM RPC, transactions, receipts, logs, balances, and four-role replication." status="live" href={`${apiConfig.apiBase}/status`} />
          <ProductPanel icon={<Coins />} title="YNXT Economy" text="Native gas and resource asset with no hidden direct-freeze hook in the current runtime." status="live" href="/testnet" />
          <ProductPanel icon={<Search />} title="Indexer + Explorer" text="Live blocks, transactions, accounts, validators, search, SSE updates, and network evidence." status="live" href={apiConfig.explorerUrl} />
          <ProductPanel icon={<Bot />} title="AI Gateway" text="Session and permission architecture with policy-bounded action proposal, approval, and audit." status={serviceState("ai")} href="/ai" />
          <ProductPanel icon={<CircleDollarSign />} title="Pay API" text="Merchant-bound intents, invoices, idempotency, webhook signing, refunds, and event records." status={serviceState("pay")} href="https://pay.ynxweb4.com/health" />
          <ProductPanel icon={<ShieldCheck />} title="Trust + Chain Law" text="Evidence-bound tracing, advisory labels, request validity, appeals, corrections, and transparency." status={serviceState("trust")} href="https://trust.ynxweb4.com/health" />
          <ProductPanel icon={<Gauge />} title="Resource Market" text="Policy-bound quotes, delegation, rental settlement, provider income, and analytics." status={serviceState("resource")} href="https://resource.ynxweb4.com/health" />
          <ProductPanel icon={<Braces />} title="Developer SDKs" text="Dependency-free JavaScript and Python clients verified against the live REST and EVM endpoints." status="live" href="/docs" />
          <ProductPanel icon={<WalletCards />} title="YNX-native Identity" text="ynx1 is the default account identity across first-party YNX surfaces. The equivalent 0x value is confined to the EVM compatibility adapter." status="live" href="/#address" />
          <ProductPanel icon={<Landmark />} title="Exchange Integration Candidate" text="Public-testnet signed transaction broadcast, nonce, block, history, receipt, and log flows are verified. No exchange listing is claimed." status="live" href={apiConfig.exchangeUrl} />
        </div>
      </section>

      <section className="developerSection" id="developers" aria-labelledby="developers-title" data-reveal>
        <div className="developerCopy">
          <p className="sectionEyebrow">Developer surface</p><h2 id="developers-title">Connect to real endpoints.</h2>
          <p>Chain identity and network state come from the live public testnet. SDK checks verify REST and EVM heights without submitting transactions.</p>
          <a className="textLink" href="/docs">Open developer docs <Code2 size={17} /></a>
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
          <div><p className="sectionEyebrow">Readiness without overclaiming</p><h2 id="readiness-title">Current state and target state stay separate.</h2></div>
        </div>
        <div className="readinessColumns">
          <div><h3><CheckCircle2 /> Verified now</h3><ul><li>Public YNX Testnet on chain ID 6423</li><li>Four remotely deployed validator roles</li><li>Live RPC, EVM, Faucet, Indexer and Explorer</li><li>YNX-native ynx1 identity with an isolated EVM adapter</li><li>Signed transaction and exchange-candidate RPC flows</li><li>AI action, Pay, Trust, Resource and governance surfaces</li><li>Checksummed releases, backup and rollback tooling</li></ul></div>
          <div><h3><Clock3 /> Still required</h3><ul><li>YNX native wallet production release and custody handover</li><li>Public CometBFT voting and cutover proof</li><li>Independent public-vantage evidence</li><li>External security audit and mainnet legal review</li><li>External wallet, exchange, issuer and bridge approvals</li></ul></div>
          <div className="claimBoundary"><Scale size={28} /><h3>No fake claims</h3><p>This project does not claim mainnet launch, exchange listing, stablecoin issuer support, wallet default support, or third-party partnerships.</p><a href="/readiness">Read full boundaries</a></div>
        </div>
      </section>

      <section className="resourceSection" aria-labelledby="resources-title" data-reveal>
        <div className="sectionHeader"><div><p className="sectionEyebrow">Start building</p><h2 id="resources-title">Public entry points</h2></div></div>
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

async function addNetwork() {
  if (!window.ethereum) return window.alert("No EIP-1193 wallet detected.");
  await window.ethereum.request({ method: "wallet_addEthereumChain", params: [networkParams()] });
}

function formatNumber(value) { return Number.isFinite(Number(value)) ? new Intl.NumberFormat("en-US").format(Number(value)) : undefined; }
function formatTime(value) { return value ? new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)) : "now"; }
function shortRelease(value) { return value.startsWith("ynx-chain-") ? value.replace("ynx-chain-", "") : value; }

createRoot(document.getElementById("root")).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
