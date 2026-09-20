import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clipboard, Database, ExternalLink, FileWarning, Network, Search, ShieldCheck, WalletCards } from "lucide-react";
import { apiConfig, loadNetworkSnapshot, YNX_6423 } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";
import { getPortalCopy, PORTAL_COPY } from "../content/coreLocaleContent.js";

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
