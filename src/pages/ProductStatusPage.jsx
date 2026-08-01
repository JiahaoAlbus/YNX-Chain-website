import React from "react";
import { ArrowUpRight, CheckCircle2, CircleDashed, Download, GitBranch, ShieldCheck } from "lucide-react";
import { DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS, STATUS_CONFIG } from "../lib/ecosystemCatalog.js";

const platformOrder = ["web", "android", "ios", "macos", "windows"];

function EvidenceState({ label, value, detail }) {
  return (
    <li className={value ? "confirmed" : "pending"}>
      {value ? <CheckCircle2 size={17} /> : <CircleDashed size={17} />}
      <span><strong>{label}</strong><small>{detail}</small></span>
    </li>
  );
}

function Surface({ platform, item }) {
  const state = PLATFORM_STATUS[item?.status] || PLATFORM_STATUS[PRODUCT_STATUS.NOT_READY];
  const canOpen = item?.href && (item.downloadHosted || item.status === PRODUCT_STATUS.LIVE);
  return (
    <li className={`productSurface ${item?.status || PRODUCT_STATUS.NOT_READY}`}>
      <span><strong>{DOWNLOAD_LABELS[platform]}</strong><small>{item?.note || "No verified release evidence."}</small></span>
      {canOpen ? <a href={item.href} rel={item.external ? "noopener" : undefined}>Open <ArrowUpRight size={14} /></a> : <em>{state.text}</em>}
    </li>
  );
}

export function ProductStatusPage({ product, article, artifact }) {
  const publicWeb = product.status === PRODUCT_STATUS.LIVE;
  const hasHostedDownload = Object.values(product.downloads || {}).some((item) => item.downloadHosted && item.href);
  const status = STATUS_CONFIG[product.status] || STATUS_CONFIG[PRODUCT_STATUS.NOT_READY];
  const publicEntry = product.publicEntry;
  const entryIsServiceHealth = publicEntry?.href?.includes("/health");
  const centralAccepted = product.release?.centralAccepted === true;

  return (
    <main className="productStatusPage">
      <header className="productStatusHero">
        <span className="productStatusIcon"><product.icon size={28} /></span>
        <div>
          <p className="sectionEyebrow">Independent YNX product</p>
          <h1>{product.name}</h1>
          <p>{product.detail}</p>
        </div>
        <span className={`appState ${status.tone}`}>{status.label}</span>
      </header>

      <section className="productStatusLayout">
        <div className="productStatusMain">
          <div className="productStatusSection">
            <div className="sectionHeader compact"><div><p className="sectionEyebrow">Current evidence</p><h2>What this status proves</h2></div></div>
            <ul className="productEvidenceList">
              <EvidenceState label="Candidate code" value={product.status !== PRODUCT_STATUS.NOT_READY} detail={`Audited source commit: ${product.release?.commit || "not registered"}`} />
              <EvidenceState label="Central acceptance" value={centralAccepted} detail={centralAccepted ? `Commit-bound ${product.release.productRelease?.release || "candidate"} product-release.json is published by this website.` : "No committed product-release.json was present during the central audit."} />
              <EvidenceState label="Public product surface" value={publicWeb} detail={publicWeb ? "A public web surface was remotely reachable during this audit." : "A health endpoint or local build does not prove a public product UI."} />
              <EvidenceState label="Hosted installer" value={hasHostedDownload} detail={hasHostedDownload ? "Immutable hosted artifact evidence is registered." : "No immutable artifact URL, hash, size, and install proof are registered."} />
              <EvidenceState label="Production signing / store release" value={false} detail="No owner production signature or app-store acceptance is claimed." />
            </ul>
          </div>

          <div className="productStatusSection">
            <div className="sectionHeader compact"><div><p className="sectionEyebrow">Platforms</p><h2>Install and access</h2></div></div>
            <ul className="productSurfaceList">
              {platformOrder.map((platform) => <Surface key={platform} platform={platform} item={product.downloads?.[platform]} />)}
            </ul>
          </div>
        </div>

        <aside className="productStatusAside">
          <div>
            <GitBranch size={18} />
            <span><small>Source commit</small><code>{product.release?.commit || "No audited commit"}</code></span>
          </div>
          <p>{product.release?.statusNote || "No product release record has been accepted."}</p>
          <a className="button primary" href={product.docs.href} rel={product.docs.external ? "noopener" : undefined}>Read product docs <ArrowUpRight size={16} /></a>
          {product.release?.productRelease?.href ? <a className="button secondary" href={product.release.productRelease.href}>Open release evidence <ArrowUpRight size={16} /></a> : null}
          {publicEntry?.href && (publicWeb || entryIsServiceHealth) ? <a className="button secondary" href={publicEntry.href} rel={publicEntry.external ? "noopener" : undefined}>{entryIsServiceHealth ? "Check service health" : publicEntry.label} <ArrowUpRight size={16} /></a> : null}
          <a className="textLink" href="/download"><Download size={16} /> Download center</a>
        </aside>
      </section>

      <aside className="evidenceBoundary">
        <ShieldCheck />
        <div><strong>Status is narrower than ambition.</strong><p>Candidate code, local packages, public APIs, hosted installers, production signing, and store acceptance are separate states.</p></div>
      </aside>

      {article && (
        <section className="productAuthority" aria-labelledby="product-authority-title">
          <header>
            <p className="sectionEyebrow">Evidence-linked public documentation</p>
            <h2 id="product-authority-title">{article.h1}</h2>
            <p>{article.description}</p>
            <small>Version {article.version} · reviewed {article.lastReviewed || article.effectiveDate || "in source"} · bundle <code>{artifact.sourceCommit.slice(0, 12)}</code></small>
          </header>
          <article className="authorityArticle" dangerouslySetInnerHTML={{ __html: article.html }} />
        </section>
      )}
    </main>
  );
}
