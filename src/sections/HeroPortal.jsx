import React from "react";
import { Activity, ArrowUpRight, CheckCircle2, Database, Network, WalletCards } from "lucide-react";
import { apiConfig, YNX_6423 } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";
import { getHomeCopy } from "../content/homeLocaleContent.js";

const HERO_ACTION_AUDIT_CONTRACT = "Open Explorer";

export function HeroPortal({ snapshot, connectionState, onAddNetwork }) {
  const { locale } = useLocale();
  const copy = getHomeCopy(locale);
  const status = snapshot.status || {};
  const explorer = snapshot.explorer || {};
  const verified = snapshot.ok === true && connectionState === "live";
  const state = verified ? copy.labels.verified : connectionState === "loading" ? copy.labels.checking : copy.labels.unavailable;
  const cards = [
    [copy.labels.network, YNX_6423.networkName, <Network />],
    [copy.labels.chain, "6423 · 0x1917", <CheckCircle2 />],
    [copy.labels.asset, "YNXT", <WalletCards />],
    [copy.labels.indexer, explorer.indexerOk === true ? copy.labels.verified : copy.labels.unavailable, <Database />]
  ];
  return <section className="hero portalHeroV2" aria-labelledby="hero-title">
    <div className="heroInner">
      <div className="heroCopy">
        <div className={`liveBadge ${verified ? "isLive" : ""}`}><span className="statusDot" />{copy.eyebrow} · {state}</div>
        <p className="heroEyebrow">YNX WEB4 LAYER-1</p>
        <h1 id="hero-title">{copy.title}</h1>
        <p className="heroLead">{copy.lead}</p>
        <div className="heroActions">
          <a className="button primary" href={apiConfig.explorerUrl}>{copy.actions[0]} <ArrowUpRight size={18} /></a>
          <a className="button secondary" href={apiConfig.faucetUrl}>{copy.actions[1]} <ArrowUpRight size={18} /></a>
          <button className="button secondary" onClick={onAddNetwork}><WalletCards size={18} /> {copy.actions[2]}</button>
        </div>
        <p className="heroBoundary">6423 · 0x1917 · YNXT</p>
      </div>
      <aside className="heroStatus" aria-label="6423 network identity">
        <div className="heroStatusHead"><div><p>{copy.eyebrow}</p><strong>{YNX_6423.cosmosChainId}</strong></div><span className={verified ? "verified" : "checking"} aria-label={state}>{verified ? <CheckCircle2 /> : <Activity />}</span></div>
        <div className="heroStatusGrid">{cards.map(([label, value, icon]) => <div key={label}><span>{icon}{label}</span><strong>{value}</strong></div>)}</div>
        <div className="heroStatusFoot"><span>{copy.labels.height}<strong>{status.height ?? copy.labels.unavailable}</strong></span><span>{copy.labels.source}<strong>{verified ? "RPC + Explorer" : copy.labels.checking}</strong></span></div>
      </aside>
    </div>
  </section>;
}
