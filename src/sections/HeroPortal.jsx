import React from "react";
import { ArrowUpRight, ArrowDown, Plus } from "lucide-react";
import { YNX_6423 } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";
import { getHomeCopy } from "../content/homeLocaleContent.js";
import { getHomeRedesignCopy } from "../content/homeRedesignContent.js";
import { BrandScene } from "../components/BrandScene.jsx";
import { WalletDownload } from "../components/WalletDownload.jsx";

const HERO_ACTION_AUDIT_CONTRACT = "Open Explorer";

export function HeroPortal({ snapshot, connectionState, onAddNetwork }) {
  const { locale } = useLocale();
  const copy = getHomeCopy(locale);
  const design = getHomeRedesignCopy(locale);
  const titleParts = design.heroTitle.split(/(?<=[.，、,])\s*/u).filter(Boolean);
  const verified = snapshot.ok === true && connectionState === "live";
  const state = verified ? copy.labels.verified : connectionState === "loading" ? copy.labels.checking : copy.labels.unavailable;
  return <section className="hero portalHeroV2 editorialHero" aria-labelledby="hero-title">
    <div className="heroInner">
      <div className="heroCopy">
        <p className="heroEyebrow">YNX · WEB4 LAYER 1</p>
        <h1 id="hero-title">{titleParts.map((part, index) => <span className="heroTitleLine" key={index}>{part}{index < titleParts.length - 1 ? " " : ""}</span>)}</h1>
        <p className="heroLead">{design.heroLead}</p>
        <div className="heroActions">
          <WalletDownload className="button primary" label={design.download} />
          <a className="heroExplore" href="#ecosystem">{design.explore}<ArrowUpRight size={18} /></a>
        </div>
        <p className="heroBoundary">{design.testnetNote}</p>
      </div>
      <div className="heroArtwork"><BrandScene locale={locale} /></div>
    </div>
    <div className="heroNetworkLine">
      <a href="#network" className="heroNetworkState"><span className={`statusDot ${verified ? "isLive" : ""}`} />{copy.eyebrow}<span className="heroLiveLabel">{state}</span><ArrowDown size={15} /></a>
      <span className="heroChainId"><bdi>{YNX_6423.cosmosChainId}</bdi><span>6423 · YNXT</span></span>
      <button type="button" className="heroNetworkAction" onClick={onAddNetwork}>{copy.actions[2]}<Plus size={16} /></button>
    </div>
  </section>;
}
