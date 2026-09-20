import React, { Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowUpRight, ChevronDown, Bot, Box, Braces, CheckCircle2, CircleDollarSign, Clock3, Code2, Coins,
  Database, Gauge, Landmark, Layers3, Network, Scale, Search, ShieldCheck, WalletCards
} from "lucide-react";
import { apiConfig, loadNetworkSnapshot, loadServiceHealth } from "./lib/api/ynxApi.js";
import { WalletDownload } from "./components/WalletDownload.jsx";
import { HeroPortal } from "./sections/HeroPortal.jsx";
import { StatusCard } from "./components/StatusCard.jsx";
import { ProductPanel } from "./components/ProductPanel.jsx";
import { LinkGrid } from "./components/LinkGrid.jsx";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";
import { AddressConverter } from "./components/AddressConverter.jsx";
import { LatestRecords } from "./components/LatestRecords.jsx";
import { LocaleProvider, useLocale } from "./lib/i18n.jsx";
import { getRuntimeCopy } from "./content/runtimeLocaleContent.js";
import { resolveRuntimeCopy, getRuntimeLoadingNotice } from "./lib/runtimeCopyRecovery.js";
import { PageErrorBoundary } from "./components/PageErrorBoundary.jsx";
import { getHomeCopy } from "./content/homeLocaleContent.js";
import { getHomeRedesignCopy } from "./content/homeRedesignContent.js";
import { getHomeEntryCopy } from "./content/homeEntryContent.js";
import { HomeCommunity } from "./components/HomeCommunity.jsx";
import { getContactCopy } from "./content/contactLocaleContent.js";
import "./pages/ContactPage.css";
import "./components/RuntimeLanguageNotice.css";
import "./styles.css";
import "./redesign.css";

const HomeExperience = lazyNamed(() => import("./components/HomeExperience.jsx"), "HomeExperience");

const route = window.location.pathname.replace(/\/$/, "") || "/";
const RoutedContent = lazyNamed(() => import("./pages/RoutedContent.jsx"), "RoutedContent");

function App() {
  const { locale, t } = useLocale();
  const [copy, setCopy] = useState(() => getRuntimeCopy(locale));
  const [copyLoadFailed, setCopyLoadFailed] = useState(false);
  const [snapshot, setSnapshot] = useState({ status: {}, summary: {}, validators: {}, evm: {} });
  const [services, setServices] = useState({});
  const [connectionState, setConnectionState] = useState("loading");
  const [heightMoved, setHeightMoved] = useState(false);
  const [networkExpanded, setNetworkExpanded] = useState(false);
  const [ecosystemExpanded, setEcosystemExpanded] = useState(false);
  const [networkRequest, setNetworkRequest] = useState(0);

  useEffect(() => {
    let active = true;
    setCopyLoadFailed(false);
    const immediate = getRuntimeCopy(locale);
    if (immediate) setCopy(immediate);
    else {
      setCopy(null);
      resolveRuntimeCopy(locale).then(({ copy: next, failed }) => {
        if (active) { setCopy(next); setCopyLoadFailed(failed); }
      });
    }
    return () => { active = false; };
  }, [locale]);

  useEffect(() => {
    if (route !== "/") return;
    let active = true;
    let inFlight = false;
    let previousHeight = 0;
    let networkTimer = 0;
    let lastServiceCheck = 0;
    const refresh = async () => {
      const next = await loadNetworkSnapshot({ detailed: networkExpanded });
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
      if (!active || document.hidden || inFlight) return;
      inFlight = true;
      try {
      await refresh();
      if (active && ecosystemExpanded && Date.now() - lastServiceCheck >= 120000) await refreshServices();
      } finally { inFlight = false; }
      if (active && !document.hidden) networkTimer = window.setTimeout(cycle, networkExpanded ? 15000 : 60000);
    };
    const onVisibility = () => {
      window.clearTimeout(networkTimer);
      if (!document.hidden) networkTimer = window.setTimeout(cycle, 1000);
    };
    networkTimer = window.setTimeout(cycle, 1200);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      window.clearTimeout(networkTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [networkExpanded, ecosystemExpanded]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("isVisible");
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -36px" });
    const reveal = () => document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    const frame = window.requestAnimationFrame(reveal);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [copy]);

  useEffect(() => {
    const revealHashTarget = (hash = window.location.hash) => {
      const target = document.getElementById(hash.slice(1));
      const disclosure = target?.closest("details");
      if (!disclosure) return;
      disclosure.open = true;
      window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    const onHashChange = () => revealHashTarget();
    const onHashLink = (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash) revealHashTarget(url.hash);
    };
    revealHashTarget();
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onHashLink);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onHashLink);
    };
  }, [copy]);

  if (!copy) return <main className="routeLoading" aria-busy="true" aria-live="polite"><span className="routeLoadingMark" aria-hidden="true" /><p>…</p></main>;

  const loadingNotice = getRuntimeLoadingNotice(locale);
  const languageNotice = copyLoadFailed ? <aside className="runtimeLanguageNotice" role="status"><p>{loadingNotice[0]}</p><button type="button" className="button secondary" onClick={() => window.location.reload()}>{loadingNotice[1]}</button></aside> : null;

  if (route !== "/") {
    const page = <RoutedContent route={route} copy={copy} />;
    return <><SiteHeader /><div id="main-content" tabIndex={-1}>{languageNotice}<Suspense fallback={<RouteLoading copy={copy.utility.loading} />}>{page}</Suspense></div><SiteFooter /></>;
  }

  const design = getHomeRedesignCopy(locale);
  const { status = {}, summary = {}, validators = {}, evm = {} } = snapshot;
  const validatorRows = Array.isArray(validators.validators) ? validators.validators : [];
  const buildRelease = status.build?.release || t("checking");
  const serviceState = (name) => services[name]?.ok === true ? "live" : services[name]?.error ? "status unavailable" : "checking";

  return (
    <>
      <SiteHeader networkRequest={networkRequest} />
      <main id="main-content" tabIndex={-1}>
      {languageNotice}
      <HeroPortal snapshot={snapshot} connectionState={connectionState} onAddNetwork={() => setNetworkRequest((request) => request + 1)} />

      <section className="ecosystemSection editorialEcosystem" id="ecosystem" aria-labelledby="ecosystem-title">
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">{design.ecosystemEyebrow}</p><h2 id="ecosystem-title">{design.ecosystemTitle}</h2><p className="sectionIntro">{design.ecosystemLead}</p></div>
          <a className="textLink" href="/dapp">{design.ecosystemAll}<ArrowUpRight size={18} /></a>
        </div>
        <div className="ecosystemRows">{design.ecosystemItems.map((item, index) => {
          const Icon = [WalletCards, Search, Coins, Layers3][index];
          if (index === 0) return <div className="ecosystemRow walletEcosystemRow" key={item.title}><span className="ecosystemNumber">01</span><Icon className="ecosystemIcon" strokeWidth={1.5}/><h3><a href="/dapp/wallet">{item.title}</a></h3><p>{item.description}</p><WalletDownload className="ecosystemRowAction" label={design.download}/></div>;
          return <a className="ecosystemRow" href={["/dapp/wallet", apiConfig.explorerUrl, apiConfig.faucetUrl, "/dapp"][index]} key={item.title}>
            <span className="ecosystemNumber">0{index + 1}</span><Icon className="ecosystemIcon" strokeWidth={1.5}/><h3>{item.title}</h3><p>{item.description}</p><span className="ecosystemRowAction">{item.action}<ArrowUpRight size={20} /></span>
          </a>;
        })}</div>
        <details className="homeDisclosure ecosystemDirectory" onToggle={event => setEcosystemExpanded(event.currentTarget.open)}><summary>{copy.ecosystem.title}<ChevronDown size={20}/></summary>
        <div className="productGrid">
          {[Layers3, Coins, Search, Bot, CircleDollarSign, ShieldCheck, Gauge, Braces, WalletCards, Landmark].map((Icon, index) => <ProductPanel key={copy.ecosystem.products[index].title} icon={<Icon />} {...copy.ecosystem.products[index]} status={index === 3 ? serviceState("ai") : index === 4 ? serviceState("pay") : index === 5 ? serviceState("trust") : index === 6 ? serviceState("resource") : index < 3 ? (snapshot.ok === true ? "live" : connectionState === "loading" ? "checking" : "status unavailable") : "reference"} href={[`${apiConfig.apiBase}/status`, "/testnet", apiConfig.explorerUrl, "/dapp/ai", "/dapp/pay", "/dapp/trust", "/dapp/resource", "/docs", "/#address", apiConfig.exchangeUrl][index]} />)}
        </div>
        </details>
      </section>

      <Suspense fallback={<div className="experienceLoading" aria-busy="true" />}><HomeExperience /></Suspense>

      <section className="developerSection editorialDeveloper" id="developers" aria-labelledby="developers-title" data-reveal>
        <div className="developerCopy">
          <p className="sectionEyebrow">{design.developerEyebrow}</p><h2 id="developers-title">{design.developerTitle}</h2>
          <p>{getHomeEntryCopy(locale).developerLead}</p>
          <a className="textLink" href="/docs">{design.developerAction} <Code2 size={17} /></a>
        </div>
        <div className="endpointList">
          <Endpoint label="REST RPC" value={apiConfig.apiBase} copy={design.endpointCopy} />
          <Endpoint label="EVM JSON-RPC" value={apiConfig.evmRpc} copy={design.endpointCopy} />
          <Endpoint label="Explorer" value={apiConfig.explorerUrl} copy={design.endpointCopy} />
          <Endpoint label={getHomeCopy(locale).labels.chain} value="6423 / 0x1917" copy={design.endpointCopy} />
        </div>
      </section>

      <div className="homeDetailGroup">
      <details className="homeDisclosure networkDisclosure" id="network" onToggle={event => setNetworkExpanded(event.currentTarget.open)}><summary><span>{design.networkDetails}<small>{design.networkLead}</small></span><ChevronDown size={22}/></summary>
      <section className="networkBand" aria-labelledby="network-title">
        <div className="sectionHeader compact">
          <div><p className="sectionEyebrow">{copy.network.eyebrow}</p><h2 id="network-title">{copy.network.title}</h2></div>
          <div className={`connection ${connectionState}`}><span />{connectionState === "live" ? `${copy.network.updated} ${formatTime(snapshot.checkedAt, locale, copy.utility.now)}` : t(connectionState === "loading" ? "checking" : "unavailable")}</div>
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

      <section className="validatorSection" aria-labelledby="validators-title">
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
                <span>{validator.role}</span><span data-label={copy.validators.headers[2]}>{formatNumber(validator.latestHeight, locale)}</span>
                <span className={current ? "ready" : "pending"}><i />{current ? copy.validators.current : lag > 0 ? `${formatNumber(lag, locale)} ${copy.validators.behind}` : copy.validators.pending}</span>
              </div>
            );
          }) : <div className="tableEmpty">{validators.error ? copy.validators.unavailable : copy.validators.connecting}</div>}
        </div>
      </section>

      <LatestRecords snapshot={snapshot} copy={copy.records} />

      </details>
      <details className="homeDisclosure" id="address-tools"><summary>{design.addressDetails}<ChevronDown size={22}/></summary><AddressConverter /></details>
      <details className="homeDisclosure" id="readiness"><summary>{design.readinessDetails}<ChevronDown size={22}/></summary>

      <section className="readinessSection" aria-labelledby="readiness-title">
        <div className="sectionHeader">
          <div><p className="sectionEyebrow">{copy.readiness.eyebrow}</p><h2 id="readiness-title">{copy.readiness.title}</h2></div>
        </div>
        <div className="readinessColumns">
          <div><h3><CheckCircle2 /> {design.readinessScopeTitle}</h3><ul>{design.readinessScope.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3><Clock3 /> {copy.readiness.requiredTitle}</h3><ul>{copy.readiness.required.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="claimBoundary"><Scale size={28} /><h3>{copy.readiness.boundaryTitle}</h3><p>{copy.readiness.boundary}</p><a href="/readiness">{copy.readiness.action}</a></div>
        </div>
      </section>

      </details>
      </div>
      <section className="resourceSection" aria-labelledby="resources-title" data-reveal>
        <div className="sectionHeader"><div><p className="sectionEyebrow">{design.developerAction}</p><h2 id="resources-title">{design.resourcesTitle}</h2></div></div>
        <nav className="homeManualLinks" aria-label={getContactCopy(locale).docs}>{["manual", "api", "docs", "whitepaper"].map(key => <a key={key} href={`/${key}?lang=${encodeURIComponent(locale)}`}>{getContactCopy(locale)[key]}<ArrowUpRight size={18}/></a>)}</nav>
        <LinkGrid />
      </section>
      <HomeCommunity />
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


function formatNumber(value, locale = "en") { return Number.isFinite(Number(value)) ? new Intl.NumberFormat(locale).format(Number(value)) : undefined; }
function formatTime(value, locale = "en", now = "now") { return value ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)) : now; }
function shortRelease(value) { return value.startsWith("ynx-chain-") ? value.replace("ynx-chain-", "") : value; }

const applicationRoot = import.meta.hot?.data.applicationRoot || createRoot(document.getElementById("root"));
if (import.meta.hot) { import.meta.hot.data.applicationRoot = applicationRoot; import.meta.hot.accept(); }
applicationRoot.render(<PageErrorBoundary><LocaleProvider><App /></LocaleProvider></PageErrorBoundary>);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
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
