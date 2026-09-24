import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clipboard, Database, ExternalLink, FileWarning, Network, Search, ShieldCheck, WalletCards } from "lucide-react";
import { apiConfig, loadNetworkSnapshot, YNX_6423 } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";
import { getPortalCopy, PORTAL_COPY } from "../content/coreLocaleContent.js";
import { getNetworkMetricCopy } from "../content/networkMetricCopy.js";
import { collectBrowserProgression } from "../lib/blockProgression.js";

const external = (label, href) => ({ label, href, external: /^https?:/.test(href) });

const actionDestinations = {
  "/blockchain": [apiConfig.explorerUrl, apiConfig.monitorUrl],
  "/tokens": [`${apiConfig.explorerUrl}/token/YNXT`, apiConfig.faucetUrl],
  "/data": [apiConfig.monitorUrl, apiConfig.explorerUrl],
  "/governance": ["https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs", "/docs"],
  "/ecosystem": ["/dapp", "/status"],
  "/developers": ["/docs", "https://github.com/JiahaoAlbus/YNX-Chain"],
  "/downloads": ["/dapp/download", "/manual"],
  "/more": ["/whitepaper", "https://github.com/JiahaoAlbus/YNX-Chain", "https://discord.gg/t8KpAF2KE"],
};

const pages = Object.fromEntries(Object.keys(actionDestinations).map((path) => [path, {
  ...PORTAL_COPY.en[path],
  actions: PORTAL_COPY.en[path].actions.map((label, index) => external(label, actionDestinations[path][index])),
}]));

export const portalRoutes = new Set(Object.keys(pages));

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return <button type="button" className="copyMini" onClick={async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }} aria-label={`Copy ${value}`}>{copied ? <CheckCircle2 /> : <Clipboard />}</button>;
}

export function PortalPage({ path }) {
  const { locale, t } = useLocale();
  const originalPage = pages[path];
  const localizedPage = getPortalCopy(locale, path);
  const page = localizedPage ? { ...localizedPage, actions: originalPage.actions } : null;
  const [network, setNetwork] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const requestToken = useRef(0);
  const refreshNetwork = async () => {
    const token = ++requestToken.current;
    setRefreshing(true);
    setNetwork({});
    try {
      await collectBrowserProgression({
        fetchSnapshot: loadNetworkSnapshot,
        publish: snapshot => { if (requestToken.current === token) setNetwork(snapshot); },
        isActive: () => requestToken.current === token,
      });
    } catch { if (requestToken.current === token) setNetwork({ error: "Network snapshot unavailable" }); }
    finally { if (requestToken.current === token) setRefreshing(false); }
  };
  useEffect(() => { void refreshNetwork(); return () => { requestToken.current++; }; }, []);
  const health = useMemo(() => network.ok === true ? t("verified") : network.degraded ? t("degraded") : network.error ? t("unavailable") : t("checking"), [network, t]);
  if (!page) return null;
  const metrics = getNetworkMetricCopy(locale);
  const observations = network.observations || {};
  const collection = (duration, state) => state === "timeout" ? metrics.timeout : state === "ok" && Number.isFinite(duration) ? `${duration} ms` : t("unavailable");
  const blockAge = Number.isFinite(observations.blockAgeMs) ? `${Math.round(observations.blockAgeMs / 1000)} s` : t("unavailable");
  const rpcRead = collection(observations.rpcCollectionMs, observations.rpcReadState);
  const explorerRead = collection(observations.explorerCollectionMs, observations.explorerReadState);
  const evmRead = collection(observations.evmCollectionMs, observations.evmReadState);
  const lag = Number.isSafeInteger(network.indexerLagBlocks) ? `${network.indexerLagBlocks} ${metrics.blocks}` : t("unavailable");
  const growth = observations.progressionState === "observed" ? `${metrics.observed} (${observations.progressionFromHeight} → ${observations.progressionToHeight})` : observations.progressionState === "not_observed" ? metrics.notObserved : refreshing ? metrics.refreshing : metrics.unverified;
  const config = [
    ["Cosmos", YNX_6423.cosmosChainId], ["EVM", YNX_6423.evmChainId], ["RPC", apiConfig.apiBase], ["Explorer", apiConfig.explorerUrl]
  ];
  return <main className="portalPage" id="main-content">
    <section className="portalHero"><p className="sectionEyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.lead}</p><div className="portalActions">{page.actions.map((action, index) => <a className="button primary" key={action.label} href={action.href}>{localizedPage?.actions?.[index] || action.label}{action.external && <ExternalLink size={16} />}{!action.external && <ArrowUpRight size={16} />}</a>)}</div></section>
    <section className="portalStatus" aria-label={t("currentNetworkVerification")}><div><span className={`statusPill ${network.ok === true ? "verified" : network.degraded ? "degraded" : network.error ? "unavailable" : "checking"}`}>{network.ok === true ? <ShieldCheck /> : <FileWarning />}{health}</span><h2>{t("current6423Verification")}</h2><p role="status">{network.error ? t("liveSourceUnavailable") : network.checkedAt ? `${t("checked")} ${new Date(network.checkedAt).toLocaleString(locale)}` : t("fetchingPublicServices")}</p><button type="button" className="portalRefresh" disabled={refreshing} onClick={() => { void refreshNetwork(); }}>{refreshing ? metrics.refreshing : metrics.refresh}</button></div><div className="portalLiveValues"><span data-chain-verified={network.chainVerified === true}><small>{t("rpcHeight")} · {network.chainVerified === true ? t("verified") : t("unavailable")}</small><strong>{network.chainVerified === true ? network.status?.height ?? t("unavailable") : t("unavailable")}</strong><small>{metrics.blockAge}: {blockAge}</small><small>{metrics.rpcRead}: {rpcRead}</small></span><span><small>{t("indexerHeight")}</small><strong>{network.explorer?.network?.chainId === 6423 && Number.isSafeInteger(network.explorer?.indexedHeight) ? network.explorer.indexedHeight : t("unavailable")}</strong><small>{metrics.lag}: {lag}</small><small>{metrics.explorerRead}: {explorerRead}</small></span><span data-indexer-verified={network.indexerVerified === true} data-progression-verified={network.progressionVerified === true}><small>{metrics.growth}{Number.isFinite(observations.progressionWindowMs) ? ` (${observations.progressionWindowMs / 1000} s)` : ""}</small><strong>{growth}</strong><small>{t("indexerState")}: {network.indexerVerified === true ? t("aligned") : t("unavailable")}</small><small>{metrics.evmRead}: {evmRead}</small></span></div></section>
    <section className="portalLayout"><article className="portalFacts"><h2>{t("whatThisMeans")}</h2><ul>{page.facts.map((fact) => <li key={fact}><CheckCircle2 />{fact}</li>)}</ul></article><aside className="portalConfig"><div className="portalConfigHead"><Network /><div><h2>{t("ynx6423Configuration")}</h2><p>{t("oneSharedConfig")}</p></div></div>{config.map(([label, value]) => <div className="portalConfigRow" key={label}><span>{label}</span><code>{value}</code><CopyButton value={value} /></div>)}</aside></section>
    {path === "/data" && <section className="unavailableChart"><div><Database /><h2>{t("historicalChartsUnavailable")}</h2><p>{t("historicalChartsBoundary")}</p></div><button type="button" disabled><Search />{t("rangeUnavailable")}</button></section>}
    {path === "/tokens" && <section className="ynxtCard"><WalletCards /><div><p className="sectionEyebrow">YNXT</p><h2>{t("ynxtUses")}</h2><p>{t("ynxtFaucetBoundary")}</p></div><a href={apiConfig.faucetUrl} className="button primary">{t("getTestnetYNXT")} <ExternalLink size={16} /></a></section>}
  </main>;
}
