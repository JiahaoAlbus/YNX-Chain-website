import React, { Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, Bot, Box, Braces, CheckCircle2, CircleDollarSign, Clock3, Code2, Coins,
  Database, Gauge, Landmark, Layers3, Network, Scale, Search, ShieldCheck, WalletCards
} from "lucide-react";
import { apiConfig, loadNetworkSnapshot, loadServiceHealth, networkParams } from "./lib/api/ynxApi.js";
import { HeroPortal } from "./sections/HeroPortal.jsx";
import { StatusCard } from "./components/StatusCard.jsx";
import { ProductPanel } from "./components/ProductPanel.jsx";
import { LinkGrid } from "./components/LinkGrid.jsx";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";
import { AddressConverter } from "./components/AddressConverter.jsx";
import { LatestRecords } from "./components/LatestRecords.jsx";
import { ECONOMIC_ROUTES } from "./lib/economicsEvidence.js";
import { getLegacyDAppRedirect, getProductRouteMatch } from "./lib/ecosystemCatalog.js";
import docsAuthority from "virtual:ynx-docs-authority";
import { LocaleProvider, useLocale } from "./lib/i18n.jsx";
import { getRuntimeCopy, loadRuntimeCopy } from "./content/runtimeLocaleContent.js";
import "./styles.css";

const route = window.location.pathname.replace(/\/$/, "") || "/";
const portalRoutes = new Set(["/blockchain", "/tokens", "/data", "/governance", "/developers", "/downloads", "/ecosystem", "/more"]);

const RoutePage = lazyNamed(() => import("./components/RoutePage.jsx"), "RoutePage");
const EconomicPage = lazyNamed(() => import("./pages/EconomicPage.jsx"), "EconomicPage");
const AppsPage = lazyNamed(() => import("./pages/AppsPage.jsx"), "AppsPage");
const DownloadPage = lazyNamed(() => import("./pages/DownloadPage.jsx"), "DownloadPage");
const DocsPage = lazyNamed(() => import("./pages/DocsPage.jsx"), "DocsPage");
const AuthorityArticlePage = lazyNamed(() => import("./pages/AuthorityArticlePage.jsx"), "AuthorityArticlePage");
const ProductStatusPage = lazyNamed(() => import("./pages/ProductStatusPage.jsx"), "ProductStatusPage");
const SquarePage = lazyNamed(() => import("./pages/SquarePage.jsx"), "SquarePage");
const ManualPage = lazyNamed(() => import("./pages/ManualPage.jsx"), "ManualPage");
const ApiPage = lazyNamed(() => import("./pages/ApiPage.jsx"), "ApiPage");
const FaucetPage = lazyNamed(() => import("./pages/FaucetPage.jsx"), "FaucetPage");
const WalletAuthCallbackPage = lazyNamed(() => import("./pages/WalletAuthCallbackPage.jsx"), "WalletAuthCallbackPage");
const PortalPage = lazyNamed(() => import("./pages/PortalPage.jsx"), "PortalPage");

function App() {
  const { locale } = useLocale();
  const [copy, setCopy] = useState(() => getRuntimeCopy(locale));
  const [snapshot, setSnapshot] = useState({ status: {}, summary: {}, validators: {}, evm: {} });
  const [services, setServices] = useState({});
  const [connectionState, setConnectionState] = useState("loading");
  const [heightMoved, setHeightMoved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let active = true;
    const immediate = getRuntimeCopy(locale);
    if (immediate) setCopy(immediate);
    else {
      setCopy(null);
      loadRuntimeCopy(locale).then((next) => { if (active) setCopy(next); });
    }
    return () => { active = false; };
  }, [locale]);

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

  if (!copy) return <main className="routeLoading" aria-busy="true" aria-live="polite"><span className="routeLoadingMark" aria-hidden="true" /><p>…</p></main>;

  if (route !== "/") {
    if (route === "/dapp/wallet/wallet-auth/callback") return <WalletAuthCallbackPage />;
    const legacyTarget = getLegacyRouteTarget(route);
    if (legacyTarget) {
      return <LegacyRouteRedirect target={legacyTarget} copy={copy.utility.moved} />;
    }
    let page = ECONOMIC_ROUTES.has(route) ? <EconomicPage path={route} /> : portalRoutes.has(route) ? <PortalPage path={route} /> : <RoutePage path={route} />;
    const productMatch = getProductRouteMatch(route);
    const authorityArticle = docsAuthority.articles.find((article) => article.route === route);
    if (productMatch) page = <ProductStatusPage product={productMatch.product} sectionId={productMatch.sectionId} article={authorityArticle} artifact={docsAuthority.artifact} />;
    else if (authorityArticle) page = <AuthorityArticlePage sourceArticle={authorityArticle} artifact={docsAuthority.artifact} />;
    if (route === "/dapp/download") page = <DownloadPage />;
    if (route === "/dapp") page = <AppsPage />;
    if (route === "/docs") page = <DocsPage />;
    if (route === "/manual") page = <ManualPage />;
    if (route === "/api") page = <ApiPage />;
    if (route === "/dapp/faucet") page = <FaucetPage />;
    if (route === "/dapp/square" || route.startsWith("/dapp/square/")) page = <SquarePage path={route} />;
    return <><SiteHeader scrollProgress={scrollProgress} /><div id="main-content" tabIndex={-1}><Suspense fallback={<RouteLoading copy={copy.utility.loading} />}>{page}</Suspense></div><SiteFooter /></>;
  }

  const { status = {}, summary = {}, validators = {}, evm = {} } = snapshot;
  const validatorRows = Array.isArray(validators.validators) ? validators.validators : [];
  const buildRelease = status.build?.release || "Awaiting live identity";
  const serviceState = (name) => services[name]?.ok === true ? "live" : services[name]?.error ? "status unavailable" : "checking";

  return (
    <>
      <SiteHeader scrollProgress={scrollProgress} />
      <main id="main-content" tabIndex={-1}>
      <HeroPortal snapshot={snapshot} connectionState={connectionState} onAddNetwork={() => addNetwork(copy.utility.noWallet)} />

      <section className="networkBand" id="network" aria-labelledby="network-title" data-reveal>
        <div className="sectionHeader compact">
          <div><p className="sectionEyebrow">{copy.network.eyebrow}</p><h2 id="network-title">{copy.network.title}</h2></div>
          <div className={`connection ${connectionState}`}><span />{connectionState === "live" ? `${copy.network.updated} ${formatTime(snapshot.checkedAt, locale, copy.utility.now)}` : connectionState}</div>
        </div>
        <div className="metricsGrid">
          <StatusCard icon={<Activity />} title={copy.network.metrics[0]} value={formatNumber(status.height, locale)} label={heightMoved ? copy.network.growing : copy.network.labels[0]} error={status.error} emphasis />
          <StatusCard icon={<Gauge />} title={copy.network.metrics[1]} value={evm.result} label={copy.network.labels[1]} error={evm.error} />
          <StatusCard icon={<Database />} title={copy.network.metrics[2]} value={formatNumber(summary.totalTransactions, locale)} label={copy.network.labels[2]} error={summary.error} />
          <StatusCard icon={<Network />} title={copy.network.metrics[3]} value={validators.validators?.length} label={copy.network.labels[3]} error={validators.error} />
          <StatusCard icon={<Coins />} title={copy.network.metrics[4]} value={status.nativeCurrencySymbol} label={copy.network.labels[4]} error={status.error} />
          <StatusCard icon={<Box />} title={copy.network.metrics[5]} value={shortRelease(buildRelease)} label={buildRelease} error={status.error} />
        </div>
      </section>

      <section className="validatorSection" aria-labelledby="validators-title" data-reveal>
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">{copy.validators.eyebrow}</p><h2 id="validators-title">{copy.validators.title}</h2></div>
          <p>{copy.validators.lead}</p>
        </div>
        <div className="validatorTable" role="table" aria-label={copy.validators.title}>
          <div className="validatorRow validatorHead" role="row">{copy.validators.headers.map((label) => <span key={label}>{label}</span>)}</div>
          {validatorRows.length ? validatorRows.map((validator) => {
            const lag = Math.max(0, Number(status.height || 0) - Number(validator.latestHeight || 0));
            const current = validator.peerReady && lag <= 5;
            return (
              <div className="validatorRow" role="row" key={validator.address}>
                <span><strong>{validator.moniker?.replace("ynx-", "") || validator.address}</strong><small>{validator.address}</small></span>
                <span>{validator.role}</span><span>{formatNumber(validator.latestHeight, locale)}</span>
                <span className={current ? "ready" : "pending"}><i />{current ? copy.validators.current : lag > 0 ? `${formatNumber(lag, locale)} ${copy.validators.behind}` : copy.validators.pending}</span>
              </div>
            );
          }) : <div className="tableEmpty">{validators.error ? copy.validators.unavailable : copy.validators.connecting}</div>}
        </div>
      </section>

      <LatestRecords snapshot={snapshot} copy={copy.records} />

      <section className="ecosystemSection" id="ecosystem" aria-labelledby="ecosystem-title" data-reveal>
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">{copy.ecosystem.eyebrow}</p><h2 id="ecosystem-title">{copy.ecosystem.title}</h2></div>
          <p>{copy.ecosystem.lead}</p>
        </div>
        <div className="productGrid">
          {[Layers3, Coins, Search, Bot, CircleDollarSign, ShieldCheck, Gauge, Braces, WalletCards, Landmark].map((Icon, index) => <ProductPanel key={copy.ecosystem.products[index].title} icon={<Icon />} {...copy.ecosystem.products[index]} status={index === 3 ? serviceState("ai") : index === 4 ? serviceState("pay") : index === 5 ? serviceState("trust") : index === 6 ? serviceState("resource") : "live"} href={[`${apiConfig.apiBase}/status`, "/testnet", apiConfig.explorerUrl, "/dapp/ai", "/dapp/pay", "/dapp/trust", "/dapp/resource", "/docs", "/#address", apiConfig.exchangeUrl][index]} />)}
        </div>
      </section>

      <section className="developerSection" id="developers" aria-labelledby="developers-title" data-reveal>
        <div className="developerCopy">
          <p className="sectionEyebrow">{copy.developer.eyebrow}</p><h2 id="developers-title">{copy.developer.title}</h2>
          <p>{copy.developer.lead}</p>
          <a className="textLink" href="/docs">{copy.developer.action} <Code2 size={17} /></a>
        </div>
        <div className="endpointList">
          <Endpoint label="REST RPC" value={apiConfig.apiBase} copy={copy.developer.copy} />
          <Endpoint label="EVM JSON-RPC" value={apiConfig.evmRpc} copy={copy.developer.copy} />
          <Endpoint label="Explorer" value={apiConfig.explorerUrl} copy={copy.developer.copy} />
          <Endpoint label="Chain ID" value="6423 / 0x1917" copy={copy.developer.copy} />
        </div>
      </section>

      <AddressConverter />

      <section className="readinessSection" id="readiness" aria-labelledby="readiness-title" data-reveal>
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">{copy.readiness.eyebrow}</p><h2 id="readiness-title">{copy.readiness.title}</h2></div>
        </div>
        <div className="readinessColumns">
          <div><h3><CheckCircle2 /> {copy.readiness.verifiedTitle}</h3><ul>{copy.readiness.verified.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3><Clock3 /> {copy.readiness.requiredTitle}</h3><ul>{copy.readiness.required.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="claimBoundary"><Scale size={28} /><h3>{copy.readiness.boundaryTitle}</h3><p>{copy.readiness.boundary}</p><a href="/readiness">{copy.readiness.action}</a></div>
        </div>
      </section>

      <section className="resourceSection" aria-labelledby="resources-title" data-reveal>
        <div className="sectionHeader"><div><p className="sectionEyebrow">{copy.readiness.resourcesEyebrow}</p><h2 id="resources-title">{copy.readiness.resourcesTitle}</h2></div></div>
        <LinkGrid />
      </section>
      </main>
      <SiteFooter />
    </>
  );
}

function lazyNamed(loader, exportName) {
  return lazy(() => loader().then((module) => ({ default: module[exportName] })));
}

function RouteLoading({ copy }) {
  return <main className="routeLoading" aria-busy="true" aria-live="polite"><span className="routeLoadingMark" aria-hidden="true" /><p>{copy}</p></main>;
}

function Endpoint({ label, value, copy: copyLabels }) {
  const [copyState, setCopyState] = useState("idle");
  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1400);
  };
  const copyLabel = copyState === "copied" ? copyLabels[1] : copyState === "failed" ? copyLabels[2] : `${copyLabels[0]} ${label}`;
  return <div className="endpoint"><span>{label}</span><code>{value}</code><button onClick={copyValue} aria-label={copyLabel} title={copyLabel}>{copyState === "copied" ? <CheckCircle2 size={17} /> : <Code2 size={17} />}</button></div>;
}

function getLegacyRouteTarget(path) {
  if (path === "/apps") return "/dapp";
  if (path === "/download") return "/dapp/download";
  if (path === "/square") return "/dapp/square";
  if (path.startsWith("/square/")) return `/dapp/square/${path.slice("/square/".length)}`;
  if (path === "/quant") return "/dapp/quant";
  if (path === "/faucet") return "/dapp/faucet";
  return getLegacyDAppRedirect(path);
}

function LegacyRouteRedirect({ target, copy: moved }) {
  const destination = `${target}${window.location.search}${window.location.hash}`;
  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);
  return (
    <main id="main-content" className="routePage">
      <div className="routeInner">
        <p className="sectionEyebrow">{moved[0]}</p>
        <h1>{moved[1]}</h1>
        <p className="routeLead">{moved[2]}</p>
        <a className="button primary" href={destination}>{moved[3]}</a>
      </div>
    </main>
  );
}

async function addNetwork(noWallet) {
  if (!window.ethereum) return window.alert(noWallet);
  await window.ethereum.request({ method: "wallet_addEthereumChain", params: [networkParams()] });
}

function formatNumber(value, locale = "en") { return Number.isFinite(Number(value)) ? new Intl.NumberFormat(locale).format(Number(value)) : undefined; }
function formatTime(value, locale = "en", now = "now") { return value ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)) : now; }
function shortRelease(value) { return value.startsWith("ynx-chain-") ? value.replace("ynx-chain-", "") : value; }

createRoot(document.getElementById("root")).render(<LocaleProvider><App /></LocaleProvider>);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    let refreshedForControllerUpdate = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshedForControllerUpdate) {
        refreshedForControllerUpdate = true;
        window.location.reload();
      }
    });
    navigator.serviceWorker.register("/sw.js").then((registration) => registration.update()).catch(() => {});
  });
}
