import React from "react";
import { ArrowUpRight, CheckCircle2, CircleAlert, FileJson2 } from "lucide-react";
import { ECONOMIC_PAGES, economicEvidence } from "../lib/economicsEvidence.js";

const routeLabels = {
  "/ynxt": "YNXT", "/supply": "Supply", "/burn": "Burn", "/staking": "Staking",
  "/stablecoin": "Stablecoin", "/treasury": "Treasury", "/solvency": "Solvency",
  "/liquidity": "Liquidity", "/fees": "Fees", "/whitepaper": "Whitepaper"
};

export function EconomicPage({ path }) {
  const page = ECONOMIC_PAGES[path];
  if (!page) return null;
  const evidence = page.topic === "identity" ? economicEvidence.identity : economicEvidence.indicators[page.topic];
  const verified = evidence?.state === "verified";

  return <main className="economicPage" id="main-content">
    <nav className="economicNav" aria-label="YNX economics and evidence">
      {Object.keys(ECONOMIC_PAGES).map((href) => <a key={href} href={href} aria-current={href === path ? "page" : undefined}>{routeLabels[href]}</a>)}
    </nav>
    <section className="economicHero">
      <div>
        <p className="sectionEyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
      </div>
      <aside className={`economicState ${verified ? "verified" : "unavailable"}`} aria-label="Evidence state">
        {verified ? <CheckCircle2 /> : <CircleAlert />}
        <span>Evidence state</span>
        <strong>{evidence?.state || "unavailable"}</strong>
        <small>{evidence?.coverage || "none"}</small>
      </aside>
    </section>
    <section className="economicIdentity" aria-labelledby="economic-identity-title">
      <header><p className="sectionEyebrow">Verified network identity</p><h2 id="economic-identity-title">The facts every economic claim must bind to.</h2></header>
      <div><span>Network</span><strong>{economicEvidence.identity.network}</strong></div>
      <div><span>Chain ID</span><strong>{economicEvidence.identity.chainId}</strong></div>
      <div><span>EVM chain ID</span><strong>{economicEvidence.identity.evmChainId}</strong></div>
      <div><span>Native Testnet asset</span><strong>{economicEvidence.identity.nativeAsset}</strong></div>
    </section>
    <section className="economicEvidence" aria-labelledby="economic-evidence-title">
      <div>
        <p className="sectionEyebrow">Machine-readable contract</p>
        <h2 id="economic-evidence-title">Every value needs source, time, version, and coverage.</h2>
        <p>{evidence?.error || "Network identity is verified by the canonical YNX 6423 configuration."}</p>
        <a className="button secondary" href="/api/economics/evidence"><FileJson2 /> Open economic evidence JSON</a>
      </div>
      <dl>
        <div><dt>source</dt><dd>{evidence?.source || "unavailable"}</dd></div>
        <div><dt>asOf</dt><dd>{evidence?.asOf || "unavailable"}</dd></div>
        <div><dt>version</dt><dd>{evidence?.version}</dd></div>
        <div><dt>coverage</dt><dd>{evidence?.coverage}</dd></div>
        <div><dt>state</dt><dd>{evidence?.state}</dd></div>
        <div><dt>error</dt><dd>{evidence?.error || "none"}</dd></div>
      </dl>
    </section>
    <section className="economicBoundaries" aria-labelledby="economic-boundaries-title">
      <p className="sectionEyebrow">Claim boundary</p><h2 id="economic-boundaries-title">What this page does and does not prove.</h2>
      <ul>{page.boundaries.map((boundary) => <li key={boundary}><CheckCircle2 />{boundary}</li>)}</ul>
      {page.actions.length > 0 && <div className="economicActions">{page.actions.map(([label, href]) => <a key={label} className="button primary" href={href}>{label}<ArrowUpRight /></a>)}</div>}
    </section>
  </main>;
}
